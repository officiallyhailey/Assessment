import { useEffect, useState } from "react";
import { getAllClientForm, addClient } from "../../lib/api";

// Sends a real POST to the server running alongside this app, then re-fetches
// the list so students can see the row really landed.
function PostDemo() {
    const [name, setName] = useState("Sam");
    const [age, setAge] = useState("38");
    const [mood, setMood] = useState("nervous");
    const [firstVisit, setFirstVisit] = useState(true);

    const [sending, setSending] = useState(false);
    const [reply, setReply] = useState(null);
    const [clients, setClients] = useState([]);
    const [newest, setNewest] = useState(null);

    const load = async () => {
        const { data, failed } = await getAllClientForm();
        setClients(failed ? [] : data);
    };

    useEffect(() => {
        load();
    }, []);

    // age comes off a text input, so it is a string. The endpoint sends it
    // straight into an INTEGER column, so it goes as a number here.
    const body = { name, age: Number(age), mood, first_visit: firstVisit };

    const send = async () => {
        setSending(true);
        setReply(null);
        const { text, status, ms, failed } = await addClient(body);
        if (failed) {
            setReply({ status: 0, text: "Could not reach the server on port 3001.", ms: 0 });
        } else {
            setReply({ status, text, ms });
            setNewest(name);
            await load();
        }
        setSending(false);
    };

    return (
        <div className="demo">
            <div className="top">
                <span className="dot" />
                <strong>Send a real POST request</strong>
                <span className="hint">this goes to the actual server</span>
            </div>
            <div className="pad">
                <p className="lead">
                    Fill in a client and press Send. This is the same request Postman would make, and the
                    list at the bottom is re-fetched afterwards so you can see the row really saved.
                </p>

                <div className="row">
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="name" />
                    <input
                        value={age}
                        onChange={(e) => setAge(e.target.value)}
                        placeholder="age"
                        style={{ flex: "0 1 90px" }}
                    />
                    <input value={mood} onChange={(e) => setMood(e.target.value)} placeholder="mood" />
                    <label
                        style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}
                    >
                        <input
                            type="checkbox"
                            checked={firstVisit}
                            onChange={(e) => setFirstVisit(e.target.checked)}
                        />
                        first visit
                    </label>
                    <button className="btn" onClick={send} disabled={sending}>
                        {sending ? "Sending" : "Send"}
                    </button>
                </div>

                <div className="wire">
                    <div>
                        <span className="k">POST</span> /add-one-client
                    </div>
                    <div style={{ opacity: 0.75 }}>Content-Type: application/json</div>
                    <div style={{ marginTop: "8px" }}>
                        <span className="v">{JSON.stringify(body, null, 2)}</span>
                    </div>
                </div>

                {reply && (
                    <div className="wire" style={{ marginTop: "10px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                            <span className={reply.status === 200 ? "pill200" : "pill201"}>
                                {reply.status || "no reply"}
                            </span>
                            <span style={{ opacity: 0.7 }}>{reply.ms} ms</span>
                        </div>
                        <div className="ok" style={{ marginTop: "8px" }}>
                            {reply.text}
                        </div>
                    </div>
                )}

                <p className="sub" style={{ fontSize: "15px", marginBottom: "9px", marginTop: "22px" }}>
                    What the table holds now
                </p>
                <ul className="list">
                    {clients.map((c) => (
                        <li key={c.id} className={c.name === newest ? "fresh" : ""}>
                            <span className="nm">{c.name}</span>
                            <span className="where">{c.mood}</span>
                            {c.first_visit ? <span className="tagm fly">first visit</span> : null}
                            <span className="tagm">id {c.id}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default PostDemo;
