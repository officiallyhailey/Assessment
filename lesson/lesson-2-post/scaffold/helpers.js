// LESSON 2, helpers.  One thing to write, at STEP 3.

const fs = require("fs/promises");
const path = require("path");

const DATA_FILE = path.join(__dirname, "animals-data.json");

// given: read the file, write the file
const readData = async () => JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
const writeData = (animals) => fs.writeFile(DATA_FILE, JSON.stringify(animals, null, 2));

// ── STEP 3 ────────────────────────────────────────────────────────────
// Save one animal and return it.
//   read, work out the next id, push the new animal, write, return it
async function addOneAnimal(name, category, can_fly, lives_in) {
    // write it here
}
// ──────────────────────────────────────────────────────────────────────

module.exports = { addOneAnimal };
