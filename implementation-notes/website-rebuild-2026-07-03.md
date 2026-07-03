# Website Rebuild Working Log - 2026-07-03

Status: active implementation  
Owner: Codex in current Cowork thread  
Repo: `C:\Users\joe\JB\CapacityOS\repos\public\djc-website`  
Planning source: `C:\Users\joe\JB\CapacityOS\repos\private\joeops\programs\public-presence\surface-briefs\Website-phase-4-content-planning.md`

## Objective

Rebuild the Disruption Joe Consulting website around the completed architecture and content plan.

The implementation should feel like a memorable spatial experience, not a conventional consulting website. The experience should teach the method: visitors move through spaces that reveal progression, architecture, behavior change, evolving methods, personal trust, and a calm next step.

## Non-Negotiable Boundaries

- Do not deploy or publish externally.
- Do not delete current pages or routes without explicit approval.
- Preserve the existing AI Enablement Architecture experience as a major proof asset unless a later visual review shows it needs targeted refinement.
- Keep the stable architecture intact:
  - Home
  - Services
  - Method
  - AI Activation Playbook
  - AI Enablement Architecture
  - AI Accelerated Thinking
  - About
  - Contact Joe
- Keep website changes in this repo and commit/push coherent batches.

## Creative Direction

- Build spaces, not generic pages.
- Use architectural depth, lighting, physicality, and restrained theatricality.
- Movement must communicate something or reward discovery.
- Prefer fast and immersive over beautiful and slow.
- Home should be restrained; Services and Method more architectural; AI Accelerated Thinking most theatrical; About restrained again; Contact calm.
- Voice: warm, plainspoken, thoughtful, confident, generous.
- Avoid em dashes and repetitive contrast phrasing.

## Route Plan

Primary routes to implement or rebuild:

- `/` -> Home
- `/services` -> Services
- `/method/` -> Method hub
- `/playbook/` -> AI Activation Playbook
- `/enablement/` -> AI Enablement Architecture
- `/thinking/` -> AI Accelerated Thinking studio
- `/about` -> About
- `/contact` -> Contact Joe

Legacy or adjacent pages should remain in place unless explicitly approved for removal.

## Implementation Chunks

1. Foundation and shared spatial system
   - Create shared CSS and JS for the rebuild.
   - Define navigation, typography, spatial sections, lighting, panels, responsive rules, and reduced-motion behavior.
   - Keep the design system static-site friendly and performant.

2. Home and Services
   - Rebuild Home as the restrained opening chapter.
   - Rebuild Services as one capability journey with multiple entry points.
   - Use derived visual assets for Four Cs and line/circle/sphere without overexplaining.

3. Method and Playbook
   - Create Method hub route.
   - Rebuild Playbook as behavior-change design and interactive notebook/book experience.

4. AI Enablement and AI Accelerated Thinking
   - Preserve and reframe the existing Enablement experience.
   - Create AI Accelerated Thinking studio at `/thinking/`, organized around Practice, Passion, Purpose.

5. About and Contact
   - Rebuild About around trust: competence, judgment, character, humility, stability.
   - Rebuild Contact as calm, single-screen friction removal.

6. Review and hardening
   - Run adversarial review.
   - Visually inspect desktop, tablet, and mobile.
   - Check accessibility basics, console errors, responsiveness, and performance risks.
   - Iterate before final commit.

## Sub-Agents

- UX / interaction design explorer: reviewing spatial experience choices, boldness, and gimmick risk.
- Front-end engineering explorer: reviewing static-site implementation strategy, routes, file scope, verification, and performance risks.

## Current Local Decisions

- Use a shared design layer instead of continuing large page-specific inline CSS as the primary implementation style.
- Use existing brand colors and type direction, with more architectural composition and spatial metaphor.
- Treat derived diagrams as implementation outputs, not missing source assets.
- Do not wait for perfect artifact curation before building the first end-to-end implementation; use public-safe curated placeholders and improve after visual review.

## Progress

- Foundation committed in `9d33fae`: shared spatial CSS/JS at `assets/djc-spatial.css` and `assets/djc-spatial.js`.
- First route rebuild in progress:
  - `/`
  - `/services`
  - `/method/`
  - `/playbook/`
  - `/thinking/`
  - `/about`
  - `/contact`
- Supporting metadata updated:
  - `vercel.json`
  - `sitemap.xml`
  - `llms.txt`
- Initial syntax sweep passed:
  - `node --check assets/djc-spatial.js`
  - basic HTML parser pass on rebuilt pages
  - copy-pattern scan for em dashes and repetitive contrast rhythm

## Verification Plan

- Serve the static site locally.
- Use `agent-browser` and Playwright where useful to inspect rendered pages.
- Check at least:
  - home
  - services
  - method
  - playbook
  - enablement
  - thinking
  - about
  - contact
- Inspect desktop, tablet, and mobile.
- Run link/form sanity checks where feasible without sending external email.

## Handoff Notes

If interrupted, resume by:

1. Checking git status in `djc-website`.
2. Reading this working log.
3. Reading the Phase 4 blueprint in JoeOps.
4. Continuing from the latest completed chunk above.
