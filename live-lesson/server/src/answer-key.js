// ANSWER KEY
//
// The finished code for each marked section.
//
// Working on topic 3 without having done topic 2? Paste the topic 2 block into
// index.js first. The React has to call an endpoint, so one has to exist.

// ███████████████████████████████████████████████████████████████████████████
//   TOPIC 2          server/src/index.js
// ███████████████████████████████████████████████████████████████████████████

// 1. Middleware runs on every request before any endpoint sees it. This one
//    turns a JSON body into an object and puts it on req.body.
app.use(express.json());

// 2. The helper that writes.
//
//    $1 and $2 are placeholders. The values travel separately, in the array
//    below, so the database never mistakes one for part of the command. Build
//    the query by gluing strings together and a value containing SQL would run
//    as SQL, which is how injection happens.
//
//    RETURNING * asks for the finished row back, including the id.
async function addOneAnimal(name, category, can_fly, lives_in) {
  const result = await db.query(
    `INSERT INTO lesson_animals
       (name, category, can_fly, lives_in)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, category, can_fly, lives_in],
  );

  return result.rows[0];
}

// 3. The POST endpoint. Read the input, do the work, send one reply.
//
//    async and await because the database takes real time. Without await the
//    reply would go out before the row was saved.
app.post("/add-one-animal", async (req, res) => {
  const { name, category, can_fly, lives_in } = req.body;

  const animal = await addOneAnimal(name, category, can_fly, lives_in);

  res.send(`The farm has grown: ${animal.name} was added!`);
});

// 4. The helper that reads. ORDER BY id because without it the database is
//    free to return rows in any order, which usually looks fine until it
//    does not.
async function getAllAnimals() {
  const result = await db.query("SELECT * FROM lesson_animals ORDER BY id");

  return result.rows;
}

// 5. The GET endpoint. res.json sends the array and sets the Content-Type
//    header, which is what lets response.json() read it at the other end.
//    res.send would send text, and the fetch would have to unpick it.
app.get("/get-all-animals", async (req, res) => {
  const animals = await getAllAnimals();

  res.json(animals);
});

// 
//   TOPIC 3          client/src/pages/AnimalList.jsx
//
// //   add import's to 
// 

function AnimalList() {
  // 2. State. Empty array to start, because the first draw happens before any
  //    data exists and map is quite happy running over nothing.
  const [animals, setAnimals] = useState([]);

  // 1. The helper. Two awaits, because there are two waits: one for the server
  //    to answer, and one to read the body of that answer.
  //    fetch on its own gives you a Response, not the data.
  const getAnimals = async () => {
    const response = await fetch("/api/get-all-animals");
    const data = await response.json();
    setAnimals(data);
  };

  // 3. Runs after the first draw, not during it. The empty array means once.
  //    Leave it off and storing the data causes another draw, which fetches
  //    again, and it never settles.
  useEffect(() => {
    getAnimals();
  }, []);

  // 4. key gives each item something stable to be recognised by between
  //    draws. The database id is perfect for it: unique, and it never
  //    changes.
  return (
    <ul>
      {animals.map((animal) => (
        <li key={animal.id}>
          <strong>{animal.name}</strong>, {animal.lives_in}
        </li>
      ))}
    </ul>
  );
}
