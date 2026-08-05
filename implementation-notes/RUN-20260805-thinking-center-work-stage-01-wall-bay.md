# Center Work With Joe display 01

## Objective

Center desktop display 01 within its solid east-wall section so it clears the
adjacent Who Is Joe hallway opening evenly.

## Result

- Moved `Understand where you are` from local `z=-1.0` to `z=-0.5`.
- The new coordinate is the exact midpoint of the solid wall segment from
  `z=-3.0` through `z=2.0`.
- At the unchanged `0.72` scale, the `2.592`-unit-wide display now has `1.204`
  scene units of clearance on both sides of its wall bay.

## Preserved

Display size, height, content, placards, interaction distance, mobile order,
the Who Is Joe hallway opening, Start Here installation, room geometry, and
all other displays remain unchanged.

## Validation

- JavaScript syntax and repository tests.
- Exact wall-center and equal-clearance calculations.
- Display and surrounding-installation invariants.
- YAML and repository whitespace checks.
