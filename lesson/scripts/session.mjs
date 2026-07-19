// Puts the project into the state you want for a session.
//
//   npm run session 2          lesson 2, blanks to fill in
//   npm run session 2 done     lesson 2, finished
//   npm run session 3          lesson 3, blanks
//   npm run session 3 done     lesson 3, finished
//
// There is one client and one server, the way a real project has one of each.
// What changes between lessons is which files are in it and what is written in
// them, and that is what this copies into place.
//
// Only one topic is taught in a session, so lesson 2 has no GET endpoint at all
// and lesson 3 has no POST. Neither is hiding the other's work: it is simply
// not there.

import { copyFileSync, existsSync, mkdirSync, rmSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, "..");

// A variant file is named for where it goes, with slashes flattened, so the
// mapping is readable in a directory listing.
const PLACES = {
  "server-src-index.js": "server/src/index.js",
  "server-src-animals-helpers.js": "server/src/animals-helpers.js",
  "client-src-AnimalList.jsx": "client/src/AnimalList.jsx",
};

const FILES = {
  2: ["server-src-index.js", "server-src-animals-helpers.js"],
  3: ["server-src-index.js", "server-src-animals-helpers.js", "client-src-AnimalList.jsx"],
};

const [, , which, state = "blank"] = process.argv;

if (!FILES[which] || !["blank", "done"].includes(state)) {
  console.error("");
  console.error("  npm run session 2          lesson 2, blanks to fill in");
  console.error("  npm run session 2 done     lesson 2, finished");
  console.error("  npm run session 3          lesson 3, blanks");
  console.error("  npm run session 3 done     lesson 3, finished");
  console.error("");
  process.exit(1);
}

// Clear anything the previous session left, so lesson 3 never finds lesson 2's
// endpoint sitting in the file.
for (const target of Object.values(PLACES)) {
  const path = join(root, target);
  if (existsSync(path)) rmSync(path);
}

for (const file of FILES[which]) {
  const from = join(root, "variants", `lesson-${which}`, state, file);
  const to = join(root, PLACES[file]);
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
}

// Lesson 2 has no client work, so the page would import a component that is not
// there. It gets a placeholder telling the room where to look instead.
if (which === "2") {
  copyFileSync(join(root, "variants", "AnimalList.placeholder.jsx"), join(root, "client/src/AnimalList.jsx"));
}

console.log("");
console.log(`  Lesson ${which}, ${state === "done" ? "finished" : "blanks to fill in"}.`);
console.log("");
console.log("  Files you write:");
for (const file of FILES[which]) console.log(`    ${PLACES[file]}`);
console.log("");
console.log("  Run it:");
console.log("    npm run server        terminal 1");
if (which === "3") console.log("    npm run client        terminal 2, then open localhost:5173");
else console.log("    then send the requests in server/requests.http, or use Postman");
console.log("");
