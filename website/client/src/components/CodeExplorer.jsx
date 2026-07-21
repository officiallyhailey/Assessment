import { useEffect, useMemo, useState } from "react";
import { tokenize } from "../lib/tokenize";
import { explain } from "../data/concepts";
import { ANNOTATIONS } from "../data/annotations";
import { parseLines } from "../lib/focus";
import { fallbackContext, fallbackFlow } from "../lib/lineNotes";
import { anchorTo } from "../lib/anchor";
import Popover from "./Popover";
import ResultView from "./ResultView";
import PostDemo from "./demos/PostDemo";
import SqlDemo from "./demos/SqlDemo";
import FetchDemo from "./demos/FetchDemo";
import OneDemo from "./demos/OneDemo";

// Demos that can live inside the panel as a third view, rather than sitting
// further down the page where the code they belong to is out of sight.
const DEMOS = { post: PostDemo, sql: SqlDemo, fetch: FetchDemo, one: OneDemo };

const MODES = [
    { id: "content", label: "Content", hint: "Ties the code to the part of the lesson that explains it." },
    { id: "concept", label: "Concept", hint: "Hover a word for what it means." },
    { id: "context", label: "Context", hint: "Hover a line for its job in the code." },
    { id: "flow", label: "Flow", hint: "Hover a line for when it runs." },
];

// Height of one line of code, and everything around the code area, in pixels.
// These mirror code.css: .excode code line-height, .excode pre padding, .exbar
// and the single line footer. They reserve the space the code needs up front,
// so switching views never collapses the box.
const LINE = 20.25;
const CHROME = 38 + 28 + 34;

function CodeExplorer({ sample, bare, minLines, fixed, highlight, glow, wantView, onAimLine, onGoToLine, onLinking }) {
    const [mode, setMode] = useState("content");
    const [view, setView] = useState("code"); // code | result | try

    // The lesson can ask the panel to open a particular view when a section is
    // reached: Testing in Postman opens Try it. This runs only when the request
    // changes, so a manual click still wins for the rest of that section.
    useEffect(() => {
        if (wantView) setView(wantView);
    }, [wantView]);
    const [hover, setHover] = useState(null); // { text, label, kind }
    const [pinnedNote, setPinnedNote] = useState(null);

    const lang = sample.lang || (sample.name.endsWith(".sql") ? "sql" : "js");
    const lines = useMemo(() => tokenize(sample.code, lang), [sample.code, lang]);

    const notes = ANNOTATIONS[sample.key || sample.name] || {};
    const context = sample.context || notes.context || {};
    const flow = sample.flow || notes.flow || {};

    const note = pinnedNote || hover;

    // The pinned panel already has a fixed height from its container, so it
    // opts out. Everywhere else the box holds the taller of its own code and
    // whatever height the caller asked for. With `fixed` that becomes an exact
    // height rather than a floor, so a view that fills up scrolls inside the
    // box instead of stretching it.
    const reserved = bare
        ? undefined
        : { "--exh": `${Math.max(lines.length, minLines || 0) * LINE + CHROME}px` };

    const raw = useMemo(() => sample.code.split("\n"), [sample.code]);

    // A written note where there is one, and a structural answer where there is
    // not, so every line responds to a hover rather than most of them.
    const showLine = (n) => {
        if (mode === "context") {
            const text = context[n] || fallbackContext(raw[n - 1], lang);
            if (text) return { text, label: "What this line is for", kind: "context" };
        }
        if (mode === "flow") {
            const f = flow[n];
            if (f) return { text: f.text, label: `Step ${f.step}`, kind: "flow" };
            const text = fallbackFlow(raw[n - 1], lang);
            if (text) return { text, label: "When it runs", kind: "flow" };
        }
        return null;
    };

    const lineIsActive = (n) => (mode === "context" || mode === "flow") && !!showLine(n);

    // Content mode is the one that links the code to the lesson text, in both
    // directions: reading a passage lights its lines, and pointing at a line
    // marks the passage that explains it. The other three modes are about the
    // code on its own, so they leave the page alone.
    const linking = mode === "content";
    const spot = useMemo(() => new Set(parseLines(highlight)), [highlight]);
    const showSpot = linking && spot.size > 0;

    // The page marks passages only while this mode is the one linking to it,
    // so leaving Content mode clears the highlight on both sides at once.
    useEffect(() => {
        if (onLinking) onLinking(linking);
    }, [linking, onLinking]);

    // The Try it view is only offered where the lesson data asks for it.
    //
    // A panel offers Code plus exactly one second view, never both: Try it
    // where there is something to run, Results where there is not. Running it
    // shows the real thing, so a canned result alongside would be a third
    // button saying less.
    const canTry = !!sample.try && DEMOS[sample.try];
    const Demo = canTry ? DEMOS[sample.try] : null;
    const canShowResult = !!sample.result && !canTry;

    return (
        <div
            className={`explorer${bare ? " bare" : ""}${fixed ? " fixed" : ""} mode-${mode}`}
            style={reserved}
        >
            <div className="exbar">
                {(canShowResult || canTry) && (
                    <div className="views">
                        <button
                            className={view === "code" ? "on" : ""}
                            onClick={() => setView("code")}
                        >
                            Code
                        </button>
                        {canShowResult && (
                            <button
                                className={view === "result" ? "on" : ""}
                                onClick={() => setView("result")}
                            >
                                Results
                            </button>
                        )}
                        {canTry && (
                            // The glow is the lesson text saying there is
                            // something to press here, at the moment it becomes
                            // worth pressing. It stops once the student is on it.
                            <button
                                className={`${view === "try" ? "on" : ""}${
                                    glow && view !== "try" ? " glow" : ""
                                }`}
                                onClick={() => setView("try")}
                            >
                                Try it
                            </button>
                        )}
                    </div>
                )}
                {view === "code" && (
                    <div className="modes">
                        {MODES.map((m) => (
                            <button
                                key={m.id}
                                className={mode === m.id ? "on" : ""}
                                onClick={() => {
                                    setMode(m.id);
                                    setHover(null);
                                    setPinnedNote(null);
                                }}
                                title={m.hint}
                            >
                                {m.label}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {view === "result" && <ResultView sample={sample} />}

            {view === "try" && Demo && (
                <div className="extry">
                    <Demo />
                </div>
            )}

            {view === "code" && (
            <div className="excode">
                <pre>
                    <code>
                        {lines.map((tokens, li) => {
                            const n = li + 1;
                            const active = lineIsActive(n);
                            const step = mode === "flow" && flow[n] ? flow[n].step : null;

                            return (
                                <span
                                    className={`ln${active ? " hot" : ""}${
                                        note && note.line === n ? " sel" : ""
                                    }${showSpot && spot.has(n) ? " spot" : ""}${
                                        showSpot && !spot.has(n) ? " dim" : ""
                                    }${linking && onAimLine ? " aim" : ""}`}
                                    key={n}
                                    onMouseEnter={(e) => {
                                        if (active)
                                            setHover({
                                                ...showLine(n),
                                                line: n,
                                                pos: anchorTo(e.currentTarget),
                                            });
                                        // In Content mode, pointing at a line asks
                                        // the page to mark the passage about it.
                                        if (linking && onAimLine) onAimLine(n);
                                    }}
                                    onMouseLeave={() => {
                                        if (active) setHover(null);
                                        if (linking && onAimLine) onAimLine(null);
                                    }}
                                    onClick={(e) => {
                                        if (linking && onGoToLine) {
                                            onGoToLine(n);
                                            return;
                                        }
                                        if (!active) return;
                                        const v = { ...showLine(n), line: n, pos: anchorTo(e.currentTarget) };
                                        setPinnedNote((p) => (p && p.line === n ? null : v));
                                    }}
                                >
                                    <span className="lnno" aria-hidden="true">
                                        {n}
                                    </span>
                                    {step !== null && <span className="step">{step}</span>}
                                    {tokens.map((tk, ti) => {
                                        if (mode !== "concept") {
                                            return (
                                                <span className={`k-${tk.k}`} key={ti}>
                                                    {tk.t}
                                                </span>
                                            );
                                        }
                                        const def = explain(tokens, ti, lang);
                                        if (!def) {
                                            return (
                                                <span className={`k-${tk.k}`} key={ti}>
                                                    {tk.t}
                                                </span>
                                            );
                                        }
                                        const v = {
                                            text: def.text,
                                            label: def.label,
                                            kind: def.kind,
                                        };
                                        return (
                                            <span
                                                className={`k-${tk.k} hasdef`}
                                                key={ti}
                                                onMouseEnter={(e) =>
                                                    setHover({ ...v, pos: anchorTo(e.currentTarget) })
                                                }
                                                onMouseLeave={() => setHover(null)}
                                                onClick={(e) =>
                                                    setPinnedNote((p) =>
                                                        p && p.label === v.label
                                                            ? null
                                                            : { ...v, pos: anchorTo(e.currentTarget) }
                                                    )
                                                }
                                            >
                                                {tk.t}
                                            </span>
                                        );
                                    })}
                                    {"\n"}
                                </span>
                            );
                        })}
                    </code>
                </pre>
            </div>
            )}

            {/* The explanation appears beside what is being pointed at, the same
                way the glossary words in the prose do. It used to fill a strip
                along the bottom, which meant reading down there and then looking
                back up to find the word again. */}
            {view === "code" && note && (
                <Popover pos={note.pos} kind={note.kind} label={note.label} pinned={!!pinnedNote}>
                    <span className="pop-body">{note.text}</span>
                </Popover>
            )}

            {/* One footer line for every mode, so the panel is the same height
                whichever is chosen. */}
            {view === "code" && (
                <div className="exlegend">
                    {linking ? (
                        <>
                            <span className="k-keyword">command</span>
                            <span className="k-type">data type</span>
                            <span className="k-rule">rule</span>
                            <span className="k-data">value</span>
                            <span className="k-name">name</span>
                            {onAimLine && (
                                <span className="legendhint">point at a line to find it in the lesson</span>
                            )}
                        </>
                    ) : (
                        <span className="legendhint solo">
                            {mode === "concept"
                                ? "Hover any word for a definition. Click to keep it open."
                                : mode === "context"
                                ? "Hover a line to see what it is for. Click to keep it open."
                                : "Hover a line to see when it runs. Click to keep it open."}
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}

export default CodeExplorer;
