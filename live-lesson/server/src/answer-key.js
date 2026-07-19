// ANSWER KEY
//
// What goes in each marked section of index.js. Copy the section you need, or
// read it and type it out.
//
// The website explains why any of this works. This is only the what.

// ═══════════════════════════════════════════════════════════════════════
// LESSON 2.  The POST endpoint.
//
// async because the database takes time, and await is what waits for it.
// The $1 placeholders keep the values out of the command, which is what
// stops a value containing SQL from running as SQL.
// RETURNING * hands back the row the database just made, id and all.
// ═══════════════════════════════════════════════════════════════════════

app.post("/add-one-animal", async (req, res) => {
  const { name, category, can_fly, lives_in } = req.body;

  const result = await db.query(
    `INSERT INTO lesson_one_table
       (name, category, can_fly, lives_in)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [name, category, can_fly, lives_in],
  );

  const animal = result.rows[0];

  res.send(`The farm has grown: ${animal.name} was added!`);
});

// ═══════════════════════════════════════════════════════════════════════
// LESSON 3.  The GET endpoint.
//
// A GET sends no body, so there is nothing to read off req.
// The rows come back on result.rows, and that is what the page wants.
// ═══════════════════════════════════════════════════════════════════════

app.get("/get-all-animals", async (req, res) => {
  const result = await db.query("SELECT * FROM lesson_one_table ORDER BY id");

  res.json(result.rows);
});
