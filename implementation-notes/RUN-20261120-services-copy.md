# How I Can Help copy update

Run: `RUN-20261120-160236-djc-website-services-copy-direct`

## Purpose

Apply Joe's approved `/services` framing around the Conversation Playbook without
changing the catalogue itself.

## Public change

- Replaced the opening with **A better way of working together.** and the
  approved explanation of Joe's conversation-design focus and Momentum Session
  offer.
- Replaced the Figure It Out, Get Organized, and Make the Move descriptions
  with the approved buyer-facing language.
- Replaced the bridge under the cards with the approved one-hour alternative to
  letting a known conversation drag on for weeks.
- Changed the closing to **Two ways to get started.** with the two approved path
  headings.
- Preserved both closing-card body paragraphs and button labels.
- Verified that Contact Joe and Pricing were already present in the commercial
  menu and footer.
- Updated the `/services` sitemap lastmod to `2026-11-20`.

## Preserved boundary

The complete Conversation Playbook section, from its containing section open to
the start of the closing section, matches revision
`82b6ae846d0afcc7bb253ef019576b27f3f484e6` byte-for-byte. Its 29 working
sessions and category structure remain unchanged for the separate alignment
work.

## Validation

- `npm test`: 49 of 49 tests passed.
- Exact approved copy and order are covered by a focused services test.
- The existing commercial-shell tests confirm Contact Joe and Pricing in the
  menu and footer.
- The mobile breakpoint remains a one-column layout for the category grid,
  closing grid, and Playbook category headings; this batch changes copy only and
  does not alter responsive CSS.
- `sitemap.xml` parses with the current services lastmod.
- No em dash appears in `services/index.html`.
- `git diff --check` and the bounded-footprint check pass before publication.

## Verification limit

The environment's saved browser security policy blocks browser-origin access,
so this Run does not claim a new graphical mobile screenshot or console capture.
Responsive source structure and repository tests pass, and the deployed public
bytes are checked after publication.

## Boundaries

No Conversation Playbook card, site-wide navigation structure, contact path,
pricing copy, analytics, deployment setting, or website page outside the
approved services footprint was changed.
