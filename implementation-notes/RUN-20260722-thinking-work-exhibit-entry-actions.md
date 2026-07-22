---
class: runtime
status: completed
run_id: RUN-20260722-thinking-work-exhibit-entry-actions
run_type: progress
mode: execute
started: 2026-07-22T17:24:30-05:00
completed: 2026-07-22T17:27:53-05:00
lane_selection:
  owner_id: djc-website
  lane_id: "1"
  manifest_sha256: 7774b63e9fb77460d01cc650b23ed62ccd401f6d6793751a1f11f59431e657f8
  manifest_revision: 1
  definition_revision: 1
  control_revision: 1
  directed_flow_revision: null
  work_ref: Joe direct chat, 2026-07-22 Work With Joe exhibit entry actions
---

# Thinking Work With Joe Exhibit Entry Actions Run

## Objective

Turn the AI Activation Playbooks and AI Enablement Architecture displays into
clear buyer-facing entrances to their interactive experiences.

## Authority and scope

- Joe directly authorized the copy revision, bright Enter actions, and route
  wiring in chat.
- Lane 1 is active; no writer lock or overlapping Run is present.
- The repository was clean and synchronized at `fefc84517243` before edits.
- Expected writable surfaces: `assets/thinking-game.js`,
  `assets/thinking-game.css`, this Run record, `LANE-STATE.yaml`, and workspace
  memory.
- GitHub commit and push are authorized by the implementation request and repo
  default. No deployment command or non-GitHub external action is authorized.

## Approved behavior

- AI Activation Playbooks opens `/playbook/` through a bright primary action.
- AI Enablement Architecture opens `/enablement/` through a bright primary
  action.
- The same action behavior appears in the desktop proximity card and the
  mobile exhibit inspector.
- Internal experience routes open in the current tab; GitHub exhibit links
  retain their existing new-tab behavior.

## Buyer-facing copy direction

- Playbooks explains how Joe designs activation sessions that combine
  training, discovery, assessment, leadership alignment, real-work practice,
  and tangible outputs to create useful behavior change.
- Enablement explains how leaders can see dependencies across individual,
  team, and enterprise capability, locate the next viable move, and leave with
  role-specific diagnostic prompts.
- The two exhibits remain distinct but connected: activation creates movement
  and organizational signals; enablement turns those signals into enduring
  organizational improvement.

## Constraints

- Preserve room geometry, exhibit placement, artwork, movement, and all other
  museum content.
- Reuse the existing popup-link behavior rather than create a second overlay
  or navigation system.
- Keep ordinary repository links visually secondary and reserve the bright
  treatment for the two commercial experience entrances.
- Do not redesign the destination experiences in this Run.

## Results

- Replaced agent-testing questions with practical buyer value in both exhibit
  popup cards and their in-room placard summaries.
- Added `Enter the Playbook Experience` and `Enter the Architecture Experience`
  actions linked to the existing live experiences.
- Added a high-contrast cream-and-gold primary treatment with a larger target,
  glow, and stronger hover/focus state.
- Applied the same content, label, route, and bright treatment to the mobile
  inspector while preserving ordinary GitHub CTA behavior elsewhere.

## Verification

- JavaScript syntax suite passed through `npm test`.
- `git diff --check` passed.
- Both destination route files exist at `playbook/index.html` and
  `enablement/index.html`.
- Static source checks confirmed both action labels, internal route targets,
  same-tab behavior, experience-only styling, and desktop/mobile selectors.
- Browser visual QA was not performed because it was not explicitly requested
  for this bounded existing-site change.

## Outcome reason

`The two Work With Joe exhibits now explain why the methods matter to a buyer
and make the next step impossible to miss.`
