# Lesson 1, create a database table with SQL

Nothing to install and no server to start. This lesson is one file.

- `complete/animals.sql` finished, to show the end result
- `scaffold/animals.sql` the same thing as numbered instructions, to write live

## Running it

Open [DB Fiddle](https://www.db-fiddle.com/), set the database to **PostgreSQL**,
paste into the left panel and press Run. The results appear on the right.

Worth doing once before the session so the site is already open and set up.

## Teaching notes

Run the CREATE TABLE on its own first, so there is a moment where the table
exists and holds nothing. Then insert, then query.

Two failures worth causing on purpose:

- Insert a second animal with a name that already exists, and read the error
  the UNIQUE constraint gives back.
- Insert an animal with no name, and watch NOT NULL reject it.

Both make the point that the rules live in the table, not in the code that
happens to be writing to it.
