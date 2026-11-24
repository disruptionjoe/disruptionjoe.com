import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const source = await readFile(new URL("analytics.js", root), "utf8");

function runAnalytics(url, options = {}) {
  const appended = [];
  const location = new URL(url);
  const document = {
    title: "Analytics test",
    referrer: options.referrer || "https://referrer.example/path?private=secret",
    head: { appendChild(node) { appended.push(node); } },
    querySelector() { return null; },
    createElement() {
      return {
        attributes: {},
        setAttribute(name, value) { this.attributes[name] = value; }
      };
    }
  };
  const localStorage = { getItem() { return options.optOut ? "1" : null; } };
  const window = {
    location,
    localStorage,
    doNotTrack: options.doNotTrack ? "1" : "0"
  };
  const context = {
    URL,
    URLSearchParams,
    Number,
    String,
    Object,
    Math,
    Date,
    encodeURIComponent,
    document,
    navigator: {
      doNotTrack: options.doNotTrack ? "1" : "0",
      globalPrivacyControl: Boolean(options.globalPrivacyControl)
    },
    window
  };
  window.window = window;
  window.document = document;
  window.navigator = context.navigator;
  vm.runInNewContext(source, context);
  return { window, appended };
}

function calls(window) {
  return (window.dataLayer || []).map((entry) => Array.from(entry));
}

test("shared analytics manually sends one sanitized initial page view", () => {
  const result = runAnalytics("https://disruptionjoe.com/contact/?challenge=Private+planning+note&utm_source=linkedin&utm_campaign=launch&email=person%40example.com&analytics_debug=1");
  const entries = calls(result.window);
  const config = entries.find((entry) => entry[0] === "config");
  const pageViews = entries.filter((entry) => entry[0] === "event" && entry[1] === "page_view");

  assert.equal(result.appended.length, 1);
  assert.equal(result.appended[0].async, true);
  assert.equal(result.appended[0].src, "https://www.googletagmanager.com/gtag/js?id=G-Z5GRJZ8D1N");
  assert.equal(config[2].send_page_view, false);
  assert.equal(pageViews.length, 1);
  assert.equal(pageViews[0][2].page_path, "/contact");
  assert.match(pageViews[0][2].page_location, /utm_source=linkedin/);
  assert.match(pageViews[0][2].page_location, /utm_campaign=launch/);
  assert.doesNotMatch(pageViews[0][2].page_location, /challenge|email|analytics_debug|Private|example\.com/);
  assert.equal(pageViews[0][2].page_referrer, "https://referrer.example/path");
  assert.equal(pageViews[0][2].debug_mode, true);
});

test("virtual page views are explicit, high-level and deduplicated", () => {
  const { window } = runAnalytics("https://disruptionjoe.com/lobby?utm_source=linkedin");
  window.djcAnalytics.pageView("/lobby");
  window.djcAnalytics.pageView("/#floor/momentum/projects-keep-stalling");
  window.djcAnalytics.pageView("/#floor/momentum/everything-is-priority");
  window.djcAnalytics.pageView("/#floor/decisions/choose-a-direction");
  const pageViews = calls(window).filter((entry) => entry[0] === "event" && entry[1] === "page_view");
  const paths = [];
  pageViews.forEach((entry) => paths.push(entry[2].page_path));
  assert.deepEqual(paths, ["/lobby", "/floor/momentum", "/floor/decisions"]);
});

test("event tracking accepts only public IDs and approved parameters", () => {
  const { window } = runAnalytics("https://disruptionjoe.com/lobby");
  window.djcAnalytics.track("challenge_add", {
    floor_id: "momentum",
    challenge_id: "projects-keep-stalling",
    collection_count: 3,
    email: "person@example.com",
    planning_notes: "private"
  });
  window.djcAnalytics.track("challenge_view", { challenge_id: "Not a safe ID!" });
  window.djcAnalytics.track("unknown_event", { floor_id: "momentum" });
  const events = calls(window).filter((entry) => entry[0] === "event");
  const added = events.find((entry) => entry[1] === "challenge_add");
  const viewed = events.find((entry) => entry[1] === "challenge_view");
  assert.deepEqual({ ...added[2] }, { floor_id: "momentum", challenge_id: "projects-keep-stalling", collection_count: 3 });
  assert.deepEqual({ ...viewed[2] }, {});
  assert.equal(events.some((entry) => entry[1] === "unknown_event"), false);
});

test("privacy signals and diagnostic modes prevent all analytics loading", () => {
  for (const [url, options] of [
    ["https://disruptionjoe.com/?lite=1", {}],
    ["https://disruptionjoe.com/?noresize=1", {}],
    ["https://disruptionjoe.com/", { doNotTrack: true }],
    ["https://disruptionjoe.com/", { globalPrivacyControl: true }],
    ["https://disruptionjoe.com/", { optOut: true }]
  ]) {
    const result = runAnalytics(url, options);
    assert.equal(result.window.djcAnalytics.enabled, false);
    assert.equal(result.appended.length, 0);
    assert.equal(result.window.dataLayer, undefined);
  }
});

test("every public HTML entry loads only the shared analytics implementation", async () => {
  const paths = [
    "index.html", "about/index.html", "ai-activation-playbook/index.html", "contact/index.html",
    "enablement/experience/index.html", "enablement/index.html", "method/index.html", "playbook/index.html",
    "pricing/index.html", "privacy/index.html", "ride/index.html", "services/index.html", "soundcheck/index.html",
    "thinking/experience/index.html", "thinking/game/index.html", "thinking/index.html"
  ];
  const pages = await Promise.all(paths.map((path) => readFile(new URL(path, root), "utf8")));
  pages.forEach((html, index) => {
    assert.equal((html.match(/\/analytics\.js\?v=20261124-conversion-v1/g) || []).length, 1, `${paths[index]} loads shared analytics once`);
    assert.doesNotMatch(html, /googletagmanager\.com\/gtag/);
  });
});
