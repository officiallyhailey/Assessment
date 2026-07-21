// A small segmented control. Used for the Table/Form switch in the panel and
// for the Create/Insert/Read switch that drives which lines the code highlights.

function SegToggle({ options, value, onChange, className = "" }) {
    return (
        <div className={`seg ${className}`.trim()} role="tablist">
            {options.map((o) => (
                <button
                    key={o.id}
                    role="tab"
                    aria-selected={value === o.id}
                    className={value === o.id ? "on" : ""}
                    onClick={() => onChange(o.id)}
                >
                    {o.label}
                </button>
            ))}
        </div>
    );
}

export default SegToggle;
