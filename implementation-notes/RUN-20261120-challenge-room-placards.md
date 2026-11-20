# Challenge-room placards

Run: `RUN-20261120-115126-djc-website-room-placards-direct`

Date: 2026-11-20

## Result

The homepage's 21 challenge rooms now use Joe's approved Play format:

- the static card retains the locked title and shows one feeling line;
- the open room shows two illustrated scenes, one insight, the exact Playbook
  session name and what happens in the hour, then a concrete outcome;
- the play name remains off the static card;
- the existing Inside the room note, collection action and contact action stay
  in place.

All existing room IDs and titles were preserved, so saved collections, deep
links and contact-query labels remain compatible.

## Source alignment

Seventeen placards use Joe's approved copy verbatim. Four open placards were
grounded in Facilitator Playbook revision
`35148fe498dcce634b1ff9572534e8e49db8fc47`:

- `same-ideas` uses `WS-004 The Opportunity Map` with `PL-037 Pattern Borrow`;
- `need-alternatives` uses `WS-016 Plan for Uncertainty`;
- `establish-the-floor` uses `WS-028 AI: Increasing Capability` and
  `PL-042 Practice Round`;
- `raise-the-floor` uses `WS-028 AI: Increasing Capability`, its reusable
  process maps and `PL-022 Gallery Heatmap`.

The public page does not expose internal IDs. No AI Activation Playbook content,
client claim, invented result or client story was introduced.

## Implementation

`assets/home-experience.js` now stores explicit `feeling`, `scenes`, `insight`,
`play`, `inHour` and `outcome` fields. Static and dynamic rendering consume only
the fields they need. The dialog applies semantic emphasis to The play I'd run
and You leave with while retaining its existing accessible structure and
actions.

The four newly drafted dynamic placards are approximately 90 words each. The
17 locked placards were not shortened even where the approved copy is longer.

## Validation

- `npm test`: 47/47 passed.
- Static acceptance proves 21 unique preserved IDs and titles, floor counts
  4 / 4 / 4 / 4 / 5, the new placard schema, exact approved feeling lines,
  Playbook-name counts, approved dynamic order, no deprecated room fields,
  no stage labels and no em dashes in placard copy.
- Existing collection, contact, deep-link, services catalogue and public-page
  regressions pass.
- `scripts/home-placards.browser.test.mjs` covers all 21 rooms at 1440 × 900
  and 390 × 844, opens every dialog, checks text structure, actions, collection
  title carry-through, contact-query title carry-through, overflow and console
  errors. The managed local shell could not launch a graphical browser, so this
  check is rerun against the published bytes through the available browser
  surface before the Run is closed.

## Boundaries

No room ID, locked title, collection storage key, contact handling, services
page, Thinking Museum source or website setting changed.
