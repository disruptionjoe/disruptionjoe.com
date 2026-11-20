# Challenge-room expansion

Run: `RUN-20261120-154818-djc-website-room-expansion-direct`

## Purpose

Expand the homepage Challenge Investigation from 21 to 31 rooms using ten
Joe-approved buyer challenges and the current Facilitator Playbook as the source
of truth for session names, mechanics, and outcomes.

## Public change

- Added one room to Better Momentum.
- Added two rooms to Better Decisions.
- Added four rooms to Better Understanding.
- Added two rooms to Better Possibilities.
- Added one room to Better AI Results.
- Preserved the existing 21 room IDs, titles, copy, ordering, and saved-room
  behavior.
- Updated the homepage orientation count from 21 to 31.
- Kept the homepage sitemap entry current at `2026-11-20`.

The new rooms use stable IDs and the existing placard data shape. The static
card keeps the Playbook name hidden. The open-room view presents scenes,
insight, the session Joe would run, what happens in the hour, and the concrete
output.

## Source grounding

The implementation uses Facilitator Playbook revision
`35148fe498dcce634b1ff9572534e8e49db8fc47` and these sessions:

- Kick Off the Project
- Team OKR Setting
- Leadership Goal Setting
- Blameless Retrospective
- The RAID Review
- Reset After Change
- Team Health Check
- Run a Better Offsite
- Build the Roadmap
- AI: Define Our Strategy

## Validation

- `npm test`: 48 of 48 tests passed.
- Exactly 31 unique room IDs, with floor counts `5 / 6 / 8 / 6 / 6`.
- All ten new dynamic placards are under 110 words and contain no em dash.
- Focused browser acceptance now covers all 31 rooms, desktop and phone widths,
  the eight-room floor's nine dots and `Room 08 / 08` counter, and saving a new
  room into the collection/contact URL.
- Local graphical execution was attempted with the repository's Playwright
  test, but the local browser process and managed browser origin were blocked by
  the environment. This is an execution limit, not a test failure. Live public
  verification follows deployment.
- `git diff --check` and the bounded-footprint check pass before publication.

## Boundaries

No existing room ID changed. No contact form, analytics, deployment setting,
Playbook repository, or website page outside the approved homepage footprint
was changed.
