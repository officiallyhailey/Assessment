# Live lesson

The template filled in during a session. Same shape as the class project: a Vite
and React client on **5173**, an Express and Postgres server on **3001**, and an
`/api` proxy between them.

The page has a picker for the three lessons. Each one says how to run it and
shows the data that comes back, so the room can see the code working rather than
being told it does.

The website in this repo explains the concepts. These files stay lean on
purpose: short comments, marked sections, and an answer key beside them.

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

## The three lessons

| Lesson | Where you work | What appears |
|---|---|---|
| 1, SQL | the Neon console | the table's contents on the page |
| 2, POST | `server/src/index.js` | your row joining the table |
| 3, GET | `server/src/index.js` | the list rendered by React |

**Lesson 1** is done in Neon, not in a file. The page shows the SQL to paste and
then reads the table back, so the room sees the table exists.

**Lesson 2** writes the POST. The GET it uses to check the row landed is already
written, marked `GIVEN`, so a new row appearing is proof the POST saved rather
than just replied nicely.

**Lesson 3** writes the GET. There is no POST in it and it needs none.

All three use one table, `lesson_one_table`, which lesson 1 creates.

---

## The files

```
client/
  vite.config.js        the proxy, and the only place 3001 is named here
  src/
    App.jsx             the lesson picker
    pages/
      LessonOne.jsx     the SQL to paste, and the table read back
      LessonTwo.jsx     the form that sends your POST
      LessonThree.jsx   the list your GET feeds
server/
  src/
    index.js            where you write, with a marked section per lesson
    answer-key.js       what goes in those sections
    config.js           your Neon string, gitignored
```

`index.js` is the only file written during a session. Everything in `client/` is
there so the result can be seen.

---

## The `/api` prefix

The client asks for `/api/get-all-animals`. The server answers
`/get-all-animals`. Both are right: they are different origins, so
`client/vite.config.js` forwards `/api` to port 3001 and strips the prefix.

```
page asks for      /api/get-all-animals
server receives    /get-all-animals
```

Postman uses the plain path, since it talks to the server directly.

---

## Starting over

Rerun the `INSERT` from lesson 1's page, or in Neon:

```sql
TRUNCATE lesson_one_table RESTART IDENTITY;
```

then paste the `INSERT` again.
