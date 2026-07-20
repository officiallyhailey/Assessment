// LESSON 2.  The POST endpoint, written in server/src/index.js.

import { useState, useEffect } from "react";
import { Table } from "./LessonOne.jsx";

function LessonTwo() {
  const [rows, setRows] = useState([]);
  const [name, setName] = useState("");
  const [livesIn, setLivesIn] = useState("");
  const [reply, setReply] = useState("");
  const [failed, setFailed] = useState(false);

  // The GET is already written for you. It is here so you can see whether the
  // POST you write actually saved anything. Writing one yourself is lesson 3.
  const load = async () => {
    const response = await fetch("/api/animals");
    if (response.ok) setRows(await response.json());
  };

  useEffect(() => {
    load();
  }, []);

  const send = async (event) => {
    event.preventDefault();

    const response = await fetch("/api/add-one-animal", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name,
        category: "Mammal",
        can_fly: false,
        lives_in: livesIn,
      }),
    });

    if (response.status === 404) {
      setFailed(true);
      setReply("");
      return;
    }

    setFailed(false);
    setReply(await response.text());
    load();
  };

  return (
    <>
      <section>
        <h2>How to run it</h2>
        <ol>
          <li>
            Write the POST endpoint in the LESSON 2 section of{" "}
            <code>server/src/index.js</code>.
          </li>
          <li>
            Restart the server: <code>npm start</code> in <code>server/</code>.
          </li>
          <li>Fill in the form below and press Send.</li>
        </ol>
        <p className="note">
          This lesson uses <code>lesson_animals</code>, which is already filled
          in, so lesson 1 does not have to have been done first.
        </p>
        <p className="note">
          The list underneath uses a GET that is already written, so a new row
          appearing there is proof the POST saved rather than just replied.
        </p>
      </section>

      <section>
        <h2>Send one</h2>
        <form onSubmit={send}>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="name"
            required
          />
          <input
            value={livesIn}
            onChange={(e) => setLivesIn(e.target.value)}
            placeholder="lives in"
          />
          <button type="submit">Send</button>
        </form>

        {failed && (
          <p className="empty">
            404. The endpoint is not written yet, or the server needs
            restarting.
          </p>
        )}
        {reply && <p className="reply">{reply}</p>}
      </section>

      <section>
        <h2>What is in the table</h2>
        <Table rows={rows} />
      </section>
    </>
  );
}

export default LessonTwo;
