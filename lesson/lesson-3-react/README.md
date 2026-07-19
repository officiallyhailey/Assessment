# Lesson 3, a GET request in React

Stands alone. The whole server and API are already written, so there is real
data to fetch from the first second. You only write the component.

## Running it

```bash
npm run lesson3            # finished
npm run lesson3:scaffold   # fill in
```

Then **http://localhost:3300**

## What you write

Step 1 in `server.js`, then steps 2 to 5 in `public/AnimalList.jsx`:

1. `useState` to hold the animals
2. the fetch helper
3. `useEffect` to run it on page load
4. the JSX that puts it on screen

That file takes **real JSX**, because Babel is loaded in the page. Write, save,
refresh, and it works. No build step to explain.

In the scaffold you touch two files, `server.js` for the endpoint and
`public/AnimalList.jsx` for the React, so there is
no doubt about where to type. The finished folder also carries
`AnimalList.jsx`, which is the same component as it would look in a real React
project, for reading afterwards.

## Sending requests

`requests.http` has the single GET the component makes. Sending it before
writing any code shows the exact JSON that will come back, which makes
`response.json()` concrete later.

## Teaching notes

Open the Network tab before writing step 3. Nothing is requested yet.

Once it works, delete the empty array at the end of `useEffect` and watch the
Network tab fill with requests forever. Put it back. That is the fastest way to
show what the dependency array is for.

> React and Babel come from a CDN, so this needs internet. If that is a risk on
> the day, the same demo runs offline on the lesson website.
