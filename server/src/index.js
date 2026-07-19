// ---------------------------------------------------------------------------
// THE SERVER. Every endpoint follows the same three steps:
//
//   1. get the input from the request   (req.body / req.params)
//   2. call a helper that does the work (await)
//   3. send a response                  (res.json / res.send)
// ---------------------------------------------------------------------------

const express = require("express");
const {
    getAllAnimals,
    getOneAnimalById,
    addOneAnimal,
} = require("./animals-helpers");
const { resetAnimals } = require("./reset");

const app = express();

// Reads incoming JSON bodies. WITHOUT THIS LINE req.body IS undefined.
app.use(express.json());

// ---------------------------------------------------------------------------
// TOPIC 3. GET all the animals
// ---------------------------------------------------------------------------
app.get("/get-all-animals", async (req, res) => {
    const animals = await getAllAnimals();
    res.json(animals);
});

// ---------------------------------------------------------------------------
// TOPIC 3. GET one animal by id, using a route parameter
// The :id is a placeholder. /get-one-animal-by-id/3  ->  req.params.id === "3"
// ---------------------------------------------------------------------------
app.get("/get-one-animal-by-id/:id", async (req, res) => {
    const animal = await getOneAnimalById(req.params.id);
    res.json(animal);
});

// ---------------------------------------------------------------------------
// TOPIC 2. POST a new animal
// ---------------------------------------------------------------------------
app.post("/add-one-animal", async (req, res) => {
    const { name, category, can_fly, lives_in } = req.body;
    const animal = await addOneAnimal(name, category, can_fly, lives_in);
    res.send(`The farm has grown: ${animal.name} was added!`);
});

// ---------------------------------------------------------------------------
// Not part of any lesson. The site's reset button calls this, so the data can
// be put back to the original three animals without leaving the browser.
// ---------------------------------------------------------------------------
app.post("/reset-animals", (req, res) => {
    const animals = resetAnimals();
    res.json(animals);
});

app.listen(3010, () => {
    console.log("Server running on http://localhost:3010");
});
