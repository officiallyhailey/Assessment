// The page itself. It holds the heading and drops AnimalList underneath,
// which is where the animals show up.

import AnimalList from "./pages/AnimalList.jsx";
import "./App.css";

function App() {
  return (
    <main>
      <h1>Animals</h1>
      <p className="sub">Everything below comes from the database.</p>
      <AnimalList />
    </main>
  );
}

export default App;
