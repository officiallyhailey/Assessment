-- LESSON 1.  Finished version.
--
-- The same file the scaffold builds up to, with the explanation written in.
-- Read it afterwards as the guide to what you just wrote.
-- Paste into DB Fiddle set to PostgreSQL and press Run.


-- ---------------------------------------------------------------------------
-- STEP 1.  Create the table.
--
-- Each line inside the brackets defines one column, always in the same order:
-- name, then data type, then any rules.
--
-- The data type decides what the column can hold. The rules, called
-- constraints, decide what the database will refuse.
--
--   SERIAL        a number the database assigns itself, counting up from 1
--   PRIMARY KEY   this column identifies the row: unique, and never empty
--   VARCHAR(100)  text, up to 100 characters
--   NOT NULL      a value is required
--   UNIQUE        no two rows may share this value
--   BOOLEAN       only true or false, written without quotes
--   INTEGER       a whole number, so it sorts and totals correctly
--
-- category has no rules after its type, which is a decision: that column is
-- optional and a row may leave it empty.
-- ---------------------------------------------------------------------------
CREATE TABLE animals (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL UNIQUE,
  category    VARCHAR(50),
  can_fly     BOOLEAN NOT NULL,
  lives_in    VARCHAR(100),
  population  INTEGER
);


-- ---------------------------------------------------------------------------
-- STEP 2.  Add three rows.
--
-- INSERT INTO names the table, then the columns being filled. Each set of
-- brackets after VALUES is one row, and the values line up with that column
-- list in order.
--
-- id is deliberately missing, because SERIAL fills it in. Listing the column
-- names is worth the extra typing: it keeps working if someone adds a column
-- later, where relying on position would quietly start putting values in the
-- wrong places.
--
-- Text is quoted. Numbers and true/false are not, because they are not text.
-- ---------------------------------------------------------------------------
INSERT INTO animals
  (name, category, can_fly, lives_in, population)
VALUES
  ('Lion',    'Mammal', false, 'Savanna',    23000),
  ('Penguin', 'Bird',   false, 'Antarctica', 1200000),
  ('Eagle',   'Bird',   true,  'Mountains',  5000);


-- ---------------------------------------------------------------------------
-- STEP 3.  Read everything back.
--
-- SELECT reads data. The star means every column, and FROM says which table.
-- With no WHERE, every row comes back. Fine on three rows, worth thinking
-- twice about on three million.
-- ---------------------------------------------------------------------------
SELECT * FROM animals;


-- ---------------------------------------------------------------------------
-- STEP 4a.  Narrow the rows.
--
-- WHERE filters which rows come back. The single equals sign is a comparison
-- here, not an assignment, which catches people coming from other languages.
-- ---------------------------------------------------------------------------
SELECT * FROM animals
  WHERE name = 'Lion';


-- ---------------------------------------------------------------------------
-- STEP 4b.  Narrow the rows AND the columns.
--
-- Naming columns after SELECT limits what each row carries. Rows and columns
-- are controlled separately: WHERE only ever affects rows.
--
-- Filtering on a BOOLEAN needs no quotes, because true is a value and not a
-- piece of text.
-- ---------------------------------------------------------------------------
SELECT name, lives_in FROM animals
  WHERE can_fly = true;
