# Lesson 2, a POST endpoint with Express

Stands alone, and covers one thing: sending data IN with a POST. There is no
GET endpoint here on purpose. Reading data back is lesson 3, and having both
in one file makes it unclear which idea is being taught.

To confirm a POST saved, open `animals-data.json`.

## Running it

```bash
npm run lesson2            # finished
npm run lesson2:scaffold   # fill in
```

Then **http://localhost:3200**

## What you write

Two files, the same split the lesson teaches. `server.js` is about the request
and the response, `helpers.js` is about the data.

In `server.js`:

1. `express.json()`
2. the POST endpoint

In `helpers.js`:

3. the `addOneAnimal` helper

Nothing is pre-written. Reading and writing the file is part of step 3, so the
whole path from request to saved row gets typed out.

The scripts run from the lesson folder, which is why the code says
`"animals-data.json"` and not a long path built from `__dirname`.

## Sending requests

`requests.http` opens in VS Code with the REST Client extension. Postman works
just as well.

Send request 1 before writing anything. A 404 is a clear starting point, and
it makes the moment the endpoint appears obvious.

## Teaching notes

Send the POST before writing `express.json()`. `req.body` arrives undefined and
the endpoint fails in a confusing way. Add the one line, restart, send again.
That contrast is worth more than explaining it.

Requests 3 and 4 both save an animal with `undefined` as its name without
crashing, which opens the conversation about checking data before saving it.
