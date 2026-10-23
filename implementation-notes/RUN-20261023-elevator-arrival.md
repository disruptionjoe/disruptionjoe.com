# Elevator arrival and floor framing

Run: `RUN-20261023-131119-djc-website-elevator-arrival-direct`

Authority: Joe's direct 2026-10-23 interaction, implementation, and publication instruction.

## Delivered update

- Vertical movement now returns every arriving floor to its elevator landing instead of preserving an offscreen room position.
- Elevator doors are driven continuously by vertical travel: open at a floor, closed midway between floors, and open again on arrival.
- The door timing uses the same scroll-position principle as the mobile Thinking Museum.
- Floor entrances now use a narrower, taller, more dimensional doorway frame that more closely matches the mobile museum's elevator proportions.
- Horizontal movement from the elevator into rooms remains unchanged, and direct room links still open their requested room.
- Reduced-motion visitors receive an open, stable doorway without the travel animation.

## Preserved behavior

- The threshold, orientation, reaction wall, Floor Zero, five floors, 21 rooms, collection, inquiry, Meet Joe, and direct navigation remain intact.
- `/thinking/`, `assets/thinking-game.js`, and `assets/thinking-game.css` have no source change.

## Validation and publication

- Repository test suite: 25/25 passed.
- JavaScript syntax, homepage marker, CSS brace balance, whitespace, direct-link behavior contracts, and protected-footprint checks passed.
- The cache-busted production homepage, stylesheet, and interaction script matched the committed local files byte-for-byte.
- The public Thinking Museum route returned successfully after its canonical redirect.
- Published implementation revision: `ebed79b53faedd76499f044dd8efe657eea1686f`.
- Public asset marker: `20261023-elevator-arrival-v1`.

The managed browser-origin policy prevented graphical browser preview and was not bypassed. This remains a visual-QA limitation, not a known functional defect.
