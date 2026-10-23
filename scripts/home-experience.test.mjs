import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("homepage exposes the approved experience and independent floors", async () => {
  const html = await read("index.html");
  for (const label of ["Thinking Better Together", "Better Conversations. Better Outcomes. Better Performance.", "Better Momentum", "Better Decisions", "Better Understanding", "Better Possibilities", "Better AI"]) {
    assert.match(html, new RegExp(label));
  }
  assert.match(html, /href="\/thinking\/"/);
  assert.match(html, /data-collection-dialog/);
  assert.match(html, /data-exhibit-dialog/);
});

test("threshold and orientation preserve the approved narrative", async () => {
  const html = await read("index.html");
  const approvedCopy = [
    "Disruption Joe",
    "Thinking Better Together",
    "Better Conversations. Better Outcomes. Better Performance.",
    "Your team is capable of more.",
    "An important project keeps slipping. Everyone has an opinion, but nobody can agree on priorities. You leave another meeting with yet more discussion and still no progress.",
    "Or worse, you've got a room full of talented people and you're barely scratching the surface of what they're capable of.",
    "That's where I come in.",
    "I've spent ten years developing and refining a playbook of structured exercises that unlock the knowledge, creativity, and judgment already inside your organization.",
    "Drawing on proven methods like Google's Design Sprint, Atlassian's Team Playbook, and Liberating Structures, I've built a different kind of working session.",
    "No endless discussions. No waiting for the loudest person to finish. No mistaking participation for progress.",
    "People get to work from the first minute. Ideas surface that nobody expected. Different perspectives build on each other. Assumptions get challenged. The group discovers opportunities it hadn't considered, or realizes the real obstacle wasn't what anyone thought.",
    "And suddenly, things start moving.",
    "It's fast. It's engaging. It's surprisingly fun. And the results can feel almost magical.",
    "People leave saying things like:",
    "I talked less than I usually do, and somehow I felt more heard.",
    "We didn't just come up with better ideas. We realized we'd been looking for ideas in the wrong places.",
    "That was the fastest hour I've ever spent doing actual work with a group of people.",
    "We've spent six weeks going in circles. How did we get further in an hour?",
    "I came in convinced I knew the problem. Turns out, we were solving the wrong one.",
    "For the first time, I don't just know what we decided. I understand why, and I can stand behind it.",
    "The strangest part? We stopped having a normal conversation, and suddenly everyone had something valuable to contribute.",
    "We had all the knowledge we needed before we walked in. We just had no idea how to get it out of each other.",
    "I've been leading teams for twenty years. Why have I never run a session like that?",
    "I expected another workshop. I left wanting to steal half the exercises for my own team.",
    "It's not just a better meeting.",
    "It's a shot of productivity.",
    "Experience it for yourself.",
    "You don't need to commit to a major consulting project.",
    "Explore the floors, each organized around an outcome you might be looking for. Step into the rooms to discover challenges that sound familiar, and collect the ones that resonate with your situation.",
    "Send me what you've collected, and we'll start with a free 30-minute planning call. Together, we'll identify an opportunity for a focused, customized session, often just an hour, designed to make meaningful progress on something that matters.",
    "The experience of working with Disruption Joe begins here.",
    "Explore the outcomes you want, collect what sounds familiar, and bring those challenges into our first conversation.",
    "Enter the Experience"
  ];
  let position = -1;
  for (const copy of approvedCopy) {
    const nextPosition = html.indexOf(copy, position + 1);
    assert.ok(nextPosition > position, `missing or out-of-sequence approved copy: ${copy}`);
    position = nextPosition;
  }

  assert.doesNotMatch(html, /Enter a different kind of working space/);
  assert.doesNotMatch(html, /Better structure for your company starts with better structure for your conversations/);
  assert.doesNotMatch(html, /Introductory exhibit|The room changes the result|Same people\. Same challenge\. A different conversation\./);
  assert.doesNotMatch(html, /—/);

  const threshold = html.match(/<section class="intro-step threshold-view"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.ok(threshold, "threshold section is present");
  assert.doesNotMatch(threshold, /home-action|<button|Enter the Experience/i);
});

test("orientation page four presents all ten reactions as an accessible voice wall", async () => {
  const [html, script, css] = await Promise.all([read("index.html"), read("assets/home-experience.js"), read("assets/home-experience.css")]);
  const statements = [
    "I talked less than I usually do, and somehow I felt more heard.",
    "We didn't just come up with better ideas. We realized we'd been looking for ideas in the wrong places.",
    "That was the fastest hour I've ever spent doing actual work with a group of people.",
    "We've spent six weeks going in circles. How did we get further in an hour?",
    "I came in convinced I knew the problem. Turns out, we were solving the wrong one.",
    "For the first time, I don't just know what we decided. I understand why, and I can stand behind it.",
    "The strangest part? We stopped having a normal conversation, and suddenly everyone had something valuable to contribute.",
    "We had all the knowledge we needed before we walked in. We just had no idea how to get it out of each other.",
    "I've been leading teams for twenty years. Why have I never run a session like that?",
    "I expected another workshop. I left wanting to steal half the exercises for my own team."
  ];
  for (const statement of statements) assert.match(html, new RegExp(statement.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  assert.equal((html.match(/data-reaction-panel=/g) || []).length, 10);
  assert.equal((html.match(/data-reaction-selector=/g) || []).length, 10);
  assert.match(html, /role="tablist"/);
  assert.match(html, /role="tabpanel"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(script, /reactionVoiceMap\.addEventListener\("keydown"/);
  assert.match(script, /reactionStage\.addEventListener\("pointerdown"/);
  assert.match(script, /Math\.abs\(deltaX\) > Math\.abs\(deltaY\)/);
  assert.doesNotMatch(script, /setInterval/);
  assert.match(css, /touch-action:\s*pan-y/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(html, /Swipe or use arrows/);
  assert.doesNotMatch(html, /Choose a voice/);
  assert.doesNotMatch(html, /That flew by|How did we accomplish that much in an hour/);
});

test("orientation stays discrete without a numbered progress rail", async () => {
  const [html, script, css] = await Promise.all([read("index.html"), read("assets/home-experience.js"), read("assets/home-experience.css")]);
  assert.doesNotMatch(html, /intro-progress|data-intro-progress|aria-label="Introduction progress"/);
  assert.doesNotMatch(script, /introProgressLinks|data-intro-progress/);
  assert.doesNotMatch(css, /\.intro-progress/);
  assert.equal((html.match(/data-intro-step=/g) || []).length, 7);
  assert.match(css, /scroll-snap-type:\s*y mandatory/);
});

test("Floor Zero explains and directly opens the five destinations", async () => {
  const html = await read("index.html");
  assert.match(html, /data-explore-level="lobby"/);
  for (const instruction of ["Move between floors", "Explore rooms", "Collect challenges", "Share with Joe"]) {
    assert.match(html, new RegExp(instruction));
  }
  for (const floor of ["momentum", "decisions", "understanding", "possibilities", "ai"]) {
    assert.match(html, new RegExp(`href="#floor/${floor}"`));
  }
});

test("visitor-facing challenge language uses floors and rooms", async () => {
  const [html, script] = await Promise.all([read("index.html"), read("assets/home-experience.js")]);
  assert.match(html, /Step into the rooms/);
  assert.match(script, /Open the room/);
  assert.match(script, /rooms/);
  assert.doesNotMatch(script, /Open the exhibit|Open any exhibit| exhibits"|>Exhibit</);
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

test("spatial navigation, deep links, and reduced motion are first-class", async () => {
  const [script, css] = await Promise.all([read("assets/home-experience.js"), read("assets/home-experience.css")]);
  assert.match(script, /hashchange/);
  assert.match(script, /parts\[0\] === "floor"/);
  for (const key of ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]) assert.match(script, new RegExp(key));
  assert.match(script, /addEventListener\("wheel"/);
  assert.match(script, /data-room-track/);
  assert.match(script, /data-explore-level/);
  assert.match(css, /scroll-snap-type:\s*y mandatory/);
  assert.match(css, /scroll-snap-type:\s*x mandatory/);
  assert.match(css, /scroll-snap-stop:\s*always/);
  assert.match(css, /prefers-reduced-motion: reduce/);
});

test("vertical floor travel returns to the elevator and drives its doors", async () => {
  const [script, css, museum] = await Promise.all([read("assets/home-experience.js"), read("assets/home-experience.css"), read("assets/thinking-game.js")]);
  assert.match(script, /function updateVerticalDoorOpening\(\)/);
  assert.match(script, /Math\.abs\(\(distance \* 2\) - 1\)/);
  assert.match(script, /setRoom\(resolved, 0, false\)/);
  assert.match(script, /trackStates\[resolved\]\.track\.scrollTo\(\{ left: 0, behavior: "auto" \}\)/);
  assert.match(css, /--elevator-left-shift/);
  assert.match(css, /--elevator-right-shift/);
  assert.doesNotMatch(css, /floor-level\.is-current \.floor-landing\.is-current \.elevator-depth/);
  assert.match(museum, /function updateVerticalDoorOpening\(\)/);
});
