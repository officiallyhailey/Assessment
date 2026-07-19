// The component that fetches the animals and puts them on screen.
//
// Steps 3 to 6. Save and the page updates on its own: Vite reloads it.
//
// Steps 1 and 2 were the server. Check http://localhost:3001/get-all-animals
// works before starting here.

import { useState, useEffect } from "react";

function AnimalList() {
  // ── STEP 3 ────────────────────────────────────────────────────────
  // Somewhere to keep the animals. useState, starting as an empty array.

  // write it here

  // ── STEP 4 ────────────────────────────────────────────────────────
  // Ask the server for them.
  //   const response = await fetch("/api/get-all-animals")
  //   const data = await response.json()
  //   then store it with the setter from step 3
  //
  // The /api is stripped by Vite on the way through. See vite.config.js.

  // write it here

  // ── STEP 5 ────────────────────────────────────────────────────────
  // Run it once on page load. useEffect, with an empty array at the end.

  // write it here

  // ── STEP 6 ────────────────────────────────────────────────────────
  // Show them. Return a <ul>, map each animal to an <li key={animal.id}>.
  // Replace the line below.

  return <p>Nothing here yet. Start at step 3.</p>;

  // ──────────────────────────────────────────────────────────────────
}

export default AnimalList;
