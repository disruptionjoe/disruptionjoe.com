# RUN-20260724 Thinking Directional Wayfinding

## Bottom line

Desktop doorway signs now show the correct destination from both directions
instead of exposing mirrored backs or one-way labels.

## Implemented

- Added independent front- and reverse-facing sign surfaces to the shared
  vertical and horizontal portal builders.
- Labeled the reverse side of the Orientation entrances as `Orientation
  Hallway`.
- Added paired `Support Systems` / `Work With Joe` and `Support Systems` /
  `Control Room` signs at the two Support Systems thresholds.
- Added paired `Methods and Tools` / `Work With Joe`, `Development Laboratory`
  / `Discover`, and `Church of AI` / `Discover` signs.
- Added paired `Who Is Joe` / `Work With Joe` wayfinding at the lower hallway
  connection and `Who Is Joe` / `Elevator Hallway` at the identity gallery.
- Preserved the Church approach sign on its incoming side and added
  `Orientation Hallway` to its return-facing side.
- Preserved room geometry, walkability, exhibits, interactions, and mobile
  behavior.

## Validation

- `npm test`
- `git diff --check`
