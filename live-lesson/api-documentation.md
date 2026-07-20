# API

The server runs on **http://localhost:3001**. Paths here have no `/api` prefix:
that belongs to the client, and Vite strips it on the way through.

Two tables, so that no lesson depends on another having been taught:

| Table | Endpoints |
|---|---|
| `lesson_one_table` | `GET /lesson-one-table`. Created by lesson 1 |
| `lesson_animals` | everything else. Already set up and filled |

---

## `GET /lesson-one-table` — given

Written already, so lesson 1 can show its table exists once the SQL has run.

**200**

```json
[{ "id": 1, "name": "Lion", "category": "Mammal", "can_fly": false, "lives_in": "Savanna", "population": 23000 }]
```

**500** if the table does not exist yet, which is the state before lesson 1 is taught. The page reads that as "no table yet" rather than an error.

---

## `GET /animals` — given

Reads `lesson_animals`. Lesson 2's page uses it to show whether a POST really
saved. Writing a GET yourself is lesson 3, which is why this one is handed over.

---

## `POST /add-one-animal` — lesson 2

**Headers**

```
Content-Type: application/json
```

Without it the body still arrives, but nothing parses it and every value is
undefined.

**Body**

```json
{ "name": "Falcon", "category": "Bird", "can_fly": true, "lives_in": "Cliffs" }
```

`id` is never sent. `SERIAL` means the database makes it.

**200**

```
The farm has grown: Falcon was added!
```

**404** until the endpoint is written.

---

## `GET /get-all-animals` — lesson 3

Every row of `lesson_animals`, ordered by id. Same shape as `/animals`; writing
it is the lesson.

**404** until the endpoint is written.
