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
//   TOPIC 2          Create a POST endpoint with Express and SQL
//
//   Table: lesson_animals
//
//   1.  app.use(express.json())
//       Without it req.body is undefined.
//
//   2.  HELPER  addOneAnimal(name, category, can_fly, lives_in)
//       INSERT INTO lesson_animals ... RETURNING *
//       return the row it made
//
//   3.  ENDPOINT  app.post("/add-one-animal", ...)
//       read the four values off req.body
//       await the helper
//       res.send a message using the saved name
//
//   4.  HELPER  getAllAnimals()
//       SELECT * FROM lesson_animals ORDER BY id
//       return the rows
//
//   5.  ENDPOINT  app.get("/get-all-animals", ...)
//       await the helper
//       res.json the rows
//
//   Then test both in Postman. The GET is what proves the POST really saved,
//   and topic 3 is what puts it on a page.
//
// ███████████████████████████████████████████████████████████████████████████

// write it here

// ███████████████████████████████████████████████████████████████████████████
