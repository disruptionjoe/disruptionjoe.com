# Snappier homepage progression

Run: `RUN-20261120-snappier-homepage-progression`

Authority: Joe's direct 2026-11-20 request to make the homepage Orientation and Challenge Investigation advance more clearly and decisively on tablet and desktop while preserving native swipe and scroll.

## Delivered update

- Turned the existing downward continuation cues into usable tap and click controls on the threshold and the first three Orientation screens.
- Kept native scrolling, touch swiping, keyboard navigation, and reduced-motion behavior intact.
- Added one-screen wheel progression and a short settling pass so desktop and tablet interactions land cleanly on a screen instead of stopping between screens.
- Preserved a proximity-snap fallback only for narrow, short phone viewports whose content can exceed the available screen height.
- Made Begin Investigation and the lobby's elevator cue explicit navigation controls so the welcome, lobby, and first Floor advance predictably.
- Protected programmatic transitions from briefly selecting an intermediate screen while smooth scrolling is in progress.

## Validation

- Repository test suite: 46 of 46 passed after reconciling the concurrently published full Facilitator Playbook update.
- Browser acceptance passed at 1440 by 900, 1024 by 600, 768 by 1024, and 390 by 568.
- Desktop and tablet layouts use mandatory vertical snap behavior.
- Phone layouts preserve scroll access for content that is taller than the viewport.
- The threshold, Orientation, Challenge Investigation welcome, lobby, and Better Momentum transitions each settled within two pixels of their intended screen.
- Browser acceptance reported no console errors.

## Publication path

The update uses the existing `main` branch GitHub-to-Vercel production path. The homepage asset marker is `20261120-momentum-v6`.
