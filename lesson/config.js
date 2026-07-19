// The lesson folders talk to the same database the site does, so the connection
// string lives in one place rather than being pasted twice.
//
// Nothing secret is in this file: it points at server/src/config.js, which is
// not committed.

export { default } from "../server/src/config.js";
