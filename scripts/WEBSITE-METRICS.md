# Website number updates

The existing `npm run update:capacityos-stats -- --fetch` command refreshes
the single generated asset `assets/thinking/capacityos-metrics.js`.
Both desktop and mobile use it through `assets/thinking-game.js`. No browser
is needed to update or validate the numeric data.

## Coverage and sources

| Changing number | Source / calculation | Display bindings |
| --- | --- | --- |
| Managed repositories | Aggregate workspace plus direct private/public Git checkouts | Eight shared/mobile copies: CapacityOS title, inspector and passion; Attention inspector and passion; Who Is Joe mobile purpose and inspector; Control Room introduction |
| Synchronized repositories | Checkouts with HEAD even with upstream | CapacityOS static counter |
| Tracked files | Sum upstream tracked trees | CapacityOS activity statistics |
| Last-seven-day commits | Upstream commits in rolling168hours, excluding updater-subject commits | CapacityOS activity statistics |
| Tracked agent runs | Existing run-record paths, Runtime directory deduplication | CapacityOS activity statistics |
| Thinking Wiki graph links | Unique directed wikilinks in upstream Markdown | CapacityOS activity statistics |
| Published research records | Zenodo owner1737496 total records | Research static counter and mobile Research Papers record |
| Six research-project commit totals and latest-update dates | Fetched origin/main history for time-as-finality, temporal-issuance, gu-formalization, dynamic-unity, possibility-to-capability, continuity-ledger | Six mobile research exhibits |
| Caret total and last-30-day revisions, latest-update date | GitHub public main-branch commit endpoint and pagination | Existing shared data retained; current Caret exhibit has no numeric binding |
| Purity total and last-30-day revisions, latest-update date | Fetched origin/main history | Existing shared data retained; current Purity exhibit has no numeric binding |

Only aggregate numbers from private sources enter the public asset, never names,
paths, document content, or detailed private activity.

## Freshness and failures

Each source group has its own `freshness` date and current/retained status.
Only a successful fresh-source calculation advances that group's date.
An unavailable source retains its last-known values and date while independent
groups continue. Without any valid cached value the update fails rather than
inventing zero. Missing external data never silently becomes today's data.
Research publication displays use the Zenodo date, not the CapacityOS date.
`asOf` remains the CapacityOS aggregate date for compatibility.

Fetching only updates Git remote refs; no other checkout is pulled or edited.
Each Git operation and external request is bounded. Without `--fetch`, local
calculations may use cached refs but do not advance evidence dates; external
values stay cached. `--check` validates the saved snapshot without network,
writing, or introducing a second moving clock. `npm test` checks source
bindings, calculations, response parsing, failure isolation, and dates.

## Numbers deliberately not refreshed

Historical evidence (2017 CityKey, more than100 startups advised, more than15
years DJ experience), quoted third-party study results with their original
dates, offer/floor/stage numbers, the12-capability model, and illustrative
UI/scoring constants are not live operational counters. Refreshing those by
calendar would invent facts or change the method. No layout, navigation,
forms, sitemap, or semantic upkeep is part of this updater.

Future changing counters should use this same asset and receive a source,
formula, display binding and test here rather than a second updater.
