# Joe Capture List — /cowork

Single running list of what Joe needs to capture at his desk. Updated as each section locks.

Drop captured files into `Github Repos/site/cowork/assets/` using the exact filenames below. The page is wired to those names. When a file lands, the matching placeholder swaps to the real embed in the next commit.

---

## Section 1: Opening Proof Statement — LOCKED

**Status:** copy locked, visual assets pending.

Hero is a wide proof collage establishing standing in under 10 seconds. The visual goal: this is a real operating environment, not a demo environment.

### Files to capture

| Filename | What it shows | Notes |
| --- | --- | --- |
| `capacityos-scale.png` | Strongest CapacityOS screenshot at meaningful scale. Wide tile, top of collage. | Pick the view that shows volume + structure at a glance. Pulled from the highest-activity moment of recent days. |
| `cowork-team-feedback.png` | Conversation with the Claude CoWork product team showing early feedback. | Crop tightly to the substantive thread. Redact names if needed. |
| `cowork-skills-workflows.png` | CoWork skills, workflows, or operating structures view. | Whichever surface most clearly shows the skill/workflow layer rather than a single prompt. |
| `operational-work-in-flight.png` | Real operational work happening inside the system. Not a demo state. | Active client/consulting work mid-flow if possible. Personal usage works if commercial state can't be shown. |

### Capture tasks

- [ ] Grab CoWork-team conversation screenshot(s). Strongest single screenshot wins; multi-tile mosaic is fine too.
- [ ] Pick the strongest CapacityOS view for the wide hero tile. Volume + structure.
- [ ] Capture skills / workflows / operating structure view.
- [ ] Capture one live operational work view (in-flight).
- [ ] Optional: short caption sentence per image if you want one under any tile.

---

## Section 2 (page section 02): Inside Joe's CoWork Setup — WORKING DRAFT (Round 2)

**Status:** working draft per Joe's note. Copy not finalized. Visual concept B (diagram + screenshot) live as the dominant treatment; concepts A and C documented below.

### Metrics now on the page (Round 2 — Joe's feedback applied)

Joe's locked metric set: Flows, Sparks, Open Cards, Active Cards, Scheduled Events, Advancement Receipts. "Operating Cadences" was dropped as not communicating value; replaced with scheduled-events-per-week framing.

| Metric | Value | Source |
| --- | --- | --- |
| Flows | 139 | `flows/library/` file count |
| Sparks | 242 | IMG_7064 ("trigger library") |
| Open Cards | 67 | `work/` (47) + `work/on-hold/` (20) |
| Active Cards | 47 | `work/` file count (live cards in motion) |
| Scheduled Events / Week | 100+ | Derived from 1,150 lifetime rounds in `runtime/rounds/` over ~3 months; current cadence averages ~14 rounds/day across hourly + daily + weekly + monthly. |
| Advancement Receipts | 933 | IMG_7064 audit log volume |

### Leverage feature stat (Joe's "huge one")

Featured above the metrics row in a tan-bordered block:

> **~10×** Estimated work-per-Joe-hour leverage. For every hour Joe spends in the system, the agents run roughly ten hours of work in parallel.

Methodology:
- 933 advancement receipts in 47 days = ~20 receipts/day of system work.
- Joe-time engaged with the system: rough estimate ~2 hours/day = ~94 hours over 47 days.
- System-running time (hourly cadences run ~16 of 24 hours): ~750 hours over 47 days.
- Ratio system-active / Joe-engaged: ~8 to ~12, rounded to **~10×**.

Marked as estimate. Joe to refine when he has a clearer measurement.

Alternative framings if "~10×" feels wrong:
- "**~15** system actions per Joe-hour engaged" (receipts/hour basis).
- "**60 items advancing on their own while Joe is here talking to you**" (direct quote from IMG_7068 — strongest voice, weaker as a stat).
- "**24/7** system, ~2 hours of Joe-time per day" (temporal framing).

### Connected Tools & Integrations callout (new)

Added as the 5th callout in the flagship + callouts area: "The system operates across the tools where work already lives." Lightbox currently shows the parallel-dispatch screenshot as the proxy; can be swapped for a dedicated integrations visual later.

### Concept A (current): Flagship screenshot + interactive callouts only

Still live below the diagram. Five callouts: Work Management, Agent Workflows, Skills Library, Outputs & Artifacts, Connected Tools & Integrations. Each opens a zoom crop in the lightbox.

### Concept B (Joe's instinct, now live): Diagram + screenshot

Three-column system diagram added above the flagship area:

```
Inputs              System              Outputs
Gmail               CapacityOS          Daily briefs
Google Calendar     Flows               Content drafts (bank)
Google Drive        Skills              Operating plans
Twenty CRM          Work Cards          Decisions executed
GitHub              Sparks (intake)     Vercel deployments
Playwright          Cadences (4)        Operational artifacts
Firecrawl           Anchored Agents     Audit trail
Voice + chat        CLAUDE.md
```

The middle column (System) is highlighted with the tan accent. Arrows between columns. Diagram is the explainer; flagship screenshot + callouts below is the proof.

### Concept C (now live below B): Workflow-shaped swim lanes

Three rows, each row is one locked Section 01 workflow. Each row crosses left to right through Inputs → System → Outputs cells with arrow connectors. Lanes:

- **A. Daily Brief Assembly.** Gmail / Calendar / Drive / Prior state → Daily Brief skill + Hourly cadence + State-aware prioritization → One-page brief / Working doc / Reusable skill saved.
- **B. Review Queue.** Inbox captures / Card state changes / Pool admissions → Review Queue flow + Recommendation packets + 120-char framings → Joe decisions executed / Cards advanced / Advancement receipts.
- **C. Content Intake to Draft Bank.** Voice memos / Inbox notes / Chat captures → Content agent + Channel intelligence + Brand and voice pack → Channel-ready draft / Bank entry / Joe-publishes handoff.

The middle (System) column is highlighted with the tan accent matching Concept B. Concept C ties Section 02 directly to Section 01's three locked workflows — each workflow gets a visible end-to-end shape rather than appearing only as a tab below.

### Joe decision between B and C

- **Concept B reads as "this is a contained system."** Strong for the operating-environment claim.
- **Concept C reads as "watch work move through it."** Strong for the workflow narrative and ties back to Section 01.
- Both are live now. Pick one or keep both.

### Joe decisions owed

- [ ] Confirm Concept B as the direction (or build Concept C for comparison).
- [ ] Confirm or swap the 6 metrics. Skills count not included because no clean source — Joe to provide if wanted.
- [ ] Decide whether to keep all 5 callouts or trim (now that the diagram covers some of the same ground).
- [ ] Optional: dedicated Connected Tools visual to replace the parallel-dispatch screenshot in the integrations callout lightbox.
- [ ] Lock final copy.

---

## Section 3 (page section 03): Following Claude CoWork as It Evolved — LOCKED (museum artifact)

**Status:** locked per Joe's Section 3 note. Single screenshot, single caption, no extra cards.

### What landed

- Header: section label only ("03 Following Claude CoWork as It Evolved"). No h2 — lets the image breathe.
- Image: `evidence-feedback-in-practice.png` (Richard Kim screenshot) centered, max-width 560px, museum-artifact treatment.
- Caption: "Early March, only weeks after release. Workflow feedback from Joe was referenced in a Claude CoWork product update." (locked verbatim.)
- Layout: centered figure, generous whitespace, no surrounding card grid.

### What Joe owes

- [ ] Final cropped version of the screenshot (aggressive crop, date visible, Joe's feedback visible, Richard Kim's response visible). Replace `cowork/assets/evidence-feedback-in-practice.png` when ready.
- [ ] Optional: high-res version for the lightbox zoom view.

---

## Section 2 (legacy Round 1): Inside Joe's CoWork Setup — superseded

Flagship screenshot of CapacityOS at meaningful scale plus four right-side callouts. Each callout opens a zoomed crop in a lightbox modal.

### Files to capture

| Filename | What it shows | Notes |
| --- | --- | --- |
| `capacityos-flagship.png` | Wide flagship view of CapacityOS at scale. | The hero of this section. Pick the view that simultaneously shows structure, volume, repeatability, and operational usage. Single 16:11-ish ratio works best. |
| `zoom-work-management.png` | Crop showing real work moving through the system (work cards, lanes, in-flight items). | Tight crop of the work-management surface. |
| `zoom-agent-workflows.png` | Crop showing structured workflows / flows running rather than ad-hoc prompts. | Tight crop of the flows surface. |
| `zoom-skills-library.png` | Crop showing the skills library / reusable knowledge artifacts. | Tight crop of the skills surface. |
| `zoom-outputs-artifacts.png` | Crop showing generated reports, plans, content, or operational deliverables. | Tight crop of a recent artifacts output view. |

### Metrics row decisions you owe

Current placeholder values on the page:

- Flows: **139** (real)
- Active Work Cards: **47** (real)
- Skills: **30+** (placeholder)
- Active Workstreams: **6** (placeholder)
- Operating Loops: **14** (placeholder)
- Artifacts / 30d: **200+** (placeholder)

When you're back at desk, give me the final values to swap in. Also flag if you want any metric labels reworded or any metric swapped out.

### Privacy / redaction

- [ ] Confirm anything that must be blurred in the flagship screenshot (client names, deal values, personal data).
- [ ] Same redaction call per zoom crop.

### Capture tasks

- [ ] Select flagship CapacityOS screenshot
- [ ] Capture four supporting zoom crops (work mgmt, workflows, skills, outputs)
- [ ] Determine what must be blurred
- [ ] Confirm or replace the placeholder metric values
- [ ] Optional: plain-English label tweaks for any callout

---

## Section 1 (page section 01): Show the System in Motion — LOCKED (Round 2)

**Status:** workflow names, copy, before/after, and filenames updated to Round 2 lock. Three narrative documents written. Front-end pattern: tabs (Joe's options were tabs / carousel / switcher / interactive selector — tabs kept). Explainer videos still owed.

### Files renamed (Round 1 names → Round 2 names)

| Old | New |
| --- | --- |
| `motion-daily-doc.mp4` | `daily-brief-assembly.mp4` |
| `motion-review-session.mp4` | `review-queue.mp4` |
| `motion-content-draft.mp4` | `content-intake-to-draft-bank.mp4` |

### Narrative documents (new)

| File | Purpose |
| --- | --- |
| `cowork/narratives/daily-brief-assembly.md` | Drives the explainer video. Inputs / Process / Outputs / Why it matters. |
| `cowork/narratives/review-queue.md` | Drives the explainer video. Queue formation / Recommendation generation / Decision points / Resulting movement. |
| `cowork/narratives/content-intake-to-draft-bank.md` | Drives the explainer video. Idea capture / Workflow routing / Draft generation / Storage and reuse. |

Each tab on the page links to its narrative doc via "Read the workflow narrative."

### What Joe owes

- [ ] Review each narrative doc and refine.
- [ ] Capture supporting screenshots per workflow (Inputs / Workflow / Outputs / End state) — listed in each narrative.
- [ ] Record explainer videos (NotebookLM-style, narrative + visuals — not raw screen recordings) and drop the three .mp4 files into `cowork/assets/`.
- [ ] Decide whether to keep tabs or switch to carousel / interactive selector once content is in.

### Round 1 capture detail (kept for reference)

#### Workflow A: Daily Brief Assembly (was Daily Working Doc Generation)

**Status:** copy locked, three video slots live on the page. All three videos owed.

Joe chose to ship all three walkthrough workflows rather than one. The page hosts a vertical stack of three labeled video blocks. Together they cover scheduled cadence, human-in-the-loop decisions, and agent-produced deliverables.

### Video A: Daily Working Doc Generation (Scheduled Cadence)

- **Filename.** `motion-daily-doc.mp4`
- **Length.** 60 to 90 seconds.
- **What viewer sees.** Joe opens CapacityOS at start of session. Today's working doc is already built (deep work, rituals, open advancement). He scrolls one screenful, opens the round log that produced it (e.g., `RND-2026-05-29-daily-01.json`), glances at the next-hour cadence.
- **Sensitivity.** Lane names fine. Skim past any card naming clients or unannounced strategy.
- **Narration arc.**
  1. "This is what my workspace looks like when I sit down each morning."
  2. "It was assembled by an agent that runs on an hourly cadence."
  3. "It already knows what's locked, what's pending, what to prioritize."
  4. "Here's the round log that produced it."
  5. "And every hour, the next round refines it."

### Video B: Review Session Walk (Human-in-the-loop Decisions)

- **Filename.** `motion-review-session.mp4`
- **Length.** 60 to 90 seconds.
- **What viewer sees.** Joe says "review session, all." Agent surfaces 3 to 5 cards. Each gets a ~120-char plain-English screen with a recommendation and lettered options. Joe picks A or B fast. Card advances. Queue drops in real time.
- **Sensitivity.** Pre-filter the queue. Run against the pool review or a content lane for safest exposure.
- **Narration arc.**
  1. "I review the queue by talking to the agent."
  2. "It frames each card in 120 characters with a recommendation."
  3. "I pick A, B, or C."
  4. "The agent handles routing, lane updates, and follow-up state."
  5. "What used to be thirty minutes of triage now takes three."

### Video C: Content Bank Draft Flow (Agent-produced Deliverables)

- **Filename.** `motion-content-draft.mp4`
- **Length.** 60 to 90 seconds.
- **What viewer sees.** Captured idea distilled, content agent picks channel, drafts branded post in Joe's voice, lands in the bank "ready, awaiting Joe publish." Joe glances at the draft.
- **Sensitivity.** Use a neutral topic. Skip drafts referencing specific clients or unannounced strategy.
- **Narration arc.**
  1. "An idea lands in the system."
  2. "The content agent picks the right channel and drafts it."
  3. "It uses my voice, my brand, my visual identity."
  4. "It never publishes. The draft lands in the bank."
  5. "I review, refine, and publish."

### Capture tasks

- [ ] Record Video A and drop at `cowork/assets/motion-daily-doc.mp4`
- [ ] Record Video B and drop at `cowork/assets/motion-review-session.mp4`
- [ ] Record Video C and drop at `cowork/assets/motion-content-draft.mp4`
- [ ] For each: hold focus on movement, not explanation
- [ ] For each: confirm no client-sensitive material visible

---

## Section 4: Following Claude CoWork as It Evolved — TEMP LOCK

**Status:** copy locked, 4 evidence card slots live, screenshots pending.

Section makes the safe claim that Joe has been an early, serious practitioner who publicly explored CoWork's workflow potential and gave concrete product feedback. Hard guardrails: no implied endorsement by Anthropic, no claim of formal involvement with the CoWork team.

### Files to capture

| Filename | What it shows | Notes |
| --- | --- | --- |
| `evidence-feedback-in-practice.png` | Richard Kim (Claude CoWork team) reply: "Built this partially from your feedback!" referencing the Cowork Projects update. | Strongest single piece of evidence. Crop to include Joe's original feedback (folder-tracking friction) and Richard's reply. Date stamp visible. |
| `evidence-cowork-as-workflow-system.png` | Joe's reply in the Notion / personal-OS thread: "I'm preferring Claude cowork. I like cursor the best, but .mdc isn't broad and cowork just gets it faster even without it." | Include the parent post for context if it fits cleanly. |
| `evidence-parallel-dispatch.png` | Joe's tweet showing CoWork's parallel-dispatch workflow ("Pure Tuesday Agenda / EA Memory System / Gmail Label Triage / Google Stitch Eval — spinning up all four now"). | The mobile screenshot version with the orange highlighted user message reads well. |
| `evidence-decisions-and-actions.png` | Joe's reply to Animesh Koratana on "work as decisions and actions": "Yes. My whole Claude cowork is decisions and actions. YAML to orient. Pu scripts and json to save context windows. Slamming fast..." | Include the parent diagram for context. |

### Backup / additional candidates

Surfaced in chat but not currently wired to slots. Available if you want to swap any of the four primary cards:

- **Joe + Richard Kim earlier thread on brainstorm vs do mode.** Frames the original friction Joe raised before the Cowork Projects feature shipped. Could be a second image inside Card 01 if you want the full arc.
- **Joe's reply to King (Obsidian Zettelkasten) on tool roles.** Three-line breakdown: "obsidian intake/sync/quick ide; claude code cli; claude cowork app, dispatch app." Good supporting evidence for Card 02 if the Notion reply alone feels thin.
- **LinkedIn CoWork guide that Michaela found Joe through.** Highest-value piece if it can be sourced. You would need to provide the URL or a screenshot.

### Capture tasks

- [ ] Provide screenshot files for the four primary cards. Drop into `cowork/assets/` using the filenames above.
- [ ] Optional: links to the original X posts for each (used as supporting reference, not displayed on page).
- [ ] Confirm whether any names, handles, or timestamps need to be blurred. Default: leave Richard Kim's handle visible since it is the point of Evidence 01.
- [ ] If the LinkedIn CoWork guide is available, decide whether it earns a fifth card or replaces one of the current four.

### Guardrail rules wired into the section

The page already states: "All evidence is public. None of it implies endorsement by Anthropic or formal involvement with the Claude CoWork team." All on-page copy uses the safe-language frame (gave feedback, publicly explored, in conversation with product leadership, feedback was referenced).

---

## Section 5: A Different Way to Think About CoWork — LOCKED

**Status:** layout live with featured article card + two real supporting cards + one placeholder. Featured article source pending Joe confirmation.

### Featured article

**Title on page:** Stop Using CoWork Like a Chatbot
**Status:** title placed, summary drafted, cover image slot wired, "Read the article" link pending.

| Item | Action |
| --- | --- |
| Source URL or download | Joe to provide. LinkedIn URL, blog URL, or PDF. Page currently shows "Link pending Joe's source confirmation." |
| Cover image | Drop at `cowork/assets/article-stop-using-cowork-like-a-chatbot-cover.png`. Could be the LinkedIn cover, a branded header, or a clean screenshot of the article. |
| Summary copy | Drafted on page. Joe to confirm or rewrite: "A piece on treating Claude CoWork as an operating environment rather than a smarter chat surface. Argues that the most useful adoption move is not finding the right prompt, it is structuring the work CoWork should hold and the workflows it should run." |
| Attribution line | Already on page: "Michaela independently discovered this article. It directly contributed to the General Assembly conversation that produced this engagement." Confirm wording. |
| Optional excerpt | Could pull one strong paragraph from the article and place it under the summary. Joe to flag which one. |

### Supporting cards on the page

1. **Stop Treating AI Adoption Like a Workflow Problem** — links to live blog post at `/blog/stop-treating-ai-adoption-like-a-workflow-problem`. No action needed unless Joe wants the framing reworded.
2. **Claude CoWork Capability Map** — links to `/cowork/capability-map/`. No action needed.
3. **Placeholder: More CoWork mental-model posts** — reserved slot. Joe to source one or two more pieces (LinkedIn or blog) that expand the same operating-environment thesis. If nothing fits, the slot should be removed before sending.

### Capture tasks

- [ ] Confirm or replace the featured article title.
- [ ] Provide source URL (LinkedIn / blog / PDF) for the "Read the article" link.
- [ ] Drop `article-stop-using-cowork-like-a-chatbot-cover.png` into `cowork/assets/`.
- [ ] Confirm or rewrite the summary copy on the page.
- [ ] Decide whether to fill or remove the third supporting card.
- [ ] Optional: any engagement metrics (views, reactions, comments) that should be cited.

---

## Section 6: What I've Actually Used CoWork For — LOCKED (Option B tiering)

**Status:** copy on the page is best-guess from the existing capability map. Tier 1, Tier 2, Tier 3 sorting applied per Joe's lock. No external assets owed.

### What landed on the page

- **Tier 1 (visually dominant).** Six cards inside a tan-bordered featured block: CapacityOS, Skills Library, Work Card Pipelines, Recurring Operating Loops, CLAUDE.md Configuration, Cross-Tool Operational Flow.
- **Tier 2 (secondary).** Seven entries in a 2-column compact grid: pre-meeting briefing, inbox triage, content systems, client prep, workshop planning, multi-source research synthesis, strategic review loops.
- **Tier 3 (breadth only).** Single compact line: drafting, summarizing, brainstorming, basic research, one-off document generation.
- **Link to printable capability map** still present at the bottom of the section. The standalone `/cowork/capability-map/` page is unchanged for now (still the flat 6-category layout, designed to print). Decide whether to retire or retier it.

### Joe decisions owed

- [ ] Confirm Tier 1 set: are six the right items? Add or drop?
- [ ] Confirm Tier 2 set: add or drop?
- [ ] Confirm Tier 3 line: keep, expand, or remove entirely?
- [ ] Decide whether the standalone `/cowork/capability-map/` print page should be updated to the tiered format or left as the flat 6-category leave-behind. Recommendation: keep flat for print, tiered for screen. Both surfaces serve different purposes.
- [ ] Optional: short caption under any Tier 1 card referencing a concrete CapacityOS example.

### Possible reclassification swaps

If a Tier 2 item should be promoted or a Tier 1 item demoted, easy edits:
- Content systems (Tier 2) could plausibly be Tier 1 if framed as "anchored content agent with channel intelligence + bank + brand state."
- Cross-Tool Operational Flow (Tier 1) is borderline depending on whether reviewers see the policy/security layer as part of it.

---

## Section 7: The Shift — LOCKED (paired before/after + progression)

**Status:** built with Option A (before/after) paired with Option B (Chat → Project → Workflow → Operating System). No external assets owed.

### Why paired both options instead of choosing one

- Option A alone is the strongest emotional contrast: where you start versus where you end up. It creates the "I want that" moment.
- Option B alone shows the path between the two states with named stages a reviewer can place themselves on.
- Together they answer two different questions in one section: "what is the destination?" and "how does the journey work?" The before/after creates pull. The progression makes the pull concrete.
- Option C (Prompt → Skill → Flow → System) is intellectually cleaner but tethers to CapacityOS vocabulary the reviewer does not share yet. Documented as alternative below if Joe prefers it.

### What landed on the page

- **Headline.** "The biggest unlock in Claude CoWork is not learning more features. It is changing how you think about the tool."
- **Before/after comparison.** Two cards side by side with a single arrow between them. Before: "AI as a helper." After: "AI as work infrastructure." Each side has Joe's locked five bullets.
- **Progression model.** Four cards: Chat, Project, Workflow, Operating System. Stages 3 and 4 are visually highlighted (tan border + tinted background) to signal "this is where Joe's work lives."
- **Closing pull quote.** "The value is not in better prompts. The value is in creating reusable systems that compound over time."

### Alternative (Option C) if Joe prefers

Swap progression stages to:

| Stage | Name | One-line |
| --- | --- | --- |
| 01 | Prompt | A single instruction. Output is one-shot and disposable. |
| 02 | Skill | The same instruction, saved and parameterized. Runs on demand. |
| 03 | Flow | A sequence of skills triggered by time, event, or decision. |
| 04 | System | Skills + flows + work cards + persistent state across lanes. |

This is closer to CapacityOS internal vocabulary. Stronger if the reviewer already knows what a "flow" is in this context. Weaker for a cold enterprise reviewer.

### Joe decisions owed

- [ ] Keep paired layout, or simplify to one of A / B / C alone.
- [ ] If keeping B: confirm Chat / Project / Workflow / Operating System stage names.
- [ ] If swapping to C: confirm Prompt / Skill / Flow / System stage names.
- [ ] Confirm closing pull-quote line.
- [ ] Optional: add one concrete CapacityOS example under each progression stage (e.g., "01 Chat: a thread to brainstorm names" → "04 Operating System: CapacityOS").

---

## Epilogue: About This Page — LOCKED

**Status:** built and live. Footer-adjacent, restrained, real numbers.

Sits as an `<aside>` after Section 11 (Handling) and before the page footer, with reduced visual hierarchy. Smaller mono labels, compact stat row, expandable "How this came together" details block, italic coda line.

### Numbers currently shown

- **9 commits to production** (will update if more land before review).
- **12 page sections drafted** (hero/collage + section labels 01 through 11).
- **15+ operational artifacts referenced** (work cards, runtime files, flow library, content queue).
- **1 working session**.

### Joe decisions owed

- [ ] Confirm numbers are accurate or update.
- [ ] Confirm title "About this page" or swap for "Behind the Scenes," "One Last Thing," or "How This Came Together."
- [ ] Confirm body copy and italic coda line ("The systems on this page are not theoretical. They produced the page itself.").
- [ ] Decide whether the expandable details block stays or gets removed for even more restraint.

---

## Section 8 onward: pending Joe lock

(Will populate as each section locks.)

---

## Placeholder filenames currently wired into the page

Even if Joe wants different filenames, dropping anything at the path will work. These are the names the page expects right now:

- `cowork/assets/capacityos-scale.png` (hero, wide)
- `cowork/assets/cowork-team-feedback.png` (hero)
- `cowork/assets/cowork-skills-workflows.png` (hero)
- `cowork/assets/operational-work-in-flight.png` (hero)
- `cowork/assets/daily-brief-assembly.mp4` (Section 01 on page, Workflow A)
- `cowork/assets/review-queue.mp4` (Section 01 on page, Workflow B)
- `cowork/assets/content-intake-to-draft-bank.mp4` (Section 01 on page, Workflow C)
- `cowork/assets/evidence-feedback-in-practice.png` (Section 03 evidence 01)
- `cowork/assets/evidence-cowork-as-workflow-system.png` (Section 03 evidence 02)
- `cowork/assets/evidence-parallel-dispatch.png` (Section 03 evidence 03)
- `cowork/assets/evidence-decisions-and-actions.png` (Section 03 evidence 04)
- `cowork/assets/article-stop-using-cowork-like-a-chatbot-cover.png` (Section 04 featured article cover)
- `cowork/assets/capacityos-flagship.png` (Section 02 on page, flagship screenshot)
- `cowork/assets/zoom-work-management.png` (Section 02 callout 01)
- `cowork/assets/zoom-agent-workflows.png` (Section 02 callout 02)
- `cowork/assets/zoom-skills-library.png` (Section 02 callout 03)
- `cowork/assets/zoom-outputs-artifacts.png` (Section 02 callout 04)
- `cowork/assets/skill-speedrun.mp4` (Section 03 on page, builder proof video)

## Notes for swap pass

When files arrive, each placeholder block in `cowork/index.html` swaps from:

```html
<div class="placeholder-mark">...</div>
```

to:

```html
<img src="/cowork/assets/[filename]" alt="...">
```

or

```html
<video controls playsinline preload="metadata">
  <source src="/cowork/assets/[filename]" type="video/mp4">
</video>
```
