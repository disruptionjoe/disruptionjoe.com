---
class: runtime
status: completed
run_id: RUN-20260723-thinking-discover-dogleg
run_type: progress
mode: execute
started: 2026-07-23T17:20:00-05:00
completed: 2026-07-23T17:30:21-05:00
lane_selection:
  owner_id: djc-website
  lane_id: "1"
  manifest_revision: 1
  definition_revision: 1
  control_revision: 1
  directed_flow_revision: null
  work_ref: Joe direct chat, 2026-07-23 Discover entrance dogleg
---

# Discover Entrance Dogleg

## Objective

Separate the Discover entrance perceptually from the Control Room without
moving or changing the Control Room again.

## Result

- Replaced the broad straight Discover threshold with a compact dogleg:
  visitors enter west, turn right away from Control, then turn left into a
  short connector before joining the existing long Discover gallery.
- Rebuilt the entrance movement bounds, opaque walls, wireframe volumes, and
  floor guide around the revised route.
- Preserved the long Discover gallery, Development Laboratory, Church
  connection, Control Room, and all existing exhibit content.
- Moved NBL Governance Operations onto the dogleg's inner wall and reduced only
  its proximity range so its dynamic placard does not obscure the turns during
  ordinary passage.
- Shifted AI Epistemology slightly deeper into the existing gallery to keep the
  junction clear.

## Verification

- `npm test` passed the complete JavaScript syntax suite.
- `git diff --check` passed.
- Automated desktop walkthrough completed the entrance, right turn, left turn,
  and continuation into the existing Discover gallery.
- Browser QA confirmed the Control Room is no longer visible through or
  spatially mixed with the Discover entrance.
- Browser QA reported no page errors or failed requests.

## Receipt

Implementation commit pending.

No separate deployment command or non-GitHub external action was performed.

## Outcome reason

`Discover now begins with a legible two-turn threshold that separates it from
Control before reconnecting with the preserved gallery.`
