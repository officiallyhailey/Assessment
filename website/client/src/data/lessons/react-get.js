// Lesson 03, a GET request in React.
//
// Page content as data. Blocks render through src/components/Blocks.jsx, and
// `code` is the sample pinned beside the lesson on wide screens. A section may
// carry its own `code`, which takes over the panel while that section is read.
//
// The running example is the therapy office's check-in form, the same office
// that carries through the other two lessons. Lesson 1 designs the form, lesson
// 2 fills one in through an endpoint, and this lesson reads them back onto a
// page: the waiting-room screen that lists who has checked in.
//
// The line-by-line sections use the toggle template (see ScrollLesson.jsx and
// the [[toggle-template-standard]] note): a single row of parts, none selected
// lights the whole region, picking one lights just its lines. Line notes for
// the Context and Flow modes live in ../annotations.js, keyed by the file name.

// The "Setting up the file" section is the same for topic 2 and topic 3: the
// same imports, pool, app, express.json and listen at the top of index.js. A
// teacher covering only one topic still walks through it, so topic 3 reuses
// topic 2's section verbatim, just pointed at this lesson's copy of index.js.
import { postEndpoint } from "./post-endpoint.js";

const topic2Setup = postEndpoint.sections.find((s) => s.id === "express");
const settingUpTheFile = {
    ...topic2Setup,
    toggle: { ...topic2Setup.toggle, file: "index-get" },
};

export const reactGet = {
    slug: "react-get",
    num: "Lesson 03",
    title: "Send a GET Request in React and Render the Data",
    blurb: "Request data from an API and display it in a React component.",
    tags: ["fetch", "useState", "useEffect"],
    // No lede on purpose. The overview opens with the office analogy, which eases
    // in gentler than a one-line definition stacked with terms.
    code: [
        {
            name: "index.js",
            key: "index-get",
            parts: [
                {
                    id: "imports",
                    code: `import express from "express";
import pg from "pg";
import config from "./config.js";`,
                },
                {
                    id: "pool",
                    code: `const db = new pg.Pool({
  connectionString: config.databaseUrl,
  ssl: true,
});`,
                },
                {
                    id: "app",
                    code: `const app = express();`,
                },
                {
                    id: "json",
                    code: `app.use(express.json());`,
                },
                {
                    id: "listen",
                    code: `const port = 3001;
app.listen(port, () => {
  console.log(\`Server is listening on port \${port}\`);
});`,
                },
                {
                    id: "helper",
                    code: `async function getAllClients() {
  const result = await db.query(
    "SELECT * FROM client_form ORDER BY id"
  );

  return result.rows;
}`,
                },
                {
                    id: "endpoint",
                    code: `app.get("/get-all-clients", async (req, res) => {
  const clients = await getAllClients();

  res.json(clients);
});`,
                },
            ],
        },
        {
            name: "ClientList.jsx",
            // Try it runs this exact flow inside the panel, so the two renders
            // can be watched next to the code that causes them.
            try: "fetch",
            // Written in parts so the toggle can name a region rather than a line
            // number. See lib/sample.js.
            parts: [
                {
                    id: "imports",
                    code: `import { useState, useEffect } from "react";`,
                },
                {
                    id: "open",
                    code: `function ClientList() {`,
                },
                {
                    id: "state",
                    gap: 0,
                    code: `  const [clients, setClients] = useState([]);`,
                },
                {
                    id: "fetch",
                    code: `  const getClients = async () => {
    const response = await fetch("/api/get-all-clients");
    const data = await response.json();
    setClients(data);
  };`,
                },
                {
                    id: "effect",
                    code: `  useEffect(() => {
    getClients();
  }, []);`,
                },
                {
                    id: "render",
                    code: `  return (
    <ul>
      {clients.map((client) => (
        <li key={client.id}>
          {client.name} — {client.mood}
          {client.first_visit ? ", first visit" : ""}
        </li>
      ))}
    </ul>
  );`,
                },
                {
                    id: "close",
                    gap: 0,
                    code: `}`,
                },
            ],
        },
    ],
    sections: [
        {
            id: "overview",
            label: "Overview",
            heading: "Getting the check-ins onto the screen",
            blocks: [
                { type: "analogy", text: "The waiting-room display that lists who has checked in today. The front desk keeps the real record; this screen only reads it and shows the names, so anyone can see at a glance who is in." },
                { type: "p", text: "A React [[component]] is a function that returns what should appear on the screen. The awkward part is that the check-in data kept on the server does not arrive instantly, and the screen cannot wait." },
                {
                    type: "figure",
                    src: "/topic3.svg",
                    alt: "The same page twice: first with nothing in it, then again with three clients listed",
                    caption: "The numbers are the three steps below, in the order they happen.",
                },
                { type: "p", text: "That is the whole lesson. The same page is ((drawn twice|Drawing twice is not something to fix. It lets the page appear immediately instead of sitting blank until the server replies, which would look broken on a slow connection. It does mean the first drawing has to cope with having no data yet, a real constraint the code respects rather than a detail.)), and each piece of code below exists to make one of the three steps happen. Each drawing is a ((render|A render is React working out what should be on screen and putting it there; the component function runs once per render, top to bottom. It renders when it first appears, and again whenever the data it holds changes. Nothing else makes it render, which is why storing the data matters so much.))." },
                { type: "p", text: "The [[client|clients]] shown are the same three the earlier lessons filed: Maya, Daniel, and Priya. This page just asks the endpoint for them and paints them out." },
            ],
        },
        settingUpTheFile,
        {
            id: "endpoint",
            label: "The endpoint it calls",
            heading: "What the React is fetching from",
            // Nothing selected lights the whole server file's lesson code; each
            // part lights its own lines. Two beats: the helper, then the endpoint.
            cover: { at: ["helper", "endpoint"] },
            toggle: {
                file: "index-get",
                options: [
                    {
                        id: "helper",
                        label: "Reading",
                        at: "helper",
                        blocks: [
                            { type: "h", text: "The helper that reads" },
                            { type: "p", text: "One [[query]], ((ordered by id|Without ORDER BY the database is free to hand rows back in whatever order suits it, which usually looks fine and occasionally does not. A list that quietly reorders itself between loads is a confusing thing to debug from the React side, and the cause is back here in the query.)), and it hands back the rows rather than the whole result object. Nothing in it knows a request exists. This is the same helper split as lesson 2, only reading instead of writing." },
                        ],
                    },
                    {
                        id: "endpoint",
                        label: "Serving",
                        at: "endpoint",
                        blocks: [
                            { type: "h", text: "The endpoint" },
                            { type: "p", text: "A GET asks for data and sends none, which is why there is no [[req.body]] here and no express.json above." },
                            { type: "p", text: "res.json sends the array of clients and sets the [[content-type|Content-Type]] header, which is what lets response.json() read it at the other end. The React page will ask for this at ((/api/get-all-clients|The /api prefix is how the dev server knows to forward a request to the API rather than treat it as a page. It is stripped on the way through, so the endpoint sees /get-all-clients. Both are correct, and a request sent straight to the server, from Postman say, uses the plain path.))." },
                        ],
                    },
                ],
            },
            blocks: [
                { type: "p", text: "This is the server side of the same job: one [[helper function]] that reads the table, and one endpoint that hands the rows over. Pick one to walk through it, and its lines light up." },
            ],
        },
        {
            id: "code",
            label: "Storing and requesting",
            heading: "The first two of the three tools",
            // Nothing selected lights the whole component; each part lights its
            // own lines. Bringing in the tools, storing the data, requesting it.
            cover: { at: ["imports", "close"] },
            toggle: {
                file: "ClientList.jsx",
                options: [
                    {
                        id: "imports",
                        label: "Importing",
                        at: "imports",
                        blocks: [
                            { type: "h", text: "Bringing in the tools" },
                            { type: "p", text: "The two [[hook|hooks]] this component needs, loaded from React before anything else happens." },
                        ],
                    },
                    {
                        id: "state",
                        label: "Storing",
                        at: ["open", "state"],
                        blocks: [
                            { type: "h", text: "1. Storing the data" },
                            { type: "p", text: "useState is the first of the three tools, and it ((hands back two things|The current value, clients, and a function to change it, setClients. Calling setClients is what makes the component render again with the new value. A plain variable would not do the job: it is recreated every render so its value is lost, and changing it does not tell React to redraw. useState solves both.)). It keeps the clients as ((state|State is a value the component keeps between renders. The component function runs again on every render, so an ordinary variable inside it is created fresh each time and whatever it held is gone. React keeps state outside the function and hands it back on each render, which is the only reason the clients are still there the second time around.)), starting as an ((empty array|The first render happens before any data exists, and it still has to produce something. An empty array passes through map quietly and produces an empty list. Starting as null instead would crash on that first render, because null has no map.)) because there is no data yet." },
                        ],
                    },
                    {
                        id: "fetch",
                        label: "Requesting",
                        at: "fetch",
                        blocks: [
                            { type: "h", text: "2. Requesting the data" },
                            { type: "p", text: "fetch is the second tool. It sends the request to the endpoint, then reads the reply in ((two steps|fetch hands back a response, which describes the reply but is not the data itself. response.json() reads the body of that response and turns it into something you can use. Both are slow, so both need await — miss the second and you are left holding a response object, wondering why the list will not display.)) and ((stores the result|Nothing about fetching data updates the page by itself: the request finishes, the data sits in a variable, and the screen carries on showing whatever it did before. Calling setClients is the step that asks React to render again, which is the whole reason the data is kept in useState rather than an ordinary variable.))." },
                        ],
                    },
                ],
            },
            blocks: [
                { type: "p", text: "The component is four parts, and the first two are about getting hold of the data: somewhere to keep it, and the request that goes and gets it. Pick a part to walk through it, and its lines light up." },
            ],
        },
        {
            id: "showing",
            label: "Running it and showing it",
            heading: "What makes it happen, and what appears",
            // Nothing selected lights the whole component; each part lights its
            // own lines. Run it on load, display it, then try it for real.
            cover: { at: ["imports", "close"] },
            toggle: {
                file: "ClientList.jsx",
                options: [
                    {
                        id: "effect",
                        label: "Running",
                        at: "effect",
                        blocks: [
                            { type: "h", text: "3. Running it on page load" },
                            { type: "p", text: "useEffect is the third tool. It runs the request as an [[effect]], after the component has appeared, and the empty brackets mean run once. useState and useEffect are both ((hooks|A hook is a built-in function giving a component an ability it would not otherwise have: somewhere to keep a value between renders, and a way to run code at a chosen moment. They are always called at the top of the component, never inside an if or a loop, because React keeps track of them by the order they run in, so that order has to be identical on every render.)), which is why they look alike." },
                            { type: "p", text: "Writing the request ((straight in the component body|Code written directly in the component runs on every single render, so a request there would fire on every update, including the ones it caused itself. An effect runs after the render is on screen and only when you say so, and that separation is what the empty brackets control.)) would fire it on every render, which is why it lives in an effect instead." },
                            {
                                type: "note",
                                label: "Careful",
                                warn: true,
                                text: "Leaving off the empty brackets makes useEffect run after every render. The request updates the data, updating the data renders again, and that renders forever.",
                            },
                        ],
                    },
                    {
                        id: "render",
                        label: "Displaying",
                        at: "render",
                        blocks: [
                            { type: "h", text: "4. Displaying the data" },
                            { type: "p", text: "Everything inside the return is [[jsx|JSX]], and map turns the array into one list item per client: their name, their mood, and whether it is their first visit. JSX ((looks like HTML|It is the syntax React uses to describe what appears on screen. Anything inside curly braces is worked out as JavaScript and its result dropped into place. That is why the list items are written in braces: map is JavaScript producing elements, not markup you could type by hand, and the first_visit line is the same idea, a small piece of JavaScript choosing what text to show.)), and the curly braces are the way back into JavaScript." },
                            { type: "p", text: "Each item needs a ((key|A key is a unique value React uses to tell items apart between renders, so it can change just the ones that moved rather than rebuilding the whole list. The database id is ideal because it is already unique and does not change; using the position in the array instead breaks as soon as the list is reordered or something is removed.)), and the database id is the right one to use." },
                        ],
                    },
                    {
                        id: "tryit",
                        label: "Try it",
                        at: ["imports", "close"],
                        try: true,
                        blocks: [
                            { type: "h", text: "Watch it render twice" },
                            { type: "p", text: "The panel has switched to Try it. The counter shows the component rendering once with no data, then again once the clients arrive. Pressing Load is the same as the page first appearing." },
                        ],
                    },
                ],
            },
            blocks: [
                { type: "p", text: "These last two parts are what set it running and what a person actually sees. Pick a part to walk through it; the last one lets you watch the two renders happen." },
            ],
        },
        {
            id: "network",
            label: "The Network tab",
            heading: "Checking the request worked",
            blocks: [
                { type: "p", text: "The [[network tab|Network tab]] lists every request the page sends, so you can confirm one went out and see what came back." },
                {
                    type: "olist",
                    items: [
                        "Open developer tools and select the Network tab, then reload the page.",
                        "Find the request by name in the list. Filtering to Fetch or XHR hides images and stylesheets.",
                        "Check the status, then open it and select Response to see the data.",
                    ],
                },
                {
                    type: "table",
                    head: ["What you see", "What it means"],
                    rows: [
                        ["200 and the expected data", "The request worked, so any problem is in how the data is used"],
                        ["304", "It worked. Nothing changed, so the browser reused what it already had"],
                        ["404", "The URL is wrong, or the endpoint does not exist"],
                        ["500", "The server was reached but something failed inside it"],
                        ["No request listed", "The code never ran, so check useEffect"],
                    ],
                    mono: [0],
                },
                { type: "p", text: "This one check tells you whether a problem is in the frontend or the backend, which saves a lot of guessing. A second load often shows ((304 rather than 200|Not Modified. The server tags each version of the data, the browser keeps the tag, and on the next request asks whether that version is still current. If nothing has changed the server sends 304 with an empty body and the browser reuses the copy it already had — the data still reaches your code either way. Ticking Disable cache forces a full 200 every time, which is worth doing while debugging.)), which is normal." },
            ],
        },
        {
            id: "check",
            label: "Check your understanding",
            heading: "Questions to try",
            blocks: [
                {
                    type: "qa",
                    items: [
                        [
                            "Why does the component display twice?",
                            "Because the request takes time and the component does not wait for it. It displays immediately with no data, then displays again once the clients have been stored.",
                        ],
                        [
                            "What do the empty brackets at the end of useEffect do?",
                            "They mean the code runs once, when the component first appears. Without them it runs after every update, which causes an endless loop of requests.",
                        ],
                        [
                            "Why is there a second await for response.json()?",
                            "fetch gives back a response, not the data. Reading the content of that response and converting it is a separate step that also takes time.",
                        ],
                        [
                            "Why does useState start as an empty array?",
                            "So the component has something valid to display before the data arrives. map on an empty array displays nothing, where starting with no value at all would cause an error.",
                        ],
                        [
                            "Nothing appears on the screen. Where do you look first?",
                            "The Network tab. If no request was sent, the problem is in useEffect. If it returned an error, the problem is the URL or the server. If it returned the data correctly, the problem is in how the data is stored or displayed.",
                        ],
                    ],
                },
            ],
        },
        {
            id: "next",
            label: "Going further",
            heading: "Useful things to learn next",
            code: [
                {
                    name: "with-states.jsx",
                    result: { kind: "screen", caption: "After the loading message clears.", title: "Checked in today" },
                    parts: [
                        {
                            id: "open",
                            code: `function ClientList() {`,
                        },
                        {
                            id: "states",
                            gap: 0,
                            code: `  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);`,
                        },
                        {
                            id: "fetch",
                            code: `  const getClients = async () => {
    try {
      const response = await fetch("/api/get-all-clients");
      if (!response.ok) {
        throw new Error("Request failed");
      }
      setClients(await response.json());
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };`,
                        },
                        {
                            id: "effect",
                            code: `  useEffect(() => {
    getClients();
  }, []);`,
                        },
                        {
                            id: "guards",
                            code: `  if (loading) return <p>Loading...</p>;
  if (error) return <p>Something went wrong.</p>;`,
                        },
                        {
                            id: "render",
                            code: `  return (
    <ul>
      {clients.map((client) => (
        <li key={client.id}>{client.name}</li>
      ))}
    </ul>
  );`,
                        },
                        {
                            id: "close",
                            gap: 0,
                            code: `}`,
                        },
                    ]
                },
                {
                    name: "sending-data.jsx",
                    try: "one",
                    parts: [
                        {
                            id: "post",
                            code: `// Checking a new client in from React
const addClient = async (newClient) => {
  const response = await fetch("/api/add-one-client", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newClient),
  });

  const saved = await response.json();
  setClients([...clients, saved]);
};`,
                        },
                        {
                            id: "one",
                            code: `// Asking for one client instead of all of them
const [client, setClient] = useState(null);

const getOneClient = async (id) => {
  const response = await fetch(\`/api/get-one-client-by-id/\${id}\`);
  setClient(await response.json());
};`,
                        },
                    ]
                },
            ],
            blocks: [
                { type: "p", text: "The code alongside shows these written out, with the parts you already know still in place. The tabs switch between the two files." },
                { type: "coderef" },
                { type: "h", text: "Loading and error messages" },
                { type: "p", text: "The simple version assumes the request always works. Real pages keep two more pieces of [[state]]: whether it is ((still loading|loading starts as true, because the request begins immediately and the component is already loading by the time anything is drawn. Starting as false would flash an empty list before the message appeared. error starts as null, meaning nothing has gone wrong yet, which is different from an empty message.)), and whether it ((failed|try holds the risky part, catch deals with a failure, and finally runs either way. A failed request still returns a response — fetch only rejects when the request could not be made at all, such as the network being down — so response.ok has to be checked and thrown on, or an error page would be handed to the list as though it were data. finally is the right place to switch loading off, since it runs whether the request worked or failed; putting it only in the success path leaves the page stuck on a loading message whenever anything goes wrong.))." },
                { type: "p", text: "With those in place the component ((returns early|The component returns early for loading and for error, so the list below is only reached when there is data and nothing went wrong.)) for loading and for error, so the list is only reached once there is data." },
                { type: "h", text: "Sending data back" },
                { type: "p", text: "The same fetch, with a second argument, ((turns a read into a write|An object cannot cross a network as it is, so JSON.stringify converts it to text, and response.json() does the reverse when data comes back. The Content-Type header tells the server the text is JSON, which is what makes it parse the body rather than ignore it. This is lesson 2's POST, called from the React side.)). The server sends back the saved client, id and all, so the new one can be ((added straight to the list|The saved client, id included, goes straight into state alongside the ones already there. Asking the server for the whole list again would also work, but it is a second request for something you have already been given.)) rather than fetching everything again." },
                { type: "p", text: "A path can also carry a placeholder, so /get-one-client-by-id/3 asks for the client with id 3. ((Requesting one|The backticks build the URL so the id can change from one call to the next. Storage starts as null rather than an empty array, because one client is a single object rather than a list, and there is no map since there is only one item to display.)) changes three small things. Switch the panel to Try it and watch the URL change with the id." },
                { type: "h", text: "Practice" },
                {
                    type: "list",
                    items: [
                        "Add a loading message that shows until the clients arrive.",
                        "Remove the empty brackets from useEffect, watch the Network tab, then put them back.",
                        "Display more than one value from each client in the list.",
                    ],
                },
            ],
        },
    ],
};
