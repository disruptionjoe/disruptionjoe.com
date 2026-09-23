import test from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import vm from "node:vm";
import { refreshGroup, validateMetrics, countTrackedRunRecords, githubPageCount,
  chicagoDate, fetchPublishedResearchCount, fetchGithubRepositoryMetrics } from "./update-capacityos-stats.mjs";

const site = new URL("../", import.meta.url);
const source = fs.readFileSync(new URL("assets/thinking-game.js", site), "utf8");
const cache = {};
vm.runInNewContext(fs.readFileSync(new URL("assets/thinking/capacityos-metrics.js", site), "utf8"), { window: cache });
const metrics = JSON.parse(JSON.stringify(cache.DJC_CAPACITYOS_METRICS));
const base = { previous: 8, previousDate: "2026-09-08", refresh: true,
  today: "2026-09-23", fetchFresh: true, warn() {} };

test("source success updates value and evidence date", async () => {
  assert.deepEqual(await refreshGroup({ ...base, load: async () => 11 }),
    { value: 11, asOf: "2026-09-23", status: "current" });
});
test("source failure retains exact value/date and independent group still advances", async () => {
  const failed = await refreshGroup({ ...base, load: async () => { throw Error("403"); } });
  const good = await refreshGroup({ ...base, load: async () => 12 });
  assert.deepEqual(failed, { value: 8, asOf: "2026-09-08", status: "retained" });
  assert.equal(good.value, 12);
});
test("offline sources do not fetch or claim fresh evidence", async () => {
  assert.deepEqual(await refreshGroup({ ...base, refresh: false, load: () => assert.fail("no network") }),
    { value: 8, asOf: "2026-09-08", status: "retained" });
  assert.equal((await refreshGroup({ ...base, fetchFresh: false, load: () => 9 })).asOf, "2026-09-08");
});
test("missing uncached sources fail rather than inventing zero", async () => {
  await assert.rejects(refreshGroup({ ...base, previous: undefined, load: () => { throw Error("offline"); } }), /No last-known/);
});
test("GitHub pagination and empty recent period calculate correctly", () => {
  assert.equal(githubPageCount({ headers: new Headers({ link: '<https://api.github.com/x?page=732>; rel="last"' }) }, [{}]), 732);
  assert.equal(githubPageCount({ headers: new Headers() }, []), 0);
  assert.equal(githubPageCount({ headers: new Headers() }, [{}]), 1);
});
test("tracked runs exclude metadata and deduplicate multi-file Runtime runs", () => {
  const root = new URL("../../../", site).pathname;
  assert.equal(countTrackedRunRecords(root + "repos/private/system-runtime", [
    "meta/runs/RUN-a/envelope.yaml", "meta/runs/RUN-a/run-plan.md",
    "meta/runs/RUN-b/run-plan.md", "meta/runs/README.md",
    "meta/runs/imported-repo-steward-history/a.md"
  ]), 2);
});
test("Chicago date uses local calendar boundary", () => {
  assert.equal(chicagoDate(new Date("2026-09-23T03:00:00Z")), "2026-09-22");
});
test("public asset schema rejects invalid or impossible counts", () => {
  validateMetrics(metrics);
  assert.throws(() => validateMetrics({ ...metrics, trackedFiles: -1 }));
  assert.throws(() => validateMetrics({ ...metrics, publishedResearchRecords: 1.5 }));
  assert.throws(() => validateMetrics({ ...metrics, synchronizedRepositories: metrics.managedRepositories + 1 }));
});
test("all eight repository mentions use shared count and historical numbers remain", () => {
  assert.equal((source.match(/\+ repositoryCount \+/g) || []).length, 8);
  assert.ok(!source.includes("more than 30 repositories"));
  assert.ok(source.includes("More than 15 years as a DJ"));
  assert.ok(source.includes("advising more than 100 startups"));
});
test("mobile publication date uses its source date, not global refresh date", () => {
  assert.match(source, /capacityMetrics\.freshness\.zenodo\.asOf/);
  assert.match(source, /formatMetric\(capacityMetrics\.publishedResearchRecords\)[\s\S]*formatMetricDate\(publicationDate\)/);
  const publicationBranch = source.slice(source.indexOf("} else if (exhibit.mobileResearchRecord)"), source.indexOf("if (exhibit.mobileDirectLink)", source.indexOf("} else if (exhibit.mobileResearchRecord)")));
  assert.ok(!publicationBranch.includes("capacityMetrics.asOf"));
});
test("all displayed research and aggregate metrics remain data-bound", () => {
  for (const slug of ["time-as-finality", "temporal-issuance", "gu-formalization", "dynamic-unity", "possibility-to-capability", "continuity-ledger"]) {
    assert.ok(source.includes('mobileMetricsKey: "' + slug + '"'));
  }
  // Development values are retained in the existing asset, but current
  // Caret/Purity exhibits deliberately have no numeric display binding.
  assert.ok(source.includes("developmentProjectMetrics[exhibit.mobileDevelopmentMetricsKey]"));
  for (const key of ["synchronizedRepositories", "trackedFiles", "commitsLastSevenDays", "trackedAgentRuns", "thinkingWikiGraphLinks"]) {
    assert.ok(source.includes("formatMetric(capacityMetrics." + key + ")"));
  }
  const html = fs.readFileSync(new URL("thinking/index.html", site), "utf8");
  assert.ok(html.indexOf("capacityos-metrics.js") < html.indexOf("thinking-game.js"));
});
test("Zenodo and GitHub parsing reject bad responses, accept real-shaped fixtures", async () => {
  const original = globalThis.fetch;
  try {
    globalThis.fetch = async () => new Response(JSON.stringify({ hits: { total: 12 } }), { status: 200 });
    assert.equal(await fetchPublishedResearchCount(), 12);
    globalThis.fetch = async () => new Response(JSON.stringify({ hits: { total: -1 } }), { status: 200 });
    await assert.rejects(fetchPublishedResearchCount(), /publication count/);
    globalThis.fetch = async () => new Response("Forbidden", { status: 403 });
    await assert.rejects(fetchPublishedResearchCount(), /403/);
    globalThis.fetch = async (url) => new Response(JSON.stringify(url.includes("&since=") ? [] : [
      { commit: { committer: { date: "2026-09-23T12:00:00Z" } } }
    ]), { status: 200, headers: url.includes("&since=") ? {} : { link: '<https://api.github.com/x?page=28>; rel="last"' } });
    assert.deepEqual(await fetchGithubRepositoryMetrics("example", "repo", new Date()), {
      publicRevisions: 28, revisionsLastThirtyDays: 0, latestPublicUpdate: "2026-09-23"
    });
  } finally { globalThis.fetch = original; }
});
