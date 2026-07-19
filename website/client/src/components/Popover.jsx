import { createPortal } from "react-dom";

// The box that appears beside whatever is being pointed at. One component for
// the glossary words in the prose and the hover explanations in the code panel,
// so the two cannot drift apart.
//
// It renders into document.body. In place it was clipped by any ancestor with a
// hidden or scrolling overflow, and there are several: the dropdowns, the
// tables, the code panel itself.

function Popover({ pos, kind, label, children, pinned }) {
    if (!pos) return null;

    return createPortal(
        <span
            className={`popover ${pos.above ? "above" : "below"}${pinned ? " pinned" : ""}`}
            role="tooltip"
            style={{
                left: `${pos.left}px`,
                top: pos.top === null ? "auto" : `${pos.top}px`,
                bottom: pos.bottom === null ? "auto" : `${pos.bottom}px`,
                "--arrow": `${pos.arrow}px`,
            }}
        >
            {label && <span className={`pop-label n-${kind || "concept"}`}>{label}</span>}
            {children}
        </span>,
        document.body
    );
}

export default Popover;
