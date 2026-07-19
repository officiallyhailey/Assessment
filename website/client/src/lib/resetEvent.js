// The reset button lives in the header, but the things that need to react to it
// are scattered across pages. Rather than thread a callback through everything,
// a reset announces itself and whoever cares listens.

const NAME = "animals-reset";

export function announceReset() {
    window.dispatchEvent(new CustomEvent(NAME));
}

/** Runs `fn` whenever the data is reset. Returns the cleanup, for useEffect. */
export function onReset(fn) {
    window.addEventListener(NAME, fn);
    return () => window.removeEventListener(NAME, fn);
}
