// LESSON 2.  Sending data in, seen from the client side.
//
// The endpoint this talks to is the one written in lesson 2. Sending it from a
// form rather than Postman is the same request: a POST, with a JSON body, and
// a header saying that is what it is.

import { useState } from "react";

function Form() {
  const [name, setName] = useState("");
  const [livesIn, setLivesIn] = useState("");
  const [reply, setReply] = useState("");

  // fetch defaults to GET, so a POST has to say so. The body has to be a
  // string, which is what JSON.stringify is for, and Content-Type is what
  // tells express.json on the other end to parse it.
  //
  // Without that header the body still arrives, but nothing reads it and
  // req.body comes out empty.
  const addAnimal = async (event) => {
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

    setReply(await response.text());
  };

  return (
    <section>
      <h2>Add one</h2>
      <form onSubmit={addAnimal}>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="name"
          required
        />
        <input
          value={livesIn}
          onChange={(event) => setLivesIn(event.target.value)}
          placeholder="lives in"
        />
        <button type="submit">Send</button>
      </form>

      {reply ? <p className="reply">{reply}</p> : null}
      <p className="hint">Refresh to see it in the list above.</p>
    </section>
  );
}

export default Form;
