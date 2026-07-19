// LESSON 2, helpers.  Finished version.
//
// This file is about the data. It knows nothing about requests or responses:
// hand it four values, get back the animal that was saved. That is why it can
// be called from anywhere, not just from an endpoint.

const fs = require("fs/promises");
const path = require("path");

const DATA_FILE = path.join(__dirname, "animals-data.json");

// The data here is a JSON file, so reading means parsing text into JavaScript
// and writing means turning JavaScript back into text. Against a real database
// these two lines would be the database driver instead.
const readData = async () => JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
const writeData = (animals) => fs.writeFile(DATA_FILE, JSON.stringify(animals, null, 2));

// ---------------------------------------------------------------------------
// STEP 3.  Save one animal and return it.
//
// The id is worked out here because a real database would generate it with
// SERIAL. population is left empty on purpose, to show an optional column.
//
// Against a real database:
//   INSERT INTO animals (name, category, can_fly, lives_in)
//   VALUES ($1, $2, $3, $4) RETURNING *;
//
// It returns the animal it saved rather than the values that came in, so the
// caller sees exactly what is stored, including the id it was given.
// ---------------------------------------------------------------------------
async function addOneAnimal(name, category, can_fly, lives_in) {
    const animals = await readData();

    const nextId = animals.length > 0 ? Math.max(...animals.map((a) => a.id)) + 1 : 1;

    const newAnimal = { id: nextId, name, category, can_fly, lives_in, population: null };
    animals.push(newAnimal);

    await writeData(animals);

    return newAnimal;
}

module.exports = { addOneAnimal };
