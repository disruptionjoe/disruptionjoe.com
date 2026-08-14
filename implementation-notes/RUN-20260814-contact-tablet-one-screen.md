# Contact Planning Room: tablet one-screen fit

## Outcome

The Planning Room now uses a compact, form-first composition on landscape
tablet-class touch screens. Both the intent step and the planning-note step fit
inside a 600px-tall viewport without scrolling.

## Boundary

The compact treatment applies only when all of these conditions are true:

- viewport width is 621px through 1280px;
- viewport height is 600px through 900px; and
- the primary pointer is coarse.

Phone and fine-pointer laptop layouts remain unchanged. Taller portrait
tablets continue using the existing narrow-screen form composition, which
already fits within one screen.

## Treatment

- The explanatory sign is omitted on the compact tablet canvas so the planning
  console becomes the sole focal panel.
- Navigation, console rail, field spacing, textarea, actions, and fallback copy
  use a tighter vertical rhythm.
- All fields remain present and buttons/path choices retain at least 44px touch
  height.
- Intent preselection, validation, submission, success, and error behavior are
  unchanged.
