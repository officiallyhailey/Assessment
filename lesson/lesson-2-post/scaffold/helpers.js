// LESSON 2, the helper file.  One thing to write here, at STEP 3.
//
// This file is about the data. It knows nothing about requests or responses:
// hand it four values, get back the saved animal.

const fs = require("fs/promises");
const path = require("path");

const DATA_FILE = path.join(__dirname, "animals-data.json");

// ── given ──  Read every animal. Nothing to write here.
//              readFile hands back TEXT, so it has to be parsed into JavaScript.
async function getAllAnimals() {
    const data = await fs.readFile(DATA_FILE, "utf8");
    return JSON.parse(data);
}

// ── STEP 3 ──  Add one animal and save it.
//
//   1. get the animals that are already there   (await getAllAnimals)
//   2. work out the next id                     (highest existing id, plus 1)
//   3. build the new animal                     ({ id, name, category, ... })
//   4. add it to the array                      (push)
//   5. write the whole array back               (fs.writeFile + JSON.stringify)
//   6. return the animal you just made
//
// Return the animal rather than nothing, because server.js uses its name in
// the reply.
async function addOneAnimal(name, category, can_fly, lives_in) {
    // write it here
}

module.exports = { getAllAnimals, addOneAnimal };
