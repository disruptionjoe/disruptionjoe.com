# Commercial header and footer consistency

Run: `RUN-20261120-commercial-shell-consistency`

Authority: Joe's direct 2026-11-20 request for a consistent header and footer across the main consulting experience, with the existing Disruption Joe brand returning to the homepage beginning and Contact Joe plus the hamburger always available.

## Delivered update

- Used the existing Disruption Joe brand and mark as the top-left return path. No separate Home or Home Start label was introduced.
- Added the brand return path to both homepage states: the main Orientation and Explore Challenges.
- Standardized How I Can Help, Pricing, About Joe, Contact, and Privacy on a compact commercial header with the Disruption Joe brand at left and Contact Joe plus the hamburger at right.
- Kept the approved six-destination menu inside the hamburger on each commercial page.
- Added the shared footer to Contact, which was the only conventional commercial page missing it.
- Preserved the existing footer destination set across all five conventional commercial pages.
- On narrow Explore screens, collapsed View Collection to its collection icon and count badge so the brand, Contact Joe, LinkedIn, and hamburger fit without overlap.
- Left the Thinking Museum, Method, and other legacy or standalone routes outside this commercial shell.

## Validation

- Repository test suite: 48 of 48 passed.
- Headless Chrome acceptance passed at 1440 by 900, 768 by 1024, and 320 by 700.
- All five conventional pages displayed the brand, Contact Joe, hamburger, six menu destinations, and seven footer destinations without horizontal overflow.
- Both homepage states displayed the same Disruption Joe brand return path without colliding with their right-side controls.
- Hamburger open, Escape-close, and outside-click behavior passed.
- The Thinking Museum and Method remained outside the new commercial shell.
- Browser acceptance reported no console errors.

## Publication path

The update uses the existing `main` branch GitHub-to-Vercel production path. The commercial asset marker is `20261120-commercial-shell-v1`; the homepage marker is `20261120-shell-v1`.
