# Backend lessons

A teaching tool for a short backend course, in two parts:

- **`website/`** — the lesson plan. Three interactive lessons that explain each
  concept and show the code beside it, with the examples running right on the page.
- **`live-lesson/`** — the pure back end and front end those lessons cover, as a
  clean project to run and build during the session.

Both parts talk to the same database.

---

## `website/`

The three lessons, as an interactive site:

1. **Create a table with SQL** — `CREATE TABLE`, `INSERT`, `SELECT`
2. **Create a POST endpoint** — Express, `req.body`, saving a row
3. **Send a GET request in React** — `fetch`, `useState`, `useEffect`, rendering the data

Each lesson explains the idea in plain language with the code alongside it. Hover a
word for what it means, hover a line for when it runs, and press **Try it** to send
a real request against the live database.

```bash
cd website
npm run install:all
cp server/src/config.example.js server/src/config.js   # paste your Neon string
npm run dev                                            # localhost:5174
```

More detail in `website/README.md`.

---

## `live-lesson/`

The same code the website samples, as a running project you build in the room:
React + Vite on 5173, Express + Postgres on 3001, an `/api` proxy between them, and
one `server/src/index.js` holding the connection, the helper functions and the
endpoints. `answer-key.js` has the finished version of each section, with notes.

```bash
cd live-lesson
cd server && npm install && npm start      # 3001
cd client && npm install && npm run dev    # 5173
```

More detail in `live-lesson/README.md`.

---

## File structure

```
website/
  client/src/
    data/lessons/          the three lessons, written as data
      sql-tables.js          lesson 1
      post-endpoint.js       lesson 2
      react-get.js           lesson 3
    components/            the code panel, the Try-it demos, the form preview
    pages/                 the lesson pages and the "all three" page
    lib/  styles/          helpers and CSS
  server/src/              the API the Try-it demos call
    index.js                 the endpoints
    helpers.js               the SQL, one function per query
    db.js                    the Neon connection
  db/schema.sql            the client_form table

live-lesson/
  client/src/
    App.jsx                the page
    pages/ClientList.jsx   lesson 3, the React that lists the clients
  server/src/
    index.js               the endpoints (lessons 2 and 3)
    answer-key.js          the finished code, with notes
    seed.js                resets the table to the original three on every start
```

---

## The database

Both parts talk to the same Neon Postgres database, and to the same table,
`client_form` — the therapy check-in table lesson 1 builds. The live project seeds
it back to the original three clients on every restart, so a session always starts
from a known state.

Each part keeps its Neon connection string in `server/src/config.js`, which is
gitignored, because that string is a password.
