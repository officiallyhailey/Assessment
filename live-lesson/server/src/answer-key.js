// ANSWER KEY
//
// What goes in the marked section of each file.
//
// Teaching topic 3 on its own? Paste the topic 2 block into index.js first.
// The React side needs an endpoint to call, and writing that endpoint is a
// different lesson.
//
// The website explains why any of this works. This is only the what.

// ███████████████████████████████████████████████████████████████████████████
//   TOPIC 2          server/src/index.js
// ███████████████████████████████████████████████████████████████████████████

// 1. Middleware. Runs on every request before any endpoint sees it, and turns
//    a JSON body into an object on req.body. Without it req.body is undefined.
app.use(express.json());

// 2. The helper that writes. $1 and $2 are placeholders: the values travel
//    separately, in the array, so a value containing SQL can never run as SQL.
//    RETURNING * hands back the row the database just made, id and all.
async function addOneAnimal(name, category, can_fly, lives_in) {
  const result = await db.query(
    `INSERT INTO lesson_animals
       (name, category, can_fly, lives_in)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, category, can_fly, lives_in],
  );

  return result.rows[0];
}

// 3. The POST endpoint. async because the database takes time, and await is
//    what waits for it. Exactly one response goes back.
app.post("/add-one-animal", async (req, res) => {
  const { name, category, can_fly, lives_in } = req.body;

  const animal = await addOneAnimal(name, category, can_fly, lives_in);

  res.send(`The farm has grown: ${animal.name} was added!`);
});

// 4. The helper that reads. ORDER BY id keeps the rows in a predictable order.
async function getAllAnimals() {
  const result = await db.query("SELECT * FROM lesson_animals ORDER BY id");

  return result.rows;
}

// 5. The GET endpoint. res.json sends the array and sets the Content-Type
//    header, which is what lets response.json() read it on the other end.
app.get("/get-all-animals", async (req, res) => {
  const animals = await getAllAnimals();

  res.json(animals);
});

// ███████████████████████████████████████████████████████████████████████████
//   TOPIC 3          client/src/pages/AnimalList.jsx
//
//   The import at the top of that file becomes:
//     import { useState, useEffect } from "react";
// ███████████████████████████████████████████████████████████████████████████

function AnimalList() {
  // 2. State. Starts as an empty array because the first render happens before
  //    any data exists, and map runs on an empty array quite happily.
  const [animals, setAnimals] = useState([]);

  // 1. The helper. Two awaits, because there are two waits: one for the server
  //    to answer, one to read the body of that answer.
  //    The /api is stripped by Vite on the way through. See vite.config.js.
  const getAnimals = async () => {
    const response = await fetch("/api/get-all-animals");
    const data = await response.json();
    setAnimals(data);
  };

  // 3. Runs after the first render, not during it. The empty array means once:
  //    without it, storing data would cause a render, which would fetch again.
  useEffect(() => {
    getAnimals();
  }, []);

  // 4. key is a stable id per item, so React can tell them apart between
  //    renders. The database id is ideal: unique, and it never changes.
  return (
    <ul>
      {animals.map((animal) => (
        <li key={animal.id}>
          <strong>{animal.name}</strong>, {animal.lives_in}
        </li>
      ))}
    </ul>
  );
}
