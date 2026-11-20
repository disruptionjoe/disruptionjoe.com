import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const html = await readFile(new URL("../services/index.html", import.meta.url), "utf8");

const expectedSessions = [
  ["WS-001", "Find the Real Problem", "figure-it-out"],
  ["WS-002", "The Problem Framing Session", "figure-it-out"],
  ["WS-003", "Develop Shared Understanding", "figure-it-out"],
  ["WS-004", "The Opportunity Map", "figure-it-out"],
  ["WS-005", "AI: Where Do We Start?", "figure-it-out"],
  ["WS-006", "Understand Our Customer", "figure-it-out"],
  ["WS-007", "Team Health Check", "figure-it-out"],
  ["WS-008", "Prioritize the Backlog", "get-organized"],
  ["WS-009", "Team OKR Setting", "get-organized"],
  ["WS-010", "Build the Roadmap", "get-organized"],
  ["WS-011", "Leadership Goal Setting", "get-organized"],
  ["WS-012", "Vision, Mission and Values", "get-organized"],
  ["WS-013", "Kick Off the Project", "get-organized"],
  ["WS-014", "Clarify Strategic Focus", "get-organized"],
  ["WS-015", "Define the Role", "get-organized"],
  ["WS-016", "Plan for Uncertainty", "get-organized"],
  ["WS-017", "Prepare for the Board", "get-organized"],
  ["WS-018", "Run a Better Offsite", "get-organized"],
  ["WS-019", "AI: Define Our Strategy", "get-organized"],
  ["WS-020", "AI: Measuring Results", "get-organized"],
  ["WS-029", "The RAID Review", "get-organized"],
  ["WS-021", "Make a Tough Decision", "make-the-move"],
  ["WS-022", "The Lightning Decision Jam", "make-the-move"],
  ["WS-023", "The Assumption Test", "make-the-move"],
  ["WS-024", "Build Alignment with Buy-In", "make-the-move"],
  ["WS-025", "Blameless Retrospective", "make-the-move"],
  ["WS-026", "Reset After Change", "learn-and-absorb"],
  ["WS-027", "Rally Behind the Story", "learn-and-absorb"],
  ["WS-028", "AI: Increasing Capability", "learn-and-absorb"],
];

const expectedCounts = new Map([
  ["figure-it-out", 7],
  ["get-organized", 14],
  ["make-the-move", 5],
  ["learn-and-absorb", 3],
]);

function categoryMarkup(category) {
  const pattern = new RegExp(
    `<section class="playbook-category reveal" data-category="${category}"[\\s\\S]*?<\\/section>`,
  );
  return html.match(pattern)?.[0] ?? "";
}

test("How I Can Help includes the complete 29-session playbook", () => {
  const cards = [...html.matchAll(/data-session-id="(WS-\d{3})"/g)].map((match) => match[1]);
  assert.equal(cards.length, 29);
  assert.equal(new Set(cards).size, 29);

  for (const [id, title, category] of expectedSessions) {
    const section = categoryMarkup(category);
    assert.ok(section, `missing ${category} section`);
    const escapedTitle = title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    assert.match(section, new RegExp(`data-session-id="${id}"[\\s\\S]*?<h4>${escapedTitle}<\\/h4>`));
  }
});
test("session counts match the current playbook categories", () => {
  for (const [category, expected] of expectedCounts) {
    const section = categoryMarkup(category);
    const actual = [...section.matchAll(/data-session-id="WS-\d{3}"/g)].length;
    assert.equal(actual, expected, `${category} should contain ${expected} sessions`);
  }
});
test("superseded public aliases no longer replace current playbook names", () => {
  for (const alias of [
    "The Friction Hunt",
    "The Reality Check",
    "The AI Starting Line",
    "The Priority Reset",
    "The OKR Workshop",
    "The Roadmap Jam",
    "The AI Value Bridge",
    "The Solution Showdown",
    "The Alignment Session",
    "The Blameless Retro",
  ]) {
    assert.doesNotMatch(html, new RegExp(`<h4>${alias}</h4>`));
  }
});

test("How I Can Help uses Joe's approved surrounding copy without changing the playbook", () => {
  const approvedCopy = [
    "A better way of working together.",
    "Your team is full of smart, capable people. But almost no team has someone who has spent a career on one thing: finding the conversation that will make the biggest difference, and structuring it so it's extraordinarily productive.",
    "That's what I do. And I've done it across startups, large organizations, nonprofits and public initiatives, so I've seen the patterns most teams only meet once.",
    "A Momentum Session is one focused hour that feels like a shot of productivity. It starts with a free 30-minute call, and your first session is $20.",
    "For when things are ambiguous and you need clarity about what's really going on.",
    "For when people need to be aligned, with the same understanding and the same direction.",
    "For when a decision needs legitimacy, made in a way people trust, so they buy in and follow through.",
    "Already know the conversation you need?",
    "Maybe it's leadership goal setting, team OKRs, a roadmap, or kicking off your AI effort. Instead of letting it drag on for weeks, we'll get it done in one focused hour.",
    "Two ways to get started.",
    "You already know what you need.",
    "Send me a message about what you're working through. I'll get back to you personally to arrange a free 30-minute discovery call.",
    "Send Joe a Message",
    "You're not sure where to start.",
    "Browse common challenges that get in the way of five important organizational outcomes. Collect the ones that feel familiar, and send them to me as a starting point for our conversation.",
    "Explore Challenges",
  ];
  let position = -1;
  for (const copy of approvedCopy) {
    const next = html.indexOf(copy, position + 1);
    assert.ok(next > position, `missing or out-of-order approved services copy: ${copy}`);
    position = next;
  }
  assert.match(html, /<nav class="site-nav commercial-nav"[\s\S]*?Pricing[\s\S]*?Contact Joe/);
  assert.match(html, /<footer class="footer">[\s\S]*?Pricing[\s\S]*?Contact Joe/);
  assert.doesNotMatch(html, /Talk With Joe|—/);
});
