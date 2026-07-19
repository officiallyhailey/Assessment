// Verifies the line numbers the lesson pages depend on.
//
// The code explorer couples prose to code by line number in three places: the
// `lines` on every focus block, the numbers spelled out in those blocks' titles,
// and every key in annotations.js. Nothing enforces them, and when one drifts
// the page still renders — it just highlights the wrong line, which reads as a
// working feature. This is the thing that notices.
//
// Run with `npm run check`. Exits non-zero with a list of problems.

import { lessons } from "../client/src/data/lessons/index.js";
import { ANNOTATIONS } from "../client/src/data/annotations.js";
import { parseLines } from "../client/src/lib/focus.js";

const problems = [];
const fail = (where, msg) => problems.push(`${where}\n    ${msg}`);

// Every sample the site can show, by name. A name can appear in more than one
// lesson's `code`, so the value is the first one found: they must agree anyway.
const samples = new Map();
for (const lesson of lessons) {
  const collect = (list) => {
    for (const sample of list || []) {
      if (!samples.has(sample.name)) samples.set(sample.name, sample);
    }
  };
  collect(lesson.code);
  for (const section of lesson.sections) collect(section.code);
}

const linesOf = (sample) => sample.code.split("\n");
const isBlank = (line) => !line || !line.trim();

// The lines a spec names in its own right, as opposed to the ones it merely
// spans. "6-9" names 6 and 9; "1,4" names both; "[4]" names 4.
function namedLines(spec) {
  if (!spec) return [];
  return String(spec)
    .split(",")
    .flatMap((part) => {
      const ends = part.split("-").map((n) => parseInt(n, 10)).filter(Number.isInteger);
      return ends.length ? [ends[0], ends[ends.length - 1]] : [];
    });
}

// Walks nested blocks, since a focus can live inside a `more` dropdown.
function eachBlock(blocks, fn) {
  for (const block of blocks || []) {
    fn(block);
    if (block.blocks) eachBlock(block.blocks, fn);
  }
}

// ---------------------------------------------------------------------------
// 1. Focus blocks: the file exists, and every line is real and not blank.
// 2. Titles that spell out line numbers agree with the block's own `lines`.
// ---------------------------------------------------------------------------
const TITLE_LINES = /^Lines? (\d+)(?:\s*(?:to|and|-)\s*(\d+))?/i;

for (const lesson of lessons) {
  // A section can carry its own code, which replaces the lesson's in the panel.
  for (const section of lesson.sections) {
    const visible = new Map();
    for (const sample of section.code || lesson.code || []) {
      visible.set(sample.name, sample);
    }

    eachBlock(section.blocks, (block) => {
      if (block.type !== "focus" || !block.file) return;
      const where = `${lesson.slug} / ${section.id} / focus "${block.title || "(untitled)"}"`;

      const sample = visible.get(block.file);
      if (!sample) {
        fail(where, `names file "${block.file}", which is not shown in this section`);
        return;
      }

      const source = linesOf(sample);
      const wanted = parseLines(block.lines);
      if (wanted.length === 0) {
        fail(where, `has no usable lines (lines: ${JSON.stringify(block.lines)})`);
        return;
      }

      for (const n of wanted) {
        if (n < 1 || n > source.length) {
          fail(where, `line ${n} is outside ${block.file}, which has ${source.length} lines`);
        }
      }

      // A range is allowed to span blank lines: they sit between the statements
      // it covers and simply do not light up. What must not be blank is a line
      // the spec names directly — an endpoint of a range, or a single line —
      // because that is where a slipped range shows itself.
      for (const n of namedLines(block.lines)) {
        if (n >= 1 && n <= source.length && isBlank(source[n - 1])) {
          fail(where, `line ${n} of ${block.file} is blank, and the range starts or ends on it`);
        }
      }

      const spelled = TITLE_LINES.exec(block.title || "");
      if (spelled) {
        const first = Number(spelled[1]);
        const last = spelled[2] ? Number(spelled[2]) : first;
        const lo = Math.min(...wanted);
        const hi = Math.max(...wanted);
        if (first !== lo || last !== hi) {
          fail(where, `title says ${first}${spelled[2] ? ` to ${last}` : ""}, but lines cover ${lo} to ${hi}`);
        }
      }
    });
  }
}

// ---------------------------------------------------------------------------
// 3. Annotations: the sample still exists, and every key is a real, non-blank
//    line. Blank and bracket-only lines are answered by lib/lineNotes.js
//    fallbacks by design, so an annotation landing on one signals drift.
// ---------------------------------------------------------------------------
for (const [name, entry] of Object.entries(ANNOTATIONS)) {
  const sample = samples.get(name);
  if (!sample) {
    fail(`annotations "${name}"`, "no sample by that name is shown anywhere");
    continue;
  }
  const source = linesOf(sample);

  for (const mode of ["context", "flow"]) {
    for (const key of Object.keys(entry[mode] || {})) {
      const n = Number(key);
      const where = `annotations "${name}" ${mode}[${key}]`;
      if (!Number.isInteger(n)) {
        fail(where, "key is not a line number");
      } else if (n < 1 || n > source.length) {
        fail(where, `outside the sample, which has ${source.length} lines`);
      } else if (isBlank(source[n - 1])) {
        fail(where, "lands on a blank line");
      }
    }
  }
}

// ---------------------------------------------------------------------------

const counts = {
  samples: samples.size,
  annotated: Object.keys(ANNOTATIONS).length,
};

if (problems.length) {
  console.error(`\n  ${problems.length} problem${problems.length === 1 ? "" : "s"} in the lesson line numbers:\n`);
  for (const p of problems) console.error(`  ${p}\n`);
  process.exit(1);
}

console.log(`  lesson line numbers OK  (${counts.samples} samples, ${counts.annotated} annotated)`);
