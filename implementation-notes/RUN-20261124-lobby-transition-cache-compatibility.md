# Lobby Transition Cache Compatibility

Run: `RUN-20261124-lobby-transition-cache-compatibility`

Authority: Joe's report that choosing Explore Challenges briefly showed Floor 00, flashed repeatedly, and then ended on a browser error screen.

## Confirmed failure mode

- The previously deployed homepage and the merged-Lobby homepage referenced the same physical JavaScript and CSS asset paths with different query strings.
- The host returns the newest asset bytes for both query-string versions.
- A browser or embedded webview holding the pre-merge HTML could therefore run the merged-Lobby controller against an older seven-level document that still contained the separate Investigation screen.
- The old document order and the new controller order disagreed. That disagreement could make the scroll controller repeatedly select different levels during the Orientation-to-Lobby transition, matching the reported flashing and crash.

## Delivered repair

- Normalize a cached pre-merge document before the controller reads its levels:
  - remove the superseded standalone Investigation level and Start rail item;
  - canonicalize old Investigation entry links to `#lobby`;
  - replace an old Lobby frame with the approved merged Floor 00 content.
- Derive controller order from the normalized document instead of assuming a fixed level list.
- Handle homepage, menu, and skip-link Lobby entries through one explicit transition that closes the menu, updates the URL, and moves directly to Floor 00.
- Removed the old menu behavior that could return visitors to an arbitrary room instead of the Lobby.
- Bumped the homepage asset marker to `20261124-lobby-transition-v2`.

## Validation

- Repository suite: 56 of 56 tests passed after incorporating the concurrent services update from production.
- Browser acceptance passed with both current HTML and the pre-merge cached HTML from commit `5838ef5` while loading the current assets.
- The mixed-cache transition passed at desktop (1440 by 900), tablet (820 by 1180), and phone (390 by 844) sizes.
- In every tested case, Explore Common Challenges resolved to `#lobby`, Floor 00 was the active exploration level, and no level oscillation, page crash, request failure, console error, or uncaught browser error occurred.

## Publication path

The repair uses the existing `main` branch GitHub-to-Vercel production path.
