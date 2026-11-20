# Homepage LinkedIn control

Run: `RUN-20261120-homepage-linkedin-control`

Authority: Joe's direct 2026-11-20 request for a LinkedIn button beside Contact Joe and the homepage hamburger control.

## Delivered update

- Added a compact LinkedIn icon control between Contact Joe and the hamburger during the orientation.
- Added the same control in the exploration header so it remains available throughout the Challenge Investigation.
- Linked both controls to the repository's established `https://linkedin.com/in/disruptionjoe` profile in a new tab.
- Reused the existing LinkedIn icon and homepage control styling rather than introducing a new navigation pattern.

## Validation

- Repository test suite: 43 of 43 passed.
- Headless Chrome acceptance passed at 1440 by 900, 390 by 844, and 320 by 568.
- The complete exploration control group remained inside the viewport with View Collection visible.
- Control order is Contact Joe, LinkedIn, and hamburger, with View Collection preceding them when applicable.
- Browser acceptance reported no console errors.

## Publication path

The update uses the existing `main` branch GitHub-to-Vercel production path. The homepage asset marker is `20261120-momentum-v5`.
