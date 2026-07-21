// Lesson 02, a POST endpoint with Express.
//
// Page content as data. Blocks render through src/components/Blocks.jsx, and
// `code` is the sample pinned beside the lesson on wide screens. A section may
// carry its own `code`, which takes over the panel while that section is read.
//
// Line notes for the Context and Flow modes live in ../annotations.js, keyed by
// the sample's file name.

export const postEndpoint = {
    slug: "post-endpoint",
    num: "Lesson 02",
    title: "Create a POST Endpoint with Express and SQL",
    blurb: "Build an API endpoint that receives data and saves it to a database.",
    tags: ["app.post", "req.body", "res.send"],
    // No lede on purpose. The overview opens with the therapy-office analogy,
    // which eases in gentler than a one-line definition stacked with terms.
    code: [
        {
            name: "index.js",
            key: "index-post",
            // The Try it view puts the real request inside the panel, next to
            // the code that answers it, instead of further down the page.
            try: "post",
            // Written in parts so the focus blocks can name a region rather
            // than a line number. See lib/sample.js.
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
                    id: "signature",
                    code: `async function addOneClient(name, age, email, mood, first_visit) {`,
                },
                {
                    id: "query",
                    gap: 0,
                    code: `  const result = await db.query(
    \`INSERT INTO client_form
       (name, age, email, mood, first_visit)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *\`,
    [name, age, email, mood, first_visit],
  );`,
                },
                {
                    id: "return",
                    code: `  return result.rows[0];`,
                },
                {
                    id: "helperclose",
                    gap: 0,
                    code: `}`,
                },
                {
                    id: "open",
                    code: `app.post("/add-one-client", async (req, res) => {`,
                },
                {
                    id: "body",
                    gap: 0,
                    code: `  const { name, age, email, mood, first_visit } = req.body;`,
                },
                {
                    id: "call",
                    code: `  const client = await addOneClient(
    name, age, email, mood, first_visit
  );`,
                },
                {
                    id: "reply",
                    code: `  res.send(\`\${client.name} is checked in.\`);`,
                },
                {
                    id: "close",
                    gap: 0,
                    code: `});`,
                },
            ],
        },
    ],
    sections: [
        {
            id: "overview",
            label: "Overview",
            heading: "What does that even mean?",
            blocks: [
                { type: "p", text: "Think of arriving at a therapy office. You fill in a check-in form, hand it to the front desk, they file it away, and they tell you your therapist will be out shortly. That is the whole shape of this lesson." },
                {
                    type: "figuretoggle",
                    labels: ["The office", "In code"],
                    views: [
                        {
                            src: "/topic2-plain.png",
                            alt: "A client fills in a check-in form, hands it to the front desk, they file it away, and say the therapist will be out shortly",
                            caption: "A form handed in, filed, and a word back that it is done.",
                        },
                        {
                            src: "/topic2.png",
                            alt: "A client sends a request to your server, which reads it, saves it to the database, and sends a response back",
                            caption: "The same three moves, with the real words. The numbers match the steps below.",
                        },
                    ],
                },
                { type: "p", text: "Flip the picture between the two. The office on one side, the technical example is on the other, and they line up move for move." },
                { type: "h", text: "How it works" },
                { type: "p", text: "A therapy office calls the person checking in a client, and so does code. The [[client]] is whatever sends the information in, and here it is you. Its message is a [[request]], and what comes back is a [[response]]." },
                { type: "p", text: "The front desk is your [[server]]: a program you start, that keeps running and answers whatever arrives. It is the file you write in this lesson, index.js, running on your computer and listening on a [[port]]. The filing cabinet is a [[database]], where information is kept so it is still there tomorrow." },
                { type: "p", text: "The server answers at specific addresses, each an [[endpoint]] fixed by a [[path]] and a ((method|POST carries data with it, so you use it when something needs saving. GET carries none, so it can only ask. The method is part of what identifies an endpoint: a GET and a POST at the same path are two different endpoints running different code.)). This lesson builds one, a POST at /add-one-client, saving a client as one [[row]]. The rest is how." },
            ],
        },
        {
            id: "express",
            label: "Setting up the file",
            heading: "Everything above the code you write",
            // Nothing selected lights the whole setup block (lines 1–17). The
            // toggle below breaks it into five parts, one shown at a time, so the
            // page is not five sub-sections deep all at once; picking one lights
            // just its lines. See the `toggle` handling in ScrollLesson.jsx.
            cover: { at: ["imports", "listen"] },
            toggle: {
                file: "index-post",
                options: [
                    {
                        id: "imports",
                        label: "Loading",
                        at: "imports",
                        blocks: [
                            { type: "h", text: "Loading what the file needs" },
                            { type: "p", text: "((Three imports|express is the library that handles requests, pg is the driver that talks to Postgres, and config holds your connection string, kept in its own file so it never gets committed. Only the last is specific to this project, and it is the one you create yourself.)), and nothing has been built yet. This is taking the tools off the shelf." },
                        ],
                    },
                    {
                        id: "pool",
                        label: "Opening",
                        at: "pool",
                        blocks: [
                            { type: "h", text: "Opening the database connection" },
                            { type: "p", text: "A ((Pool|Opening a database connection is slow, far slower than the query. A pool opens a few up front and lends them out; your code never picks one, db.query takes the next free connection and gives it back when the query finishes.)) keeps a handful of connections open and hands one out per [[query]], rather than opening a fresh one every time and closing it after." },
                            { type: "p", text: "The connection string lives in ((config.js|It contains a password, so config.js is listed in .gitignore and never reaches the repository. config.example.js is committed in its place, showing the shape without the secret. A password in a repository is a password everyone has, even after you change it, because the history keeps it.)), its own file, on purpose." },
                        ],
                    },
                    {
                        id: "app",
                        label: "Creating",
                        at: "app",
                        blocks: [
                            { type: "h", text: "Creating the application" },
                            { type: "p", text: "Calling express() builds one application and names it ((app|Every line after this begins with app: app.use adds a standing rule, app.post adds an endpoint, app.listen switches it on. Scan the lines beginning with app and you have the whole shape of the file, without reading a single handler.)). Everything else in the file attaches to it." },
                        ],
                    },
                    {
                        id: "json",
                        label: "Interpreting",
                        at: "json",
                        blocks: [
                            { type: "h", text: "Teaching it to read what arrives" },
                            { type: "p", text: "This line is what puts the incoming data on [[req.body]]. Without it, nothing else in this lesson works." },
                            { type: "p", text: "What app.use adds is [[middleware]], a ((standing instruction|Middleware runs on every request before any endpoint sees it, so anything every request needs done goes here rather than being repeated in each endpoint.)). Data from a client arrives as [[json|JSON]] text, and express.json ((parses|Turning text into something a program can read is parsing. express.json parses the body and puts the result on req.body, which is the only reason that property has anything in it. It is like Chrome interpreting bytes into a readable page: the data arrived either way, but something has to make it usable.)) it onto req.body." },
                            {
                                type: "note",
                                label: "What happens without it",
                                warn: true,
                                text: "Leave it out and the request still arrives in full, with no error. But nothing parsed it, so [[req.body]] is undefined. This is the most common failure here, and it does not announce itself.",
                            },
                        ],
                    },
                    {
                        id: "listen",
                        label: "Listening",
                        at: "listen",
                        blocks: [
                            { type: "h", text: "Switching it on" },
                            { type: "p", text: "app.listen opens a [[port]] and waits. Until it runs, everything above is only a description of a server. The endpoint below is ((registered after this line|Express checks its routes per request rather than at startup, so a route added after the server is listening is still found. Middleware is the exception: express.json only applies to requests that arrive after it was registered, which is why it sits above.)) and still works." },
                            { type: "analogy", text: "The port is the office address. Think of it as 56 Main St, Room 3001. The building has many rooms, each a different service, and you want Room 3001, because that is where the front desk that takes your check-in form is." },
                        ],
                    },
                ],
            },
            blocks: [
                { type: "analogy", text: "Opening the office. Unlock the door, turn on the computer that stores the records, put someone at the front desk, and turn on the sign. None of it is about any one client, and it all happens once before anyone walks in." },
                { type: "p", text: "The top of the file is that setup: ((load what is needed|A request arrives as raw bytes over a network, in pieces. Collecting them, finding where one message ends, separating headers from body, and matching it to your code is the same work for every server, which is why nobody writes it any more. Express does it and hands you the result.)), open a connection to the database, create the app, and start it listening. It runs once at startup." },
                { type: "p", text: "It is five short steps. Pick one to read it on its own, and its lines light up in the file; with none picked, the whole setup block stays lit." },
            ],
        },
        {
            id: "code",
            label: "The helper",
            heading: "Where the database work lives",
            // Nothing selected lights the whole helper; each part lights its own
            // lines. Three beats: name it, run the query, hand the row back.
            cover: { at: ["signature", "helperclose"] },
            toggle: {
                file: "index-post",
                options: [
                    {
                        id: "signature",
                        label: "Declaring",
                        at: "signature",
                        blocks: [
                            { type: "h", text: "Declaring the helper" },
                            { type: "p", text: "The line names the function and lists what it needs. The five names in the brackets are its [[parameter|parameters]], filled in ((by position|The endpoint calls addOneClient(name, age, email, mood, first_visit), so the first value becomes name, the second age, and so on. Swap two at the call and the data lands in the wrong columns with no warning, since the database cannot know they were meant the other way round.)) by whoever calls it." },
                            { type: "p", text: "Notice it takes five plain values and ((knows nothing about req and res|It knows nothing about requests, responses, or Express, so it can be reused anywhere a client needs saving. Hand it a req instead and it would only ever work inside one endpoint. It is async because it waits for the database, and only an async function may use await.)), nothing about requests at all." },
                        ],
                    },
                    {
                        id: "query",
                        label: "Querying",
                        at: "query",
                        blocks: [
                            { type: "h", text: "Running the query" },
                            { type: "p", text: "One [[query]] goes to the database: an INSERT INTO that adds the row. db.query takes two things, the SQL text and an array of values, ((kept apart|The numbered placeholders $1, $2 are filled from the array that follows, so the command and the values reach the database separately and a value can never be read as part of the command. Joining strings instead would let a value containing SQL run as SQL, which is SQL injection; placeholders prevent it.)) deliberately." },
                            { type: "p", text: "The RETURNING * at the end ((hands the row back|It asks the database to return the row it just created, including the id it generated. Without it, a second query would be needed to find out what was saved.)), id included." },
                        ],
                    },
                    {
                        id: "return",
                        label: "Returning",
                        at: ["return", "helperclose"],
                        blocks: [
                            { type: "h", text: "Handing one row down" },
                            { type: "p", text: "[[return]] sends a value back to whoever called the function. This one hands back a single saved client, and that is where client.name in the reply comes from. Without it the helper would do all its work and hand back nothing." },
                            { type: "p", text: "db.query replies with a [[result]], and result.rows[0] takes ((the one row|The result describes what the query did, and the rows sit in an array on it called rows. One row was inserted, so [0] takes it. Array positions start at 0, which is why the first row is 0.)) out of it, always an ((array|db.query is the same function for every query, and a SELECT might match many rows or none, so it always replies in the same shape. The helper is the right place to take the array apart and return the one client the endpoint wants.)) however many rows there are." },
                        ],
                    },
                ],
            },
            blocks: [
                { type: "analogy", text: "The records clerk in the back room. They never meet the client. The front desk hands them a filled-in form, they file it, and they hand back a note saying it is done. Their whole job is the filing cabinet." },
                { type: "p", text: "The handler hands five values over and waits. This is the function that does something with them, kept apart from anything about requests. Pick a part to walk through it, and its lines light up." },
            ],
        },
        {
            id: "request",
            label: "The endpoint",
            heading: "req, res, and the handler between them",
            // Nothing selected lights the whole endpoint; each part lights its own
            // lines. Four steps then Try it, which opens the panel's request form.
            cover: { at: ["open", "close"] },
            toggle: {
                file: "index-post",
                options: [
                    {
                        id: "open",
                        label: "Receiving",
                        at: "open",
                        blocks: [
                            { type: "h", text: "Receiving the request" },
                            {
                                type: "table",
                                head: ["Object", "What it is"],
                                rows: [
                                    ["req", "The request. Everything the client sent"],
                                    ["res", "The response. How you send a reply back"],
                                ],
                                mono: [0],
                            },
                            { type: "p", text: "The ((names are a convention|They arrive in that order, always. The names could be anything, but req and res are what everyone uses, so keeping to them makes your code readable to anyone who has seen Express.)) but the order is not. The handler is [[async]] because it waits for the database, and only an async function may use await inside it." },
                        ],
                    },
                    {
                        id: "body",
                        label: "Reading",
                        at: "body",
                        blocks: [
                            { type: "h", text: "Reading what arrived" },
                            { type: "p", text: "Step 1. The data the client sent is on [[req.body]], already parsed by the middleware." },
                            {
                                type: "code",
                                name: "req.body",
                                code: `{
    "name": "Maya",
    "age": 34,
    "email": "maya@example.com",
    "mood": "anxious",
    "first_visit": true
}`,
                            },
                            { type: "p", text: "The [[destructuring]] on the left of the equals ((pulls the five out at once|It pulls all five values into their own variables in one line, instead of writing req.body five times. The names in the braces must match the keys in the data; ask for one that is not there and you get undefined, not an error.)), instead of writing req.body five times." },
                            {
                                type: "more",
                                label: "Where else data can arrive in a request",
                                blocks: [
                                    { type: "p", text: "There are three places, and knowing which is which explains most endpoint code." },
                                    {
                                        type: "table",
                                        head: ["Source", "Looks like", "Used for"],
                                        rows: [
                                            ["req.body", '{ "name": "Maya" }', "Data being sent in"],
                                            ["req.params", "/clients/:id", "Identifying which record"],
                                            ["req.query", "?mood=anxious", "Filters and options"],
                                        ],
                                        mono: [0, 1],
                                    },
                                    { type: "p", text: "A POST that creates something uses req.body, because the record does not exist yet and there is nothing to identify." },
                                ],
                            },
                        ],
                    },
                    {
                        id: "call",
                        label: "Calling",
                        at: "call",
                        blocks: [
                            { type: "h", text: "Handing the work over" },
                            { type: "p", text: "Step 2. The handler calls the [[helper function]] above, passes it the five values, and ((waits|await holds the handler at this line until the row is actually written. Without it the code carries straight on and sends the reply before the row exists, and it usually still looks like it worked, which is what makes it a real bug.)) with await. What comes back is the client as the database saved it, id and all." },
                        ],
                    },
                    {
                        id: "reply",
                        label: "Replying",
                        at: "reply",
                        blocks: [
                            { type: "h", text: "Sending a reply" },
                            { type: "p", text: "Step 3. Every request gets exactly one response, and there are two common ways to send it." },
                            {
                                type: "table",
                                head: ["Method", "Sends", "Use it when"],
                                rows: [
                                    ["res.send()", "Text", "A short confirmation is enough"],
                                    ["res.json()", "Data", "The client needs the record back"],
                                ],
                                mono: [0],
                            },
                            { type: "p", text: "This one uses res.send because ((the reply is one sentence|If a page had to display the client just checked in, res.json would be right instead, because a page needs the values rather than a sentence. Either way it is the one response, and sending a second after it is an error.)). The name in it comes from ((the row the database returned|client.name is from the row the database handed back, not the value that arrived. Here they match, but the database decides what was actually stored and may trim, default, or reject something; reporting what was saved rather than what was asked is the difference between a confirmation and a guess.)), not the request." },
                        ],
                    },
                    {
                        id: "tryit",
                        label: "Try it",
                        at: ["open", "close"],
                        try: true,
                        blocks: [
                            { type: "h", text: "Send one and watch it land" },
                            { type: "p", text: "All three steps are written, so the endpoint can be used rather than read. The panel has switched to Try it: fill in a client and press Send. Reading the table again and seeing the new [[row]] is ((what makes it proof|The request goes to a real server running alongside this page, so the status code and reply are the genuine ones. A confirmation only says the endpoint claims it worked; the re-read is what actually proves it.)), not just a confirmation." },
                        ],
                    },
                ],
            },
            blocks: [
                { type: "analogy", text: "The front desk itself. It is the counter the client actually walks up to. It takes the form, reads what is on it, passes it to the records clerk in the back, and gives the client the word back. It never files anything itself." },
                { type: "p", text: "app.post takes the path and a function to run when a POST reaches it. That function is the [[handler]], and it receives two objects every time it runs. Pick a step to walk through it, and its lines light up; the last one lets you send a real request." },
            ],
        },
        {
            id: "postman",
            label: "Testing in Postman",
            heading: "Checking the endpoint works",
            // Reading about testing, the panel opens the Try it view so the
            // request can be sent right there.
            view: "try",
            blocks: [
                { type: "analogy", text: "Walking up to your own front desk as a pretend client, to check it works, before the doors open to the public. You fill in a form, hand it in, and see whether the right word comes back." },
                { type: "p", text: "[[postman|Postman]] sends requests to your endpoints without a website existing yet, so you can confirm one works on its own." },
                {
                    type: "olist",
                    items: [
                        "Set the method to POST and enter the URL, http://localhost:3001/add-one-client.",
                        "Open the Body tab, select raw, then select JSON.",
                        "Type the JSON with a key for each value the endpoint expects.",
                        "Press Send, then read the status code and the response.",
                    ],
                },
                { type: "p", text: "A [[status code]] of 200 with your message means it worked. Anything else narrows down where the problem is." },
                {
                    type: "table",
                    head: ["Response", "Usual cause"],
                    rows: [
                        ["200 and your message", "It worked"],
                        ["404", "The URL or the method does not match the endpoint"],
                        ["500", "The endpoint was reached but something inside it failed"],
                        ["Could not connect", "The server is not running"],
                    ],
                    mono: [0],
                },
                { type: "p", text: "Selecting JSON also ((sets the Content-Type|Choosing JSON sets a Content-Type header of application/json. That header is how express.json knows to read the body as JSON; without it the text arrives exactly as typed and is ignored, so req.body stays empty.)) header, which is the one express.json looks for." },
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
                            "What is the difference between GET and POST?",
                            "A GET request asks for data and sends none. A POST request sends data to the server, usually so it can be saved.",
                        ],
                        [
                            "req.body is undefined. What is the first thing to check?",
                            "Whether app.use(express.json()) is included. Without it, nothing reads the incoming body. The second thing to check is that the request was sent with a Content-Type of application/json.",
                        ],
                        [
                            "What do req and res represent?",
                            "req is the request, holding everything the client sent. res is the response, and it is how you send a reply back.",
                        ],
                        [
                            "Why put the database code in a helper function?",
                            "It keeps the endpoint short and readable, and the helper can be reused by anything else that needs to add a client.",
                        ],
                        [
                            "When would you use res.json instead of res.send?",
                            "When the caller needs the actual data back rather than a message, for example a website that has to display the new client.",
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
                    name: "with-checks.js",
                    result: {
                        kind: "exchange",
                        source: "clientForm",
                        caption: "Send it twice to watch the UNIQUE email get rejected, or with no name for the 400.",
                        method: "POST",
                        url: "/add-one-client",
                        body: {
                            name: "Jordan",
                            age: 34,
                            email: "jordan@example.com",
                            mood: "anxious",
                            first_visit: true,
                        },
                    },
                    code: `// The same endpoint, now checking the data
// and setting a status code
app.post("/add-one-client", async (req, res) => {
  const { name, age, email, mood, first_visit } = req.body;

  if (!name) {
    return res.status(400).json({
      error: "name is required",
    });
  }

  try {
    const client = await addOneClient(
      name, age, email, mood, first_visit
    );
    res.status(201).json(client);
  } catch (error) {
    // A duplicate email lands here: UNIQUE was broken
    res.status(500).json({
      error: "Could not save the client",
    });
  }
});`,
                },
                {
                    name: "other-routes.js",
                    result: {
                        kind: "table",
                        source: "clientForm",
                        caption: "What the GET route sends back.",
                        columns: ["id", "name", "age", "email", "mood", "first_visit"],
                    },
                    code: `// Reading every client
app.get("/get-all-clients", async (req, res) => {
  const clients = await getAllClients();
  res.json(clients);
});

// Reading one, using a route parameter
app.get("/get-one-client/:id", async (req, res) => {
  const client = await getOneClient(req.params.id);
  res.json(client);
});

// Changing one
app.put("/update-one-client/:id", async (req, res) => {
  const client = await updateClient(
    req.params.id, req.body
  );
  res.json(client);
});

// Removing one
app.delete("/delete-one-client/:id", async (req, res) => {
  await deleteClient(req.params.id);
  res.status(204).send();
});`,
                },
            ],
            blocks: [
                { type: "p", text: "The code alongside shows these written out, with the parts you already know still in place." },
                { type: "coderef" },
                { type: "h", text: "The other endpoint types" },
                { type: "p", text: "The same pattern of endpoint, helper and SQL covers the rest." },
                {
                    type: "table",
                    head: ["Action", "Method", "SQL"],
                    rows: [
                        ["Add a record", "POST", "INSERT INTO"],
                        ["Read records", "GET", "SELECT"],
                        ["Change a record", "PUT", "UPDATE"],
                        ["Remove a record", "DELETE", "DELETE"],
                    ],
                    mono: [
                        1,
                        2,
                    ],
                },
                { type: "p", text: "That mapping is a ((convention, not a rule|Nothing enforces it: a server answers whatever method you register, so many projects route every write through POST, including changes and deletions, with paths like /delete-one-truck/:id answered by app.post. Read the method and the path together to see what an endpoint does, and follow whatever the project you are in already does.)), so you will meet projects that answer everything with POST." },
                { type: "h", text: "Status codes" },
                { type: "p", text: "Every response carries one. Setting it deliberately beats relying on the default of 200." },
                {
                    type: "table",
                    head: ["Code", "Meaning"],
                    rows: [
                        ["200", "Success"],
                        ["201", "Something was created"],
                        ["400", "The request was wrong, such as a missing field"],
                        ["500", "Something failed on the server"],
                    ],
                    mono: [
                        0,
                    ],
                },
                { type: "p", text: "It is also worth ((checking the data before saving it|Anything in req.body came from outside your server and could be missing or the wrong type. Checking that required fields are present before running the query, and responding with 400 when they are not, keeps incomplete rows out of the table.)), before it reaches the query." },
                { type: "h", text: "Practice" },
                {
                    type: "list",
                    items: [
                        "Send a POST in Postman with the name missing and see what happens.",
                        "Change res.send to res.json and compare the two responses.",
                        "Add a GET endpoint that returns all the clients, and use it to confirm your POST saved correctly.",
                    ],
                },
            ],
        },
    ],
};
