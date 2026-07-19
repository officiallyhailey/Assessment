// LESSON 3, the GET endpoint.  Finished version.
//
// This lesson only reads data OUT. Sending it in was lesson 2, and there is
// deliberately no POST endpoint here.

const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const DATA_FILE = path.join(__dirname, "animals-data.json");

// Serves everything in public/, which is the page and the component.
app.use(express.static(path.join(__dirname, "public")));

// Reading means parsing text into JavaScript. Against a real database this
// would be the driver, running SELECT * FROM animals.
const readData = async () => JSON.parse(await fs.readFile(DATA_FILE, "utf8"));

// ---------------------------------------------------------------------------
// STEP 1.  The GET endpoint.
//
// A GET asks for data and sends none, which is why there is no req.body here
// and no express.json above. The path is what the React will fetch.
//
// res.json sends the array as JSON and sets the Content-Type header, which is
// what lets response.json() on the other end read it. res.send would send it
// as plain text and the fetch would have to parse it by hand.
//
// Worth opening in the browser on its own before writing any React. If the
// endpoint is wrong, the component looks broken for the wrong reason.
// ---------------------------------------------------------------------------
app.get("/get-all-animals", async (req, res) => {
    const animals = await readData();
    res.json(animals);
});

app.listen(3300, () => {
    console.log("");
    console.log("  LESSON 3   http://localhost:3300");
    console.log("  GET /get-all-animals");
    console.log("");
});
