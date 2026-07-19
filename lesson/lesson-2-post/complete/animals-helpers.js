// LESSON 2, the helper.  Finished version.
//
// This file is about the data. It knows nothing about requests or responses:
// hand it four values, get back the animal that was saved. That is why it could
// be called from anywhere, not just from an endpoint.

import db from "./db.js";

// ---------------------------------------------------------------------------
// STEP 3.  Save one animal and return it.
//
// One query does the whole job. The database generates the id, so nothing here
// has to work out what the next one should be.
//
// $1 and $2 are placeholders. The values travel separately, in the array below,
// and the database never treats them as part of the command. Building the
// query by joining strings would let a value containing SQL run as SQL, which
// is called SQL injection, and this is what prevents it.
//
// RETURNING * asks for the row that was just created, including the id it was
// given. Without it, a second query would be needed to find out what was saved.
//
// db.query answers with a result object describing the query. The rows are on
// it in an array, and one row was inserted, so that array has one entry.
// ---------------------------------------------------------------------------
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
