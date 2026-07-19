// LESSON 3, the GET endpoint.  Write step 1 here, then steps 2 to 5 in
// public/AnimalList.jsx.
//
// This lesson only reads data OUT. Sending it in was lesson 2.

const express = require("express");
const fs = require("fs/promises");

const app = express();

// Serves the page in public/.
app.use(express.static("public"));

// ── STEP 1 ────────────────────────────────────────────────────────────
// GET /get-all-animals
//   read animals-data.json           await fs.readFile(file, "utf8")
//   turn the text into JavaScript    JSON.parse
//   send it                          res.json
//
// Check it at http://localhost:3300/get-all-animals before writing any React.

// write it here

// ──────────────────────────────────────────────────────────────────────

app.listen(3300, () => {
    console.log("");
    console.log("  LESSON 3 (scaffold)   http://localhost:3300");
    console.log("  GET /get-all-animals   write step 1");
    console.log("  then steps 2 to 5 in public/AnimalList.jsx");
    console.log("");
});
