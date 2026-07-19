// Puts every lesson's animals back to the original three.
// The starting data lives here rather than in a second file per folder, so
// each lesson folder holds only the files you actually open.

const fs = require("fs");
const path = require("path");

const ORIGINAL = [
    { id: 1, name: "Lion",    category: "Mammal", can_fly: false, lives_in: "Savanna",    population: 23000 },
    { id: 2, name: "Penguin", category: "Bird",   can_fly: false, lives_in: "Antarctica", population: 1200000 },
    { id: 3, name: "Eagle",   category: "Bird",   can_fly: true,  lives_in: "Mountains",  population: 5000 },
];

const targets = [
    "lesson-2-post/complete", "lesson-2-post/scaffold",
    "lesson-3-react/complete", "lesson-3-react/scaffold",
];

for (const t of targets) {
    fs.writeFileSync(
        path.join(__dirname, t, "animals-data.json"),
        JSON.stringify(ORIGINAL, null, 2) + "\n"
    );
}

console.log(`Reset ${targets.length} lesson data files to the original three animals.`);
