// Puts the table back to the three animals it starts with.
//
// This runs every time the server starts, so each restart is a clean slate. That matters because name is UNIQUE: without it, sending the same animal twice fails the second time with a duplicate key error, which looks like a bug in your endpoint and is not.
//
// The work happens at the top level of the module, so importing this file waits for it to finish. A request cannot arrive mid reset.
//
// RESTART IDENTITY sets the id counter back to 1. Without it the next animal added would get id 5, then 9, climbing forever, which is confusing when the point being made is that the database assigns the id.

import pg from "pg";
import config from "./config.js";

const db = new pg.Pool({
  connectionString: config.databaseUrl + "&uselibpqcompat=true",
  ssl: true,
});

await db.query("TRUNCATE lesson_animals RESTART IDENTITY");

await db.query(`
  INSERT INTO lesson_animals
    (name, category, can_fly, lives_in, population)
  VALUES
    ('Lion',    'Mammal', false, 'Savanna',    23000),
    ('Penguin', 'Bird',   false, 'Antarctica', 1200000),
    ('Eagle',   'Bird',   true,  'Mountains',  5000)
`);

console.log("Table reset: Lion, Penguin, Eagle");

// This pool was only needed for the reset. index.js makes its own.
await db.end();
