// The component that fetches the animals and puts them on screen.
//
// Steps 3 to 6. Save and the page updates on its own: Vite reloads it.

import { useState, useEffect } from "react";

function AnimalList() {
  // ---------------------------------------------------------------------------
  // STEP 3.  Somewhere to keep the animals.
  //
  // useState hands back two things: the current value, and the function that
  // changes it. Calling that function is also what tells React to draw again.
  //
  // It starts as an empty array on purpose. map works fine on an empty array
  // and shows nothing, where starting with no value at all would throw on the
  // very first render, before any data could possibly exist.
  // ---------------------------------------------------------------------------
  const [animals, setAnimals] = useState([]);

  // ---------------------------------------------------------------------------
  // STEP 4.  Ask the server for them.
  //
  // Two awaits, because there are two separate waits. fetch resolves once the
  // server answers, and hands back a Response describing the reply. That is not
  // the data yet. response.json() reads the body and turns it into a real
  // array, which is the second wait.
  //
  // The address starts with /api. Vite is told to forward anything starting
  // that way to the server on port 3001, stripping the /api as it goes, so the
  // server sees /get-all-animals. See vite.config.js.
  //
  // setAnimals is the line that puts it on screen: storing the data is what
  // asks React to draw the component again.
  // ---------------------------------------------------------------------------
  const getAnimals = async () => {
    const response = await fetch("/api/get-all-animals");
    const data = await response.json();
    setAnimals(data);
  };

  // ---------------------------------------------------------------------------
  // STEP 5.  Run it once, when the page loads.
  //
  // useEffect runs code AFTER the component has drawn. Fetching in the body of
  // the component would run during the draw, and storing the result would cause
  // another draw, which would fetch again, forever.
  //
  // The empty array at the end is the dependency list. Empty means run once.
  // Leave it off entirely and you get exactly that endless loop, which is worth
  // causing on purpose with the Network tab open.
  // ---------------------------------------------------------------------------
  useEffect(() => {
    getAnimals();
  }, []);

  // ---------------------------------------------------------------------------
  // STEP 6.  Show them.
  //
  // Everything returned here is JSX. It reads like HTML and it is JavaScript,
  // and the curly braces are the door back into JavaScript, which is why map
  // sits inside them.
  //
  // key is a stable id per item so React can tell them apart between draws. The
  // database id is ideal: nothing else shares it and it never changes.
  //
  // Remember the screen draws TWICE, once here with an empty array and again
  // once the fetch has stored the data. That is not a bug, it is what lets the
  // page appear instantly instead of freezing until the server answers.
  // ---------------------------------------------------------------------------
  return (
    <ul>
      {animals.map((animal) => (
        <li key={animal.id}>
          <strong>{animal.name}</strong>, {animal.lives_in}
        </li>
      ))}
    </ul>
  );
}

export default AnimalList;
