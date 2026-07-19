// LESSON 2, a POST endpoint.  Write steps 1 and 2 here, step 3 in
// animals-helpers.js.
//
// This lesson only sends data IN. Reading it back is lesson 3.
// Send the requests in requests.http to try it.

import express from "express";
import { addOneAnimal } from "./animals-helpers.js";

const app = express();

// ── STEP 1 ────────────────────────────────────────────────────────────
// Read incoming JSON, so req.body is not undefined. One line.

// write it here

// ── STEP 2 ────────────────────────────────────────────────────────────
// POST /add-one-animal
//   take the four values off req.body
//   await addOneAnimal(...)
//   res.send a message using the saved name

// write it here

// ──────────────────────────────────────────────────────────────────────

const port = 3200;
app.listen(port, () => {
  console.log("");
  console.log(`  LESSON 2 (scaffold)   http://localhost:${port}`);
  console.log("  POST /add-one-animal   write steps 1 and 2, then step 3 in animals-helpers.js");
  console.log("");
});
