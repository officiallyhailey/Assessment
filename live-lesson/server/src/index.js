// The server. Express handles the requests, Postgres holds the data.
//
// It runs on port 3001. The React app runs on 5173 and reaches it through a
// proxy, so the paths you write here have no /api on the front.

// ───────────────────────────────────────────────────────────────────────────
// Connecting to the database.
//
// A Pool keeps a set of connections open and hands one out per query, rather
// than opening a new connection every time. The connection string lives in
// config.js, which stays out of git because it holds a password.
// ───────────────────────────────────────────────────────────────────────────

import express from "express";
import pg from "pg";
import config from "./config.js";

const db = new pg.Pool({
  connectionString: config.databaseUrl + "&uselibpqcompat=true",
  ssl: true,
});

const app = express();

const port = 3001;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});

// ███████████████████████████████████████████████████████████████████████████
//
//   TOPIC 2          Create a POST endpoint with Express and SQL
//
//   Table: lesson_animals
//
//   Two endpoints and the two helper functions behind them.
//
//   The helpers talk to the database. The endpoints handle the request and
//   the response, and call a helper to do the actual work. Keeping those two
//   jobs apart is what stops an endpoint turning into a wall of SQL.
//
//   1.  app.use(express.json())
//       Reads a JSON request body onto req.body. Leave it out and req.body
//       is undefined, which is the most common reason a POST "does nothing".
//
//   2.  HELPER  addOneAnimal(name, category, can_fly, lives_in)
//       INSERT INTO lesson_animals ... RETURNING *
//       Return the row it made, so the caller sees the id it was given.
//
//   3.  ENDPOINT  app.post("/add-one-animal", ...)
//       The four values arrive on req.body.
//       await the helper, then res.send a message using the saved name.
//
//   4.  HELPER  getAllAnimals()
//       SELECT * FROM lesson_animals ORDER BY id
//       Return the rows.
//
//   5.  ENDPOINT  app.get("/get-all-animals", ...)
//       await the helper, then res.json the rows.
//
//   Then try both in Postman. Send a POST, then a GET: a reply saying it
//   worked and a row that is actually there are two different things, and the
//   GET is what tells them apart.
//
// ███████████████████████████████████████████████████████████████████████████

// write it here

// ███████████████████████████████████████████████████████████████████████████
