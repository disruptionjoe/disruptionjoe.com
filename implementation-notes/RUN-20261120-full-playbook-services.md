# Full Playbook on How I Can Help

Run: `RUN-20261120-113944-djc-website-full-playbook-direct`

## Source

- Website baseline: `origin/main` at `41bea2491fb498c9b54506aa68e74d5d06e82854`
- Facilitator Playbook: `disruptionjoe/facilitator-playbook` at `35148fe498dcce634b1ff9572534e8e49db8fc47`
- Source catalogue: `sessions/index.md` and the 29 linked working-session files

## Change

- Replaced the partial 14-card Conversation Playbook with all 29 current working sessions.
- Added Learn and Absorb as the fourth public category.
- Updated the public names to the current Playbook names.
- Grounded every card in the session's Situation and Output sections while keeping the public copy concise.
- Added stable, non-visible session IDs and a regression test for title, category, count, and alias drift.
- Preserved the page architecture, navigation, discovery-call path, and the rest of the site.

## Validation

- `npm test`: 46 of 46 tests passed.
- Playbook regression: 29 unique sessions with category counts 7 / 14 / 5 / 3.
- `git diff --check`: passed.
- Public-copy em dash check: passed.
- Local HTTP preview: `/services/` returned 200 and served all 29 session cards.
- Graphical browser preview was unavailable because the local preview origin was not approved. No browser-policy workaround was attempted.

## External boundary

The authorized repository commit and non-force GitHub push are part of this batch. No separate hosting or deployment API action is included.
