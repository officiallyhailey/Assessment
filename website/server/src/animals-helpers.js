// ---------------------------------------------------------------------------
// HELPER FUNCTIONS
//
// All the SQL lives here. The endpoints in index.js call these and never write
// a query themselves, which is the split the class project uses: the endpoint
// is about the request and the response, the helper is about the data.
//
// Every one of these is a real query against a real Postgres database. Values
// are always passed separately, as $1, $2, so a value can never be read as
// part of the command.
// ---------------------------------------------------------------------------

import db from "./db.js";

// Read every animal.
export async function getAllAnimals() {
  const result = await db.query("SELECT * FROM animals ORDER BY id");
  return result.rows;
}

// Find one animal by its id.
export async function getOneAnimalById(id) {
  const result = await db.query("SELECT * FROM animals WHERE id = $1", [id]);
  return result.rows[0];
}

// Add a new animal and hand back the row that was created.
//
// RETURNING * asks the database for the row it just wrote, including the id it
// generated, so no second query is needed to find out what was saved.
export async function addOneAnimal(name, category, can_fly, lives_in) {
  const result = await db.query(
    `INSERT INTO animals
       (name, category, can_fly, lives_in)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, category, can_fly, lives_in],
  );

  return result.rows[0];
}

// Put the table back to the three animals the site starts with.
//
// Not part of any lesson. TRUNCATE empties the table, and RESTART IDENTITY
// takes the id counter back to 1 with it: without that the ids would keep
// climbing after every reset, and the lessons talk about the first three
// animals having ids 1, 2 and 3.
export async function resetAnimals() {
  await db.query("TRUNCATE animals RESTART IDENTITY");
  await db.query(
    `INSERT INTO animals
       (name, category, can_fly, lives_in, population)
     VALUES
       ('Lion',    'Mammal', false, 'Savanna',    23000),
       ('Penguin', 'Bird',   false, 'Antarctica', 1200000),
       ('Eagle',   'Bird',   true,  'Mountains',  5000)`,
  );

  return getAllAnimals();
}
