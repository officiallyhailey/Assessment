// The component that puts the animals on the page.

import { useState, useEffect } from "react";
import "../App.css";

// TOPIC 3          Send a GET request in React and render the data
//
//   The data lives on the server, so it cannot be there the instant the page
//   appears. This component draws twice: once straight away with nothing, and
//   again once the animals have arrived. That is normal, and it is what keeps
//   a page from sitting blank while it waits.
//
//   1.  HELPER  getAnimals
//       const response = await fetch("/api/get-all-animals")
//       const data = await response.json()
//       Two awaits, because there are two waits: one for the server to
//       answer, one to read the body of that answer.
//       Then store the data with the setter from step 2.
//
//   2.  STATE  useState, starting as an empty array
//       A plain variable would be wiped on every draw. State survives, and
//       changing it is what asks React to draw again.
//       Start it as an empty array so step 4 has something to map over
//       before any data exists.
//
//   3.  useEffect(() => { ... }, [])
//       Runs the helper after the first draw rather than during it. The empty
//       array means once: without it, storing data would cause another draw,
//       which would fetch again, and it would never stop.
//
//   4.  RENDER  a <ul>, one <li key={animal.id}> per animal
//       key lets React tell the items apart between draws. The database id is
//       ideal, because nothing else shares it and it never changes.
//
//   Then open the Network tab and reload. The request should be listed, and
//   its response should hold the rows.
//
//   It shows up twice there, which is expected. React deliberately runs
//   effects twice in development to shake out bugs. A real build runs it once.
//
// ███████████████████████████████████████████████████████████████████████████

function AnimalList() {
  // write it here

  return <p className="empty">Nothing here yet. Start at step 1.</p>;
}

export default AnimalList;
