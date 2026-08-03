# RUN-20260803 Contact Five-Offer Alignment

## Bottom line

The planning-call form now offers the same five current choices as Work With
Joe and Mobile Floor 01.

## Implemented

- Preserved “Not sure yet” as the default choice.
- Replaced the five superseded offer options with, in order:
  1. Understand where you are
  2. Build reliable AI ways of working
  3. Connect what works and scale it
  4. Help leaders guide AI-enabled change
  5. Push high-value work further
- Preserved form fields, query-parameter selection, submission behavior, and
  all other contact-page content.

## Validation

- Confirmed the dropdown order matches Work With Joe and Mobile Floor 01.
- Confirmed each product CTA query intent matches an existing option.
- Confirmed the five superseded options no longer appear on the contact page.
- Confirmed a local CTA-style URL selects the matching native option without
  adding a duplicate, with no browser warnings or errors.
- `npm test`
- `git diff --check`
