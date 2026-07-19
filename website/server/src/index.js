// ---------------------------------------------------------------------------
// THE SERVER. Every endpoint follows the same three steps:
//
//   1. get the input from the request   (req.body / req.params)
//   2. call a helper that does the work (await)
//   3. send a response                  (res.json / res.send)
//
// No SQL in this file. The queries all live in animals-helpers.js.
// ---------------------------------------------------------------------------

import express from "express";

// Postgres by default. `npm run dev:offline` swaps in a JSON-backed twin with
// the same functions, so a dead network cannot cancel a session. The endpoints
// below cannot tell the difference, which is the point of the helper split.
const offline = process.env.DATA_SOURCE === "json";
const { getAllAnimals, getOneAnimalById, addOneAnimal, resetAnimals } = offline
  ? await import("./animals-helpers.offline.js")
  : await import("./animals-helpers.js");

const app = express();

// Express 4 does not catch a rejected promise from an async handler: it becomes
// an unhandled rejection and Node exits the process. So one POST with a missing
// name, which the table rejects for being NOT NULL, would take the API down for
// the whole room. This passes failures to the error handler at the bottom
// instead. Express 5 does it on its own; this stays until we are on it.
const endpoint = (handler) => (req, res, next) => Promise.resolve(handler(req, res, next)).catch(next);

// Reads incoming JSON bodies. WITHOUT THIS LINE req.body IS undefined.
app.use(express.json());

// ---------------------------------------------------------------------------
// TOPIC 3. GET all the animals
// ---------------------------------------------------------------------------
app.get("/get-all-animals", endpoint(async (req, res) => {
  const animals = await getAllAnimals();
  res.json(animals);
}));

// ---------------------------------------------------------------------------
// TOPIC 3. GET one animal by id, using a route parameter
// The :id is a placeholder. /get-one-animal-by-id/3  ->  req.params.id === "3"
// ---------------------------------------------------------------------------
app.get("/get-one-animal-by-id/:id", endpoint(async (req, res) => {
  const animal = await getOneAnimalById(req.params.id);
  res.json(animal);
}));

// ---------------------------------------------------------------------------
// TOPIC 2. POST a new animal
// ---------------------------------------------------------------------------
app.post("/add-one-animal", endpoint(async (req, res) => {
  const { name, category, can_fly, lives_in } = req.body;
  const animal = await addOneAnimal(name, category, can_fly, lives_in);
  res.send(`The farm has grown: ${animal.name} was added!`);
}));

// ---------------------------------------------------------------------------
// Not part of any lesson. The site's reset button calls this, so the data can
// be put back to the original three animals without leaving the browser.
// ---------------------------------------------------------------------------
app.post("/reset-animals", endpoint(async (req, res) => {
  const animals = await resetAnimals();
  res.json(animals);
}));

// ---------------------------------------------------------------------------
// Anything an endpoint threw lands here. It answers with a 500 and the reason,
// which is more use during a lesson than a stack trace in a terminal nobody is
// looking at, and it keeps the server up for the next request.
// ---------------------------------------------------------------------------
app.use((err, req, res, next) => {
  console.error(`  ${req.method} ${req.path} failed: ${err.message}`);
  res.status(500).json({ error: err.message });
});

const port = 3010;
app.listen(port, async () => {
  if (offline) {
    console.log(`Server running on http://localhost:${port}  (offline, JSON file)`);
    return;
  }
  // Wake the database before anyone asks it for anything. See db.js.
  const { warmUp } = await import("./db.js");
  const ms = await warmUp();
  console.log(`Server running on http://localhost:${port}  (Postgres, awake in ${ms} ms)`);
});
