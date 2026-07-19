import { useEffect, useState } from "react";
import { getAllAnimals, addAnimal } from "../lib/api";

// Shows what a code sample produces when it runs. Where the sample talks to
// the API, the result is fetched live so it is the real thing rather than a
// picture of it.

function Table({ columns, rows }) {
    return (
        <div className="rtable">
            <table>
                <thead>
                    <tr>
                        {columns.map((c) => (
                            <th key={c}>{c}</th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {rows.map((r, i) => (
                        <tr key={i}>
                            {columns.map((c) => (
                                <td key={c}>
                                    {r[c] === null || r[c] === undefined ? (
                                        <span className="rnull">empty</span>
                                    ) : (
                                        String(r[c])
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="rcap">
                {rows.length} {rows.length === 1 ? "row" : "rows"} returned
            </div>
        </div>
    );
}

function Screen({ title, animals }) {
    return (
        <div className="rscreen">
            <div className="rbar">
                <span className="rdot red" />
                <span className="rdot amber" />
                <span className="rdot green" />
            </div>
            <div className="rbody">
                <h4>{title}</h4>
                <ul>
                    {animals.map((a) => (
                        <li key={a.id}>
                            <strong>{a.name}</strong>
                            {a.lives_in ? <span>, {a.lives_in}</span> : null}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

function ResultView({ sample }) {
    const spec = sample.result;
    const [animals, setAnimals] = useState(null);
    const [failed, setFailed] = useState(false);
    const [sending, setSending] = useState(false);
    const [exchange, setExchange] = useState(null);

    const needsData = spec && (spec.kind === "table" || spec.kind === "screen");

    useEffect(() => {
        if (!needsData) return;
        let alive = true;
        (async () => {
            const { data, failed: fetchFailed } = await getAllAnimals();
            if (!alive) return;
            if (fetchFailed) setFailed(true);
            else setAnimals(data);
        })();
        return () => {
            alive = false;
        };
    }, [needsData]);

    if (!spec) {
        return (
            <div className="rwrap">
                <p className="ridle">This sample has no result to show on its own.</p>
            </div>
        );
    }

    // ---------- a query returning rows ----------
    if (spec.kind === "table") {
        if (failed) return <div className="rwrap"><p className="ridle">The API is not running, so there are no live rows to show.</p></div>;
        if (!animals) return <div className="rwrap"><p className="ridle"><span className="spinner" /> reading from the database</p></div>;

        const rows = spec.filter ? animals.filter(spec.filter) : animals;
        const columns = spec.columns || Object.keys(animals[0] || {});
        return (
            <div className="rwrap">
                <div className="rlead">{spec.caption}</div>
                <Table columns={columns} rows={rows} />
            </div>
        );
    }

    // ---------- a request and its response ----------
    if (spec.kind === "exchange") {
        const send = async () => {
            setSending(true);
            const { text, status, ms, failed: sendFailed } = await addAnimal(spec.body);
            setExchange(
                sendFailed
                    ? { status: 0, ms: 0, text: "Could not reach the server." }
                    : { status, ms, text }
            );
            setSending(false);
        };

        return (
            <div className="rwrap">
                <div className="rlead">{spec.caption}</div>

                <div className="rreq">
                    <div className="rline">
                        <span className="rmethod">{spec.method}</span>
                        <span className="rurl">{spec.url}</span>
                    </div>
                    <div className="rhdr">Content-Type: application/json</div>
                    <pre className="rjson">{JSON.stringify(spec.body, null, 2)}</pre>
                </div>

                <button className="btn" onClick={send} disabled={sending}>
                    {sending ? "Sending" : exchange ? "Send again" : "Send this request"}
                </button>

                {exchange && (
                    <div className="rres">
                        <div className="rline">
                            <span className={exchange.status === 200 ? "rok" : "rbad"}>
                                {exchange.status || "no reply"}
                            </span>
                            <span className="rms">{exchange.ms} ms</span>
                        </div>
                        <pre className="rjson out">{exchange.text}</pre>
                    </div>
                )}
            </div>
        );
    }

    // ---------- what appears on screen ----------
    if (spec.kind === "screen") {
        if (failed) return <div className="rwrap"><p className="ridle">The API is not running, so there is nothing to render.</p></div>;
        if (!animals) return <div className="rwrap"><p className="ridle"><span className="spinner" /> fetching</p></div>;
        return (
            <div className="rwrap">
                <div className="rlead">{spec.caption}</div>
                <Screen title={spec.title || "Animals"} animals={animals} />
            </div>
        );
    }

    return null;
}

export default ResultView;
