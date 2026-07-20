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
    lede: "An endpoint is a URL on your server that responds to requests. This lesson covers building one that receives data and saves it to a database.",
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
import config from "./config.js";
import "./seed.js";`,
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
                    code: `async function addOneAnimal(name, category, can_fly, lives_in) {`,
                },
                {
                    id: "query",
                    gap: 0,
                    code: `  const result = await db.query(
    \`INSERT INTO lesson_animals
       (name, category, can_fly, lives_in)
     VALUES ($1, $2, $3, $4)
     RETURNING *\`,
    [name, category, can_fly, lives_in],
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
                    code: `app.post("/add-one-animal", async (req, res) => {`,
                },
                {
                    id: "body",
                    gap: 0,
                    code: `  const { name, category, can_fly, lives_in } = req.body;`,
                },
                {
                    id: "call",
                    code: `  const animal = await addOneAnimal(
    name, category, can_fly, lives_in
  );`,
                },
                {
                    id: "reply",
                    code: `  res.send(\`The farm has grown: \${animal.name} was added!\`);`,
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
            heading: "What a POST endpoint is",
            blocks: [
                { type: "p", text: "Something outside your program has data and wants it kept. Your [[server]] receives it and puts it somewhere permanent." },
                {
                    type: "figure",
                    src: "/topic2.png",
                    alt: "Data travels from a sender into your server, which saves it to the database and sends a reply back",
                    caption: "The numbers are the three steps below, in the order they happen.",
                },
                { type: "p", text: "Everything in this lesson is one of those three moves. The rest is the words for them." },
                { type: "h", text: "The words for the picture" },
                { type: "p", text: "The sender is the [[client]], its message is a [[request]], what comes back is a [[response]]. Your server answers at specific addresses, and each one is an [[endpoint]], fixed by two things together." },
                {
                    type: "table",
                    head: ["Part", "Example", "What it decides"],
                    rows: [
                        ["The [[path]]", "/add-one-animal", "Which address the request is aimed at"],
                        ["The [[method]]", "POST", "What kind of action is being asked for"],
                    ],
                    mono: [1],
                },
                { type: "p", text: "This lesson builds one POST endpoint, at /add-one-animal, saving one animal as one [[row]]." },
                {
                    type: "more",
                    label: "POST sends data in, GET only asks for it",
                    blocks: [
                        { type: "p", text: "Those are the two methods worth knowing now. A POST carries data with it, so it is what you use when something needs saving. A GET carries none, so it can only ask." },
                        { type: "p", text: "The method is part of what identifies an endpoint rather than a detail attached to it. A GET and a POST at the same path are two different endpoints running two different pieces of code." },
                    ],
                },
                {
                    type: "more",
                    label: "The client is a role, not a particular program",
                    blocks: [
                        { type: "p", text: "A web page can be a client. So can a phone app, another server, or the testing tool used later in this lesson. Anything that can send a request is one while it is sending." },
                        { type: "p", text: "This matters because the endpoint is written without knowing which. It answers whatever arrives, so long as the path and the method match." },
                    ],
                },
                {
                    type: "more",
                    label: "An everyday comparison: a bank deposit slip",
                    blocks: [
                        { type: "p", text: "Depositing money at a counter follows the same steps. You fill in a slip with named fields, hand it across, the teller records it, and you get a receipt back." },
                        { type: "p", text: "The useful detail is that the slip is handed over rather than spoken. It has named fields, so the teller does not have to guess which number is which. That is what the data in a POST request looks like, and it is why the data travels inside the request rather than in the URL." },
                    ],
                },
            ],
        },
        {
            id: "express",
            label: "Setting up Express",
            heading: "The three lines that build the server",
            blocks: [
                { type: "p", text: "[[express|Express]] is a [[library]]: code somebody else wrote that you load into your own. Three lines set it up, a fourth switches it on, and all four run once at startup." },
                {
                    type: "more",
                    label: "Express exists so you are not the one reading raw network traffic",
                    blocks: [
                        { type: "p", text: "A request does not arrive as a tidy message. It arrives as bytes over a network connection, in pieces, and something has to collect them, work out where one message ends and the next begins, separate the headers from the body, and match the whole thing to the right piece of your code." },
                        { type: "p", text: "That work is the same for every server ever written, which is why nobody writes it any more. Express does it and hands you the result." },
                    ],
                },
                {
                    type: "focus",
                    file: "index-post",
                    at: "imports",
                    blocks: [
                        { type: "h", text: "Loading what the file needs" },
                        { type: "p", text: "import brings in Express, and the helper that will do the database work. Nothing has been built yet: this is taking the tools off the shelf." },
                        {
                            type: "more",
                            label: "The helper is imported here but lives in its own file",
                            blocks: [
                                { type: "p", text: "Everything about the database is in animals-helpers.js. This file is about requests and responses, and it calls the helper rather than writing a query itself." },
                                { type: "p", text: "That split is the shape most Express projects settle into. Reading the endpoint tells you what the request does; reading the helper tells you what the data does." },
                            ],
                        },
                    ],
                },
                {
                    type: "focus",
                    file: "index-post",
                    at: "app",
                    blocks: [
                        { type: "h", text: "Creating the application" },
                        { type: "p", text: "Calling express() builds one application and names it app. Everything else in the file attaches to it." },
                        {
                            type: "more",
                            label: "Every line after this starts with app, and that is not a coincidence",
                            blocks: [
                                { type: "p", text: "app is the server being assembled, one line at a time. app.use adds a standing rule, app.post adds an endpoint, app.listen switches it on." },
                                { type: "p", text: "Reading a server file this way is a useful habit. Scan the lines beginning with app and you have the whole shape of it, without reading a single handler." },
                            ],
                        },
                    ],
                },
                {
                    type: "focus",
                    file: "index-post",
                    at: "json",
                    blocks: [
                        { type: "h", text: "Teaching it to read what arrives" },
                        { type: "p", text: "This line is what puts the incoming data on [[req.body]]. Without it, nothing else in this lesson works." },
                        {
                            type: "more",
                            label: "app.use registers a standing instruction, not a one-off action",
                            blocks: [
                                { type: "p", text: "What it adds is called [[middleware]]: a function that runs on every request, before any endpoint sees it." },
                                { type: "p", text: "The point of the word is the position. Middleware sits between the request arriving and your code running, so anything every request needs doing to it goes here rather than being repeated in each endpoint." },
                            ],
                        },
                        {
                            type: "more",
                            label: "express.json turns the text that arrived into data you can use",
                            blocks: [
                                { type: "p", text: "Data sent by a client arrives as plain text in a format called [[json|JSON]]. It looks like a JavaScript object, but it is still text." },
                                { type: "p", text: "Turning text into something a program can actually read is called [[parse|parsing]]. express.json parses the body and puts the result on req.body, which is the only reason that property has anything in it." },
                            ],
                        },
                        {
                            type: "more",
                            label: "The Chrome comparison, if it helps",
                            blocks: [
                                { type: "p", text: "Open Chrome and a page shows up in English. The same bytes came down the wire either way. What makes them readable is that something at your end knows how to interpret them." },
                                { type: "p", text: "Switch that off and you would be looking at symbols you could not act on. The data arrived perfectly and is still useless." },
                                { type: "p", text: "If chrome.use(language.english()) were a real line of code, it would be doing the job app.use(express.json()) does for your server: for everything that arrives here, interpret it this way." },
                            ],
                        },
                        {
                            type: "note",
                            label: "What happens without it",
                            warn: true,
                            text: "Leave it out and the request still arrives in full, with no error. But nothing parsed it, so [[req.body]] is undefined. This is the most common failure here, and it does not announce itself.",
                        },
                    ],
                },
                { type: "coderef" },
                {
                    type: "focus",
                    file: "index-post",
                    at: "listen",
                    blocks: [
                        { type: "h", text: "Switching it on" },
                        { type: "p", text: "app.listen opens a [[port]] and waits. Until it runs, everything above is only a description of a server." },
                        {
                            type: "more",
                            label: "The endpoint below is registered after this line, and still works",
                            blocks: [
                                { type: "p", text: "Express checks its routes per request rather than at startup, so a route added after the server is listening is found perfectly well." },
                                { type: "p", text: "What does have to come first is the middleware. express.json only applies to requests that arrive after it was registered, which is why it sits above rather than below." },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: "request",
            label: "Request and response",
            heading: "req and res",
            blocks: [
                { type: "p", text: "app.post takes the path and a function to run when a POST reaches it. That function is the [[handler]], and it receives two objects every time it runs." },
                {
                    type: "focus",
                    file: "index-post",
                    at: "open",
                    blocks: [
                        {
                            type: "table",
                            head: ["Object", "What it is"],
                            rows: [
                                ["req", "The request. Everything the client sent"],
                                ["res", "The response. How you send a reply back"],
                            ],
                            mono: [0],
                        },
                        {
                            type: "more",
                            label: "The names are a convention, the order is not",
                            blocks: [
                                { type: "p", text: "They arrive in that order, always. The names could be anything, and req and res are what everyone uses, so keeping to them makes your code readable to anyone who has seen Express before." },
                                { type: "p", text: "The handler is also marked [[async]], because it is going to wait for the database. Only an async function may use await inside it." },
                            ],
                        },
                    ],
                },
                {
                    type: "focus",
                    file: "index-post",
                    at: "body",
                    blocks: [
                        { type: "h", text: "Reading what arrived" },
                        { type: "p", text: "Step 1. The data the client sent is on [[req.body]], already parsed by the middleware." },
                        {
                            type: "code",
                            name: "req.body",
                            code: `{
    "name": "Falcon",
    "category": "Bird",
    "can_fly": true,
    "lives_in": "Cliffs"
}`,
                        },
                        {
                            type: "more",
                            label: "The curly braces on the left of the equals sign are called destructuring",
                            blocks: [
                                { type: "p", text: "[[destructuring]] pulls all four values out into their own variables in one line, instead of writing req.body four separate times." },
                                { type: "p", text: "The names inside the braces have to match the keys in the data. Ask for a key that is not there and you get undefined rather than an error, which is worth remembering when a value mysteriously goes missing." },
                            ],
                        },
                    ],
                },
                {
                    type: "focus",
                    file: "index-post",
                    at: "call",
                    blocks: [
                        { type: "h", text: "Handing the work over" },
                        { type: "p", text: "Step 2. The handler calls a [[helper function]], passes it the four values, and waits. What comes back is the animal as the database saved it, id and all." },
                        {
                            type: "more",
                            label: "await is what does the waiting, and leaving it off is a real bug",
                            blocks: [
                                { type: "p", text: "The database takes real time. [[await]] holds the handler at this line until the row is actually written." },
                                { type: "p", text: "Without it the code carries straight on and sends the reply before the row exists. Worse, it usually still looks like it worked: the client gets a cheerful confirmation for something that may not have been saved." },
                            ],
                        },
                        {
                            type: "more",
                            label: "The helper itself is a separate file, covered in the next section",
                            blocks: [
                                { type: "p", text: "All the handler needs to know is that it hands over four values and gets a saved animal back. What happens in between is the helper's business." },
                                { type: "p", text: "That split is deliberate, and it is what keeps this handler readable: three short steps, none of which mention SQL." },
                            ],
                        },
                    ],
                },
                {
                    type: "focus",
                    file: "index-post",
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
                        {
                            type: "more",
                            label: "This one uses res.send because the reply is one sentence",
                            blocks: [
                                { type: "p", text: "If a web page had to display the animal that was just saved, res.json would be the right choice instead, because a page needs the values rather than a sentence about them." },
                                { type: "p", text: "Either way it counts as the one response. Sending a second one after that is an error, which is why a guard clause usually has return in front of it." },
                            ],
                        },
                        {
                            type: "more",
                            label: "The message uses the name the database gave back, not the one sent in",
                            blocks: [
                                { type: "p", text: "animal.name comes from the row the database returned, not from the value that arrived in the request. Here the two happen to be identical." },
                                { type: "p", text: "The habit still matters. The database is what decides what was actually stored, and it may trim, default or reject something. Reporting what was saved rather than what was asked for is the difference between a confirmation and a guess." },
                            ],
                        },
                    ],
                },
                {
                    type: "more",
                    label: "Where else data can arrive in a request",
                    blocks: [
                        { type: "p", text: "There are three places, and knowing which is which explains most endpoint code." },
                        {
                            type: "table",
                            head: ["Source", "Looks like", "Used for"],
                            rows: [
                                ["req.body", '{ "name": "Falcon" }', "Data being sent in"],
                                ["req.params", "/animals/:id", "Identifying which record"],
                                ["req.query", "?category=Bird", "Filters and options"],
                            ],
                            mono: [0, 1],
                        },
                        { type: "p", text: "A POST that creates something uses req.body, because the record does not exist yet and there is nothing to identify." },
                    ],
                },
            ],
        },
        {
            id: "code",
            label: "The helper",
            heading: "Where the database work lives",
            blocks: [
                { type: "p", text: "The handler hands four values over and waits. This is the file that does something with them." },
                { type: "coderef" },
                {
                    type: "focus",
                    title: "The helper, its signature",
                    file: "index-post",
                    at: "signature",
                    blocks: [
                        { type: "h", text: "Declaring the helper" },
                        { type: "p", text: "The line names the function and lists what it needs. The four names in the brackets are its [[parameter|parameters]], empty labels waiting to be filled in by whoever calls it." },
                        {
                            type: "more",
                            label: "Parameters are filled in by position, not by name",
                            blocks: [
                                { type: "p", text: "The endpoint calls addOneAnimal(name, category, can_fly, lives_in), so the first value it passes becomes name here, the second becomes category, and so on down the list." },
                                { type: "p", text: "Swap two of them at the call and the animal is saved with its category in the name column. Nothing warns you, because both are text and the database has no way to know they were meant the other way round." },
                            ],
                        },
                        {
                            type: "more",
                            label: "Notice what this function does not take: req and res",
                            blocks: [
                                { type: "p", text: "It receives four plain values and knows nothing about requests, responses, status codes or Express. It could not tell you whether it was called by an endpoint, a script, or a test." },
                                { type: "p", text: "That is the whole point of keeping it separate. A function that only knows about animals can be used anywhere animals need saving. Hand it a req instead and it would only ever work inside one endpoint." },
                                { type: "p", text: "It is [[async]] for the same reason the handler is. It waits for the database, and only an async function may use await inside it." },
                            ],
                        },
                    ],
                },
                {
                    type: "focus",
                    title: "The helper, the query",
                    file: "index-post",
                    at: "query",
                    blocks: [
                        { type: "h", text: "Running the query" },
                        { type: "p", text: "One [[query]] goes to the database: an INSERT INTO that adds the row. db.query takes two things, the SQL text and an array of values, and they are deliberately kept apart." },
                        {
                            type: "more",
                            label: "Why $1 and $2 instead of writing the values into the query",
                            blocks: [
                                { type: "p", text: "The numbered placeholders are filled in from the array that follows. The database receives the command and the values separately, so a value can never be read as part of the command." },
                                { type: "p", text: "Building the query by joining strings together would let a value containing SQL run as SQL. That is called SQL injection, and placeholders are what prevent it." },
                            ],
                        },
                        {
                            type: "more",
                            label: "RETURNING * asks for the finished row back, id included",
                            blocks: [
                                { type: "p", text: "It asks the database to hand back the row it just created, including the id it generated. Without it, a second query would be needed to find out what was saved." },
                            ],
                        },
                    ],
                },
                {
                    type: "focus",
                    title: "The helper, what it hands back",
                    file: "index-post",
                    at: ["return", "helperclose"],
                    blocks: [
                        { type: "h", text: "Handing one row down" },
                        { type: "p", text: "[[return]] sends a value back to whoever called the function. This one hands back a single saved animal, and that is where animal.name in the reply comes from." },
                        {
                            type: "more",
                            label: "The database replies with a result object, not with rows directly",
                            blocks: [
                                { type: "p", text: "db.query returns a [[result]] describing what the query did. The rows themselves sit in an array on it called rows." },
                                { type: "p", text: "One row was inserted, so that array has exactly one entry, and [0] takes the first one. Positions in an array start at 0 rather than 1, which is why the first row is 0." },
                                { type: "p", text: "Without this line the helper would do all its work and hand back nothing, leaving the endpoint with no name to put in its reply." },
                            ],
                        },
                        {
                            type: "more",
                            label: "Why an array at all, when only one row was added",
                            blocks: [
                                { type: "p", text: "db.query is the same function for every query. A SELECT might match forty rows, or none, so it always replies in the same shape: an array, however many rows happen to be in it." },
                                { type: "p", text: "That consistency is worth the small awkwardness here. It also means the helper is the right place to decide what to hand back: the endpoint wants one animal, so the helper takes the array apart and returns one, rather than making every caller do it." },
                            ],
                        },
                    ],
                },
                {
                    type: "focus",
                    file: "index-post",
                    at: ["open", "close"],
                    try: true,
                    blocks: [
                        { type: "h", text: "Send one and watch it land" },
                        { type: "p", text: "All three steps are written, so the endpoint can be used rather than read. Switch the code panel to Try it, fill in an animal, and press Send." },
                        {
                            type: "more",
                            label: "The list underneath is re-read afterwards, which is what makes it proof",
                            blocks: [
                                { type: "p", text: "The request goes to a real server running alongside this page, so the [[status code]] and the reply are the genuine ones." },
                                { type: "p", text: "A confirmation message only tells you the endpoint claims it worked. Reading the table again afterwards and seeing the new [[row]] is what actually proves it, and that distinction is worth making early." },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: "postman",
            label: "Testing in Postman",
            heading: "Checking the endpoint works",
            blocks: [
                { type: "p", text: "[[postman|Postman]] sends requests to your endpoints without a website existing yet, so you can confirm one works on its own." },
                {
                    type: "olist",
                    items: [
                        "Set the method to POST and enter the URL, http://localhost:3000/add-one-animal.",
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
                {
                    type: "more",
                    label: "Why selecting JSON in Postman matters",
                    blocks: [
                        { type: "p", text: "Choosing JSON sets a [[content-type|Content-Type]] header of application/json on the request." },
                        { type: "p", text: "That header is how express.json knows the body is meant to be read as JSON. Without it the text arrives exactly as typed and is still ignored, so req.body stays empty." },
                    ],
                },
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
                            "It keeps the endpoint short and readable, and the helper can be reused by anything else that needs to add an animal.",
                        ],
                        [
                            "When would you use res.json instead of res.send?",
                            "When the client needs the actual data back rather than a message, for example a website that has to display the new animal.",
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
                        caption: "Send it with no name to watch the check reject it.",
                        method: "POST",
                        url: "/add-one-animal",
                        body: {
                            name: "Falcon",
                            category: "Bird",
                            can_fly: true,
                            lives_in: "Cliffs",
                        },
                    },
                    code: `// The same endpoint, now checking the data
// and setting a status code
app.post("/add-one-animal", async (req, res) => {
  const { name, category, can_fly, lives_in } = req.body;

  if (!name) {
    return res.status(400).json({
      error: "name is required",
    });
  }

  try {
    const animal = await addOneAnimal(
      name, category, can_fly, lives_in
    );
    res.status(201).json(animal);
  } catch (error) {
    res.status(500).json({
      error: "Could not save the animal",
    });
  }
});`,
                },
                {
                    name: "other-routes.js",
                    result: {
                        kind: "table",
                        caption: "What the GET route sends back.",
                        columns: ["id", "name", "category", "can_fly", "lives_in", "population"],
                    },
                    code: `// Reading every animal
app.get("/get-all-animals", async (req, res) => {
  const animals = await getAllAnimals();
  res.json(animals);
});

// Reading one, using a route parameter
app.get("/get-one-animal/:id", async (req, res) => {
  const animal = await getOneAnimal(req.params.id);
  res.json(animal);
});

// Changing one
app.put("/update-one-animal/:id", async (req, res) => {
  const animal = await updateAnimal(
    req.params.id, req.body
  );
  res.json(animal);
});

// Removing one
app.delete("/delete-one-animal/:id", async (req, res) => {
  await deleteAnimal(req.params.id);
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
                {
                    type: "more",
                    label: "Plenty of real projects use POST for all four, and that is worth knowing before you meet one",
                    blocks: [
                        { type: "p", text: "The table above is the convention. It is not enforced by anything: a server answers whatever method you register, so nothing stops a project routing every write through POST, including changes and deletions." },
                        { type: "p", text: "Course projects often do exactly that, with paths like /delete-one-truck/:id answered by app.post rather than app.delete. It works, and it is a reasonable thing to have written." },
                        { type: "p", text: "Knowing both is the useful position. Read the method and the path together to see what an endpoint does, rather than assuming the method tells you, and follow whatever the project you are in already does." },
                    ],
                },
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
                {
                    type: "more",
                    label: "Checking the data before saving it",
                    blocks: [
                        {
                            type: "p",
                            text: "Anything arriving in req.body came from outside your server and could be missing or the wrong type.",
                        },
                        {
                            type: "p",
                            text: "Checking that required fields are present before running the query, and responding with 400 when they are not, prevents incomplete rows from being saved.",
                        },
                    ],
                },
                { type: "h", text: "Practice" },
                {
                    type: "list",
                    items: [
                        "Send a POST in Postman with the name missing and see what happens.",
                        "Change res.send to res.json and compare the two responses.",
                        "Add a GET endpoint that returns all the animals, and use it to confirm your POST saved correctly.",
                    ],
                },
            ],
        },
    ],
};
