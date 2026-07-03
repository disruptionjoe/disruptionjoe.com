---
surface: website
work_item: website-rebuild-v2
status: rebuild-v2
owning_repo: joeops
implementation_repo: djc-website
---

# Website Rebuild v2 — Governing Brief

## The Studio, On View

One person's working atelier, walked room by room and signed at the end.

This is the single governing document for the djc-website rebuild on branch
`rebuild-v2-spatial`. A future agent should be able to build the whole site from
this file. Read it top to bottom before touching a page. When a page decision
conflicts with a rule here, the rule wins.

---

## 1. Locked Creative Direction and the Unifying Spatial Metaphor

**Concept: The Studio, On View.** The site is one building the visitor walks
through, not a stack of eight pages. We warm the winning museum reference into a
working studio-atelier: lamplight, paper, drafting benches, and the visible hand
of someone mid-practice, rather than cold glass-case galleries or blue CAD
linework.

**One architecture, three benches.** There is one architecture, the Method, and
its three components are three benches inside the same studio, each under its own
lamp, all sharing the studio's single floor. The site must teach one thing above
all others: one method, three complementary components. Not three services.

**Three fixed affordances repeat in every room** so eight hand-built files read
as one building:

1. **A lit threshold** (the hero): one warm pool of light in an otherwise dim
   room.
2. **A setup line**: a short, warm, conversational one-liner in Space Mono that
   names what you are about to see before you see it. Progressive revelation and
   the trust ladder made physical, spoken like a generous host, never like
   museum wall text.
3. **The exhibit**: the interactive or visual object under the lamp.

**You move deeper, never sideways.** Entrance hall (Home) to survey room
(Services) to master-plan atrium (Method) to the three benches (Playbook /
Enablement / Thinking) to the desk (About) to the guest book at the door
(Contact). No room may feel like a lateral tab swap.

**The authorial voice is deliberately institutional and Method-first the entire
way.** The work is presented as the studio's, anonymously, until About, where the
wall text signs itself and every prior anonymous room retroactively resolves into
one person's life work.

**The spatial rule that enforces provenance: you never re-walk a room.** Each
concept gets exactly one primary full explanation. Earlier rooms introduce, later
rooms deepen, nothing is re-taught.

**The swing / boldness.** The persistent nav is a living floor plan of one
occupied studio, not a link bar. Lighting is pacing: the emotional curve is a
physical property of each room, expressed through three tokens (`--spot`,
`--wash`, `--rim`) layered over the existing `--accent`. Movement carries meaning
at every step. The target reaction is "I have never experienced a consulting
website like this." Better to have to pull something back than to lack
originality.

**The disciplined unifier.** `--clay` (#cf6f4d) is the single live, in-progress
spark, used only for the active mark on every page. If every metaphor were dialed
back, clay is the one thing that survives and still says "a person is working
here right now."

---

## 2. Design System

### Palette (evolution, not reinvention)

Base is unchanged and load-bearing: cream-on-charcoal, read as raked lamplight
rather than web gradient, under the existing fixed grain and vignette.

**Substrate:** `--black #070706`, `--ink #0e0d0b`, `--charcoal #15130f`,
`--charcoal-2 #1d1a15` (the dim hall / studio floor).

**Ink on it:** `--white #fffaf1` (headings, lit faces), `--cream #f4efe6` (body
at rest), `--muted #b9b0a4`, `--dim #817970` (setup lines, back-of-frame
mechanism labels).

**Structure lines:** `--line rgba(216,189,138,.24)`,
`--line-soft rgba(216,189,138,.11)` (drafting-bench edges, frame rims).

**Per-room accent is a lighting gel over one lamp, never a new material.** The
six existing accents stay exactly, re-cast as the color of each room's lamp:

| Room | Accent | Lamp reading |
| --- | --- | --- |
| Home / Contact | `--tan #d8bd8a` | warm entrance-hall and desk-lamp pool |
| Services | `--blue #88c7ff` | cool even survey light |
| Method | `--gold #f2d99d` | warmest, most central atrium light |
| Playbook | `--green #98d6a7` | first intimate personal lamp |
| Enablement | `--blue #88c7ff` | re-read as blueprint cyan; chrome only |
| Thinking | `--violet #c9a8ff` | most saturated, moving colored lamps |
| About | `--rose #ef9b91` | lights up to soft daylight |

**The unifier:** `--clay #cf6f4d` is reserved site-wide for the single live mark
only: the cursor, the pencil-stroke resolving a setup line, the active nav
floor-plan marker, the blinking field caret on Contact. It is not a per-page
accent. A single misuse breaks the unifier.

**Derive near-accent tints via `color-mix`, never hardcode a hue:** wash fills
(8-20% accent), rim lights (24-55% accent), frame glows (14-18% accent). This is
already the codebase idiom
(`color-mix(in srgb, var(--accent) N%, transparent)`); lean into it exclusively
so one token swap re-lights an entire room.

**Contrast floor:** body copy stays on `--cream`/`--muted` against `>= #0e0d0b`
at all `--spot` values. Low-light rooms (Home, Contact) must not drop text below
`--muted`. Spotlight opacity affects decor layers only, never text legibility.

### Typography

Pairing is unchanged and correct: **Space Grotesk** (display + UI, the printed
matter) with **Space Mono** (the spoken-host voice: eyebrows, setup lines,
coordinates, tags, indices; the studio's handwritten wall-card lettering).

**Display scale (fluid, replacing fixed rem so heroes hold on every viewport):**

- `h1` / `.display-xl`: `clamp(3.4rem, 7.2vw, 6.4rem)`, line-height .91,
  max-width 12ch. The lit-threshold headline.
- `h2` / `.display-l`: `clamp(2.4rem, 5vw, 4.2rem)`, line-height .98, max-width
  14ch. Section thresholds inside a room.
- `h3` / `.display-m`: `clamp(1.28rem, 2.4vw, 1.72rem)`, line-height 1.06.
  Exhibit titles.
- `.display-s`: 1.14rem / 1.2, bold. Card and bench labels.

**Reading scale:**

- `.lede`: `clamp(1.06rem, 1.5vw, 1.18rem)`, line-height 1.68, max-width 65ch,
  color ~#cbc3b7. The generous first paragraph as you enter a room.
- `.body-copy`: 1rem / 1.72, color ~#b8afa4.
- `.tiny`: .82rem / 1.52, `--dim`. Back-of-frame mechanism text, captions.

**Mono / host voice:**

- `.eyebrow` / `.kicker` / `.coordinate` / `.card-index` / `.room-label`: Space
  Mono, .68rem, weight 700, uppercase, color `--accent`.
- `.setup-line` (load-bearing): Space Mono, `clamp(.82rem, 1.1vw, .95rem)`,
  weight 400, **not uppercase**, line-height 1.5, color `--muted`, max-width
  52ch. The warm conversational one-liner. Deliberately un-caps and slightly
  larger than the eyebrow so it reads as a spoken sentence. A leading clay
  pencil-stroke (`::before`, a short `--clay` underline that draws in on reveal)
  marks it as being written live.
- `.tag`: Space Mono, .62rem, uppercase, `--accent`. Exhibit chips.

**Rhythm rules:** letter-spacing 0 everywhere (Space Grotesk is already wide);
uppercase mono earns its tracking from the face. One display face per threshold.
Never set body copy in mono. The setup line is the only mono run allowed in
sentence case; that exception is what makes it feel spoken.

### Depth, Tokens, Components

All shared tokens live in `assets/djc-spatial.css :root`. Existing tokens are
kept verbatim; the new studio-lighting and motion tokens group below.

```css
:root {
  /* Substrate (unchanged) */
  --black:#070706; --ink:#0e0d0b; --charcoal:#15130f; --charcoal-2:#1d1a15;
  --cream:#f4efe6; --white:#fffaf1; --muted:#b9b0a4; --dim:#817970;

  /* Accent gels (unchanged) */
  --tan:#d8bd8a; --gold:#f2d99d; --blue:#88c7ff; --green:#98d6a7;
  --rose:#ef9b91; --violet:#c9a8ff;
  --clay:#cf6f4d;                 /* RESERVED: live/in-progress mark only */

  /* Structure (unchanged) */
  --line:rgba(216,189,138,.24);
  --line-soft:rgba(216,189,138,.11);
  --panel:rgba(15,14,12,.78);
  --panel-solid:#11100d;
  --shadow:0 36px 110px rgba(0,0,0,.56);
  --ease:cubic-bezier(.22,.8,.26,1);
  --max:1180px;

  /* Per-room accent (default) */
  --accent:var(--tan);

  /* STUDIO LIGHTING (the pacing curve lives here) */
  --spot:.28;        /* spotlight/wash opacity  (Home low .18 -> Thinking .5) */
  --wash:26rem;      /* lamp pool radius        (Playbook tight -> Services wide) */
  --rim:.24;         /* exhibit frame rim-light strength */
  --lamp-x:78%;      /* lamp position, driven by --mx at runtime */
  --lamp-y:16%;      /* lamp position, driven by --my at runtime */

  /* Derived light colors (never hardcode a hue) */
  --wash-fill:color-mix(in srgb, var(--accent) 16%, transparent);
  --rim-line:color-mix(in srgb, var(--accent) calc(var(--rim) * 100%), transparent);
  --spark:var(--clay);

  /* MOTION SPINE */
  --p:0;             /* scroll progress 0..1, written by rAF per active room */
  --i:0;             /* reveal stagger index, set inline per exhibit */
  --reveal-dur:620ms;
  --reveal-shift:18px;
  --stagger:90ms;
  --parallax-cap:24px;
  --thresh-dur:520ms;
}

/* Pacing curve = three tokens change per room, no new hues */
body.page-home      { --accent:var(--tan);    --spot:.18; --wash:30rem; --rim:.20; }
body.page-services  { --accent:var(--blue);   --spot:.24; --wash:38rem; --rim:.22; }
body.page-method    { --accent:var(--gold);   --spot:.34; --wash:36rem; --rim:.30; }
body.page-playbook  { --accent:var(--green);  --spot:.30; --wash:22rem; --rim:.26; }
body.page-enablement{ --accent:var(--blue);   --spot:.26; --wash:26rem; --rim:.24; } /* chrome only */
body.page-thinking  { --accent:var(--violet); --spot:.50; --wash:24rem; --rim:.34; }
body.page-about     { --accent:var(--rose);   --spot:.30; --wash:34rem; --rim:.22; }
body.page-contact   { --accent:var(--tan);    --spot:.16; --wash:20rem; --rim:.18; }

/* Live mark is ALWAYS clay, regardless of room accent */
.is-live, .nav-marker, .caret, .setup-line::before { color:var(--spark); }

/* Reveal contract */
.reveal { opacity:0; transform:translateY(var(--reveal-shift));
  transition:opacity var(--reveal-dur) ease,
             transform var(--reveal-dur) var(--ease);
  transition-delay:calc(var(--i) * var(--stagger)); }
.reveal.is-visible { opacity:1; transform:none; }

/* Reduced-motion = final lit state is the default state */
@media (prefers-reduced-motion: reduce) {
  :root { --spot:.30; }
  .reveal { opacity:1; transform:none; transition:none; }
  [data-plane] { transform:none !important; }
}
```

**Component vocabulary** (all shared, all in `djc-spatial.css/js`):

- `[data-room]` — a room section the scroll engine tracks (writes its own `--p`).
- `[data-threshold]` — wraps a setup line plus the exhibit it introduces; observed
  as a unit so the line resolves before the exhibit.
- `[data-layer="back|mid|fore"]` — up to three GPU parallax planes per room.
- `.setup-line` — the host one-liner with the clay pencil-stroke `::before`.
- The exhibit frame — a rim-lit panel using `--rim-line`.
- The floor-plan nav — one unified shell across all eight pages, with the clay
  `--nav-marker` docked to the current room.

---

## 3. Motion and Interaction Language

**Five laws govern every moving thing.**

1. **The visitor moves, the room holds still.** Nothing animates on its own
   timeline. All depth and reveal is driven by two inputs only: scroll position
   and pointer position. Exhibits come up under light as you approach; they never
   loop, pulse, or auto-play.
2. **One scroll value, one rAF, one token.** A single `requestAnimationFrame`
   loop for the whole document. It reads `scrollY` once per frame and writes
   exactly one custom property per active room: `--p` (0 to 1). Every parallax
   layer, lamp, and stagger derives from `--p` or from the existing `--mx`/`--my`
   pointer vars. No component runs its own scroll listener. No layout property is
   ever animated; transform and opacity only.
3. **Motion carries meaning, never just motion.** Each move teaches a load-bearing
   idea: the setup line resolves before its exhibit (host speaks, then shows); the
   Four Cs render in four cumulative passes taller than the last (Confidence to
   Capability to Consistency to Compounding, experienced not read); Method's three
   instruments physically lower onto one bench. If a motion cannot name what it
   teaches, it is cut.
4. **Lighting is pacing.** The emotional curve is per-page values of `--spot`,
   `--wash`, `--rim` over `--accent`. Intensity is a lighting change, not a new
   palette and not faster animation. `--clay` is reserved for the single live
   mark and nothing else.
5. **The finished, lit state is the default; motion is the enhancement.**
   Reduced-motion and JS failure both resolve to the same place: every room fully
   lit, every exhibit fully visible, every setup line already resolved. Every
   spotlight-reveal exhibit has a lit resting state reachable by `:focus` /
   `:focus-within` so keyboard and screen-reader users never traverse a dark room.

### Techniques (all shared behavior in `djc-spatial.css/js`)

- **Single-rAF scroll engine (`--p` per room).** `initScrollEngine()`: on
  scroll/resize (both passive) set a dirty flag and schedule one rAF; never
  compute in the handler. In the tick, iterate `[data-room]`, compute
  `p = clamp((viewportCenter - roomTop) / roomHeight, 0, 1)` from a rect cached
  per resize, and write `--p` only when it changed by > 0.002 (dead-band). Guard
  behind `motionOK()`
  (`matchMedia('(prefers-reduced-motion: reduce)').matches === false`); if not
  OK, never start.
- **GPU parallax (max three layers per room).** `[data-layer]` planes driven
  purely from `--p` via `translate3d(0, calc(var(--p) * var(--shift)), 0)`. Apply
  `will-change: transform` and `contain: paint` only while the room is
  `.in-view` (IntersectionObserver toggled), removed on exit. Degrade to two
  layers on small screens. Enablement gets parallax on the outer threshold frame
  only, never the app interior.
- **Scroll-choreographed reveals (fixes the current no-op).** Today `.reveal`
  resolves to visible in both states, so it does nothing. Move the hidden state
  behind a `body.js-motion` gate added only after confirming
  `'IntersectionObserver' in window` and `motionOK()`:
  `body.js-motion .reveal { opacity:0; transform:translateY(18px); transition:... ; transition-delay:calc(var(--i,0) * 90ms); }`
  and `.reveal.is-visible { opacity:1; transform:none; }`. One observer
  (rootMargin `0px 0px -10% 0px`, threshold ~0.12), one-shot, unobserve after
  firing (you never re-walk a room). No JS and reduced-motion keep the finished
  state.
- **Setup-line-before-exhibit sequencing.** Group under one `[data-threshold]`;
  setup line gets `--i:0`, exhibit `--i:1+`, so the shared stagger fires the line
  first. Signature rooms additionally gate the exhibit's `is-visible` one rAF +
  one stagger step behind the line.
- **Pointer-follow lamp (`--mx`/`--my`).** Extend `initPointerDepth`; coalesce
  `pointermove` into the single rAF (no per-event writes). The lamp is a CSS
  radial at `var(--mx) var(--my)` with opacity `var(--spot)`. Keyboard parity:
  `:focus-within` lights the same card. Skip on `pointer:coarse`.
- **Four Cs cumulative passes (Home signature, build fully).** Buyer outcome line
  resolves first (`--i:-1`), then four stages render, each with a growing `--lift`
  so bar height increases line to plane to material to light. Cumulative: earlier
  stages stay lit as later arrive.
- **Method pinned assembly (Method signature, build fully).** Tall scroll track
  (~200vh), sticky inner stage (`top:76px`). Map `--p` to three phases: each node
  lowers via `translate3d` + opacity; leader lines `scaleX` from
  `transform-origin:left`. Clay nav marker docks on completion. Reduced-motion
  fallback: fully assembled, lines complete.
- **Thinking after-dark walk-through (theatrical peak, scarce reward, build
  fully).** Replace the `display:none` tab swap with three stacked
  `[data-chamber]` sections in normal flow, each its own scroll room. Tab buttons
  become anchor-scroll (progressive enhancement). On enter, a chamber ramps
  `--spot` toward max and drives a line-drawing to full via `stroke-dashoffset` or
  `scaleX` tied to `--p`; past ~0.8 it dims as the next takes over. Colored violet
  lamp translates with `--p` and follows `--mx`/`--my`. This is the only room
  granted full line-to-light completion. Reduced-motion: three fully-lit,
  fully-drawn, scrollable sections.
- **Room-to-room threshold + living floor-plan nav.** On load-in, one fixed
  full-bleed overlay of the incoming `--accent` at ~0.5 opacity fades to 0 over
  ~500ms via `body.entering`, removed next rAF. The nav marker is clay, positioned
  per page via `body.page-*` / `aria-current` (renders already docked on full page
  loads); the docking animation plays only for in-page Method component jumps.
  Method hierarchy is real nesting, parent plus components, not always-visible
  siblings.
- **Nav scrolled-state.** Keep `.is-scrolled` past `scrollY>18`, but read it inside
  the shared rAF tick so there is one scroll consumer total.
- **Enablement outer-chrome-only.** Wrap only the app in the unified nav shell
  plus a `[data-threshold]` setup line. Scope all shared JS selectors so none
  collide with the inline app. The scroll engine treats the app container as one
  opaque exhibit (no `--p` children inside it). No shared-JS write may reach inside
  the app subtree.
- **Contact null-motion end state.** No `[data-room]`, no scroll engine
  participation. Clay caret via `caret-color:var(--clay)` on the first input plus
  autofocus (respect `focus-visible`). On submit success, `body.confirmed` lowers
  `--spot` and reveals the confirmation line. Keep the existing fetch/status logic.

### Performance budgets

- One rAF for the entire page. Max writes per frame = on-screen rooms (1-2), each
  a single custom-property string.
- `getBoundingClientRect` only on resize/orientationchange, never per frame. Zero
  forced reflow in steady state.
- Transform and opacity only. Never animate top/left/width/height/margin.
- Hard cap three composited layers per room; `will-change` on at most ~6 elements
  at once, removed on exit.
- Reveals: one IntersectionObserver, each element transitions once then
  unobserved; steady-state cost zero. 620ms on `--ease`, max ~4 stagger steps so a
  section lands under ~1s.
- Target sustained 60fps on mid-tier laptop and mid-tier Android; main-thread cost
  per frame under ~1ms.
- Reduced-motion path: rAF loop, observers, pointer-follow, threshold wash, and
  marker animation all short-circuit behind `motionOK()`; not running invisibly.
- Enablement app: zero added cost inside the app; no new global scroll/rAF
  handlers competing with its state machine.
- CLS near zero: setup-line-before-exhibit staging must reserve space so exhibits
  lighting up do not shift surrounding content.

**Scope discipline.** Build the two signature moments fully first (Home Four Cs
compounding, Method pinned assembly), with Thinking's after-dark walk as the
theatrical third. Every other room falls back to the lighter two-layer reveal so
the memorable beats ship even if time runs short.

---

## 4. Voice Rubric and Repetition Ledger

**Target voice.** Ann Handley warmth married to David Ogilvy respect for the
reader's intelligence: warm, generous, plainspoken, quietly confident, practical.
Every line assumes an intelligent buyer who is busy, skeptical of AI hype, and
allergic to consultant theater. Lead with the buyer's reality and outcomes
(Confidence, Capability, Consistency, Compounding) before any of Joe's machinery.
Institutional and Method-first the whole tour, until About signs it. Sentence
rhythm must vary. Comprehension always beats theme.

**Never list.**

- Em dashes of any kind (em, en used as em, or double hyphen) anywhere. Zero.
- Academic register (`epistemic`, `formalization`, `legitimacy` as decoration
  outside Thinking's own exhibits).
- Consultant jargon (`leverage`, `synergy`, `unlock`, `solutioning`,
  `best-in-class`, `holistic`, `north star`, `value-add`, `at scale` as reflex).
- AI hype (`revolutionary`, `game-changing`, `transformative`, `supercharge`,
  `unleash`, `next-level`, `AI-powered` as a boast).
- Performative self-importance or manifesto tone (`We believe...`,
  `In a world where...`).
- The reflexive antithesis `X, not Y` / `More X. Less Y.` used to sound profound.
- The clipped `The [noun] [verb].` heading cadence as a default.
- The identical CTA string `Book an AI Activation Planning Call` on more than one
  page.
- Re-explaining a concept that already had its one primary full explanation.
- Naming Joe before About, except where a form field or byline already requires
  it.
- Exclamation points as enthusiasm crutch; fake urgency; scarcity language.
- Second-person scolding or shaming the buyer.

**Hard rules.**

- Zero em dashes. Rewrite with a period, comma, colon, or parentheses. Lint fails
  the build on any hit.
- Antithesis cap: at most one `X, not Y` or `More X. Less Y.` per page, only where
  the contrast carries real meaning. Never as a heading default.
- Clipped-heading cap: no more than one `The [noun] [verb].` heading per page, only
  for genuine emphasis. Vary structure: questions, phrases, verb-first
  invitations, plain noun phrases.
- CTA uniqueness: the planning-call invitation is phrased differently on every
  page. No two pages share a CTA string.
- Outcomes before machinery: the first substantive line of every room speaks to the
  buyer's reality or outcome before any tool, framework, or mechanism is named.
- Progressive revelation: each concept gets exactly one primary full explanation;
  earlier rooms introduce with a sentence, later rooms deepen. Never re-teach.
- Setup lines stay under ~14 words, outcome-first, conversational, host's voice.
- Method-first voice until About; About is the only room that names Joe as author
  and signs the work.
- Sentence-length variation: no page runs three consecutive near-identical clipped
  sentences.

### Motifs to keep (with intent, not on every page)

| Motif | Keep because | Ration |
| --- | --- | --- |
| **capability** | The core promise and through-line (the Four Cs). Names the buyer outcome. | ~2 per page; let synonyms carry the rest |
| **the room** | Load-bearing Playbook motif for the human space where behavior changes. | Concentrated on Playbook; do not leak elsewhere |
| **Enablement as the explanation layer** | Structural rule: Enablement explains, it is not a co-headline with Activation. | A framing idea, not a repeated phrase |
| **the Four Cs** | The buyer-outcome vocabulary motion itself renders. | Introduced fully on Home; deepened, not repeated verbatim |
| **one method, three components** | The single most important thing the site teaches. | Vary wording ("three benches, one floor"); teach, do not chant |
| **clay live-mark** | The disciplined visual unifier. | Acknowledge "in progress / still evolving" lightly, mainly in Thinking |

### Tics to kill

- Clipped `The [noun] [verb].` heading cadence used as default. Recast into
  questions, fuller sentences, verb-first invitations, or plain phrases.
- Reflexive antithesis `X, not Y` / `More X. Less Y.` State the positive directly.
- Verbatim `Book an AI Activation Planning Call` pasted across pages. Use per-page
  variants below.
- Vocabulary over-reliance on `{capability, method, practice, room, shared,
  visible, signal}`. Enforce caps; introduce plain synonyms (capability -> what the
  team can now do / skill that stays; practice -> real work, the actual job;
  visible -> easy to see / out in the open; shared -> done together).
- Staccato three-in-a-row same-length fragment stacks. Combine or expand a beat.
- Institutional coldness in setup lines. Rewrite warm, host-voice, under ~14 words.
- Abstract theory register bleeding out of Thinking. Quarantine it to Thinking's
  own exhibit labels.

### Per-page CTA variants (never reused verbatim)

- **Home** (restrained entryway): "Start with a conversation about your team."
- **Services** (survey, orientation): "Not sure which door fits? Tell us the
  situation and we'll point to the right one."
- **Method** (atrium, architectural): "See how the three components would fit your
  organization."
- **Playbook** (intimate, human): "Bring your people into a room and let capability
  form. Let's plan the first session."
- **Enablement** (live instrument, blueprint): "Want this architecture mapped to
  your stack? Start the conversation from here."
- **Thinking** (after-dark, theatrical): "Curious where this is all heading? Come
  talk through the work in progress."
- **About** (personal, signed): "If this feels like the right kind of partner,
  let's talk."
- **Contact** (guest book, quiet close): "Tell Joe what's happening. He reads every
  one of these."

### Lint checks (must run against all eight files)

- **em-dash-zero**: fail on `/—|–|\s--\s|\w--\w/` in visible copy. Must be zero.
- **antithesis-density**: count `/\b\w+, not \w+/i` and
  `/\bMore [A-Za-z]+\.\s*Less [A-Za-z]+\./i` per page. Warn at 1, fail at 2+.
- **clipped-heading-cadence**: test headings for the 3-5 word subject-verb pattern
  ending in a period. Fail if more than one per page.
- **cta-string-uniqueness**: extract every primary CTA text sitewide, normalize,
  assert all unique. Hard-fail on any duplicate; fail on the literal
  `Book an AI Activation Planning Call` appearing at all.
- **banned-phrase-list**: case-insensitive scan for the never-list vocabulary. Any
  hit fails with phrase and location.
- **vocabulary-overuse-caps**: per page, count whole-word occurrences. Caps:
  capability<=2, method<=3, practice<=2, room/rooms<=2 (Playbook<=6), shared<=1,
  visible<=1, signal<=1.
- **setup-line-length**: each setup line <= 14 words, no em dash, no banned phrase.
- **sentence-rhythm**: flag any run of 3+ consecutive sentences all <= 5 words.
- **outcome-before-machinery**: warn if a page's first main sentence leads with a
  tool/framework/mechanism noun before a buyer-outcome word.
- **joe-name-gating**: warn on `Joe` in body copy outside About/Contact (excluding
  form fields and required attributions).

---

## 5. Per-Page Environment Blueprints

Each room carries the three fixed affordances (lit threshold, setup line,
exhibit under lamp). Only the deltas that make each room itself are called out.

### Home — Entrance hall (restrained, tan, `--spot` low)

A dim, spacious hall lit by one warm tan pool. The buyer's own reality settles
into focus as the first physical event, before any tool, framework, or logo
appears. At center, the Four Cs bench renders in four cumulative passes, each
stage taller than the last. Machinery stays glimpsed as lit doorways deeper in.

Voice: the most restrained register. Calm, short sentences with air. Introduces
every concept, fully explains only the Four Cs.

Memorable moment: a single chalk-and-pencil line stating the buyer's outcome
settles into focus before any tool appears; then the Four Cs render line, plane,
material, light, each rising taller, so the visitor watches capability compound
before a mechanism is named.

Sections: (1) threshold + setup line; (2) the buyer's reality / recognition, one
pencil line settling first; (3) the Four Cs bench, the site's one full
explanation of the progression; (4) doorways deeper in (Method, Playbook,
Enablement) as a faint background parallax, named not described; (5) start with
the situation, one fresh CTA plus a soft path to the survey room.

Avoid: co-headlining the machinery; the verbatim CTA; the `X, not Y` and clipped
`The bottleneck moved.` cadence. Keep `--spot` low but hold contrast.

### Services — Survey room (architectural, blue, wide diffuse)

Even, diffuse blue light, cooler and wider than any other room. The capability
journey mounts as a horizontal wall of framed commissions the visitor tracks
along past a fixed marker. Each piece wears its outcome on the visible face; the
mechanism is only on the back, revealed on the turn.

Voice: orientation. Clear, generous, practical, a curator walking you along the
wall. Introduces the range without deep-explaining any one engagement.

Memorable moment: the turn-to-reveal commission. Hovering or focusing a finished
piece rotates it so the outcome faces front and the machinery sits on the back.

Sections: (1) threshold + setup line; (2) the capability journey wall (clarify,
activate, coordinate, measure, compound) as one continuous path past a fixed
marker; (3) the commissions / starting points, outcome-first, varied card rhythm
so six pieces never read as a template grid; (4) what changes when it works,
outcome plus real facilitation image on one plane; (5) you do not have to pick
the container first, one fresh CTA and a soft path into the Playbook.

Avoid: re-explaining the Four Cs (Home) or the method's internal logic (Method);
the clipped cadence; the hover-only reveal (every piece needs a lit resting
state).

### Method — Central atrium (most architectural, gold, most generous light)

The building's central atrium. One master-plan sheet hangs gold-lit on the far
wall. The three components physically lower one by one onto a single shared bench
and lock together along leader lines before a word is read. The nav docks its
clay marker here.

Voice: the most architectural register, warm and central, confident
master-builder. Still institutional. Owns the full explanation of how the three
components relate; earlier pages only named them.

Memorable moment: the pinned assembly. Three instruments lower onto one bench and
lock along leader lines; the clay marker docks to the atrium. One method, three
components becomes something you watch build.

Sections: (1) threshold + setup line, lights warmest; (2) why efforts stall
between the functions, three dim recessed alcoves; (3) the pinned assembly, the
one full explanation of how Playbook, Enablement, Thinking compose one method;
(4) what organizations become, a line-to-circle-to-sphere progression (not a
repeat of Home's Four Cs passes); (5) enter the component that answers your
question, three lit doorways numbered 01 / 02 / 03.

Avoid: re-explaining the internals of the three components; presenting them as
independent services (the assembly must resolve to one bench); the stale "three
connected methods" phrasing; the clipped-heading tic across stall cards.

### Playbook — First intimate room (immersive, green, tightening pools)

Warmly green-lit human gallery where "the room" is the subject. Exhibits are
practice stations and behavior-change artifacts the visitor moves between, the
lamp tightening on each as they approach. Lighting becomes personal for the first
time (`--wash` tightens).

Voice: more immersive and personal, warm and human, a facilitator who has run the
room many times. Owns the full explanation of "the room" and behavior-change
design.

Memorable moment: lamp-follow discovery. The green lamp tracks the pointer
(reusing `--mx`/`--my`); each practice exhibit brightens only when lit, so the
visitor discovers the room by illuminating it station by station.

Sections: (1) threshold + setup line, `--wash` tightening; (2) why most AI
learning misses (information without transfer), three dim unlit stations; (3) the
room illuminated, the one full explanation of how the Playbook designs behavior
change (practice, reflection, sensing, modular reuse), assembled by lighting each
station; (4) the room becomes intelligence, confidence gaps and workflow friction
surfacing as lit leader-lines for leaders; (5) a modular system and the way in,
real facilitation image plus a fresh CTA and a soft path to Enablement.

Avoid: letting "the room" motif leak to other pages; re-explaining the Four Cs or
the three-component assembly; the old display-swap book-tabs pattern; dark rooms
for keyboard users (every station needs a lit resting state, contrast holds at the
tighter `--wash`).

### Enablement — Working blueprint bench (immersive, blueprint cyan, CHROME ONLY)

Presents the existing interactive Architecture app (spheres, travel diamond,
role-lens prompt generator, enablement contact form) as the studio's one live,
operating instrument, the single exhibit that actually runs. **Chrome-only
treatment:** the inline `<style>` and `<script>` state machine are untouched. Only
the outer shell adopts the studio: the unified floor-plan nav replaces the page's
different header, a shared footer is added, and a threshold plus one setup line
frame the entry. Accent reads as the blueprint cyan already inside the app.

Voice: expressed almost entirely through the app. The thin chrome-and-setup-line
layer is a curator opening a case to reveal a working machine: brief, precise,
quietly proud. Enablement is the explanation layer's home, not a co-headline; the
setup line points at the live instrument and gets out of the way.

Memorable moment: crossing into the live instrument. The setup line resolves, the
outer frame opens, and the untouched app performs.

Sections: (1) unified floor-plan nav (chrome), clay marker docked to the
Enablement bench under Method; (2) threshold + one setup line (chrome), the only
new copy on the page; (3) the live instrument (preserved app, fully intact); (4)
unified footer (chrome).

Avoid (HARD BOUNDARY): touching the inline style, script, spheres, travel diamond,
prompt generator, or the contact form posting with `source: enablement`. Chrome
only. Do not re-explain what Enablement Architecture is beyond a one-line frame. Do
not alter the app's interior lighting.

### Thinking — Studio after dark (MOST theatrical, violet, `--spot` highest)

The site's most theatrical room and the only one granted full line-to-light
completion. Three real chambers, Practice, Passion, Purpose, that the visitor
actually travels through rather than swaps between as tabs. Violet at its most
saturated; lamps move and are colored, sweeping as the visitor advances. Each
chamber's line drawing completes to full light on enter and dims behind on leave.

Voice: the most theatrical register, but disciplined, curiosity without
prediction theater. Intense, alive, nocturnal, still generous. The peak of the
pacing curve. Owns the full explanation of how public work and experiments keep
the method evolving.

Memorable moment: the after-dark walk-through. Moving Practice to Passion to
Purpose, the colored lamp sweeps, each chamber completes to full light on entry
and dims behind on exit.

Sections: (1) threshold + setup line, violet at max saturation, moving lamps; (2)
Practice chamber (disciplined exploration into better facilitation and
engagements, commercially closest); (3) Passion chamber (public research that
stretches the method and makes it hard to imitate); (4) Purpose chamber (human
agency, coordination, better systems, no prediction theater; fullest completion);
(5) why this matters commercially, the way out, a fresh CTA and a soft path to
About.

Avoid: the current `display:none` tab swap (must be a real walk-through); spending
full line-to-light completion anywhere else; AI hype or self-importance; dark
rooms (each chamber needs a lit resting state; all three chambers' text exists
statically). Research is proof of difference, not the front door.

### About — Maker's desk (restrained again, rose, soft daylight)

The lights come up to soft rose daylight, restrained and personal after the peak.
Every prior anonymous, method-first room retroactively becomes one person's life
work. The shared bench resolves into one person's actual occupied desk, and the
wall text signs itself.

Voice: restrained again, warm and personal; first person emerges. The
institutional method-over-Joe voice drops away here and only here. Quieter than
Thinking on purpose.

Memorable moment: the signature reveal. The wall text handwriting-signs itself,
the shared bench resolves into an occupied desk, the lights come up to daylight,
reframing every prior anonymous room as one maker's studio.

Sections: (1) threshold + setup line, lights rising to daylight, warmer
first-person-adjacent voice; (2) the occupied desk, the signature reveal and the
method-over-Joe turn; (3) what it feels like to work with Joe, trust attributes
(competence, judgment, character, humility, stability, direction) as personal
artifacts on the desk, not a resume; (4) what drives the work, standards and
public links (LinkedIn, GitHub, the studio); (5) start with a conversation, one
fresh invitation and a soft path toward the guest book.

Avoid: leaking the personal reveal into earlier rooms; re-explaining the method;
making About theatrical; consultant-bio cliche; em dashes in the signature copy.

### Contact — Guest book at the door (calm conclusion, tan, `--spot` lowest, no scroll)

A single calm screen at the door under one focused desk lamp, low light, no
scroll. Parallax fully stops; the only motion is the clay cursor blinking in the
first field. The contact form (posting to `/api/contact`) is the guest book.

Voice: the calm conclusion, back to Home's restraint but quieter and more
intimate. One screen, no persuasion left; the walk made the case.

Memorable moment: the guest book under the lamp. Motion goes null, the desk light
warms as the form focuses, the clay cursor blinks, and submission dims the room to
a single confirmed line.

Sections: (1) the door, threshold minimal, lowest `--spot`, motion stops on load;
(2) the guest book (contact form), clay cursor in the first field as the only
motion, preserved posting to `/api/contact`, warm placeholder guidance, one
screen; (3) the quiet close, on submit the room dims to a single confirmed line,
no new sections, no scroll.

Avoid: altering the `/api/contact` form; adding scroll or parallax; the verbatim
CTA or restating the method; contrast dropping at the lowest `--spot`; em dashes
in the confirmation copy.

---

## 6. QA Spec

### Spatial

- Building-not-stack: loading all eight files back to back, the site reads as one
  walked building. The three affordances are present and recognizably the same
  system in every room including enablement.
- Depth-forward, never sideways: entrance hall to survey room to atrium to three
  benches to desk to guest book. No lateral tab-swap feel.
- Thinking is a genuine walk-through, not a `display:none` tab swap. Chambers dim
  behind as you leave.
- Lamp-follow / lighting-as-space on Home, Playbook, Thinking: the lamp tracks
  the pointer (`--mx`/`--my`), exhibits brighten as approached.
- Method pinned assembly is watchable: three components lower onto one bench and
  lock along leader lines.
- Home Four Cs as physical event: buyer-outcome line settles first, then four
  cumulative passes, each taller. Order verifiable, not simultaneous.
- Lighting-as-pacing tokens present: `--spot`, `--wash`, `--rim` composed over
  `--accent`, actually changing per page. Hues not reinvented.
- Clay discipline: `--clay` only on the active mark, on every page, nothing else.
- Setup-line-before-exhibit timing verified (not just presence).
- Floor-plan nav reads as a located map with a clay marker docking to the current
  room.

### Voice

- No em dashes anywhere in any copy across all eight files.
- No verbatim CTA repetition; each room's CTA rewritten to fit.
- Antithesis tic killed (`X, not Y`), intentional single uses only.
- Clipped-heading cadence killed; headings vary.
- Vocabulary not overworked; caps honored, motifs kept but not saturated.
- Handley warmth + Ogilvy respect; setup lines are host-speech, not wall text.
- Method-over-Joe held; the authorial "I" does not surface before About.
- About delivers the signature turn and recontextualizes prior rooms.
- Buyer-outcome-first: Home and Services lead with the buyer's reality before
  mechanisms.

### Accessibility

- Method nav keyboard operable (Tab/Shift+Tab, Enter/Space open, Arrows through
  items, Escape closes and returns focus to trigger). No mouse-only affordance.
- Method nav ARIA: `aria-expanded`, `aria-controls`/`aria-haspopup`, submenu role,
  `aria-current` on the current room. Verify on all pages including enablement.
- Visible non-color-only focus rings that survive low-light rooms at low `--spot`.
- Reduced-motion is the default static state: everything renders straight to final
  lit, finished, fully-visible. Home Four Cs, Method assembly, Thinking chambers
  all render fully.
- No dark rooms for keyboard/SR users: every spotlight exhibit has a lit resting
  state and content in the DOM. JS-off degrades to readable.
- Contrast holds at low light: cream-on-charcoal meets ratio at the lowest
  `--spot` on Home and Contact.
- Thinking not gated behind JS: all three chambers' text exists statically.
- Images have meaningful alt text.
- Forms accessible: `/api/contact` and the enablement form (`source: enablement`)
  have labeled fields, announced error/success states, keyboard usability.
  Enablement form untouched and functional.
- Focus order matches spatial order (threshold to setup line to exhibit).

### Performance

- Single rAF spine: one loop, one scroll value, one `--p` per active room. No
  competing loops or scroll listeners doing layout work.
- Transform/opacity only; no layout thrash.
- Layer cap: at most three parallax layers per room.
- 60fps on mid-tier hardware in the heaviest rooms (Thinking, Home passes, Method
  assembly). Scroll and pointer parallax throttled.
- Pointer parallax reuses `--mx`/`--my`, no new per-frame layout reads.
- Reveals IO-gated over ~620ms on `--ease` with `--i` stagger; observers
  unobserve after firing.
- No jank from images: sized, lazy-loaded, no layout shift during reveals.
- Enablement app performance untouched by shared JS.
- Reduced-motion path is cheap: rAF and observers short-circuited, not running
  invisibly.
- CLS near zero.

### Architecture fidelity

- Five top-level pages intact (Home / Services / Method / About / Contact). No
  route or source file deleted; all eight files resolve.
- Method is the parent; its three components nest beneath it in nav (01 Playbook
  -> /playbook/, 02 Enablement -> /enablement/, 03 Thinking -> /thinking/). The
  flat sibling layout is gone.
- One-method-three-components taught sitewide; Method assembles them onto one
  bench; component pages reference the parent.
- Unified nav shell on all pages including enablement (outer chrome only).
- Enablement app fully preserved (inline style + script, spheres, travel diamond,
  prompt generator, `source: enablement` form).
- Contact form preserved (`/api/contact`); enablement form preserved
  (`source: enablement`).
- Redundant method-trail sub-nav removed.
- Progressive revelation / no re-walking: one primary full explanation per
  concept; Enablement is the explanation layer, Activation the commercial entryway
  on Home.
- Emotional pacing curve intact and not flattened via the lighting tokens.
- Six-stage trust ladder honored (Recognition -> Relief -> Practical Trust ->
  Organizational Trust -> Distinctive Trust -> Action); Research/Thinking as proof
  of difference, Contact as the Action close.
- Signature reveal preserves Method-over-Joe: anonymous until About signs it.

---

## 7. Provenance Guardrails (never violate)

These restate the load-bearing architecture this rebuild must honor.

- **Stable architecture.** Home / Services / Method / About / Contact are the five
  top-level pages. Method is the parent operating system; its three components are
  01 AI Activation Playbook (/playbook/), 02 AI Enablement Architecture
  (/enablement/), 03 AI Accelerated Thinking (/thinking/). The three are components
  of one method, not three independent services.
- **Buyer outcomes before machinery.** Lead with the buyer's reality and outcomes
  (Confidence, Capability, Consistency, Compounding) before explaining Joe's
  mechanisms.
- **Activation is the commercial entryway (Home).** AI Enablement Architecture is
  the explanation layer, not a co-headline. Research is proof of difference, not
  the front door.
- **Progressive revelation.** Each concept has one primary full explanation;
  earlier pages introduce, later pages deepen. Do not re-explain.
- **Six-stage trust ladder:** Recognition -> Relief -> Practical Trust ->
  Organizational Trust -> Distinctive Trust -> Action.
- **Emotional pacing curve (do not flatten):** Home restrained, calm, spacious;
  Services + Method more architectural; Playbook + Enablement more immersive;
  Thinking most theatrical (the only room granted full line-to-light completion);
  About restrained again; Contact a single calm screen.
- **Method-over-Joe** until About reveals it is fundamentally one person's work.
- **Hard boundaries.** Preserve the Enablement interactive app (inline `<style>` +
  `<script>` state machine, spheres, travel diamond, role-lens prompt generator,
  contact form) entirely; only its outer chrome may be unified. Preserve the
  contact form posting to `/api/contact` and the enablement contact form
  (`source: enablement`). Do not delete any page, route, or source file; rebuild
  in place. No em dashes anywhere in copy.
- **Shared behavior lives in `assets/djc-spatial.css` and
  `assets/djc-spatial.js`** so eight hand-built files read as one building.
