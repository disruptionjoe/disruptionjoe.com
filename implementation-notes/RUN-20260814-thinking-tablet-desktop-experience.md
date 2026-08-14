# Thinking Experience: tablet desktop mode

## Outcome

Full-size tablets now enter the existing walkable 3D Thinking Experience instead of the mobile elevator story. Phones retain the mobile experience, including landscape phones with a short coarse-pointer viewport.

Tablet visitors without a keyboard receive a compact on-screen directional pad. Those controls feed the museum's existing arrow-key state and demand-rendering path; they do not introduce a separate movement system.

## Responsive boundary

- Mobile story: viewport width at or below 599px.
- Mobile story: coarse-pointer viewport height at or below 599px, covering landscape phones.
- 3D museum: viewports outside those phone conditions, including full-size tablets.
- Tablet directional pad: coarse-pointer viewports at least 600px wide and 600px tall.

## Preserved behavior

The desktop room geometry, exhibits, proximity interactions, keyboard movement, mobile floor content, mobile navigation, and renderer architecture remain unchanged. The entry instruction now acknowledges both keyboard and tablet controls.

## Validation

- 390x844 loaded the mobile elevator story.
- 768x1024 and 1024x768 loaded the full 3D museum.
- 1280x720 retained the desktop museum.
- The tablet directional pad was visually inspected and a held forward control moved the camera through the existing movement state.
- No browser console errors were observed.

