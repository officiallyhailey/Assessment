/**
 * The demo panels talk to the same check-in API the students will build, so
 * what they see on the page is what they would see in their own project.
 *
 * The /api prefix is stripped by Vite before the request reaches the server
 * (see vite.config.js), which is the arrangement the class project uses. The
 * server itself has no idea the prefix exists.
 *
 * Every call reports how long it took, because the timing is part of the
 * lesson: a request is not instant, which is exactly why React renders twice.
 */

const CLIENT_FORM = "/api/client-form";
const ALL_CLIENTS = "/api/get-all-clients";
const ONE_CLIENT = "/api/get-one-client-by-id";
const ADD_CLIENT = "/api/add-one-client";
const RESET_CLIENT_FORM = "/api/reset-client-form";

/** Wraps a request so callers get timing and errors in one predictable shape. */
async function timed(run) {
    const started = performance.now();
    try {
        const result = await run();
        return { ...result, ms: Math.round(performance.now() - started), failed: false };
    } catch {
        return { ms: 0, failed: true };
    }
}

/** Every row of client_form. Behind the topic 1 SQL demo and the topic 2 list. */
export function getAllClientForm() {
    return timed(async () => {
        const response = await fetch(CLIENT_FORM);
        if (!response.ok) throw new Error(`server responded ${response.status}`);
        const data = await response.json();
        return { data, status: response.status, size: JSON.stringify(data).length };
    });
}

/** Every checked-in client, behind the lesson 3 fetch/render demo. */
export function getAllClients() {
    return timed(async () => {
        const response = await fetch(ALL_CLIENTS);
        if (!response.ok) throw new Error(`server responded ${response.status}`);
        const data = await response.json();
        return { data, status: response.status, size: JSON.stringify(data).length };
    });
}

/** One client by id, the route-parameter demo. `id` stays a string, as it would in a URL. */
export function getClientById(id) {
    const url = `${ONE_CLIENT}/${id}`;
    return timed(async () => {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`server responded ${response.status}`);
        const data = await response.json();
        return { data, status: response.status, url };
    });
}

/** Checks a client in. Returns the server's reply as text, since the endpoint uses res.send. */
export function addClient(body) {
    return timed(async () => {
        const response = await fetch(ADD_CLIENT, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        return { text: await response.text(), status: response.status };
    });
}

/** Puts client_form back to the original three. Not something a student writes. */
export function resetClientForm() {
    return timed(async () => {
        const response = await fetch(RESET_CLIENT_FORM, { method: "POST" });
        if (!response.ok) throw new Error(`server responded ${response.status}`);
        const data = await response.json();
        return { data, status: response.status };
    });
}
