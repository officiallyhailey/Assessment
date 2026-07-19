// Lesson 03, a GET request in React.
//
// Page content as data. Blocks render through src/components/Blocks.jsx, and
// `code` is the sample pinned beside the lesson on wide screens. A section may
// carry its own `code`, which takes over the panel while that section is read.
//
// Line notes for the Context and Flow modes live in ../annotations.js, keyed by
// the sample's file name.

export const reactGet = {
    slug: "react-get",
    num: "Lesson 03",
    title: "Send a GET Request in React and Render the Data",
    blurb: "Request data from an API and display it in a React component.",
    tags: ["fetch", "useState", "useEffect"],
    lede: "This lesson covers how a React component requests data from an API, stores it, and displays it on the screen.",
    code: [
        {
            name: "AnimalList.jsx",
            // Try it runs this exact flow inside the panel, so the two renders
            // can be watched next to the code that causes them.
            try: "fetch",
            code: `import { useState, useEffect } from "react";

function AnimalList() {
const [animals, setAnimals] = useState([]);

const getAnimals = async () => {
    const response = await fetch(
        "/get-all-animals"
    );
    const data = await response.json();
    setAnimals(data);
};

useEffect(() => {
    getAnimals();
}, []);

return (
    <ul>
        {animals.map((animal) => (
            <li key={animal.id}>
                {animal.name}, {animal.lives_in}
            </li>
        ))}
    </ul>
);
}`,
        },
    ],
    sections: [
        {
            id: "overview",
            label: "Overview",
            heading: "Getting data onto the screen",
            blocks: [
                { type: "p", text: "A React [[component]] is a function that returns what should appear on the screen. The awkward part is that data kept on a server does not arrive instantly, and the screen cannot wait." },
                {
                    type: "figure",
                    src: "/topic3.png",
                    alt: "The same page twice: first with nothing in it, then again with three animals listed",
                    caption: "The numbers are the three steps below, in the order they happen.",
                },
                {
                    type: "olist",
                    steps: true,
                    items: [
                        "The page appears straight away, with nothing in it yet.",
                        "The data is asked for, and takes a moment to come back.",
                        "The page appears again, this time with the list.",
                    ],
                },
                { type: "p", text: "That is the whole lesson. The same page is drawn twice, and each piece of code below exists to make one of those three things happen." },
                {
                    type: "more",
                    label: "Drawing twice is correct, and it is not something to fix",
                    blocks: [
                        { type: "p", text: "It is what lets the page appear immediately instead of sitting blank until the server replies. A page that waited would look broken on a slow connection." },
                        { type: "p", text: "It does mean the first drawing has to cope with having no data yet, which is a real constraint the code has to respect rather than a detail." },
                    ],
                },
                {
                    type: "more",
                    label: "Drawing the screen is called rendering, and it happens more than you would think",
                    blocks: [
                        { type: "p", text: "A [[render]] is React working out what should be on screen and putting it there. The component function runs once per render, top to bottom." },
                        { type: "p", text: "It renders when it first appears, and again whenever the data it is holding changes. Nothing else makes it render, which is why storing the data matters so much." },
                    ],
                },
            ],
        },
        {
            id: "code",
            label: "Storing and requesting",
            heading: "The first two of the three tools",
            blocks: [
                { type: "p", text: "The component is four parts, and the first two are about getting hold of the data: somewhere to keep it, and the request that goes and gets it." },
                { type: "coderef" },
                {
                    type: "focus",
                    title: "Line 1",
                    file: "AnimalList.jsx",
                    lines: [1],
                    blocks: [
                        { type: "h", text: "Bringing in the tools" },
                        { type: "p", text: "The two [[hook|hooks]] this component needs, loaded from React before anything else happens." },
                    ],
                },
                {
                    type: "focus",
                    title: "Lines 3 and 4",
                    file: "AnimalList.jsx",
                    lines: "3-4",
                    blocks: [
                        { type: "h", text: "1. Storing the data" },
                        { type: "p", text: "useState is the first of the three tools. It creates a place to keep the animals as [[state]], starting as an empty [[array]] because there is no data yet." },
                        {
                            type: "more",
                            label: "State is a value the component keeps between renders",
                            blocks: [
                                { type: "p", text: "The component function runs again on every render, so an ordinary variable inside it is created fresh each time and whatever it held is gone." },
                                { type: "p", text: "State survives that. React keeps it outside the function and hands it back on each render, which is the only reason the animals are still there the second time around." },
                            ],
                        },
                        {
                            type: "more",
                            label: "It hands back two things: the value, and a function to change it",
                            blocks: [
                                { type: "p", text: "The current value is animals, and the function to update it is setAnimals. Calling that function is what makes the component [[render]] again with the new value." },
                                { type: "p", text: "A normal variable would not do the job. It is created again every time the component runs, so the value would be lost, and changing it does not tell React to update the screen. useState solves both." },
                            ],
                        },
                        {
                            type: "more",
                            label: "Starting as an empty array, rather than nothing, is deliberate",
                            blocks: [
                                { type: "p", text: "The first render happens before any data exists, and it still has to produce something." },
                                { type: "p", text: "An empty array passes through map quietly and produces an empty list. Starting as null instead would crash on that first render, because null has no map." },
                            ],
                        },
                    ],
                },
                {
                    type: "focus",
                    title: "Lines 6 to 12",
                    file: "AnimalList.jsx",
                    lines: "6-12",
                    blocks: [
                        { type: "h", text: "2. Requesting the data" },
                        { type: "p", text: "fetch is the second tool. It sends the request to the endpoint, and this function reads the reply and stores the result." },
                        {
                            type: "more",
                            label: "It takes two steps, and the second one is easy to forget",
                            blocks: [
                                { type: "p", text: "fetch hands back a response, which describes the reply but is not the data itself. response.json() reads the body of that response and turns it into something you can use." },
                                { type: "p", text: "Both are slow, so both need await. Miss the second and you are holding a response object, wondering why the list will not display." },
                            ],
                        },
                        {
                            type: "more",
                            label: "Calling setAnimals is what puts the list on screen",
                            blocks: [
                                { type: "p", text: "Nothing about fetching data updates the page by itself. The request finishes, the data sits in a variable, and the screen carries on showing whatever it showed before." },
                                { type: "p", text: "Storing it in state is the step that asks React to render again. That is the whole reason the data is kept in useState rather than an ordinary variable." },
                            ],
                        },
                    ],
                },
            ],
        },
        {
            id: "showing",
            label: "Running it and showing it",
            heading: "What makes it happen, and what appears",
            blocks: [
                { type: "p", text: "The store and the request both exist now, but nothing has called either one. These last two parts are what set it running and what a person actually sees." },
                {
                    type: "focus",
                    title: "Lines 14 to 16",
                    file: "AnimalList.jsx",
                    lines: "14-16",
                    blocks: [
                        { type: "h", text: "3. Running it on page load" },
                        { type: "p", text: "useEffect is the third tool. It runs the request as an [[effect]], after the component has appeared, and the empty brackets mean run once." },
                        {
                            type: "more",
                            label: "useState and useEffect are both Hooks, which is why they look alike",
                            blocks: [
                                { type: "p", text: "A [[hook]] is a built in function giving a component an ability it would not otherwise have: somewhere to keep a value between renders, and a way to run code at a chosen moment." },
                                { type: "p", text: "They are always called at the top of the component, never inside an if or a loop. React keeps track of them by the order they run in, so that order has to be identical on every render." },
                            ],
                        },
                        {
                            type: "note",
                            label: "Careful",
                            warn: true,
                            text: "Leaving off the empty brackets makes useEffect run after every render. The request updates the data, updating the data renders again, and that renders forever.",
                        },
                        {
                            type: "more",
                            label: "Why the request is not just written in the component body",
                            blocks: [
                                { type: "p", text: "Code written directly in the component runs every single render, so a request there would fire on every update, including the ones it caused itself." },
                                { type: "p", text: "An effect runs after the render is on screen and only when you say so. That separation is what the empty brackets are controlling." },
                            ],
                        },
                    ],
                },
                {
                    type: "focus",
                    title: "Lines 18 to 26",
                    file: "AnimalList.jsx",
                    lines: "18-26",
                    blocks: [
                        { type: "h", text: "4. Displaying the data" },
                        { type: "p", text: "Everything inside the return is [[jsx|JSX]], and map turns the array into one list item per animal." },
                        {
                            type: "more",
                            label: "JSX looks like HTML, and the curly braces are the way back into JavaScript",
                            blocks: [
                                { type: "p", text: "It is the syntax React uses to describe what appears on screen. Anything inside curly braces is worked out as JavaScript and its result dropped into place." },
                                { type: "p", text: "That is why the list items are written inside braces: map is a piece of JavaScript producing elements, not markup you could type out by hand." },
                            ],
                        },
                        {
                            type: "more",
                            label: "Each item needs a key, and the database id is the right one to use",
                            blocks: [
                                { type: "p", text: "A [[key]] is a unique value React uses to tell items apart between renders, so it can change just the ones that moved rather than rebuilding the whole list." },
                                { type: "p", text: "The id from the database is ideal because it is already unique and does not change. Using the position in the array instead breaks as soon as the list is reordered or something is removed." },
                            ],
                        },
                    ],
                },
                {
                    type: "focus",
                    file: "AnimalList.jsx",
                    lines: "1-27",
                    try: true,
                    blocks: [
                        { type: "h", text: "Watch it render twice" },
                        { type: "p", text: "Switch the code panel to Try it. The counter shows the component rendering once with no data, then again once the data arrives." },
                    ],
                },
            ],
        },
        {
            id: "network",
            label: "The Network tab",
            heading: "Checking the request worked",
            blocks: [
                { type: "p", text: "The [[network tab|Network tab]] lists every request the page sends, so you can confirm one went out and see what came back." },
                {
                    type: "olist",
                    items: [
                        "Open developer tools and select the Network tab, then reload the page.",
                        "Find the request by name in the list. Filtering to Fetch or XHR hides images and stylesheets.",
                        "Check the status, then open it and select Response to see the data.",
                    ],
                },
                {
                    type: "table",
                    head: ["What you see", "What it means"],
                    rows: [
                        ["200 and the expected data", "The request worked, so any problem is in how the data is used"],
                        ["304", "It worked. Nothing changed, so the browser reused what it already had"],
                        ["404", "The URL is wrong, or the endpoint does not exist"],
                        ["500", "The server was reached but something failed inside it"],
                        ["No request listed", "The code never ran, so check useEffect"],
                    ],
                    mono: [0],
                },
                { type: "p", text: "This one check tells you whether a problem is in the frontend or the backend, which saves a lot of guessing." },
                {
                    type: "more",
                    label: "304 is a success, even though it is not 200",
                    blocks: [
                        { type: "p", text: "It means Not Modified. When the server first sent this data it attached a tag identifying that exact version. The browser kept both." },
                        { type: "p", text: "Next time it asks for the same thing it sends the tag along, meaning: only send it if it is not still this one. If nothing has changed the server replies 304 with an empty body, and the browser hands your code the copy it already had." },
                        { type: "p", text: "So the data still arrives, and your code never notices the difference. Only the Network tab shows the 304, because only the Network tab is watching the wire. It appears on a second load rather than the first, and ticking Disable cache forces a full 200 every time, which is worth doing while debugging." },
                    ],
                },
                {
                    type: "more",
                    label: "Why the numbers in the Network tab will not match the ones in Try it",
                    blocks: [
                        { type: "p", text: "They are measuring different things, and neither is wrong." },
                        {
                            type: "table",
                            head: ["Column", "Try it shows", "The Network tab shows"],
                            rows: [
                                ["Status", "What JavaScript sees, so 200 even on a 304", "What crossed the wire, so 304 when cached"],
                                ["Size", "Characters of JSON after parsing", "Bytes actually transferred, headers included, in kB"],
                                ["Time", "The whole call, including reading the body", "The network portion only"],
                            ],
                        },
                        { type: "p", text: "The Initiator column is worth a look too. On this page it says api.js, because these demos call the endpoint through one shared file rather than writing fetch in each component. In your own project it would name the file you wrote it in." },
                    ],
                },
            ],
        },
        {
            id: "check",
            label: "Check your understanding",
            heading: "Questions to try",
            blocks: [
                {
                    type: "qa",
                    items: [
                        [
                            "Why does the component display twice?",
                            "Because the request takes time and the component does not wait for it. It displays immediately with no data, then displays again once the data has been stored.",
                        ],
                        [
                            "What do the empty brackets at the end of useEffect do?",
                            "They mean the code runs once, when the component first appears. Without them it runs after every update, which causes an endless loop of requests.",
                        ],
                        [
                            "Why is there a second await for response.json()?",
                            "fetch gives back a response, not the data. Reading the content of that response and converting it is a separate step that also takes time.",
                        ],
                        [
                            "Why does useState start as an empty array?",
                            "So the component has something valid to display before the data arrives. map on an empty array displays nothing, where starting with no value at all would cause an error.",
                        ],
                        [
                            "Nothing appears on the screen. Where do you look first?",
                            "The Network tab. If no request was sent, the problem is in useEffect. If it returned an error, the problem is the URL or the server. If it returned the data correctly, the problem is in how the data is stored or displayed.",
                        ],
                    ],
                },
            ],
        },
        {
            id: "next",
            label: "Going further",
            heading: "Useful things to learn next",
            code: [
                {
                    name: "with-states.jsx",
                    result: { kind: "screen", caption: "After the loading message clears.", title: "Animals" },
                    code: `function AnimalList() {
const [animals, setAnimals] = useState([]);
const [loading, setLoading] = useState(true);
const [error, setError] = useState(null);

const getAnimals = async () => {
    try {
        const response = await fetch(
            "/get-all-animals"
        );
        if (!response.ok) {
            throw new Error("Request failed");
        }
        setAnimals(await response.json());
    } catch (err) {
        setError(err.message);
    } finally {
        setLoading(false);
    }
};

useEffect(() => {
    getAnimals();
}, []);

if (loading) return <p>Loading...</p>;
if (error) return <p>Something went wrong.</p>;

return (
    <ul>
        {animals.map((animal) => (
            <li key={animal.id}>{animal.name}</li>
        ))}
    </ul>
);
}`,
                },
                {
                    name: "sending-data.jsx",
                    try: "one",
                    code: `// Sending a new animal to the server
const addAnimal = async (newAnimal) => {
const response = await fetch("/add-one-animal", {
    method: "POST",
    headers: {
        "Content-Type": "application/json"
    },
    body: JSON.stringify(newAnimal),
});

const saved = await response.json();
setAnimals([...animals, saved]);
};

// Asking for one record instead of all of them
const [animal, setAnimal] = useState(null);

const getOneAnimal = async (id) => {
const response = await fetch(
    \`/get-one-animal-by-id/\${id}\`
);
setAnimal(await response.json());
};`,
                },
            ],
            blocks: [
                { type: "p", text: "The code alongside shows these written out, with the parts you already know still in place." },
                { type: "coderef" },
                {
                    type: "focus",
                    title: "with-states.jsx, lines 2 to 4",
                    file: "with-states.jsx",
                    lines: "1-4",
                    blocks: [
                        { type: "h", text: "Loading and error messages" },
                        {
                            type: "p",
                            text: "The simple version assumes the request always works. Real pages keep two more pieces of [[state]]: still running, and failed.",
                        },
                        {
                            type: "more",
                            label: "loading starts as true, which is not an accident",
                            blocks: [
                                {
                                    type: "p",
                                    text: "The request begins immediately, so the component is already loading by the time anything is drawn. Starting as false would flash an empty list before the message appeared.",
                                },
                                {
                                    type: "p",
                                    text: "error starts as null, meaning nothing has gone wrong yet, which is different from an empty message.",
                                },
                            ],
                        },
                    ],
                },
                {
                    type: "focus",
                    title: "with-states.jsx, lines 6 to 24",
                    file: "with-states.jsx",
                    lines: "6-24",
                    blocks: [
                        { type: "h", text: "Handling a failure" },
                        { type: "p", text: "try holds the risky part, catch deals with a failure, and finally runs either way." },
                        {
                            type: "more",
                            label: "A failed request still returns a response, so response.ok has to be checked",
                            blocks: [
                                {
                                    type: "p",
                                    text: "fetch only rejects when the request could not be made at all, such as the network being down. A 404 or a 500 arrives as a perfectly ordinary response.",
                                },
                                {
                                    type: "p",
                                    text: "That is why line 11 checks response.ok and throws if it is false. Without it, an error page would be handed to the list as though it were data.",
                                },
                            ],
                        },
                        {
                            type: "more",
                            label: "finally is the right place to switch loading off",
                            blocks: [
                                { type: "p", text: "It runs whether the request worked or failed, so the loading message clears in both cases." },
                                {
                                    type: "p",
                                    text: "Putting it only in the success path is a common bug: the page sits on a loading message forever whenever anything goes wrong.",
                                },
                            ],
                        },
                    ],
                },
                {
                    type: "focus",
                    title: "with-states.jsx, lines 26 to 36",
                    file: "with-states.jsx",
                    lines: "26-36",
                    blocks: [
                        { type: "h", text: "Three possible screens" },
                        {
                            type: "p",
                            text: "The component now returns early for loading and for error, so the list below is only reached when there is data and nothing went wrong.",
                        },
                    ],
                },
                {
                    type: "focus",
                    title: "sending-data.jsx, lines 1 to 13",
                    file: "sending-data.jsx",
                    lines: "1-13",
                    blocks: [
                        { type: "h", text: "Sending data to the server" },
                        { type: "p", text: "The same fetch, with a second argument that turns it from a read into a write." },
                        {
                            type: "more",
                            label: "Data can only travel as text, which is what JSON.stringify is for",
                            blocks: [
                                {
                                    type: "p",
                                    text: "An object cannot go across a network as it is, so it has to be converted first. JSON.stringify does that, and response.json() does the reverse when data comes back.",
                                },
                                {
                                    type: "p",
                                    text: "The Content-Type header is the other half of the deal. It tells the server the text is JSON, which is what makes the server parse it rather than ignore it.",
                                },
                            ],
                        },
                        {
                            type: "more",
                            label: "The reply is added to the list, rather than fetching everything again",
                            blocks: [
                                {
                                    type: "p",
                                    text: "The server sends back the saved record, id included, so the new item can be put straight into state alongside the ones already there.",
                                },
                                {
                                    type: "p",
                                    text: "Asking the server for the whole list again would also work, but it is a second request for something you have already been given.",
                                },
                            ],
                        },
                    ],
                },
                {
                    type: "focus",
                    title: "sending-data.jsx, lines 15 to 23",
                    file: "sending-data.jsx",
                    lines: "15-23",
                    try: true,
                    blocks: [
                        { type: "h", text: "Requesting one record instead of all of them" },
                        {
                            type: "p",
                            text: "A path can carry a placeholder, so /get-one-animal-by-id/3 asks for the record with id 3. Switch the panel to Try it and watch the URL change with the id.",
                        },
                        {
                            type: "more",
                            label: "One record changes three small things",
                            blocks: [
                                { type: "p", text: "The backticks build the URL so the id can change from one call to the next." },
                                {
                                    type: "p",
                                    text: "Storage starts as null rather than an empty [[array]], because one record is a single object rather than a list. There is no map either, since there is only one item to display.",
                                },
                            ],
                        },
                    ],
                },
                { type: "h", text: "Practice" },
                {
                    type: "list",
                    items: [
                        "Add a loading message that shows until the data arrives.",
                        "Remove the empty brackets from useEffect, watch the Network tab, then put them back.",
                        "Display more than one value from each animal in the list.",
                    ],
                },
            ],
        },
    ],
};
