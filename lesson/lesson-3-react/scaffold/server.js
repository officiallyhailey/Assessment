// LESSON 3 support.  Nothing here needs writing.
//
// A working API so the page has real data to fetch. This lesson stands alone:
// the server is done, you only write the component in public/index.html.

const express = require("express");
const fs = require("fs/promises");
const path = require("path");

const app = express();
const DATA_FILE = path.join(__dirname, "animals-data.json");

app.use(express.static(path.join(__dirname, "public")));

app.get("/get-all-animals", async (req, res) => {
    const data = await fs.readFile(DATA_FILE, "utf8");
    res.json(JSON.parse(data));
});

app.listen(3300, () => {
    console.log("");
    console.log("  LESSON 3 (scaffold)   http://localhost:3300");
    console.log("  API  /get-all-animals   already works");
    console.log("  Write the 4 steps in public/index.html, then refresh.");
    console.log("");
});
