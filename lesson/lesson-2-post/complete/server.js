// LESSON 2, POST endpoint.  Finished version.
//
// This is what the scaffold builds up to, with the full explanation written in.
// Read it afterwards as the guide to what you just wrote.
//
// Two files, matching the lesson: this one is about requests and responses,
// helpers.js is about the data. Neither knows much about the other.

const express = require("express");
const { getAllAnimals, addOneAnimal } = require("./helpers");

const app = express();

// ---------------------------------------------------------------------------
// STEP 1.  Read incoming JSON.
//
// Middleware, meaning it runs on every request before any endpoint sees it. It
// reads a JSON request body and turns it into a JavaScript object on req.body.
//
// Without this line req.body is undefined, and the endpoint below fails in a
// confusing way rather than an obvious one. It is the most common cause of a
// POST "not working", so it is worth sending a request before adding it.
// ---------------------------------------------------------------------------
app.use(express.json());

// ---------------------------------------------------------------------------
// STEP 2.  The POST endpoint.
//
// app.post registers a handler for POST requests at this exact path. The method
// and the path together identify an endpoint, so a GET to the same path is a
// different endpoint entirely.
//
// async is here because the helper touches the file system, which takes time,
// and await is what makes the code wait for it. Without await the reply would
// be sent before the animal was saved, and it would appear to work right up
// until the save failed.
//
// req is everything that arrived. res is how a reply is sent, and exactly one
// reply must be sent.
//
// Three steps, and every endpoint has them:
//   1. take the input     const { ... } = req.body
//   2. do the work        await addOneAnimal(...)
//   3. send a response    res.send(...)
// ---------------------------------------------------------------------------
app.post("/add-one-animal", async (req, res) => {
    const { name, category, can_fly, lives_in } = req.body;

    const animal = await addOneAnimal(name, category, can_fly, lives_in);

    // Uses the name the helper returned, not the one that arrived, so the
    // message reflects what was actually stored.
    res.send(`The farm has grown: ${animal.name} was added!`);
});

// ---------------------------------------------------------------------------
// Given to you, not part of this lesson.
//
// A GET endpoint, here so the saved animal can be read back. Replying nicely
// and actually storing the row are two different claims, and this checks the
// second one.
// ---------------------------------------------------------------------------
app.get("/get-all-animals", async (req, res) => {
    const animals = await getAllAnimals();
    res.json(animals);
});

app.listen(3200, () => {
    console.log("");
    console.log("  LESSON 2   http://localhost:3200");
    console.log("  GET  /get-all-animals");
    console.log("  POST /add-one-animal");
    console.log("");
});
