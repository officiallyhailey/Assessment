import { useEffect, useRef, useState } from "react";
import { lookupTerm } from "../data/terms";

// A word in the lesson text that can be hovered for a definition, matching the
// way words behave in the code panel. Hover opens it, click keeps it open, and
// Escape or a click elsewhere closes it.
//
// The popup is positioned by the browser rather than by us: it sits in the flow
// of an inline-block wrapper, and flips to the right or left edge only when it
// would otherwise run off the side of the reading column.

function Term({ word, label }) {
    const entry = lookupTerm(word);
    const [open, setOpen] = useState(false);
    const [pinned, setPinned] = useState(false);
    const [side, setSide] = useState("");
    const ref = useRef(null);

    // Work out which way the popup should lean before it is shown, so it never
    // appears off screen and then jumps.
    const place = () => {
        const el = ref.current;
        if (!el) return;
        const box = el.getBoundingClientRect();
        const half = 150; // half the popup width in styles/content.css
        if (box.left < half + 16) setSide("left");
        else if (window.innerWidth - box.right < half + 16) setSide("right");
        else setSide("");
    };

    useEffect(() => {
        if (!pinned) return;
        const away = (e) => {
            if (ref.current && !ref.current.contains(e.target)) {
                setPinned(false);
                setOpen(false);
            }
        };
        const esc = (e) => {
            if (e.key === "Escape") {
                setPinned(false);
                setOpen(false);
            }
        };
        document.addEventListener("mousedown", away);
        document.addEventListener("keydown", esc);
        return () => {
            document.removeEventListener("mousedown", away);
            document.removeEventListener("keydown", esc);
        };
    }, [pinned]);

    // A word with no entry still reads correctly, it just is not interactive.
    if (!entry) return <>{label || word}</>;

    const showing = open || pinned;

    return (
        <span className="termwrap" ref={ref}>
            <button
                type="button"
                className={`term${showing ? " on" : ""}`}
                aria-expanded={showing}
                onMouseEnter={() => {
                    place();
                    setOpen(true);
                }}
                onMouseLeave={() => setOpen(false)}
                onFocus={() => {
                    place();
                    setOpen(true);
                }}
                onBlur={() => setOpen(false)}
                onClick={() => {
                    place();
                    setPinned((p) => !p);
                }}
            >
                {label || word}
            </button>
            {showing && (
                <span className={`termpop${side ? ` ${side}` : ""}${pinned ? " pinned" : ""}`} role="tooltip">
                    <span className="tw-word">{word}</span>
                    <span className="tw-def">{entry.def}</span>
                    {entry.note && <span className="tw-note">{entry.note}</span>}
                </span>
            )}
        </span>
    );
}

export default Term;
