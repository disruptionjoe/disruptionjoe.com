---
class: runtime
status: active
run_id: RUN-20260722-homepage-mobile-composition
run_type: progress
mode: execute
started: 2026-07-22T15:37:37-05:00
lane_selection:
  owner_id: djc-website
  lane_id: "1"
  manifest_sha256: 7774b63e9fb77460d01cc650b23ed62ccd401f6d6793751a1f11f59431e657f8
  manifest_revision: 1
  definition_revision: 1
  control_revision: 1
  directed_flow_revision: null
  work_ref: Joe direct chat and attached mobile homepage screenshot, 2026-07-22
---

# Homepage Mobile Composition Run

## Objective

Correct the homepage's narrow-screen composition using Joe's attached 590 by
1280 mobile screenshot as the review evidence. Make the entrance feel composed,
premium, and readable without changing its copy, interaction, desktop layout,
or single-action role.

## Governance and lane selection

- Governed by `AGENTS.md`, `LANES.yaml`, `LANE-STATE.yaml`, `THE-STUDIO.md`,
  `BRAND-DESIGN.md`, `BRAND-VOICE.md`, and Joe's direct visual review.
- Owner and Lane: `djc-website`, active Lane 1.
- Selection basis: Joe identified the current homepage appearance as
  unsatisfactory and supplied direct mobile evidence showing the issue.
- Effective permission: edit, validate, commit, and push this coherent website
  batch. No non-GitHub external action or deployment command.
- Emergency revocation evidence: no writer lock; repository clean and
  synchronized at `c7932fa07edf`; no active recent Run overlaps the homepage
  stylesheet surface.

## Screenshot findings

- The centered hero leaves an oversized empty band between the navigation and
  the eyebrow line.
- The headline is too large for the available width and breaks into four heavy
  lines, making the first viewport feel crowded below the empty band.
- The activation neon and connected-node field compete directly with the
  supporting copy.
- The nearly full-width CTA feels generic and visually heavy relative to the
  intended premium threshold.

## Expected writable surfaces

- `assets/site.css`
- `LANE-STATE.yaml`
- this Run record
- workspace memory log

## Constraints

- Keep homepage copy, navigation, CTA label and target, animation logic, and
  single-screen/no-scroll behavior unchanged.
- Keep the desktop homepage layout and activation composition unchanged.
- Preserve Space Grotesk, Space Mono, near-black, tan, architectural linework,
  and the existing activation assets.
- Restrict implementation to narrow-screen homepage CSS.
- Maintain readable type, a minimum 48-pixel action target, safe viewport
  sizing, and reduced-motion behavior.

## Plan

1. Move the mobile copy block higher and establish deliberate top spacing
   rather than vertical centering.
2. Reduce and widen the headline measure so it resolves into approximately
   three balanced lines at common phone widths.
3. Refine eyebrow, lede, action spacing, and CTA width into a tighter hierarchy.
4. Move and dim the activation stage toward the right/lower field so it remains
   atmospheric without crossing the primary copy.
5. Verify cascade order, phone-width and short-height behavior, one-screen
   containment, action-target sizing, unchanged copy, unchanged desktop rules,
   syntax, YAML, and changed-file scope.
6. Record the result, commit and push, then close the repository sync guard.

## External action authorization

- GitHub commit and push are authorized by Joe's direct implementation request
  and the repository's versioning default.
- No deployment command or other non-GitHub external action is authorized.

## Results

- Replaced mobile vertical centering with deliberate viewport-relative top
  spacing, removing the oversized empty band shown in Joe's screenshot.
- Reduced the phone headline from the inherited roughly 49-pixel scale to
  approximately 41 pixels at the screenshot-equivalent 393 CSS-pixel width.
- Enabled balanced headline wrapping, widened its usable measure, tightened its
  letter spacing, and raised line height slightly so it reads as approximately
  three composed lines instead of four oversized blocks.
- Tightened the eyebrow rule, gap, size, and spacing while preserving its text.
- Limited the lede to a readable 22rem measure and added a restrained dark text
  shadow so the architectural field no longer interrupts it.
- Reduced the action group from a 22rem cap to 18rem and retained a 52-pixel
  minimum CTA height, creating a more premium button proportion without
  compromising the touch target.
- Shifted the activation field toward the right, lowered its mobile opacity
  from 0.28 to 0.18, and reduced/repositioned the neon so it reads as atmosphere
  rather than competing content.
- Added a short-height phone refinement that further compresses top spacing and
  headline scale while preserving the single-screen threshold.
- Homepage markup, copy, navigation, CTA destination, animation JavaScript,
  desktop CSS, reduced-motion behavior, and all non-homepage pages remain
  unchanged.
- JavaScript syntax, whitespace, YAML, CSS-brace balance, screenshot-width
  typography and CTA calculations, accessible action height, unchanged-markup,
  responsive-scope, and changed-file-scope checks pass.
