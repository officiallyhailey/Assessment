import { useState } from "react";
import { getAllClients } from "../../lib/api";

// Shows the thing students find confusing: the component draws once with an
// empty array, then draws again once the data arrives. The render counter and
// the state readout make that visible.
function FetchDemo() {
    const [phase, setPhase] = useState("idle"); // idle, waiting, done
    const [clients, setClients] = useState([]);
    const [renders, setRenders] = useState(0);
    const [failed, setFailed] = useState(false);

    const mount = async () => {
        setPhase("waiting");
        setClients([]);
        setRenders(1);
        setFailed(false);

        const { data, failed: didFail } = await getAllClients();
        const ok = !didFail && Array.isArray(data);
        setFailed(!ok);
        if (ok) {
            setClients(data);
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
                        {phase === "waiting" && "render 1: clients = [ ]"}
                        {phase === "done" && `render 2: clients = [ ${clients.length} items ]`}
                    </div>

                    {phase === "waiting" && (
                        <p className="empty">
                            <span className="spinner" /> the list is empty right now, and that is correct
                        </p>
                    )}

                    {phase === "idle" && <p className="empty">press Load to start</p>}

                    {phase === "done" && (
                        <ul className="list">
                            {clients.map((c) => (
                                <li key={c.id} className="fresh">
                                    <span className="nm">{c.name}</span>
                                    <span className="where">{c.mood}</span>
                                    {c.first_visit ? <span className="tagm fly">first visit</span> : null}
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
                        Could not reach the server. Is the API running?
                    </p>
                )}
            </div>
        </div>
    );
}

export default FetchDemo;
