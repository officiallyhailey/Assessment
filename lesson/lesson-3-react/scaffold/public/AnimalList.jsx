// LESSON 3.  Write the four steps, save, then refresh the page.
//
// The server is already done and /get-all-animals already returns the three
// animals. Everything you write is in this file.

const { useState, useEffect } = React;

function AnimalList() {
    // ── STEP 1 ──  Hold the animals.
    //
    // useState gives the component a value it remembers between draws, and
    // hands back two things: the value, and the function that updates it.
    // Start it as an empty array, so there is something valid to show before
    // any data has arrived.

    // write it here

    // ── STEP 2 ──  Fetch them.
    //
    // Two awaits, because there are two waits: one for the server to answer,
    // and one to read the body of that answer.
    //
    //   const response = await fetch("/get-all-animals")
    //   const data = await response.json()
    //   then store it with the function from step 1
    //
    // Storing it is what puts it on screen. Fetching alone changes nothing.

    // write it here

    // ── STEP 3 ──  Run it once, when the page loads.
    //
    // useEffect runs code after the component has drawn. The second argument
    // is a list of things to watch: an empty array means run once and never
    // again. Leave the array off and it runs after every draw, which stores
    // data, which causes another draw, forever.

    // write it here

    // ── STEP 4 ──  Show them.
    //
    // Return a <ul>. Inside it, map each animal to an <li> with a key, using
    // the animal's id. Curly braces are the way back into JavaScript.
    //
    //   {animals.map((animal) => (
    //       <li key={animal.id}>...</li>
    //   ))}
    //
    // Replace the line below once step 1 exists.

    return <p className="muted">Nothing here yet. Start at step 1.</p>;
}

ReactDOM.createRoot(document.getElementById("root")).render(<AnimalList />);
