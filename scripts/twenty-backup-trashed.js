// Phase 1: Export all soft-deleted Person records to a local JSON backup.
// Usage: node scripts/twenty-backup-trashed.js <outPath>

const fs = require("node:fs");
const path = require("node:path");

const envPath = path.join(__dirname, "..", ".env.production");
const envText = fs.readFileSync(envPath, "utf8");
for (const line of envText.split(/\r?\n/)) {
  const m = line.match(/^([A-Z_][A-Z0-9_]*)="?([^"]*)"?\s*$/);
  if (m && !process.env[m[1]]) process.env[m[1]] = m[2];
}

const apiKey = process.env.TWENTY_API_KEY;
const apiUrl = (process.env.TWENTY_API_URL || "https://api.twenty.com").replace(/\/+$/, "");
if (!apiKey) { console.error("Missing TWENTY_API_KEY"); process.exit(1); }

const outPath = process.argv[2] || path.join("C:", "Users", "joe", "JB", "CapacityOS", "local", "twenty-purge-backup-2026-04-23.json");

async function gql(query, variables) {
  const res = await fetch(`${apiUrl}/graphql`, {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  const text = await res.text();
  let json; try { json = JSON.parse(text); } catch { json = null; }
  return { ok: res.ok, status: res.status, json, raw: text };
}

const PAGE = 60;
const QUERY = `
  query Trashed($after: String) {
    people(
      first: ${PAGE},
      after: $after,
      filter: { deletedAt: { is: NOT_NULL } },
      orderBy: [{ id: AscNullsFirst }]
    ) {
      pageInfo { hasNextPage endCursor }
      edges {
        cursor
        node {
          id
          name { firstName lastName }
          emails { primaryEmail additionalEmails }
          linkedinLink { primaryLinkUrl primaryLinkLabel }
          jobTitle
          city
          sourcePrimary
          sourceDetail
          lifecycle
          createdAt
          updatedAt
          deletedAt
        }
      }
    }
  }
`;

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function isRateLimited(r) {
  const msg = JSON.stringify(r.json?.errors || []);
  return msg.includes("LIMIT_REACHED") || msg.includes("Rate limit");
}

async function run() {
  fs.mkdirSync(path.dirname(outPath), { recursive: true });

  // Resume support: if outPath exists, load + continue from last cursor
  let records = [];
  let after = null;
  if (fs.existsSync(outPath)) {
    try {
      const existing = JSON.parse(fs.readFileSync(outPath, "utf8"));
      records = existing.records || [];
      after = existing.lastCursor || null;
      console.log(`resuming: ${records.length} previously fetched, after=${after ? after.slice(0, 20) + "..." : "null"}`);
    } catch (e) {
      console.warn("existing backup unreadable, starting fresh");
      records = [];
      after = null;
    }
  }

  const writeProgress = (lastCursor, done = false) => {
    fs.writeFileSync(outPath, JSON.stringify({
      exportedAt: new Date().toISOString(),
      apiUrl,
      totalRecords: records.length,
      complete: done,
      lastCursor,
      records,
    }, null, 2));
  };

  let pageNum = 0;
  while (true) {
    pageNum++;
    const r = await gql(QUERY, { after });
    if (!r.ok) {
      console.error(`\nPage ${pageNum} HTTP ${r.status}:`, r.raw.slice(0, 500));
      writeProgress(after);
      process.exit(1);
    }
    if (r.json?.errors) {
      if (isRateLimited(r)) {
        process.stdout.write(`\nrate-limited at page ${pageNum}; waiting 65s...`);
        writeProgress(after);
        await sleep(65000);
        pageNum--; // retry same page
        continue;
      }
      console.error(`\nPage ${pageNum} GraphQL errors:`, JSON.stringify(r.json.errors));
      writeProgress(after);
      process.exit(1);
    }
    const edges = r.json?.data?.people?.edges || [];
    for (const e of edges) records.push(e.node);
    const pageInfo = r.json?.data?.people?.pageInfo;
    process.stdout.write(`\rfetched page ${pageNum} | cumulative ${records.length}`);

    // Write every 20 pages for crash resilience
    if (pageNum % 20 === 0) writeProgress(pageInfo?.endCursor || after);

    if (!pageInfo?.hasNextPage) break;
    after = pageInfo.endCursor;
  }
  process.stdout.write("\n");

  writeProgress(null, true);
  console.log(`wrote ${records.length} records -> ${outPath}`);
}

run().catch(e => { console.error(e); process.exit(1); });
