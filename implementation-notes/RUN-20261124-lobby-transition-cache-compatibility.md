# Lobby Transition Cache Compatibility

Run: `RUN-20261124-lobby-transition-cache-compatibility`

Authority: Joe's report that choosing Explore Challenges briefly showed Floor 00, flashed repeatedly, and then ended on a browser error screen.

## Confirmed failure mode

- The previously deployed homepage and the merged-Lobby homepage referenced the same physical JavaScript and CSS asset paths with different query strings.
- The host returns the newest asset bytes for both query-string versions.
- A browser or embedded webview holding the pre-merge HTML could therefore run the merged-Lobby controller against an older seven-level document that still contained the separate Investigation screen.
- The immediately preceding merged-Lobby HTML also pointed its end-of-Orientation CTA to `#lobby` without the new direct-transition marker.
- These cached documents could either disagree with the controller's level order or bypass the explicit Lobby transition, matching the reported flashing and crash from the end-of-Orientation link.

## Delivered repair

- Normalize a cached pre-merge document before the controller reads its levels:
  - remove the superseded standalone Investigation level and Start rail item;
  - canonicalize old Investigation entry links to `#lobby`;
  - recognize cached `#lobby` entry links from the immediately preceding deployment and attach the direct-transition behavior;
  - replace an old Lobby frame with the approved merged Floor 00 content.
- Derive controller order from the normalized document instead of assuming a fixed level list.
- Handle homepage, menu, and skip-link Lobby entries through one explicit transition that closes the menu, updates the URL, and moves directly to Floor 00.
- Removed the old menu behavior that could return visitors to an arbitrary room instead of the Lobby.
- Added server fallbacks for slash-style `/lobby`, `/floors`, `/floor/...`, `/exhibit/...`, `/collection`, `/basement`, and legacy Investigation paths. The homepage router canonicalizes each fallback to its hash route before initialization.
- Changed every public Explore Challenges entry, including the final Orientation CTA, from an in-document hash jump to a clean `/lobby` navigation. This forces the current homepage runtime to load before entering Floor 00 and avoids relying on the failing in-page transition in an already-open browser tab.
- Made `/lobby` the canonical Floor 00 URL. The router no longer rewrites it to `/#lobby`, and legacy `/#lobby` URLs canonicalize to plain `/lobby` before initialization.
- Bumped the homepage asset marker to `20261124-lobby-transition-v5`.

## Validation

- Repository suite: 56 of 56 tests passed after incorporating the concurrent services update from production.
- Browser acceptance passed with current HTML, the pre-merge cached HTML from commit `5838ef5`, and the immediately preceding merged-Lobby HTML from commit `d8e0528` while loading the current assets.
- The mixed-cache transition passed at desktop (1440 by 900), tablet (820 by 1180), and phone (390 by 844) sizes.
- In every tested case, Explore Common Challenges resolved to `#lobby`, Floor 00 was the active exploration level, and no level oscillation, page crash, request failure, console error, or uncaught browser error occurred.
- Live route-matrix acceptance covered Lobby, all five Floors, a room, an open exhibit, collection review, the basement, legacy aliases, and Explore Challenges links from Services, About, Pricing, Contact, and Privacy on tablet and phone.
- The same route matrix passed against the three homepage versions a browser could still have cached.
- Homepage, navigation, footer, services, and contact-return links all use the same clean `/lobby` entry route.

## Publication path

The repair uses the existing `main` branch GitHub-to-Vercel production path.
