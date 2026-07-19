import { useEffect, useState } from "react";
import { getAllAnimals, addAnimal } from "../../lib/api";

// Sends a real POST to the server running alongside this app,
// then re fetches the list so students can see the row really landed.
function PostDemo() {
    const [name, setName] = useState("Tiger");
    const [category, setCategory] = useState("Mammal");
    const [livesIn, setLivesIn] = useState("Jungle");
    const [canFly, setCanFly] = useState(false);

    const [sending, setSending] = useState(false);
    const [reply, setReply] = useState(null);
    const [animals, setAnimals] = useState([]);
    const [newest, setNewest] = useState(null);

    const load = async () => {
        const { data, failed } = await getAllAnimals();
        setAnimals(failed ? [] : data);
    };

    useEffect(() => {
        load();
    }, []);

    const body = { name, category, can_fly: canFly, lives_in: livesIn };

    const send = async () => {
        setSending(true);
        setReply(null);
        const { text, status, ms, failed } = await addAnimal(body);
        if (failed) {
            setReply({ status: 0, text: "Could not reach the server on port 3000.", ms: 0 });
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
                    Fill in an animal and press Send. This is the same request Postman would make, and the
                    list at the bottom is re fetched afterwards so you can see the row really saved.
                </p>

                <div className="row">
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="name" />
                    <input
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        placeholder="category"
                    />
                    <input
                        value={livesIn}
                        onChange={(e) => setLivesIn(e.target.value)}
                        placeholder="lives in"
                    />
                    <label
                        style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "14px" }}
                    >
                        <input
                            type="checkbox"
                            checked={canFly}
                            onChange={(e) => setCanFly(e.target.checked)}
                        />
                        can fly
                    </label>
                    <button className="btn" onClick={send} disabled={sending}>
                        {sending ? "Sending" : "Send"}
                    </button>
                </div>

                <div className="wire">
                    <div>
                        <span className="k">POST</span> /add-one-animal
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
                    {animals.map((a) => (
                        <li key={a.id} className={a.name === newest ? "fresh" : ""}>
                            <span className="nm">{a.name}</span>
                            <span className="where">{a.lives_in}</span>
                            {a.can_fly ? <span className="tagm fly">can fly</span> : null}
                            <span className="tagm">id {a.id}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default PostDemo;
