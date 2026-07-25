# RUN-20260725 Thinking Mobile Floor Order

## Bottom line

The mobile Thinking Museum now begins with three buyer-facing offers and a
Contact Joe next step, then moves through the approved floor sequence from
methods into research, development, identity, operating systems, and Church of
AI.

## Implemented

- Expanded Floor 01, Work With Joe, to contain:
  - Enhanced Facilitation
  - Capability Acceleration
  - Enablement Architecture
  - Contact Joe
- Rendered the first three as `Offer` cards rather than ordinary exhibits.
- Rendered Contact Joe as a distinct `Next Step` card with a dimensional
  physical-button composition and a direct action to `/contact/`.
- Reordered the eight mobile floors:
  1. Work With Joe
  2. Methods and Tools
  3. Discover
  4. Development Laboratory
  5. Who Is Joe
  6. Control Room
  7. Support Systems
  8. Church of AI
- Reordered Who Is Joe to About Joe, LinkedIn, GitHub, X, Thinking Wiki, and
  Disruption Joe Profile.
- Kept the Graveyard desktop-only.
- Preserved every desktop room, display placement, and interaction.

## Validation

- Confirmed the floor sequence, floor numbers, and Work With Joe card inventory
  in source.
- Confirmed the Contact Joe action routes internally to `/contact/`.
- `npm test`
- `git diff --check`
