// LESSON 2, POST endpoint.  Finished version.
//
// This is the same file the scaffold builds up to, with the full explanation
// written in. Read it afterwards as the guide to what you just wrote.
//
// Everything lives in one file so it reads top to bottom. In a real project
// the two helper functions would sit in their own file and be imported here,
// which is what the lesson site shows. The point being taught is the separate
// FUNCTION, not the separate file: the endpoint handles the request and the
// response, the helper handles the data.

const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const DATA_FILE = path.join(__dirname, "animals-data.json");

// ---------------------------------------------------------------------------
// STEP 1.  Read incoming JSON.
//
// Middleware, meaning it runs on every request before any endpoint sees it.
// It reads a JSON request body and turns it into a JavaScript object on
// req.body.
//
// Without this line req.body is undefined, and the endpoint below fails in a
// confusing way rather than an obvious one. It is the most common cause of a
// POST "not working", so it is worth sending a request before adding it.
// ---------------------------------------------------------------------------
app.use(express.json());

// ---------------------------------------------------------------------------
// STEP 2.  Helper: read every animal.
//
// Here the data is a JSON file, so this has to read the file and parse the
// text into JavaScript. fs.readFile hands back a STRING, and JSON.parse turns
// that string into a real array. Skip the parse and you are holding text that
// only looks like data.
//
// Against a real database this same function would run:
//   SELECT * FROM animals;
// ---------------------------------------------------------------------------
async function getAllAnimals() {
    const data = await fs.readFile(DATA_FILE, "utf8"); // a string of text
    const parsedData = JSON.parse(data);               // now real JavaScript
    return parsedData;
}

// ---------------------------------------------------------------------------
// STEP 3.  Helper: add one animal and save it.
//
// Read what is already there, work out the next id, build the new object, add
// it, then write the whole array back. JSON.stringify is the mirror of
// JSON.parse: JavaScript turned back into text so it can be written to a file.
//
// The id is generated here because a real database would do it with SERIAL.
// population is left empty on purpose, to show an optional column.
//
// Against a real database:
//   INSERT INTO animals (name, category, can_fly, lives_in)
//   VALUES ($1, $2, $3, $4) RETURNING *;
//
// It returns the animal it saved rather than the values that came in, so the
// caller sees exactly what is stored, including the id it was given.
// ---------------------------------------------------------------------------
async function addOneAnimal(name, category, can_fly, lives_in) {
    const animals = await getAllAnimals();

    const nextId =
        animals.length > 0 ? Math.max(...animals.map((a) => a.id)) + 1 : 1;

    const newAnimal = { id: nextId, name, category, can_fly, lives_in, population: null };
    animals.push(newAnimal);

    await fs.writeFile(DATA_FILE, JSON.stringify(animals, null, 2));

    return newAnimal;
}

// ---------------------------------------------------------------------------
// STEP 4.  The POST endpoint.
//
// app.post registers a handler for POST requests at this exact path. The
// method and the path together identify an endpoint, so a GET to the same
// path is a different endpoint entirely.
//
// async is here because the helper touches the file system, which takes time,
// and await is what makes the code wait for it. Without await the reply would
// be sent before the animal was saved, and it would appear to work right up
// until the save failed.
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

    // Uses the name the helper returned, not the one that arrived, so the
    // message reflects what was actually stored.
    res.send(`The farm has grown: ${animal.name} was added!`);
});

// ---------------------------------------------------------------------------
// Not part of this lesson.
//
// A GET endpoint, here so the saved animal can be read back. Replying nicely
// and actually storing the row are two different claims, and this checks the
// second one.
// ---------------------------------------------------------------------------
app.get("/get-all-animals", async (req, res) => {
    const animals = await getAllAnimals();
    res.json(animals);
});

app.listen(3200, () => {
    console.log("");
    console.log("  LESSON 2   http://localhost:3200");
    console.log("  GET  /get-all-animals");
    console.log("  POST /add-one-animal");
    console.log("");
});
