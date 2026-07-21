// Puts the table back to the three clients it starts with.
//
// This runs every time the server starts, so each restart is a clean slate. That keeps the check-in list to the same first three, Maya, Daniel and Priya, so a demo always begins from a known state and any row you add is obviously new.
//
// The work happens at the top level of the module, so importing this file waits for it to finish. A request cannot arrive mid reset.
//
// RESTART IDENTITY sets the id counter back to 1. Without it the next client added would get id 5, then 9, climbing forever, which is confusing when the point being made is that the database assigns the id.

import pg from "pg";
import config from "./config.js";

const db = new pg.Pool({
  connectionString: config.databaseUrl + "&uselibpqcompat=true",
  ssl: true,
});

await db.query("TRUNCATE client_form RESTART IDENTITY");

await db.query(`
  INSERT INTO client_form
    (name, age, email, mood, first_visit)
  VALUES
    ('Maya',   34, 'maya@example.com',   'anxious', true),
    ('Daniel', 41, 'daniel@example.com', 'hopeful', false),
    ('Priya',  29, 'priya@example.com',  'tired',   true)
`);

console.log("Table reset: Maya, Daniel, Priya");

// This pool was only needed for the reset. index.js makes its own.
await db.end();
