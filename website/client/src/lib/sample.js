// Lets a code sample be written in named pieces instead of one string.
//
// A focus block used to say `lines: "6-9"`, which meant every edit to a sample
// silently moved every number pointing into it — across the focus blocks, the
// titles that spell those numbers out, and the annotations. Adding one import
// was enough to break a page in a way that still rendered.
//
// Written in parts, a focus says `at: "handler"` and the numbers are worked out
// here. The rest of the app never sees the difference: `code` is still a plain
// string, so CodeExplorer, tokenize and Together need no changes.
//
//   {
//     name: "server.js",
//     parts: [
//       { id: "imports", code: `import express from "express";` },
//       { id: "setup",   code: `const app = express();` },
//     ],
//   }
//
// Parts are joined with a blank line between them, which is how these samples
// are laid out anyway. A part that belongs tight against the one above it, like
// the closing brace of a handler, says `gap: 0`.

function describe(spec) {
  const [from, to] = spec.split("-").map(Number);
  return to && to !== from ? `Lines ${from} to ${to}` : `Line ${from}`;
}

/** Expands `parts` into `code` plus a `regions` map of id to line spec. */
export function prepare(sample) {
  if (!sample.parts) return sample;

  const regions = {};
  const out = [];
  let line = 1;

  sample.parts.forEach((part, i) => {
    const gap = i === 0 ? 0 : part.gap ?? 1;
    for (let g = 0; g < gap; g++) out.push("");
    line += gap;

    const height = part.code.split("\n").length;
    regions[part.id] = height === 1 ? `${line}` : `${line}-${line + height - 1}`;
    out.push(part.code);
    line += height;
  });

  return { ...sample, code: out.join("\n"), regions };
}

/**
 * The lines a focus block points at, whether it says `at` or `lines`.
 *
 * `at` may name one region, or a list of them, which covers everything from the
 * start of the first to the end of the last. That is how a passage about a
 * whole handler points at it without naming a number.
 */
export function resolveLines(block, sample) {
  if (block.lines) return block.lines;
  if (!block.at || !sample || !sample.regions) return "";

  const names = Array.isArray(block.at) ? block.at : [block.at];
  const specs = names.map((name) => sample.regions[name]).filter(Boolean);
  if (specs.length !== names.length) return "";

  const bounds = specs.flatMap((spec) => spec.split("-").map(Number));
  const from = Math.min(...bounds);
  const to = Math.max(...bounds);
  return from === to ? `${from}` : `${from}-${to}`;
}

/** "Lines 4 to 7", worked out rather than typed, so it cannot disagree. */
export function resolveTitle(block, sample) {
  if (block.title) return block.title;
  const spec = resolveLines(block, sample);
  return spec ? describe(spec) : "";
}
