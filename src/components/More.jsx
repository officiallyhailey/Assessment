import { useState } from "react";

// Optional depth. Collapsed by default so the main thread of the lesson stays
// short. The content is only rendered when open, which keeps the open and
// closed states unambiguous.
function More({ label, children }) {
    const [open, setOpen] = useState(false);

    return (
        <div className={open ? "more open" : "more"}>
            <button onClick={() => setOpen(!open)} aria-expanded={open}>
                <span className="mk" aria-hidden="true">
                    +
                </span>
                {label}
            </button>
            {open && (
                <div className="mbody">
                    <div className="minner">{children}</div>
                </div>
            )}
        </div>
    );
}

export default More;
