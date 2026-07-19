// Fallback notes for lines the annotations do not name individually.
//
// Two kinds of line come up in every sample and mean the same thing every time:
// a comment, and a line that only closes something opened above. Writing those
// out per file would be a hundred near-identical entries that drift apart, so
// they are answered by rule instead. Anything that actually does work gets a
// written note in annotations.js.
//
// The point is that a student can hover any line at all and get a straight
// answer, including the boring ones. "Nothing happens here" is a real answer.

const CLOSERS = /^[)\]}>;,\s]*$/;
const JSX_CLOSE = /^<\/[A-Za-z][\w.-]*>$/;

/** What kind of line this is, structurally. */
export function lineShape(text, lang) {
    const line = (text || "").trim();
    if (!line) return "blank";
    if (lang === "sql" ? line.startsWith("--") : line.startsWith("//")) return "comment";
    if (JSX_CLOSE.test(line)) return "closeTag";
    if (CLOSERS.test(line)) return "close";
    return "code";
}

const CONTEXT = {
    comment: "A note for whoever reads this. It does nothing when the code runs.",
    close: "Closes what was opened above. No work happens on this line, it just marks the end.",
    closeTag: "Closes the tag opened above. Everything between the two is what goes inside it.",
};

const FLOW = {
    comment: "Never runs. Comments are stripped out before the code is executed.",
    close: "Nothing runs here. It marks where the block above finishes.",
    closeTag: "Nothing runs here on its own. It closes the tag opened above.",
};

export function fallbackContext(text, lang) {
    const shape = lineShape(text, lang);
    return CONTEXT[shape] || null;
}

export function fallbackFlow(text, lang) {
    const shape = lineShape(text, lang);
    return FLOW[shape] || null;
}
