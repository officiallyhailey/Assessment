import { useState } from "react";

function VocabRow({ line, meaning }) {
    const [open, setOpen] = useState(false);

    return (
        <div className={open ? "vrow open" : "vrow"}>
            <button onClick={() => setOpen(!open)} aria-expanded={open}>
                <span>{line}</span>
                <span className="tw2" aria-hidden="true">
                    +
                </span>
            </button>
            {open && (
                <div className="body">
                    <p>{meaning}</p>
                </div>
            )}
        </div>
    );
}

// plain = prose rows, used for the check your understanding questions
// default = code rows, set in monospace
function Vocab({ items, plain }) {
    return (
        <div className={plain ? "vocab plain" : "vocab"}>
            {items.map(([line, meaning]) => (
                <VocabRow key={line} line={line} meaning={meaning} />
            ))}
        </div>
    );
}

export default Vocab;
