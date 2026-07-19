// The database connection. One pool, shared by every helper.
//
// These few lines are the same shape as the class project's, so the setup a
// student has already written is the setup they see here.

import pg from "pg";

// config.js is not committed, so it may genuinely not exist yet. Importing it
// then would throw a module-not-found stack trace, which is a poor thing to
// meet ten minutes before a lesson. This says what to do instead.
let config;
try {
  config = (await import("./config.js")).default;
} catch {
  console.error("");
  console.error("  server/src/config.js is missing.");
  console.error("");
  console.error("  Copy the example and paste your Neon connection string into it:");
  console.error("    cp server/src/config.example.js server/src/config.js");
  console.error("");
  console.error("  Or run without a database:  npm run dev:offline");
  console.error("");
  process.exit(1);
}

const db = new pg.Pool({
  connectionString: config.databaseUrl + "&uselibpqcompat=true",
  ssl: true,
});

// Neon suspends a free database when it is idle, and the first query after that
// takes seconds rather than milliseconds. The demos put their timing on screen
// to make the point that a request is not instant, so a cold start would land
// as a four second read and teach the wrong lesson. Waking it at boot means the
// first request a student sees is a warm one.
export async function warmUp() {
  const started = Date.now();
  await db.query("SELECT 1");
  return Date.now() - started;
}

export default db;
