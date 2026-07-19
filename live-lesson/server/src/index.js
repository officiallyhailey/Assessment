// THE SERVER
//
// One file, the same as the class project: the connection, the helper
// functions, then the endpoints that use them.
//
// Every endpoint follows the same three steps:
//   1. get the input from the request   (req.body / req.params)
//   2. call a helper that does the work (await)
//   3. send a response                  (res.json / res.send)
//
// Run it:  npm start        from live-lesson/server

import express from "express";
import pg from "pg";
import config from "./config.js";

const db = new pg.Pool({
  connectionString: config.databaseUrl + "&uselibpqcompat=true",
  ssl: true,
});

const app = express();

// Reads incoming JSON bodies. WITHOUT THIS LINE req.body IS undefined.
app.use(express.json());

// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
//
// These talk to the database. Nothing in here knows about requests or
// responses: hand one some values, get data back.
// ---------------------------------------------------------------------------

// LESSON 3. Read every animal.
// ORDER BY id keeps them in a predictable order. Without it the database is
// free to return them however it likes, which usually looks fine and
// occasionally does not.
async function getAllAnimals() {
  const result = await db.query("SELECT * FROM lesson_animals ORDER BY id");

  return result.rows;
}

// LESSON 2. Save one animal and return it.
//
// $1 and $2 are placeholders. The values travel separately, in the array
// below, and the database never reads them as part of the command. Building
// the query by joining strings would let a value containing SQL run as SQL,
// which is called SQL injection.
//
// RETURNING * asks for the row that was just created, including the id the
// database generated for it.
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

// ---------------------------------------------------------------------------
// ENDPOINTS
// ---------------------------------------------------------------------------

// LESSON 3. GET all the animals.
//
// A GET asks for data and sends none, which is why there is no req.body here.
//
// The client asks for /api/get-all-animals and Vite strips the /api before it
// arrives, so this path has no prefix. See client/vite.config.js.
app.get("/get-all-animals", async (req, res) => {
  const animals = await getAllAnimals();

  res.json(animals);
});

// LESSON 2. POST a new animal.
//
// async because the database takes real time, and await is what makes the code
// wait for it. Without await the reply would be sent before the row was saved.
app.post("/add-one-animal", async (req, res) => {
  const { name, category, can_fly, lives_in } = req.body;

  const animal = await addOneAnimal(name, category, can_fly, lives_in);

  // Uses the name the database returned, not the one that arrived, so the
  // message reflects what was actually stored.
  res.send(`The farm has grown: ${animal.name} was added!`);
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
