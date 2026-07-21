// Lesson 01, creating a table with SQL.
//
// Page content as data. Blocks render through src/components/Blocks.jsx. The
// sample in `code` is used two ways: the code accordion in "The code" slices it
// into the stretches it explains, and the Try it query runner runs against it.
//
// A section may declare a `stage`, which drives the right-hand panel: "Defining
// columns" shows the blank form, "The code" shows the code as an accordion. See
// components/Stage.jsx. Line notes for Context and Flow live in ../annotations.js.
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
    // Paged rather than scroll-tracked. The SQL is three separate statements,
    // not one program to read down a file, so each section is its own screen and
    // the panel beside it shows what that section is about. See PagedLesson.jsx.
    paged: true,
    // No lede on purpose. The overview opens with the office analogy, which
    // eases in gentler than a one-line definition stacked with terms.
    code: [
        {
            name: "client_form.sql",
            // Try it puts the query runner inside the accordion, beside the SQL
            // it is running, rather than further down the page.
            try: "sql",
            // Written in parts so the accordion can name a region rather than a
            // line number. See lib/sample.js.
            parts: [
                {
                    id: "create",
                    code: `CREATE TABLE client_form (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL,
  age         INTEGER,
  email       VARCHAR(255) NOT NULL UNIQUE,
  mood        VARCHAR(50),
  first_visit BOOLEAN NOT NULL
);`,
                },
                {
                    id: "insert",
                    code: `INSERT INTO client_form
  (name, age, email, mood, first_visit)
VALUES
  ('Maya',   34, 'maya@example.com',   'anxious', true),
  ('Daniel', 41, 'daniel@example.com', 'hopeful', false),
  ('Priya',  29, 'priya@example.com',  'tired',   true);`,
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
                { type: "p", text: "A therapy office has a check-in form. Before anyone fills one in, someone designs the blank form: which boxes it has, what kind of answer each box takes, and which cannot be left blank. Then clients start filling them in, and the office keeps the filled forms." },
                {
                    type: "figuretoggle",
                    labels: ["The office", "In code"],
                    views: [
                        {
                            src: "/topic1-plain.png",
                            alt: "A blank check-in form is designed, clients fill copies in, and the filled forms are kept in a filing cabinet",
                            caption: "Create the blank form, fill some in, keep them to look up later.",
                        },
                        {
                            src: "/topic1-tech.png",
                            alt: "CREATE TABLE defines the columns, INSERT INTO adds rows, SELECT reads them back",
                            caption: "The same three moves, with the real words.",
                        },
                    ],
                },
                { type: "h", text: "How it works" },
                { type: "p", text: "The filled forms are kept in a [[table]]: a grid, much like a ((spreadsheet|Unlike a spreadsheet, where any cell can hold anything, a table fixes what each column may hold and rejects whatever does not fit. It also handles many people reading and writing at once, which is what an office, or an app, needs.)). Each box on the form is a [[column]], each filled-in form is a [[row]], and the instructions are written in [[sql|SQL]]." },
                {
                    type: "table",
                    head: ["The office", "In code", "Command"],
                    rows: [
                        ["Create the blank form", "Define the table and its columns", "CREATE TABLE"],
                        ["A client fills one in", "Add a row", "INSERT INTO"],
                        ["Look someone up", "Read rows back", "SELECT"],
                    ],
                    mono: [2],
                },
                { type: "p", text: "That is the whole lesson: one command to design the form, one to fill it in, one to look someone up. Everything below is detail inside one of the three." },
            ],
        },
        {
            id: "columns",
            label: "Defining columns",
            heading: "Data types and constraints",
            // The panel shows the same client_form two ways, with a toggle: the
            // filled table and the blank form. It opens on the table.
            panel: { kind: "preview", start: "table" },
            blocks: [
                { type: "analogy", text: "Designing the boxes on the blank check-in form. Each box says what kind of answer belongs in it, a number for age, a date for the visit, a yes or no for first time here, and some boxes are marked so they cannot be left blank." },
                { type: "p", text: "In code that is two things per column: a [[data type]], and optionally one or more [[constraint|constraints]]." },
                { type: "h", text: "Data types" },
                { type: "p", text: "A data type says what kind of value a column holds, and ((why it matters|A number kept as text will not sort or total correctly, because text is compared one character at a time, so 100 would sort before 34. INTEGER lets age be sorted and averaged; DATE lets the visit be compared and put in order.)) it decides what you can do with that column later." },
                {
                    type: "table",
                    head: ["Type", "Holds", "On the form"],
                    rows: [
                        ["SERIAL", "A number the database assigns automatically", "the client's number"],
                        ["VARCHAR(100)", "Text, up to 100 characters", "'Maya'"],
                        ["INTEGER", "A whole number", "34"],
                        ["BOOLEAN", "true or false", "first visit?"],
                    ],
                    mono: [0, 2],
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
                { type: "p", text: "On this form id is the [[primary key]]; name, email and first_visit are NOT NULL, the boxes marked required; and ((age and mood|A column with no NOT NULL rule may be left null, the absence of a value, which is not zero or empty text. age and mood are optional because a client may not give them, while name, email and first_visit are required because the office needs each one.)) may be left blank." },
                { type: "p", text: "email is the box marked ((UNIQUE|UNIQUE is the no-duplicates rule, separate from the PRIMARY KEY, and a table can have several. email is unique because an address belongs to one person, so two clients sharing one would be a mistake the database should catch. name is left off it on purpose: two clients really can share a name, which is exactly why the office also assigns everyone a number.)): no two clients can share an address. name is deliberately not, because two people really can share one." },
            ],
        },
        {
            id: "code",
            label: "The code",
            heading: "Creating, inserting, and selecting",
            // The panel shows the whole client_form.sql at once. The toggle below
            // picks which of the three statements is being explained, and lights
            // up its lines in the panel. Switch the panel to Try it to run them.
            toggle: {
                file: "client_form.sql",
                options: [
                    {
                        id: "create",
                        label: "Create table",
                        at: "create",
                        blocks: [
                            { type: "analogy", text: "Making the blank form: deciding the fields and how each one behaves." },
                            { type: "p", text: "Each line inside the brackets defines one [[column]]: name first, then [[data type]], then any [[constraint|constraints]]." },
                            { type: "p", text: "Nothing is stored yet, and ((that is the point|The command describes a shape rather than filling one in. When it finishes the table exists and holds no rows. Everything decided here is then enforced on every row added afterwards, however it arrives, which is the difference between a table and a spreadsheet.)) that is deliberate." },
                        ],
                    },
                    {
                        id: "insert",
                        label: "Input data",
                        at: "insert",
                        blocks: [
                            { type: "analogy", text: "The first three clients filling in their forms and handing them to the front desk." },
                            { type: "p", text: "INSERT INTO names the table and the columns being filled. Each set of brackets after VALUES is one [[row]], its values lining up ((by position|Each value matches the column in the same position in the list above. Get the order wrong and the data still goes in, just into the wrong boxes.)) with the column list." },
                            { type: "p", text: "id is not listed at all, because ((SERIAL fills it in|id is defined as SERIAL, so the database assigns it and counts up on its own. That is what keeps every form distinct even when two clients share a name.)) it assigns itself. All three rows go in as ((one command|One INSERT INTO carries as many rows as you list, separated by commas, with a single semicolon at the end. It is all or nothing: if one row breaks a rule, none are stored.)) a single command." },
                        ],
                    },
                    {
                        id: "read",
                        label: "Read data",
                        at: ["selectall", "selectcols"],
                        blocks: [
                            { type: "analogy", text: "The office worker pulling forms from the cabinet, sometimes all of them, sometimes one person's, sometimes only a couple of the boxes off each." },
                            { type: "p", text: "Three [[query|queries]], each asking for something different." },
                            {
                                type: "table",
                                head: ["Query", "Returns"],
                                rows: [
                                    ["SELECT * FROM client_form", "Every column, every row"],
                                    ["... WHERE name = 'Maya'", "Every column, only matching rows"],
                                    ["SELECT name, mood ... WHERE first_visit = true", "Only those columns, only matching rows"],
                                ],
                                mono: [0],
                            },
                            { type: "p", text: "Rows and columns are ((controlled separately|The star means all columns; listing names limits which columns come back. WHERE filters which rows come back. They do not affect each other, which is why the three queries can vary one, the other, or both.)) chosen independently. And a query that matches nothing ((is not an error|A SELECT that matches nothing succeeds and returns an empty result. It is telling you nobody fits, not reporting a problem. Code that treats empty as failure breaks the first time someone looks up a client who is not there.)) still succeeds." },
                            { type: "p", text: "Switch the panel to Try it to run these against the live data, then change a column or a value after WHERE and see what comes back." },
                        ],
                    },
                ],
            },
            blocks: [
                { type: "p", text: "The full example designs the [[table]], files three clients in, then reads them back three ways. It is all one file, shown on the right. Pick a statement below to walk through it, and its lines light up." },
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
AND mood = 'anxious';

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
                { type: "h", text: "Storing a date" },
                { type: "p", text: "One [[data type]] the check-in table leaves out is DATE, for a calendar day like 2026-02-10. Stored as a real date rather than loose text, it can be compared and put in order, so you can ask for visits before a certain day or sort by when they happened. The sessions table below uses it for session_on." },
                { type: "p", text: "Larger applications split information across several tables instead of repeating it, and ((point back with an id|Each therapy session is its own row in a sessions table, and it points back at one client by holding that client's id. A FOREIGN KEY is a column holding the id of a row in another table; a JOIN brings the two back together in one query. This is where the PRIMARY KEY earns its place, as the value other tables point at.)) connect them by id." },
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
