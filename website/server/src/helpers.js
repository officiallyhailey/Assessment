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

// TOPIC 1 / 3. Read every row of the check-in table.
export async function getAllClientForm() {
  const result = await db.query(
    `SELECT id, name, age, email, mood, first_visit
       FROM client_form
      ORDER BY id`,
  );
  return result.rows;
}

// TOPIC 3. Find one client by id, for the route-parameter demo.
export async function getOneClientById(id) {
  const result = await db.query(
    "SELECT id, name, age, email, mood, first_visit FROM client_form WHERE id = $1",
    [id],
  );
  return result.rows[0];
}

// TOPIC 2. Add one client to client_form and hand back the row created.
//
// RETURNING * asks the database for the row it just wrote, including the id it
// generated, so no second query is needed to find out what was saved. email is
// UNIQUE, so a second client with the same address is refused by the database.
export async function addOneClient(name, age, email, mood, first_visit) {
  const result = await db.query(
    `INSERT INTO client_form
       (name, age, email, mood, first_visit)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [name, age, email, mood, first_visit],
  );

  return result.rows[0];
}

// Put client_form back to the three it starts with. Not part of any lesson.
//
// TRUNCATE empties the table, and RESTART IDENTITY takes the id counter back to
// 1 with it: without that the ids would keep climbing after every reset, and
// the lessons talk about the first three clients having ids 1, 2 and 3.
export async function resetClientForm() {
  await db.query("TRUNCATE client_form RESTART IDENTITY");
  await db.query(
    `INSERT INTO client_form
       (name, age, email, mood, first_visit)
     VALUES
       ('Maya',   34, 'maya@example.com',   'anxious', true),
       ('Daniel', 41, 'daniel@example.com', 'hopeful', false),
       ('Priya',  29, 'priya@example.com',  'tired',   true)`,
  );
  return getAllClientForm();
}
