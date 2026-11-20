# Open placard navigation

Run: `RUN-20261120-open-placard-navigation`

Authority: Joe's direct 2026-11-20 request to let visitors keep a dynamic challenge placard open while moving between rooms and Floors.

## Delivered update

- Sideways swipes on an open placard move to the previous or next room and replace the placard content without closing it.
- Vertical swipes continue to scroll longer placards normally. At the top or bottom boundary, the same gesture moves to the adjacent Floor while keeping the placard open.
- Trackpad gestures provide the same horizontal room and boundary-based vertical Floor navigation on desktop.
- Arrow keys move between rooms and Floors while a placard is open.
- The underlying elevator, room position, URL, collection button, and contact link stay synchronized with the placard currently shown.
- The existing Close control remains available.

## Validation

- Repository test suite: 48 of 48 passed after reconciling the concurrently published Playbook-grounded placard update.
- Headless Chrome acceptance passed for desktop trackpad, keyboard, and boundary-wheel navigation.
- Touch-enabled tablet acceptance passed for sideways room swipes, normal placard scrolling, and boundary-based Floor swipes.
- The integrated browser suite also passed all 21 current Playbook-grounded placards at desktop and phone widths.
- The placard remained open throughout each navigation path and no console errors were reported.

## Publication path

The update uses the existing `main` branch GitHub-to-Vercel production path. The homepage asset marker is `20261120-placards-v3`.
