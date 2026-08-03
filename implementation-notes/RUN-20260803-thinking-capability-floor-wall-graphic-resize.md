# RUN-20260803 Raise the Floor Graphic Fit

## Bottom line

The existing Raise the Floor wall graphic is twenty percent smaller and the
complete graphic assembly is centered in its available wall area.

## Change

- Preserved the source PNG and its aspect ratio.
- Reduced the image plane from `2.85 × 4.275` to `2.28 × 3.42` scene units.
- Scaled the black backing and gold frame with the image.
- Kept the assembly centered vertically at `y=2.65`, halfway through the
  Work With Joe room's `5.3`-unit height.
- Kept the assembly centered horizontally at local `z=-9.0`, halfway across
  the solid east-wall segment between the adjacent hallway openings.
- Preserved the local light, room geometry, hallways, displays, interactions,
  and mobile experience.

## Validation

- Static assertions for the `0.8` scale and computed horizontal and vertical
  centers.
- `npm test`
- `git diff --check`
