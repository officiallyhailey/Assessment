# Client check-in

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
| **Topic 3**, the React | `client/src/pages/ClientList.jsx` | the page, and the Network tab |

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

One table, `client_form`, already set up with three clients. If it ever
needs rebuilding:

```sql
CREATE TABLE client_form (
  id           SERIAL PRIMARY KEY,
  name         VARCHAR(100) NOT NULL,
  age          INTEGER,
  email        VARCHAR(255) NOT NULL UNIQUE,
  mood         VARCHAR(50),
  first_visit  BOOLEAN NOT NULL
);

INSERT INTO client_form
  (name, age, email, mood, first_visit)
VALUES
  ('Maya',   34, 'maya@example.com',   'anxious', true),
  ('Daniel', 41, 'daniel@example.com', 'hopeful', false),
  ('Priya',  29, 'priya@example.com',  'tired',   true);
```

The server puts the table back to those three every time it starts, so restarting is the reset. Since you restart after every edit anyway, you rarely have to think about it.

That is `server/src/seed.js`, imported at the top of `index.js`. Comment that import out if you ever want rows to survive a restart.

To reset without restarting, run the `TRUNCATE` and the `INSERT` above:

```sql
TRUNCATE client_form RESTART IDENTITY;
```

`RESTART IDENTITY` sets the id counter back to 1. Without it the next client gets id 5, then 9, climbing forever, which muddies the point that the database assigns the id.

---

## Trying the endpoints in Postman

`POST http://localhost:3001/add-one-client`

Body tab, raw, JSON:

```json
{
  "name": "Sam",
  "age": 27,
  "email": "sam@example.com",
  "mood": "nervous",
  "first_visit": true
}
```

No `id`. The column is `SERIAL`, so the database assigns it.

Then `GET http://localhost:3001/get-all-clients`. A reply saying it worked and
a row that is actually there are two different things, and this is what tells
them apart.

Send the same body twice and the second one fails with a 500, because `email` is
`UNIQUE`: no two clients can share an address. That is the constraint working,
not a bug in the endpoint. Change the email, or restart the server. (Leaving the
`name` out fails too, because `name` is `NOT NULL`. Two clients *can* share a
name, though.)

Note there is no `/api` in either URL. That prefix is a front end thing, and
Postman talks to the server directly.

---

## Why the front end says `/api` and the server does not

The page runs on 5173 and the server on 3001. A browser will not fetch across
two different origins by default, so `client/vite.config.js` forwards anything
starting with `/api` to the server and strips the prefix on the way:

```
the page asks for   /api/get-all-clients
the server sees     /get-all-clients
```

---

## Where things are

```
client/
  vite.config.js              the proxy
  src/
    App.jsx                   the page
    pages/ClientList.jsx      TOPIC 3
server/
  src/
    index.js                  TOPIC 2
    answer-key.js             the finished code for both
    config.js                 your Neon connection string, kept out of git
```
