// LESSON 3.  Getting data out of the database and onto the screen.
//
// The component draws twice: once immediately with an empty array, and again
// once the data has arrived. That is not a bug, it is what lets the page appear
// straight away instead of staying blank until the server answers.

import { useState, useEffect } from "react";

function Home() {
  // Somewhere to keep the animals between draws. It starts as an empty array
  // on purpose: map works fine on one and shows nothing, where starting with
  // no value at all would throw on that very first draw.
  const [animals, setAnimals] = useState([]);

  // Two awaits, because there are two waits. fetch resolves when the server
  // answers, handing back a Response that describes the reply. That is not the
  // data yet. response.json() reads the body, which is the second wait.
  //
  // The address starts with /api, which Vite strips on the way through.
  const getAnimals = async () => {
    const response = await fetch("/api/get-all-animals");
    const data = await response.json();
    setAnimals(data);
  };

  // Runs after the first draw, not during it. The empty array means run once:
  // leave it off and storing the data would cause another draw, which would
  // fetch again, forever.
  useEffect(() => {
    getAnimals();
  }, []);

  return (
    <section>
      <h2>Every animal</h2>
      <ul>
        {animals.map((animal) => (
          <li key={animal.id}>
            <strong>{animal.name}</strong>, {animal.lives_in}
            {animal.can_fly ? <span className="tag">can fly</span> : null}
          </li>
        ))}
      </ul>
    </section>
  );
}

export default Home;
