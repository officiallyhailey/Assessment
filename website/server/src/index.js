// ---------------------------------------------------------------------------
// THE SERVER. Every endpoint follows the same three steps:
//
//   1. get the input from the request   (req.body / req.params)
//   2. call a helper that does the work (await)
//   3. send a response                  (res.json / res.send)
//
// No SQL in this file. The queries all live in helpers.js.
// ---------------------------------------------------------------------------

import express from "express";

// Postgres by default. `npm run dev:offline` swaps in a JSON-backed twin with
// the same functions, so a dead network cannot cancel a session. The endpoints
// below cannot tell the difference, which is the point of the helper split.
const offline = process.env.DATA_SOURCE === "json";
const helpers = offline
  ? await import("./helpers.offline.js")
  : await import("./helpers.js");
const {
  getAllClientForm, getOneClientById, addOneClient, resetClientForm,
} = helpers;

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
// TOPIC 1. GET every row of client_form, for the lesson 1 query demo.
// ---------------------------------------------------------------------------
app.get("/client-form", endpoint(async (req, res) => {
  const rows = await getAllClientForm();
  res.json(rows);
}));

// ---------------------------------------------------------------------------
// TOPIC 3. GET every checked-in client, for the lesson 3 React demo.
// ---------------------------------------------------------------------------
app.get("/get-all-clients", endpoint(async (req, res) => {
  const clients = await getAllClientForm();
  res.json(clients);
}));

// ---------------------------------------------------------------------------
// TOPIC 3. GET one client by id, using a route parameter.
// The :id is a placeholder. /get-one-client-by-id/2  ->  req.params.id === "2"
// ---------------------------------------------------------------------------
app.get("/get-one-client-by-id/:id", endpoint(async (req, res) => {
  const client = await getOneClientById(req.params.id);
  res.json(client);
}));

// ---------------------------------------------------------------------------
// TOPIC 2. POST a client to the check-in form.
// ---------------------------------------------------------------------------
app.post("/add-one-client", endpoint(async (req, res) => {
  const { name, age, email, mood, first_visit } = req.body;
  const client = await addOneClient(name, age, email, mood, first_visit);
  res.send(`${client.name} is checked in.`);
}));

// ---------------------------------------------------------------------------
// Not part of any lesson. The site's reset button calls this, so the data can
// be put back to the original three clients without leaving the browser.
// ---------------------------------------------------------------------------
app.post("/reset-client-form", endpoint(async (req, res) => {
  const rows = await resetClientForm();
  res.json(rows);
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
