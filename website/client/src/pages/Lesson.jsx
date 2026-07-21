import { useCallback, useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { findLesson } from "../data/lessons";
import { parseLines } from "../lib/focus";
import Blocks from "../components/Blocks";
import CodeExplorer from "../components/CodeExplorer";

function Lesson() {
    const { slug } = useParams();
    const lesson = findLesson(slug);
    const [active, setActive] = useState(lesson ? lesson.sections[0].id : null);
    const [tab, setTab] = useState(0);
    // Which passage is being read, and what it asked the code panel to show.
    const [focus, setFocus] = useState(null);
    // A passage being pointed at from the code panel. It wins over the scroll
    // position while the pointer is there, since it is a deliberate act.
    const [aimed, setAimed] = useState(null);
    // Whether the panel is in the mode that links to the text. useCallback so
    // the panel's effect does not fire on every render of this page.
    const [linking, setLinking] = useState(true);
    const reportLinking = useCallback((on) => {
        setLinking(on);
        if (!on) setAimed(null);
    }, []);

    // Opening a lesson resets to the top, then tracks which section is being
    // read. That drives the rail highlight and decides which code the pinned
    // panel shows. Both live in one effect so the reset always lands before
    // the first measurement.
    useEffect(() => {
        if (!lesson) return;

        window.scrollTo(0, 0);
        setTab(0);
        setActive(lesson.sections[0].id);
        setFocus(null);

        const onScroll = () => {
            // Two different lines on purpose. The rail marks a section as soon
            // as its heading reaches the top, which is how a table of contents
            // should behave. The passage being read is judged from the middle
            // of the screen instead, because that is where the eye actually is.
            const line = 150; // just below the sticky header
            const readingLine = window.innerHeight * 0.45;

            let current = lesson.sections[0].id;
            for (const s of lesson.sections) {
                const el = document.getElementById(s.id);
                if (el && el.getBoundingClientRect().top <= line) current = s.id;
            }
            setActive(current);

            // The passage being read is the one nearest the reading line, not
            // only one straddling it. Short passages would otherwise need the
            // page scrolled to exactly the right place to register, and the
            // gaps between them would flicker the panel back to plain code.
            // Beyond a screenful away nothing is claimed, so scrolling well
            // clear of the passages does release the highlight.
            const reach = window.innerHeight * 0.75;
            let found = null;
            let best = Infinity;
            for (const el of document.querySelectorAll(".focus")) {
                const box = el.getBoundingClientRect();
                const gap =
                    box.top > readingLine
                        ? box.top - readingLine
                        : box.bottom < readingLine
                        ? readingLine - box.bottom
                        : 0;
                if (gap < best && gap <= reach) {
                    best = gap;
                    found = {
                        id: el.id,
                        file: el.dataset.file || "",
                        lines: el.dataset.lines || "",
                        try: el.dataset.try === "1",
                    };
                }
            }
            setFocus((prev) => (prev && found && prev.id === found.id ? prev : found));
        };

        // No measurement on mount. The lesson always opens at its first
        // section, and real scrolling takes over from there. Measuring here
        // would race the scroll reset above and could open the lesson showing
        // the wrong section's code.
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [slug]);

    // A section can carry its own code, which then takes over the panel.
    // That is how Going further shows what the code grows into.
    const activeSection = lesson ? lesson.sections.find((s) => s.id === active) : null;
    let pinned = (activeSection && activeSection.code) || (lesson && lesson.code) || [];

    // The rail marks a section from its heading, the reading line sits lower,
    // so a passage can be under discussion while the heading above it has not
    // been counted yet. When that happens the passage wins: whichever code set
    // actually holds the file it names is the one to show, or the panel would
    // sit on the previous section's sample while the text talks about another.
    const named = focus && focus.file;
    if (named && lesson && !pinned.some((c) => c.name === named)) {
        const owner =
            lesson.sections.find((s) => (s.code || []).some((c) => c.name === named)) ||
            ((lesson.code || []).some((c) => c.name === named) ? { code: lesson.code } : null);
        if (owner) pinned = owner.code;
    }

    // Different code set, so the previous tab index may not exist any more.
    useEffect(() => {
        setTab(0);
    }, [activeSection && activeSection.code ? activeSection.id : "default"]);

    // A passage that names a file brings that file to the front, so the lines
    // it is talking about are the ones on screen.
    const wantFile = focus && focus.file;
    const wantTab = wantFile ? pinned.findIndex((c) => c.name === wantFile) : -1;
    useEffect(() => {
        if (wantTab >= 0) setTab(wantTab);
    }, [wantTab, activeSection && activeSection.id]);

    if (!lesson) return null;

    // Resolved here rather than waiting for the tab effect to run, so the panel
    // never renders a frame showing the wrong file.
    const shown = (wantTab >= 0 ? pinned[wantTab] : pinned[tab]) || pinned[0];
    const highlight = focus && shown && focus.file === (shown.key || shown.name) ? focus.lines : "";

    // The other direction. Pointing at a line in the panel finds the passage
    // that explains it, so the code can be used as a way into the text rather
    // than only the other way round.
    const focusForLine = (n) => {
        if (!shown || n === null) return null;
        for (const el of document.querySelectorAll(".focus")) {
            if ((el.dataset.file || "") !== (shown.key || shown.name)) continue;
            if (parseLines(el.dataset.lines).includes(n)) return el;
        }
        return null;
    };

    const aimAtLine = (n) => {
        const el = focusForLine(n);
        setAimed(el ? el.id : null);
    };

    const goToLine = (n) => {
        const el = focusForLine(n);
        if (!el) return;
        // Land the passage where the reading line is, so it stays the active
        // one once the scroll settles rather than being immediately replaced.
        const y = window.scrollY + el.getBoundingClientRect().top - window.innerHeight * 0.38;
        window.scrollTo({ top: y, behavior: "smooth" });
    };

    return (
        <div className="lesson">
            <aside className="rail">
                <ol>
                    {lesson.sections.map((s) => (
                        <li key={s.id}>
                            <a href={`#${s.id}`} className={active === s.id ? "on" : ""}>
                                {s.label}
                            </a>
                        </li>
                    ))}
                </ol>
            </aside>

            <main>
                <div className="lesson-head">
                    <Link to="/" className="back">
                        <span aria-hidden="true">&larr;</span> All lessons
                    </Link>
                    <div className="num">{lesson.num}</div>
                    <h1>{lesson.title}</h1>
                    {lesson.lede && <p className="lede">{lesson.lede}</p>}
                </div>

                {lesson.sections.map((s) => (
                    <section className="block" id={s.id} key={s.id}>
                        <h2>{s.label}</h2>
                        <h3 className="h">{s.heading}</h3>
                        <Blocks
                            blocks={s.blocks}
                            pinned={s.code || lesson.code}
                            activeFocus={linking ? aimed || (focus && focus.id) : null}
                            aimed={aimed}
                            path={s.id}
                        />
                    </section>
                ))}
            </main>

            {/* Stays on screen on wide displays so the code can be pointed at
                while the explanation beside it is being read. */}
            <aside className="pin">
                <div className="pinbox">
                    <div className="pintop">
                        {pinned.length > 1 ? (
                            <div className="pintabs">
                                {pinned.map((c, i) => (
                                    <button
                                        key={c.name}
                                        className={c.name === (shown && shown.name) ? "on" : ""}
                                        onClick={() => setTab(i)}
                                    >
                                        {c.name}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <span className="pinname">{pinned[0] && pinned[0].name}</span>
                        )}
                    </div>
                    {shown && (
                        <CodeExplorer
                            sample={shown}
                            bare
                            highlight={highlight}
                            glow={!!(focus && focus.try)}
                            onAimLine={aimAtLine}
                            onGoToLine={goToLine}
                            onLinking={reportLinking}
                        />
                    )}
                </div>
            </aside>
        </div>
    );
}

export default Lesson;
