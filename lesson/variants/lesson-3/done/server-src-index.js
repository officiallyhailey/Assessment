// THE SERVER, lesson 3.  Finished version.
//
// This lesson only reads data OUT. Sending it in was lesson 2, so there is
// deliberately no POST endpoint here.
//
// Run it:  npm start        from lesson/server

import express from "express";
import { getAllAnimals } from "./animals-helpers.js";

const app = express();

// ---------------------------------------------------------------------------
// STEP 1.  The GET endpoint.
//
// A GET asks for data and sends none, which is why there is no req.body here
// and no express.json above.
//
// res.json sends the array as JSON and sets the Content-Type header, which is
// what lets response.json() on the other end read it. res.send would send it
// as plain text and the fetch would have to parse it by hand.
//
// Worth opening on its own before writing any React. The client asks for
// /api/get-all-animals, and Vite strips the /api before it reaches here, so
// this path has no prefix. See client/vite.config.js.
// ---------------------------------------------------------------------------
app.get("/get-all-animals", async (req, res) => {
  const animals = await getAllAnimals();

  res.json(animals);
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
