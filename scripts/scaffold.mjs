// Fills a scaffold in, or puts its blanks back.
//
//   npm run fill 2         lesson 2's scaffold becomes the finished code
//   npm run fill 3         same for lesson 3
//   npm run blanks 2       puts the blanks back
//
// Why this exists: during a session the scaffold is the file being typed into.
// If the room runs out of time, or you want to rehearse from the finished state,
// you want the working version without retyping it. `npm run lesson2` already
// runs the finished copy, but it runs the OTHER folder, so the file on screen
// still shows blanks. This changes the file you are actually looking at.
//
// It refuses to overwrite work it did not put there. The scaffold is committed,
// so anything you have typed shows as an uncommitted change, and that is enough
// to tell the two apart.

import { execFileSync } from "node:child_process";
import { cpSync, existsSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join, relative } from "node:path";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");

const LESSONS = {
  2: { dir: "lesson/lesson-2-post", run: "npm run lesson2:scaffold" },
  3: { dir: "lesson/lesson-3-react", run: "npm run lesson3:scaffold" },
};

const [, , mode, which] = process.argv;
const lesson = LESSONS[which];

if (!lesson) {
  console.error("");
  console.error("  Which lesson? 2 or 3.");
  console.error("");
  console.error("    npm run fill 2      fill lesson 2's scaffold in");
  console.error("    npm run blanks 2    put its blanks back");
  console.error("");
  process.exit(1);
}

const scaffold = join(root, lesson.dir, "scaffold");
const complete = join(root, lesson.dir, "complete");

const git = (...args) => execFileSync("git", args, { cwd: root, encoding: "utf8" });

// Anything uncommitted under the scaffold is work somebody typed.
const typed = () =>
  git("status", "--porcelain", "--", relative(root, scaffold))
    .split("\n")
    .filter(Boolean);

if (mode === "fill") {
  const yours = typed();
  if (yours.length && !process.argv.includes("--force")) {
    console.error("");
    console.error(`  Lesson ${which}'s scaffold has changes that are not committed:`);
    for (const line of yours) console.error(`    ${line.trim()}`);
    console.error("");
    console.error("  Filling it in would overwrite them. If that is what you want:");
    console.error(`    npm run fill ${which} -- --force`);
    console.error("");
    process.exit(1);
  }

  // public/ holds the page and the component in lesson 3; copying the whole
  // folder keeps them together. db.js is identical in both, so this is a no-op
  // for it either way.
  cpSync(complete, scaffold, { recursive: true, force: true });

  console.log("");
  console.log(`  Lesson ${which}'s scaffold is now the finished code.`);
  console.log(`  Run it:            ${lesson.run}`);
  console.log(`  Put the blanks back: npm run blanks ${which}`);
  console.log("");
} else if (mode === "blanks") {
  git("checkout", "--", relative(root, scaffold));
  // A file the complete folder has and the scaffold does not would survive the
  // checkout, since git only restores what it tracks.
  const strays = git("clean", "-nd", "--", relative(root, scaffold)).split("\n").filter(Boolean);
  if (strays.length) git("clean", "-fd", "--", relative(root, scaffold));

  console.log("");
  console.log(`  Lesson ${which}'s scaffold is back to blanks.`);
  console.log(`  Run it:  ${lesson.run}`);
  console.log("");
} else {
  console.error(`  Unknown command "${mode}". Use fill or blanks.`);
  process.exit(1);
}

if (!existsSync(scaffold)) {
  console.error(`  ${scaffold} is missing.`);
  process.exit(1);
}
