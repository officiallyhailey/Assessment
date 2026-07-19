// The queries. Every endpoint in index.js calls into here, and nothing in this
// file knows anything about requests or responses.

import db from "./db.js";

// ── STEP 2 ────────────────────────────────────────────────────────────
// Read every animal.
//
//   await db.query("SELECT * FROM lesson_animals ORDER BY id")
//   then return result.rows
//
// ORDER BY id keeps them in a predictable order.
export async function getAllAnimals() {
  // write it here
}
// ──────────────────────────────────────────────────────────────────────
