// THE SERVER
//
// Two tables, on purpose:
//
//   lesson_one_table   lesson 1 creates it. Only lesson 1 touches it.
//   lesson_animals     already exists, already filled. Lessons 2 and 3 use it.
//
// That way lesson 2 or lesson 3 can be taught on their own, without lesson 1
// having been done first.
//
// Lesson 1 is done in Neon. Lessons 2 and 3 each have a marked section below.
// Write in the section, save, restart the server, and the page updates.
//
// answer-key.js has the finished version of both.

import express from "express";
import pg from "pg";
import config from "./config.js";

const db = new pg.Pool({
  connectionString: config.databaseUrl + "&uselibpqcompat=true",
  ssl: true,
});

const app = express();
app.use(express.json());

// ---------------------------------------------------------------------------
// GIVEN.  Reads lesson_one_table, the table lesson 1 creates.
//
// Lesson 1's page uses this to show the table exists once the SQL has run.
// ---------------------------------------------------------------------------
app.get("/lesson-one-table", async (req, res) => {
  const result = await db.query("SELECT * FROM lesson_one_table ORDER BY id");
  res.json(result.rows);
});

// ---------------------------------------------------------------------------
// GIVEN.  Reads lesson_animals, the table that is already filled in.
//
// Lesson 2's page uses this to show whether a POST really saved. Writing a GET
// yourself is lesson 3, which is why this one is handed over.
// ---------------------------------------------------------------------------
app.get("/animals", async (req, res) => {
  const result = await db.query("SELECT * FROM lesson_animals ORDER BY id");
  res.json(result.rows);
});

// ═══════════════════════════════════════════════════════════════════════
// LESSON 2.  Write the POST endpoint.
//
//   path        /add-one-animal
//   read        name, category, can_fly, lives_in off req.body
//   insert      into lesson_animals, RETURNING *
//   reply       res.send a message using the saved name
// ═══════════════════════════════════════════════════════════════════════

// write it here

// ═══════════════════════════════════════════════════════════════════════
// LESSON 3.  Write the GET endpoint.
//
//   path        /get-all-animals
//   query       SELECT * FROM lesson_animals ORDER BY id
//   reply       res.json the rows
// ═══════════════════════════════════════════════════════════════════════

// write it here

// ═══════════════════════════════════════════════════════════════════════

const port = 3001;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
