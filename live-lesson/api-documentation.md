# API

The server runs on **http://localhost:3001**. Paths here have no `/api` prefix:
that belongs to the client, and Vite strips it on the way through.

All three endpoints read and write **`lesson_one_table`**.

---

## `GET /lesson-one-table` — given

Written already, so lesson 1 can show the table exists and lesson 2 can check a
POST landed.

**200**

```json
[{ "id": 1, "name": "Lion", "category": "Mammal", "can_fly": false, "lives_in": "Savanna", "population": 23000 }]
```

**500** if the table does not exist yet. That is lesson 1.

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

Every row, ordered by id. Same shape as `/lesson-one-table`; writing it is the
lesson.

**404** until the endpoint is written.
