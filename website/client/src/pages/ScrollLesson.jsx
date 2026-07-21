import { useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { parseLines } from "../lib/focus";
import { resolveLines } from "../lib/sample";
import Analogy from "../components/Analogy";
import Blocks from "../components/Blocks";
import CodeExplorer from "../components/CodeExplorer";
import SegToggle from "../components/SegToggle";
import Stage from "../components/Stage";

// The scroll-tracked lesson: the reader scrolls, the rail marks the section, and
// the pinned panel keeps the code lined up with the passage being read. This is
// the right shape for a lesson written in one file of code (topics 2 and 3),
// where following the code down the page is the point. Topic 1 pages instead
// (see PagedLesson.jsx), because its SQL is three separate statements, not one
// program to read top to bottom.

function ScrollLesson({ lesson }) {
    const [active, setActive] = useState(lesson.sections[0].id);
    const [tab, setTab] = useState(0);
    // A section may present its parts as a single-row toggle instead of a stack
    // of scroll-tracked passages (topic 2's "Setting up the file"). Keyed by
    // section id → chosen part id, since several toggle sections share the page
    // and each must keep its own choice. A section with no entry shows none
    // chosen, which leaves its `cover` lit; picking one lights just that part.
    const [toggleSel, setToggleSel] = useState({});
    // Whether the reading column has shrunk left to make room for the panel.
    // Latched: once the reader reaches the code it stays, releasing only back at
    // the very top. Deriving it live from the active section instead let the
    // layout change bounce the active section, which bounced the layout.
    const [staged, setStaged] = useState(false);
    // Which passage is being read, and what it asked the code panel to show.
    const [focus, setFocus] = useState(null);
    // A passage being pointed at from the code panel. It wins over the scroll
    // position while the pointer is there, since it is a deliberate act.
    const [aimed, setAimed] = useState(null);
    // Whether the reader has clicked a panel tab to browse a particular file. It
    // overrides the file the section would otherwise show, and is released when
    // the reader moves to another section or picks a toggle.
    const [tabIsManual, setTabIsManual] = useState(false);
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
        window.scrollTo(0, 0);
        setTab(0);
        setActive(lesson.sections[0].id);
        setFocus(null);
        setStaged(false);
        setToggleSel({});
        setTabIsManual(false);

        // The first section that wants the panel: one that declares a stage, a
        // toggle, or (for a scroll-tracked lesson) the first that shows code.
        const showsCodeHere = (blocks = []) =>
            blocks.some(
                (b) => (b.type === "focus" && b.file) || b.type === "coderef" || showsCodeHere(b.blocks)
            );
        let stageStart = lesson.sections.findIndex((s) => s.stage);
        if (stageStart < 0)
            stageStart = lesson.sections.findIndex((s) => s.toggle || showsCodeHere(s.blocks));

        const onScroll = () => {
            // One section is in focus at a time: the one holding the middle of
            // the screen. It stays clear and drives the rail and the panel while
            // the others dim, so the reader is on one thing rather than seeing
            // the section before and after at once. The reading line, a little
            // above centre, is where a passage's code highlight is judged from.
            const mid = window.innerHeight / 2;
            const readingLine = window.innerHeight * 0.45;

            let current = lesson.sections[0].id;
            let currentIndex = 0;
            let bestDist = Infinity;
            lesson.sections.forEach((s, i) => {
                const el = document.getElementById(s.id);
                if (!el) return;
                const box = el.getBoundingClientRect();
                if (box.top <= mid && box.bottom >= mid) {
                    // Straddles the middle: this is the one in focus.
                    current = s.id;
                    currentIndex = i;
                    bestDist = -1;
                } else if (bestDist !== -1) {
                    // In a gap between sections: the nearest by its own middle.
                    const d = Math.abs((box.top + box.bottom) / 2 - mid);
                    if (d < bestDist) {
                        bestDist = d;
                        current = s.id;
                        currentIndex = i;
                    }
                }
            });
            setActive(current);

            // Latch the shrink-left: on once the code is reached, off only back
            // at the very top. Holding it steady through the middle keeps the
            // layout from bouncing the section that decides the layout.
            if (stageStart >= 0) {
                setStaged((prev) =>
                    currentIndex >= stageStart ? true : window.scrollY < 8 ? false : prev
                );
            }

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
    }, [lesson.slug]);

    // A section can carry its own code, which then takes over the panel.
    // That is how Going further shows what the code grows into.
    const activeSection = lesson.sections.find((s) => s.id === active);

    let pinned = (activeSection && activeSection.code) || lesson.code || [];

    // The rail marks a section from its heading, the reading line sits lower, so
    // a passage can be under discussion while the heading above it has not been
    // counted yet. Whichever code set holds the file the passage names is the one
    // to show. A manual tab click means the reader is browsing, so it steps aside.
    const named = !tabIsManual && focus && focus.file;
    if (named && !pinned.some((c) => c.name === named)) {
        const owner =
            lesson.sections.find((s) => (s.code || []).some((c) => c.name === named)) ||
            ((lesson.code || []).some((c) => c.name === named) ? { code: lesson.code } : null);
        if (owner) pinned = owner.code;
    }

    // Reaching a new section — by scrolling, or by clicking one of its toggles,
    // which sets it active — hands the panel back to that section: the manual tab
    // override and the tab index both reset.
    useEffect(() => {
        setTab(0);
        setTabIsManual(false);
    }, [active]);

    // The file the section itself would show: the file its toggle lights up, or
    // the one a scroll-tracked passage names. A manual tab click overrides it.
    const wantFile =
        (activeSection && activeSection.toggle && activeSection.toggle.file) || (focus && focus.file);
    const wantTab = wantFile ? pinned.findIndex((c) => (c.key || c.name) === wantFile) : -1;

    const activeIndex = lesson.sections.findIndex((s) => s.id === active);

    // A section may instead declare a `stage`: the panel then shows that rather
    // than the scroll-tracked code, and swaps as the reader moves down. A
    // section with no stage inherits the nearest one above it, so once the panel
    // has appeared it stays, showing whatever the last stage was.
    const findSample = (section, stage) =>
        stage && stage.kind === "code"
            ? ((section && section.code) || lesson.code || []).find(
                  (c) => (c.key || c.name) === stage.file
              ) || null
            : null;
    let stageSection = null;
    let ownCode = false;
    for (let i = activeIndex; i >= 0; i--) {
        const s = lesson.sections[i];
        if (s.stage) {
            stageSection = s;
            break;
        }
        if (s.code) {
            ownCode = true;
            break;
        }
    }
    if (!stageSection && !ownCode && staged) {
        stageSection = lesson.sections.find((s) => s.stage) || null;
    }
    const activeStage = stageSection ? stageSection.stage : null;
    const stageSample = findSample(stageSection, activeStage);

    const panelShown = staged;

    // A manual tab click wins; otherwise the file the section wants, falling back
    // to the current tab. Resolved here rather than in an effect, so the panel
    // never renders a frame showing the wrong file.
    const shown =
        (tabIsManual ? pinned[tab] : wantTab >= 0 ? pinned[wantTab] : pinned[tab]) || pinned[0];

    // A section can declare the stretch of code it is about, and the whole block
    // stays lit while that section is read rather than the highlight tracking
    // each passage. It can also ask the panel to open a view (Try it). When a
    // section says neither, the per-passage focus takes over as before.
    // A toggle section drives the highlight from the chosen part: its lines when
    // one is picked, and the section's `cover` (e.g. the whole setup block) when
    // none is. This wins over the scroll-tracked focus while such a section is read.
    // The toggle highlight only applies when the panel is actually showing that
    // toggle's file. If the reader has tabbed to another file, it shows clean, so
    // a leftover selection never lights the wrong lines in the wrong file.
    const toggleFileShown =
        activeSection &&
        activeSection.toggle &&
        shown &&
        (shown.key || shown.name) === activeSection.toggle.file;
    const activeOption =
        toggleFileShown && toggleSel[activeSection.id]
            ? activeSection.toggle.options.find((o) => o.id === toggleSel[activeSection.id])
            : null;
    const optionLines =
        activeOption && shown
            ? resolveLines({ at: activeOption.at || activeOption.id, lines: activeOption.lines }, shown)
            : "";
    const coverLines =
        optionLines ||
        (toggleFileShown && activeSection.cover && shown
            ? resolveLines({ at: activeSection.cover.at, lines: activeSection.cover.lines }, shown)
            : "");
    const coverLabel = coverLines
        ? coverLines.includes("-")
            ? `lines ${coverLines.replace("-", "–")}`
            : `line ${coverLines}`
        : "";
    // A toggle option may itself ask the panel to open a view — the last part of
    // a section is often "Try it" — which wins over the section-level view.
    const wantView =
        (activeOption && (activeOption.view || (activeOption.try && "try"))) ||
        (activeSection && activeSection.view) ||
        "code";
    const highlight =
        coverLines || (focus && shown && focus.file === (shown.key || shown.name) ? focus.lines : "");

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
        const y = window.scrollY + el.getBoundingClientRect().top - window.innerHeight * 0.38;
        window.scrollTo({ top: y, behavior: "smooth" });
    };

    return (
        <div className={`lesson focusmode${panelShown ? " staged" : ""}`}>
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

                {lesson.sections.map((s) => {
                    // A toggle section shows one chosen part at a time; the
                    // control and that part's prose live here in the text, while
                    // the panel lights its lines (see the highlight above). On a
                    // narrow screen the side panel is gone, so the same code and
                    // spotlight are shown inline under the control instead.
                    const sel = s.toggle ? toggleSel[s.id] || null : null;
                    const opt = s.toggle ? s.toggle.options.find((o) => o.id === sel) : null;
                    const tSample = s.toggle
                        ? (lesson.code || []).find((c) => (c.key || c.name) === s.toggle.file)
                        : null;
                    const tHi = tSample
                        ? resolveLines(opt ? { at: opt.at || opt.id, lines: opt.lines } : s.cover || {}, tSample)
                        : "";
                    const tView = (opt && (opt.view || (opt.try && "try"))) || s.view || "code";
                    // A leading analogy block is hoisted to a briefcase beside
                    // the heading rather than sitting in the body as a pill.
                    const analogy = s.blocks[0]?.type === "analogy" ? s.blocks[0].text : null;
                    const bodyBlocks = analogy ? s.blocks.slice(1) : s.blocks;
                    return (
                        <section
                            className={`block${s.id === active ? " clear" : ""}`}
                            id={s.id}
                            key={s.id}
                        >
                            <h2>{s.label}</h2>
                            <h3 className="h">
                                {s.heading}
                                {analogy && <Analogy text={analogy} />}
                            </h3>
                            <Blocks
                                blocks={bodyBlocks}
                                pinned={s.code || lesson.code}
                                activeFocus={linking ? aimed || (focus && focus.id) : null}
                                aimed={aimed}
                                path={s.id}
                            />
                            {s.toggle && (
                                <div className="codetoggle">
                                    <SegToggle
                                        options={s.toggle.options.map((o) => ({ id: o.id, label: o.label }))}
                                        value={sel}
                                        onChange={(id) => {
                                            const deselect = sel === id;
                                            setToggleSel((prev) => ({
                                                ...prev,
                                                [s.id]: deselect ? null : id,
                                            }));
                                            // Clicking a toggle makes its section
                                            // the one the panel follows, over any
                                            // tab the reader had browsed to, and
                                            // keeps the panel up once engaged.
                                            setActive(s.id);
                                            setTabIsManual(false);
                                            if (!deselect) setStaged(true);
                                        }}
                                    />
                                    {tSample && (
                                        <div className="only-narrow codetoggle-code">
                                            <CodeExplorer
                                                sample={tSample}
                                                bare
                                                highlight={tHi}
                                                glow={!!(opt && opt.try)}
                                                wantView={tView}
                                            />
                                        </div>
                                    )}
                                    {opt && (
                                        <div className="codetoggle-body" key={opt.id}>
                                            <Blocks
                                                blocks={opt.blocks}
                                                pinned={s.code || lesson.code}
                                                path={`${s.id}-${opt.id}`}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                            {s.stage && (
                                <div className="only-narrow stage-inline">
                                    <Stage stage={s.stage} sample={findSample(s, s.stage)} pinned={lesson.code} />
                                </div>
                            )}
                        </section>
                    );
                })}
            </main>

            <aside
                className={`pin${activeStage ? " pin-stage" : ""}`}
                aria-hidden={!panelShown}
                style={{ opacity: panelShown ? 1 : 0, pointerEvents: panelShown ? "auto" : "none" }}
            >
                {activeStage ? (
                    <div className="stagebox">
                        <Stage stage={activeStage} sample={stageSample} pinned={lesson.code} />
                    </div>
                ) : (
                    <div className="pinbox">
                        <div className="pintop">
                            {pinned.length > 1 ? (
                                <div className="pintabs">
                                    {pinned.map((c, i) => (
                                        <button
                                            key={c.name}
                                            className={c.name === (shown && shown.name) ? "on" : ""}
                                            onClick={() => {
                                                setTab(i);
                                                setTabIsManual(true);
                                            }}
                                        >
                                            {c.name}
                                        </button>
                                    ))}
                                </div>
                            ) : (
                                <span className="pinname">{pinned[0] && pinned[0].name}</span>
                            )}
                            {coverLabel && <span className="pincover">{coverLabel}</span>}
                        </div>
                        {shown && (
                            <CodeExplorer
                                sample={shown}
                                bare
                                highlight={highlight}
                                glow={!!((focus && focus.try) || (activeOption && activeOption.try))}
                                wantView={wantView}
                                onAimLine={aimAtLine}
                                onGoToLine={goToLine}
                                onLinking={reportLinking}
                            />
                        )}
                    </div>
                )}
            </aside>
        </div>
    );
}

export default ScrollLesson;
