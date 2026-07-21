// Short technical definitions shown when Concept mode is on.
// SQL keys are uppercase, JavaScript keys are exact.

import { conceptKey } from "../lib/tokenize.js";

export const CONCEPTS = {
    // ---------- SQL commands ----------
    "CREATE TABLE": "Creates a new, empty table and defines the columns it will hold.",
    "INSERT INTO": "Adds one or more new rows to a table.",
    SELECT: "Reads rows back out of a table.",
    FROM: "Names which table to read from.",
    WHERE: "Filters which rows are affected. Without it, every row is.",
    VALUES: "Introduces the rows being inserted. Each set of brackets is one row.",
    UPDATE: "Changes values in rows that already exist.",
    SET: "Names the column being changed and its new value.",
    "DELETE FROM": "Removes rows from a table.",
    "ORDER BY": "Sorts the rows that come back. Add DESC for largest first.",
    LIMIT: "Returns only the first few rows.",
    DESC: "Sorts largest to smallest. ASC, the default, is smallest to largest.",
    ASC: "Sorts smallest to largest. This is the default.",
    AND: "Requires both conditions to be true.",
    OR: "Requires either condition to be true.",
    JOIN: "Combines rows from two tables into one result.",
    ON: "States how the two tables are matched up, usually id to id.",
    REFERENCES: "Points this column at a row in another table. This is a foreign key.",

    // ---------- SQL types ----------
    SERIAL: "A whole number the database assigns automatically, counting up from 1.",
    INTEGER: "A whole number. Can be sorted and totalled correctly.",
    VARCHAR: "Text, up to the number of characters in the brackets.",
    BOOLEAN: "Holds only true or false. Written without quotes.",
    DATE: "A calendar date, stored so it can be compared and sorted.",

    // ---------- SQL constraints ----------
    "PRIMARY KEY": "Marks the column that identifies each row. Unique, and never empty.",
    "NOT NULL": "A value is required. Rows missing it are rejected.",
    UNIQUE: "No two rows may share this value.",

    // ---------- SQL functions ----------
    COUNT: "Counts rows instead of listing them.",
    AVG: "Averages a numeric column across the rows that matched.",
    SUM: "Adds a numeric column up across the rows that matched.",

    // ---------- JavaScript ----------
    const: "Declares a value that will not be reassigned.",
    function: "Declares a reusable block of code.",
    return: "Sends a value back to whatever called this function.",
    async: "Marks a function that does work taking time, so it can use await inside.",
    await: "Waits for a result before running the next line.",
    if: "Runs the block only when the condition is true.",
    try: "Runs code that might fail, so a failure can be caught rather than crashing.",
    catch: "Runs when the code in try fails, receiving the error.",
    finally: "Runs afterwards either way, whether it succeeded or failed.",
    throw: "Stops and raises an error for a catch to handle.",
    import: "Brings in code from another file or library.",
    export: "Makes something in this file available to other files.",
    require: "Loads a library. This is Node's way of importing.",
    true: "A boolean value. Written without quotes.",
    false: "A boolean value. Written without quotes.",
    null: "A deliberate empty value, meaning nothing is here.",

    // ---------- Express ----------
    express: "The library that makes defining server endpoints straightforward.",
    app: "The server application. Every endpoint attaches to this.",
    "app.post": "Defines an endpoint that answers POST requests at a path.",
    "app.get": "Defines an endpoint that answers GET requests at a path.",
    "app.put": "Defines an endpoint that answers PUT requests, used for changing a record.",
    "app.delete": "Defines an endpoint that answers DELETE requests.",
    "app.use": "Registers middleware that runs on every request before the endpoints.",
    "app.listen": "Starts the server listening on a port so requests can arrive.",
    "express.json": "Middleware that reads a JSON request body into req.body.",
    req: "The request. Everything the client sent.",
    res: "The response. How a reply is sent back.",
    "req.body": "The data sent with the request, available once express.json has run.",
    "req.params": "Values taken from placeholders in the URL path. Always text.",
    "req.query": "Values from the part of the URL after a question mark.",
    "res.send": "Sends a reply as plain text.",
    "res.json": "Sends a reply as JSON, for a client that needs the data.",
    "res.status": "Sets the status code on the reply, such as 201 or 400.",

    // ---------- database driver ----------
    "db.query": "Runs a SQL query against the database and waits for the result.",
    rows: "The array of rows the database returned.",
    result: "The object the database returns, containing the rows and some metadata.",

    // ---------- React ----------
    useState: "Stores a value in a component and re renders when it changes.",
    useEffect: "Runs code after the component appears on screen.",
    fetch: "Sends a request to a URL. GET is the default.",
    response: "What the server sent back. Not the data itself yet.",
    "response.json": "Reads the response body and turns it into usable data.",
    "response.ok": "True when the status code means success.",
    "JSON.stringify": "Turns an object into text so it can be sent over the network.",
    map: "Goes through an array and returns one new item for each entry.",
    key: "A unique value per list item so React can tell them apart.",
    setClients: "Updates the stored clients. Calling it re renders the component.",
    setClient: "Updates the single stored client and re renders the component.",
    setLoading: "Updates whether the request is still running.",
    setError: "Stores an error message so the screen can show it.",
    method: "The kind of request being sent, such as POST.",
    headers: "Extra information about the request, such as what format the body is in.",
    body: "The data being sent with the request, as text.",
    Error: "A built in object representing something that went wrong.",
    console: "The browser or server log, used here to print a startup message.",
    "console.log": "Prints a line to the terminal. It changes nothing, it only reports.",
    "response.status": "The status code the server replied with, as a number.",
    "JSON.parse": "Turns JSON text back into data a program can read.",
    JSON: "The built in tool for moving between data and JSON text.",
    db: "The connection to the database. Everything SQL goes through it.",
    from: "Names which file or library the import is coming from.",
    new: "Builds a fresh copy of something, such as an error.",
    message: "The readable description carried by an error.",
    RETURNING: "Asks the database to hand back the row it just wrote, including anything it filled in.",
    then: "Runs once the slow thing finishes. await is the newer way to write the same idea.",

    // ---------- what a status code means ----------
    200: "Status 200. It worked.",
    201: "Status 201. It worked and something new was created.",
    204: "Status 204. It worked and there is deliberately nothing to send back.",
    400: "Status 400. The request was wrong, such as a missing field.",
    500: "Status 500. The request was fine but something failed on the server.",
    3000: "The port number this server listens on, which is why URLs say localhost:3000.",
    0: "Zero. Positions in a list start at 0, so this is the first entry.",

    // ---------- the pieces of a page ----------
    ul: "An unordered list. The list items go inside it.",
    li: "One item in a list.",
    p: "A paragraph of text on the page.",
    div: "A plain container, used to group other things together.",
    h1: "The main heading on the page.",
    button: "Something on the page that can be pressed.",
};

// Names specific to these examples. Explained by their place in the code
// rather than as general language terms.
export const NAMES = {
    // Topic 1, the client_form table.
    client_form: "The check-in table this lesson builds, one row per client.",
    age: "The client's age. A whole number, so it can be sorted and averaged.",
    email: "The client's email. Required, and UNIQUE: no two clients can share one.",
    mood: "How the client is feeling. Optional text.",
    first_visit: "Whether this is the client's first visit. Only true or false.",
    sessions: "A second table, where each row points back at one client.",
    client_id: "Holds an id from the client_form table, linking a session to a client.",
    session_on: "The date a therapy session happened.",
    Maya: "One of the three clients in this example.",
    Daniel: "One of the three clients in this example.",
    Priya: "One of the three clients in this example.",
    // Topic 3, the clients read back onto a page.
    clients: "The list of checked-in clients, held in state and drawn on screen.",
    client: "One client from the list, while it is being turned into a list item.",
    getAllClients: "The helper that reads every client out of the database.",
    getOneClient: "The helper that reads a single client by its id.",
    getClients: "The function in this component that fetches the list.",
    ClientList: "The component that fetches the clients and puts them on screen.",
    newClient: "The client being sent to the server to be saved.",
    addClient: "The function in this file that sends the POST request.",
    // Shared columns, and the terms the going-further React uses.
    id: "The number identifying each row. The database fills this in.",
    name: "The name on the record. Required.",
    notes: "Optional free text about a session.",
    saved: "The client the server sent back, now with the id it was given.",
    loading: "Whether the request is still running.",
    error: "An error message, or nothing if the request worked.",
    err: "The error that was caught, holding the message.",
    data: "The response body once it has been read, now usable as real data.",
    Loading: "Text put on screen while the request is still running.",
    Something: "Part of the message put on screen when the request failed.",
    went: "Part of the message put on screen when the request failed.",
    wrong: "Part of the message put on screen when the request failed.",
};

export function lookup(key, lang) {
    if (!key) return null;

    const tries = [key, key.replace(/[^A-Za-z0-9_$.]/g, "")];
    // SQL is written in capitals, so a key arrives uppercased. The names of
    // tables and columns are stored in the case they are written in the code,
    // which is lower, so both have to be tried or half the SQL words go undefined.
    if (lang === "sql") tries.push(key.toLowerCase(), key.toLowerCase().replace(/[^a-z0-9_$.]/g, ""));

    for (const k of tries) {
        if (!k) continue;
        if (CONCEPTS[k]) return { text: CONCEPTS[k], kind: "concept" };
        if (NAMES[k]) return { text: NAMES[k], kind: "name" };
    }
    return null;
}

// Punctuation carries real meaning and is exactly what a beginner cannot look
// up, since there is nothing to type into a search box.
const PUNCT = {
    "(": "Opens the list of things being handed to whatever is being called.",
    ")": "Closes the list of things being handed over.",
    "{": "Opens a block: everything until the matching brace belongs together.",
    "}": "Closes the block opened by the matching brace.",
    "[": "Opens a list, or picks a position out of one.",
    "]": "Closes the list, or the position being picked.",
    ";": "Ends the statement. One instruction finished.",
    ",": "Separates one item from the next.",
    ".": "Reaches inside the thing on the left for the part named on the right.",
    ":": "Pairs a name with its value.",
    "=": "Puts the value on the right into the name on the left.",
    ">": "Part of the arrow that starts a function, when it follows an equals sign.",
    "$": "Marks a value being dropped into surrounding text.",
    "*": "Every column, rather than a named few.",
    "?": "Starts the part of a URL that carries options.",
    "/": "Separates the parts of a path.",
    "<": "Opens a tag, which is how a piece of screen is described.",
    "-": "A minus sign, or part of a longer symbol.",
    "+": "Adds, or joins two pieces of text together.",
    "!": "Reverses a condition: true becomes false.",
    "&": "Part of the and symbol, requiring both sides to be true.",
    "|": "Part of the or symbol, requiring either side to be true.",
    "%": "The remainder left after a division.",
    "#": "Marks a fragment or an id, depending on where it appears.",
    "@": "Marks a scoped package name.",
    "\\": "Escapes the next character, so it is treated as plain text.",
};

/**
 * The explanation for one token, given the line it sits in.
 *
 * Order matters. A curated definition is always better than a general one, and
 * `res.json` is more useful than `res` and `json` separately, so the dotted
 * form is tried first. Whatever is left falls through to a description by kind,
 * which is how every word ends up with an answer rather than most of them.
 */
export function explain(tokens, i, lang) {
    const tk = tokens[i];
    if (!tk || tk.k === "space" || !tk.t.trim()) return null;

    if (tk.k === "comment") {
        return {
            text: "A note left for whoever reads this code. It is ignored when the program runs.",
            kind: "concept",
            label: "comment",
        };
    }

    if (tk.k === "punct") {
        const text = PUNCT[tk.t];
        return text ? { text, kind: "concept", label: tk.t } : null;
    }

    // `res` `.` `json` is three tokens, so the useful key has to be rebuilt.
    const prev = tokens[i - 1];
    const prev2 = tokens[i - 2];
    if (prev && prev.t === "." && prev2 && /^[A-Za-z_$]/.test(prev2.t)) {
        const dotted = `${prev2.t}.${tk.t}`;
        const hit = lookup(lang === "sql" ? dotted.toUpperCase() : dotted, lang);
        if (hit) return { ...hit, label: dotted };
    }

    const direct = lookup(conceptKey(tk, lang), lang);
    if (direct) return { ...direct, label: tk.t.trim() };

    return describe(tokens, i, lang);
}

/** Everything with no entry of its own, explained by what kind of thing it is. */
function describe(tokens, i, lang) {
    const tk = tokens[i];
    const raw = tk.t.trim();
    const label = raw;

    const before = (n) => {
        for (let j = i - 1; j >= 0; j--) if (tokens[j].k !== "space") return tokens[j].t.trim();
        return "";
    };
    const after = () => {
        for (let j = i + 1; j < tokens.length; j++) if (tokens[j].k !== "space") return tokens[j].t.trim();
        return "";
    };

    if (tk.k === "data") {
        if (/^`/.test(raw)) {
            return {
                text: "Text written inside backticks. Anything in a ${ } inside it is worked out first and dropped into the text.",
                kind: "concept",
                label: "template text",
            };
        }
        if (/^["']/.test(raw)) {
            const inner = raw.slice(1, -1);
            if (inner.startsWith("/")) {
                return {
                    text: `The path "${inner}". A request has to be aimed at exactly this to reach here.`,
                    kind: "name",
                    label,
                };
            }
            return {
                text: "A piece of text written straight into the code. The quotes are what make it text rather than a name.",
                kind: "concept",
                label,
            };
        }
        if (/^\d+$/.test(raw)) {
            return {
                text: "A number written straight into the code, rather than worked out or read from somewhere else.",
                kind: "concept",
                label,
            };
        }
    }

    if (/^\$\d+$/.test(raw)) {
        return {
            text: "A placeholder. The database fills it in with the matching value from the array below, which is what keeps a value from being read as a command.",
            kind: "concept",
            label,
        };
    }

    if (tk.k === "fn" || after() === "(") {
        return {
            text: "Something being called. Whatever sits in the brackets after it is what it is given to work with.",
            kind: "name",
            label,
        };
    }

    if (["const", "let", "var", "function"].includes(before())) {
        return {
            text: "A name being created here, so whatever it holds can be referred to further down.",
            kind: "name",
            label,
        };
    }

    if (lang === "sql") {
        return {
            text: "A name in this database, either a table or one of its columns. Names like this are chosen by whoever built the table.",
            kind: "name",
            label,
        };
    }

    return {
        text: "A name this code is using. It was either created earlier in the file or handed in from outside it.",
        kind: "name",
        label,
    };
}
