// LESSON 2, helpers.  One thing to write, at STEP 3.

const fs = require("fs/promises");

// ── STEP 3 ────────────────────────────────────────────────────────────
// Save one animal and return it.
//   read animals-data.json     await fs.readFile(file, "utf8")
//   text into JavaScript       JSON.parse
//   work out the next id       highest existing id, plus 1
//   build it and push it       { id, name, category, can_fly, lives_in }
//   JavaScript back into text  JSON.stringify
//   write the file             await fs.writeFile
//   return the new animal      server.js uses its name in the reply
async function addOneAnimal(name, category, can_fly, lives_in) {
    // write it here
}
// ──────────────────────────────────────────────────────────────────────

module.exports = { addOneAnimal };
