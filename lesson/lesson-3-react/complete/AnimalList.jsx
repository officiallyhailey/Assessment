// TOPIC 3
// The component that fetches the animals and puts them on screen.
//
// This is the code to read and talk through. The running version of it is in
// public/index.html, which uses the same three steps without a build step.

import { useState, useEffect } from "react";

function AnimalList() {
    // 1. Somewhere to keep the data. Starts empty, because none has arrived.
    const [animals, setAnimals] = useState([]);

    // 2. The request itself.
    const getAnimals = async () => {
        const response = await fetch("/get-all-animals");
        const data = await response.json();
        setAnimals(data);
    };

    // 3. Run it once, when the page loads.
    useEffect(() => {
        getAnimals();
    }, []);

    // 4. Put it on screen.
    return (
        <ul>
            {animals.map((animal) => (
                <li key={animal.id}>
                    {animal.name}, {animal.lives_in}
                </li>
            ))}
        </ul>
    );
}

export default AnimalList;
