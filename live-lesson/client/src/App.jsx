// The page. Given, so there is somewhere for topic 3's list to appear.

import AnimalList from "./pages/AnimalList.jsx";
import "./App.css";

function App() {
  return (
    <main>
      <h1>Animals</h1>
      <p className="sub">Topic 3. The list below comes from the database.</p>
      <AnimalList />
    </main>
  );
}

export default App;
