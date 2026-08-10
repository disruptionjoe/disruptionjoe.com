# Reduce Thinking Experience rendering cost

## Objective

Lower the desktop Thinking Experience GPU burden and stop drawing the full
WebGL scene continuously while nothing visible is changing.

## Result

- Capped the WebGL backing resolution at `1.5x` device pixel ratio instead of
  `2x` and disabled the unused preserved drawing buffer.
- Replaced the perpetual animation-frame loop with a demand scheduler:
  - movement and elevator transitions retain full-rate animation;
  - the laboratory retains its existing roughly 24 FPS update cadence while
    the visitor is nearby;
  - the neon wakes only at its actual flicker-state boundaries while nearby;
  - static scenes sleep with no scheduled render work.
- Limited proximity scans and camera-facing billboard updates to camera
  changes instead of every display frame.
- Limited runtime diagnostic DOM writes to value changes.
- Suspended the hidden WebGL canvas in the separate mobile walkthrough and
  reduced its backing buffer to `1x1` CSS pixels.
- Added visibility, resize, texture-load, keyboard, and focus wake-up handling
  so the experience repaints when it needs to.
- Cache-busted the Thinking Museum script.

## Preserved

Scene geometry, display placement, public copy, movement speed, elevator
transitions, proximity behavior, neon timing, laboratory motion, interactions,
and mobile floor content remain unchanged.

## Validation

- Repository JavaScript test suite passes.
- Fresh local desktop browser smoke test at device pixel ratio `2`:
  - canvas backing buffer is `1920x975` for a `1280x650` viewport;
  - `data-render-scale` reports `1.50`;
  - the experience reaches `idle-scheduled` at the spawn point;
  - the scene remains visually intact in a fresh screenshot.
- Static scheduler checks confirm the only animation-frame request is inside
  `requestRender()`, mobile exits before scheduling, and full-rate work is
  limited to movement/elevator activity.
- HTML, YAML, JavaScript syntax, structure, and whitespace checks pass.
