// THE SERVER
//
// Lesson 1 is done in Neon, not here. Lesson 2 and lesson 3 each have a marked
// section below. Write in the section, save, and the page updates.
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
// GIVEN
//
// Reads the table lesson 1 creates. Lesson 1's page uses it to show the table
// exists, and lesson 2 uses it to check a POST really landed.
// ---------------------------------------------------------------------------
app.get("/lesson-one-table", async (req, res) => {
  const result = await db.query("SELECT * FROM lesson_one_table ORDER BY id");
  res.json(result.rows);
});

// ═══════════════════════════════════════════════════════════════════════
// LESSON 2.  Write the POST endpoint.
//
//   path        /add-one-animal
//   read        name, category, can_fly, lives_in off req.body
//   insert      into lesson_one_table, RETURNING *
//   reply       res.send a message using the saved name
// ═══════════════════════════════════════════════════════════════════════

// write it here

// ═══════════════════════════════════════════════════════════════════════
// LESSON 3.  Write the GET endpoint.
//
//   path        /get-all-animals
//   query       SELECT * FROM lesson_one_table ORDER BY id
//   reply       res.json the rows
// ═══════════════════════════════════════════════════════════════════════

// write it here

// ═══════════════════════════════════════════════════════════════════════

const port = 3001;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
