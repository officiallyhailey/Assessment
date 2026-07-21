import { useEffect, useRef, useState } from "react";
import { getAllClientForm, addClient } from "../../lib/api";

const STARTING_BODY = `{
  "name": "Sam",
  "age": 38,
  "email": "sam@example.com",
  "mood": "nervous",
  "first_visit": true
}`;

// Sends a real POST to the server running alongside this app, then re-fetches
// the list so students can see the row really landed.
//
// The input is the JSON body itself, the way it is typed into Postman, rather
// than a set of form fields. That is the practical thing to recognise: a POST
// carries a JSON body, and this is what one looks like.
function PostDemo() {
    const [bodyText, setBodyText] = useState(STARTING_BODY);
    const [sending, setSending] = useState(false);
    const [reply, setReply] = useState(null);
    const [clients, setClients] = useState([]);
    const [newest, setNewest] = useState(null);
    const box = useRef(null);

    const load = async () => {
        const { data, failed } = await getAllClientForm();
        setClients(failed || !Array.isArray(data) ? [] : data);
    };

    useEffect(() => {
        load();
    }, []);

    // Grow the textarea to fit the JSON, so the whole body is always visible.
    useEffect(() => {
        const el = box.current;
        if (!el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight + 2}px`;
    }, [bodyText]);

    const send = async () => {
        let body;
        try {
            body = JSON.parse(bodyText);
        } catch {
            setReply({ status: 0, ms: 0, text: "That is not valid JSON. Check the commas and quotes." });
            return;
        }

        setSending(true);
        setReply(null);
        const { text, status, ms, failed } = await addClient(body);
        if (failed) {
            setReply({ status: 0, text: "Could not reach the server. Is the API running?", ms: 0 });
        } else if (status >= 400) {
            // A duplicate email lands here: the database refused it because email
            // is UNIQUE. Surface that rather than the raw error JSON.
            const dup = /unique|duplicate/i.test(text);
            let msg = text;
            if (dup) msg = "That email is already checked in. email is UNIQUE, so the database refused the duplicate.";
            else {
                try {
                    msg = JSON.parse(text).error || text;
                } catch {
                    /* leave as-is */
                }
            }
            setReply({ status, text: msg, ms });
        } else {
            setReply({ status, text, ms });
            setNewest(body.name);
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
                    This is the request itself, the way Postman sends it: a method, a path, and a JSON
                    body. Edit the body and press Send. The list at the bottom is re-fetched afterwards, so
                    you can see the row really saved. Press Send twice without changing the email and watch
                    the database refuse the duplicate &mdash; that is the UNIQUE constraint.
                </p>

                <div className="wire">
                    <div>
                        <span className="k">POST</span> /add-one-client
                    </div>
                    <div style={{ opacity: 0.75 }}>Content-Type: application/json</div>
                    <textarea
                        ref={box}
                        className="jsonbox"
                        value={bodyText}
                        onChange={(e) => setBodyText(e.target.value)}
                        spellCheck="false"
                        rows={1}
                    />
                </div>

                <button className="btn" style={{ marginTop: "12px" }} onClick={send} disabled={sending}>
                    {sending ? "Sending" : "Send"}
                </button>

                {reply && (
                    <div className="wire" style={{ marginTop: "12px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
                            <span
                                className={
                                    reply.status === 0 || reply.status >= 400
                                        ? "pillbad"
                                        : reply.status === 200
                                        ? "pill200"
                                        : "pill201"
                                }
                            >
                                {reply.status || "no reply"}
                            </span>
                            <span style={{ opacity: 0.7 }}>{reply.ms} ms</span>
                        </div>
                        <div className="ok" style={{ marginTop: "8px" }}>
                            {reply.text}
                        </div>
                    </div>
                )}

                <p className="sub" style={{ fontSize: "15px", marginBottom: "4px", marginTop: "22px" }}>
                    What the table holds now
                </p>
                <p className="lead" style={{ marginTop: 0, marginBottom: "12px" }}>
                    Each row has an id, but the body never sent one. That is SERIAL doing its job: the
                    database fills it in and counts up on its own.
                </p>
                <div className="tw">
                    <table className="d">
                        <thead>
                            <tr>
                                <th className="m">id</th>
                                <th className="m">name</th>
                                <th className="m">age</th>
                                <th className="m">email</th>
                                <th className="m">mood</th>
                                <th className="m">first_visit</th>
                            </tr>
                        </thead>
                        <tbody>
                            {clients.map((c) => (
                                <tr key={c.id} className={c.name === newest ? "fresh" : ""}>
                                    <td className="m">{c.id}</td>
                                    <td className="m">{c.name}</td>
                                    <td className="m">{c.age}</td>
                                    <td className="m">{c.email}</td>
                                    <td className="m">{c.mood}</td>
                                    <td className="m">{String(c.first_visit)}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default PostDemo;
