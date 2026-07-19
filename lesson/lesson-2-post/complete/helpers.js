// LESSON 2, helpers.  Finished version.
//
// This file is about the data. It knows nothing about requests or responses:
// hand it four values, get back the animal that was saved. That is why it can
// be called from anywhere, not just from an endpoint.

const fs = require("fs/promises");

// ---------------------------------------------------------------------------
// STEP 3.  Save one animal and return it.
//
// Read, add, write. The reading and writing are written out here rather than
// hidden in helpers of their own, because both directions are worth seeing:
//
//   readFile gives back a STRING, so JSON.parse turns it into a real array.
//   JSON.stringify does the reverse, because a file can only hold text.
//
// The id is worked out here because a real database would generate it with
// SERIAL. population is left empty on purpose, to show an optional column.
//
// Against a real database, the whole function would be one query:
//   INSERT INTO animals (name, category, can_fly, lives_in)
//   VALUES ($1, $2, $3, $4) RETURNING *;
//
// It returns the animal it saved rather than the values that came in, so the
// caller sees exactly what is stored, including the id it was given.
// ---------------------------------------------------------------------------
async function addOneAnimal(name, category, can_fly, lives_in) {
    const text = await fs.readFile("animals-data.json", "utf8");
    const animals = JSON.parse(text);

    const nextId = animals.length > 0 ? Math.max(...animals.map((a) => a.id)) + 1 : 1;

    const newAnimal = { id: nextId, name, category, can_fly, lives_in, population: null };
    animals.push(newAnimal);

    await fs.writeFile("animals-data.json", JSON.stringify(animals, null, 2));

    return newAnimal;
}

module.exports = { addOneAnimal };
