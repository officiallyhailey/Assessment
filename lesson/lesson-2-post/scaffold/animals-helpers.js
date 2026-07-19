// LESSON 2, the helper.  One thing to write, at STEP 3.

import db from "./db.js";

// ── STEP 3 ────────────────────────────────────────────────────────────
// Save one animal and return it.
//
//   await db.query(...) with two arguments:
//     1. the SQL:  INSERT INTO animals (columns) VALUES ($1, $2, $3, $4)
//                  RETURNING *
//     2. an array of the four values, in the same order
//
//   then return result.rows[0]
//
// The $1 placeholders keep the values separate from the command.
// RETURNING * hands back the row the database just made, id and all.
export async function addOneAnimal(name, category, can_fly, lives_in) {
  // write it here
}
// ──────────────────────────────────────────────────────────────────────
