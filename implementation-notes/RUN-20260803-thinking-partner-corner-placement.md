# RUN-20260803 Thinking Partner Corner Placement

## Bottom line

“Bring more substantive applied AI work to your clients” now occupies the
entrance-side wall immediately around the corner from the R&D and
business-value displays.

## Implemented

- Moved the partner-program product off the opposite east wall.
- Centered it on the solid northern segment of the west wall, beside the
  Orientation entrance and near the “Raise the floor” offer graphic.
- Oriented it 90 degrees from “Push an important R&D question further” and
  “Turn scattered AI activity into business value,” so the three products read
  as one continuous run between the Support Systems and Orientation hallways.
- Added the matching inward approach marker for this wall orientation.
- Preserved all product copy, CTA behavior, proximity behavior, other desktop
  placements, circulation, and mobile ordering.

## Validation

- Confirmed the target wall segment spans `z=-4.0` through `z=2.0` and the
  display is centered at `z=-1.0`.
- Confirmed the scaled display leaves `1.704` scene units of clearance at both
  ends of the wall segment.
- Confirmed the adjacent north-wall product pair and the newly balanced
  south-wall product pair remain unchanged.
- `npm test`
- `git diff --check`
