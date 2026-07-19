// The queries. Every endpoint in index.js calls into here, and nothing in this
// file knows anything about requests or responses.

import db from "./db.js";

// ---------------------------------------------------------------------------
// STEP 2.  Read every animal.
//
// ORDER BY id keeps them in a predictable order. Without it the database is
// free to hand them back in any order it likes, which usually looks fine and
// occasionally does not.
//
// The rows come back on result.rows, so that is what gets returned: the
// endpoint wants animals, not a result object.
// ---------------------------------------------------------------------------
export async function getAllAnimals() {
  const result = await db.query("SELECT * FROM lesson_animals ORDER BY id");

  return result.rows;
}
