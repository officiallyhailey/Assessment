import { useState } from "react";
import { getAllAnimals } from "../../lib/api";

// Shows the thing students find confusing: the component draws once with an
// empty array, then draws again once the data arrives. The render counter and
// the state readout make that visible.
function FetchDemo() {
    const [phase, setPhase] = useState("idle"); // idle, waiting, done
    const [animals, setAnimals] = useState([]);
    const [renders, setRenders] = useState(0);
    const [failed, setFailed] = useState(false);

    const mount = async () => {
        setPhase("waiting");
        setAnimals([]);
        setRenders(1);
        setFailed(false);

        const { data, failed: didFail } = await getAllAnimals();
        setFailed(didFail);
        if (!didFail) {
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

                {/* No status, timing or size readout here on purpose. Reporting
                    what JavaScript sees put numbers on screen that disagree with
                    the ones in the Network tab, which then needed explaining
                    away. The demo shows what the code produces; the Network tab
                    is the place to read what actually crossed the wire. */}
                {failed && (
                    <p className="stat" style={{ marginTop: "14px" }}>
                        Could not reach the server on port 3000.
                    </p>
                )}
            </div>
        </div>
    );
}

export default FetchDemo;
