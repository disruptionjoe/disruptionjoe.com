# Orientation continuation cues

Run: `RUN-20261120-orientation-scroll-cues`

Authority: Joe's direct 2026-11-20 observation that the orientation did not consistently communicate that visitors should keep scrolling.

## Delivered update

- Added a quiet bottom-center `Keep scrolling ↓` cue to the first three intermediate orientation screens.
- Preserved the Pricing link and 14-card carousel controls as optional interactions within the continuing story.
- Kept the recognition screen's existing clickable `Here's how ↓` link as its continuation control instead of adding a redundant cue.
- Left the final two-path screen without a scroll cue because its two actions are the intended next steps.
- Anchored the cue to the visible viewport and displayed it only for the current intermediate screen, including when a screen's content is taller than the viewport.

## Validation

- Repository test suite: 43 of 43 passed.
- Headless Chrome acceptance passed at 1440 by 900, 390 by 844, and 320 by 568.
- All three generic cues and the `Here's how ↓` continuation remained visible, inside the viewport, and clear of interactive controls.
- The final orientation screen contained no misleading continuation cue.
- Browser acceptance reported no console errors.

## Publication path

The update uses the existing `main` branch GitHub-to-Vercel production path. The homepage asset marker is `20261120-momentum-v4`.
