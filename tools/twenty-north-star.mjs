import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");

loadEnvIfPresent(path.join(repoRoot, ".env.local"));
loadEnvIfPresent(path.join(repoRoot, ".env"));

const DEFAULT_TWENTY_API_URL = "https://api.twenty.com";
const DAY_IN_MS = 24 * 60 * 60 * 1000;
const NORTH_STAR_WINDOW_DAYS = 28;
const ACTIVE_CLIENT_WINDOW_DAYS = 365;
const COMMERCIAL_GROWTH_ORIGINS = new Set([
  "DIRECT",
  "CLIENT_REFERRAL",
  "REPEAT",
  "EXPANSION",
]);

const HELP_TEXT = `
Twenty North Star CLI

Usage:
  node tools/twenty-north-star.mjs [--json]

Reads the DJ North Star metrics from Twenty CRM using TWENTY_API_KEY and the
default or configured TWENTY_API_URL.
`;

await main();

async function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.help) {
    console.log(HELP_TEXT.trim());
    return;
  }

  const apiKey = String(process.env.TWENTY_API_KEY || "").trim();
  if (!apiKey) {
    exitWithError("Missing TWENTY_API_KEY.");
  }

  const apiUrl = normalizeApiUrl(process.env.TWENTY_API_URL);
  const now = new Date();
  const cutoff28 = new Date(now.getTime() - (NORTH_STAR_WINDOW_DAYS - 1) * DAY_IN_MS);
  const cutoff365 = new Date(now.getTime() - (ACTIVE_CLIENT_WINDOW_DAYS - 1) * DAY_IN_MS);

  const opportunities = await fetchRelevantOpportunities({
    apiUrl,
    apiKey,
    cutoff28,
    cutoff365,
  });

  const summary = summarizeNorthStar({
    opportunities,
    cutoff28,
    cutoff365,
    asOf: now,
  });

  if (options.json) {
    console.log(JSON.stringify(summary, null, 2));
    return;
  }

  printSummary(summary);
}

function loadEnvIfPresent(filePath) {
  if (typeof process.loadEnvFile !== "function") {
    return;
  }

  try {
    process.loadEnvFile(filePath);
  } catch (error) {
    if (error?.code !== "ENOENT") {
      throw error;
    }
  }
}

function parseArgs(argv) {
  return {
    help: argv.includes("--help") || argv.includes("-h"),
    json: argv.includes("--json"),
  };
}

function normalizeApiUrl(value) {
  const apiUrl = String(value || DEFAULT_TWENTY_API_URL).trim();
  return apiUrl.replace(/\/rest$/, "").replace(/\/+$/, "");
}

function buildGraphqlUrl(apiUrl) {
  return `${apiUrl}/graphql`;
}

async function fetchRelevantOpportunities({ apiUrl, apiKey, cutoff28, cutoff365 }) {
  const query = `
    query NorthStarOpportunities($first: Int!, $after: String, $filter: OpportunityFilterInput) {
      opportunities(first: $first, after: $after, filter: $filter) {
        edges {
          cursor
          node {
            id
            name
            stage
            opportunityOpenedAt
            lostAt
            clientStartedAt
            growthOrigin
            engagementMode
            pointOfContact {
              id
            }
          }
        }
        pageInfo {
          hasNextPage
          endCursor
        }
      }
    }
  `;

  const filter = {
    or: [
      { opportunityOpenedAt: { gte: cutoff28.toISOString() } },
      { lostAt: { gte: cutoff28.toISOString() } },
      { clientStartedAt: { gte: cutoff365.toISOString() } },
    ],
  };

  const all = [];
  let after = null;

  while (true) {
    const payload = await postGraphql({
      apiUrl,
      apiKey,
      query,
      variables: {
        first: 100,
        after,
        filter,
      },
    });

    const connection = payload?.data?.opportunities;
    const edges = Array.isArray(connection?.edges) ? connection.edges : [];

    for (const edge of edges) {
      if (edge?.node) {
        all.push(edge.node);
      }
    }

    if (!connection?.pageInfo?.hasNextPage) {
      break;
    }

    after = connection.pageInfo.endCursor;
    if (!after) {
      break;
    }
  }

  return all;
}

async function postGraphql({ apiUrl, apiKey, query, variables }) {
  const response = await fetch(buildGraphqlUrl(apiUrl), {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const raw = await response.text();
  let json = null;

  try {
    json = raw ? JSON.parse(raw) : null;
  } catch {
    json = null;
  }

  if (!response.ok || json?.errors?.length) {
    const errorText =
      json?.errors?.map((entry) => entry.message).join("; ") ||
      raw ||
      `HTTP ${response.status}`;
    exitWithError(`Twenty GraphQL request failed: ${errorText}`);
  }

  return json;
}

function summarizeNorthStar({ opportunities, cutoff28, cutoff365, asOf }) {
  const commercialOpportunities = opportunities.filter(isCommercialOpportunity);
  const opened28 = commercialOpportunities.filter((opportunity) =>
    isOnOrAfter(opportunity.opportunityOpenedAt, cutoff28)
  );
  const lost28 = commercialOpportunities.filter((opportunity) =>
    isOnOrAfter(opportunity.lostAt, cutoff28)
  );
  const started28 = commercialOpportunities.filter((opportunity) =>
    isOnOrAfter(opportunity.clientStartedAt, cutoff28)
  );
  const activeClientOpportunities = commercialOpportunities.filter((opportunity) =>
    isOnOrAfter(opportunity.clientStartedAt, cutoff365)
  );

  const breakout = {
    direct: countByGrowthOrigin(opened28, "DIRECT"),
    referral: countByGrowthOrigin(opened28, "CLIENT_REFERRAL"),
    repeat: countByGrowthOrigin(opened28, "REPEAT"),
    expansion: countByGrowthOrigin(opened28, "EXPANSION"),
  };

  const netQualifiedOpportunities = opened28.length - lost28.length;
  const netClients = uniquePointOfContactCount(started28);
  const activeClientBase = uniquePointOfContactCount(activeClientOpportunities);
  const clientGeneratedQualifiedOpportunities =
    breakout.referral + breakout.repeat + breakout.expansion;
  const clientGeneratedGrowthRate =
    activeClientBase > 0
      ? Number((clientGeneratedQualifiedOpportunities / activeClientBase).toFixed(2))
      : null;

  return {
    asOf: asOf.toISOString(),
    windows: {
      northStarDays: NORTH_STAR_WINDOW_DAYS,
      activeClientBaseDays: ACTIVE_CLIENT_WINDOW_DAYS,
      cutoff28: cutoff28.toISOString(),
      cutoff365: cutoff365.toISOString(),
    },
    totals: {
      opportunityRecordsFetched: opportunities.length,
      commercialOpportunityRecordsUsed: commercialOpportunities.length,
      excludedTestRecords: opportunities.length - commercialOpportunities.length,
    },
    metrics: {
      netQualifiedOpportunities,
      opened28: opened28.length,
      lost28: lost28.length,
      loopTypeBreakout: breakout,
      netClients,
      activeClientBase,
      clientGeneratedQualifiedOpportunities,
      clientGeneratedGrowthRate,
    },
  };
}

function isCommercialOpportunity(opportunity) {
  const growthOrigin = String(opportunity?.growthOrigin || "").trim().toUpperCase();
  const engagementMode = String(opportunity?.engagementMode || "").trim().toUpperCase();

  if (growthOrigin === "TEST" || engagementMode === "FF_TEST") {
    return false;
  }

  return COMMERCIAL_GROWTH_ORIGINS.has(growthOrigin);
}

function isOnOrAfter(value, cutoff) {
  if (!value) {
    return false;
  }

  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) {
    return false;
  }

  return parsed >= cutoff;
}

function countByGrowthOrigin(opportunities, growthOrigin) {
  return opportunities.filter(
    (opportunity) =>
      String(opportunity?.growthOrigin || "").trim().toUpperCase() === growthOrigin
  ).length;
}

function uniquePointOfContactCount(opportunities) {
  const uniqueIds = new Set();

  for (const opportunity of opportunities) {
    const pointOfContactId = String(opportunity?.pointOfContact?.id || "").trim();
    if (pointOfContactId) {
      uniqueIds.add(pointOfContactId);
    }
  }

  return uniqueIds.size;
}

function printSummary(summary) {
  const { metrics, totals, windows } = summary;

  console.log(`Twenty North Star as of ${summary.asOf}`);
  console.log("");
  console.log(
    `Window: last ${windows.northStarDays} days for opportunities; trailing ${windows.activeClientBaseDays} days for active client base`
  );
  console.log(
    `Using ${totals.commercialOpportunityRecordsUsed} commercial opportunity records; excluded ${totals.excludedTestRecords} TEST / FF_TEST record(s)`
  );
  console.log("");
  console.log(`Net qualified opportunities: ${metrics.netQualifiedOpportunities}`);
  console.log(
    `Loop-type breakout: direct ${metrics.loopTypeBreakout.direct}, referral ${metrics.loopTypeBreakout.referral}, repeat ${metrics.loopTypeBreakout.repeat}, expansion ${metrics.loopTypeBreakout.expansion}`
  );
  console.log(`Net clients: ${metrics.netClients}`);
  console.log(
    metrics.clientGeneratedGrowthRate === null
      ? `Client-generated growth rate: n/a (active client base = 0)`
      : `Client-generated growth rate: ${metrics.clientGeneratedGrowthRate}`
  );
}

function exitWithError(message) {
  console.error(message);
  process.exit(1);
}
