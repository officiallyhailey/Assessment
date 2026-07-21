// The same helpers, backed by an in-memory store instead of Postgres.
//
// NOT THE TEACHING VERSION. helpers.js is the one the lessons show and the one
// that matches the class project. This exists only so a dead network cannot
// cancel a session: `npm run dev:offline` swaps it in and everything on the
// site behaves the same.
//
// It keeps the same function names, arguments and return shapes as the real
// one, so index.js cannot tell which it is talking to.

const BASE = [
  { id: 1, name: "Maya", age: 34, email: "maya@example.com", mood: "anxious", first_visit: true },
  { id: 2, name: "Daniel", age: 41, email: "daniel@example.com", mood: "hopeful", first_visit: false },
  { id: 3, name: "Priya", age: 29, email: "priya@example.com", mood: "tired", first_visit: true },
];

// The rows the writes see, kept in memory. Null means "back to the original three".
let CLIENT_ROWS = null;

// TOPIC 1 / 3. Read every row of the check-in table.
export async function getAllClientForm() {
  const rows = CLIENT_ROWS || BASE;
  return [...rows].sort((a, b) => a.id - b.id);
}

// TOPIC 3. Find one client by id. A route parameter arrives as text, so it is
// compared as a number.
export async function getOneClientById(id) {
  const rows = await getAllClientForm();
  return rows.find((client) => client.id === Number(id));
}

// TOPIC 2. Add one client and hand back the row created. id stands in for SERIAL,
// and the duplicate check stands in for the UNIQUE constraint on email.
export async function addOneClient(name, age, email, mood, first_visit) {
  if (!CLIENT_ROWS) CLIENT_ROWS = BASE.map((c) => ({ ...c }));
  if (CLIENT_ROWS.some((c) => c.email === email)) {
    throw new Error(`duplicate key value violates unique constraint: email ${email} already exists`);
  }
  const id = Math.max(0, ...CLIENT_ROWS.map((c) => c.id)) + 1;
  const row = { id, name, age, email, mood, first_visit };
  CLIENT_ROWS.push(row);
  return row;
}

// Put the table back to the three it starts with. Not part of any lesson.
export async function resetClientForm() {
  CLIENT_ROWS = null;
  return getAllClientForm();
}
