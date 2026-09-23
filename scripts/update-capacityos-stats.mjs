import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const websiteRoot = path.resolve(scriptDirectory, "..");
const inferredCapacityRoot = path.resolve(websiteRoot, "..", "..", "..");
const capacityRoot = path.resolve(process.env.CAPACITYOS_ROOT || inferredCapacityRoot);
const outputPath = path.join(websiteRoot, "assets", "thinking", "capacityos-metrics.js");
const zenodoOwnerId = "1737496";
const researchRepositorySlugs = [
  "time-as-finality",
  "temporal-issuance",
  "gu-formalization",
  "dynamic-unity",
  "possibility-to-capability",
  "continuity-ledger"
];
const shouldFetch = process.argv.includes("--fetch");
const checkOnly = process.argv.includes("--check");
const now = process.env.CAPACITYOS_METRICS_NOW
  ? new Date(process.env.CAPACITYOS_METRICS_NOW)
  : new Date();

if (Number.isNaN(now.getTime())) {
  throw new Error("CAPACITYOS_METRICS_NOW must be a valid date-time.");
}

function git(repositoryPath, args, options = {}) {
  return execFileSync("git", ["-C", repositoryPath, ...args], {
    encoding: "utf8",
    timeout: 30000,
    stdio: ["ignore", "pipe", "pipe"],
    maxBuffer: 64 * 1024 * 1024,
    ...options
  }).trim();
}

function isGitRepository(repositoryPath) {
  return fs.existsSync(path.join(repositoryPath, ".git"));
}

function discoverRepositories() {
  if (!isGitRepository(capacityRoot)) {
    throw new Error(`CapacityOS root is not a Git repository: ${capacityRoot}`);
  }

  const repositories = [capacityRoot];
  ["private", "public"].forEach((visibility) => {
    const namespace = path.join(capacityRoot, "repos", visibility);
    if (!fs.existsSync(namespace)) return;
    fs.readdirSync(namespace, { withFileTypes: true })
      .filter((entry) => entry.isDirectory())
      .map((entry) => path.join(namespace, entry.name))
      .filter(isGitRepository)
      .forEach((repositoryPath) => repositories.push(repositoryPath));
  });

  return repositories.sort((left, right) => left.localeCompare(right));
}

function relativeRepositoryPath(repositoryPath) {
  const relative = path.relative(capacityRoot, repositoryPath);
  return relative || ".";
}

function trackedFiles(repositoryPath, reference) {
  const output = execFileSync("git", ["-C", repositoryPath, "ls-tree", "-r", "--name-only", "-z", reference], {
    encoding: "utf8",
    maxBuffer: 64 * 1024 * 1024
  });
  return output.split("\0").filter(Boolean);
}

function isRunRecord(filePath) {
  const basename = path.posix.basename(filePath).toLowerCase();
  return /\.(md|json|ya?ml)$/.test(basename)
    && !/(readme|index|template|schema)/.test(basename);
}

function countTrackedRunRecords(repositoryPath, files) {
  const runKeys = new Set();

  files.forEach((filePath) => {
    if (!isRunRecord(filePath)) return;
    const segments = filePath.split("/");
    const agentRunsIndex = segments.indexOf("agent-runs");
    const stewardRunsIndex = segments.findIndex((segment, index) => {
      return segment === "steward" && segments[index + 1] === "runs";
    });

    if (agentRunsIndex >= 0 || stewardRunsIndex >= 0 || segments[0] === "runs") {
      runKeys.add(filePath);
      return;
    }

    if (
      relativeRepositoryPath(repositoryPath) === "repos/private/system-runtime"
      && segments[0] === "meta"
      && segments[1] === "runs"
      && segments[2]
      && segments[2] !== "imported-repo-steward-history"
    ) {
      runKeys.add(segments.length > 3 ? `meta/runs/${segments[2]}` : filePath);
    }
  });

  return runKeys.size;
}

function countThinkingWikiGraphLinks(repositoryPath, reference, files) {
  const graphEdges = new Set();
  const wikiLinkPattern = /!?\[\[([^\]]+)\]\]/g;

  files
    .filter((filePath) => filePath.endsWith(".md"))
    .forEach((filePath) => {
      const source = filePath.replace(/\.md$/i, "").toLowerCase();
      const content = git(repositoryPath, ["show", `${reference}:${filePath}`]);

      for (const match of content.matchAll(wikiLinkPattern)) {
        const target = match[1]
          .split("|")[0]
          .split("#")[0]
          .trim()
          .toLowerCase();
        if (target) graphEdges.add(`${source}->${target}`);
      }
    });

  return graphEdges.size;
}

function chicagoDate(date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "America/Chicago",
    year: "numeric",
    month: "2-digit",
    day: "2-digit"
  }).formatToParts(date);
  const values = Object.fromEntries(parts.map((part) => [part.type, part.value]));
  return `${values.year}-${values.month}-${values.day}`;
}

function existingGeneratedMetrics() {
  if (!fs.existsSync(outputPath)) return {};
  const source = fs.readFileSync(outputPath, "utf8");
  const match = source.match(/Object\.freeze\(([\s\S]*?)\);\s*}\)\(\);\s*$/);
  if (!match) return {};
  try {
    return JSON.parse(match[1]);
  } catch {
    return {};
  }
}

async function fetchPublishedResearchCount() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(
      `https://zenodo.org/api/records?q=owners:${zenodoOwnerId}&size=1`,
      { signal: controller.signal, headers: {
        Accept: "application/json",
        "User-Agent": "disruptionjoe-website-metrics/1.0 (https://disruptionjoe.com)"
      } }
    );
    if (!response.ok) {
      throw new Error(`Zenodo returned ${response.status}.`);
    }
    const data = await response.json();
    const count = data?.hits?.total;
    if (!Number.isSafeInteger(count) || count < 0) {
      throw new Error("Zenodo did not return a publication count.");
    }
    return count;
  } finally {
    clearTimeout(timeout);
  }
}

function githubPageCount(response, records) {
  const link = response.headers.get("link") || "";
  const last = link.match(/[?&]page=(\d+)[^>]*>; rel="last"/);
  const count = last ? Number(last[1]) : records.length;
  if (!Number.isSafeInteger(count) || count < 0) throw new Error("Invalid GitHub count.");
  return count;
}

async function fetchGithubRepositoryMetrics(owner, repository, since) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  const headers = {
    Accept: "application/vnd.github+json",
    "User-Agent": "disruptionjoe-website-metrics"
  };
  const base = `https://api.github.com/repos/${owner}/${repository}/commits?sha=main&per_page=1`;

  try {
    const [allResponse, recentResponse] = await Promise.all([
      fetch(base, { headers, signal: controller.signal }),
      fetch(`${base}&since=${encodeURIComponent(since.toISOString())}`, {
        headers,
        signal: controller.signal
      })
    ]);
    if (!allResponse.ok || !recentResponse.ok) {
      throw new Error(
        `GitHub returned ${allResponse.status} / ${recentResponse.status} for ${owner}/${repository}.`
      );
    }

    const [allRecords, recentRecords] = await Promise.all([
      allResponse.json(),
      recentResponse.json()
    ]);
    if (!Array.isArray(allRecords) || !Array.isArray(recentRecords)) throw new Error("Invalid GitHub response.");
    const latest = allRecords[0]?.commit?.committer?.date || allRecords[0]?.commit?.author?.date;
    if (!latest || Number.isNaN(Date.parse(latest))) {
      throw new Error(`GitHub did not return a latest revision for ${owner}/${repository}.`);
    }

    return {
      publicRevisions: githubPageCount(allResponse, allRecords),
      revisionsLastThirtyDays: githubPageCount(recentResponse, recentRecords),
      latestPublicUpdate: latest.slice(0, 10)
    };
  } finally {
    clearTimeout(timeout);
  }
}


// Every source group succeeds independently. A failed group retains both its
// last-known value and its evidence date, never the date of this attempt.
export async function refreshGroup({ previous, previousDate, refresh, today, fetchFresh, load, warn }) {
  if (!refresh) return { value: previous, asOf: previousDate, status: "retained" };
  try {
    const value = await load();
    return { value, asOf: fetchFresh ? today : previousDate, status: fetchFresh ? "current" : "retained" };
  } catch (error) {
    warn(error.message);
    if (previous === undefined || previous === null) throw new Error("No last-known value is available.");
    return { value: previous, asOf: previousDate, status: "retained" };
  }
}

export function validateMetrics(metrics) {
  const count = (value) => Number.isSafeInteger(value) && value >= 0;
  const fields = ["managedRepositories", "synchronizedRepositories", "trackedFiles",
    "commitsLastSevenDays", "trackedAgentRuns", "thinkingWikiGraphLinks", "publishedResearchRecords"];
  fields.forEach((key) => { if (!count(metrics[key])) throw new Error("Invalid count: " + key); });
  if (metrics.synchronizedRepositories > metrics.managedRepositories) throw new Error("Invalid synchronized repository count.");
  researchRepositorySlugs.forEach((slug) => {
    const row = metrics.researchProjects?.[slug];
    if (!count(row?.githubCommits) || !/^\d{4}-\d{2}-\d{2}$/.test(row?.latestPublicUpdate || "")) throw new Error("Invalid research metrics: " + slug);
  });
  ["caret", "purity-protocol"].forEach((slug) => {
    const row = metrics.developmentProjects?.[slug];
    if (!count(row?.publicRevisions) || !count(row?.revisionsLastThirtyDays)
      || row.revisionsLastThirtyDays > row.publicRevisions
      || !/^\d{4}-\d{2}-\d{2}$/.test(row?.latestPublicUpdate || "")) throw new Error("Invalid development metrics: " + slug);
  });
  ["capacityos", "zenodo", "caret", "purity-protocol", ...researchRepositorySlugs].forEach((key) => {
    const row = metrics.freshness?.[key];
    if (!row || !["current", "retained"].includes(row.status)
      || (row.asOf !== null && !/^\d{4}-\d{2}-\d{2}$/.test(row.asOf))) throw new Error("Invalid freshness: " + key);
  });
  if (metrics.asOf !== metrics.freshness.capacityos.asOf) throw new Error("Invalid aggregate date.");
  return metrics;
}

export { countTrackedRunRecords, githubPageCount, chicagoDate, fetchPublishedResearchCount, fetchGithubRepositoryMetrics };

async function main() {
  const existing = existingGeneratedMetrics();
  if (checkOnly) {
    // Validate the saved snapshot, not a second clock/fetch-dependent snapshot.
    validateMetrics(existing);
    process.stdout.write("All saved website metric groups are valid.\n");
    return;
  }
  const today = chicagoDate(now);
  const thirtyDaysAgo = new Date(now.getTime() - 30 * 86400000);
  const sevenDaysAgo = new Date(now.getTime() - 7 * 86400000);
  const repositories = discoverRepositories();
  const fetchErrors = new Map();
  if (shouldFetch) {
    for (const repositoryPath of repositories) {
      try { git(repositoryPath, ["fetch", "--quiet", "--prune", "origin"]); }
      catch (error) { fetchErrors.set(repositoryPath, error); }
    }
  }
  const freshness = {};
  async function group(key, previous, load, refresh = true) {
    const result = await refreshGroup({
      previous, previousDate: existing.freshness?.[key]?.asOf ?? existing.asOf ?? null,
      refresh, today, fetchFresh: shouldFetch, load,
      warn: (message) => process.stderr.write(key + ": retaining last-known values (" + message + ")\n")
    });
    freshness[key] = { asOf: result.asOf, status: result.status };
    return result.value;
  }
  const capacityKeys = ["managedRepositories", "synchronizedRepositories", "trackedFiles",
    "commitsLastSevenDays", "trackedAgentRuns", "thinkingWikiGraphLinks"];
  const previousCapacity = Object.fromEntries(capacityKeys.map((key) => [key, existing[key]]));
  const capacity = await group("capacityos", previousCapacity, () => {
    if (fetchErrors.size) throw new Error("one or more repository fetches failed");
    let synchronizedRepositories = 0, trackedFileCount = 0, commitsLastSevenDays = 0, trackedAgentRuns = 0;
    let thinkingWikiFiles, thinkingWikiReference;
    for (const repositoryPath of repositories) {
      const upstream = git(repositoryPath, ["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"]);
      const divergence = git(repositoryPath, ["rev-list", "--left-right", "--count", "HEAD..." + upstream]).split(/\s+/).map(Number);
      if (divergence[0] === 0 && divergence[1] === 0) synchronizedRepositories++;
      const files = trackedFiles(repositoryPath, upstream);
      trackedFileCount += files.length;
      trackedAgentRuns += countTrackedRunRecords(repositoryPath, files);
      commitsLastSevenDays += git(repositoryPath, ["log", "--since=" + sevenDaysAgo.toISOString(), "--format=%s", upstream])
        .split("\n").filter((subject) => subject && !subject.startsWith("Update CapacityOS website activity metrics")).length;
      if (relativeRepositoryPath(repositoryPath) === "repos/private/joe-thinking-wiki") {
        thinkingWikiFiles = files; thinkingWikiReference = upstream;
      }
    }
    if (!thinkingWikiFiles) throw new Error("Thinking Wiki is required.");
    return {
      managedRepositories: repositories.length, synchronizedRepositories,
      trackedFiles: trackedFileCount, commitsLastSevenDays, trackedAgentRuns,
      thinkingWikiGraphLinks: countThinkingWikiGraphLinks(path.join(capacityRoot, "repos/private/joe-thinking-wiki"), thinkingWikiReference, thinkingWikiFiles)
    };
  });
  function localPublicMetrics(slug, development = false) {
    const repositoryPath = path.join(capacityRoot, "repos/public", slug);
    if (fetchErrors.has(repositoryPath)) throw new Error("repository fetch failed");
    if (!isGitRepository(repositoryPath)) throw new Error("public source is unavailable");
    const reference = "refs/remotes/origin/main";
    const total = Number(git(repositoryPath, ["rev-list", "--count", reference]));
    const latestPublicUpdate = git(repositoryPath, ["log", "-1", "--format=%cs", reference]);
    return development ? {
      publicRevisions: total,
      revisionsLastThirtyDays: Number(git(repositoryPath, ["rev-list", "--count", "--since=" + thirtyDaysAgo.toISOString(), reference])),
      latestPublicUpdate
    } : { githubCommits: total, latestPublicUpdate };
  }
  const researchProjects = {};
  for (const slug of researchRepositorySlugs) {
    researchProjects[slug] = await group(slug, existing.researchProjects?.[slug], () => localPublicMetrics(slug));
  }
  const developmentProjects = {
    caret: await group("caret", existing.developmentProjects?.caret,
      () => fetchGithubRepositoryMetrics("disruptionjoe", "caret", thirtyDaysAgo), shouldFetch),
    "purity-protocol": await group("purity-protocol", existing.developmentProjects?.["purity-protocol"],
      () => localPublicMetrics("purity-protocol", true))
  };
  const publishedResearchRecords = await group("zenodo", existing.publishedResearchRecords,
    fetchPublishedResearchCount, shouldFetch);
  const metrics = validateMetrics({
    asOf: freshness.capacityos.asOf, ...capacity, publishedResearchRecords,
    researchProjects, developmentProjects, freshness
  });
  const generated = "(function () {\n  \"use strict\";\n\n  window.DJC_CAPACITYOS_METRICS = Object.freeze("
    + JSON.stringify(metrics, null, 2) + ");\n})();\n";
  if (!fs.existsSync(outputPath) || fs.readFileSync(outputPath, "utf8") !== generated) fs.writeFileSync(outputPath, generated);
  process.stdout.write(JSON.stringify(metrics) + "\n");
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  await main();
}
