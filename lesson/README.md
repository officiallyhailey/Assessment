# Lesson folder

Runnable code for teaching, separate from the website.

**Each lesson stands completely on its own.** You will not know which topic you are teaching until the day, so no lesson needs anything from the other two. Open one folder, run one command, teach.

```
lesson-1-sql/      Topic 1, create a table and query it
lesson-2-post/     Topic 2, a POST endpoint that saves data
lesson-3-react/    Topic 3, a React page that fetches and shows data
```

Every lesson has two copies:

| Folder | What it is |
|---|---|
| `scaffold/` | Short numbered prompts, kept lean so it reads on a projector. What you write in front of the student. |
| `complete/` | The same file finished, with the full explanation in the comments. The guide to study afterwards. |

Both hold the **same file in the same shape**, so the student can put them side by side. The endpoint and its helper functions live in one file rather than two, so live coding runs top to bottom with no jumping between tabs. (A real project would split the helpers into their own file, which is what the lesson site shows.)

---

## How each one is made independent

Each lesson covers **one verb**, and nothing else. Lesson 2 sends data in, lesson 3 reads it back out. Neither contains the other's endpoint, so it is always clear which idea is on screen.

| Lesson | You write | Already working for you |
|---|---|---|
| 1, SQL | the whole file, in four steps | nothing needed, it runs in DB Fiddle |
| 2, POST | `express.json()`, the POST endpoint, the `addOneAnimal` helper including the file read and write | nothing, beyond the empty file |
| 3, GET | the GET endpoint including the file read, then the component: state, the fetch, `useEffect`, the JSX | the page shell and its styles |

Lesson 2 has no GET, so to confirm a POST saved you open `animals-data.json`. Lesson 3 has no POST.

Each lesson also keeps **its own copy of the animal data** (`animals-data.json`), so running one never changes another. That file is the live data and gets written to when you POST. `npm run lesson:reset` rewrites all of them back to the original three animals.

---

## Running them

Lesson 1 needs no server. Open `lesson-1-sql/` and paste the SQL into [DB Fiddle](https://www.db-fiddle.com/) set to PostgreSQL.

```bash
npm run lesson2            # Topic 2, finished      → http://localhost:3200
npm run lesson2:scaffold   # Topic 2, fill in

npm run lesson3            # Topic 3, finished      → http://localhost:3300
npm run lesson3:scaffold   # Topic 3, fill in
```

Different ports on purpose, so leaving one running never blocks the other.

Put the animals back to the original three before a session:

```bash
npm run lesson:reset
```

---

## Showing the data arrive

`lesson-2-post/requests.http` and `lesson-3-react/requests.http` open in VS Code with the REST Client extension, giving a Send Request link above each one. Postman works too, just copy the method, URL and body.

**Lesson 2** has five requests: GET the animals, POST a new one, GET again to prove it saved, then two deliberate failures. The last two both save an animal with `undefined` as its name without crashing, which is the useful part: a silent wrong result is harder to catch than an error, and it opens the conversation about checking data before saving it.

**Lesson 3** has one request, since the browser does the fetching. Sending it first shows the exact JSON the component will receive.

---

## Teaching notes

**Lesson 2.** Send the POST before writing `express.json()` to show `req.body` arriving as undefined, then add the line and send again. Once it works, open `animals-data.json` beside the editor: a friendly reply and a stored row are two different claims, and the file is the one that settles it.

**Lesson 3.** `public/AnimalList.jsx` is the only file to write in. Babel is loaded in the page, so it takes real JSX with no build step: write the steps, save, refresh, and the list appears. Once it works, delete the empty array from `useEffect` with the Network tab open to show the endless loop.

> Lesson 3 loads React and Babel from a CDN, so it needs internet. If that is a risk on the day, the same demo runs fully offline on the lesson website.
