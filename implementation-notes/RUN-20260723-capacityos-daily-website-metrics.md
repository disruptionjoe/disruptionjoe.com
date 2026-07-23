---
class: runtime
status: completed
run_id: RUN-20260723-capacityos-daily-website-metrics
run_type: progress
mode: execute
started: 2026-07-23T16:38:00-05:00
completed: 2026-07-23T16:47:49-05:00
lane_selection:
  owner_id: djc-website
  lane_id: "1"
  manifest_revision: 1
  definition_revision: 1
  control_revision: 1
  directed_flow_revision: null
  work_ref: Joe direct chat, 2026-07-23 daily CapacityOS website updater
---

# Daily CapacityOS Website Metrics Run

## Objective

Make the CapacityOS center console visibly active through daily, source-backed
system counters on its static and dynamic placards.

## Result

- Added a generated browser asset containing only public aggregate metrics and
  its Chicago-calendar as-of date.
- Replaced the static console's prior structural trio with one prominent count
  labeled `REPOSITORIES SYNCHRONIZED`.
- Replaced the dynamic placard's structural counters with:
  - tracked files, total
  - commits in the rolling last seven days
  - tracked agent runs, total
  - unique directed Thinking Wiki graph links
- Changed the CapacityOS dynamic kicker to
  `Live system activity / updated daily`.
- Added `scripts/update-capacityos-stats.mjs`, which can refresh remote refs,
  calculate the metrics, and update only the generated browser asset.
- Added package commands for updating and checking the generated data.
- Preserved CapacityOS's viewer-facing placard behavior, extended proximity
  range, purpose/passion copy, center installation, and mobile assignment.

## Metric definitions

- `repositories synchronized` counts CapacityOS plus direct private/public
  repository checkouts whose local `HEAD` is even with its fetched upstream.
- `tracked files` sums files in all 37 current upstream repository trees.
- `commits · last 7 days` sums the rolling 168-hour upstream history and
  excludes commits whose subject begins
  `Update CapacityOS website activity metrics`, preventing the updater from
  inflating its own activity counter.
- `agent runs · tracked total` counts source-preserved run records under
  repository `agent-runs`, `steward/runs`, root `runs`, and System Runtime
  `meta/runs`, deduplicating multi-file current Runtime run directories.
- `Thinking Wiki graph links` counts unique directed Obsidian-style wiki-link
  edges across the upstream tracked Markdown vault.
- The updater fetches remote references but never pulls or modifies another
  repository's working tree.

## Initial source-backed values

- 33 repositories synchronized out of 37 managed Git repositories
- 15,013 tracked files
- 2,134 commits in the last seven days
- 3,389 tracked agent runs
- 675 Thinking Wiki graph links

The synchronization count is intentionally allowed to fluctuate when remote
work lands before the corresponding local checkout is updated.

## Verification

- Full `--fetch` updater mode completed across all 37 repositories.
- The generated-data freshness check passed.
- `npm test` passed the complete JavaScript syntax suite, including the
  generated metrics asset.
- `git diff --check` passed.
- Headless Chrome rendered both CapacityOS placards with no page errors or
  failed requests.
- The static screenshot shows the synchronization count on the viewer-facing
  center-console panel.
- The dynamic screenshot shows all four formatted counters, their time
  qualifiers, and the daily-activity kicker without overflow.

## Receipt

Implementation commit pending.

No non-GitHub external action was performed during website implementation. The
separately authorized recurring Codex automation is recorded by the Codex app.

## Outcome reason

`CapacityOS now looks and behaves like an active operating system whose public
aggregate counters can change every day.`
