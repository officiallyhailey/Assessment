// Pick a lesson. Each page says how to run it and shows what comes back.

import { useState } from "react";
import LessonOne from "./pages/LessonOne.jsx";
import LessonTwo from "./pages/LessonTwo.jsx";
import LessonThree from "./pages/LessonThree.jsx";
import "./App.css";

const LESSONS = [
  { n: 1, label: "Create a table", Page: LessonOne },
  { n: 2, label: "POST", Page: LessonTwo },
  { n: 3, label: "GET", Page: LessonThree },
];

function App() {
  const [open, setOpen] = useState(1);
  const { Page } = LESSONS.find((l) => l.n === open);

  return (
    <main>
      <header>
        <h1>Live lesson</h1>
        <nav>
          {LESSONS.map((l) => (
            <button
              key={l.n}
              className={l.n === open ? "on" : ""}
              onClick={() => setOpen(l.n)}
            >
              <span className="num">{l.n}</span>
              {l.label}
            </button>
          ))}
        </nav>
      </header>

      <Page />
    </main>
  );
}

export default App;
