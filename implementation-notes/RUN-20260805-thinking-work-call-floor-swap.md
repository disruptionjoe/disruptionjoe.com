# Work With Joe installation swap

## Objective

Switch the wall positions of the Plan a Call physical button and the Raise the
Floor infographic in the desktop Work With Joe room.

## Result

- The Plan a Call installation now occupies the east-wall bay at local
  `z=-9.0` and faces west into the room.
- The Raise the Floor installation now occupies the west-wall bay at local
  `z=-9.2` and faces east into the room.
- Each complete installation moved together: the button keeps its label,
  physical control, floor marker, light, interaction anchor, and contact
  action; the infographic keeps its backing, artwork, frame, scale, and light.
- The button's widest wall element leaves `0.38` scene units at each edge of
  its four-unit wall bay. The infographic frame leaves `0.6925` and `1.0925`
  scene units at the edges of its wall bay.

## Preserved

Offer displays and copy, the AI Capability Soundcheck, the Methods and Tools
wing, room and hallway geometry, mobile behavior, and all other Thinking
Experience content remain unchanged.

## Validation

- JavaScript syntax and repository test suite.
- YAML parse and repository whitespace checks.
- Static wall-bay clearance assertions for both installations.
- Local desktop browser walkthrough of both swapped wall positions.
