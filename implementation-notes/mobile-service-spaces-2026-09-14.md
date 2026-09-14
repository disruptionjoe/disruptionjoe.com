# Mobile Work with Joe spaces

Joe approved one Work with Joe floor with separate Thinking Better Together
and AI Services spaces. Both have entrance buttons and a persistent space
switch. Each selection opens its own horizontal exhibit circuit; the shared
elevator and seven-floor navigation remain in place.

Thinking Better Together uses the three existing desktop decision exhibits,
now shared before mobile initialization. AI Services retains five situations
and its two supporting experiences. Inspector content and contact intent are
reused. Desktop service-room content is unchanged.

Validation: npm test and git diff --check pass. A local jsdom interaction
check passes for seven floors, both entrances, switching, exhibit counts,
inspector/contact intent, progress navigation, elevator return, repeated
switching, and exactly one accessible active panel. Scratch verification is
in _local/mobile-spaces/.

Rendered layout and touch interaction remain unverified. Local headless
Chrome could not launch, and browser preview access was denied. No deployment
or GitHub push is included; publication awaits Joe approval and visual review.

Reconciled newer desktop commits through 0eaa49d. Preserved the T-junction,
service placards and buyer-concern content. Updated the old desktop-only
assertion to require one shared declaration before mobile lookup; desktop
geometry/route checks pass alongside the mobile DOM checks.
