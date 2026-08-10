# Refine the desktop spawn card hierarchy

## Objective

Give the Thinking Museum's desktop arrival card a clearer personal center and
turn its single room direction into a more natural buyer invitation.

## Result

- Increased the card width from `560px` to `620px` and slightly increased the
  surrounding padding.
- Turned the welcome-and-quote center into a subtly framed inset with generous
  internal padding, a restrained warm signal wash, and an explicit `12px`
  visual gap between the welcome and Joe's quote at the standard desktop size.
- Removed the standalone tiny `Interested in working with Joe?` line.
- Replaced the arrow row's `Work With Joe` title with
  `Interested in working with Joe?` while preserving its left arrow and service
  explanation.
- Added a compact version of the inset spacing for short desktop viewports.
- Cache-busted the Thinking Museum stylesheet.

## Preserved

Movement instructions, arrow direction, Work With Joe destination, service
explanation, room scene, interactions, and the mobile museum experience remain
unchanged.

## Validation

- Fresh local `1280x720` desktop walkthrough of the spawn state.
- Measured the center padding, title-to-quote gap, and card/row bounds.
- Confirmed no browser-console errors.
- Repository tests, HTML/CSS structure checks, YAML parse, and whitespace
  checks.
