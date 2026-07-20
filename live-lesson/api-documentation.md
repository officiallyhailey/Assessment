# API

The server runs on **http://localhost:3001**, against the table
**`lesson_animals`**.

Paths here have no `/api` prefix: that belongs to the client, and Vite strips it
on the way through. Postman uses the plain path.

Both endpoints are written in topic 2. Until then they answer **404**.

---

## `POST /add-one-animal`

**Headers**

```
Content-Type: application/json
```

Without it the body still arrives, but nothing parses it, `req.body` is
undefined and the endpoint fails on the line that reads it.

**Body**

```json
{ "name": "Falcon", "category": "Bird", "can_fly": true, "lives_in": "Cliffs" }
```

`id` is never sent. `SERIAL` means the database makes it.

**200**

```
The farm has grown: Falcon was added!
```

**500** when the database refuses the row. `name` is `NOT NULL` and `UNIQUE`, so
a missing name, or one already in the table, fails here.

---

## `GET /get-all-animals`

Every row, ordered by id. This is what topic 3 fetches.

**200**

```json
[
  { "id": 1, "name": "Lion", "category": "Mammal", "can_fly": false, "lives_in": "Savanna", "population": 23000 }
]
```
