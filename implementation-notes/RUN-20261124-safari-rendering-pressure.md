# Safari lobby rendering pressure

Joe reports that the production Orientation link still causes repeated Safari
reloads and a browser error at `/lobby`. Prior routing acceptance did not reproduce
or resolve that physical-device failure.

## Correction

- Keep fixed-size floor and room scroll targets, but render only the current and
  adjacent floor/room contents. Distant content stays in the DOM with its IDs and
  collection state intact, without allocating its rendering surfaces.
- Remove the whole-Explore scale/opacity entrance animation, which composited the
  nested multi-floor scene during entry. Floor movement and doors remain intact.
- Ignore height-only resize events from Safari toolbar movement. Width changes
  still realign the active view and room tracks.
- Refresh homepage asset URLs to deliver the matching CSS and JavaScript.

## Evidence and limitations

- Chrome's layer inspector at 390 x 844, device scale 3, measured 116 layers before
  and 29 after; drawn surface area dropped from 21,618,321 to 8,435,568 CSS pixels.
  These are comparative Chrome measurements, not iPhone memory measurements.
- WebKit acceptance at 390 x 844, 768 x 1024, and 1440 x 900 followed the actual
  final Orientation link into `/lobby`, then every floor and its first challenge,
  saving five challenges and checking the contact URL carry-over. No page errors
  or browser crashes occurred. The local server mirrored Vercel's lobby rewrite.
- Repository tests: 62 passed.
- Existing browser regression passed for all 31 rooms, open-placard navigation,
  collection carry-over, and desktop, tablet, and phone widths using installed Chrome.
- No live form submission was made.
- Rendering pressure is a supported hypothesis, not a confirmed crash diagnosis.
  Physical iPhone Safari acceptance remains outstanding. Desktop WebKit cannot
  reproduce the phone's browser process or memory constraints.

Reference: https://webkit.org/web-inspector/layers-tab/ explains the memory cost
of composited layers on constrained devices.
