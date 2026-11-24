# Analytics coverage and conversion instrumentation

## Scope

Joe authorized restoring the existing GA4 property across the public website and adding bounded measurement for the current facilitation journey. No visitor interaction, navigation, layout, or copy changed except for a factual clarification on the Privacy page.

## Production audit

- Live production HTML on November 24, 2026 contained no Google tag or shared analytics loader on Home, How I Can Help, Pricing, or Contact.
- The live Enablement page loaded both the Google tag and `/analytics.js` with measurement ID `G-Z5GRJZ8D1N`.
- `vercel.json` and `package.json` contained no production-level tag injection.
- Repository history shows the same measurement ID was introduced in the original analytics implementation on April 10, 2026.
- The GA4 property's display name could not be independently read. Codex browser attachment was unavailable, so account-level property confirmation and key-event configuration remain dashboard checks.

## Implementation

- Every public HTML entry loads one versioned shared `/analytics.js` file. The Enablement page no longer loads a second Google tag directly.
- The shared loader adds the Google tag asynchronously and treats load failure as a no-op.
- GA4 automatic page views are disabled. One manual initial `page_view` is sent, and explicit high-level virtual page views cover meaningful Floor navigation. Duplicate virtual paths are suppressed.
- Initial UTM attribution is retained. Other query parameters, arbitrary hashes, and referrer query strings are excluded from analytics URLs.
- Google signals and advertising personalization signals are disabled.
- Analytics is disabled for `lite=1`, `noresize=1`, Global Privacy Control, Do Not Track, the GA disable flag, and the repository's local analytics opt-out key.
- The event allowlist is `orientation_complete`, `challenge_view`, `challenge_add`, `collection_view`, `form_start`, and `generate_lead`.
- Event parameters are limited to public IDs and counts: `floor_id`, `challenge_id`, `collection_count`, `cta_location`, and `form_name`.
- Contact names, email addresses, organizations, scheduling links, messages, challenge labels, and other visitor-entered text never enter analytics parameters or tracked URLs.
- The contact API now distinguishes delivered inquiries (`accepted: true`) from quietly accepted honeypots (`accepted: false`). The browser emits one `generate_lead` only after an accepted successful response. Errors and honeypots emit no lead.
- The existing `trackFormSubmission()` entry point remains available and now maps to the single `generate_lead` event, avoiding a second conversion event.
- The Privacy page now names GA4, the data boundary, URL sanitization, and honored browser privacy signals.

## Verification

- `npm test`: 62 of 62 pass.
- Static coverage proves all 16 public HTML entries load the shared implementation once and no page directly loads `googletagmanager.com`.
- WebKit desktop at 1366 by 900 and WebKit phone at 390 by 844 passed with Google domains blocked. Home, Orientation, room, add-to-collection, and collection interactions remained functional with no uncaught or console errors.
- The blocked-network runs produced `page_view`, `orientation_complete`, `challenge_view`, `challenge_add`, and `collection_view` in both viewports.
- Contact browser acceptance produced one `form_start` and one `generate_lead` for an accepted response. The honeypot response produced `form_start` and no `generate_lead`.
- The real Google tag generated a GA4 collection request to `G-Z5GRJZ8D1N` with `en=page_view`, `dp=/`, `npa=1`, and the two allowlisted UTM values. Private query values were absent.
- Data-layer acceptance produced one initial `/` page view and one `/floor/momentum` page view when the same virtual path was requested twice.
- No live contact form was submitted during acceptance, so no email or test lead was sent.

## Remaining GA4 administration

After deployment, use property access to confirm that `G-Z5GRJZ8D1N` is the intended Disruption Joe GA4 web stream, mark `generate_lead` as a key event, and confirm the deployed debug traffic in Tag Assistant and GA4 DebugView. The code supports DebugView when `analytics_debug=1` is present, but account-level confirmation was unavailable in this run.

The site has no consent-management interface. The implementation honors browser privacy choices and disables advertising features. If Joe intends to target or measure visitors in a jurisdiction that requires opt-in consent for GA4, the need for a consent mechanism remains a legal and business decision outside this no-UX-change batch.
