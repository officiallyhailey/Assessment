// Puts the site's animals back to the original three.
//
// The starting data lives here rather than in a separate seed file, matching
// how lesson/reset.js works, so there is one pattern to learn rather than two.

const fs = require("fs");
const path = require("path");

const ORIGINAL = [
    { id: 1, name: "Lion",    category: "Mammal", can_fly: false, lives_in: "Savanna",    population: 23000 },
    { id: 2, name: "Penguin", category: "Bird",   can_fly: false, lives_in: "Antarctica", population: 1200000 },
    { id: 3, name: "Eagle",   category: "Bird",   can_fly: true,  lives_in: "Mountains",  population: 5000 },
];

function resetAnimals() {
    fs.writeFileSync(
        path.join(__dirname, "animals-data.json"),
        JSON.stringify(ORIGINAL, null, 2) + "\n"
    );
    return ORIGINAL;
}

// Two ways in, one behaviour: `npm run reset` from a terminal, and the reset
// button on the site, which goes through the endpoint in server.js.
if (require.main === module) {
    resetAnimals();
    console.log("Site animal data reset to the original three animals.");
}

module.exports = { resetAnimals, ORIGINAL };
