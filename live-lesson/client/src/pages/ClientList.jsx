// The component that puts the clients on the page.

import { useState, useEffect } from "react";
import "../App.css";

// ─── TOPIC 3 ──────────────────────────────────────────────────────────
// Notes on each step are in answer-key.js.

function ClientList() {
  // state: the clients, starting as an empty array

const [clients, setClients] = useState([]);

  // get helper function: fetch, read the json, store it

  const getClients = async () => {
  const response = await fetch("/api/get-all-clients");
  const data = await response.json();
  setClients(data);
};

  // useEffect: run the helper once, on page load

useEffect(() => {
  getClients();
}, []);

  // replace the code below: return the list: a <ul>, one <li key={client.id}> per client

return (
  <ul>
    {clients.map((client) => (
      <li key={client.id}>
        <strong>{client.name}</strong> — {client.mood}
        {client.first_visit ? ", first visit" : ""}
      </li>
    ))}
  </ul>
);
}

// ──────────────────────────────────────────────────────────────────────

export default ClientList;
