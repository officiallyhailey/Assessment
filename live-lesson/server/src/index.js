// The server. Runs on port 3001.

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

// ─── TOPIC 2 ──────────────────────────────────  table: lesson_animals
// Notes on each step are in answer-key.js.

// middleware: turns a JSON body into an object on req.body


// post helper function: INSERT INTO, return the new row


// post api endpoint: /add-one-animal


// get helper function: SELECT, return the rows


// get api endpoint: /get-all-animals


// ──────────────────────────────────────────────────────────────────────
