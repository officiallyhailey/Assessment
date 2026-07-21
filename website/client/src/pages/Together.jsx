import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import CodeExplorer from "../components/CodeExplorer";
import { findLesson } from "../data/lessons";
import { onReset } from "../lib/resetEvent";

// The three topics as one path.
//
// The code shown here is the lesson's own code, imported rather than copied.
// An earlier version kept its own trimmed copies, which drifted: the endpoint
// was abbreviated and the helper it called was not shown at all, so this page
// disagreed with the lesson it was summarising. Reading from the lesson data
// means that cannot happen again.

const STEPS = [
    {
        n: "1",
        topic: "SQL",
        slug: "sql-tables",
        title: "Create the table and put data in it",
        blurb: "Nothing exists yet. This designs the check-in form, what each box may hold, and files the first three in.",
        takeaway: "The table now holds three clients, each with an id the database assigned.",
    },
    {
        n: "2",
        topic: "Express",
        slug: "post-endpoint",
        title: "Add more data through an endpoint",
        blurb: "The table can only be reached from a database console so far. This opens a door so anything outside can add a row.",
        takeaway: "A request from outside the system has now written a row into that same table.",
    },
    {
        n: "3",
        topic: "React",
        slug: "react-get",
        title: "Show the data to a person",
        blurb: "The data exists and can be added to, but nobody can see it. This asks the endpoint for everything and paints it on screen.",
        takeaway: "What started as an empty table is now a list a person can read.",
    },
];

const steps = STEPS.map((s) => ({ ...s, files: findLesson(s.slug).code, to: `/lesson/${s.slug}` }));

function Step({ step, minLines }) {
    const [tab, setTab] = useState(0);
    const file = step.files[tab] || step.files[0];

    return (
        <div className="stepmain">
            {/* Number and topic share a line. They were stacked, which cost a
                whole row of height in each of the three columns. */}
            <div className="stephead">
                <div className="stepnum">{step.n}</div>
                <div className="steptag">{step.topic}</div>
            </div>
            <h2>{step.title}</h2>
            <p className="t">{step.blurb}</p>

            {/* Always rendered, even for a single file, so every column starts
                its code box at the same height and the three stay level. */}
            <div className="steptabs">
                {step.files.length > 1 ? (
                    step.files.map((c, i) => (
                        <button
                            key={c.name}
                            className={i === tab ? "on" : ""}
                            onClick={() => setTab(i)}
                        >
                            {c.name}
                        </button>
                    ))
                ) : (
                    <span className="onefile">{file.name}</span>
                )}
            </div>

            <CodeExplorer sample={file} minLines={minLines} fixed />

            <div className="takeaway">
                <span className="tk">Result</span>
                {step.takeaway}
            </div>

            <Link className="stepgo" to={step.to}>
                Open the full lesson
                <span aria-hidden="true">&rarr;</span>
            </Link>
        </div>
    );
}

function Together() {
    // On a wide screen the three steps sit side by side, so every code box is
    // given the height of the longest sample on the page. Without this the
    // columns end at three different heights.
    const tallest = Math.max(
        ...steps.flatMap((s) => s.files.map((c) => c.code.split("\n").length))
    );

    // The reset lives in the header. Bumping `round` when it fires remounts the
    // steps, which drops the rows they had already fetched and sends them to
    // read the table again rather than leaving stale results on screen.
    const [round, setRound] = useState(0);
    useEffect(() => onReset(() => setRound((r) => r + 1)), []);

    return (
        <div className="together">
            <div className="thead">
                <Link to="/" className="back">
                    <span aria-hidden="true">&larr;</span> All lessons
                </Link>
            
            </div>

            <div className="steps" key={round}>
                {steps.map((s) => (
                    <section className="step-row" key={s.n}>
                        <Step step={s} minLines={tallest} />
                    </section>
                ))}
            </div>

            <div className="closing">
                <p>
                    Each step only works because of the one before it. The endpoint has somewhere to write
                    because the table defines the columns. The page has something to show because the
                    endpoint can hand the rows over.
                </p>
            </div>
        </div>
    );
}

export default Together;
