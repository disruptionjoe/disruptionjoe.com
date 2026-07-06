# The Studio, Amplified

Governing design language for disruptionjoe.com. It supersedes the retired
notebook experiment (2026-07-06, recorded at the bottom). The architecture
briefs in JoeOps `programs/public-presence/surface-briefs/` govern what each
page says and in what order; this file governs how the site behaves and feels.

## North star

> Don't redesign Disruption Joe into something different. Make Disruption Joe
> feel like the most engaging version of itself.

The differentiation of this business is **interactive sense-making**: helping
people understand something by experiencing it. The Enablement Architecture,
the Playbook book, the maps, the frameworks, the workshops all share that
trait. The website should too. Surprise comes from interaction, visual
explanation, movement, storytelling, and transitions. Never from replacing
the aesthetic.

## The identity is locked

These are assets. Do not redesign them:

- The near-black substrate with cream/white type and warm tan/gold accents,
  clay as the live in-progress mark (tokens in `assets/djc-spatial.css`).
- Space Grotesk + Space Mono.
- The cinematic, premium, lamplit spatial language: the visitor moves through
  rooms; the site feels like AI activation, not stationery.
- The existing information architecture and buyer journey
  (Home / Services / Method [Playbook, Enablement, Thinking] / About / Contact).
- Method pages as gateways that lead into experiences.

Variety comes from what sections do, never from hue drift. If a change is
mostly a new skin, it is the wrong change.

## Redesign the experience, not the identity

Every section should feel like something people have not experienced before,
while unmistakably belonging to the same brand:

- Instead of cards: make the Four Cs build themselves.
- Instead of static diagrams: let the visitor manipulate them.
- Instead of scrolling into a page: make it feel like stepping into a room.
- Instead of "learn more": make the next page feel like entering another
  environment.

Visual inspiration lives in museum exhibits, installations, workshops,
control rooms, strategy maps, command centers, simulations. Not notebooks.

## Principles (carried forward; these survived the failed experiment)

1. **Sections are devices, not containers.** Every section diagnoses,
   compares, locates, teaches, or decides. A section that only organizes
   content gets restructured or cut.
2. **One repeatable idea per page.** At least one idea a visitor repeats to
   someone else later. Insight first, spectacle second.
3. **Name the models.** The Four Cs, Line / Circle / Sphere, the Playbook,
   the Architecture. People remember named ideas.
4. **One memorable moment per page, and it must deepen understanding.**
   Novelty alone does not earn a place.
5. **Marks must explain.** Motion, highlights, and annotation exist to make
   something clearer. Decorative effects get removed.
6. **Reward slow readers.** Skimmers see a premium consulting site; ten-minute
   visitors keep discovering depth, cross-references, and recurring concepts.
7. **Honest, not theatrical.** The atmosphere is cinematic; the claims are
   evidence. No fake futurism, no performing sophistication.
8. **Lightweight.** CSS-first, one small script per need, no animation
   libraries, no 3D engines, no scroll-jacking that hurts comprehension.
9. **Accessibility floors.** Reduced motion sees finished, fully-lit states.
   Keyboard gets everything a pointer gets. Contrast holds. The page reads
   fully with JS off.

## The three tests

- **The swap test.** Could this section sit on another consultant's site
  without anyone noticing? Delete or reinvent it.
- **The sense-making test.** Does this section let the visitor do something,
  or watch the idea happen, rather than just read about it?
- **The repeatable-idea test.** What does the visitor say to a colleague
  afterward? "It looked nice" is a failing grade.

## Experience registry (one per page; protect these)

| Page | The experiential moment |
|---|---|
| Home | The Four Cs assemble themselves; Line / Circle / Sphere responds to the visitor |
| Services | Self-location: finding your starting situation feels like standing on the journey |
| Method | The three components assemble into one method in front of you; doors that feel like doors |
| Playbook | The openable book; the room that reads the organization back |
| Enablement | The live capability map (the experience is the page; Phase Two owns its evolution) |
| Thinking | Stepping into the studio after dark; chambers entered, not scrolled |
| About | The desk reveal: the studio signs its name |
| Contact | The guest book under the last lamp |

## Phase boundaries

The interactive experiences themselves (the Enablement application, the
Playbook book internals, any future standalone Thinking experience) evolve
only as explicit Phase Two decisions. Pages introduce, frame, and hand off
into them.

## Record: the notebook experiment (2026-07-06)

A full ink-and-paper "working notebook" rebrand of Home shipped and was
rolled back the same day. Useful failure; what it taught:

- The weakness of the site was never the brand. It was that sections behaved
  like website sections.
- Replacing the identity optimized the wrong variable ("unlike other
  consultants" instead of "more like Disruption Joe").
- The durable principles above (devices, repeatable ideas, named models,
  explanatory marks, slow-reader depth) came out of that experiment and apply
  regardless of skin.

Do not reintroduce the paper/notebook aesthetic as site identity.
