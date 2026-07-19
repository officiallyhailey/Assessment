// The page. Nothing here is written during a lesson: it is the frame that holds
// AnimalList, which is the file you do write.

import AnimalList from "./AnimalList.jsx";

function App() {
  return (
    <main>
      <h1>Animals</h1>
      <p className="sub">Lesson 3. The list below comes from the database.</p>
      <AnimalList />
    </main>
  );
}

export default App;
