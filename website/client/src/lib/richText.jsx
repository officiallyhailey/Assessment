import Term from "../components/Term";

// Lesson text is plain strings, with one piece of markup: [[word]] marks a word
// the student can hover for a definition, and [[word|shown text]] looks up the
// first while displaying the second, so the sentence can still read naturally.
//
// Anything not inside brackets is returned untouched, which means a block of
// text with no markup costs nothing.

const PATTERN = /\[\[([^\]]+)\]\]/g;

export function rich(text) {
    if (typeof text !== "string" || !text.includes("[[")) return text;

    const out = [];
    let last = 0;
    let match;

    PATTERN.lastIndex = 0;
    while ((match = PATTERN.exec(text)) !== null) {
        if (match.index > last) out.push(text.slice(last, match.index));
        const [word, label] = match[1].split("|");
        out.push(<Term key={match.index} word={word} label={label} />);
        last = match.index + match[0].length;
    }

    if (last < text.length) out.push(text.slice(last));
    return out;
}
