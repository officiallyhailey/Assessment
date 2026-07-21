-- The client_form table, and the three rows the site starts with.
--
-- Paste this into Neon's SQL Editor once, when setting the project up.
--
-- The CREATE TABLE and INSERT below are character for character the same as
-- the sample taught in Lesson 01 (client/src/data/lessons/sql-tables.js). That
-- is deliberate: the table the site teaches is the table the site runs on, and
-- if one is edited the other has to be edited with it.

CREATE TABLE client_form (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  age         INTEGER,
  email       VARCHAR(255) NOT NULL UNIQUE,
  mood        VARCHAR(50),
  first_visit BOOLEAN NOT NULL
);

INSERT INTO client_form
  (name, age, email, mood, first_visit)
VALUES
  ('Maya',   34, 'maya@example.com',   'anxious', true),
  ('Daniel', 41, 'daniel@example.com', 'hopeful', false),
  ('Priya',  29, 'priya@example.com',  'tired',   true);
