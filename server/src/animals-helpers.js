// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
//
// These talk to the "database". Here the database is a JSON file, so every
// helper has to READ the file and PARSE the text into JavaScript.
//
// That's why each one is `async` and why JSON.parse shows up: fs.readFile
// hands back a STRING, not JavaScript. In a real SQL database (Topic 1) these
// same helpers would run INSERT INTO or SELECT instead, and the endpoints in
// server.js would not change at all.
// ---------------------------------------------------------------------------

const fs = require("fs/promises");
const path = require("path");

const DATA_FILE = path.join(__dirname, "animals-data.json");

// Read every animal.
//   SQL equivalent:  SELECT * FROM animals;
async function getAllAnimals() {
    const data = await fs.readFile(DATA_FILE, "utf8"); // a string of text
    const parsedData = JSON.parse(data);              // now real JavaScript
    return parsedData;
}

// Find one animal by its id.
//   SQL equivalent:  SELECT * FROM animals WHERE id = $1;
async function getOneAnimalById(id) {
    const animals = await getAllAnimals();

    // Route parameters always arrive as STRINGS ("3", not 3),
    // so convert before comparing.
    const animal = animals.find((a) => a.id === Number(id));
    return animal;
}

// Add a new animal and save it back to the file.
//   SQL equivalent:
//   INSERT INTO animals (name, category, can_fly, lives_in)
//   VALUES ($1, $2, $3, $4) RETURNING *;
async function addOneAnimal(name, category, can_fly, lives_in) {
    const animals = await getAllAnimals();

    // The database would normally generate the id (SERIAL). Here we do it.
    const nextId =
        animals.length > 0 ? Math.max(...animals.map((a) => a.id)) + 1 : 1;

    // population is optional in the table, so a newly added row leaves it empty.
    const newAnimal = { id: nextId, name, category, can_fly, lives_in, population: null };
    animals.push(newAnimal);

    // Going the other way: JavaScript to text, so it can be written to a file.
    await fs.writeFile(DATA_FILE, JSON.stringify(animals, null, 2));

    return newAnimal; // like RETURNING *, the row that was just created
}

module.exports = { getAllAnimals, getOneAnimalById, addOneAnimal };
