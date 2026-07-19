// LESSON 3, the React.  Write steps 2 to 5, save, refresh the page.
//
// Step 1 was the GET endpoint in server.js. Check that works first.

const { useState, useEffect } = React;

function AnimalList() {
    // ── STEP 2 ────────────────────────────────────────────────────────
    // Hold the animals. useState, starting as an empty array.

    // write it here

    // ── STEP 3 ────────────────────────────────────────────────────────
    // Fetch them.
    //   const response = await fetch("/get-all-animals")
    //   const data = await response.json()
    //   then store it with the setter from step 2

    // write it here

    // ── STEP 4 ────────────────────────────────────────────────────────
    // Run it once on page load. useEffect, with an empty array at the end.

    // write it here

    // ── STEP 5 ────────────────────────────────────────────────────────
    // Show them. Return a <ul>, map each animal to an <li key={animal.id}>.
    // Replace the line below.

    return <p className="muted">Nothing here yet. Start at step 2.</p>;

    // ──────────────────────────────────────────────────────────────────
}

ReactDOM.createRoot(document.getElementById("root")).render(<AnimalList />);
