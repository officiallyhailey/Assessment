// The same helpers, backed by a JSON file instead of Postgres.
//
// NOT THE TEACHING VERSION. animals-helpers.js is the one the lessons show and
// the one that matches the class project. This exists only so a dead network
// cannot cancel a session: `npm run dev:offline` swaps it in and everything on
// the site behaves the same.
//
// It keeps the same function names, arguments and return shapes as the real
// one, so index.js cannot tell which it is talking to.

import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const HERE = path.dirname(fileURLToPath(import.meta.url));
const DATA_FILE = path.join(HERE, "animals-data.json");

const ORIGINAL = [
  { id: 1, name: "Lion", category: "Mammal", can_fly: false, lives_in: "Savanna", population: 23000 },
  { id: 2, name: "Penguin", category: "Bird", can_fly: false, lives_in: "Antarctica", population: 1200000 },
  { id: 3, name: "Eagle", category: "Bird", can_fly: true, lives_in: "Mountains", population: 5000 },
];

const read = async () => JSON.parse(await fs.readFile(DATA_FILE, "utf8"));
const write = (animals) => fs.writeFile(DATA_FILE, JSON.stringify(animals, null, 2) + "\n");

export async function getAllAnimals() {
  const animals = await read();
  return animals.sort((a, b) => a.id - b.id);
}

export async function getOneAnimalById(id) {
  const animals = await read();
  // A route parameter always arrives as text, so it is compared as a number.
  return animals.find((animal) => animal.id === Number(id));
}

export async function addOneAnimal(name, category, can_fly, lives_in) {
  const animals = await read();

  // Standing in for SERIAL, which is what assigns the id in the real version.
  const nextId = animals.length > 0 ? Math.max(...animals.map((a) => a.id)) + 1 : 1;

  const newAnimal = { id: nextId, name, category, can_fly, lives_in, population: null };
  animals.push(newAnimal);
  await write(animals);

  return newAnimal;
}

export async function resetAnimals() {
  await write(ORIGINAL);
  return ORIGINAL;
}

// TOPIC 1. The client_form rows, fixed. Topic 1 only reads them.
export async function getAllClientForm() {
  return [
    { id: 1, name: "Maya", age: 34, state: "Oregon", mood: "anxious", first_visit: true, checked_in_on: "2026-02-10" },
    { id: 2, name: "Daniel", age: 41, state: "California", mood: "hopeful", first_visit: false, checked_in_on: "2026-02-11" },
    { id: 3, name: "Priya", age: 29, state: "New York", mood: "tired", first_visit: true, checked_in_on: "2026-02-12" },
  ];
}
