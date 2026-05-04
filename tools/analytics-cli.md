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

### Preferred local path: ADC with your Google login

This is the safest default for local development because it avoids keeping a long-lived service-account
JSON key around just to query reports from your own machine.

1. Install Google Cloud SDK (`gcloud`).
2. Enable the Google Analytics Data API and Google Analytics Admin API in a Google Cloud project you control.
3. Make sure the Google account you will use locally has at least Viewer access on the GA4 property.
4. Create or reuse a Google OAuth client and download its client JSON.
   For the local CLI, the simplest choice is:
   - Google Cloud Console -> APIs & Services -> Credentials
   - Create Credentials -> OAuth client ID
   - Application type: `Desktop app`
   - Download the JSON file to your machine
5. Run the ADC login flow.
   The easiest local path is the helper script in this repo:

```bash
npm run analytics:login
```

   It will prompt you for the OAuth client JSON path, print a Google URL, and ask you to paste the authorization code back into the terminal.

   If you want to run the underlying command directly:

```bash
gcloud auth application-default login --client-id-file=YOUR_CLIENT_JSON_FILE --scopes=https://www.googleapis.com/auth/analytics.readonly,https://www.googleapis.com/auth/cloud-platform --no-launch-browser
```

6. Copy `.env.example` to `.env.local`.
7. Set `GA4_PROPERTY_ID` in `.env.local`.
8. Leave `GOOGLE_APPLICATION_CREDENTIALS` unset unless you intentionally want to override ADC.

### Fallback path: explicit credentials

If `gcloud` is not available, the CLI also supports:

- `GOOGLE_APPLICATION_CREDENTIALS`
- `GA4_CLIENT_EMAIL` + `GA4_PRIVATE_KEY`
- `GA4_SERVICE_ACCOUNT_JSON`

For that path, create a dedicated service account, enable the same APIs, and add the service account
to the GA4 property with at least Viewer access.

Current property:

- `Disruption Joe - GA4`
- `GA4_PROPERTY_ID=362548326`

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

- ADC via `gcloud auth application-default login`
  - for GA4's `analytics.readonly` scope, use an OAuth client JSON file with `--client-id-file`

Also supported:

- `GOOGLE_APPLICATION_CREDENTIALS`
- `GA4_CLIENT_EMAIL`
- `GA4_PRIVATE_KEY`
- `GA4_SERVICE_ACCOUNT_JSON`

## Notes

- `.env.local`, `credentials/`, and service-account JSON files are ignored by git.
- The CLI is local-only. It does not deploy anything and does not change the website.
- The official Google Analytics MCP server uses the same underlying ADC pattern, so this setup is
  reusable later if the repo adopts MCP-based querying.
