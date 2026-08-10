# Work With Joe Start Here hierarchy

Run: `RUN-20260810-123230-djc-website-start-here-hierarchy-direct`

## Implemented

- Enlarged the Start Here neon from `3.68 x 0.72` to `6.0 x 1.4` scene units inside the existing installation group.
- Increased the Start Here texture's script scale and strengthened its existing local glow so it reads as the dominant orientation signal.
- Lowered the static placard, backing, and frame together while preserving the dynamic placard and approach marker.
- Added explicit stage-row spacing for the outer inset, number node, number-to-label gap, and right inset.
- Measured each wrapped stage label and vertically centered the complete text block beside its number.
- Preserved all stage numbers, stage titles, product displays, Soundcheck, room geometry, mobile content, and demand-driven rendering.

## Verification

- `npm test`
- `git diff --check`
- Static assertions for neon dimensions, placard position, row spacing, centered text-block logic, unchanged dynamic copy, and restored entrance camera.
- Local desktop room view from normal orientation distance and a closer stage-row alignment view.
- Confirmed the restored entrance state and zero browser console errors.

