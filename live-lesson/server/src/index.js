// The server. Runs on port 3001.

import express from "express";
import pg from "pg";
import config from "./config.js";

// Puts the table back to the three animals it starts with, every restart. Comment this out if you want rows to survive one.
import "./seed.js";

const db = new pg.Pool({
  connectionString: config.databaseUrl + "&uselibpqcompat=true",
  ssl: true,
});

const app = express();

// ─── TOPIC 2 ──────────────────────────────────  table: lesson_animals
// Notes on each step are in answer-key.js.

// middleware: turns a JSON body into an object on req.body

app.use(express.json());

//
const port = 3001;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// post helper function: INSERT INTO, return the new row

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

// post api endpoint: /add-one-animal

app.post("/add-one-animal", async (req, res) => {
  const { name, category, can_fly, lives_in } = req.body;

  const animal = await addOneAnimal(name, category, can_fly, lives_in);

  res.send(`The farm has grown: ${animal.name} was added!`);
});

// Topic 3: get helper function: SELECT, return the rows

async function getAllAnimals() {
  const result = await db.query("SELECT * FROM lesson_animals ORDER BY id");

  return result.rows;
}

// Topic 3: get api endpoint: /get-all-animals

app.get("/get-all-animals", async (req, res) => {
  const animals = await getAllAnimals();

  res.json(animals);
});

// ──────────────────────────────────────────────────────────────────────

