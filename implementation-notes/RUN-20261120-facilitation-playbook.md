# Facilitation Playbook public page

Run: `RUN-20261120-161318-djc-website-facilitation-playbook-direct`

## Purpose

Publish a public, source-generated view of Joe's Facilitation Playbook while
keeping it fully separate from the existing AI Activation Playbook.

## Source boundary

- Facilitation source: private `disruptionjoe/facilitator-playbook` revision
  `35148fe498dcce634b1ff9572534e8e49db8fc47`.
- Generated public records: 29 working sessions, 40 plays, and 11 techniques.
- Excluded: style, planning-call, programs, inventory, review log, glossary, ID
  migration, former IDs, statuses, and all other private supporting material.
- `scripts/generate-facilitation-playbook.mjs` reads the pinned Git revision
  directly and writes `assets/facilitation-playbook-data.json`; public source
  content was not hand-copied.

## Route inventory and disposition

The prior AI Activation Playbook had one website-backed route:

- `/playbook` → `playbook/index.html`

No files, rewrites, or links established an old `/playbook/<x>` subpage. The
existing `/book` and `/book/:match*` aliases both redirected to the AI page's
root. Direct inbound links existed in `method/index.html` and
`assets/thinking-game.js`, and the route appeared in `sitemap.xml`.

Disposition:

- `/playbook` and `/playbook/` now serve the Facilitation Playbook.
- `/ai-activation-playbook` and `/ai-activation-playbook/` serve the relocated
  AI Activation Playbook.
- `/book` and `/book/:match*` permanently redirect to
  `/ai-activation-playbook`.
- There were no old AI `/playbook/<x>` subpages requiring individual permanent
  redirects. No speculative wildcard was added because it could collide with
  the new root page's trailing-slash route.
- Card views use query parameters and anchors on `/playbook`; no path-based
  card routes are created.

## AI Activation content integrity

The relocated AI Activation HTML matches the starting file byte-for-byte:

- HTML SHA-256: `4b21f65c02155681e021aaa8289aeecbcc55a9ebebb84ae86ff3106c1e90a8f5`
- CSS SHA-256: `e88476924e32724a855c6b58ad40a27e23b8d6d94121be4b9bab50ad032a2e2e`
- JavaScript SHA-256: `df58add79ce8863d2db1690afc0b3603466030ec723cfa98ea01395b9380bfb3`

Only its route, inbound links, public menu label, sitemap location, and legacy
aliases changed.

## Facilitation page

- Architectural card shelf matching the site's black, tan, and gold system.
- Search and kind toggles for Sessions, Plays, Techniques, and All.
- Seven combinable URL-backed filters with AND semantics.
- Session cards include situation, output, linked default play sequence,
  relationships, and discovery-call action.
- Play cards include purpose, book tags, Default, Say, Dial it, Variants, AI,
  and relationships.
- Technique cards include purpose, Do, Say, and sequence-derived relationships.
- Relationship links open individual cards or a shareable related-card view.

## Validation

- Full repository suite: 55 of 55 tests passed.
- Generated counts, source revision, exclusions, required fields, IDs, links,
  relationships, filters, menus, routes, and content boundaries are covered.
- Both local pages and the generated data returned HTTP 200.
- Sitemap XML, Vercel JSON, JavaScript syntax, whitespace, and declared
  footprint checks passed.
- Responsive source rules collapse the filters and card grid to one column at
  mobile widths and honor reduced-motion preferences.
- Graphical browser verification was unavailable because the in-app browser
  surface was not available. No alternate browser-control path was improvised.

## Boundaries preserved

- No write to `disruptionjoe/facilitator-playbook`.
- No content from the AI Activation Playbook entered the Facilitation page.
- No services-page session name or Conversation Playbook content changed;
  only the authorized global menu entries were added.
