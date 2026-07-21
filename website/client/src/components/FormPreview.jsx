// The blank check-in form, drawn as a form rather than described. It is what the
// panel shows while the reader is on "Defining columns", so the columns being
// discussed have a shape on screen: one box per column, each labelled with the
// kind of answer it takes and whether it may be left blank.
//
// This is the office side of CREATE TABLE. When the reader scrolls on to "The
// code", the same panel swaps to the SQL that designs exactly this.

const FIELDS = [
    { label: "Name", type: "text", holds: "text", required: true },
    { label: "Age", type: "number", holds: "a number" },
    { label: "Email", type: "text", holds: "an address", required: true, unique: true },
    { label: "Mood", type: "text", holds: "text" },
    { label: "First visit?", type: "choice", holds: "yes or no", required: true },
];

function Field({ label, type, holds, required, unique }) {
    return (
        <label className="ff">
            <span className="ff-top">
                <span className="ff-label">{label}</span>
                {required && <span className="ff-req">required</span>}
                {unique && <span className="ff-uniq">unique</span>}
            </span>
            {type === "choice" ? (
                <span className="ff-choice">
                    <span className="ff-opt">Yes</span>
                    <span className="ff-opt">No</span>
                </span>
            ) : (
                <span className={`ff-box ff-${type}`}>
                    <span className="ff-holds">{holds}</span>
                </span>
            )}
        </label>
    );
}

function FormPreview() {
    return (
        <div className="formprev">
            <div className="formprev-head">
                <span className="formprev-kicker">Client check-in</span>
                <span className="formprev-id">
                    No. <em>assigned by the office</em>
                </span>
            </div>
            <div className="formprev-fields">
                {FIELDS.map((f) => (
                    <Field key={f.label} {...f} />
                ))}
            </div>
            <p className="formprev-foot">
                The blank form: one box per column. <strong>CREATE TABLE</strong> designs exactly this.
            </p>
        </div>
    );
}

export default FormPreview;
