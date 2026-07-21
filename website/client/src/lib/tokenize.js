// Splits code into coloured, hoverable tokens.
//
// Kinds drive both the colour and what a hover can explain:
//   keyword     commands and language words        SELECT, const, await
//   type        column data types                  VARCHAR, INTEGER
//   rule        column constraints                 PRIMARY KEY, NOT NULL
//   data        values typed into the code         'Maya', 34, true
//   name        things the code names              clients, getClients, req
//   fn          something being called             fetch(, useState(
//   comment     notes for the reader
//   punct       brackets, commas, operators

const SQL_PHRASES = [
    "CREATE TABLE",
    "INSERT INTO",
    "PRIMARY KEY",
    "NOT NULL",
    "ORDER BY",
    "SELECT",
    "VALUES",
    "DELETE FROM",
    "REFERENCES",
    "JOIN",
    "FROM",
    "WHERE",
    "UPDATE",
    "SET",
    "LIMIT",
    "DESC",
    "ASC",
    "AND",
    "OR",
    "ON",
];

const SQL_TYPES = ["SERIAL", "INTEGER", "VARCHAR", "BOOLEAN", "DATE", "TEXT"];
const SQL_RULES = ["UNIQUE"];
// Constraints written as two words. They colour as rules, not commands,
// so every constraint on a column reads the same way.
const SQL_RULE_PHRASES = ["PRIMARY KEY", "NOT NULL", "REFERENCES"];
const SQL_FNS = ["COUNT", "AVG", "SUM", "MIN", "MAX"];

const JS_KEYWORDS = [
    "const",
    "let",
    "var",
    "function",
    "return",
    "await",
    "async",
    "import",
    "export",
    "default",
    "from",
    "if",
    "else",
    "try",
    "catch",
    "finally",
    "throw",
    "new",
    "typeof",
];

const JS_DATA = ["true", "false", "null", "undefined"];

const isWordChar = (c) => /[A-Za-z0-9_$.]/.test(c);

export function tokenize(code, lang) {
    const sql = lang === "sql";
    const lines = code.split("\n");

    return lines.map((line) => {
        const out = [];
        let i = 0;

        const push = (t, k) => {
            if (t) out.push({ t, k });
        };

        while (i < line.length) {
            const rest = line.slice(i);

            // comments run to the end of the line
            if ((sql && rest.startsWith("--")) || (!sql && rest.startsWith("//"))) {
                push(rest, "comment");
                break;
            }

            // strings
            const q = line[i];
            if (q === "'" || q === '"' || q === "`") {
                let j = i + 1;
                while (j < line.length && line[j] !== q) j++;
                push(line.slice(i, Math.min(j + 1, line.length)), "data");
                i = j + 1;
                continue;
            }

            // numbers
            const num = rest.match(/^\d+/);
            if (num && !isWordChar(line[i - 1] || " ")) {
                push(num[0], "data");
                i += num[0].length;
                continue;
            }

            // whitespace
            const ws = rest.match(/^\s+/);
            if (ws) {
                push(ws[0], "space");
                i += ws[0].length;
                continue;
            }

            // multi word sql phrases, longest first
            if (sql) {
                const upper = rest.toUpperCase();
                const phrase = SQL_PHRASES.find(
                    (p) => upper.startsWith(p) && !isWordChar(upper[p.length] || " ")
                );
                if (phrase) {
                    const kind = SQL_RULE_PHRASES.includes(phrase) ? "rule" : "keyword";
                    push(rest.slice(0, phrase.length), kind);
                    i += phrase.length;
                    continue;
                }
            }

            // words
            const word = rest.match(/^[A-Za-z_$][A-Za-z0-9_$]*/);
            if (word) {
                const w = word[0];
                const upper = w.toUpperCase();
                let kind = "name";

                if (sql) {
                    if (SQL_TYPES.includes(upper)) kind = "type";
                    else if (SQL_RULES.includes(upper)) kind = "rule";
                    else if (SQL_FNS.includes(upper)) kind = "fn";
                    else if (["true", "false", "null"].includes(w.toLowerCase())) kind = "data";
                } else {
                    if (JS_KEYWORDS.includes(w)) kind = "keyword";
                    else if (JS_DATA.includes(w)) kind = "data";
                    else if (line[i + w.length] === "(") kind = "fn";
                }

                push(w, kind);
                i += w.length;
                continue;
            }

            // anything else is punctuation, one character at a time
            push(line[i], "punct");
            i += 1;
        }

        return out;
    });
}

// The key a token looks up in the concept dictionary.
export function conceptKey(token, lang) {
    const raw = token.t.trim();
    if (!raw) return null;
    if (token.k === "comment" || token.k === "space" || token.k === "punct") return null;
    return lang === "sql" ? raw.toUpperCase() : raw;
}
