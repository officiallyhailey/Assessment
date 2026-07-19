// LESSON 3, the GET endpoint.  Finished version.
//
// This lesson only reads data OUT. Sending it in was lesson 2, and there is
// deliberately no POST endpoint here.
//
// Run it:  npm run lesson3      then open http://localhost:3300

import express from "express";
import db from "./db.js";

const app = express();

// Serves everything in public/, which is the page and the component.
app.use(express.static("public"));

// ---------------------------------------------------------------------------
// STEP 1.  The GET endpoint.
//
// A GET asks for data and sends none, which is why there is no req.body here
// and no express.json above.
//
// One query, and the rows come back on result.rows. ORDER BY id keeps them in
// a predictable order: without it the database is free to return them in any
// order it likes, which usually looks fine and occasionally does not.
//
// res.json sends the array as JSON and sets the Content-Type header, which is
// what lets response.json() on the other end read it. res.send would send it
// as plain text and the fetch would have to parse it by hand.
//
// Worth opening in the browser on its own before writing any React. If the
// endpoint is wrong, the component looks broken for the wrong reason.
// ---------------------------------------------------------------------------
app.get("/get-all-animals", async (req, res) => {
  const result = await db.query("SELECT * FROM animals ORDER BY id");

  res.json(result.rows);
});

const port = 3300;
app.listen(port, () => {
  console.log("");
  console.log(`  LESSON 3   http://localhost:${port}`);
  console.log("  GET /get-all-animals");
  console.log("");
});
