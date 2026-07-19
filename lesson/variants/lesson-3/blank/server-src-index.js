// THE SERVER, lesson 3.  Write step 1 here, step 2 in animals-helpers.js,
// then steps 3 to 6 in the client.
//
// This lesson only reads data OUT. Sending it in was lesson 2.
//
// Run it:  npm start        from lesson/server

import express from "express";
import { getAllAnimals } from "./animals-helpers.js";

const app = express();

// ── STEP 1 ────────────────────────────────────────────────────────────
// GET /get-all-animals
//   await getAllAnimals()
//   res.json it
//
// No express.json here: a GET sends no body.
//
// Check it at http://localhost:3001/get-all-animals before writing any React.

// write it here

// ──────────────────────────────────────────────────────────────────────

const port = 3001;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
