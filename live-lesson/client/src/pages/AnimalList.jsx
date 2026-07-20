// ███████████████████████████████████████████████████████████████████████████
//
//   TOPIC 3          Send a GET request in React and render the data
//
//   1.  HELPER  getAnimals
//       const response = await fetch("/api/get-all-animals")
//       const data = await response.json()
//       store it with the setter from useState
//
//   2.  STATE  useState, starting as an empty array
//       There is no data on the first render, and an empty array is
//       something map can still run on.
//
//   3.  useEffect(() => { ... }, [])
//       Runs the helper after the first render. The empty array means once.
//
//   4.  RENDER  a <ul>, one <li key={animal.id}> per animal
//
//   Then open the Network tab and reload: the request should be listed, and
//   its response should hold the rows.
//
//   It will appear TWICE, and that is correct. React runs effects twice in
//   development on purpose, to surface bugs like this one being written badly.
//   It happens once in a real build.
//
// ███████████████████████████████████████████████████████████████████████████

function AnimalList() {
  // write it here

  return <p className="empty">Nothing here yet. Start at step 1.</p>;
}

export default AnimalList;
