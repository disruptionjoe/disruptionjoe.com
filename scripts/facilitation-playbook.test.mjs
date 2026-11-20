import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

const read = (file) => readFile(new URL(`../${file}`, import.meta.url), "utf8");
const [dataText, html, script, css, routes, sitemap, method, thinkingGame] = await Promise.all([
  read("assets/facilitation-playbook-data.json"),
  read("playbook/index.html"),
  read("assets/facilitation-playbook.js"),
  read("assets/facilitation-playbook.css"),
  read("vercel.json"),
  read("sitemap.xml"),
  read("method/index.html"),
  read("assets/thinking-game.js"),
]);
const data = JSON.parse(dataText);
const all = [...data.sessions, ...data.plays, ...data.techniques];
const ids = new Set(all.map((item) => item.id));

function hash(value) {
  return createHash("sha256").update(value).digest("hex");
}

test("generated public data is pinned, complete, and bounded", () => {
  assert.equal(data.meta.sourceRepository, "disruptionjoe/facilitator-playbook");
  assert.equal(data.meta.sourceRevision, "35148fe498dcce634b1ff9572534e8e49db8fc47");
  assert.deepEqual(data.meta.counts, { sessions: 29, plays: 40, techniques: 11 });
  assert.equal(data.sessions.length, 29);
  assert.equal(data.plays.length, 40);
  assert.equal(data.techniques.length, 11);
  assert.equal(ids.size, 80);
  assert.doesNotMatch(dataText, /former_id|"status"|"slug"|"sourceFile"|"production"|"anonymity"|style\/|planning-call\/|programs\/|_inventory|_review-log|glossary|id-migration/);
});

test("sessions expose the requested public fields and resolvable links", () => {
  data.sessions.forEach((session) => {
    assert.ok(session.title && session.category && session.situation && session.output);
    assert.ok(session.situationTags.length > 0);
    assert.ok(session.outcomeTags.length > 0);
    assert.ok(session.buyerTags.length > 0);
    assert.ok(["ai-heavy", "light", "none"].includes(session.aiInvolvement));
    assert.ok(["decides", "informs"].includes(session.decisionMode));
    assert.ok(session.sequence.length > 0);
    assert.equal(session.sequence.at(-1).id, "PL-033");
    session.sequence.forEach((step) => assert.ok(ids.has(step.id), `${session.id} references ${step.id}`));
    [...session.follows, ...session.leadsTo, ...session.pairsWith].forEach((id) => assert.ok(ids.has(id), `${session.id} relates to ${id}`));
  });
});

test("play and technique cards have complete source-grounded fields", () => {
  data.plays.forEach((play) => {
    assert.ok(play.name && play.purpose && play.default && play.say && play.dial && play.aiText);
    assert.ok(play.books.length > 0);
    assert.ok(["ai-heavy", "light", "none"].includes(play.aiInvolvement));
    [...play.oftenAfter, ...play.oftenBefore].forEach((id) => assert.ok(ids.has(id), `${play.id} relates to ${id}`));
  });
  data.techniques.forEach((technique) => {
    assert.ok(technique.name && technique.purpose && technique.do && technique.say);
    [...technique.oftenAfter, ...technique.oftenBefore].forEach((id) => assert.ok(ids.has(id), `${technique.id} relates to ${id}`));
  });
});

test("the public page provides all requested filter and card surfaces", () => {
  for (const filter of ["q", "situation", "outcome", "category", "book", "buyer", "ai", "decision"]) {
    assert.match(html, new RegExp(`data-filter="${filter}"`));
  }
  for (const kind of ["session", "play", "technique", "all"]) {
    assert.match(html, new RegExp(`data-kind="${kind}"`));
  }
  assert.match(script, /URLSearchParams\(window\.location\.search\)/);
  assert.match(script, /window\.history\.replaceState/);
  assert.match(script, /if \(state\.situation && !/);
  assert.match(script, /if \(state\.outcome && !/);
  assert.match(script, /if \(state\.category && !/);
  assert.match(script, /if \(state\.book && !/);
  assert.match(script, /if \(state\.buyer && !/);
  assert.match(script, /if \(state\.ai && /);
  assert.match(script, /if \(state\.decision && /);
  assert.match(script, /Default play sequence/);
  assert.match(script, /Book a discovery call/);
  assert.match(script, /Often after/);
  assert.match(script, /Often before/);
  assert.match(script, /View related cards/);
  assert.match(script, /scrollIntoView/);
  assert.match(css, /@media \(max-width: 760px\)[\s\S]*?\.playbook-card-grid\s*\{\s*grid-template-columns:\s*1fr/);
  assert.match(css, /@media \(prefers-reduced-motion: reduce\)/);
});

test("AI Activation Playbook content is intact at its new route", async () => {
  const [aiHtml, aiCss, aiScript] = await Promise.all([
    read("ai-activation-playbook/index.html"),
    read("assets/playbook-experience.css"),
    read("assets/playbook-experience.js"),
  ]);
  assert.equal(hash(aiHtml), "4b21f65c02155681e021aaa8289aeecbcc55a9ebebb84ae86ff3106c1e90a8f5");
  assert.equal(hash(aiCss), "e88476924e32724a855c6b58ad40a27e23b8d6d94121be4b9bab50ad032a2e2e");
  assert.equal(hash(aiScript), "df58add79ce8863d2db1690afc0b3603466030ec723cfa98ea01395b9380bfb3");
  assert.match(aiHtml, /AI Activation Playbook/);
  assert.doesNotMatch(html, /Use-Case Harvest|Opportunity Clustering|Constraint Gauntlet/);
});

test("routes, links, sitemap, and menus distinguish both playbooks", async () => {
  const config = JSON.parse(routes);
  assert.ok(config.rewrites.some((route) => route.source === "/playbook" && route.destination === "/playbook/index.html"));
  assert.ok(config.rewrites.some((route) => route.source === "/ai-activation-playbook" && route.destination === "/ai-activation-playbook/index.html"));
  assert.ok(config.redirects.some((route) => route.source === "/book" && route.destination === "/ai-activation-playbook" && route.permanent));
  assert.match(method, /href="\/ai-activation-playbook"[^>]*>Open AI Activation Playbook/);
  assert.match(thinkingGame, /link: "\/ai-activation-playbook\/"/);
  assert.match(sitemap, /https:\/\/disruptionjoe\.com\/playbook/);
  assert.match(sitemap, /https:\/\/disruptionjoe\.com\/ai-activation-playbook/);

  const menuPaths = ["index.html", "services/index.html", "pricing/index.html", "about/index.html", "contact/index.html", "privacy/index.html", "method/index.html", "thinking/experience/index.html", "playbook/index.html"];
  const pages = await Promise.all(menuPaths.map(read));
  pages.forEach((page, index) => {
    assert.match(page, /Facilitation Playbook/, `${menuPaths[index]} lacks Facilitation Playbook`);
    assert.match(page, /AI Activation Playbook/, `${menuPaths[index]} lacks AI Activation Playbook`);
  });
});
