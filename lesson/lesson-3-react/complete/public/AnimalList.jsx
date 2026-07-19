const { useState, useEffect } = React;

function AnimalList() {
    // -----------------------------------------------------------------------
    // STEP 1.  Hold the animals.
    //
    // useState creates a value the component remembers between redraws. It
    // hands back two things: the current value, and the function that updates
    // it. Calling that function is also what tells React to draw again.
    //
    // It starts as an empty array on purpose. map works fine on an empty array
    // and shows nothing, where starting with no value at all would
    // throw on the very first render, before any data could possibly exist.
    // -----------------------------------------------------------------------
    const [animals, setAnimals] = useState([]);

    // -----------------------------------------------------------------------
    // STEP 2.  Fetch them.
    //
    // Two awaits, because there are two separate waits. The first resolves
    // once the server responds, and hands back a Response object describing
    // the reply. That is not the data yet. response.json() reads the body and
    // turns it into a real array, which is the second wait.
    //
    // setAnimals is the line that puts it on screen: storing the data is what
    // asks React to draw the component again.
    // -----------------------------------------------------------------------
    const getAnimals = async () => {
        const response = await fetch("/get-all-animals");
        const data = await response.json();
        setAnimals(data);
    };

    // -----------------------------------------------------------------------
    // STEP 3.  Run it once, when the page loads.
    //
    // useEffect runs code AFTER the component has drawn. Fetching directly in
    // the body of the component would run during the draw, and storing the
    // result would cause another draw, which would fetch again, forever.
    //
    // The empty array at the end is the dependency list. Empty means run once.
    // Leave it off entirely and you get exactly that endless loop, which is
    // worth causing on purpose with the Network tab open.
    // -----------------------------------------------------------------------
    useEffect(() => {
        getAnimals();
    }, []);

    // -----------------------------------------------------------------------
    // STEP 4.  Show them.
    //
    // Everything returned here is JSX. It reads like HTML and it is
    // JavaScript. The curly braces are the door back into JavaScript, which is
    // why map sits inside them.
    //
    // map is the ordinary array method, not a React feature. It turns each
    // animal into one list item, and JSX renders an array of elements by
    // drawing each in turn.
    //
    // key is a stable id per item so React can tell them apart between draws.
    // The database id is ideal, because nothing else shares it and it never
    // changes. Using the array position instead breaks as soon as the list is
    // reordered or filtered.
    //
    // Remember the screen draws TWICE: once here with an empty array, and
    // again once the fetch above has stored the data. That is not a bug, it is
    // what lets the page appear instantly instead of freezing until the server
    // answers.
    // -----------------------------------------------------------------------
    return (
        <ul>
            {animals.map((animal) => (
                <li key={animal.id}>
                    <strong>{animal.name}</strong>, {animal.lives_in}
                    {animal.can_fly && <span className="tag">can fly</span>}
                </li>
            ))}
        </ul>
    );
}

ReactDOM.createRoot(document.getElementById("root")).render(<AnimalList />);
