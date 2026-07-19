import { useState } from "react";
import { getAnimalById } from "../../lib/api";

// Fetching one record with a route parameter. The URL that actually goes out
// is printed underneath, so the placeholder becoming a real value is visible.
function OneDemo() {
    const [id, setId] = useState("3");
    const [animal, setAnimal] = useState(null);
    const [sent, setSent] = useState(null);
    const [busy, setBusy] = useState(false);

    const get = async () => {
        setBusy(true);
        const { data, status, url, ms, failed } = await getAnimalById(id);
        setSent({ url: url || `/get-one-animal-by-id/${id}`, status: failed ? 0 : status, ms });
        setAnimal(!failed && data && data.name ? data : false);
        setBusy(false);
    };

    return (
        <div className="demo">
            <div className="top">
                <span className="dot" />
                <strong>Fetch one animal by id</strong>
                <span className="hint">route parameter</span>
            </div>
            <div className="pad">
                <p className="lead">
                    Change the id and press Get. Watch the URL underneath: the placeholder in the route
                    becomes whatever value you typed.
                </p>

                <div className="row">
                    <input
                        value={id}
                        onChange={(e) => setId(e.target.value)}
                        onKeyDown={(e) => e.key === "Enter" && get()}
                        style={{ maxWidth: "90px", fontFamily: "var(--mono)" }}
                    />
                    <button className="btn" onClick={get} disabled={busy}>
                        {busy ? "Getting" : "Get this animal"}
                    </button>
                </div>

                {sent && (
                    <div className="wire" style={{ marginTop: "14px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "9px", flexWrap: "wrap" }}>
                            <span className="k">GET</span>
                            <span className="v">{sent.url}</span>
                            <span className="pill200">{sent.status || "failed"}</span>
                            <span style={{ opacity: 0.7 }}>{sent.ms} ms</span>
                        </div>
                        <div style={{ opacity: 0.65, marginTop: "6px", fontSize: "12px" }}>
                            on the server this arrives as req.params.id, and it is the text "{id}"
                        </div>
                    </div>
                )}

                {animal === false && (
                    <div className="note warn" style={{ marginTop: "14px" }}>
                        <div className="lab">Nothing found</div>
                        <p>
                            There is no animal with that id. The endpoint still answered, it just had nothing
                            to send back.
                        </p>
                    </div>
                )}

                {animal && animal.name && (
                    <div className="renderbox fresh" style={{ marginTop: "14px" }}>
                        <div className="rcount">one object, not a list, so there is no map here</div>
                        <div style={{ fontSize: "20px", fontWeight: 600, color: "var(--deep)" }}>
                            {animal.name}
                        </div>
                        <div style={{ marginTop: "6px", fontSize: "14.5px" }}>
                            Category: {animal.category}
                            <br />
                            Lives in: {animal.lives_in}
                            <br />
                            Can fly: {animal.can_fly ? "Yes" : "No"}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default OneDemo;
