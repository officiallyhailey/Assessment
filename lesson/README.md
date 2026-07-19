# The live lesson project

The files coded in front of a room. This is a real client and server pair, the
same shape as the class project: **Vite + React on 5173, Express + Postgres on
3001, and an `/api` proxy between them.**

It is deliberately not part of the website. The website is the proof of concept,
where the lesson and its examples run on the page so nobody has to open a file.
This is the backend build, so what gets typed in the room is what the class
project actually looks like.

---

## First time

```bash
cp server/src/config.example.js server/src/config.js   # paste your Neon string in
npm run install:all
npm run setup                                          # creates the table
```

`npm run setup` creates **`lesson_animals`** and fills it with the original
three. That is its own table: a live session adds and deletes rows, and none of
it touches what the website is showing.

---

## Running a session

Pick the lesson, then start it.

```bash
npm run session 2        # lesson 2, blanks to fill in
npm run session 3        # lesson 3, blanks
```

```bash
npm run server           # terminal 1
npm run client           # terminal 2, lesson 3 only, then open localhost:5173
```

If the room runs out of time, or you want to rehearse from the finished state:

```bash
npm run session 2 done
npm run session 3 done
```

Back to the original three animals at any point:

```bash
npm run setup
```

---

## What each lesson writes

Only one topic is taught in a session, so the other one is not merely hidden,
it is not there. Lesson 2 has no GET endpoint at all; lesson 3 has no POST.

| Lesson | Files you write | How you see it work |
|---|---|---|
| 2, POST | `server/src/index.js`, `server/src/animals-helpers.js` | `server/requests.http`, or Postman |
| 3, GET | both of those, plus `client/src/AnimalList.jsx` | the page on localhost:5173 |

Lesson 1 is SQL and needs none of this. It lives in `lesson-1-sql/` and gets
pasted into DB Fiddle, which hands out a fresh database each time.

---

## The `/api` prefix

This catches people out, so it is worth saying once.

The client asks for `/api/get-all-animals`. The server answers
`/get-all-animals`. Both are correct: the client and server are different
origins, so `client/vite.config.js` forwards anything starting with `/api` to
port 3001 and **strips the prefix on the way**.

```
component asks for   /api/get-all-animals
server receives      /get-all-animals
```

That is why `requests.http` has no `/api` in it: it talks to the server
directly, with no client in between.

---

## Where things live

```
client/
  vite.config.js        the proxy, and the only place 3001 is named on this side
  index.html
  src/
    main.jsx            entry point
    App.jsx             the page frame
    AnimalList.jsx      written in lesson 3
server/
  src/
    index.js            the endpoints, written in lessons 2 and 3
    animals-helpers.js  the queries, written in lessons 2 and 3
    db.js               the connection pool, given
    config.js           your Neon string, gitignored
    setup.js            creates and fills lesson_animals
  requests.http         the POST requests for lesson 2
variants/               the blank and finished copies session swaps in
```

Nothing in `client/` other than `AnimalList.jsx` is touched during a lesson, and
nothing in `server/src/` other than `index.js` and `animals-helpers.js`.

---

## Teaching notes

**Lesson 2.** Send the POST before writing `express.json()` to show `req.body`
arriving as undefined, then add the line and send again. Request 4 in
`requests.http` makes the same point from the other direction: the body is sent
but no header says what it is, so nothing parses it.

Request 3 sends no name, which the table refuses because the column is
`NOT NULL`. Express 5 answers 500 on its own and stays up. Checking for it
first, and answering 400 instead, is the natural next thing to add.

**Lesson 3.** Write the endpoint first and open
`localhost:3001/get-all-animals` in a browser. If that is wrong, the component
looks broken for a reason that has nothing to do with React.

Once the list appears, delete the empty array from `useEffect` with the Network
tab open. The endless loop is worth causing on purpose.
