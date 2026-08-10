# Simplify the desktop Thinking Museum spawn card

## Objective

Make the desktop arrival card quieter and more personal by centering the
welcome and Joe's quote, then leaving Work With Joe as the single directional
cue at the bottom.

## Result

- Removed the Control Room and Church of AI direction rows from the desktop
  spawn card.
- Grouped `Welcome to Disruption Joe's Thinking Museum` with Joe's welcome
  quote in a centered middle section.
- Retained the small working-interest cue below that welcome.
- Moved the unchanged Work With Joe arrow, title, and buyer-facing description
  to the final position at the bottom of the card.
- Refined only the local spacing and cache-busted the stylesheet reference.

## Preserved

The movement instructions, Work With Joe copy and left-arrow direction, card
dismissal behavior, 3D scene, desktop controls, mobile elevator experience,
and all museum content remain unchanged.

## Validation

- Fresh local desktop walkthrough at `1280x720`, including rendered spacing,
  hierarchy, and an empty browser error console.
- Exact spawn-card content and order checks.
- HTML structural parsing and CSS brace validation.
- Desktop-only/mobile-hidden invariant.
- Repository tests, YAML parsing, and whitespace checks.
