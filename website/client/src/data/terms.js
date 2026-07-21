// Definitions for the words used in the lesson prose.
//
// Writing [[client]] in a lesson's text turns that word into something the
// student can hover for a definition. [[req.body|the request body]] shows the
// second half and looks up the first.
//
// Two fields, and both earn their place. `def` is what the word means on its
// own, in one sentence. `note` is what it means for this lesson specifically,
// so a student reading about a bank counter and a student reading about an
// animals table land in the same place.

export const TERMS = {
    client: {
        def: "Whatever is sending the request. It is a role, not a program.",
        note: "A web page, a phone app, or Postman. Anything that can send a request.",
    },
    server: {
        def: "A computer, always on, that waits for messages and answers them.",
        note: "Not a special machine. The one you start in this lesson is a program running on your own laptop.",
    },
    database: {
        def: "Where a program keeps information so it is still there tomorrow.",
        note: "A set of tables, each a grid of rows. This lesson saves an animal as one row.",
    },
    endpoint: {
        def: "One address on the server that handles one kind of request.",
        note: "Like a specific counter at an office, each with its own job. This lesson builds one, at /add-one-animal.",
    },
    post: {
        def: "The kind of request that sends information to be saved.",
        note: "Named for putting something in, like posting a letter. Its opposite, GET, only asks for information back.",
    },
    handler: {
        def: "The function that runs when a request reaches an endpoint.",
        note: "It is the part written after the path in app.post, and its job is to read the request and send a response.",
    },
    request: {
        def: "The message a client sends, asking the server to do something.",
        note: "It carries the method, the path, and for a POST, the data being sent.",
    },
    response: {
        def: "The message the server sends back. Every request gets exactly one.",
        note: "Here the response is a short line of text confirming the animal was added.",
    },
    method: {
        def: "The word that says what kind of action a request wants.",
        note: "POST to send data in, GET to ask for data back.",
    },
    path: {
        def: "The part of the URL after the host, naming which endpoint is wanted.",
        note: "/add-one-animal is the path in this lesson.",
    },
    library: {
        def: "Code somebody else wrote that you load into your own.",
        note: "Express is the library here, and it is what makes defining an endpoint a single line.",
    },
    express: {
        def: "The library that handles the messy parts of receiving requests.",
        note: "Without it you would be reading raw network data yourself.",
    },
    middleware: {
        def: "A function that runs on every request before your endpoints see it.",
        note: "express.json is the only middleware in this lesson, and it is what fills in req.body.",
    },
    json: {
        def: "A way of writing data as text so it can be sent between programs.",
        note: "It looks like a JavaScript object, but it is text until something turns it back.",
    },
    parse: {
        def: "To read text and turn it into data a program can actually use.",
        note: "express.json parses the incoming text into an object on req.body.",
    },
    "req.body": {
        def: "The data that came with the request, once it has been parsed.",
        note: "It is undefined until app.use(express.json()) is added.",
    },
    destructuring: {
        def: "Pulling several values out of an object into their own variables at once.",
        note: "It is the line with the curly braces on the left of the equals sign.",
    },
    "helper function": {
        def: "A separate function that does one job, called from somewhere else.",
        note: "The helper here owns the database work, so the endpoint stays short.",
    },
    query: {
        def: "A command sent to a database, written in SQL.",
        note: "The helper's query is an INSERT INTO, which adds one row.",
    },
    parameter: {
        def: "A name in a function's brackets, standing in for a value it will be given.",
        note: "This helper has four, filled in by position rather than by name.",
    },
    return: {
        def: "Sends a value back to whatever called the function.",
        note: "Without it the helper would save the row and hand back nothing.",
    },
    result: {
        def: "The object a database driver replies with, describing what the query did.",
        note: "The rows themselves are on it, in an array called rows.",
    },
    "status code": {
        def: "A number on the response saying how the request went.",
        note: "200 means it worked. 400 means the request was wrong, 500 means the server was.",
    },
    "content-type": {
        def: "A label on a request saying what format its data is in.",
        note: "It has to say application/json, or express.json leaves the body alone.",
    },
    port: {
        def: "A numbered door on a machine, so several programs can listen at once.",
        note: "This server uses 3000, which is why the URL says localhost:3000.",
    },
    async: {
        def: "Marks a function that has to wait for something slow.",
        note: "The database takes real time, so the handler is async and uses await.",
    },
    await: {
        def: "Pause here until the slow thing finishes, then carry on.",
        note: "Without it the response would be sent before the row was saved.",
    },
    postman: {
        def: "A tool for sending requests by hand, without building a page first.",
        note: "It is how you check an endpoint works before anything else depends on it.",
    },
    row: {
        def: "One record in a database table. One animal, here.",
        note: "A POST that succeeds adds exactly one row.",
    },

    // ---------- topic 1, tables and SQL ----------
    table: {
        def: "A grid of stored records, all sharing the same columns.",
        note: "This lesson builds one called animals, with six columns.",
    },
    column: {
        def: "One piece of information, held for every record in the table.",
        note: "name and can_fly are columns. What each may hold is fixed when the table is made.",
    },
    sql: {
        def: "The language databases are given instructions in.",
        note: "Three commands cover this lesson: CREATE TABLE, INSERT INTO and SELECT.",
    },
    "data type": {
        def: "What kind of value a column is allowed to hold.",
        note: "Choosing INTEGER rather than text is what lets population be sorted and totalled.",
    },
    constraint: {
        def: "A rule a value has to follow. Rows breaking it are rejected.",
        note: "NOT NULL, UNIQUE and PRIMARY KEY are the three used here.",
    },
    "primary key": {
        def: "The column that identifies each row. Unique, never empty, one per table.",
        note: "id is the primary key here, and the database fills it in.",
    },
    "foreign key": {
        def: "A column holding the id of a row in another table.",
        note: "It is what connects two tables, so a record can point at another.",
    },
    null: {
        def: "The absence of a value, which is different from zero or empty text.",
        note: "A column with no NOT NULL rule may be left null, meaning optional.",
    },
    filter: {
        def: "Narrowing a result down to only the rows that match a condition.",
        note: "That is what WHERE does, and it is separate from choosing columns.",
    },

    // ---------- topic 3, React ----------
    component: {
        def: "A function that returns what should appear on the screen.",
        note: "AnimalList is one. It is called by React, not by you.",
    },
    render: {
        def: "React working out what should be on screen and putting it there.",
        note: "It happens once on load, then again each time stored data changes.",
    },
    state: {
        def: "A value a component keeps between renders, and updates the screen when changed.",
        note: "The animals array is state, which is why the list appears when it arrives.",
    },
    hook: {
        def: "A built in function giving a component an ability it would not otherwise have.",
        note: "useState and useEffect are the two this lesson uses.",
    },
    effect: {
        def: "Code run after the component has appeared, rather than while it is being built.",
        note: "The request lives in one, so the page can show up before the data does.",
    },
    jsx: {
        def: "The syntax React uses to describe screen content. It looks like HTML.",
        note: "Curly braces inside it are the way back into JavaScript.",
    },
    array: {
        def: "An ordered list of values, counted from 0.",
        note: "The animals arrive as one, and map turns it into list items.",
    },
    key: {
        def: "A unique value on each list item so React can tell them apart between renders.",
        note: "The database id is the right choice, because it is unique and does not change.",
    },
    "network tab": {
        def: "The part of browser developer tools listing every request the page sends.",
        note: "It is how you check a request was sent and see exactly what came back.",
    },
};

// Terms are written in prose however the sentence needs them, so the lookup
// is case insensitive and tolerates a trailing s.
export function lookupTerm(word) {
    const key = word.trim().toLowerCase();
    if (TERMS[key]) return TERMS[key];
    if (key.endsWith("s") && TERMS[key.slice(0, -1)]) return TERMS[key.slice(0, -1)];
    return null;
}
