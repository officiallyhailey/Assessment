// LESSON 2, a POST endpoint.  Write steps 1 and 2 here, step 3 in helpers.js.
//
// This lesson only sends data IN. Reading it back is lesson 3.
// To check it saved, open animals-data.json after you send.

const express = require("express");
const { addOneAnimal } = require("./helpers");

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

app.listen(3200, () => {
    console.log("");
    console.log("  LESSON 2 (scaffold)   http://localhost:3200");
    console.log("  POST /add-one-animal   write steps 1 and 2, then step 3 in helpers.js");
    console.log("");
});
