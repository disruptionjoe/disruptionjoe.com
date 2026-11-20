# Orientation continuation cues

Run: `RUN-20261120-orientation-scroll-cues`

Authority: Joe's direct 2026-11-20 observation that the orientation did not consistently communicate that visitors should keep scrolling.

## Delivered update

- Added a quiet bottom-center `Keep scrolling ↓` cue to each intermediate orientation screen.
- Preserved the Pricing link, the 14-card carousel controls, and the `Here's how` link as optional interactions within the continuing story.
- Left the final two-path screen without a scroll cue because its two actions are the intended next steps.
- Added dedicated bottom clearance on short screens so the cue cannot cover links or carousel controls.

## Validation

- Repository test suite: 43 of 43 passed.
- Headless Chrome acceptance passed at 1440 by 900, 390 by 844, and 320 by 568.
- All four cues remained visible, inside the viewport, and clear of interactive controls.
- The final orientation screen contained no misleading continuation cue.
- Browser acceptance reported no console errors.

## Publication path

The update uses the existing `main` branch GitHub-to-Vercel production path. The homepage asset marker is `20261120-momentum-v3`.
