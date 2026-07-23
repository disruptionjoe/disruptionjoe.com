---
class: runtime
status: completed
run_id: RUN-20260723-thinking-mobile-left-floor-nav
run_type: progress
mode: execute
started: 2026-07-23T11:37:00-05:00
completed: 2026-07-23T11:43:01-05:00
lane_selection:
  owner_id: djc-website
  lane_id: "1"
  manifest_sha256: 7774b63e9fb77460d01cc650b23ed62ccd401f6d6793751a1f11f59431e657f8
  manifest_revision: 1
  definition_revision: 1
  control_revision: 1
  directed_flow_revision: null
  work_ref: Joe direct chat, 2026-07-23 mobile floor-selector and doorway alignment
---

# Thinking Museum Mobile Left Floor Selector Run

## Objective

Move the persistent mobile floor selector from the right side of the elevator
to the left and vertically center the doorway frame in the usable viewport.

## Authority and scope

- Joe directly authorized both mobile layout changes and supplied the iPhone 15
  screenshot used as the visual reference.
- Lane 1 is active; no writer lock or overlapping website Run is present.
- The repository was clean and synchronized at `69b076649c23` before edits.
- Scope is responsive layout in `assets/thinking-game.css`, this Run record,
  `LANE-STATE.yaml`, and workspace memory.
- Mobile content, floor order, interactions, JavaScript, desktop, homepage, and
  all non-Thinking routes remain unchanged.
- GitHub commit and push are authorized by the implementation request and repo
  default. No deployment command or non-GitHub external action is authorized.

## Result

- Moved the complete Lobby/01–06 floor selector to the left safe-area edge.
- Mirrored the reserved navigation gutter across the lobby, room headers,
  exhibit cards, doorway cards, and compact landscape layouts.
- Removed the doorway hint from grid flow and anchored it independently near
  the bottom safe area.
- Gave the doorway frame an explicit viewport-relative height and centered it
  vertically within the available screen, preventing the hint from pulling the
  door upward.
- Preserved the existing door scale, copy, floor indicator, opening animation,
  two-hall loop, and vertical floor navigation.

## Verification

- `npm test` passed the complete repository JavaScript syntax suite.
- `git diff --check` passed.
- A static CSS parser check confirmed balanced braces, strings, and comments.
- Structural review confirms the left navigation gutter is mirrored in
  portrait and compact landscape rules.
- The doorway frame uses centered grid placement while the ride hint is
  independently bottom-anchored.
- Browser testing was not requested, so no browser UI or screenshot workflow
  was introduced.

## Receipt

Receipt pending final commit, push, and repository closeout.

## Outcome reason

`The floor selector now reads naturally beside the elevator's left edge, while
the door itself holds the visual center of the mobile viewport.`
