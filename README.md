# Backend lessons

Two separate projects, one repo. They share nothing but a database.

```
website/       the teaching site
live-lesson/   the project coded in front of a room
```

---

## `website/`

The proof of concept. Three lessons with their examples running on the page, so
the concept can be grasped without opening a file or starting a server. Hover a
word for what it means, hover a line for when it runs, press Try it to send a
real request.

```bash
cd website
npm run install:all
cp server/src/config.example.js server/src/config.js   # your Neon string
npm run dev                                            # localhost:5174
```

See `website/README.md`.

---

## `live-lesson/`

The backend build. Same shape as the class project: Vite and React on 5173,
Express and Postgres on 3001, an `/api` proxy between them, and one
`server/src/index.js` holding the connection, the helpers and the endpoints.

Nothing about it is arranged around the website. That is the point: what gets
typed in the room is what the class project actually looks like.

```bash
cd live-lesson
cd server && npm install && npm start      # 3001
cd client && npm install && npm run dev    # 5173
```

See `live-lesson/README.md`.

---

## Why two

They answer different questions. The website has to explain a concept to
somebody who has not met it, which needs prose, hover notes and code that can be
pointed at. The live project has to be the thing itself, with nothing extra in
it, because a folder that does not match what a student was taught teaches them
the wrong shape.

Trying to be both at once is what the earlier single folder did, and it ended up
with Babel in the browser and a static file server, neither of which appears in
any real project.

---

## The database

Both talk to the same Neon database, and to **different tables**. The website
uses `animals`; the live project uses `lesson_animals`, so a session can add and
delete freely without touching what the site is showing.

Each project has its own gitignored `server/src/config.js`. The connection
string is a password.
