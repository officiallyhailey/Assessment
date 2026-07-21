// The server. Runs on port 3001.

import express from "express";
import pg from "pg";
import config from "./config.js";

// Puts the table back to the three clients it starts with, every restart. Comment this out if you want rows to survive one.
import "./seed.js";

const db = new pg.Pool({
  connectionString: config.databaseUrl + "&uselibpqcompat=true",
  ssl: true,
});

const app = express();

// ─── TOPIC 2 ──────────────────────────────────  table: client_form

// Topis 2 Middleware: turns a JSON body into an object on req.body

app.use(express.json());

//
const port = 3001;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// Topic 2 Post Helper function: INSERT INTO, return the new row

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

// Topic 2 Post Api Endpoint: /add-one-client

app.post("/add-one-client", async (req, res) => {
  const { name, age, email, mood, first_visit } = req.body;

  const client = await addOneClient(name, age, email, mood, first_visit);

  res.send(`${client.name} is checked in.`);
});

// Topic 3:

//get helper function: SELECT, return the rows

async function getAllClients() {
  const result = await db.query("SELECT * FROM client_form ORDER BY id");

  return result.rows;
}

// Topic 3: get api endpoint: /get-all-clients

app.get("/get-all-clients", async (req, res) => {
  const clients = await getAllClients();

  res.json(clients);
});

// ──────────────────────────────────────────────────────────────────────

