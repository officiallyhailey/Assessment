// The component that puts the animals on the page.

import { useState, useEffect } from "react";
import "../App.css";

// ─── TOPIC 3 ──────────────────────────────────────────────────────────
// Notes on each step are in answer-key.js.

function AnimalList() {
  // state: the animals, starting as an empty array

const [animals, setAnimals] = useState([]);

  // get helper function: fetch, read the json, store it

  const getAnimals = async () => {
  const response = await fetch("/api/get-all-animals");
  const data = await response.json();
  setAnimals(data);
};

  // useEffect: run the helper once, on page load

useEffect(() => {
  getAnimals();
}, []);

  // replace the code below: return the list: a <ul>, one <li key={animal.id}> per animal

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

// ──────────────────────────────────────────────────────────────────────

export default AnimalList;
