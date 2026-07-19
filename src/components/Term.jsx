import { useEffect, useRef, useState } from "react";
import { lookupTerm } from "../data/terms";
import { anchorTo } from "../lib/anchor";
import Popover from "./Popover";

// A word in the lesson text that can be hovered for a definition. Hover opens
// it, click keeps it open, and Escape or a click elsewhere closes it. The code
// panel uses the same popover for the same reason: the explanation belongs
// beside the thing being pointed at.

function Term({ word, label }) {
    const entry = lookupTerm(word);
    const [open, setOpen] = useState(false);
    const [pinned, setPinned] = useState(false);
    const [pos, setPos] = useState(null);
    const ref = useRef(null);

    const showing = open || pinned;
    const place = () => setPos(anchorTo(ref.current));

    // Keep it attached to the word if the page moves underneath it.
    useEffect(() => {
        if (!showing) return;
        const move = () => place();
        window.addEventListener("scroll", move, true);
        window.addEventListener("resize", move);
        return () => {
            window.removeEventListener("scroll", move, true);
            window.removeEventListener("resize", move);
        };
    }, [showing]);

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
                <Popover pos={pos} kind="concept" label={word} pinned={pinned}>
                    <span className="pop-body">{entry.def}</span>
                    {entry.note && <span className="pop-note">{entry.note}</span>}
                </Popover>
            )}
        </span>
    );
}

export default Term;
