# Work With Joe room spacing balance

Date: 2026-08-03
Lane: 1 — Joe-ratified website evolution
Runtime Run: `RUN-20260803-120809-djc-website-direct`

## Joe-ratified objective

Apply the visual-spacing recommendations from the desktop walkthrough while
keeping the five standard offer exhibits the same size as standard exhibits in
the other rooms. Leave the AI Capability Soundcheck alone because it is being
developed in a separate session.

## Implemented

- Preserved all five standard Work With Joe exhibit groups at `0.72` scale.
- Redistributed the two Raise the Floor exhibits with more separation and a
  clear buffer before the Support Systems entrance.
- Redistributed the two Raise the Ceiling exhibits with more separation and a
  clear buffer before the Methods and Tools entrance.
- Centered each neon heading over its revised exhibit pair.
- Reduced only the five offer displays' automatic placard range from the
  `2.175` scene default to `1.35`, keeping the displays readable before their
  dynamic placards open.
- Reduced the separate Raise the Floor wall infographic from `0.8` to `0.7`
  while preserving its centered mount, source asset, backing, frame, and light.

## Preserved

- Standard exhibit scale and display construction.
- The west-wall “Understand where you are” display.
- All room, hallway, doorway, portal, and collision geometry.
- The AI Capability Soundcheck record and wall installation, including its
  content, artwork, position, scale, proximity behavior, and link.
- Mobile ordering and behavior.

## Acceptance checks

- The five offer exhibits retain `0.72` scale.
- North-wall display centers are `7.226` and `10.884`.
- South-wall display centers are `7.376` and `11.484`.
- Both paired walls have at least `0.75` scene units of doorway or wall-edge
  clearance after accounting for the full exhibit width.
- Offer proximity is `1.35`; the Soundcheck remains `1.8`.
- The wall infographic scale is `0.7` and remains centered at `z=-9`, `y=2.65`.
