// Puts the animals back to the original three, from the command line.
//
// The site has a Reset button in its header, but the lesson folder has no UI,
// and an HTTP endpoint is no use when the class has been adding rows with the
// site shut down. This is the same reset without the server in the way.
//
//   npm run reset

import db from "./db.js";
import { resetAnimals } from "./animals-helpers.js";

const animals = await resetAnimals();

console.log("");
console.log(`  Reset. ${animals.length} animals: ${animals.map((a) => a.name).join(", ")}`);
console.log("");

await db.end();
