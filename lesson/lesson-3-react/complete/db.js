// The database connection. One pool, shared by every helper in this folder.
//
// The same few lines as the class project, and the same as the other lessons:
// this is setup you have written before, not something to work out again.

import pg from "pg";
import config from "../../config.js";

const db = new pg.Pool({
  connectionString: config.databaseUrl + "&uselibpqcompat=true",
  ssl: true,
});

// Not part of the lesson, and here rather than in server.js so it stays out of
// the way of the code being written.
//
// Express 4 does not catch a rejected promise from an async handler, so a query
// the database refuses would otherwise stop the process: sending an animal with
// no name, which the table rejects for being NOT NULL, would end the demo. This
// prints what happened and carries on. Handling it properly, per endpoint, is
// what the Going further section of the lesson covers.
process.on("unhandledRejection", (error) => {
  console.error("");
  console.error(`  The database refused that: ${error.message}`);
  console.error("  The server is still running. Try another request.");
  console.error("");
});

export default db;
