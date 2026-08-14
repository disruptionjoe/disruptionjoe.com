# Tablet methodology experience viewport fit

Run: `RUN-20260814-103551-djc-website-tablet-methodology-viewports-direct`

## Result

The AI Activation Playbook and AI Enablement Architecture now remain bounded
to the visible tablet viewport in portrait and landscape.

### Playbook

- Tablet widths use a compact two-part header and horizontal contents rail.
- The open book receives all remaining viewport height.
- Each page can scroll independently when its content needs more vertical
  space, so the site page itself never leaves the viewport frame.
- Spread navigation, arrows, swipe/tap behavior, content, and CTA remain
  unchanged.

### Enablement Architecture

- Portrait tablets keep the architecture map, active capability, and diagnosis
  panel inside one viewport using bounded internal panels.
- Landscape tablets retain the three-column architecture while constraining
  the map, capability territory, and role lens to the viewport.
- The introductory level chooser also fits a 1024-by-600 short landscape
  viewport without page scrolling.
- All 12 capabilities, prompts, controls, content, and interactions remain
  unchanged.

## Verification

- Browser checks covered a 768-by-1024 portrait tablet and 1024-by-600 short
  landscape tablet.
- Both Enablement intro and entered states reported document height equal to
  viewport height.
- Playbook portrait testing reported document height equal to viewport height;
  both the Orientation and Assemble a Room spreads fit, including the final
  activation CTA.
- Internal overflow remains available only where content needs it.
- Repository tests and whitespace validation passed.

No form was submitted and no manual deployment was performed.
