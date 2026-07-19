# Lesson 2, a POST endpoint with Express

Stands alone. The GET endpoint and its helper are already written, so you can
read the data back and prove your POST really saved.

## Running it

```bash
npm run lesson2            # finished
npm run lesson2:scaffold   # fill in
```

Then **http://localhost:3200**

## What you write

Two files, the same split the lesson teaches. `server.js` is about requests and
responses, `helpers.js` is about the data.

In `server.js`:

1. `express.json()`
2. the POST endpoint

In `helpers.js`:

3. the `addOneAnimal` helper

`getAllAnimals` and the GET endpoint are already written and are not part of
this lesson. They are there so the saved row can be read back and checked.

## Sending requests

`requests.http` opens in VS Code with the REST Client extension. Postman works
just as well.

Order that tells a story: GET, POST, GET again. The third one is the point,
because a friendly reply and a stored row are two different claims.

## Teaching notes

Send the POST before writing `express.json()`. `req.body` arrives undefined and
the endpoint fails in a confusing way. Add the one line, restart, send again.
That contrast is worth more than explaining it.

Requests 4 and 5 both save an animal with `undefined` as its name without
crashing, which opens the conversation about checking data before saving it.
