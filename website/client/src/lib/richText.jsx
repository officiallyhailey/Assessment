import Term from "../components/Term";
import Aside from "../components/Aside";

// Lesson text is plain strings with two pieces of markup:
//
//   [[word]]            a glossary word, hovered for the definition in terms.js
//   [[word|shown text]] looks up the first, shows the second
//   ((shown|detail))    a one-off aside: the shown text carries its own detail,
//                       hovered like a glossary word but defined right here.
//
// The aside is what a dropdown becomes. Deeper detail that used to sit in an
// expandable block moves onto the word it is about, so it costs no vertical
// space in the layout until someone hovers it.
//
// Anything outside the brackets is returned untouched, so text with no markup
// costs nothing.

const PATTERN = /\[\[([^\]]+)\]\]|\(\(([^)]+)\)\)/g;

export function rich(text) {
    if (typeof text !== "string" || (!text.includes("[[") && !text.includes("(("))) return text;

    const out = [];
    let last = 0;
    let match;

    PATTERN.lastIndex = 0;
    while ((match = PATTERN.exec(text)) !== null) {
        if (match.index > last) out.push(text.slice(last, match.index));

        if (match[1] !== undefined) {
            // [[word|shown]] — a glossary term.
            const [word, label] = match[1].split("|");
            out.push(<Term key={match.index} word={word} label={label} />);
        } else {
            // ((shown|detail)) — a one-off aside carrying its own text.
            const cut = match[2].indexOf("|");
            const label = cut === -1 ? match[2] : match[2].slice(0, cut);
            const detail = cut === -1 ? "" : match[2].slice(cut + 1);
            out.push(<Aside key={match.index} label={label} text={detail} />);
        }

        last = match.index + match[0].length;
    }

    if (last < text.length) out.push(text.slice(last));
    return out;
}
