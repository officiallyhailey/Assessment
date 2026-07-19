// LESSON 3, the GET endpoint.  Finished version.
//
// This lesson only reads data OUT. Sending it in was lesson 2, and there is
// deliberately no POST endpoint here.
//
// Run it from this folder, so "animals-data.json" and "public" just work:
//   npm run lesson3

const express = require("express");
const fs = require("fs/promises");

const app = express();

// Serves everything in public/, which is the page and the component.
app.use(express.static("public"));

// ---------------------------------------------------------------------------
// STEP 1.  The GET endpoint.
//
// A GET asks for data and sends none, which is why there is no req.body here
// and no express.json above.
//
// The reading is written out rather than hidden in a helper, because it is
// two things worth seeing. readFile hands back a STRING, and JSON.parse turns
// that string into a real array. Skip the parse and you send back text that
// only looks like data.
//
// res.json sends the array as JSON and sets the Content-Type header, which is
// what lets response.json() on the other end read it. res.send would send it
// as plain text and the fetch would have to parse it by hand.
//
// Against a real database, those two lines would be one query:
//   SELECT * FROM animals;
//
// Worth opening in the browser on its own before writing any React. If the
// endpoint is wrong, the component looks broken for the wrong reason.
// ---------------------------------------------------------------------------
app.get("/get-all-animals", async (req, res) => {
    const text = await fs.readFile("animals-data.json", "utf8");
    const animals = JSON.parse(text);

    res.json(animals);
});

app.listen(3300, () => {
    console.log("");
    console.log("  LESSON 3   http://localhost:3300");
    console.log("  GET /get-all-animals");
    console.log("");
});
