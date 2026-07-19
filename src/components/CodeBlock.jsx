import { useState } from "react";

/**
 * A plain, non-interactive code block with a copy button.
 *
 * Used for short snippets inside lesson prose. The main sample for a lesson
 * goes through CodeExplorer instead, which adds the explanation modes.
 */
function CodeBlock({ name, code }) {
    const [copied, setCopied] = useState(false);

    const copy = async () => {
        try {
            await navigator.clipboard.writeText(code);
            setCopied(true);
            setTimeout(() => setCopied(false), 1400);
        } catch {
            setCopied(false);
        }
    };

    return (
        <div className="code">
            <div className="bar">
                <span className="name">{name}</span>
                <button className="copy" onClick={copy}>
                    {copied ? "Copied" : "Copy"}
                </button>
            </div>
            <pre>
                <code>{code}</code>
            </pre>
        </div>
    );
}

export default CodeBlock;
