---
class: runtime
status: completed
run_id: RUN-20260723-thinking-brand-neon-welcome-center
run_type: progress
mode: execute
started: 2026-07-23T17:12:00-05:00
completed: 2026-07-23T17:18:19-05:00
lane_selection:
  owner_id: djc-website
  lane_id: "1"
  manifest_revision: 1
  definition_revision: 1
  control_revision: 1
  directed_flow_revision: null
  work_ref: Joe direct chat, 2026-07-23 Brand and Media neon and welcome centering
---

# Brand and Media Neon and Welcome-Card Centering

## Objective

Use the homepage neon as the Brand and Media exhibit artwork and center the
spawn-room welcome card cleanly between the Control Room and Discover
entrances.

## Result

- Added a self-contained exhibit image reproducing the homepage's dimensional
  handwritten `Thinking better together in an age of humans and AI` neon.
- Assigned that image to Brand and Media on desktop and mobile.
- Preserved the former Brand and Media artwork as an unreferenced source asset
  for future reuse.
- Removed the welcome card's detached decorative bar.
- Centered the card rectangle within its texture and restored balanced inner
  text margins.
- Moved the complete welcome placard and its light to `z = -3.425`, the exact
  midpoint between the Control Room and Discover entrance centers.
- Preserved all welcome copy, typography, wall geometry, entrances, and
  interactions.

## Verification

- `xmllint --noout assets/thinking/exhibits/homepage-neon.svg` passed.
- `npm test` passed the complete JavaScript syntax suite.
- `git diff --check` passed.
- Browser QA confirmed the neon renders inside the actual Brand and Media
  WebGL exhibit at 2.73 scene units with its dynamic placard still closed.
- Browser QA confirmed the welcome rectangle is centered between the two
  entrances with no detached accent bar.
- Browser QA reported no page errors or failed requests.

## Receipt

Implementation commit `5871afa` contains the homepage-neon exhibit asset,
Brand and Media assignment, and centered welcome-wall treatment.

No separate deployment command or non-GitHub external action was performed.

## Outcome reason

`Brand and Media now carries the site's signature neon, while the welcome wall
reads as one centered architectural composition.`
