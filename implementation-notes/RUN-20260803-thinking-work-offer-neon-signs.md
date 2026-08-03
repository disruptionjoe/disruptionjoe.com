# RUN-20260803 Work With Joe Offer Neon Signs

## Bottom line

The two product pairs in Work With Joe now have warm-gold neon framing labels:
“Raise the ceiling” and “Raise the floor.”

## Implemented

- Added “Raise the ceiling” above “Make a consequential AI decision” and
  “Make AI capability show up in real work.”
- Added “Raise the floor” above “Push an important R&D question further” and
  “Turn scattered AI activity into business value.”
- Centered each sign from the existing pair coordinates rather than shifting
  either display.
- Placed both signs in the available upper-wall band between the display tops
  and the ceiling line.
- Reused the existing warm-gold neon drawing language and added restrained
  local glow without changing room architecture or interactions.

## Validation

- Confirmed both signs are centered over their specified pairs.
- Confirmed each sign remains inside its solid wall segment.
- Confirmed the signs span `y=4.085` through `y=5.035`, above the display tops
  at approximately `y=3.854` and below the wall top at `y=5.25`.
- Confirmed all five product placement definitions remain unchanged.
- Confirmed the local WebGL experience renders without browser console errors.
- `npm test`
- `git diff --check`
