import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { AnalyticsAdminServiceClient } from "@google-analytics/admin";
import { BetaAnalyticsDataClient } from "@google-analytics/data";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "..");
const numberFormatter = new Intl.NumberFormat("en-US");

loadEnvIfPresent(path.join(repoRoot, ".env.local"));
loadEnvIfPresent(path.join(repoRoot, ".env"));

const HELP_TEXT = `
GA4 CLI

Usage:
  npm run analytics -- <command> [options]

Commands:
  properties          List accessible GA4 accounts and properties
  realtime            Show active users in realtime
  overview            Show high-level GA4 totals for a date range
  pages               Show top pages by page views
  events              Show top events by event count
  sources             Show top traffic sources
  form-submissions    Show form_submission counts by day
  help                Show this help

Options:
  --days <n>          Date range length, including today (default: 7)
  --limit <n>         Row limit for table reports (default: 10)
  --property <id>     Override GA4_PROPERTY_ID for this run
  --json              Output raw JSON-friendly data

Examples:
  npm run analytics -- properties
  npm run analytics -- realtime
  npm run analytics -- overview --days 7
  npm run analytics -- pages --days 28 --limit 15
  npm run analytics -- events --days 28
  npm run analytics -- sources --days 28
  npm run analytics -- form-submissions --days 28
`;

const commandHandlers = {
  properties: handleProperties,
  realtime: handleRealtime,
  overview: handleOverview,
  pages: handlePages,
  events: handleEvents,
  sources: handleSources,
  "form-submissions": handleFormSubmissions,
  help: handleHelp,
};

await main();

async function main() {
  const { command, options } = parseArgs(process.argv.slice(2));

  if (!commandHandlers[command]) {
    exitWithError(`Unknown command: ${command}\n${HELP_TEXT.trim()}`);
  }

  if (command === "help") {
    handleHelp();
    return;
  }

  if (!hasConfiguredCredentials()) {
    exitWithError(
      "Missing Google Analytics credentials. Set GOOGLE_APPLICATION_CREDENTIALS in .env.local or provide GA4_CLIENT_EMAIL and GA4_PRIVATE_KEY."
    );
  }

  const clients = buildClients();

  try {
    if (command === "properties") {
      await commandHandlers[command](clients, options);
      return;
    }

    const propertyId = options.property || process.env.GA4_PROPERTY_ID;
    if (!propertyId) {
      exitWithError(
        "Missing GA4 property id. Set GA4_PROPERTY_ID in .env.local, use npm run analytics -- properties, or pass --property <id>."
      );
    }

    await commandHandlers[command](clients.dataClient, propertyId, options);
  } catch (error) {
    const message = error?.message || String(error);
    exitWithError(`GA4 CLI failed: ${message}`);
  }
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

function buildClients() {
  const clientOptions = buildClientOptions();

  return {
    adminClient: new AnalyticsAdminServiceClient(clientOptions),
    dataClient: new BetaAnalyticsDataClient(clientOptions),
  };
}

function buildClientOptions() {
  if (process.env.GA4_SERVICE_ACCOUNT_JSON) {
    try {
      const parsed = JSON.parse(process.env.GA4_SERVICE_ACCOUNT_JSON);
      return {
        credentials: normalizeCredentials(parsed),
      };
    } catch (error) {
      exitWithError(`GA4_SERVICE_ACCOUNT_JSON is not valid JSON: ${error.message}`);
    }
  }

  if (process.env.GA4_CLIENT_EMAIL && process.env.GA4_PRIVATE_KEY) {
    return {
      credentials: normalizeCredentials({
        client_email: process.env.GA4_CLIENT_EMAIL,
        private_key: process.env.GA4_PRIVATE_KEY,
      }),
    };
  }

  return {};
}

function normalizeCredentials(credentials) {
  return {
    client_email: credentials.client_email,
    private_key: String(credentials.private_key || "").replace(/\\n/g, "\n"),
  };
}

function hasConfiguredCredentials() {
  return Boolean(
    process.env.GA4_SERVICE_ACCOUNT_JSON ||
      process.env.GA4_CLIENT_EMAIL ||
      process.env.GA4_PRIVATE_KEY ||
      process.env.GOOGLE_APPLICATION_CREDENTIALS
  );
}

function parseArgs(argv) {
  const options = {
    days: 7,
    limit: 10,
    json: false,
    property: "",
  };
  const positionals = [];

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];

    if (token === "--help" || token === "-h") {
      positionals.push("help");
      continue;
    }

    if (token === "--json") {
      options.json = true;
      continue;
    }

    if (token === "--days") {
      options.days = parsePositiveInt(argv[index + 1], "days");
      index += 1;
      continue;
    }

    if (token.startsWith("--days=")) {
      options.days = parsePositiveInt(token.split("=")[1], "days");
      continue;
    }

    if (token === "--limit") {
      options.limit = parsePositiveInt(argv[index + 1], "limit");
      index += 1;
      continue;
    }

    if (token.startsWith("--limit=")) {
      options.limit = parsePositiveInt(token.split("=")[1], "limit");
      continue;
    }

    if (token === "--property") {
      options.property = String(argv[index + 1] || "").trim();
      index += 1;
      continue;
    }

    if (token.startsWith("--property=")) {
      options.property = token.split("=")[1].trim();
      continue;
    }

    positionals.push(token);
  }

  return {
    command: positionals[0] || "help",
    options,
  };
}

function parsePositiveInt(value, optionName) {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isFinite(parsed) || parsed < 1) {
    exitWithError(`--${optionName} must be a positive integer.`);
  }
  return parsed;
}

function propertyPath(propertyId) {
  return `properties/${propertyId}`;
}

function dateRange(days) {
  if (days === 1) {
    return { startDate: "today", endDate: "today" };
  }

  return {
    startDate: `${days - 1}daysAgo`,
    endDate: "today",
  };
}

async function handleHelp() {
  console.log(HELP_TEXT.trim());
}

async function handleProperties(clients, options) {
  const [accountSummaries] = await clients.adminClient.listAccountSummaries();

  const rows = [];

  for (const accountSummary of accountSummaries) {
    const properties = accountSummary.propertySummaries || [];

    if (properties.length === 0) {
      rows.push({
        account: accountSummary.displayName || accountSummary.account || "(unknown account)",
        property: "(none)",
        propertyId: "",
        propertyType: "",
      });
      continue;
    }

    for (const property of properties) {
      rows.push({
        account: accountSummary.displayName || accountSummary.account || "(unknown account)",
        property: property.displayName || property.property || "(unnamed property)",
        propertyId: extractPropertyId(property.property),
        propertyType: property.propertyType || "",
      });
    }
  }

  const limitedRows = rows.slice(0, options.limit);

  if (options.json) {
    console.log(JSON.stringify({ rows: limitedRows }, null, 2));
    return;
  }

  printTable("Accessible GA4 properties", limitedRows, [
    { key: "account", label: "Account" },
    { key: "property", label: "Property" },
    { key: "propertyId", label: "Property ID" },
    { key: "propertyType", label: "Type" },
  ]);
}

async function handleRealtime(client, propertyId, options) {
  const [summaryResponse] = await client.runRealtimeReport({
    property: propertyPath(propertyId),
    metrics: [{ name: "activeUsers" }],
  });

  const [countryResponse] = await client.runRealtimeReport({
    property: propertyPath(propertyId),
    dimensions: [{ name: "country" }],
    metrics: [{ name: "activeUsers" }],
    orderBys: [{ metric: { metricName: "activeUsers" }, desc: true }],
    limit: options.limit,
  });

  const activeUsers = metricValue(summaryResponse, "activeUsers");
  const countries = rowsToObjects(countryResponse, ["country", "activeUsers"]);

  if (options.json) {
    console.log(
      JSON.stringify(
        {
          propertyId,
          activeUsers,
          countries,
        },
        null,
        2
      )
    );
    return;
  }

  console.log(`Realtime active users: ${formatNumber(activeUsers)}`);

  if (countries.length > 0) {
    printTable("Top realtime countries", countries, [
      { key: "country", label: "Country" },
      { key: "activeUsers", label: "Active Users" },
    ]);
  }
}

async function handleOverview(client, propertyId, options) {
  const range = dateRange(options.days);

  const [summaryResponse] = await client.runReport({
    property: propertyPath(propertyId),
    dateRanges: [range],
    metrics: [
      { name: "totalUsers" },
      { name: "sessions" },
      { name: "screenPageViews" },
      { name: "eventCount" },
    ],
  });

  const [formResponse] = await client.runReport({
    property: propertyPath(propertyId),
    dateRanges: [range],
    dimensions: [{ name: "eventName" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: {
      filter: {
        fieldName: "eventName",
        stringFilter: {
          matchType: "EXACT",
          value: "form_submission",
        },
      },
    },
  });

  const data = {
    propertyId,
    days: options.days,
    totalUsers: metricValue(summaryResponse, "totalUsers"),
    sessions: metricValue(summaryResponse, "sessions"),
    screenPageViews: metricValue(summaryResponse, "screenPageViews"),
    eventCount: metricValue(summaryResponse, "eventCount"),
    formSubmissions: metricValue(formResponse, "eventCount"),
  };

  if (options.json) {
    console.log(JSON.stringify(data, null, 2));
    return;
  }

  console.log(`GA4 overview for the last ${options.days} day(s)`);
  console.log(`Property: ${propertyId}`);
  console.log(`- Users: ${formatNumber(data.totalUsers)}`);
  console.log(`- Sessions: ${formatNumber(data.sessions)}`);
  console.log(`- Page views: ${formatNumber(data.screenPageViews)}`);
  console.log(`- Events: ${formatNumber(data.eventCount)}`);
  console.log(`- Form submissions: ${formatNumber(data.formSubmissions)}`);
}

async function handlePages(client, propertyId, options) {
  const [response] = await client.runReport({
    property: propertyPath(propertyId),
    dateRanges: [dateRange(options.days)],
    dimensions: [{ name: "pagePath" }],
    metrics: [{ name: "screenPageViews" }, { name: "totalUsers" }],
    orderBys: [{ metric: { metricName: "screenPageViews" }, desc: true }],
    limit: options.limit,
  });

  const rows = rowsToObjects(response, ["pagePath", "screenPageViews", "totalUsers"]);

  if (options.json) {
    console.log(JSON.stringify({ propertyId, days: options.days, rows }, null, 2));
    return;
  }

  printTable(`Top pages for the last ${options.days} day(s)`, rows, [
    { key: "pagePath", label: "Page" },
    { key: "screenPageViews", label: "Page Views" },
    { key: "totalUsers", label: "Users" },
  ]);
}

async function handleEvents(client, propertyId, options) {
  const [response] = await client.runReport({
    property: propertyPath(propertyId),
    dateRanges: [dateRange(options.days)],
    dimensions: [{ name: "eventName" }],
    metrics: [{ name: "eventCount" }],
    orderBys: [{ metric: { metricName: "eventCount" }, desc: true }],
    limit: options.limit,
  });

  const rows = rowsToObjects(response, ["eventName", "eventCount"]);

  if (options.json) {
    console.log(JSON.stringify({ propertyId, days: options.days, rows }, null, 2));
    return;
  }

  printTable(`Top events for the last ${options.days} day(s)`, rows, [
    { key: "eventName", label: "Event" },
    { key: "eventCount", label: "Count" },
  ]);
}

async function handleSources(client, propertyId, options) {
  const [response] = await client.runReport({
    property: propertyPath(propertyId),
    dateRanges: [dateRange(options.days)],
    dimensions: [{ name: "sessionSourceMedium" }],
    metrics: [{ name: "sessions" }, { name: "totalUsers" }],
    orderBys: [{ metric: { metricName: "sessions" }, desc: true }],
    limit: options.limit,
  });

  const rows = rowsToObjects(response, ["sessionSourceMedium", "sessions", "totalUsers"]);

  if (options.json) {
    console.log(JSON.stringify({ propertyId, days: options.days, rows }, null, 2));
    return;
  }

  printTable(`Top sources for the last ${options.days} day(s)`, rows, [
    { key: "sessionSourceMedium", label: "Source / Medium" },
    { key: "sessions", label: "Sessions" },
    { key: "totalUsers", label: "Users" },
  ]);
}

async function handleFormSubmissions(client, propertyId, options) {
  const [response] = await client.runReport({
    property: propertyPath(propertyId),
    dateRanges: [dateRange(options.days)],
    dimensions: [{ name: "date" }],
    metrics: [{ name: "eventCount" }],
    dimensionFilter: {
      filter: {
        fieldName: "eventName",
        stringFilter: {
          matchType: "EXACT",
          value: "form_submission",
        },
      },
    },
    orderBys: [{ dimension: { dimensionName: "date" } }],
    limit: options.limit,
  });

  const rows = rowsToObjects(response, ["date", "eventCount"]).map((row) => ({
    ...row,
    date: formatCompactDate(row.date),
  }));

  if (options.json) {
    console.log(JSON.stringify({ propertyId, days: options.days, rows }, null, 2));
    return;
  }

  printTable(`Form submissions for the last ${options.days} day(s)`, rows, [
    { key: "date", label: "Date" },
    { key: "eventCount", label: "Submissions" },
  ]);
}

function metricValue(response, metricName) {
  const metricNames = (response.metricHeaders || []).map((header) => header.name);
  const row = response.rows?.[0];

  if (!row) {
    return 0;
  }

  const index = metricNames.indexOf(metricName);
  if (index === -1) {
    return 0;
  }

  return normalizeMetric(row.metricValues?.[index]?.value ?? "0");
}

function rowsToObjects(response, keys) {
  return (response.rows || []).map((row) => {
    const values = [
      ...(row.dimensionValues || []).map((value) => value.value),
      ...(row.metricValues || []).map((value) => normalizeMetric(value.value)),
    ];

    return keys.reduce((accumulator, key, index) => {
      accumulator[key] = values[index] ?? "";
      return accumulator;
    }, {});
  });
}

function normalizeMetric(value) {
  const numericValue = Number(value);
  if (Number.isFinite(numericValue)) {
    return numericValue;
  }
  return value;
}

function printTable(title, rows, columns) {
  console.log(title);

  if (rows.length === 0) {
    console.log("(no rows)");
    return;
  }

  const widths = columns.map((column) =>
    Math.max(
      column.label.length,
      ...rows.map((row) => String(formatCell(row[column.key])).length)
    )
  );

  const header = columns
    .map((column, index) => padCell(column.label, widths[index], false))
    .join("  ");
  const separator = widths.map((width) => "-".repeat(width)).join("  ");

  console.log(header);
  console.log(separator);

  for (const row of rows) {
    const line = columns
      .map((column, index) => {
        const value = row[column.key];
        return padCell(formatCell(value), widths[index], isNumeric(value));
      })
      .join("  ");

    console.log(line);
  }
}

function formatCell(value) {
  if (typeof value === "number") {
    return formatNumber(value);
  }
  return String(value);
}

function formatNumber(value) {
  return numberFormatter.format(value);
}

function isNumeric(value) {
  return typeof value === "number";
}

function padCell(value, width, alignRight) {
  return alignRight ? String(value).padStart(width) : String(value).padEnd(width);
}

function formatCompactDate(value) {
  if (!/^\d{8}$/.test(String(value))) {
    return value;
  }

  const year = value.slice(0, 4);
  const month = value.slice(4, 6);
  const day = value.slice(6, 8);
  return `${year}-${month}-${day}`;
}

function extractPropertyId(propertyName) {
  const match = String(propertyName || "").match(/^properties\/(.+)$/);
  return match ? match[1] : propertyName;
}

function exitWithError(message) {
  console.error(message);
  process.exit(1);
}
