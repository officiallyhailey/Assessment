// LESSON 2, POST endpoint.  Write the four steps, then restart.
// The GET at the bottom already works, so you can check your POST saved.

const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const DATA_FILE = path.join(__dirname, "animals-data.json");

// ── STEP 1 ──  Read incoming JSON, so req.body is not undefined.

// write it here

// ── STEP 2 ──  Helper: read every animal.
//               readFile gives TEXT, so JSON.parse it.
async function getAllAnimals() {
    // write it here
}

// ── STEP 3 ──  Helper: add one animal and save it.
//               read, work out the next id, push, write back, return it.
async function addOneAnimal(name, category, can_fly, lives_in) {
    // write it here
}

// ── STEP 4 ──  POST /add-one-animal
//               pull the four values off req.body, call the helper, reply.

// write it here

// ── already works ──  Send a GET here after your POST.
app.get("/get-all-animals", async (req, res) => {
    const data = await fs.readFile(DATA_FILE, "utf8");
    res.json(JSON.parse(data));
});

app.listen(3200, () => {
    console.log("");
    console.log("  LESSON 2 (scaffold)   http://localhost:3200");
    console.log("  GET  /get-all-animals   works now");
    console.log("  POST /add-one-animal    write steps 1 to 4");
    console.log("");
});
