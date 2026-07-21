// Puts the check-in list back to the original three, from the command line.
//
// The site has a Reset button in its header, but the lesson folder has no UI,
// and an HTTP endpoint is no use when the class has been adding rows with the
// site shut down. This is the same reset without the server in the way.
//
//   npm run reset

import db from "./db.js";
import { resetClientForm } from "./helpers.js";

const clients = await resetClientForm();

console.log("");
console.log(`  Reset. ${clients.length} clients: ${clients.map((c) => c.name).join(", ")}`);
console.log("");

await db.end();
