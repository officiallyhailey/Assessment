// LESSON 3.  The GET endpoint, written in server/src/index.js.

import { useState, useEffect } from "react";

function LessonThree() {
  const [animals, setAnimals] = useState([]);
  const [failed, setFailed] = useState(false);

  // This is the request. It calls the endpoint you write in lesson 3, and
  // stores what comes back, which is what puts it on screen.
  const getAnimals = async () => {
    const response = await fetch("/api/get-all-animals");
    if (!response.ok) return setFailed(true);
    setFailed(false);
    setAnimals(await response.json());
  };

  useEffect(() => {
    getAnimals();
  }, []);

  return (
    <>
      <section>
        <h2>How to run it</h2>
        <ol>
          <li>
            Write the GET endpoint in the LESSON 3 section of{" "}
            <code>server/src/index.js</code>.
          </li>
          <li>
            Restart the server: <code>npm start</code> in <code>server/</code>.
          </li>
          <li>Press Load, or refresh the page.</li>
        </ol>
        <p className="note">
          No POST here. This lesson only reads.
        </p>
        <button onClick={getAnimals}>Load</button>
      </section>

      <section>
        <h2>On the page</h2>
        {failed ? (
          <p className="empty">
            404. The endpoint is not written yet, or the server needs
            restarting.
          </p>
        ) : animals.length === 0 ? (
          <p className="empty">Nothing came back.</p>
        ) : (
          <ul>
            {animals.map((animal) => (
              <li key={animal.id}>
                <strong>{animal.name}</strong>, {animal.lives_in}
                {animal.can_fly ? <span className="tag">can fly</span> : null}
              </li>
            ))}
          </ul>
        )}
      </section>
    </>
  );
}

export default LessonThree;
