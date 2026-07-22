---
class: runtime
status: active
run_id: RUN-20260722-thinking-instruction-position-second
run_type: progress
mode: execute
started: 2026-07-22T15:42:41-05:00
lane_selection:
  owner_id: djc-website
  lane_id: "1"
  manifest_sha256: 7774b63e9fb77460d01cc650b23ed62ccd401f6d6793751a1f11f59431e657f8
  manifest_revision: 1
  definition_revision: 1
  control_revision: 1
  directed_flow_revision: null
  work_ref: Joe direct chat, 2026-07-22 second movement-instruction position correction
---

# Thinking Movement-Instruction Position Run, Second Correction

## Objective

Raise the desktop arrow-key instruction box approximately twice as high as its
current lower-middle position so it sits near the center of the spawn view,
visually just below the Think Better neon. Leave mobile, content, controls,
dismissal, scene, and camera behavior unchanged.

## Authority and scope

- Joe directly authorized this bounded visual correction in chat.
- Lane 1 is active; no writer lock or overlapping Run is present.
- The repository is clean and synchronized at `3647364e1173`.
- Expected writable surfaces: `assets/thinking-game.css`, this Run record,
  `LANE-STATE.yaml`, and workspace memory.
- GitHub commit and push are authorized by the implementation request and repo
  default. No deployment command or non-GitHub external action is authorized.

## Constraints

- Change only the desktop instruction box's responsive vertical offset.
- Preserve its horizontal centering, dimensions, content, appearance, and
  dismissal animation.
- Preserve the mobile media rule that hides the desktop-only instructions.
- Preserve the game scene, camera, neon, HUD, controls, and interaction logic.

## Plan

1. Double the preferred viewport-relative bottom offset from 18vh to 36vh and
   expand the responsive bounds proportionally for common desktop heights.
2. Confirm the resulting box center occupies the middle band of representative
   desktop game-shell heights and sits near the neon's projected lower edge.
3. Confirm the mobile hiding rule and all non-position selectors remain
   unchanged.
4. Validate, record, commit, push, and close the repository session.

## External action authorization

- GitHub commit and push are authorized by Joe's direct implementation request
  and the repository's versioning default.
- No deployment command or other non-GitHub external action is authorized.

## Results

- The desktop instruction offset now uses `clamp(12rem, 36vh, 22rem)`, exactly
  doubling the prior minimum, preferred, and maximum values.
- Representative desktop calculations place the box center at 53–61% of the
  game-shell height; at a 900-pixel viewport it sits at roughly 56%.
- At a representative 1080-pixel viewport, the box begins roughly 20 pixels
  below the projected lower edge of the Think Better neon.
- The CSS diff is limited to the approved offset. Content, appearance,
  dismissal, mobile hiding, scene, camera, HUD, controls, and interactions are
  unchanged.
