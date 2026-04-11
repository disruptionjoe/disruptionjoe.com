# GA4 CLI

This repo now includes a small local CLI for querying GA4 from the terminal.

## What It Does

- List accessible GA4 accounts and properties
- Realtime active users
- Overview totals for a date range
- Top pages
- Top events
- Top sources
- `form_submission` counts by day

## Setup

1. Create a Google Cloud service account with access to the Google Analytics Data API.
2. Enable the Google Analytics Data API for that Google Cloud project.
3. Add the service account to your GA4 property with at least Viewer or Analyst access.
4. Copy `.env.example` to `.env.local`.
5. Point `GOOGLE_APPLICATION_CREDENTIALS` at your local service account JSON file.
6. If you do not know the numeric GA4 property id yet, run `npm run analytics -- properties`.
7. Set `GA4_PROPERTY_ID` in `.env.local`.

Important:

- `GA4_PROPERTY_ID` is not the same thing as your website measurement ID.
- Your measurement ID looks like `G-Z5GRJZ8D1N`.
- Your property ID is a numeric value in GA4 Admin.

## Commands

```bash
npm run analytics -- properties
npm run analytics -- realtime
npm run analytics -- overview --days 7
npm run analytics -- pages --days 28 --limit 15
npm run analytics -- events --days 28
npm run analytics -- sources --days 28
npm run analytics -- form-submissions --days 28
```

## Auth Options

Preferred:

- `GOOGLE_APPLICATION_CREDENTIALS`

Also supported:

- `GA4_CLIENT_EMAIL`
- `GA4_PRIVATE_KEY`
- `GA4_SERVICE_ACCOUNT_JSON`

## Notes

- `.env.local`, `credentials/`, and service-account JSON files are ignored by git.
- The CLI is local-only. It does not deploy anything and does not change the website.
