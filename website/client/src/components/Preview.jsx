import { useState } from "react";
import FormPreview from "./FormPreview";
import SegToggle from "./SegToggle";

// The Defining-columns panel: the same client_form shown two ways, with a toggle
// between them. The table is the database side, a grid of filled rows; the form
// is the office side, one blank form. Seeing them side by side is the whole
// point of the section, that a column is a box on the form and a row is one
// filled-in form.
//
// It opens on the table, since that is what the columns are being defined for.

const COLS = ["id", "name", "age", "email", "mood", "first_visit"];

const ROWS = [
    { id: 1, name: "Maya", age: 34, email: "maya@example.com", mood: "anxious", first_visit: true },
    { id: 2, name: "Daniel", age: 41, email: "daniel@example.com", mood: "hopeful", first_visit: false },
    { id: 3, name: "Priya", age: 29, email: "priya@example.com", mood: "tired", first_visit: true },
];

function TableView() {
    return (
        <div className="tableprev">
            <div className="tableprev-head">
                <span className="tableprev-name">client_form</span>
                <span className="tableprev-sub">the filled table</span>
            </div>
            <div className="tableprev-scroll">
                <table className="dbgrid">
                    <thead>
                        <tr>
                            {COLS.map((c) => (
                                <th key={c}>{c}</th>
                            ))}
                        </tr>
                    </thead>
                    <tbody>
                        {ROWS.map((r) => (
                            <tr key={r.id}>
                                {COLS.map((c) => (
                                    <td key={c}>{String(r[c])}</td>
                                ))}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            <p className="tableprev-foot">
                Each row is one filled-in form. Each column is one box, the same on every form.
            </p>
        </div>
    );
}

function Preview({ start = "table" }) {
    const [view, setView] = useState(start);
    return (
        <div className="preview">
            <SegToggle
                className="seg-panel"
                options={[
                    { id: "table", label: "Table" },
                    { id: "form", label: "Form" },
                ]}
                value={view}
                onChange={setView}
            />
            <div className="preview-body">{view === "table" ? <TableView /> : <FormPreview />}</div>
        </div>
    );
}

export default Preview;
