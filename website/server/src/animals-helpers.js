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

// ---------------------------------------------------------------------------
// TOPIC 1. Read every row of client_form.
//
// The therapy check-in table topic 1 creates. Its own table so lesson 1 can be
// taught without disturbing the animals the other lessons use.
// ---------------------------------------------------------------------------
export async function getAllClientForm() {
  // checked_in_on is a DATE. The pg driver hands a DATE back as a JS Date,
  // which JSON turns into a full timestamp with a time and a zone. Casting it
  // to text keeps it the plain YYYY-MM-DD the form was filled in with, which is
  // what the query demo compares against and reads cleanly on screen.
  const result = await db.query(
    `SELECT id, name, age, state, mood, first_visit,
            checked_in_on::text AS checked_in_on
       FROM client_form
      ORDER BY id`,
  );
  return result.rows;
}

// ---------------------------------------------------------------------------
// TOPIC 2. Add one client to client_form and hand back the row created.
// ---------------------------------------------------------------------------
export async function addOneClient(name, age, mood, first_visit) {
  const result = await db.query(
    `INSERT INTO client_form
       (name, age, mood, first_visit)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, age, mood, first_visit],
  );

  return result.rows[0];
}

// Put client_form back to the three it starts with. Not part of any lesson.
export async function resetClientForm() {
  await db.query("TRUNCATE client_form RESTART IDENTITY");
  await db.query(
    `INSERT INTO client_form
       (name, age, state, mood, first_visit, checked_in_on)
     VALUES
       ('Maya',   34, 'Oregon',     'anxious', true,  '2026-02-10'),
       ('Daniel', 41, 'California',  'hopeful', false, '2026-02-11'),
       ('Priya',  29, 'New York',    'tired',   true,  '2026-02-12')`,
  );
  return getAllClientForm();
}
