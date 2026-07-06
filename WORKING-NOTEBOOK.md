# The Working Notebook

Governing design language for disruptionjoe.com. Every visual, layout, and copy
decision on the site answers to this file. It sits beside the architecture
briefs (JoeOps `programs/public-presence/surface-briefs/`), which govern what
each page says and in what order; this file governs how the site makes people
feel and think while reading it.

## Philosophy

The notebook is the medium. The product is better thinking.

This site should feel like exploring the accumulated thinking of someone who
has spent years facilitating AI adoption in real rooms. It is a working
notebook because the work itself required one, not because we chose a notebook
aesthetic. Whenever a design decision pits "understand something more clearly"
against "look more like a notebook," clarity wins. Whenever it pits "most
beautiful consulting website" against "makes people think differently about AI
adoption," the second wins.

The goal is a site that is remembered because visitors leave seeing AI
adoption differently, with the visual language quietly reinforcing that way of
thinking rather than becoming the main attraction.

## Governing principles

1. **Sections are devices, not containers.** Every section performs work for
   the visitor: it diagnoses, compares, locates, teaches, or decides. A section
   that only organizes content gets restructured or cut.
2. **Every page carries one repeatable idea.** At least one idea per page that
   a visitor is likely to repeat to someone else later. Insight first, visuals
   second. The repeatable ideas are registered below; protect them.
3. **Name the models.** Frameworks and figures get memorable names, not
   "Figure 01." People remember named ideas. Named models are registered below.
4. **References are grammar, not identity.** Patent drawings, architectural
   working sets, flight manuals, and Tufte teach us annotation, hierarchy, and
   disciplined density. If a visitor walks away thinking "architecture
   website," we went too far. It is always Joe's notebook, informed by those
   traditions.
5. **Annotations must explain.** Hand-drawn energy exists only where it makes
   something clearer: a circled word that carries the argument, an arrow that
   locates the reader, a strike-through that shows what broke. Decorative
   annotation gets removed. Budget: roughly one hand-mark per viewport.
6. **Reward slow readers.** A skimmer sees a professional consulting site. A
   ten-minute reader keeps finding margin notes, cross-references between
   sheets, recurring concepts, field observations, and figures that keep
   giving. Depth is intentional and quiet, never demanded.
7. **Texture stays subtle.** Tactility comes from typography, document
   structure, figures, annotation, and hierarchy. Paper grain supports at the
   edge of perception; if you notice it, it is too loud.
8. **Honest, not theatrical.** No dark-glow AI vibes, no fake futurism, no
   performing sophistication. Evidence over claims, in the visual language too.

## The three tests

Run every new or edited section against all three:

- **The swap test.** Could this section sit on another consultant's site
  without anyone noticing? Then delete or reinvent it.
- **The cream-SaaS test.** Cream background + serif display + warm accent is a
  well-known AI-default look. Is this section a landing-page pattern wearing
  paper? Then restructure it into a document device.
- **The repeatable-idea test.** After this page, what does the visitor say to
  a colleague? If the answer is "it looked nice," the page fails.

## Tokens

Palette (locked; brand only; variety comes from structure, never hue):

```css
--paper:      #f4efe6;   /* substrate */
--paper-deep: #ece4d4;   /* recessed panels, note cards */
--ink:        #191611;   /* text, primary linework */
--ink-soft:   #4c463c;   /* secondary text */
--ink-faint:  #857b6b;   /* captions, folios */
--tan:        #d8bd8a;   /* tape, shading, folder stock; never text */
--clay:       #cf6f4d;   /* THE live accent: marks, strokes, stamps */
--clay-deep:  #9a4527;   /* clay for small text (contrast-safe) */
--rule:       rgba(25,22,17,.18);  /* hairline rules */
```

Rules: clay text below ~24px uses `--clay-deep`. Tan never carries text.
Dark surfaces are a material, not a mode: at most one inverted "foldout"
moment per page (e.g. Method's master sheet), cream linework on ink, used
because a blueprint is a different paper stock.

## Type

Two families, four treatments. Nothing else.

- **Newsreader** (optical sizes): display headlines (500), body text (400),
  and italic for margin notes and field observations. The document's voice.
- **Space Mono**: title-block fields, labels, folios, data, field-note stamps.
  The instrument's voice.

The hand lives in the linework, not the letterforms. No handwriting fonts.

## Component inventory

- **Title block** — every page opens with one: sheet number, sheet name, the
  question the page answers, revision date. Replaces the hero-eyebrow stack.
- **Document grid** — main measure (~62ch) plus a true margin column for
  annotations on wide screens; margin notes reflow inline with a clay rule on
  narrow screens, placed after their anchor paragraph in DOM order.
- **Named figure** — hairline-ruled figure with a name and a plain-language
  caption. Numbered only when order carries information.
- **Field Observation** — a short observation that could only come from
  repeatedly facilitating AI adoption in real rooms. Earned, never
  promotional. Mono stamp label + serif italic body. Sparse: 2 to 3 per page
  maximum.
- **Margin note** — serif italic, clay-deep, explanatory or cross-referencing
  ("cf. Sheet 03"). Never decorative.
- **Taped print** — real session photo or artifact with tan tape corners and a
  mono caption. Evidence, not scrapbook: captions say what the image proves.
- **Plate** — small drawn preview of an interactive experience (the book, the
  map) that links into it. Frames experiences as the notebook's appendices.
- **Note card** — recessed paper card for the calm CTA moments.
- **Journey line** — the "you are here" motif: a thin plotted line of the
  site's sheets under the nav with a clay mark on the current sheet. A motif,
  not an app: no state, no persistence, no assessment.
- **Clay annotation set** — circled word, leader arrow, underline,
  strike-through, stamp (TESTED / BROKE / KEPT / IN USE). Each use must
  explain something.
- **Foldout** — full-bleed sheet for a page's biggest figure; may invert to
  ink. Scrolls horizontally inside its own container on mobile.
- **Ruled form** — form fields as blanks on a ruled page (Contact).

## Registries

Named models (protect these names; use them consistently):

| Model | What it is | Home sheet |
|---|---|---|
| The Capability Curve | The Four Cs plotted as one rising line: confidence enables capability enables consistency enables compounding | Home, fullest on Services |
| Line / Circle / Sphere | The three shapes of adoption, with the economics tied on: hidden cost, savings, new business value | Home, fullest on Method |
| The Activation Playbook | The interactive design notebook behind the rooms | Playbook |
| The Enablement Architecture | The live capability map (digital appendix) | Enablement |

Repeatable ideas (one registered per page; the page exists to deliver it):

| Sheet | Repeatable idea |
|---|---|
| Home | "The bottleneck moved from the technology to what your people can do with it." Companion question: "What shape is your AI use: line, circle, or sphere?" |
| Services | "You don't pick a service, you pick a starting situation. Same journey either way." |
| Method | "Most AI efforts work at the wrong level: knowledge, intent, or rules, when the thing that has to change is how work gets done." |
| Playbook | "The room doesn't just train people. It shows you how your organization actually learns, coordinates, and changes." |
| Enablement | "Scattered usage rarely compounds. Capability does, and you can locate yours on a map." |
| Thinking | "The methods keep getting better because somebody keeps finding out what breaks on purpose." |
| About | "Trust the person because of how the work is held: competence, judgment, character, humility, stability." |
| Contact | "You don't need a defined project. Bring the situation." |

## Anti-patterns (banned)

Dark-glow AI aesthetic. Pointer-tracking spotlights and lamps. Per-page accent
hues. Rounded card grids and hairline dark panels. Glassmorphism, gradient
meshes, blobs. Icon feature rows. Alternating image/text rows. Oversized empty
"premium" whitespace. Stock consulting imagery. Handwriting fonts. Scrapbook
collage. Sections that could be swapped onto a generic consultant's site.

## Motion and accessibility policy

CSS-first. One small script (`assets/notebook.js`) handles nav toggles and
adds `.is-inked` to `[data-ink]` figures via IntersectionObserver so strokes
draw in once on first view. Everything rests fully drawn with no JS and under
`prefers-reduced-motion`. Visible clay focus states on all interactives. Real
`<figure>/<figcaption>`, margin notes as `<aside>`, tables for schedules.
Body text contrast ~14:1; clay-deep for small accent text. Budget: fonts
subset and swapped, JS under ~10KB, no image dependencies for meaning.

## Phase boundaries

Phase One (this redesign): all eight sheets in the notebook language.
The interactive experiences are NOT redesigned in this phase: the Enablement
application (linked from the Enablement page's final section), the Playbook
book internals, and any future standalone Thinking experience. Method pages
act as gateways: they introduce, frame, and hand off into experiences.
Experiences adopt the notebook language, or become richer standalone
destinations, only as explicit Phase Two decisions.

## Photography

Real session photos appear as taped prints with captions that say what the
image proves. Components accept future workshop artifacts, whiteboards, and
participant outputs without redesign. If a page starts feeling like a
scrapbook, cut photos until it stops.
