import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { resolveLines } from "../lib/sample";
import Analogy from "../components/Analogy";
import Blocks from "../components/Blocks";
import CodeExplorer from "../components/CodeExplorer";
import Preview from "../components/Preview";
import SegToggle from "../components/SegToggle";

// The paged lesson: one section on screen at a time, chosen from the rail. Used
// for topic 1, whose SQL is three separate statements rather than one program to
// read down a file, so there is nothing to line up against a scroll. Each
// section is its own screen; the panel beside it shows whatever that section is
// about.
//
// A section drives the panel one of three ways:
//   panel: { kind: "preview" }  the Table/Form switch for Defining columns
//   toggle: { file, options }   a full code sample, with a control in the text
//                               that picks which lines light up
//   code: [...]                 its own sample(s), shown plainly (Going further)

function PagedLesson({ lesson }) {
    const [active, setActive] = useState(lesson.sections[0].id);
    // Which part of the code sample the reader has chosen, for a section that
    // has a toggle. It decides both the explanation shown and the lines lit.
    const [codeSel, setCodeSel] = useState(null);
    const [ownTab, setOwnTab] = useState(0);

    const sections = lesson.sections;
    const index = sections.findIndex((s) => s.id === active);
    const section = sections[index] || sections[0];

    // A fresh section starts at the top, its code toggle on the first part.
    useEffect(() => {
        window.scrollTo(0, 0);
        setOwnTab(0);
        setCodeSel(section.toggle ? section.toggle.options[0].id : null);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [active]);

    useEffect(() => {
        setActive(lesson.sections[0].id);
    }, [lesson.slug]);

    // Work out the panel for this section.
    const sampleNamed = (name) => (lesson.code || []).find((c) => (c.key || c.name) === name) || null;

    let panelNode = null;
    let toggleNode = null;
    // The chosen toggle part's office tie, hoisted to the heading like the scroll
    // lessons rather than sitting as a lone briefcase in the body.
    let toggleAnalogy = null;

    if (section.panel && section.panel.kind === "preview") {
        panelNode = (
            <div className="stagebox">
                <Preview start={section.panel.start || "table"} />
            </div>
        );
    } else if (section.toggle) {
        const sample = sampleNamed(section.toggle.file);
        const options = section.toggle.options;
        const chosen = options.find((o) => o.id === codeSel) || options[0];
        const highlight = sample ? resolveLines({ at: chosen.at || chosen.id, lines: chosen.lines }, sample) : "";
        panelNode = sample && (
            <div className="pinbox">
                <div className="pintop">
                    <span className="pinname">{sample.name}</span>
                </div>
                <CodeExplorer sample={sample} bare highlight={highlight} />
            </div>
        );
        toggleAnalogy = chosen.blocks[0]?.type === "analogy" ? chosen.blocks[0].text : null;
        const bodyBlocks = toggleAnalogy ? chosen.blocks.slice(1) : chosen.blocks;
        // The control and the chosen part's explanation both live in the text.
        toggleNode = (
            <div className="codetoggle">
                <SegToggle
                    options={options.map((o) => ({ id: o.id, label: o.label }))}
                    value={chosen.id}
                    onChange={setCodeSel}
                />
                <div className="codetoggle-body" key={chosen.id}>
                    <Blocks blocks={bodyBlocks} pinned={sample ? [sample] : lesson.code} path={`${active}-${chosen.id}`} />
                </div>
            </div>
        );
    } else if (section.code) {
        const samples = section.code;
        const one = samples[ownTab] || samples[0];
        panelNode = one && (
            <div className="pinbox">
                <div className="pintop">
                    {samples.length > 1 ? (
                        <div className="pintabs">
                            {samples.map((c, i) => (
                                <button
                                    key={c.name}
                                    className={i === ownTab ? "on" : ""}
                                    onClick={() => setOwnTab(i)}
                                >
                                    {c.name}
                                </button>
                            ))}
                        </div>
                    ) : (
                        <span className="pinname">{one.name}</span>
                    )}
                </div>
                <CodeExplorer sample={one} bare />
            </div>
        );
    }

    const hasPanel = !!panelNode;
    const go = (i) => setActive(sections[Math.max(0, Math.min(sections.length - 1, i))].id);

    // The briefcase by the heading: a section-level tie, or the chosen toggle
    // part's tie when the parts each carry their own (topic 1's "The code").
    const sectionAnalogy = section.blocks[0]?.type === "analogy" ? section.blocks[0].text : null;
    const headerAnalogy = sectionAnalogy || toggleAnalogy;

    return (
        <div className={`lesson paged${hasPanel ? " staged" : ""}`}>
            <aside className="rail">
                <ol>
                    {sections.map((s) => (
                        <li key={s.id}>
                            <button className={active === s.id ? "on" : ""} onClick={() => setActive(s.id)}>
                                {s.label}
                            </button>
                        </li>
                    ))}
                </ol>
            </aside>

            <main>
                <div className="paged-topbar">
                    <Link to="/" className="back">
                        <span aria-hidden="true">&larr;</span> All lessons
                    </Link>
                    <span className="paged-loc">
                        {lesson.num} <span aria-hidden="true">·</span> {lesson.title}
                    </span>
                </div>

                <section className="block paged-section" key={active}>
                    <h2>{section.label}</h2>
                    <h3 className="h">
                        {section.heading}
                        {headerAnalogy && <Analogy key={headerAnalogy} text={headerAnalogy} />}
                    </h3>
                    <Blocks
                        blocks={section.blocks[0]?.type === "analogy" ? section.blocks.slice(1) : section.blocks}
                        pinned={lesson.code}
                        path={active}
                    />
                    {toggleNode}
                    {hasPanel && <div className="only-narrow paged-inline">{panelNode}</div>}
                </section>

                <div className="pager-nav">
                    <button className="pgn" disabled={index === 0} onClick={() => go(index - 1)}>
                        <span aria-hidden="true">&larr;</span>
                        <span className="pgn-lab">
                            {index > 0 ? sections[index - 1].label : ""}
                        </span>
                    </button>
                    <button
                        className="pgn next"
                        disabled={index === sections.length - 1}
                        onClick={() => go(index + 1)}
                    >
                        <span className="pgn-lab">
                            {index < sections.length - 1 ? sections[index + 1].label : ""}
                        </span>
                        <span aria-hidden="true">&rarr;</span>
                    </button>
                </div>
            </main>

            <aside
                className="pin paged-pin"
                aria-hidden={!hasPanel}
                style={{ opacity: hasPanel ? 1 : 0, pointerEvents: hasPanel ? "auto" : "none" }}
            >
                {panelNode}
            </aside>
        </div>
    );
}

export default PagedLesson;
