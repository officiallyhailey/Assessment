import { useEffect, useRef, useState } from "react";
import { anchorTo } from "../lib/anchor";
import Popover from "./Popover";

// A word in the prose carrying a one-off explanation, rather than a definition
// shared across the whole site. It is what a dropdown becomes: the deeper detail
// moves onto the word it is about, so it costs no vertical space until hovered.
//
// Written in the text as ((shown word|the explanation)). Term.jsx does the same
// job for glossary words looked up in terms.js; this one carries its own text.

function Aside({ label, text }) {
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

    if (!text) return <>{label}</>;

    return (
        <span className="termwrap" ref={ref}>
            <button
                type="button"
                className={`term aside${showing ? " on" : ""}`}
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
                {label}
            </button>
            {showing && (
                <Popover pos={pos} kind="concept" label={label} pinned={pinned}>
                    <span className="pop-body">{text}</span>
                </Popover>
            )}
        </span>
    );
}

export default Aside;
