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

## Section 2: Inside Joe's CoWork Setup — LOCKED

**Status:** copy locked, metrics values are best-guess placeholders, visuals pending.

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

## Section 3 onward: pending Joe lock

(Will populate as each section locks.)

---

## Placeholder filenames currently wired into the page

Even if Joe wants different filenames, dropping anything at the path will work. These are the names the page expects right now:

- `cowork/assets/capacityos-scale.png` (hero, wide)
- `cowork/assets/cowork-team-feedback.png` (hero)
- `cowork/assets/cowork-skills-workflows.png` (hero)
- `cowork/assets/operational-work-in-flight.png` (hero)
- `cowork/assets/harness-walkthrough.mp4` (Section 01 on page, primary proof video)
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
