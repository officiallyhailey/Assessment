// Lesson 01, creating a table with SQL.
//
// Page content as data. Blocks render through src/components/Blocks.jsx, and
// `code` is the sample pinned beside the lesson on wide screens. A section may
// carry its own `code`, which takes over the panel while that section is read.
//
// Line notes for the Context and Flow modes live in ../annotations.js, keyed by
// the sample's file name.

export const sqlTables = {
    slug: "sql-tables",
    num: "Lesson 01",
    title: "Create a Database Table with SQL",
    blurb: "Create a table, add rows to it, and query the data back out.",
    tags: ["CREATE TABLE", "INSERT INTO", "SELECT"],
    lede: "A database table stores information in rows and columns. This lesson covers three commands: one to create a table, one to add data, and one to read it back.",
    code: [
        {
            name: "animals.sql",
            // Try it puts the query runner inside the panel, beside the SQL it
            // is running, rather than further down the page.
            try: "sql",
            code: `CREATE TABLE animals (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL UNIQUE,
  category    VARCHAR(50),
  can_fly     BOOLEAN NOT NULL,
  lives_in    VARCHAR(100),
  population  INTEGER
);

INSERT INTO animals
  (name, category, can_fly, lives_in, population)
VALUES
  ('Lion',    'Mammal', false, 'Savanna',    23000),
  ('Penguin', 'Bird',   false, 'Antarctica', 1200000),
  ('Eagle',   'Bird',   true,  'Mountains',  5000);

SELECT * FROM animals;

SELECT * FROM animals
  WHERE name = 'Lion';

SELECT name, lives_in FROM animals
  WHERE can_fly = true;`,
        },
    ],
    sections: [
        {
            id: "overview",
            label: "Overview",
            heading: "What a table is",
            blocks: [
                { type: "p", text: "A database [[table]] stores information in a grid, much like a spreadsheet." },
                {
                    type: "list",
                    items: [
                        "A [[column]] is one piece of information, such as a name. Every record has the same columns.",
                        "A [[row]] is one complete record, such as one animal.",
                    ],
                },
                { type: "p", text: "This lesson builds a table of animals: six columns, and each animal one row. The instructions are written in [[sql|SQL]]." },
                { type: "figure", src: "/topic1.png", alt: "The animals table drawn as a grid of rows and columns, with CREATE TABLE, INSERT INTO and SELECT underneath" },
                { type: "h", text: "Three commands" },
                {
                    type: "table",
                    head: ["Command", "What it does"],
                    rows: [
                        ["CREATE TABLE", "Creates the table and defines its columns"],
                        ["INSERT INTO", "Adds rows of data"],
                        ["SELECT", "Reads data back out"],
                    ],
                    mono: [0],
                },
                { type: "p", text: "That is the whole lesson. Everything below is detail inside one of those three commands." },
                {
                    type: "more",
                    label: "Why use a database instead of a spreadsheet",
                    blocks: [
                        { type: "p", text: "In a spreadsheet, any cell can hold anything. Someone can type the word none into a column of numbers and the file accepts it." },
                        { type: "p", text: "A database table defines what each column is allowed to hold, and rejects anything that does not fit. It also handles many people reading and writing at the same time, which is what an application needs." },
                    ],
                },
            ],
        },
        {
            id: "columns",
            label: "Defining columns",
            heading: "Data types and constraints",
            blocks: [
                { type: "p", text: "Each column needs a [[data type]], and optionally one or more [[constraint|constraints]]." },
                { type: "h", text: "Data types" },
                { type: "p", text: "A data type says what kind of value a column holds." },
                {
                    type: "table",
                    head: ["Type", "Holds", "Example"],
                    rows: [
                        ["SERIAL", "A number the database assigns automatically", "1, 2, 3"],
                        ["INTEGER", "A whole number", "23000"],
                        ["VARCHAR(100)", "Text, up to 100 characters", "'Lion'"],
                        ["BOOLEAN", "true or false", "false"],
                    ],
                    mono: [0, 2],
                },
                {
                    type: "more",
                    label: "The type decides what the column will accept, and what you can do with it later",
                    blocks: [
                        { type: "p", text: "A number stored as text does not sort or add up correctly. Text is compared one character at a time, so 1200000 would sort before 23000 because 1 comes before 2." },
                        { type: "p", text: "Choosing INTEGER for population means the database can sort it, total it, and average it correctly." },
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
                    title: "Lines 2 to 7",
                    file: "animals.sql",
                    lines: "2-7",
                    blocks: [
                        { type: "p", text: "In the example id is the [[primary key]], name is NOT NULL and UNIQUE, and category has no constraints at all, which is what makes it optional." },
                        {
                            type: "more",
                            label: "PRIMARY KEY and UNIQUE look similar, and the difference matters",
                            blocks: [
                                { type: "p", text: "A PRIMARY KEY is the column that identifies the row. It is unique, it cannot be empty, and a table has exactly one." },
                                { type: "p", text: "UNIQUE is only the no duplicates rule, and a table can have several. In the example id identifies each animal, while name is kept unique so the same animal cannot be added twice." },
                            ],
                        },
                        {
                            type: "more",
                            label: "A column with no constraints may be left empty, which is called null",
                            blocks: [
                                { type: "p", text: "[[null]] is the absence of a value, and it is not the same as zero or as empty text. It means nothing was recorded here." },
                                { type: "p", text: "That is why leaving a column unconstrained is a decision rather than an oversight. category is optional on purpose, and can_fly is NOT NULL because an animal that might or might not fly is no use to anybody." },
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
                { type: "p", text: "The full example creates the [[table]], adds three animals, then reads them back three ways." },
                { type: "coderef" },
                {
                    type: "focus",
                    title: "Lines 1 to 8",
                    file: "animals.sql",
                    lines: "1-8",
                    blocks: [
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
                    title: "Lines 10 to 15",
                    file: "animals.sql",
                    lines: "10-15",
                    blocks: [
                        { type: "h", text: "Adding rows" },
                        { type: "p", text: "INSERT INTO names the table and the columns being filled. Each set of brackets after VALUES is one [[row]]." },
                        {
                            type: "more",
                            label: "The values line up by position, and id is deliberately missing",
                            blocks: [
                                { type: "p", text: "Each value matches the column in the same position in the list above it. Get the order wrong and the data still goes in, just into the wrong columns." },
                                { type: "p", text: "id is not listed at all. It is SERIAL, so the database fills it in and counts up on its own, which is what keeps every row reliably distinct." },
                            ],
                        },
                        {
                            type: "more",
                            label: "All three rows go in as one command, not three",
                            blocks: [
                                { type: "p", text: "One INSERT INTO can carry as many rows as you list, separated by commas, with a single semicolon at the end." },
                                { type: "p", text: "It is also all or nothing. If one row breaks a rule, none of them are stored, which stops a half finished insert leaving the table in a state nobody expected." },
                            ],
                        },
                    ],
                },
                {
                    type: "focus",
                    title: "Lines 17 to 23",
                    file: "animals.sql",
                    lines: "17-23",
                    blocks: [
                        { type: "h", text: "Reading the data" },
                        { type: "p", text: "Three [[query|queries]], each asking for something different." },
                        {
                            type: "table",
                            head: ["Query", "Returns"],
                            rows: [
                                ["SELECT * FROM animals", "Every column, every row"],
                                ["SELECT * FROM animals WHERE name = 'Lion'", "Every column, only matching rows"],
                                ["SELECT name, lives_in FROM animals WHERE can_fly = true", "Only those two columns, only matching rows"],
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
                                { type: "p", text: "A SELECT that matches nothing succeeds and returns an empty result. The database is not reporting a problem, it is telling you nothing fits." },
                                { type: "p", text: "Worth knowing early, because code that treats an empty result as a failure will be wrong the first time somebody searches for something that is not there." },
                            ],
                        },
                    ],
                },
                {
                    type: "focus",
                    file: "animals.sql",
                    lines: "17-23",
                    try: true,
                    blocks: [
                        { type: "h", text: "Run a query yourself" },
                        { type: "p", text: "Switch the code panel to Try it. The queries run against the live animals data, so changing the columns or the value after WHERE changes what comes back." },
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
                        ["What is the difference between a row and a column?", "A column is one piece of information that every record shares, such as name. A row is one complete record, such as one animal with all of its values."],
                        ["Why is id not included in the INSERT INTO?", "Because it is defined as SERIAL, which means the database assigns the value automatically."],
                        ["What happens if you insert an animal with no name?", "The database rejects it, because name is defined as NOT NULL, which makes a value required."],
                        ["What does WHERE do?", "It filters which rows are returned. Without it, every row comes back."],
                        ["How do you return only some columns?", "List them after SELECT instead of using the star, for example SELECT name, lives_in."],
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
                        caption: "The last query in this file: name and population, birds only.",
                        columns: ["name", "population"],
                        filter: (a) => a.category === "Bird",
                    },
                    code: `-- You already know this one
SELECT * FROM animals;

-- Sorted, and only the top rows
SELECT name, population FROM animals
  ORDER BY population DESC
  LIMIT 2;

-- Two conditions at once
SELECT name FROM animals
  WHERE can_fly = true
AND category = 'Bird';

-- Answering "how many" instead of "which ones"
SELECT COUNT(*) FROM animals;

SELECT AVG(population) FROM animals
  WHERE category = 'Bird';`,
                },
                {
                    name: "two-tables.sql",
                    code: `-- Changing a row that already exists
UPDATE animals
  SET lives_in = 'Zoo'
  WHERE name = 'Lion';

-- Removing one
DELETE FROM animals
  WHERE name = 'Lion';

-- A second table. animal_id holds an id
-- from the animals table you built.
CREATE TABLE sightings (
  id          SERIAL PRIMARY KEY,
  animal_id   INTEGER REFERENCES animals(id),
  spotted_on  DATE NOT NULL,
  notes       VARCHAR(200)
);

-- Bringing the two tables back together
SELECT animals.name, sightings.spotted_on
  FROM animals
  JOIN sightings
ON sightings.animal_id = animals.id;`,
                },
            ],
            blocks: [
                { type: "p", text: "The code alongside this section shows what these ideas look like written out. The parts you already know are still there, with the new pieces added around them." },
                { type: "coderef" },
                { type: "h", text: "Changing and removing rows" },
                { type: "code", name: "more.sql", code: `UPDATE animals SET lives_in = 'Zoo' WHERE name = 'Lion';\n\nDELETE FROM animals WHERE name = 'Lion';` },
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
                        { type: "p", text: "Larger applications split information across several tables instead of repeating it. A FOREIGN KEY is a column that points at a row in another table, and a JOIN brings the two back together in one query." },
                        { type: "p", text: "This is where the PRIMARY KEY earns its place, because it is the value other tables point at." },
                    ],
                },
                { type: "h", text: "Practice" },
                {
                    type: "list",
                    items: [
                        "Insert an animal with a name that already exists, and read the error the UNIQUE constraint produces.",
                        "Write a query returning only animals that cannot fly.",
                        "Write a query returning name and population, sorted by population, largest first.",
                    ],
                },
            ],
        },
    ],
};
