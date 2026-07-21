// The page itself. It holds the heading and drops ClientList underneath, which is where the clients show up.

import ClientList from "./pages/ClientList.jsx";
import "./App.css";

function App() {
  return (
    <main>
      <h1>Checked in today</h1>
      <p className="sub">Everything below comes from the database.</p>
      <ClientList />
    </main>
  );
}

export default App;
