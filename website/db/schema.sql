-- The animals table, and the three rows the site starts with.
--
-- Paste this into Neon's SQL Editor once, when setting the project up.
--
-- The CREATE TABLE and INSERT below are character for character the same as
-- the sample taught in Lesson 01 (client/src/data/lessons/sql-tables.js). That
-- is deliberate: the table the site teaches is the table the site runs on, and
-- if one is edited the other has to be edited with it.

CREATE TABLE animals (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL UNIQUE,
  category    VARCHAR(50),
  can_fly     BOOLEAN NOT NULL,
  lives_in    VARCHAR(100),
  population  INTEGER
);

INSERT INTO animals
  (name, category, can_fly, lives_in, population)
VALUES
  ('Lion',    'Mammal', false, 'Savanna',    23000),
  ('Penguin', 'Bird',   false, 'Antarctica', 1200000),
  ('Eagle',   'Bird',   true,  'Mountains',  5000);
