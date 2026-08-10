# Methods and Tools wall swap

Run: `RUN-20260810-120716-djc-website-methods-wall-swap-direct`

## Implemented

- Moved the complete Enhanced Facilitation wall installation to the former tools location on the north wall.
- Moved the pegboard, saw, hammer, pegs, frame, and local light to Enhanced Facilitation's former east-wall location.
- Kept the central workbench, vice, collision footprint, room geometry, other displays, and interaction behavior unchanged.
- Updated the Thinking Experience script cache key so the swap is served immediately after deployment.

## Verification

- `npm test`
- `git diff --check`
- Local desktop visual checks of both destination walls and the room layout.
- Confirmed the Enhanced Facilitation image and placard face into the room.
- Confirmed the restored entrance state and zero browser console errors.

