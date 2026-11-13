import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("rider page is an unlisted six-slide comfort-first experience", async () => {
  const [html, css, client, sitemap] = await Promise.all([
    read("ride/index.html"),
    read("assets/ride.css"),
    read("assets/ride.js"),
    read("sitemap.xml")
  ]);
  assert.equal((html.match(/data-slide="[1-6]"/g) || []).length, 6);
  assert.equal((html.match(/ride-slide-comfort/g) || []).length, 3);
  assert.equal((html.match(/ride-slide-business/g) || []).length, 3);
  assert.match(html, /meta name="robots" content="noindex, nofollow"/);
  assert.doesNotMatch(html + css + client, /\bU[bB][eE][rR]\b/);
  assert.doesNotMatch(html, /site-nav|Primary navigation/);
  assert.doesNotMatch(sitemap, /\/ride\/?/);
});

test("ride route replaces the legacy redirect and has response noindex", async () => {
  const config = JSON.parse(await read("vercel.json"));
  assert.ok(config.rewrites.some((rule) => rule.source === "/ride" && rule.destination === "/ride/index.html"));
  assert.ok(config.rewrites.some((rule) => rule.source === "/ride/" && rule.destination === "/ride/index.html"));
  assert.ok(!config.redirects.some((rule) => rule.source === "/ride" || rule.source.startsWith("/ride/")));
  for (const source of ["/ride", "/ride/:match*"]) {
    const rule = config.headers.find((entry) => entry.source === source);
    assert.ok(rule, `missing header rule for ${source}`);
    assert.ok(rule.headers.some((header) => header.key === "X-Robots-Tag" && header.value === "noindex, nofollow"));
  }
});

test("pricing matches current owner truth", async () => {
  const [ride, pricing] = await Promise.all([read("ride/index.html"), read("pricing/index.html")]);
  for (const amount of ["$20", "$50", "$100", "$200", "$400"]) {
    assert.match(ride, new RegExp(amount.replace("$", "\\$")));
    assert.match(pricing, new RegExp(amount.replace("$", "\\$")));
  }
  assert.match(ride, /Free 30-minute discovery call/);
  assert.match(ride, /I want to earn the next hour\./);
});

test("three local QR handoffs carry allowlisted per-slide source tags", async () => {
  const html = await read("ride/index.html");
  const qrAssets = ["qr-overview.svg", "qr-work.svg", "qr-contact.svg"];
  for (const asset of qrAssets) {
    const svg = await read("assets/ride/" + asset);
    assert.match(svg, /<svg/);
  }
  for (const slide of [2, 4, 6]) assert.match(html, new RegExp(`utm_content=slide_${slide}`));
  assert.equal((html.match(/utm_source=ride_tablet/g) || []).length, 3);
  assert.equal((html.match(/utm_medium=qr/g) || []).length, 3);
  assert.equal((html.match(/utm_campaign=ride_page/g) || []).length, 3);
  assert.match(html, /sourcePage=%2Fride%2Fslide-6/);
});

test("slideshow timing, manual controls, keyboard and visibility pause are present", async () => {
  const [html, client, css] = await Promise.all([read("ride/index.html"), read("assets/ride.js"), read("assets/ride.css")]);
  assert.match(client, /SLIDE_DELAY = 9000/);
  assert.match(client, /document\.hidden/);
  assert.match(client, /visibilitychange/);
  for (const key of ["ArrowLeft", "ArrowRight", "Spacebar"]) assert.match(client, new RegExp(key));
  for (const control of ["data-previous", "data-toggle", "data-next"]) assert.match(html, new RegExp(control));
  assert.match(css, /prefers-reduced-motion: reduce/);
});

test("ride attribution is allowlisted, session scoped and carried to contact", async () => {
  const site = await read("assets/site.js");
  assert.match(site, /djc-ride-attribution-v1/);
  assert.match(site, /utm_source.*ride_tablet/);
  assert.match(site, /utm_medium.*qr/);
  assert.match(site, /utm_campaign.*ride_page/);
  assert.match(site, /\["slide_2", "slide_4", "slide_6"\]/);
  assert.match(site, /rideSourcePage \|\| sourcePageParam \|\| window\.location\.pathname/);
});
