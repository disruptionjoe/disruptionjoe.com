# Approved homepage threshold and orientation

Run: `RUN-20261023-163809-djc-website-orientation-copy-direct`

Authority: Joe's direct 2026-10-23 copy, implementation, and publication instruction.

## Delivered update

- Replaced the threshold support statement with the approved `Better Conversations. Better Outcomes. Better Performance.` line while preserving the neon entrance and `Enter the experience` action.
- Replaced the prior facilitation-mechanics orientation with Joe's approved first-person narrative, in its approved sequence and wording.
- Presented the narrative as four paced chapters inside the existing orientation destination: the visitor problem, Joe's working-session method, the felt result, and the invitation to explore.
- Kept the orientation scrollable within the screen-to-screen homepage model. Desktop and tablet use full-height chapter pacing; mobile uses the same sequence as a natural continuous scroll.
- Added a persistent `Talk with Joe` shortcut and retained the final `Explore the Floors` action.
- Changed visitor-facing challenge language from exhibits to rooms while leaving internal implementation names stable.
- Updated public metadata, machine-readable positioning, and the root sitemap date.

## Preserved behavior

- The five independent floors, 21 challenges, five established AI stages, saved-challenge collection, inquiry handoff, Meet Joe destination, deep links, browser navigation, keyboard and pointer controls, and reduced-motion handling remain in place.
- The Thinking Museum at `/thinking/` has no source change.
- The inquiry still works with or without saved challenges and does not diagnose, score, or automatically recommend a program.

## Validation

- Repository test suite: 21/21 passed.
- Source checks enforce the full approved orientation narrative in order, verify the superseded copy is absent, and reject an em dash in the revised homepage source.
- JavaScript syntax checks passed.
- Homepage and Thinking Museum HTML parsed successfully.
- Whitespace validation passed.
- `/thinking/` source remains outside the changed footprint.

A headless local-browser render could not run because the installed browser is unavailable to the sandboxed process. Responsive behavior was therefore validated through the existing breakpoint contract, semantic source, automated behavior assertions, and public-source checks after publication. This is a visual-QA limitation, not a known functional defect.

## Publication

The coherent update is published through the repository's existing GitHub-to-Vercel path. The public root marker is `20261023-orientation-v1`.
