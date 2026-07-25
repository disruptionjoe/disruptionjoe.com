# RUN-20260725 Thinking Graveyard Wing

## Bottom line

The desktop Thinking Museum now includes a Graveyard branch from the rear-right
side of Church of AI for repositories that eventually leave active use.

## Implemented

- Added a paired `Graveyard` / `Church of AI` threshold beside the Church's
  social display.
- Added a short enclosed passage that turns left into a long opaque,
  wireframed hallway.
- Opened the far end of the hallway onto a large flat exterior field without
  room walls.
- Added four scattered tombstone-shaped reserved markers. They continuously
  face the visitor like the CapacityOS placard, but have no exhibit interaction,
  project identity, or repository link while no work is retired.
- Added walking bounds and solid fixture clearance for the new route and
  markers.
- Kept the mobile museum and every existing exhibit unchanged.

## Validation

- Inspected the new threshold from inside Church of AI.
- Inspected the short passage, left turn, long hallway, and open-field reveal.
- Confirmed all four markers face the camera from the graveyard entrance.
- Confirmed the normal desktop museum entrance loads without browser errors.
- `npm test`
- `git diff --check`
