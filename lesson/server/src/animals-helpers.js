// The queries. Every endpoint in index.js calls into here, and nothing in this
// file knows anything about requests or responses.

import db from "./db.js";

// ---------------------------------------------------------------------------
// STEP 2.  Save one animal and return it.
//
// $1 and $2 are placeholders. The values travel separately, in the array below,
// and the database never reads them as part of the command. Building the query
// by joining strings would let a value containing SQL run as SQL, which is
// called SQL injection, and this is what prevents it.
//
// RETURNING * asks for the row that was just created, including the id the
// database generated. Without it a second query would be needed to find out.
//
// db.query answers with a result object. The rows are on it in an array, and
// one row was inserted, so that array has exactly one entry.
// ---------------------------------------------------------------------------
export async function addOneAnimal(name, category, can_fly, lives_in) {
  const result = await db.query(
    `INSERT INTO lesson_animals
       (name, category, can_fly, lives_in)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, category, can_fly, lives_in],
  );

  return result.rows[0];
}
