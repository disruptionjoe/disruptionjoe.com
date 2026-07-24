# RUN-20260724 Thinking Workshop Placement and Laboratory Performance

## Bottom line

The Methods and Tools pegboard now fits cleanly on its uninterrupted wall, and
the Development Laboratory keeps its bubbling character with less continuous
rendering work.

## Implemented

- Recentered the complete pegboard, saw, hammer, pegs, frame, and focused light
  on the solid wall section beside the doorway.
- Lowered the pegboard slightly and removed the older floating decorative
  frames that competed with the new physical tool installation.
- Preserved the Methods and Tools room footprint, workbench, three exhibits,
  doorway, circulation, and interactions.
- Reduced the laboratory bubbles from eight individually allocated higher-detail
  meshes to six lower-detail meshes that share one geometry and material.
- Throttled laboratory motion to roughly 24 frames per second and pauses its
  animation updates while the visitor is outside the nearby laboratory area.
- Preserved the chemistry table, glassware, tubing, warm light, visible bubbling,
  reduced-motion behavior, exhibits, circulation, and interactions.

## Validation

- Inspected both revised rooms in the live desktop Thinking Museum.
- Verified the bubbles visibly advance between frames after the optimization.
- Confirmed the normal museum entrance loads without browser errors.
- `npm test`
- `git diff --check`
