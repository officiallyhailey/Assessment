// The page. Home shows what lesson 3 built, Form shows what lesson 2 built.

import Home from "./pages/Home.jsx";
import Form from "./pages/Form.jsx";
import "./App.css";

function App() {
  return (
    <main>
      <h1>Animals</h1>
      <p className="sub">
        The list is a GET. The form is a POST. Both talk to the same table.
      </p>

      <Home />
      <Form />
    </main>
  );
}

export default App;
