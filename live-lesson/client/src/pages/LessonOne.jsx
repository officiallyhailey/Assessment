// LESSON 1.  Done in Neon, not in a file.

import { useState, useEffect } from "react";

const SQL = `CREATE TABLE lesson_one_table (
  id          SERIAL PRIMARY KEY,
  name        VARCHAR(100) NOT NULL UNIQUE,
  category    VARCHAR(50),
  can_fly     BOOLEAN NOT NULL,
  lives_in    VARCHAR(100),
  population  INTEGER
);

INSERT INTO lesson_one_table
  (name, category, can_fly, lives_in, population)
VALUES
  ('Lion',    'Mammal', false, 'Savanna',    23000),
  ('Penguin', 'Bird',   false, 'Antarctica', 1200000),
  ('Eagle',   'Bird',   true,  'Mountains',  5000);`;

function LessonOne() {
  const [rows, setRows] = useState([]);
  const [missing, setMissing] = useState(false);

  const load = async () => {
    const response = await fetch("/api/lesson-one-table");
    if (!response.ok) return setMissing(true);
    setMissing(false);
    setRows(await response.json());
  };

  useEffect(() => {
    load();
  }, []);

  return (
    <>
      <section>
        <h2>How to run it</h2>
        <ol>
          <li>Open your database in Neon and go to the SQL editor.</li>
          <li>Run the SQL below.</li>
          <li>Come back here and press Check.</li>
        </ol>
        <pre>{SQL}</pre>
        <button onClick={load}>Check</button>
      </section>

      <section>
        <h2>What is in the table</h2>
        <p className="note">
          <code>lesson_one_table</code> belongs to this lesson alone. Lessons 2
          and 3 use a different table that is already set up.
        </p>
        {missing ? (
          <p className="empty">
            No table yet. Run the SQL above, then press Check.
          </p>
        ) : (
          <Table rows={rows} />
        )}
      </section>
    </>
  );
}

function Table({ rows }) {
  if (rows.length === 0) return <p className="empty">The table is empty.</p>;

  const columns = Object.keys(rows[0]);

  return (
    <div className="scroll">
      <table>
        <thead>
          <tr>
            {columns.map((c) => (
              <th key={c}>{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.id}>
              {columns.map((c) => (
                <td key={c}>{row[c] === null ? "—" : String(row[c])}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export { Table };
export default LessonOne;
