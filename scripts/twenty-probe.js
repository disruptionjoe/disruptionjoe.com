// Diagnostic: inspect Twenty CRM to see what "Joe Hernandez" / your email records look like.
// Usage: node scripts/twenty-probe.js <firstName> <lastName> <email>
// Reads TWENTY_API_KEY + TWENTY_API_URL from .env.production (gitignored).

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

const [,, firstName = "Joe", lastName = "Hernandez", email = ""] = process.argv;

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

function fmt(node) {
  return {
    id: node.id,
    firstName: node?.name?.firstName,
    lastName: node?.name?.lastName,
    primaryEmail: node?.emails?.primaryEmail,
    additionalEmails: node?.emails?.additionalEmails,
    sourcePrimary: node.sourcePrimary,
    sourceDetail: node.sourceDetail,
  };
}

async function run() {
  console.log(`\n-- Twenty API: ${apiUrl} --\n`);

  // 1. Count total people
  const countQ = `query { people(first: 1) { totalCount } }`;
  const countRes = await gql(countQ, {});
  console.log("Total people in workspace:", countRes.json?.data?.people?.totalCount ?? "(query failed)", countRes.ok ? "" : `(${countRes.status})`);
  if (countRes.json?.errors) console.log("  errors:", JSON.stringify(countRes.json.errors));

  // 2. Exact email lookup (what our handler does)
  if (email) {
    const q = `query($e: String!) { people(first: 5, filter: { emails: { primaryEmail: { eq: $e } } }) { edges { node { id name { firstName lastName } emails { primaryEmail additionalEmails } sourcePrimary sourceDetail } } } }`;
    const r = await gql(q, { e: email });
    console.log(`\nEmail eq "${email}":`, r.json?.data?.people?.edges?.length ?? 0, "matches");
    for (const e of r.json?.data?.people?.edges || []) console.log("  ", fmt(e.node));
    if (r.json?.errors) console.log("  errors:", JSON.stringify(r.json.errors));
  }

  // 3. Case-insensitive email lookup
  if (email) {
    const q = `query($e: String!) { people(first: 5, filter: { emails: { primaryEmail: { ilike: $e } } }) { edges { node { id name { firstName lastName } emails { primaryEmail additionalEmails } } } } }`;
    const r = await gql(q, { e: email });
    console.log(`\nEmail ilike "${email}":`, r.json?.data?.people?.edges?.length ?? 0, "matches");
    for (const e of r.json?.data?.people?.edges || []) console.log("  ", fmt(e.node));
    if (r.json?.errors) console.log("  errors:", JSON.stringify(r.json.errors));
  }

  // 4. Name eq lookup (what our handler does)
  const q4 = `query($f: String!, $l: String!) { people(first: 5, filter: { name: { firstName: { eq: $f }, lastName: { eq: $l } } }) { edges { node { id name { firstName lastName } emails { primaryEmail additionalEmails } } } } }`;
  const r4 = await gql(q4, { f: firstName, l: lastName });
  console.log(`\nName eq "${firstName}" + "${lastName}":`, r4.json?.data?.people?.edges?.length ?? 0, "matches");
  for (const e of r4.json?.data?.people?.edges || []) console.log("  ", fmt(e.node));
  if (r4.json?.errors) console.log("  errors:", JSON.stringify(r4.json.errors));

  // 5. Name ilike lookup (case-insensitive)
  const q5 = `query($f: String!, $l: String!) { people(first: 5, filter: { name: { firstName: { ilike: $f }, lastName: { ilike: $l } } }) { edges { node { id name { firstName lastName } emails { primaryEmail additionalEmails } } } } }`;
  const r5 = await gql(q5, { f: firstName, l: lastName });
  console.log(`\nName ilike "${firstName}" + "${lastName}":`, r5.json?.data?.people?.edges?.length ?? 0, "matches");
  for (const e of r5.json?.data?.people?.edges || []) console.log("  ", fmt(e.node));
  if (r5.json?.errors) console.log("  errors:", JSON.stringify(r5.json.errors));

  // 6. firstName ilike wildcard (fuzzy)
  const q6 = `query($f: String!) { people(first: 10, filter: { name: { firstName: { ilike: $f } } }) { edges { node { id name { firstName lastName } emails { primaryEmail additionalEmails } } } } }`;
  const r6 = await gql(q6, { f: `%${firstName}%` });
  console.log(`\nfirstName ilike "%${firstName}%":`, r6.json?.data?.people?.edges?.length ?? 0, "matches");
  for (const e of r6.json?.data?.people?.edges || []) console.log("  ", fmt(e.node));
  if (r6.json?.errors) console.log("  errors:", JSON.stringify(r6.json.errors));

  // 7. lastName ilike wildcard (fuzzy)
  const q7 = `query($l: String!) { people(first: 10, filter: { name: { lastName: { ilike: $l } } }) { edges { node { id name { firstName lastName } emails { primaryEmail additionalEmails } } } } }`;
  const r7 = await gql(q7, { l: `%${lastName}%` });
  console.log(`\nlastName ilike "%${lastName}%":`, r7.json?.data?.people?.edges?.length ?? 0, "matches");
  for (const e of r7.json?.data?.people?.edges || []) console.log("  ", fmt(e.node));
  if (r7.json?.errors) console.log("  errors:", JSON.stringify(r7.json.errors));

}

run().catch(e => { console.error(e); process.exit(1); });
