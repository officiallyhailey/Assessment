# Live lesson

The project coded in front of a room. Same shape as the class project: a Vite
and React client on **5173**, an Express and Postgres server on **3001**, and an
`/api` proxy between them.

Separate from the website in this repo on purpose. The website is the proof of
concept, where the lesson runs on the page and nobody has to open a file. This
is the backend build, so what gets typed in the room is what the class project
actually looks like.

---

## Setup

```bash
cd server && npm install && cd ../client && npm install
```

Copy the config and paste your Neon connection string into it:

```bash
cp server/src/config.example.js server/src/config.js
```

Then create the table. Paste this into the Neon SQL editor, or into DB Fiddle
set to PostgreSQL, which is also lesson 1.

It is called `lesson_animals` rather than `animals` so a session can add and
delete rows freely without touching what the website in this repo is showing.

```sql
CREATE TABLE lesson_animals (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL UNIQUE,
  category    VARCHAR(50),
  can_fly     BOOLEAN NOT NULL,
  lives_in    VARCHAR(100),
  population  INTEGER
);

INSERT INTO lesson_animals
  (name, category, can_fly, lives_in, population)
VALUES
  ('Lion',    'Mammal', false, 'Savanna',    23000),
  ('Penguin', 'Bird',   false, 'Antarctica', 1200000),
  ('Eagle',   'Bird',   true,  'Mountains',  5000);
```

---

## Running it

Two terminals, the same as the class project.

```bash
cd server && npm start      # 3001
cd client && npm run dev    # 5173
```

Open **http://localhost:5173**.

---

## What each lesson leaves behind

| Lesson | Where the result shows |
|---|---|
| 1, SQL | the table exists, and the three animals are in it |
| 2, POST | `addOneAnimal` and `POST /add-one-animal`, used by the form |
| 3, GET | `getAllAnimals` and `GET /get-all-animals`, used by the list |

`server/src/index.js` holds the connection, both helpers and both endpoints, in
that order. One file, the same as the class project.

To teach one lesson on its own, delete the parts belonging to the other and
write them back live.

---

## The `/api` prefix

The client asks for `/api/get-all-animals`. The server answers
`/get-all-animals`. Both are right: they are different origins, so
`client/vite.config.js` forwards `/api` to port 3001 and strips the prefix.

```
page asks for      /api/get-all-animals
server receives    /get-all-animals
```

That is why Postman uses the plain path: it talks to the server directly, with
no client in between.
