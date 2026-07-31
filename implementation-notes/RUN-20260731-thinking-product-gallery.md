# RUN-20260731 Thinking Product Gallery

## Bottom line

The Thinking Experience now presents five buyer-facing products in Work With
Joe, with each product's action carrying its selected intent into the shared
planning-call form. The three methodology displays now live in a larger Methods
and Tools room with the supporting repository exhibits.

## Implemented

- Added five distinct product displays to the desktop Work With Joe room:
  - Make a consequential AI decision.
  - Make AI capability show up in real work.
  - Turn scattered AI activity into business value.
  - Push an important R&D question further.
  - Bring more substantive applied AI work to your clients.
- Gave each product a brand-native generated display graphic, a buyer-facing
  static purpose, a focused dynamic explanation, and its approved CTA.
- Routed every CTA to `/contact/` with both `intent` and `serviceFocus` set to
  the selected product, while retaining `/thinking/` as the source page.
- Replaced the old three-offer treatment in Work With Joe with the five product
  displays.
- Enlarged the Methods and Tools room and moved Capability Acceleration,
  Enhanced Facilitation, and Enablement Architecture into it alongside AI
  Activation Playbooks, AI Enablement Architecture, and AI Epistemology.
- Matched mobile Floor 01 to the five products and mobile Floor 02 to the three
  methodologies plus their supporting tools.
- Updated the contact form choices to the five buyer-facing outcomes and kept
  the existing query-string preselection behavior.

## Validation

- Confirmed the five product records and their unique intent-aware links are
  present exactly once in the experience data.
- Confirmed the mobile product card, dynamic inspector, and CTA fit within a
  390-by-844 viewport.
- Confirmed a product CTA opens the local contact page and preselects the exact
  product intent.
- Confirmed the mobile Work With Joe and Methods and Tools floor doors render
  cleanly after the content changes.
- Confirmed the browser console has no warnings or errors.
- `npm test`
- `git diff --check`
