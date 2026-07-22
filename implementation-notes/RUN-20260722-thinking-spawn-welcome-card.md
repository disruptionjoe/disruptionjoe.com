---
class: runtime
status: active
run_id: RUN-20260722-thinking-spawn-welcome-card
run_type: progress
mode: execute
started: 2026-07-22T16:07:19-05:00
lane_selection:
  owner_id: djc-website
  lane_id: "1"
  manifest_sha256: 7774b63e9fb77460d01cc650b23ed62ccd401f6d6793751a1f11f59431e657f8
  manifest_revision: 1
  definition_revision: 1
  control_revision: 1
  directed_flow_revision: null
  work_ref: Joe direct chat, 2026-07-22 Thinking Museum spawn welcome-card expansion
---

# Thinking Museum Spawn Welcome-Card Run

## Objective

Keep the existing, well-positioned movement guidance at spawn and attach a
compact lower card that welcomes visitors to Disruption Joe's Thinking Museum,
orients them to its three main rooms, and invites them to explore at their own
pace.

## Authority and scope

- Joe directly authorized this bounded welcome-card expansion in chat.
- Lane 1 is active; no writer lock or overlapping Run is present.
- The repository is clean and synchronized at `6a8ce466d441`.
- Expected writable surfaces: `thinking/index.html`,
  `assets/thinking-game.css`, this Run record, `LANE-STATE.yaml`, and workspace
  memory.
- GitHub commit and push are authorized by the implementation request and repo
  default. No deployment command or non-GitHub external action is authorized.

## Constraints

- Preserve the current top text, responsive vertical placement, movement
  behavior, dismissal behavior, and mobile-hidden behavior.
- Add the welcome and room guide as a visually attached lower portion so the
  existing controls do not move.
- Use left for Work With Joe, right for Pushing the Limits, and down/behind for
  Church of AI.
- Describe Church of AI as a public entryway and open-source community-service
  experiment without implying that deferred formal community, governance,
  participation, or funding systems are already live.
- Preserve the entire 3D scene, rooms, signs, displays, geometry, and
  interactions.

## Plan

1. Add a semantic three-room guide and warm closing beneath the existing spawn
   controls.
2. Style it as an attached, compact architectural lower card that expands
   downward from the current placement.
3. Add a short-height desktop refinement while preserving the existing mobile
   hiding rule.
4. Validate public copy, directions, accessible labels, compact fit, unchanged
   control content and placement, syntax, and scope; then record, commit, push,
   and close the repository session.

## External action authorization

- GitHub commit and push are authorized by Joe's direct implementation request
  and the repository's versioning default.
- No deployment command or other non-GitHub external action is authorized.

## Results

- Kept the existing movement kicker, instruction sentence, responsive bottom
  offset, dismissal, and mobile-hidden behavior unchanged.
- Added a visually attached lower card that extends downward from the existing
  controls rather than moving them.
- Added a three-room guide: Work With Joe to the left for potential clients,
  Pushing the Limits to the right as the Learning Lab, and Church of AI behind
  the visitor as a public entryway for open-source community service and
  experiments in coordination, contribution, and funding public-good work.
- Closed with a personal welcome inviting visitors to take their time and enjoy
  exploring.
- The estimated lower-card height is 233 pixels in the standard treatment and
  191 pixels in the short-desktop treatment, within the minimum available
  192-pixel space beneath the preserved controls.
- The 3D scene, rooms, signs, displays, geometry, mobile experience, controls,
  and interactions remain unchanged.
