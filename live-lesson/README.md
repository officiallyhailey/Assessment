# Animals

A small full stack app: a React front end, an Express server, and a Postgres
database on Neon.

You are writing two things. The endpoints that talk to the database, and the
React that puts what comes back on the page.

---

## Getting it running

```bash
cd server && npm install && cd ../client && npm install
cp server/src/config.example.js server/src/config.js   # paste your Neon string
```

Two terminals, because they are two programs:

```bash
cd server && npm start      # 3001
cd client && npm run dev    # 5173
```

Open **http://localhost:5173**.

---

## What you are writing

| | File | How you check it |
|---|---|---|
| **Topic 2**, the endpoints | `server/src/index.js` | Postman |
| **Topic 3**, the React | `client/src/pages/AnimalList.jsx` | the page, and the Network tab |

**Topic 2** is the back end. A helper that runs `INSERT INTO` and the POST
endpoint that calls it, then a helper that runs `SELECT` and the GET endpoint
that calls that. The helpers do the database work; the endpoints handle the
request and the response.

**Topic 3** is the front end. A function that fetches, `useState` to hold what
comes back, `useEffect` to run it when the page loads, and JSX to render it.

Each file has the steps written out where the code goes. `answer-key.js` has
the finished version if you need it.

Starting on topic 3 without having done topic 2? Paste the topic 2 block from
the answer key into `index.js` first, so there is an endpoint to call.

---

## The data

One table, `lesson_animals`, already set up with three animals. If it ever
needs rebuilding:

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

To clear out anything added while testing:

```sql
TRUNCATE lesson_animals RESTART IDENTITY;
```

then run the `INSERT` again.

---

## Trying the endpoints in Postman

`POST http://localhost:3001/add-one-animal`

Body tab, raw, JSON:

```json
{
  "name": "Falcon",
  "category": "Bird",
  "can_fly": true,
  "lives_in": "Cliffs"
}
```

No `id`. The column is `SERIAL`, so the database assigns it.

Then `GET http://localhost:3001/get-all-animals`. A reply saying it worked and
a row that is actually there are two different things, and this is what tells
them apart.

Note there is no `/api` in either URL. That prefix is a front end thing, and
Postman talks to the server directly.

---

## Why the front end says `/api` and the server does not

The page runs on 5173 and the server on 3001. A browser will not fetch across
two different origins by default, so `client/vite.config.js` forwards anything
starting with `/api` to the server and strips the prefix on the way:

```
the page asks for   /api/get-all-animals
the server sees     /get-all-animals
```

---

## Where things are

```
client/
  vite.config.js              the proxy
  src/
    App.jsx                   the page
    pages/AnimalList.jsx      TOPIC 3
server/
  src/
    index.js                  TOPIC 2
    answer-key.js             the finished code for both
    config.js                 your Neon connection string, kept out of git
```
