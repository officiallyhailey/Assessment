import { useEffect, useRef, useState } from "react";
import { getAllClientForm } from "../../lib/api";

// A very small SELECT reader. It understands the shape taught in this lesson:
//   SELECT <columns or *> FROM client_form [WHERE <column> = <value>]
// The rows it runs against are the real ones fetched from the server.
function runSelect(sql, rows) {
    if (!Array.isArray(rows)) {
        return { error: "No rows are loaded, so there is nothing to query yet." };
    }
    const clean = sql.trim().replace(/;+\s*$/, "").replace(/\s+/g, " ");
    const m = clean.match(/^select\s+(.+?)\s+from\s+client_form(?:\s+where\s+(.+))?$/i);
    if (!m) {
        return { error: "Start with SELECT, then FROM client_form. A WHERE part is optional." };
    }

    const colPart = m[1].trim();
    const wherePart = m[2];

    const all = ["id", "name", "age", "email", "mood", "first_visit"];
    let cols;
    if (colPart === "*") {
        cols = all;
    } else {
        cols = colPart.split(",").map((c) => c.trim().toLowerCase());
        const bad = cols.find((c) => !all.includes(c));
        if (bad) return { error: `There is no column called ${bad}.` };
    }

    let out = rows;
    if (wherePart) {
        const w = wherePart.match(/^(\w+)\s*=\s*(.+)$/);
        if (!w) return { error: "The WHERE part should look like: WHERE name = 'Maya'" };
        const col = w[1].toLowerCase();
        if (!all.includes(col)) return { error: `There is no column called ${col}.` };

        let raw = w[2].trim();
        let value;
        if (/^'.*'$/.test(raw) || /^".*"$/.test(raw)) value = raw.slice(1, -1);
        else if (/^(true|false)$/i.test(raw)) value = raw.toLowerCase() === "true";
        else if (/^\d+$/.test(raw)) value = Number(raw);
        else return { error: "Put text in single quotes, like 'Maya'." };

        out = rows.filter((r) => r[col] === value);
    }

    return { cols, rows: out };
}

const EXAMPLES = [
    "SELECT * FROM client_form;",
    "SELECT * FROM client_form WHERE name = 'Maya';",
    "SELECT name, mood FROM client_form WHERE first_visit = true;",
    "SELECT name, email FROM client_form WHERE age = 34;",
];

function SqlDemo() {
    const [rows, setRows] = useState([]);
    const [sql, setSql] = useState(EXAMPLES[0]);
    const [result, setResult] = useState(null);
    const [loading, setLoading] = useState(true);
    const box = useRef(null);

    // Grow the box to fit whatever is in it. A textarea keeps its set number of
    // rows otherwise and scrolls the overflow out of sight, which is the thing
    // being fixed. Height is cleared first so it can shrink as well as grow.
    useEffect(() => {
        const el = box.current;
        // offsetWidth is 0 while the panel is hidden, and scrollHeight would be
        // meaningless then, so leave the height alone until it is on screen.
        if (!el || !el.offsetWidth) return;
        el.style.height = "auto";
        // scrollHeight measures the content box. The element is border-box, so
        // the borders have to be added back or it lands two pixels short and
        // the last line is very slightly clipped.
        const cs = getComputedStyle(el);
        const borders = parseFloat(cs.borderTopWidth) + parseFloat(cs.borderBottomWidth);
        el.style.height = `${el.scrollHeight + borders}px`;
    }, [sql]);

    useEffect(() => {
        const load = async () => {
            const { data, failed } = await getAllClientForm();
            if (failed || !Array.isArray(data)) {
                setResult({ error: "Could not reach the server, so there are no live rows to query." });
            } else {
                setRows(data);
                setResult(runSelect(EXAMPLES[0], data));
            }
            setLoading(false);
        };
        load();
    }, []);

    const run = () => setResult(runSelect(sql, rows));

    return (
        <div className="demo">
            <div className="top">
                <span className="dot" />
                <strong>Query the client_form table</strong>
                <span className="hint">rows come from the live server</span>
            </div>
            <div className="pad">
                <p className="lead">
                    Type a query and press Run. Try changing the column names, or the value after WHERE.
                </p>

                <div className="row">
                    {/* A textarea rather than an input, because an input cannot
                        wrap: a query longer than the box would scroll sideways
                        and hide its own ending. This wraps and grows instead, so
                        the whole query stays readable. Enter still runs it, and
                        Shift with Enter adds a line. */}
                    <textarea
                        ref={box}
                        className="sqlbox"
                        value={sql}
                        onChange={(e) => setSql(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                run();
                            }
                        }}
                        rows={1}
                        spellCheck="false"
                    />
                    <button className="btn" onClick={run} disabled={loading}>
                        Run
                    </button>
                </div>

                <div className="row" style={{ marginTop: "10px" }}>
                    {EXAMPLES.map((ex, i) => (
                        <button
                            key={i}
                            className="btn ghost"
                            style={{ fontSize: "12.5px", padding: "6px 11px" }}
                            onClick={() => {
                                setSql(ex);
                                setResult(runSelect(ex, rows));
                            }}
                        >
                            {i === 0 ? "all rows" : i === 1 ? "one client" : i === 2 ? "first visits" : "by age"}
                        </button>
                    ))}
                </div>

                {loading && (
                    <p className="stat" style={{ marginTop: "16px" }}>
                        <span className="spinner" /> loading rows from the server
                    </p>
                )}

                {result && result.error && (
                    <div className="note warn" style={{ marginTop: "16px" }}>
                        <div className="lab">Try again</div>
                        <p>{result.error}</p>
                    </div>
                )}

                {result && !result.error && (
                    <div style={{ marginTop: "16px" }}>
                        <div className="rcount">
                            {result.rows.length} {result.rows.length === 1 ? "row" : "rows"} returned,{" "}
                            {result.cols.length} {result.cols.length === 1 ? "column" : "columns"}
                        </div>
                        <div className="tw">
                            <table className="d">
                                <thead>
                                    <tr>
                                        {result.cols.map((c) => (
                                            <th key={c} className="m">
                                                {c}
                                            </th>
                                        ))}
                                    </tr>
                                </thead>
                                <tbody>
                                    {result.rows.map((r) => (
                                        <tr key={r.id}>
                                            {result.cols.map((c) => (
                                                <td key={c} className="m">
                                                    {r[c] === null || r[c] === undefined ? (
                                                        <span style={{ color: "var(--soft)" }}>empty</span>
                                                    ) : (
                                                        String(r[c])
                                                    )}
                                                </td>
                                            ))}
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                        {result.rows.length === 0 && (
                            <p className="empty">
                                No rows matched. That is a real answer, not an error.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default SqlDemo;
