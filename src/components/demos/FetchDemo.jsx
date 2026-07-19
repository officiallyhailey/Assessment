import { useState } from "react";
import { getAllAnimals } from "../../lib/api";

// Shows the thing students find confusing: the component draws once with an
// empty array, then draws again once the data arrives. The render counter and
// the state readout make that visible.
function FetchDemo() {
    const [phase, setPhase] = useState("idle"); // idle, waiting, done
    const [animals, setAnimals] = useState([]);
    const [renders, setRenders] = useState(0);
    const [net, setNet] = useState(null);

    const mount = async () => {
        setPhase("waiting");
        setAnimals([]);
        setRenders(1);
        setNet(null);

        const { data, status, size, ms, failed } = await getAllAnimals();
        setNet({ status: failed ? 0 : status, ms, size: size || 0 });
        if (!failed) {
            setAnimals(data);
            setRenders(2);
        }
        setPhase("done");
    };

    return (
        <div className="demo">
            <div className="top">
                <span className="dot" />
                <strong>Watch it render twice</strong>
                <span className="hint">real GET request</span>
            </div>
            <div className="pad">
                <p className="lead">
                    Pressing Load is the same as the page first appearing. useEffect fires, the fetch goes
                    out, and the component draws a second time once the data is back.
                </p>

                <div className="row">
                    <button className="btn" onClick={mount} disabled={phase === "waiting"}>
                        {phase === "idle" ? "Load the page" : phase === "waiting" ? "Fetching" : "Load again"}
                    </button>
                    {phase !== "idle" && (
                        <span className="stat">
                            renders: <strong style={{ color: "var(--deep)" }}>{renders}</strong>
                        </span>
                    )}
                </div>

                <div className="renderbox" style={{ marginTop: "16px" }}>
                    <div className="rcount">
                        {phase === "idle" && "nothing has happened yet"}
                        {phase === "waiting" && "render 1: animals = [ ]"}
                        {phase === "done" && `render 2: animals = [ ${animals.length} items ]`}
                    </div>

                    {phase === "waiting" && (
                        <p className="empty">
                            <span className="spinner" /> the list is empty right now, and that is correct
                        </p>
                    )}

                    {phase === "idle" && <p className="empty">press Load to start</p>}

                    {phase === "done" && (
                        <ul className="list">
                            {animals.map((a) => (
                                <li key={a.id} className="fresh">
                                    <span className="nm">{a.name}</span>
                                    <span className="where">{a.lives_in}</span>
                                    {a.can_fly ? <span className="tagm fly">can fly</span> : null}
                                </li>
                            ))}
                        </ul>
                    )}
                </div>

                {/* These are what JavaScript can see, which is not the same as
                    what the Network tab reports. Labelled precisely rather than
                    generically, because a student who compares the two will
                    find they disagree and be right to wonder why. */}
                {net && (
                    <div className="wire" style={{ marginTop: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "9px", flexWrap: "wrap" }}>
                            <span className="k">GET</span>
                            <span>/get-all-animals</span>
                            <span className="pill200">{net.status || "failed"}</span>
                            <span style={{ opacity: 0.7 }}>{net.ms} ms round trip</span>
                            <span style={{ opacity: 0.7 }}>{net.size} characters of JSON</span>
                        </div>
                        <div style={{ opacity: 0.65, marginTop: "6px", fontSize: "12px" }}>
                            this request is in your own Network tab, though the numbers there are measured
                            differently and will not match
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default FetchDemo;
