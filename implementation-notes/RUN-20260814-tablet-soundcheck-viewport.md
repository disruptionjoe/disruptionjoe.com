# Tablet Soundcheck viewport fit

Run: `RUN-20260814-104532-djc-website-tablet-soundcheck-viewport-direct`

## Result

The AI Capability Soundcheck now uses the visible tablet viewport as the frame
for its complete mixing booth in portrait and landscape.

- The stage divides the available height among the instruction, signal crowd,
  and mixing console without expanding the document.
- The channel bank scrolls horizontally inside the booth while the master
  controls remain visible.
- Short landscape tablets reserve additional console height so channel names,
  faders, Solo controls, and the master action remain readable.
- Coaching, Solo evidence, and result screens remain fixed to the viewport and
  use their existing deliberate internal scrolling where needed.
- All 12 signals, values, routes, copy, evidence, controls, and contact intent
  routing remain unchanged.

## Verification

- Browser checks covered 768-by-1024 portrait and 1024-by-600 short landscape
  tablet viewports.
- At both sizes, document width and height equaled viewport width and height.
- The portrait and landscape stages reported no document overflow.
- Signal selection enabled the existing Play this room action while keeping the
  master deck visible.
- The Solo evidence drawer filled the viewport without document overflow.
- The result screen stayed within the viewport and retained its correctly
  parameterized Planning Room destination.
- Repository tests and whitespace validation passed.

No form was submitted and no manual deployment was performed.
