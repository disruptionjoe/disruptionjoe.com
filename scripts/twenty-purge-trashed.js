// Phase 3: Hard-destroy all soft-deleted Person records in Twenty.
// Reads the backup JSON, skips any ID already destroyed, and calls
// destroyPerson(id) for each. Rate-limit aware. Writes an append-only
// purge log so we have a full audit trail.
//
// Usage: node scripts/twenty-purge-trashed.js
//
// The backup file must exist at:
//   C:/Users/joe/JB/CapacityOS/local/twenty-purge-backup-2026-04-23.json

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

const BACKUP_PATH = "C:/Users/joe/JB/CapacityOS/local/twenty-purge-backup-2026-04-23.json";
const LOG_PATH    = "C:/Users/joe/JB/CapacityOS/local/twenty-purge-log-2026-04-23.jsonl";

function sleep(ms) { return new Promise(r => setTimeout(r, ms)); }

function isRateLimited(errors) {
  const msg = JSON.stringify(errors || []);
  return msg.includes("LIMIT_REACHED") || msg.includes("Rate limit");
}

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

function logLine(obj) {
  fs.appendFileSync(LOG_PATH, JSON.stringify({ t: new Date().toISOString(), ...obj }) + "\n");
}

async function destroyOne(id) {
  // up to 3 retries on rate-limit
  for (let attempt = 1; attempt <= 10; attempt++) {
    const r = await gql(`mutation D($id: ID!) { destroyPerson(id: $id) { id } }`, { id });
    if (r.ok && r.json?.data?.destroyPerson?.id === id) return { ok: true };
    if (r.json?.errors && isRateLimited(r.json.errors)) {
      process.stdout.write(` [rate-limited, wait 65s] `);
      await sleep(65000);
      continue;
    }
    // Other error: log and move on
    return { ok: false, error: r.json?.errors ? JSON.stringify(r.json.errors).slice(0, 300) : r.raw.slice(0, 300), status: r.status };
  }
  return { ok: false, error: "rate-limit retries exhausted" };
}

async function run() {
  const backup = JSON.parse(fs.readFileSync(BACKUP_PATH, "utf8"));
  console.log(`backup loaded: ${backup.records.length} records`);

  // Load already-destroyed IDs from log so we can resume safely
  const alreadyDone = new Set();
  if (fs.existsSync(LOG_PATH)) {
    for (const line of fs.readFileSync(LOG_PATH, "utf8").split(/\r?\n/)) {
      if (!line.trim()) continue;
      try { const o = JSON.parse(line); if (o.status === "destroyed") alreadyDone.add(o.id); } catch {}
    }
  }
  // Also skip the dry-run ID (belt + suspenders)
  alreadyDone.add("000d6e85-d495-4d7a-860e-67b878be6cd5");

  const todo = backup.records.filter(r => !alreadyDone.has(r.id));
  console.log(`${alreadyDone.size} already destroyed, ${todo.length} remaining`);

  let ok = 0, fail = 0;
  const t0 = Date.now();
  for (let i = 0; i < todo.length; i++) {
    const rec = todo[i];
    const result = await destroyOne(rec.id);
    if (result.ok) {
      ok++;
      logLine({ status: "destroyed", id: rec.id, email: rec.emails?.primaryEmail || null });
    } else {
      fail++;
      logLine({ status: "failed", id: rec.id, email: rec.emails?.primaryEmail || null, error: result.error });
    }
    if ((i + 1) % 25 === 0 || i === todo.length - 1) {
      const elapsed = ((Date.now() - t0) / 1000).toFixed(0);
      process.stdout.write(`\r[${i + 1}/${todo.length}] ok=${ok} fail=${fail} elapsed=${elapsed}s     `);
    }
  }
  process.stdout.write("\n");
  console.log(`done. destroyed ${ok}, failed ${fail}. log: ${LOG_PATH}`);
}

run().catch(e => { console.error(e); process.exit(1); });
