import CodeBlock from "./CodeBlock";
import CodeExplorer from "./CodeExplorer";
import Vocab from "./Vocab";
import More from "./More";
import SqlDemo from "./demos/SqlDemo";
import PostDemo from "./demos/PostDemo";
import FetchDemo from "./demos/FetchDemo";
import OneDemo from "./demos/OneDemo";
import { rich } from "../lib/richText";
import { linesAttr } from "../lib/focus";
import { resolveLines, resolveTitle } from "../lib/sample";

const DEMOS = { sql: SqlDemo, post: PostDemo, fetch: FetchDemo, one: OneDemo };

// `path` makes every focus block a stable id, so Lesson.jsx can name which one
// is being read even when focus blocks are nested inside a dropdown.
function Blocks({ blocks, pinned, activeFocus, aimed, path = "b" }) {
    return blocks.map((b, i) => {
        switch (b.type) {
            case "p":
                return (
                    <p className="t" key={i}>
                        {rich(b.text)}
                    </p>
                );

            case "h":
                return (
                    <h3 className="sub" key={i}>
                        {b.text}
                    </h3>
                );

            case "list":
                return (
                    <ul className="t" key={i}>
                        {b.items.map((it, j) => (
                            <li key={j}>{rich(it)}</li>
                        ))}
                    </ul>
                );

            case "olist":
                return (
                    <ol className={b.steps ? "t steps" : "t"} key={i}>
                        {b.items.map((it, j) => (
                            <li key={j}>{rich(it)}</li>
                        ))}
                    </ol>
                );

            case "code":
                return <CodeBlock key={i} name={b.name} code={b.code} />;

            // The lesson's main sample also lives in the pinned panel on wide
            // screens, so this copy hides itself there to avoid showing it twice.
            //
            // Fixed height, and every file in the set gets the height of the
            // longest, so these boxes match each other and hold their size when
            // a demo fills up, exactly as the pinned panel does.
            case "coderef": {
                const tallest = Math.max(...pinned.map((c) => c.code.split("\n").length));
                return (
                    <div className="only-narrow" key={i}>
                        {pinned.map((c) => (
                            <div key={c.name}>
                                <div className="inlinename">{c.name}</div>
                                <CodeExplorer sample={c} minLines={tallest} fixed />
                            </div>
                        ))}
                    </div>
                );
            }

            case "figure":
                return (
                    <figure className="figure" key={i}>
                        <img src={b.src} alt={b.alt} />
                        {b.caption && <figcaption>{rich(b.caption)}</figcaption>}
                    </figure>
                );

            case "note":
                return (
                    <div className={b.warn ? "note warn" : "note"} key={i}>
                        <div className="lab">{b.label}</div>
                        <p>{rich(b.text)}</p>
                    </div>
                );

            case "table":
                return (
                    <div className="tw" key={i}>
                        <table className="d">
                            <thead>
                                <tr>
                                    {b.head.map((h, j) => (
                                        <th key={j} className={b.mono && b.mono.includes(j) ? "m" : ""}>
                                            {h}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {b.rows.map((r, j) => (
                                    <tr key={j}>
                                        {r.map((c, k) => (
                                            <td key={k} className={b.mono && b.mono.includes(k) ? "m" : ""}>
                                                {b.mono && b.mono.includes(k) ? c : rich(c)}
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case "vocab":
                return <Vocab key={i} items={b.items} />;

            case "qa":
                return <Vocab key={i} items={b.items} plain />;

            case "more":
                return (
                    <More key={i} label={b.label}>
                        <Blocks
                            blocks={b.blocks}
                            pinned={pinned}
                            activeFocus={activeFocus}
                            aimed={aimed}
                            path={`${path}-${i}`}
                        />
                    </More>
                );

            // A passage tied to particular lines of code. Lesson.jsx reads the
            // data attributes to know what to light up in the panel while this
            // passage is the one being read.
            case "focus": {
                const id = `${path}-${i}`;
                // A focus may name its lines directly, or name a region of the
                // sample and let lib/sample.js work the numbers out.
                const sample = pinned.find((c) => (c.key || c.name) === b.file);
                const lines = resolveLines(b, sample);
                const title = resolveTitle(b, sample);
                return (
                    <div
                        key={i}
                        id={id}
                        className={`focus${activeFocus === id ? " on" : ""}${
                            aimed === id ? " aimed" : ""
                        }`}
                        data-file={b.file || ""}
                        data-lines={linesAttr(lines) || ""}
                        data-try={b.try ? "1" : ""}
                    >
                        {title && <div className="focustag">{title}</div>}
                        <Blocks
                            blocks={b.blocks}
                            pinned={pinned}
                            activeFocus={activeFocus}
                            aimed={aimed}
                            path={id}
                        />
                    </div>
                );
            }

            case "demo": {
                const D = DEMOS[b.kind];
                return D ? <D key={i} /> : null;
            }

            default:
                return null;
        }
    });
}

export default Blocks;
