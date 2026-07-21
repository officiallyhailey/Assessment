// ANSWER KEY
//
// The finished code for each section, with the notes.
//
// Every section below is a fold. Collapse them all with Cmd K then Cmd 0, and open just the one you want. The arrows are in the gutter.
//
// Starting on topic 3 without having done topic 2? Paste the topic 2 code into index.js first, so there is an endpoint for the fetch to call.

// #region  TOPIC 2  ·  middleware
/*
  Middleware runs on every request, before any endpoint sees it.

  This one reads a JSON request body and turns it into an object on req.body. Leave it out and req.body is undefined, which is the most common reason a POST looks like it does nothing.
*/
app.use(express.json());
// #endregion

// #region  TOPIC 2  ·  post helper function
/*
  The helper does the database work. It takes five plain values and knows nothing about requests or responses, which is why it could be called from anywhere.

  $1 and $2 are placeholders. The values travel separately, in the array below, so the database never mistakes one for part of the command. Glue the query together out of strings instead and a value containing SQL would run as SQL, which is how injection happens.

  RETURNING * asks for the finished row back, including the id the database generated, so the caller can see exactly what was stored.

  email is UNIQUE in the table, so a second client with an address already on file is refused: the INSERT throws, and the endpoint's error handling turns that into a 500.
*/
async function addOneClient(name, age, email, mood, first_visit) {
  const result = await db.query(
    `INSERT INTO client_form
       (name, age, email, mood, first_visit)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, age, email, mood, first_visit],
  );

  return result.rows[0];
}
// #endregion

// #region  TOPIC 2  ·  post api endpoint
/*
  Read the input, do the work, send one reply. Every endpoint is that shape.

  The five values arrive on req.body, which only works because of the middleware above.

  async and await because the database takes real time. Without await the reply would go out before the row was saved, and it would look like it worked right up until it did not.

  The message uses the name the database handed back rather than the one that came in, so it reflects what is actually stored.
*/
app.post("/add-one-client", async (req, res) => {
  const { name, age, email, mood, first_visit } = req.body;

  const client = await addOneClient(name, age, email, mood, first_visit);

  res.send(`${client.name} is checked in.`);
});
// #endregion

// #region  TOPIC 2  ·  get helper function
/*
  ORDER BY id because without it the database is free to hand rows back in any order it likes, which usually looks fine and occasionally does not.

  The rows sit on result.rows. Returning those rather than the whole result keeps the endpoint simple.
*/
async function getAllClients() {
  const result = await db.query("SELECT * FROM client_form ORDER BY id");

  return result.rows;
}
// #endregion

// #region  TOPIC 2  ·  get api endpoint
/*
  No req.body here: a GET sends no body, which is also why it needs no middleware.

  res.json sends the array and sets the Content-Type header, and that header is what lets response.json() read it at the other end. res.send would send plain text, and the fetch would have to unpick it by hand.
*/
app.get("/get-all-clients", async (req, res) => {
  const clients = await getAllClients();

  res.json(clients);
});
// #endregion

// #region  TOPIC 3  ·  state
/*
  The clients have to survive between draws. A plain variable would not: the component function runs again on every draw, so anything declared inside it is made fresh and whatever it held is gone.

  State survives, and changing it is also what asks React to draw again.

  It starts as an empty array so the list below has something to map over before any data exists. Start it as nothing and the first draw throws.
*/
const [clients, setClients] = useState([]);
// #endregion

// #region  TOPIC 3  ·  get helper function
/*
  Two awaits, because there are two waits.

  The first is the server answering, which hands back a Response describing the reply. That is not the data. The second reads the body of that response and turns it into a real array.

  Storing it is the line that puts anything on screen. Fetching alone changes nothing the page can see.

  The address starts with /api, which Vite forwards to port 3001 and strips on the way. See vite.config.js.
*/
const getClients = async () => {
  const response = await fetch("/api/get-all-clients");
  const data = await response.json();
  setClients(data);
};
// #endregion

// #region  TOPIC 3  ·  useEffect
/*
  Runs after the first draw rather than during it.

  Fetching in the body of the component would run mid draw, and storing the result would cause another draw, which would fetch again, and it would never settle.

  The empty array is the dependency list. Empty means run once. Leave it off entirely and you get exactly that endless loop, which is worth causing on purpose with the Network tab open.
*/
useEffect(() => {
  getClients();
}, []);
// #endregion

// #region  TOPIC 3  ·  the list
/*
  Everything returned is JSX. It reads like HTML and it is JavaScript, and the curly braces are the way back into JavaScript, which is why map sits inside them.

  key gives each item something stable to be recognised by between draws. The database id is ideal: nothing else shares it and it never changes. Using the position in the array breaks as soon as the list is reordered.

  Remember the component draws twice, once with the empty array and again once the data has arrived. In the Network tab the request shows up twice too, because React runs effects twice in development on purpose. A real build runs it once.
*/
return (
  <ul>
    {clients.map((client) => (
      <li key={client.id}>
        <strong>{client.name}</strong> — {client.mood}
        {client.first_visit ? ", first visit" : ""}
      </li>
    ))}
  </ul>
);
// #endregion
