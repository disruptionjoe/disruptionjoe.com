# RUN-20260724 Thinking Discover Gallery Expansion

## Bottom line

The long Discover gallery now has the same five-unit exterior width as the
main Support Systems gallery. The expansion runs east, away from the Control
Room, so the existing Control clearance remains unchanged.

## Implemented

- Increased the long Discover gallery from 3.4 to 5.0 scene units wide.
- Kept its west wall fixed at `x = -15.9`, preserving roughly 1.2 scene units
  of wall-to-wall separation from the Control Room.
- Moved the east wall, its four exhibits, the Development Laboratory doorway,
  and the complete Laboratory 1.6 scene units east as one coherent assembly.
- Recentered the Discover floor guide and gallery lights in the wider space.
- Updated the walking bounds to match the revised walls and Laboratory
  connection.
- Preserved the spawn dogleg, Church connection, exhibit order, longitudinal
  display spacing, interactions, and cleaned joined-corridor wireframe.

## Interaction effect

The regular exhibit proximity radius is 2.175 scene units. In the widened
gallery, either display wall is approximately 2.36 horizontal scene units
from the new centerline. A visitor can therefore walk along the middle and
view the room before deliberately approaching a display closely enough to
open its dynamic placard.

## Boundaries

The two end connectors remain at their approved fixed room connections. Their
length was not increased because doing so would require another Control Room
or Church relocation and would not add useful display wall length. The
existing eight main Discover displays were already distributed at roughly
four-to-five-unit longitudinal intervals; the width change addresses the
remaining crowding without reopening those surrounding architectural
decisions.

## Validation

- `npm test`
- `git diff --check`

