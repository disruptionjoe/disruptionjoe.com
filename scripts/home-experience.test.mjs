import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("homepage exposes the approved experience and independent floors", async () => {
  const html = await read("index.html");
  for (const label of ["Thinking Better Together", "Better Momentum", "Better Decisions", "Better Understanding", "Better Possibilities", "Better AI"]) {
    assert.match(html, new RegExp(label));
  }
  assert.match(html, /href="\/thinking\/"/);
  assert.match(html, /data-collection-dialog/);
  assert.match(html, /data-exhibit-dialog/);
});

test("homepage preserves all five established AI stages", async () => {
  const home = await read("assets/home-experience.js");
  const museum = await read("assets/thinking-game.js");
  for (const stage of ["Identify the Floor", "Establish the Floor", "Raise the Floor", "Lead the Change", "Push the Frontier"]) {
    assert.match(home, new RegExp(stage));
    assert.match(museum, new RegExp(stage));
  }
});

test("collection is contextual, removable, and non-diagnostic", async () => {
  const [html, script] = await Promise.all([read("index.html"), read("assets/home-experience.js")]);
  assert.match(script, /localStorage/);
  assert.match(script, /djc-saved-challenge-labels-v1/);
  assert.match(script, /data-remove-id/);
  assert.match(script, /params\.append\("challenge"/);
  assert.match(html, /not an automated diagnosis/i);
  assert.doesNotMatch(script, /scoreChallenge|recommendationEngine|diagnos(e|is)Challenge/);
});

test("contact accepts direct inquiries and saved challenge context", async () => {
  const [html, client, endpoint] = await Promise.all([read("contact/index.html"), read("assets/site.js"), read("api/contact.js")]);
  assert.match(html, /name="name"[^>]*required/);
  assert.match(html, /name="email"[^>]*required/);
  assert.match(html, /name="role"/);
  assert.match(html, /data-contact-challenges-field/);
  assert.match(client, /getAll\("challenge"\)/);
  assert.match(client, /djc-saved-challenge-labels-v1/);
  assert.match(endpoint, /challenges: 4000/);
  assert.match(endpoint, /Role:/);
});

test("deep links and reduced motion are first-class", async () => {
  const [script, css] = await Promise.all([read("assets/home-experience.js"), read("assets/home-experience.css")]);
  assert.match(script, /hashchange/);
  assert.match(script, /parts\[0\] === "floor"/);
  assert.match(script, /ArrowLeft/);
  assert.match(script, /pointerdown/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});
