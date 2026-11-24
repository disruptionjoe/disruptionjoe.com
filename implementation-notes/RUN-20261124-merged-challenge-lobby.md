# Merged Challenge Investigation Lobby

Run: `RUN-20261124-merged-challenge-lobby`

Authority: Joe's direct approval to remove the repetitive Challenge Investigation welcome and make Floor 00 the single entry screen.

## Delivered update

- Removed the standalone “Welcome to the Challenge Investigation” level, its challenge-count copy, numbered steps, and Begin Investigation button.
- Rebuilt Floor 00 around the approved sequence: move between outcome Floors, move between challenge rooms, then collect and send familiar challenges.
- Kept the five Floor destinations compact and tappable.
- Preserved the existing elevator hint beneath the merged Lobby.
- Removed the separate Start item so the elevator rail now runs from 00 through 05.
- Routed the homepage skip link, Screen 6 CTA, homepage menu, and existing How I Can Help links directly to `#lobby`.
- Kept `#investigation` and `#challenge-investigation` as backward-compatible aliases that replace themselves with the canonical `#lobby` route.
- Preserved collection storage, floor and room navigation, and Contact Joe query carry-over.

## Validation

- Repository test suite: 55 of 55 passed.
- Headless Chrome acceptance passed at 1440 by 900 and 390 by 844.
- Desktop displayed Scroll and Use the arrows guidance; touch displayed Swipe guidance.
- The merged Lobby fit both tested viewports without horizontal overflow.
- Screen 6 and the legacy `#investigation` route both reached Floor 00.
- Floor navigation, saving a challenge, collection review, and carrying the saved challenge into Contact Joe all passed.
- No browser console errors were observed.

## Publication path

The update uses the existing `main` branch GitHub-to-Vercel production path. The homepage asset marker is `20261124-merged-lobby-v1`.
