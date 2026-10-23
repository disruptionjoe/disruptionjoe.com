# Orientation reaction voice wall

Run: `RUN-20261023-125817-djc-website-reaction-wall-direct`

Authority: Joe's direct 2026-10-23 content, interaction, and publication instruction.

## Delivered update

- Replaced the four static reaction cards on orientation page four with all ten approved statements, preserving their wording and order.
- Built a visitor-controlled voice wall: one reaction occupies the main stage while all ten numbered thematic voices remain immediately visible and selectable.
- Gave the selector field varied widths, directions, and arrival timing so the voices emerge as a burst rather than a testimonial grid.
- Added previous and next controls, tab semantics, Left and Right arrow navigation, direct selection, and horizontal swipe on the featured reaction.
- Kept Up and Down navigation available for the orientation journey and used `touch-action: pan-y` so reaction gestures do not trap vertical movement.
- Added no timed rotation, perpetual reaction animation, attribution, names, roles, logos, or testimonial claims.

## Responsive behavior

- Desktop presents the featured voice beside a spatial ten-voice signal field.
- Tablet tightens the field and featured typography while keeping the same interaction and all ten selectors visible.
- Mobile and short screens use a prominent reaction above a horizontally snapping selector rail, avoiding a long list and preserving touch-sized choices.
- Reduced-motion preferences collapse arrival and selection animations to effectively instantaneous state changes.

## Preserved behavior

- Threshold, other orientation moments, orientation snapping, final entry transition, Floor Zero, floors, rooms, collection, inquiry, Meet Joe, and the Thinking Museum are unchanged.
- No source under `/thinking/` or its interaction assets changed.

## Validation and publication

- Repository test suite: 23/23 passed.
- Source contracts verify all ten exact statements, ten linked tabs and panels, manual keyboard and touch controls, polite announcement, reduced motion, the absence of timed rotation, and removal of the superseded four reactions.
- JavaScript syntax, HTML parsing, CSS brace balance, unique IDs, `aria-controls` targets, local links, and whitespace checks passed.
- The cache-busted production homepage, stylesheet, and interaction script matched the committed local files byte-for-byte.
- Production retained Floor Zero and the Thinking Museum entry point.
- Published implementation revision: `2e5c056d3791691297e955c935992970bd1e649e`.
- Public asset marker: `20261023-reactions-v1`.

The managed browser-origin policy prevented local graphical browser preview and was not bypassed. Responsive behavior was validated through explicit breakpoint contracts, interaction source checks, and production byte equality. This is a visual-QA limitation, not a known functional defect.
