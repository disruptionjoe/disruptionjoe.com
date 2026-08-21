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

function existingPublishedResearchCount() {
  if (!fs.existsSync(outputPath)) return null;
  const match = fs.readFileSync(outputPath, "utf8")
    .match(/"publishedResearchRecords"\s*:\s*(\d+)/);
  return match ? Number(match[1]) : null;
}

async function fetchPublishedResearchCount() {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 10000);
  try {
    const response = await fetch(
      `https://zenodo.org/api/records?q=owners:${zenodoOwnerId}&size=1`,
      { signal: controller.signal }
    );
    if (!response.ok) {
      throw new Error(`Zenodo returned ${response.status}.`);
    }
    const data = await response.json();
    const count = Number(data?.hits?.total);
    if (!Number.isFinite(count)) {
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
  return last ? Number(last[1]) : records.length;
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
    const latest = allRecords[0]?.commit?.committer?.date || allRecords[0]?.commit?.author?.date;
    if (!latest) {
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

const existingMetrics = existingGeneratedMetrics();
const configuredResearchCount = Number(process.env.DJC_RESEARCH_PUBLICATION_COUNT);
let publishedResearchRecords = Number.isFinite(configuredResearchCount)
  && process.env.DJC_RESEARCH_PUBLICATION_COUNT !== ""
  ? configuredResearchCount
  : existingPublishedResearchCount();

if (shouldFetch) {
  publishedResearchRecords = await fetchPublishedResearchCount();
}

if (!Number.isFinite(publishedResearchRecords)) {
  throw new Error(
    "A research publication count is required. Run with --fetch or set DJC_RESEARCH_PUBLICATION_COUNT."
  );
}

const repositories = discoverRepositories();
const sevenDaysAgo = new Date(now.getTime() - (7 * 24 * 60 * 60 * 1000));
const thirtyDaysAgo = new Date(now.getTime() - (30 * 24 * 60 * 60 * 1000));
let synchronizedRepositories = 0;
let trackedFileCount = 0;
let commitsLastSevenDays = 0;
let trackedAgentRuns = 0;
let thinkingWikiFiles = null;
let thinkingWikiReference = null;

repositories.forEach((repositoryPath) => {
  if (shouldFetch) {
    git(repositoryPath, ["fetch", "--quiet", "--prune", "origin"]);
  }

  const upstream = git(repositoryPath, ["rev-parse", "--abbrev-ref", "--symbolic-full-name", "@{upstream}"]);
  const divergence = git(repositoryPath, ["rev-list", "--left-right", "--count", `HEAD...${upstream}`])
    .split(/\s+/)
    .map(Number);
  if (divergence[0] === 0 && divergence[1] === 0) {
    synchronizedRepositories += 1;
  }

  const files = trackedFiles(repositoryPath, upstream);
  trackedFileCount += files.length;
  trackedAgentRuns += countTrackedRunRecords(repositoryPath, files);
  const commitSubjects = git(
    repositoryPath,
    ["log", `--since=${sevenDaysAgo.toISOString()}`, "--format=%s", upstream]
  ).split("\n").filter(Boolean);
  commitsLastSevenDays += commitSubjects.filter((subject) => {
    return !subject.startsWith("Update CapacityOS website activity metrics");
  }).length;

  if (relativeRepositoryPath(repositoryPath) === "repos/private/joe-thinking-wiki") {
    thinkingWikiFiles = files;
    thinkingWikiReference = upstream;
  }
});

if (!thinkingWikiFiles || !thinkingWikiReference) {
  throw new Error("The Joe Thinking Wiki repository is required to calculate graph links.");
}

const researchProjects = Object.fromEntries(researchRepositorySlugs.map((slug) => {
  const repositoryPath = path.join(capacityRoot, "repos", "public", slug);
  if (!isGitRepository(repositoryPath)) {
    throw new Error(`The public research repository is required: ${repositoryPath}`);
  }

  const publicReference = "refs/remotes/origin/main";
  git(repositoryPath, ["rev-parse", "--verify", publicReference]);
  const revisionsLastThirtyDays = git(
    repositoryPath,
    ["rev-list", "--count", `--since=${thirtyDaysAgo.toISOString()}`, publicReference]
  );

  return [slug, {
    publicRevisions: Number(git(repositoryPath, ["rev-list", "--count", publicReference])),
    revisionsLastThirtyDays: Number(revisionsLastThirtyDays),
    latestPublicUpdate: git(repositoryPath, ["log", "-1", "--format=%cs", publicReference])
  }];
}));

const purityProtocolPath = path.join(capacityRoot, "repos", "public", "purity-protocol");
if (!isGitRepository(purityProtocolPath)) {
  throw new Error(`The Purity Protocol repository is required: ${purityProtocolPath}`);
}
const purityProtocolReference = "refs/remotes/origin/main";
git(purityProtocolPath, ["rev-parse", "--verify", purityProtocolReference]);

let caretMetrics = existingMetrics.developmentProjects?.caret;
if (shouldFetch) {
  caretMetrics = await fetchGithubRepositoryMetrics(
    "disruptionjoe",
    "caret",
    thirtyDaysAgo
  );
}
if (!caretMetrics) {
  throw new Error("Caret metrics are required. Run the updater with --fetch.");
}

const developmentProjects = {
  caret: caretMetrics,
  "purity-protocol": {
    publicRevisions: Number(git(purityProtocolPath, ["rev-list", "--count", purityProtocolReference])),
    revisionsLastThirtyDays: Number(git(
      purityProtocolPath,
      ["rev-list", "--count", `--since=${thirtyDaysAgo.toISOString()}`, purityProtocolReference]
    )),
    latestPublicUpdate: git(purityProtocolPath, ["log", "-1", "--format=%cs", purityProtocolReference])
  }
};

const thinkingWikiPath = path.join(capacityRoot, "repos", "private", "joe-thinking-wiki");
const metrics = {
  asOf: chicagoDate(now),
  synchronizedRepositories,
  trackedFiles: trackedFileCount,
  commitsLastSevenDays,
  trackedAgentRuns,
  publishedResearchRecords,
  researchProjects,
  developmentProjects,
  thinkingWikiGraphLinks: countThinkingWikiGraphLinks(
    thinkingWikiPath,
    thinkingWikiReference,
    thinkingWikiFiles
  )
};

const generated = `(function () {
  "use strict";

  window.DJC_CAPACITYOS_METRICS = Object.freeze(${JSON.stringify(metrics, null, 2)});
})();
`;
const existing = fs.existsSync(outputPath) ? fs.readFileSync(outputPath, "utf8") : "";

if (checkOnly) {
  if (existing !== generated) {
    process.stderr.write("CapacityOS website metrics are stale. Run the updater.\n");
    process.exitCode = 1;
  } else {
    process.stdout.write(`${JSON.stringify(metrics)}\n`);
  }
} else {
  if (existing !== generated) {
    fs.writeFileSync(outputPath, generated);
  }
  process.stdout.write(`${JSON.stringify(metrics)}\n`);
}
