# RUN-20260803 Thinking Real-Work Display Spacing

## Bottom line

“Make AI capability show up in real work” is now centered by visible edge
spacing between the fixed consequential-decision display and the Methods
hallway.

## Implemented

- Kept “Make a consequential AI decision” fixed at its approved position.
- Shifted only the real-work product display slightly left along the same south
  wall.
- Calculated the new center from the scaled display width so the open edge gap
  between the two displays equals the open edge gap before the hallway.
- Preserved all product copy, CTAs, proximity behavior, room assignments,
  circulation, other desktop placements, and mobile ordering.

## Validation

- Confirmed both target edge gaps resolve to `0.671` scene units.
- Confirmed the consequential-decision display remains at `x=8.45`.
- Confirmed the real-work display remains fully inside the solid wall segment
  and clear of the Methods hallway.
- Confirmed no other exhibit placement changed.
- `npm test`
- `git diff --check`
