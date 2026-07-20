# Live lesson

The template filled in during a session. Same shape as the class project: a Vite
and React client on **5173**, an Express and Postgres server on **3001**, and an
`/api` proxy between them.

Nothing is written except the setup. The website in this repo explains the
concepts; these files are where they get typed.

Lesson 1 is not here. It is SQL, done in Neon.

---

## Setup

```bash
cd server && npm install && cd ../client && npm install
cp server/src/config.example.js server/src/config.js   # paste your Neon string
```

```bash
cd server && npm start      # 3001
cd client && npm run dev    # 5173
```

Open **http://localhost:5173**.

---

## The two topics

| | Where you write | How you check it |
|---|---|---|
| **Topic 2**, POST endpoint | `server/src/index.js` | Postman |
| **Topic 3**, GET in React | `client/src/pages/AnimalList.jsx` | the page, and the Network tab |

**Topic 2** is the whole backend: `express.json()`, a helper that runs
`INSERT INTO`, the POST endpoint that calls it, a helper that runs `SELECT`, and
the GET endpoint that calls that. Both endpoints, both helpers, one file.

**Topic 3** is the React side: a helper that calls `fetch`, `useState` to hold
what comes back, `useEffect` to run it on load, and the JSX that renders it.

Teaching topic 3 on its own? Paste the topic 2 block from `answer-key.js` into
`index.js` first. The React needs an endpoint to call, and writing that endpoint
is the other lesson.

---

## The table

One table, `lesson_animals`, already set up. If it needs recreating:

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

After a session, put it back with `TRUNCATE lesson_animals RESTART IDENTITY;`
and the `INSERT` again.

---

## Testing topic 2 in Postman

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

`id` is never sent. `SERIAL` means the database makes it.

Then `GET http://localhost:3001/get-all-animals` to prove the row really
landed. A friendly reply and a stored row are two different claims.

No `/api` in either: that prefix belongs to the client. Postman talks to the
server directly.

---

## The files

```
client/
  vite.config.js              the proxy, and the only place 3001 is named here
  src/
    App.jsx                   the page frame, given
    pages/AnimalList.jsx      TOPIC 3 goes here
server/
  src/
    index.js                  TOPIC 2 goes here
    answer-key.js             what goes in both
    config.js                 your Neon string, gitignored
```

---

## The `/api` prefix

The client asks for `/api/get-all-animals`. The server answers
`/get-all-animals`. Both are right: they are different origins, so
`client/vite.config.js` forwards `/api` to port 3001 and strips the prefix.

```
page asks for      /api/get-all-animals
server receives    /get-all-animals
```
