# WI-050 Build Receipt

Date: 2026-07-07

Status: full WI-050 implementation built and verified locally; production deployment authorized next.

## What Changed

- Archived the prior website source locally under `_local/archive/website-pre-wi-050-2026-07-07/`.
- Removed prior public route content, prior public assets, old build scripts, and old route machinery from the live worktree.
- Loaded the WI-050 architecture, voice, guardrail, and mood-board source files into `implementation-notes/wi-050/`.
- Added the new live spine:
  - `/`
  - `/services`
  - `/method`
  - `/playbook`
  - `/enablement`
  - `/thinking`
  - `/about`
  - `/contact`
  - `/privacy`
- Used the Architecture Moodboard as design inspiration, not as literal live page imagery.
- Rebuilt the shared CSS, JS, route HTML, sitemap, robots file, Vercel route config, `llms.txt`, and `THE-STUDIO.md` around the WI-050 direction.
- Replaced the contact API with a narrow fresh contact endpoint for this build.

## Guardrails Preserved

- Home evidence started as curation slots instead of invented proof.
- Prompts appear as part of the system only where relevant, not as the homepage center.
- AI Accelerated Thinking is built as an environment with zones and an entrance moment.
- The About copy avoids the sharper "allergic to empty AI theater" phrase.
- Client-specific proof assets remain gated until public-safe artifacts are confirmed.

## Post-Review Homepage Prototype Pass

- Joe flagged that the build still felt too close to old website residue and used mood-board imagery too literally.
- The next implementation pass was narrowed to the homepage only so Joe can grade the design pattern before applying it elsewhere.
- The homepage hero now uses generated CSS architecture: operating map, corridor lines, labeled rooms, rails, nodes, and an inspectable caption instead of a literal mood-board image.
- The homepage progression now reads as a single operating environment: entry map, capability runway, shape room, artifact wall, back-room method diagram, and planning surface.
- Lane 2 images remain available as future metaphor references, but the live build does not ship literal mood-board images.

## Lane 1 Environment Correction

- Joe provided a sharper critique: Lane 1 must become the website environment, not a diagram card, side image, hero illustration, or decorative texture.
- Saved the correction as `website-redesign-correction-lane-1-environment-2026-07-07.md`.
- Updated `THE-STUDIO.md` so Lane 1 is now the governing visual system, while field-manual/notebook/card motifs are explicitly demoted to supporting artifacts only.
- Rebuilt the shared `assets/site.css` so Lane 1 is the governing environment across the full site.
- Removed the boxed hero diagram pattern. The homepage now uses a full-hero architectural wireframe environment with floating organizational signals and an open threshold field.
- Adjusted the capability runway so it reads as one architectural sequence instead of static tiles at the review viewport width.

## Homepage Review Adjustment

- Changed the second bottleneck step from `Shared Practice` to `Capability`.
- Changed the adoption-economics interaction so the visible controls say `Cost`, `Savings`, and `Leverage`; line/circle/sphere remain visual metaphors only.
- Updated the interaction copy:
  - Cost: training, workflow optimization, and uneven experimentation cost the business money.
  - Savings: ordered, consistent, measurable workflows start saving money.
  - Leverage: better data compounds through improved agent loops toward an organizational agent operating system.
- First evidence pass named real curation targets rather than generic placeholders:
  - People: synthesis PowerPoint from participant responses.
  - Organizations: use-case map or friction map.
  - Thinking: old coWork workflow video evidence.
- Read-only archive scan found old coWork assets in the archived pre-WI-050 website zip, including workflow videos and supporting evidence images. These remain curation candidates, not live public proof.
- Simplified the homepage palette: nav is black, major surfaces are black, primary CTA is solid tan, and ambient gradient washes were reduced so architectural linework carries the visual theme.

## Full-Site Lane 1 Pass

- Applied the Lane 1 architectural environment across Home, Services, Method, Playbook, Enablement, Thinking, About, Contact, and Privacy.
- Removed literal mood-board image tags from the live pages.
- Replaced route visuals with CSS-built instruments: operating table, method chamber, activation threshold, architecture gap, capability map, studio zones, signal field, and planning table.
- Kept AI Accelerated Thinking as the most immersive page, with a loader moment, sticky zone navigation, and chamber-like Practice / Passion / Purpose zones.
- Reduced repeated final-surface uses of `capability`; the word remains where structurally important.

## Evidence And Governance Cleanup

- Removed the internal generated homepage label from the public page.
- Replaced public placeholder evidence cards with real public artifact images from the prior public coWork site:
  - people feedback in practice
  - operating trace / work in flight
  - parallel dispatch thinking trace
- Later corrected this framing: those images are mock/sample evidence-shape artifacts, not verified literal evidence claims, so the homepage now labels them as mock artifacts.
- Added root `BRAND-DESIGN.md` and `BRAND-VOICE.md` so future agents see the active WI-050 standards before older source notes.
- Updated `AGENTS.md`, `THE-STUDIO.md`, and this WI-050 README to make the root standards authoritative.
- Moved the earlier mood-board working direction into `implementation-notes/wi-050/archive/superseded/`.
- Left client-safe use-case maps, friction maps, response decks, and private session artifacts as future curation items only.

## Verification

- `npm test`
- `node --check api/contact.js`
- static route and asset check
- browser route check in Chrome against local server
- mobile overflow check
- interaction checks for mobile nav, shape tabs, Playbook tabs, and Thinking zone navigation
- homepage-specific browser check after Lane 1 correction: no old shared stylesheet, no mood-board images, no horizontal overflow, no console errors
- homepage-specific browser check after review adjustment: Cost/Savings/Leverage controls update to the revised copy; nav background is black; no old shared stylesheet, no mood-board images, no horizontal overflow
- full-site local route check: all live routes return 200
- full-site browser check: all routes use `/assets/site.css`, no former homepage-only stylesheet reference, no horizontal overflow, no console errors
- mobile browser check at 390px width: no horizontal overflow and all architectural devices retain rendered dimensions

Local verification URL during build: `http://127.0.0.1:4173/`
