# Home Screen 4 intro update

Run: `RUN-20261120-163922-djc-website-home-screen4-intro-direct`

## Purpose

Replace the short introductory line beneath “A better way to work together”
with Joe's approved description of how the full working experience is designed
to feel different.

## Implementation

- Replaced only the Screen 4 introductory paragraph.
- Reused the existing `touch-direction` and `pointer-direction` pattern from
  the Lobby instructions.
- Touch devices read “Swipe through”; pointer devices read “Scroll through.”
- Preserved the headline, “The difference you'll feel” label, all 14 comparison
  cards, and their order.
- Added regression coverage for the approved copy, device-specific wording,
  preserved card count, and absence of the superseded line.

## Validation

- Full repository test suite passes.
- Public copy contains no em dash.
- Screen 4 keeps its existing responsive carousel and short-viewport behavior.
- Live verification confirms the approved copy is published.

## Boundaries preserved

- No comparison-card content or order changed.
- No other homepage screen or site route changed.
- Scheduled priority and automation state remain unchanged.
