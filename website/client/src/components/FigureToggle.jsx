import { useState } from "react";
import { rich } from "../lib/richText";

// Two versions of the same picture in one slot: the everyday one and the
// technical one. Toggling between them rather than stacking both keeps the
// lesson short, and makes "here is the real-world view, here is the code view"
// a deliberate move rather than two images to scroll past.
//
// Each view is { src, alt, caption }. `views` is [plain, technical].

function FigureToggle({ views, labels = ["Real world", "In code"], start = 0 }) {
    const [i, setI] = useState(start);
    const view = views[i];

    return (
        <figure className="figure figtoggle">
            <div className="figtabs" role="tablist">
                {labels.map((label, n) => (
                    <button
                        key={label}
                        role="tab"
                        aria-selected={i === n}
                        className={i === n ? "on" : ""}
                        onClick={() => setI(n)}
                    >
                        {label}
                    </button>
                ))}
            </div>
            <img src={view.src} alt={view.alt} />
            {view.caption && <figcaption>{rich(view.caption)}</figcaption>}
        </figure>
    );
}

export default FigureToggle;
