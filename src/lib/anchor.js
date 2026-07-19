// Where a popover should sit relative to the thing it explains.
//
// Shared by the glossary words in the prose and the hover explanations in the
// code panel, so the two behave identically. They were separate once: the code
// panel put its explanation in a strip along the bottom, which meant looking
// down and then back up to the word being pointed at.

export const POP_WIDTH = 300;
const GAP = 9;
const EDGE = 12;
const ROOM_ABOVE = 180;

/**
 * Position for a popover anchored to `el`, in viewport coordinates.
 *
 * Sits above when there is room and below when there is not. Anchored by its
 * bottom edge when above, rather than by its top with a transform: the fade-in
 * animates transform, an animation beats a static declaration, and the box
 * would land on top of the thing it is explaining.
 */
export function anchorTo(el, width = POP_WIDTH) {
    if (!el) return null;
    const box = el.getBoundingClientRect();
    const centre = box.left + box.width / 2;
    const left = Math.max(EDGE, Math.min(centre - width / 2, window.innerWidth - width - EDGE));
    const above = box.top > ROOM_ABOVE;

    return {
        left,
        above,
        top: above ? null : box.bottom + GAP,
        bottom: above ? window.innerHeight - box.top + GAP : null,
        // The arrow keeps pointing at the anchor even when the box has been
        // nudged sideways to stay on screen.
        arrow: Math.max(14, Math.min(centre - left, width - 14)),
    };
}
