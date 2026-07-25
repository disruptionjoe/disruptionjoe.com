# RUN-20260725 Thinking Support Turn Wireframe

## Bottom line

The Control-side Support Systems turn no longer contains a stray vertical
wireframe edge inside the walkable hallway.

## Implemented

- Replaced the Control-side connection leg's complete box outline with the
  existing joined-box treatment.
- Omitted the two vertical end posts that fall inside the wider cross-hall.
- Preserved the real wall corners, opaque walls, floor and ceiling outline,
  turn geometry, exhibits, lighting, and walkability.

## Validation

- Inspected the turn from the Control-side leg before and after the correction.
- Confirmed the interior vertical line is gone and the physical corner remains.
- Confirmed the normal museum entrance loads without browser errors.
- `npm test`
- `git diff --check`
