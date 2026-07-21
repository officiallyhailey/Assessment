# API

The server runs on **http://localhost:3001**, against the table
**`client_form`**.

Paths here have no `/api` prefix: that belongs to the client, and Vite strips it
on the way through. Postman uses the plain path.

Both are written in topic 2. Until then they answer **404**, which is Express
saying it has no route for that path.

---

## `POST /add-one-client`

**Headers**

```
Content-Type: application/json
```

Without it the body still arrives, but nothing turns it into an object, so
`req.body` is undefined and the endpoint falls over on the line that reads it.

**Body**

```json
{ "name": "Sam", "age": 27, "email": "sam@example.com", "mood": "nervous", "first_visit": true }
```

`id` is never sent. `SERIAL` means the database makes it.

**200**

```
Sam is checked in.
```

**500** when the database refuses the row. `email` is `NOT NULL UNIQUE`, so a
row with no email, or one whose email is already on file, fails here. `name` is
`NOT NULL` too. A name that already exists is fine, since two clients can share
one — only the email has to be unique.

---

## `GET /get-all-clients`

Every row, ordered by id. This is the one the React page calls.

**200**

```json
[
  { "id": 1, "name": "Maya", "age": 34, "email": "maya@example.com", "mood": "anxious", "first_visit": true }
]
```
