# How I Can Help and browsable playbook

Joe requested a snappier How I Can Help page, a contextual link instead of its
embedded catalogue, and a playbook browsed as books/pages with optional filters.

## Implementation

- How I Can Help retains its surrounding copy and five sections. The 29 embedded
  session cards are replaced with a link to the dedicated Facilitation Playbook.
  Sections snap vertically and offer Continue controls. Mobile category and
  larger-engagement groups scroll horizontally so they do not stretch into long lists.
- The playbook opens directly on a cover. Vertical navigation moves between six
  existing play groupings (Frame, Diverge, Converge, Decide, Check, Practice),
  Working sessions, and Techniques. Horizontal navigation turns pages.
- All 80 source records remain: 40 plays, 29 sessions, 11 techniques. Existing
  content, sequences, related links and shareable filtered/detail URLs remain.
  Plays with multiple book tags appear once under their first source book tag;
  filters still match every assigned tag.
- Filters are collapsed by default. Visitors choose options across facets and
  select View matching pages. Text search is optional and separately collapsed.
- Touch, arrow buttons, keyboard browsing and reduced-motion settings are
  supported. Flat surfaces avoid the elevator's previously problematic 3D scene.

## Verification

- All 62 repository tests passed; catalogue checks now target the preserved
  dedicated data and the Services link rather than requiring embedded cards.
- WebKit acceptance at 320, 390, 768 and 1440px checked book/page navigation,
  combined filters, clearing filters, direct item URLs, Services snapping,
  catalogue completeness, viewport fit and absence of JavaScript errors.
- Native Chromium touch gestures verified vertical book and horizontal page
  movement; keyboard arrows and filter-panel closing also passed.
- Short-phone WebKit acceptance at 320 x 568 confirmed long play details scroll
  and Services continuation remains reachable. Short Services viewports use
  proximity snapping so taller sections do not trap their final controls.
- Mobile and desktop layouts were visually inspected. Physical iPhone review
  remains Joe's live acceptance; local WebKit is not an actual iPhone.
- No contact submission, pricing, homepage, collection, Museum or AI Activation
  Playbook content was changed.
