// LESSON 2, POST endpoint.  Write steps 1 and 2 here, then step 3 in helpers.js.
//
// The GET at the bottom already works, so once your POST runs you can send a
// GET to check the animal really was saved.

const express = require("express");
const { getAllAnimals, addOneAnimal } = require("./helpers");

const app = express();

// ── STEP 1 ──  Read incoming JSON, so req.body is not undefined.
//               One line, and it belongs above the endpoints.

// write it here

// ── STEP 2 ──  POST /add-one-animal
//
//   1. take the four values off req.body   (name, category, can_fly, lives_in)
//   2. call the helper and wait for it     (await addOneAnimal(...))
//   3. send one reply                      (res.send with the saved name)
//
// Mark the handler async, or you cannot use await inside it.

// write it here

// ── given ──  Send a GET here after your POST to check it saved.
app.get("/get-all-animals", async (req, res) => {
    const animals = await getAllAnimals();
    res.json(animals);
});

app.listen(3200, () => {
    console.log("");
    console.log("  LESSON 2 (scaffold)   http://localhost:3200");
    console.log("  GET  /get-all-animals   works now");
    console.log("  POST /add-one-animal    write steps 1 and 2, then step 3 in helpers.js");
    console.log("");
});
