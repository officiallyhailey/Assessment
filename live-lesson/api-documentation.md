# API

The server runs on **http://localhost:3001**, against the table
**`lesson_animals`**.

Paths here have no `/api` prefix: that belongs to the client, and Vite strips it
on the way through. Postman uses the plain path.

Both are written in topic 2. Until then they answer **404**, which is Express
saying it has no route for that path.

---

## `POST /add-one-animal`

**Headers**

```
Content-Type: application/json
```

Without it the body still arrives, but nothing turns it into an object, so
`req.body` is undefined and the endpoint falls over on the line that reads it.

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

Every row, ordered by id. This is the one the React page calls.

**200**

```json
[
  { "id": 1, "name": "Lion", "category": "Mammal", "can_fly": false, "lives_in": "Savanna", "population": 23000 }
]
```
