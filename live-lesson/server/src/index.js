// ───────────────────────────────────────────────────────────────────────────
// SETUP.  Already written. Nothing here changes during a lesson.
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
//   LESSON 2          POST /add-one-animal          table: lesson_animals
//
//   Two things go here:
//
//     1. app.use(express.json())
//        Without it req.body is undefined.
//
//     2. the POST endpoint
//        read     name, category, can_fly, lives_in off req.body
//        insert   into lesson_animals, RETURNING *
//        reply    res.send a message using the saved name
//
// ███████████████████████████████████████████████████████████████████████████

// write it here

// ███████████████████████████████████████████████████████████████████████████
//
//   LESSON 3          GET /get-all-animals          table: lesson_animals
//
//   One thing goes here:
//
//     the GET endpoint
//       query    SELECT * FROM lesson_animals ORDER BY id
//       reply    res.json the rows
//
//   No express.json needed. A GET sends no body.
//
// ███████████████████████████████████████████████████████████████████████████

// write it here

// ███████████████████████████████████████████████████████████████████████████

// ───────────────────────────────────────────────────────────────────────────
// SUPPORT.  Not part of any lesson. Ignore this while teaching.
//
// Two reads the pages need in order to show anything:
//
//   /lesson-one-table   lesson 1's page, to show the table it created
//   /animals            lesson 2's page, to show whether a POST really saved
//
// Registering routes after app.listen is fine: Express checks them per
// request, not at startup. They sit down here so the sections above are the
// first thing in the file.
// ───────────────────────────────────────────────────────────────────────────

app.get("/lesson-one-table", async (req, res) => {
  const result = await db.query("SELECT * FROM lesson_one_table ORDER BY id");
  res.json(result.rows);
});

app.get("/animals", async (req, res) => {
  const result = await db.query("SELECT * FROM lesson_animals ORDER BY id");
  res.json(result.rows);
});
