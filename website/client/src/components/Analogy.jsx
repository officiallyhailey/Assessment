import { useEffect, useRef, useState } from "react";
import { anchorTo } from "../lib/anchor";
import { rich } from "../lib/richText";
import Popover from "./Popover";

// The real-world tie-in for a section, shown as a small briefcase beside the
// heading. Hovering it opens the office analogy in a popover, the same way a
// glossary word or an aside does, so it costs no vertical space and never gets
// in the way of the read. Click to pin it open.
function Analogy({ text }) {
    const [open, setOpen] = useState(false);
    const [pinned, setPinned] = useState(false);
    const [pos, setPos] = useState(null);
    const ref = useRef(null);

    const showing = open || pinned;
    const place = () => setPos(anchorTo(ref.current));

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

    if (!text) return null;

    return (
        <span className="officenote" ref={ref}>
            <button
                type="button"
                className={`officebtn${showing ? " on" : ""}`}
                aria-label="In the office"
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
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <rect x="2.5" y="7" width="19" height="13" rx="2" />
                    <path d="M16 20V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v15" />
                    <path d="M2.5 12.5h19" />
                </svg>
            </button>
            {showing && (
                <Popover pos={pos} kind="office" label="In the office" pinned={pinned}>
                    <span className="pop-body">{rich(text)}</span>
                </Popover>
            )}
        </span>
    );
}

export default Analogy;
