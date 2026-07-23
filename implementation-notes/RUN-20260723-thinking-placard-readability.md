---
class: runtime
status: completed
run_id: RUN-20260723-thinking-placard-readability
run_type: progress
mode: execute
started: 2026-07-23T17:07:00-05:00
completed: 2026-07-23T17:10:40-05:00
lane_selection:
  owner_id: djc-website
  lane_id: "1"
  manifest_revision: 1
  definition_revision: 1
  control_revision: 1
  directed_flow_revision: null
  work_ref: Joe direct chat, 2026-07-23 static placard readability
---

# Static Exhibit Placard Readability

## Objective

Make every desktop exhibit's stable explanatory text readable before the
visitor reaches the dynamic-placard activation distance.

## Result

- Increased Purpose body typography across all 46 desktop exhibit placards
  from the prior 18–24 pixel range to a length-aware 29–35 pixel range.
- Increased the CapacityOS static metric label from 31 to 40 pixels.
- Raised Purpose text contrast slightly for clearer distant reading.
- Moved the Purpose block upward within the existing placard to preserve
  balanced spacing at the larger scale.
- Preserved all titles, Purpose copy, Passion copy, card dimensions, exhibit
  placements, dynamic placard typography, and activation distances.
- Preserved the mobile exhibit-card typography and explicit-button behavior,
  where proximity activation does not apply.

## Verification

- `npm test` passed the complete JavaScript syntax suite.
- `git diff --check` passed.
- Browser QA viewed AI Enablement Architecture from 2.84 scene units while its
  dynamic placard remained closed.
- A browser-measured wrap audit confirmed all 46 Purpose statements fit in
  five lines or fewer with no truncation.
- Browser QA reported no page errors or failed requests.

## Receipt

Implementation commit `fbad7e7` contains the stable exhibit placard typography
and contrast adjustments.

No separate deployment command or non-GitHub external action was performed.

## Outcome reason

`Visitors can now read the stable Purpose before stepping into the dynamic
Passion interaction.`
