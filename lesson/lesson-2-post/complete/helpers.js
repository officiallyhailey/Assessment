// LESSON 2, the helper file.  Finished version.
//
// The endpoint in server.js handles the request and the response. This file
// handles the data, and knows nothing about either. Hand it four values and it
// hands back the saved animal: it could not tell you whether it was called by
// an endpoint, a script or a test.
//
// That split is the point. A function that only knows about animals can be
// used anywhere animals need saving.

const fs = require("fs/promises");
const path = require("path");

const DATA_FILE = path.join(__dirname, "animals-data.json");

// ---------------------------------------------------------------------------
// Read every animal.  Given to you, not part of what you write.
//
// The data here is a JSON file, so this has to read the file and parse the text
// into JavaScript. fs.readFile hands back a STRING, and JSON.parse turns that
// string into a real array. Skip the parse and you are holding text that only
// looks like data.
//
// Against a real database this same function would run:
//   SELECT * FROM animals;
// ---------------------------------------------------------------------------
async function getAllAnimals() {
    const data = await fs.readFile(DATA_FILE, "utf8"); // a string of text
    return JSON.parse(data);                           // now real JavaScript
}

// ---------------------------------------------------------------------------
// Add one animal and save it.
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

module.exports = { getAllAnimals, addOneAnimal };
