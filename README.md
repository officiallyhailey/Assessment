# Backend Lessons

A teaching tool for three backend topics: creating a table with SQL, building a POST endpoint with Express, and fetching data into React.

It is two things in one repository:

- a **website** that presents each lesson with runnable, annotated code
- a **lesson folder** of plain files to code live in front of a student

Only one topic is taught in any given session, and which one is not known in advance, so **every lesson stands completely on its own**. No lesson depends on another to run or to show its data.

---

## Running it

```bash
npm install
npm run dev
```

Open **http://localhost:5174**

That starts two processes at once:

| Piece | Port | What it is |
|---|---|---|
| API | 3000 | Express server holding the animals data |
| APP | 5174 | The lesson website |

Stop both with `Ctrl + C`. To put the animals back to the original three:

```bash
npm run reset
```

> Keep this project on a local drive. `npm install` creates thousands of files, and if the folder sits in iCloud the sync daemon saturates the file system and Vite hangs on startup.

---

## Where things live

```
server/          the API the demos talk to
src/             the website
lesson/          plain files for coding live in a session
public/          logo and the three lesson illustrations
```

### The API

Everything server-side is in **`server/`**, and it is deliberately small.

| File | What it does |
|---|---|
| `server.js` | The three endpoints, and the only place routes are defined |
| `animals-helpers.js` | Reads and writes the data. The endpoints call these and never touch the file directly |
| `animals-data.json` | The data itself. This is the file that changes when you POST |
| `reset.js` | Rewrites the data back to the original three animals |

The endpoints:

| Method | Path | Returns |
|---|---|---|
| `GET` | `/get-all-animals` | Every animal |
| `GET` | `/get-one-animal-by-id/:id` | One animal, or nothing |
| `POST` | `/add-one-animal` | A confirmation message, and saves a row |
| `POST` | `/reset-animals` | The original three animals, and rewrites the file |

`/reset-animals` is not part of any lesson. It backs the **Reset the data** button on the All Together page, so a class that has been adding rows can start clean without leaving the browser. It runs the same code as `npm run reset`.

The website runs on a different port from the API, so `vite.config.mjs` forwards those three paths to port 3000. That is why the demos can call `/get-all-animals` as if it were local.

**Data is a JSON file rather than a real database on purpose.** It keeps setup to `npm install`, and the helper functions have the same shape they would have against Postgres, with the equivalent SQL written above each one.

### The website

```
src/
├── main.jsx              entry point
├── App.jsx               routes
├── pages/
│   ├── Home.jsx          the landing page
│   ├── Lesson.jsx        one lesson: rail, content, pinned code panel
│   └── Together.jsx      all three topics as one path
├── components/
│   ├── Blocks.jsx        renders lesson content from data
│   ├── CodeExplorer.jsx  the code panel with its explanation modes
│   ├── ResultView.jsx    what a code sample produces when it runs
│   ├── CodeBlock.jsx     a plain snippet with a copy button
│   ├── Vocab.jsx         expandable line-by-line rows
│   ├── More.jsx          the optional depth dropdown
│   └── demos/            the four interactive panels
├── data/
│   ├── lessons/          one file per lesson, plus an index
│   ├── annotations.js    per-line notes for Context and Flow modes
│   └── concepts.js       word definitions for Concept mode
├── lib/
│   ├── api.js            every call to the API goes through here
│   └── tokenize.js       splits code into coloured, hoverable tokens
└── styles/               one stylesheet per area, imported by index.css
```

**Lesson content is data, not markup.** A lesson is an object with sections, and each section is a list of blocks (`p`, `table`, `code`, `vocab`, `demo`, and so on). `Blocks.jsx` turns those into elements. To change what a lesson says, edit its file in `src/data/lessons/` and nothing else.

**All network calls go through `src/lib/api.js`.** No component calls `fetch` directly. If the API moves or gains a route, that file is the only thing to change.

---

## How a lesson page is built

Three things combine per lesson:

1. **`src/data/lessons/<name>.js`** for the prose, tables and code samples
2. **`src/data/annotations.js`** for per-line notes, keyed by the sample's file name
3. **`src/data/concepts.js`** for definitions of individual words

The code panel has four explanation modes:

| Mode | What hovering shows |
|---|---|
| Plain | nothing, just the coloured code |
| Concept | what that word means |
| Context | what that line does for the program |
| Flow | when that line runs, numbered |

Flow is the interesting one. In the React sample the numbers run **1, 2, 5, 6, 7, 4, 3, 8** down the page, because the render happens before the effect. Execution order is not line order, and the badges make that visible rather than something you have to assert.

Each sample can also carry a `result`, which powers the **Code / Results** toggle. Results are fetched live from the API, so a student sees the real rows rather than a screenshot.

On screens wider than 1400px the code panel pins to the right and stays visible while the explanation scrolls beside it, which is what makes it usable when projecting. Below that width the code falls back inline.

---

## The lesson folder

`lesson/` is separate from the website: plain files to open in an editor and run during a session. Each topic has its own folder, and each has two copies.

| Folder | What it is |
|---|---|
| `scaffold/` | Short numbered prompts. What you write in front of the student |
| `complete/` | The same file finished, with the full explanation in the comments |

```bash
npm run lesson2            # Topic 2, finished       → localhost:3200
npm run lesson2:scaffold   # Topic 2, fill in
npm run lesson3            # Topic 3, finished       → localhost:3300
npm run lesson3:scaffold   # Topic 3, fill in
npm run lesson:reset       # all lesson data back to the original three animals
```

Topic 1 needs no server: paste `lesson/lesson-1-sql/` into DB Fiddle.

**Each lesson blanks only its own material** and is handed everything else already working. Lesson 2 gets a working GET so a POST can be verified. Lesson 3 gets the entire server so there is real data from the first second. Different ports mean leaving one running never blocks another.

See `lesson/README.md` for the teaching notes, including the failures worth causing deliberately.

---

## Making changes

| To change | Edit |
|---|---|
| What a lesson says | `src/data/lessons/<name>.js` |
| A line-by-line note | `src/data/annotations.js` |
| A word definition | `src/data/concepts.js` |
| An endpoint | `server/server.js` |
| The starting data | `server/reset.js`, then `npm run reset` |
| How code is coloured | `src/lib/tokenize.js` |
| Styling | the matching file in `src/styles/` |

Adding a lesson means creating a file in `src/data/lessons/`, exporting it, and adding it to the array in `index.js`. Routing, navigation and the landing page all read from that array, so nothing else needs touching.
