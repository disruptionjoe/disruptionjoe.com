# Services additions

Run: `RUN-20261124-092946-djc-website-services-additions-direct`

## Purpose

Extend the already-shipped `/services` brief with Joe's approved fourth-card
language, a clearer handoff from discovery to the right session, and a bounded
view of larger engagements powered by the same methods.

## Public change

- Updated Learn and Absorb to cover new skills, major change, and stories worth
  rallying behind.
- Added the line explaining that the discovery call can be the diagnosis and
  lead directly to the needed session.
- Added Beyond a single session between the Conversation Playbook and the Two
  ways to get started closing.
- Named offsites and leadership retreats, Session Arcs, AI activation and
  enablement, and ongoing advisory.
- Linked the larger-engagement section to `/pricing/` for current prepaid
  options.
- Updated the `/services` sitemap date to `2026-11-24`.

## Source grounding

The earlier approved `/services` opening, first three outcome cards, familiar
conversation bridge, and two-path closing were already present on current
`origin/main` and remain in place. The Facilitator Playbook uses `Session Arc`
as its canonical term at revision
`efd3e096576622a91b04665e8248025e829c918a`, so the public copy keeps Joe's
requested `Session arcs` label. The current pricing page uses prepaid hours for
series of sessions, preparation, follow-through, workshops, and offsites.

## Boundaries

The 29-session Conversation Playbook section is unchanged. No pricing, Playbook,
contact, analytics, deployment configuration, or homepage source changed.

## Validation

- `npm test`: 56 of 56 tests passed.
- Focused headless Chrome acceptance passed at desktop `1440x900`, tablet
  `1024x768`, and phone `390x844`.
- The four outcome cards render as four, two, and one columns at those
  respective widths. The larger-engagement list renders as two, two, and one.
- The diagnosis line, Beyond a single session heading, and pricing link are
  visible at every tested size.
- Every tested size has zero horizontal overflow, zero console errors, and zero
  page errors.
- Focused screenshots confirm balanced spacing and readable hierarchy on
  desktop and phone.
- The Conversation Playbook section retains starting hash
  `acf17eb511e752f453110d6e876d6441a63c65f22c3504de0a14d4198151f9a7`.
