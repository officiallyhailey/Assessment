// LESSON 3, the GET endpoint.  Write step 1 here, then steps 2 to 5 in
// public/AnimalList.jsx.
//
// This lesson only reads data OUT. Sending it in was lesson 2.

const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const DATA_FILE = path.join(__dirname, "animals-data.json");

// given: serves the page, and reads the file
app.use(express.static(path.join(__dirname, "public")));
const readData = async () => JSON.parse(await fs.readFile(DATA_FILE, "utf8"));

// ── STEP 1 ────────────────────────────────────────────────────────────
// GET /get-all-animals
//   await readData()
//   res.json it
//
// Check it at http://localhost:3300/get-all-animals in the browser
// before moving on to the React.

// write it here

// ──────────────────────────────────────────────────────────────────────

app.listen(3300, () => {
    console.log("");
    console.log("  LESSON 3 (scaffold)   http://localhost:3300");
    console.log("  GET /get-all-animals   write step 1");
    console.log("  then steps 2 to 5 in public/AnimalList.jsx");
    console.log("");
});
