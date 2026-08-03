# Contact Planning Room

Date: 2026-08-03
Run: `RUN-20260803-125347-djc-contact-planning-room-direct`

## Approved change

The contact route is now the Planning Room at the edge of the Thinking
Experience rather than a legacy marketing-site form. It retains the five
current Work With Joe starting points and accepts their existing `intent`,
`message`, `sourcePage`, and `serviceFocus` query parameters.

The visitor flow is intentionally short:

1. Choose a starting point, unless a museum display already selected one.
2. Share name, email, organization, and the situation Joe should understand.
3. Receive a submission reference after Resend accepts the message.

On phone and tablet layouts, the introductory wall leaves the viewport after
the visitor selects a path so the complete details form and action remain
visible together. The route has only the Disruption Joe identity and a return
to the museum. The legacy navigation and footer are not present.

## Intake contract

Resend is the only contact-path integration. Twenty is no longer called or
documented for contact intake.

Each accepted inquiry is saved as a structured email in the notification
mailbox. The message includes:

- submission ID and UTC receipt time
- name, normalized reply email, and organization
- selected Work With Joe starting point
- the visitor's complete note
- source, source page, and service-focus context

The email has plain-text and HTML versions, uses the visitor's email as
`reply_to`, and returns both the public submission ID and Resend delivery ID to
the browser. The submission ID is also used as the Resend idempotency key for
that server invocation.

Mailbox delivery is the canonical raw intake for this phase. No replacement
CRM, database, or Vercel-filesystem persistence was introduced. A person or
opportunity can be promoted later into the separately governed relationship
records when it becomes meaningful.

## Reliability and safety

- server-side required-field, email, and maximum-length validation
- HTML escaping for all visitor-controlled email content
- hidden honeypot that accepts likely bot submissions without sending email
- no-store responses and existing production-origin CORS boundary
- typed `CONTACT_NOT_CONFIGURED`, `CONTACT_DELIVERY_FAILED`, and
  `INVALID_CONTACT_REQUEST` errors
- visitor input remains in the form after any failed request
- provider failure logs contain the submission reference but no credential or
  visitor message

## Required production configuration

The production environment needs:

- `RESEND_API_KEY`
- `CONTACT_NOTIFY_FROM_EMAIL`
- `CONTACT_NOTIFY_TO_EMAIL` (defaults to `joe@disruptionjoe.com` in code)

The from address must use a Resend-verified sending domain. Environment changes
need a fresh Vercel deployment before the function can see them.

No live inquiry was sent and no Resend, Vercel, Gmail, DNS, or deployment
setting was changed in this Run.

## Validation

- `npm test` passed.
- `node --check api/contact.js` passed.
- Mocked handler coverage passed for invalid input, missing configuration,
  honeypot, Resend rejection, and successful structured delivery.
- Browser inspection passed at 1280 x 720, 768 x 1024, 393 x 852, and 320 x
  568 with no horizontal overflow.
- Direct intent routing opens the details step with the correct selected path.
- A local failed POST preserved every completed field and restored the submit
  button.
- `git diff --check` passed before closeout.
