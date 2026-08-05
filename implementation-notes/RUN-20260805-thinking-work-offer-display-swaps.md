# Work With Joe offer-display swaps

## Objective

Make two desktop placement changes in Work With Joe without changing the
approved offers or the installations themselves:

1. Exchange the AI Capability Soundcheck and number 1 Identify the Floor.
2. Exchange number 2 Establish the Floor and number 3 Raise the Floor.

## Result

- The complete AI Capability Soundcheck installation now occupies the
  six-unit west-wall bay at local `z=-1.0` and faces east into the room.
- The complete number 1 display now occupies the opposite six-unit east-wall
  bay at local `z=-1.0` and faces west into the room.
- The number 2 and number 3 standard product display groups exchange their
  existing north-wall `x` coordinates, so number 3 occupies the former number
  2 position and number 2 occupies the former number 3 position.
- Static placards, dynamic placards, artwork, interaction anchors, approach
  markers, lights, and links follow their respective installations.
- The Soundcheck frame leaves `0.79` scene units at both west-bay edges. The
  number 1 frame leaves `1.6608` scene units at both east-bay edges.

## Preserved

All public copy, links, display sizes, interaction ranges, Soundcheck
functionality, neon placement, Plan a Call, the Raise the Floor infographic,
Methods and Tools, room and hallway geometry, mobile ordering, and all other
Thinking Experience content remain unchanged.

## Validation

- JavaScript syntax and repository test suite.
- YAML parse and repository whitespace checks.
- Static wall-bay clearance assertions for the Soundcheck and number 1.
- Local desktop browser walkthrough of all four changed positions.
