// THE SERVER, lesson 2.  Finished version.
//
// This lesson only sends data IN. Reading it back is lesson 3, so there is
// deliberately no GET endpoint here.
//
// Run it:  npm start        from lesson/server
// Then send the requests in requests.http, or use Postman.

import express from "express";
import { addOneAnimal } from "./animals-helpers.js";

const app = express();

// ---------------------------------------------------------------------------
// STEP 1.  Read incoming JSON.
//
// Middleware, meaning it runs on every request before any endpoint sees it. It
// reads a JSON request body and turns it into a JavaScript object on req.body.
//
// Without this line req.body is undefined, and the endpoint below fails in a
// confusing way rather than an obvious one. It is the most common cause of a
// POST "not working", so it is worth sending a request before adding it.
// ---------------------------------------------------------------------------
app.use(express.json());

// ---------------------------------------------------------------------------
// STEP 3.  The POST endpoint.
//
// app.post registers a handler for POST requests at this exact path. The method
// and the path together identify an endpoint.
//
// async is here because the database takes real time, and await is what makes
// the code wait for it. Without await the reply would be sent before the row
// was saved, and it would look like it worked right up until it did not.
//
// req is everything that arrived. res is how a reply is sent, and exactly one
// reply must be sent.
//
// Three steps, and every endpoint has them:
//   1. take the input     const { ... } = req.body
//   2. do the work        await addOneAnimal(...)
//   3. send a response    res.send(...)
// ---------------------------------------------------------------------------
app.post("/add-one-animal", async (req, res) => {
  const { name, category, can_fly, lives_in } = req.body;

  const animal = await addOneAnimal(name, category, can_fly, lives_in);

  // Uses the name the database returned, not the one that arrived, so the
  // message reflects what was actually stored.
  res.send(`The farm has grown: ${animal.name} was added!`);
});

const port = 3001;
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
