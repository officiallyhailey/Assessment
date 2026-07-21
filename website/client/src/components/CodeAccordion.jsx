import { useState } from "react";
import { tokenize } from "../lib/tokenize";
import { resolveLines } from "../lib/sample";
import Blocks from "./Blocks";
import SqlDemo from "./demos/SqlDemo";
import PostDemo from "./demos/PostDemo";
import FetchDemo from "./demos/FetchDemo";
import OneDemo from "./demos/OneDemo";

// The code shown as an accordion rather than one long scroll. Each item is a
// stretch of the file (Creating the table, Inserting rows, Reading the data),
// opened one at a time, and holds that stretch of code with the explanation
// right beside it. Keeping only one open keeps the lesson plan and the code it
// is about on screen together, instead of scrolling between them.
//
// The stage names its file and its items; an item points at a region of the
// sample with `at`, and the line numbers are worked out from that (see
// lib/sample.js), so nothing here is a hand-typed line number.

const DEMOS = { sql: SqlDemo, post: PostDemo, fetch: FetchDemo, one: OneDemo };

function spanLabel(spec) {
    if (!spec) return "";
    const [a, b] = spec.split("-");
    return b && b !== a ? `lines ${a}–${b}` : `line ${a}`;
}

function Chunk({ code, lang }) {
    return (
        <pre className="acccode">
            <code>
                {tokenize(code, lang).map((tokens, li) => (
                    <span className="ln" key={li}>
                        {tokens.map((tk, ti) => (
                            <span className={`k-${tk.k}`} key={ti}>
                                {tk.t}
                            </span>
                        ))}
                        {"\n"}
                    </span>
                ))}
            </code>
        </pre>
    );
}

function CodeAccordion({ stage, sample, pinned }) {
    const items = stage.items || [];
    const [open, setOpen] = useState(items[0] ? items[0].id : null);

    if (!sample) return null;
    const lang = sample.lang || (sample.name.endsWith(".sql") ? "sql" : "js");
    const raw = sample.code.split("\n");

    const chunkFor = (item) => {
        const spec = resolveLines({ at: item.at || item.id, lines: item.lines }, sample);
        if (!spec) return { code: "", spec: "" };
        const [a, b] = spec.split("-").map(Number);
        return { code: raw.slice(a - 1, b || a).join("\n"), spec };
    };

    return (
        <div className="acc">
            <div className="acc-file">{sample.name}</div>
            {items.map((item) => {
                const isOpen = open === item.id;
                const Demo = item.try ? DEMOS[item.try] : null;
                const { code, spec } = item.try ? { code: "", spec: "" } : chunkFor(item);
                return (
                    <div className={`accitem${isOpen ? " open" : ""}`} key={item.id}>
                        <button
                            className="acchead"
                            onClick={() => setOpen(isOpen ? null : item.id)}
                            aria-expanded={isOpen}
                        >
                            <span className="acctitle">{item.label}</span>
                            {spec && <span className="acclines">{spanLabel(spec)}</span>}
                            <span className="accchev" aria-hidden="true">
                                ›
                            </span>
                        </button>
                        {isOpen && (
                            <div className="accbody">
                                {Demo ? (
                                    <div className="acctry">
                                        <Demo />
                                    </div>
                                ) : (
                                    <>
                                        <Chunk code={code} lang={lang} />
                                        {item.blocks && (
                                            <div className="accnote">
                                                <Blocks
                                                    blocks={item.blocks}
                                                    pinned={pinned}
                                                    path={`acc-${item.id}`}
                                                />
                                            </div>
                                        )}
                                    </>
                                )}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}

export default CodeAccordion;
