# API

The server runs on **http://localhost:3001**.

Paths here have no `/api` prefix. That belongs to the client: Vite forwards
anything starting with `/api` to this server and strips it on the way. A request
sent straight here, from Postman or `curl`, uses the plain path.

---

## `GET /get-all-animals`

Every animal, ordered by id.

**200**

```json
[
  { "id": 1, "name": "Lion", "category": "Mammal", "can_fly": false, "lives_in": "Savanna", "population": 23000 }
]
```

---

## `POST /add-one-animal`

Adds one animal and replies with a confirmation.

**Headers**

```
Content-Type: application/json
```

Without this header the body still arrives, but nothing parses it and every
value comes out undefined.

**Body**

```json
{
  "name": "Falcon",
  "category": "Bird",
  "can_fly": true,
  "lives_in": "Cliffs"
}
```

`id` is never sent. The database generates it, which is what `SERIAL` means.

**200**

```
The farm has grown: Falcon was added!
```

**500** when the database refuses the row. `name` is `NOT NULL` and `UNIQUE`, so
a missing name, or one already in the table, fails here.
