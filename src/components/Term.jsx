import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { lookupTerm } from "../data/terms";

// A word in the lesson text that can be hovered for a definition, matching the
// way words behave in the code panel. Hover opens it, click keeps it open, and
// Escape or a click elsewhere closes it.
//
// The popup renders into document.body rather than beside the word. Sitting in
// place, it was clipped by any ancestor with a hidden or scrolling overflow, and
// there are several: the dropdowns, the tables, the code panel. Fixing those one
// at a time would have left the next one to be found by a reader. Out here
// nothing can crop it, at the cost of positioning it ourselves.

const WIDTH = 300;
const GAP = 9;
const EDGE = 12;

function Term({ word, label }) {
    const entry = lookupTerm(word);
    const [open, setOpen] = useState(false);
    const [pinned, setPinned] = useState(false);
    const [pos, setPos] = useState(null);
    const ref = useRef(null);

    // Where the popup should sit, in viewport coordinates. Above the word when
    // there is room, below when there is not, and never past either edge.
    const place = () => {
        const el = ref.current;
        if (!el) return;
        const box = el.getBoundingClientRect();
        const centre = box.left + box.width / 2;
        const left = Math.max(EDGE, Math.min(centre - WIDTH / 2, window.innerWidth - WIDTH - EDGE));
        const above = box.top > 180;
        setPos({
            left,
            above,
            // Anchored by its bottom edge when above the word, by its top when
            // below. Pinning the top and pulling it up with a transform would be
            // the obvious way, but the fade-in animates transform and an
            // animation beats a static declaration, so the shift never applied
            // and the box landed on top of the word.
            top: above ? null : box.bottom + GAP,
            bottom: above ? window.innerHeight - box.top + GAP : null,
            // The arrow follows the word even when the box has been nudged.
            arrow: Math.max(14, Math.min(centre - left, WIDTH - 14)),
        });
    };

    const showing = open || pinned;

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
            {showing &&
                pos &&
                createPortal(
                    <span
                        className={`termpop ${pos.above ? "above" : "below"}${pinned ? " pinned" : ""}`}
                        role="tooltip"
                        style={{
                            left: `${pos.left}px`,
                            top: pos.top === null ? "auto" : `${pos.top}px`,
                            bottom: pos.bottom === null ? "auto" : `${pos.bottom}px`,
                            "--arrow": `${pos.arrow}px`,
                        }}
                    >
                        <span className="tw-word">{word}</span>
                        <span className="tw-def">{entry.def}</span>
                        {entry.note && <span className="tw-note">{entry.note}</span>}
                    </span>,
                    document.body
                )}
        </span>
    );
}

export default Term;
