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

### Two tables, so no lesson waits on another

| Table | Who uses it |
|---|---|
| `lesson_one_table` | lesson 1 only. It does not exist until lesson 1 creates it |
| `lesson_animals` | lessons 2 and 3. Already there, already filled |

Only one topic is taught in a session and nobody knows which in advance, so
lesson 2 and lesson 3 must not depend on lesson 1 having been done. They read a
table that is already set up, and lesson 1's table is its own.

Set `lesson_animals` up once:

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

After a lesson 2 session, put `lesson_animals` back:

```sql
TRUNCATE lesson_animals RESTART IDENTITY;
```

then run its `INSERT` again. To rehearse lesson 1 from scratch,
`DROP TABLE lesson_one_table;` and its page goes back to saying there is none.
