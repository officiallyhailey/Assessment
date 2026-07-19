// A focus ties a stretch of lesson text to the lines of code it is explaining.
//
// The lesson data says which lines a passage covers. Lesson.jsx watches which
// passage is being read and lights up those lines in the panel, so the code
// follows the reading rather than waiting to be found.
//
// Line lists are written as "6-9" or "1,2,4" and stored on the element as a
// data attribute, which keeps Blocks.jsx free of any state.

export function parseLines(spec) {
    if (!spec) return [];
    return String(spec)
        .split(",")
        .flatMap((part) => {
            const [from, to] = part.split("-").map((n) => parseInt(n, 10));
            if (Number.isNaN(from)) return [];
            // A plain number leaves `to` undefined, and Number.isNaN(undefined)
            // is false, so this has to test for undefined in its own right.
            if (to === undefined || Number.isNaN(to)) return [from];
            return Array.from({ length: to - from + 1 }, (_, i) => from + i);
        });
}

export function linesAttr(lines) {
    return Array.isArray(lines) ? lines.join(",") : lines;
}
