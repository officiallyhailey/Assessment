// Creates the table this project uses, and fills it with the three animals.
//
// It is deliberately its OWN table, lesson_animals, rather than the one the
// website uses. A live session adds and deletes rows, and none of that should
// touch what the site is showing.
//
//   npm run setup        from lesson/server, or npm run session:setup from the root

import pg from "pg";
import config from "./config.js";

const db = new pg.Pool({
  connectionString: config.databaseUrl + "&uselibpqcompat=true",
  ssl: true,
});

await db.query(`
  CREATE TABLE IF NOT EXISTS lesson_animals (
    id          SERIAL PRIMARY KEY,
    name        VARCHAR(100) NOT NULL UNIQUE,
    category    VARCHAR(50),
    can_fly     BOOLEAN NOT NULL,
    lives_in    VARCHAR(100),
    population  INTEGER
  )
`);

await db.query("TRUNCATE lesson_animals RESTART IDENTITY");

const { rows } = await db.query(`
  INSERT INTO lesson_animals
    (name, category, can_fly, lives_in, population)
  VALUES
    ('Lion',    'Mammal', false, 'Savanna',    23000),
    ('Penguin', 'Bird',   false, 'Antarctica', 1200000),
    ('Eagle',   'Bird',   true,  'Mountains',  5000)
  RETURNING *
`);

console.log("");
console.log(`  lesson_animals ready. ${rows.length} animals: ${rows.map((r) => r.name).join(", ")}`);
console.log("");

await db.end();
