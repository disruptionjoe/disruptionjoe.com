# RUN-20260727 Thinking Graveyard Scenery

## Bottom line

The desktop Graveyard now reads as a landscaped cemetery rather than an empty
field while preserving the four reserved repository markers as its primary
objects.

## Implemented

- Added a low black-and-tan perimeter fence with a wide opening aligned to the
  approach hallway.
- Added a small solid mausoleum in the rear-left corner with a peaked roof,
  arched doorway, columns, steps, restrained edge lighting, and walking
  clearance.
- Added six low, flush grave markers distributed between the standing reserved
  displays.
- Added thirteen sparse clusters of muted grass using one lightweight line
  geometry.
- Kept the central path and the activation space around all four reserved
  repository markers clear.
- Kept every new scenic object decorative and non-interactive.
- Kept the mobile experience unchanged.

## Validation

- Confirmed all scenery remains inside the existing Graveyard footprint.
- Confirmed the fence entrance aligns with the hallway center.
- Confirmed the mausoleum collision radius does not overlap a reserved display.
- `npm test`
- `git diff --check`
