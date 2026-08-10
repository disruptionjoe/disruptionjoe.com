# Enter-key activation for dynamic placards

Run: `RUN-20260810-125045-djc-website-enter-cta-direct`

## Implemented

- Added a desktop Enter-key path for the currently visible dynamic placard.
- Activates the visible action button first; otherwise activates the visible link CTA.
- Reuses the existing element click behavior, preserving contact, respawn, internal navigation, external links, and target handling.
- Ignores key repeat, composition, modified Enter, editable/native interactive targets, open inspectors, open share racks, closed placards, and placards without a CTA.
- Preserved mouse interaction, movement, Escape, mobile behavior, proximity ranges, CTA copy, destinations, and demand-driven rendering.

## Verification

- `npm test`
- `git diff --check`
- Static assertions for CTA priority, Enter guards, existing key controls, cache reference, and restored entrance camera.
- Local desktop interaction confirmed Enter on the live AI Capability Soundcheck placard navigates to `/soundcheck/`.
- Confirmed the restored entrance state and zero browser console errors.

