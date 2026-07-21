// Lesson 01, creating a table with SQL.
//
// Page content as data. Blocks render through src/components/Blocks.jsx, and
// `code` is the sample pinned beside the lesson on wide screens. A section may
// carry its own `code`, which takes over the panel while that section is read.
//
// Line notes for the Context and Flow modes live in ../annotations.js, keyed by
// the sample's file name.
//
// The running example is a therapy office's check-in form, the same office that
// carries through the other two lessons. This lesson designs the form and files
// the first few in; lesson 2 fills one in through an endpoint; lesson 3 reads
// them back onto a page.

export const sqlTables = {
    slug: "sql-tables",
    num: "Lesson 01",
    title: "Create a Database Table with SQL",
    blurb: "Create a table, add rows to it, and query the data back out.",
    tags: ["CREATE TABLE", "INSERT INTO", "SELECT"],
    // No lede on purpose. The overview opens with the office analogy, which
    // eases in gentler than a one-line definition stacked with terms.
    code: [
        {
            name: "client_form.sql",
            // Try it puts the query runner inside the panel, beside the SQL it
            // is running, rather than further down the page.
            try: "sql",
            // Written in parts so the focus blocks can name a region rather
            // than a line number. See lib/sample.js.
            parts: [
                {
                    id: "create",
                    code: `CREATE TABLE client_form (
  id            SERIAL PRIMARY KEY,
  name          VARCHAR(100) NOT NULL,
  age           INTEGER,
  state         VARCHAR(50),
  mood          VARCHAR(50),
  first_visit   BOOLEAN NOT NULL,
  checked_in_on DATE
);`,
                },
                {
                    id: "insert",
                    code: `INSERT INTO client_form
  (name, age, state, mood, first_visit, checked_in_on)
VALUES
  ('Maya',   34, 'Oregon',     'anxious', true,  '2026-02-10'),
  ('Daniel', 41, 'California',  'hopeful', false, '2026-02-11'),
  ('Priya',  29, 'New York',    'tired',   true,  '2026-02-12');`,
                },
                {
                    id: "selectall",
                    code: `SELECT * FROM client_form;`,
                },
                {
                    id: "selectone",
                    code: `SELECT * FROM client_form
  WHERE name = 'Maya';`,
                },
                {
                    id: "selectcols",
                    code: `SELECT name, mood FROM client_form
  WHERE first_visit = true;`,
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
                { type: "p", text: "A therapy office runs on a check-in form. Before anyone fills one in, someone has to design the blank form: decide what boxes it has, what kind of answer each box takes, and which ones cannot be left blank. Then clients start filling them in, and the office keeps the filled forms." },
                {
                    type: "figuretoggle",
                    labels: ["The office", "In code"],
                    views: [
                        {
                            src: "/topic1-plain.png",
                            alt: "A blank check-in form is designed, clients fill copies in, and the filled forms are kept in a filing cabinet",
                            caption: "Design the blank form, fill some in, keep them to look up later.",
                        },
                        {
                            src: "/topic1-tech.png",
                            alt: "CREATE TABLE defines the columns, INSERT INTO adds rows, SELECT reads them back",
                            caption: "The same three moves, with the real words.",
                        },
                    ],
                },
                { type: "p", text: "That is the whole lesson. Designing the blank form is one command, filling one in is another, and looking someone up is a third." },
                { type: "h", text: "The words for the picture" },
                { type: "p", text: "The filled forms are kept in a [[table]]: a grid, much like a spreadsheet. Each box on the form is a [[column]], and each filled-in form is a [[row]]. The instructions are written in [[sql|SQL]]." },
                {
                    type: "table",
                    head: ["The office", "In code", "Command"],
                    rows: [
                        ["Design the blank form", "Define the table and its columns", "CREATE TABLE"],
                        ["A client fills one in", "Add a row", "INSERT INTO"],
                        ["Look someone up", "Read rows back", "SELECT"],
                    ],
                    mono: [2],
                },
                { type: "p", text: "Everything below is detail inside one of those three." },
                {
                    type: "more",
                    label: "Why a database and not a spreadsheet",
                    blocks: [
                        { type: "p", text: "In a spreadsheet, any cell can hold anything. Someone can type the word none into a column of ages and the file accepts it." },
                        { type: "p", text: "A table defines what each column is allowed to hold and rejects anything that does not fit. It also handles many people reading and writing at once, which is what an office, or an application, needs." },
                    ],
                },
            ],
        },
        {
            id: "columns",
            label: "Defining columns",
            heading: "Data types and constraints",
            blocks: [
                { type: "analogy", text: "Designing the boxes on the blank form. Each box says what kind of answer belongs in it, a number for age, a date for the visit, a yes or no for first time here, and some boxes are marked so they cannot be left blank." },
                { type: "p", text: "In code that is two things per column: a [[data type]], and optionally one or more [[constraint|constraints]]." },
                { type: "h", text: "Data types" },
                { type: "p", text: "A data type says what kind of value a column holds." },
                {
                    type: "table",
                    head: ["Type", "Holds", "On the form"],
                    rows: [
                        ["SERIAL", "A number the database assigns automatically", "the client's number"],
                        ["VARCHAR(100)", "Text, up to 100 characters", "'Maya'"],
                        ["INTEGER", "A whole number", "34"],
                        ["BOOLEAN", "true or false", "first visit?"],
                        ["DATE", "A calendar date", "'2026-02-10'"],
                    ],
                    mono: [0, 2],
                },
                {
                    type: "more",
                    label: "The type decides what the column will accept, and what you can do with it later",
                    blocks: [
                        { type: "p", text: "A number stored as text does not sort or add up correctly. Text is compared one character at a time, so 100 would sort before 34 because 1 comes before 3." },
                        { type: "p", text: "Choosing INTEGER for age means the database can sort it, total it, and average it correctly. Choosing DATE for the visit means it can be compared and put in order, rather than being loose text that only looks like a date." },
                    ],
                },
                { type: "h", text: "Constraints" },
                { type: "p", text: "A constraint is a rule the value must follow. The database rejects any row that breaks one." },
                {
                    type: "table",
                    head: ["Constraint", "The rule"],
                    rows: [
                        ["PRIMARY KEY", "Identifies the row. Must be unique and cannot be empty"],
                        ["NOT NULL", "A value is required"],
                        ["UNIQUE", "No two rows can have the same value"],
                    ],
                    mono: [0],
                },
                {
                    type: "focus",
                    file: "client_form.sql",
                    at: "create",
                    blocks: [
                        { type: "p", text: "In the form id is the [[primary key]], name and first_visit are NOT NULL, and the rest have no constraints at all, which is what makes them optional." },
                        {
                            type: "more",
                            label: "PRIMARY KEY and UNIQUE look similar, and the difference matters",
                            blocks: [
                                { type: "p", text: "A PRIMARY KEY is the column that identifies the row. It is unique, it cannot be empty, and a table has exactly one." },
                                { type: "p", text: "UNIQUE is only the no-duplicates rule, and a table can have several. Here id identifies each form. name is not unique, because two clients really can share a name, which is exactly why the office assigns everyone a number." },
                            ],
                        },
                        {
                            type: "more",
                            label: "A column with no constraint may be left empty, which is called null",
                            blocks: [
                                { type: "p", text: "[[null]] is the absence of a value, and it is not the same as zero or as empty text. It means the box was left blank." },
                                { type: "p", text: "So leaving a column unconstrained is a decision, not an oversight. state and mood are optional because a client may not fill them in, while first_visit is NOT NULL because the office needs to know either way." },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: "code",
            label: "The code",
            heading: "Creating, inserting, and selecting",
            blocks: [
                { type: "p", text: "The full example designs the [[table]], files three clients in, then reads them back three ways." },
                { type: "coderef" },
                {
                    type: "focus",
                    file: "client_form.sql",
                    at: "create",
                    blocks: [
                        { type: "analogy", text: "Printing the blank form for the first time. Nothing is filled in yet. You are only deciding what the form looks like and which boxes it has." },
                        { type: "h", text: "Creating the table" },
                        { type: "p", text: "Each line inside the brackets defines one [[column]]: name first, then [[data type]], then any [[constraint|constraints]]." },
                        {
                            type: "more",
                            label: "Nothing is stored yet, and that is the point",
                            blocks: [
                                { type: "p", text: "This command describes a shape rather than filling one in. When it finishes the table exists and holds no rows at all." },
                                { type: "p", text: "Everything decided here is then enforced on every row added afterwards, however it arrives. That is the difference between a table and a spreadsheet: the rules live with the data, not with whoever is typing." },
                            ],
                        },
                    ],
                },
                {
                    type: "focus",
                    file: "client_form.sql",
                    at: "insert",
                    blocks: [
                        { type: "analogy", text: "The first three clients filling in their forms and handing them to the front desk, which files them." },
                        { type: "h", text: "Adding rows" },
                        { type: "p", text: "INSERT INTO names the table and the columns being filled. Each set of brackets after VALUES is one [[row]]." },
                        {
                            type: "more",
                            label: "The values line up by position, and id is deliberately missing",
                            blocks: [
                                { type: "p", text: "Each value matches the column in the same position in the list above it. Get the order wrong and the data still goes in, just into the wrong boxes." },
                                { type: "p", text: "id is not listed at all. It is SERIAL, so the database fills it in and counts up on its own, which is what keeps every form reliably distinct even when two clients share a name." },
                            ],
                        },
                        {
                            type: "more",
                            label: "All three rows go in as one command, not three",
                            blocks: [
                                { type: "p", text: "One INSERT INTO can carry as many rows as you list, separated by commas, with a single semicolon at the end." },
                                { type: "p", text: "It is also all or nothing. If one row breaks a rule, none of them are stored, which stops a half-finished insert leaving the table in a state nobody expected." },
                            ],
                        },
                    ],
                },
                {
                    type: "focus",
                    file: "client_form.sql",
                    at: ["selectall", "selectcols"],
                    blocks: [
                        { type: "analogy", text: "The office worker pulling forms from the cabinet. Sometimes all of them, sometimes just one person's, sometimes only a couple of the boxes off each form." },
                        { type: "h", text: "Reading the data" },
                        { type: "p", text: "Three [[query|queries]], each asking for something different." },
                        {
                            type: "table",
                            head: ["Query", "Returns"],
                            rows: [
                                ["SELECT * FROM client_form", "Every column, every row"],
                                ["SELECT * FROM client_form WHERE name = 'Maya'", "Every column, only matching rows"],
                                ["SELECT name, mood FROM client_form WHERE first_visit = true", "Only those two columns, only matching rows"],
                            ],
                            mono: [0],
                        },
                        {
                            type: "more",
                            label: "Rows and columns are controlled separately",
                            blocks: [
                                { type: "p", text: "The star means all columns, and listing names instead limits which columns come back. WHERE is what [[filter|filters]] which rows come back." },
                                { type: "p", text: "They do not affect each other, which is why the three queries can vary one, the other, or both. Holding that apart in your head makes every query after this one easier to read." },
                            ],
                        },
                        {
                            type: "more",
                            label: "No rows matching is an answer, not an error",
                            blocks: [
                                { type: "p", text: "A SELECT that matches nothing succeeds and returns an empty result. The database is not reporting a problem, it is telling you nobody fits." },
                                { type: "p", text: "Worth knowing early, because code that treats an empty result as a failure will be wrong the first time somebody looks up a client who is not there." },
                            ],
                        },
                    ],
                },
                {
                    type: "focus",
                    file: "client_form.sql",
                    at: ["selectall", "selectcols"],
                    try: true,
                    blocks: [
                        { type: "h", text: "Run a query yourself" },
                        { type: "p", text: "Switch the code panel to Try it. The queries run against the live client_form data, so changing the columns or the value after WHERE changes what comes back." },
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
                        ["What is the difference between a row and a column?", "A column is one box that every form shares, such as age. A row is one complete filled-in form, one client, with all of its values."],
                        ["Why is id not included in the INSERT INTO?", "Because it is defined as SERIAL, which means the database assigns the value automatically."],
                        ["What happens if you file a form with no name?", "The database rejects it, because name is defined as NOT NULL, which makes a value required."],
                        ["Why is name not marked UNIQUE?", "Two clients really can share a name, so requiring names to differ would be wrong. The id, assigned by the database, is what keeps the forms distinct."],
                        ["How do you return only some columns?", "List them after SELECT instead of using the star, for example SELECT name, mood."],
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
                    name: "more-queries.sql",
                    result: {
                        kind: "table",
                        source: "clientForm",
                        caption: "The last query in this file: name and mood, first visits only.",
                        columns: ["name", "mood"],
                        filter: (c) => c.first_visit === true,
                    },
                    code: `-- You already know this one
SELECT * FROM client_form;

-- Sorted, and only the top rows
SELECT name, age FROM client_form
  ORDER BY age DESC
  LIMIT 2;

-- Two conditions at once
SELECT name FROM client_form
  WHERE first_visit = true
AND state = 'Oregon';

-- Answering "how many" instead of "which ones"
SELECT COUNT(*) FROM client_form;

SELECT AVG(age) FROM client_form
  WHERE first_visit = true;`,
                },
                {
                    name: "two-tables.sql",
                    code: `-- Changing a row that already exists
UPDATE client_form
  SET mood = 'calm'
  WHERE name = 'Maya';

-- Removing one
DELETE FROM client_form
  WHERE name = 'Maya';

-- A second table. client_id holds an id
-- from the client_form table you built.
CREATE TABLE sessions (
  id         SERIAL PRIMARY KEY,
  client_id  INTEGER REFERENCES client_form(id),
  session_on DATE NOT NULL,
  notes      VARCHAR(200)
);

-- Bringing the two tables back together
SELECT client_form.name, sessions.session_on
  FROM client_form
  JOIN sessions
ON sessions.client_id = client_form.id;`,
                },
            ],
            blocks: [
                { type: "p", text: "The code alongside this section shows what these ideas look like written out. The parts you already know are still there, with the new pieces added around them." },
                { type: "coderef" },
                { type: "h", text: "Changing and removing rows" },
                { type: "code", name: "more.sql", code: `UPDATE client_form SET mood = 'calm' WHERE name = 'Maya';\n\nDELETE FROM client_form WHERE name = 'Maya';` },
                { type: "note", label: "Careful", warn: true, text: "Both commands work without a WHERE clause. An UPDATE without one changes every row, and a DELETE without one empties the table." },
                { type: "h", text: "More ways to query" },
                {
                    type: "table",
                    head: ["Keyword", "What it does"],
                    rows: [
                        ["ORDER BY", "Sorts the rows that come back"],
                        ["LIMIT", "Returns only the first few rows"],
                        ["AND, OR", "Combines filters in one WHERE"],
                        ["COUNT, SUM, AVG", "Summarises instead of listing"],
                    ],
                    mono: [0],
                },
                {
                    type: "more",
                    label: "A second table points back at this one by holding its id",
                    blocks: [
                        { type: "p", text: "Larger applications split information across several tables instead of repeating it. Here each therapy session is its own row in a sessions table, and it points back at one client by holding that client's id." },
                        { type: "p", text: "A FOREIGN KEY is a column that points at a row in another table, and a JOIN brings the two back together in one query. This is where the PRIMARY KEY earns its place, because it is the value other tables point at." },
                    ],
                },
                { type: "h", text: "Practice" },
                {
                    type: "list",
                    items: [
                        "Write a query returning only clients who are not on their first visit.",
                        "Write a query returning name and age, sorted by age, oldest first.",
                        "Insert a client with no first_visit value, and read the error the NOT NULL constraint produces.",
                    ],
                },
            ],
        },
    ],
};
