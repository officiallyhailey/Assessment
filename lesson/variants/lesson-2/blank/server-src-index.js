// THE SERVER, lesson 2.  Write steps 1 and 3 here, step 2 in
// animals-helpers.js.
//
// This lesson only sends data IN. Reading it back is lesson 3.
//
// Run it:  npm start        from lesson/server
// Then send the requests in requests.http, or use Postman.

import express from "express";
import { addOneAnimal } from "./animals-helpers.js";

const app = express();

// ── STEP 1 ────────────────────────────────────────────────────────────
// Read incoming JSON, so req.body is not undefined. One line.

// write it here

// ── STEP 3 ────────────────────────────────────────────────────────────
// POST /add-one-animal
//   take the four values off req.body
//   await addOneAnimal(...)
//   res.send a message using the saved name
//
// Mark the handler async, or you cannot use await inside it.

// write it here

// ──────────────────────────────────────────────────────────────────────

const port = 3001;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
