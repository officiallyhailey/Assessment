// LESSON 3, the GET endpoint.  Write step 1 here, then steps 2 to 5 in
// public/AnimalList.jsx.
//
// This lesson only reads data OUT. Sending it in was lesson 2.

import express from "express";
import db from "./db.js";

const app = express();

// Serves the page in public/.
app.use(express.static("public"));

// ── STEP 1 ────────────────────────────────────────────────────────────
// GET /get-all-animals
//   await db.query("SELECT * FROM animals ORDER BY id")
//   res.json the rows off the result
//
// Check it at http://localhost:3300/get-all-animals before writing any React.

// write it here

// ──────────────────────────────────────────────────────────────────────

const port = 3300;
app.listen(port, () => {
  console.log("");
  console.log(`  LESSON 3 (scaffold)   http://localhost:${port}`);
  console.log("  GET /get-all-animals   write step 1");
  console.log("  then steps 2 to 5 in public/AnimalList.jsx");
  console.log("");
});
