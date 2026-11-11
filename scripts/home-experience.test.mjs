import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

test("homepage exposes the approved experience and independent floors", async () => {
  const html = await read("index.html");
  for (const label of ["Thinking Better Together", "One Hour.", "Real Progress.", "Better Momentum", "Better Decisions", "Better Understanding", "Better Possibilities", "Better AI"]) {
    assert.match(html, new RegExp(label));
  }
  assert.match(html, /href="\/thinking\/"/);
  assert.match(html, /data-collection-dialog/);
  assert.match(html, /data-exhibit-dialog/);
});

test("pricing page presents individual rates and flexible prepaid hours", async () => {
  const [pricing, services, config] = await Promise.all([read("pricing/index.html"), read("services/index.html"), read("vercel.json")]);
  for (const copy of ["free 30-minute discovery call", "$20", "$50", "$100", "$200", "$400", "Regular hourly rate", "10 hours", "$3,000", "$300 per hour", "40 hours", "$10,000", "$250 per hour", "Travel expenses are separate."]) {
    assert.match(pricing, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(pricing, /I want to earn the next hour\./);
  assert.match(pricing, /Talk With Joe/);
  assert.doesNotMatch(pricing, /checkout|automatic renewal|expiration|refund|guaranteed outcome/i);
  assert.match(services, /href="\/pricing\/">See pricing and prepaid options\.<\/a>/);
  assert.match(config, /"source": "\/pricing", "destination": "\/pricing\/index\.html"/);
});

test("threshold and orientation preserve the approved four-screen narrative", async () => {
  const html = await read("index.html");
  const approvedCopy = [
    "Disruption Joe",
    "Thinking Better Together",
    "One Hour.",
    "Real Progress.",
    "Your team is capable of more.",
    "I've spent years building startups, leading teams across operations, product, and growth, and working on complex, multi-organization initiatives with billions at stake.",
    "Across all that work, two skills have consistently allowed me to make the biggest difference:",
    "Finding the conversation that needs to happen.",
    "Making that conversation extraordinarily productive.",
    "I've decided to build my business around mastering these two things, one hour at a time...",
    "I want to earn the next hour.",
    "I'm making it remarkably easy to experience what I do, with introductory pricing that grows toward my regular rate.",
    "First session",
    "$20",
    "Fifth and subsequent sessions",
    "$400",
    "free 30-minute discovery call",
    "A better way to work together.",
    "It's a model designed to be better for your business and better for my craft.",
    "Earn the next hour.",
    "The difference starts here.",
    "I created a Challenge Investigation experience where you can explore common organizational challenges and collect the ones your team is experiencing.",
    "Bring your collection to our first conversation, and we'll have a head start on figuring out where I can make the biggest difference.",
    "Or, if you're ready to talk, just send me a message.",
    "Start Your Challenge Investigation",
    "Send Joe a Message"
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
  assert.doesNotMatch(html, /I've decided what I want to be the best in the world at\./);
  assert.doesNotMatch(html, /Maybe you've experienced something like this\./);
  assert.doesNotMatch(html, /A different way to do business\./);
  assert.doesNotMatch(html, /I'm betting you'll want another hour\./);
  assert.doesNotMatch(html, /I don't just want to promise you a different experience\./);
  assert.doesNotMatch(html, /So instead of another website telling you what I do/);
  assert.doesNotMatch(html, /—/);

  const orientation = html.slice(html.indexOf('<div class="intro-sequence"'), html.indexOf('<section class="home-view explore-view"'));
  assert.doesNotMatch(orientation, /Does any of this sound familiar\?/);
  assert.match(orientation, /one hour at a time\.\.\./);

  const threshold = html.match(/<section class="intro-step threshold-view"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.ok(threshold, "threshold section is present");
  assert.doesNotMatch(threshold, /home-action|<button|Enter the Experience/i);
  assert.match(threshold, /One Hour\.<span>Real Progress\.<\/span>/);
  assert.match(html, /href="\/pricing\/">See pricing and prepaid options<\/a>/);
});

test("illustrative buyer statements preserve recognition without testimonial attribution", async () => {
  const html = await read("index.html");
  const welcome = html.slice(html.indexOf('<section class="explore-level lobby-level investigation-welcome"'), html.indexOf('<section class="home-view meet-view"'));
  assert.equal((welcome.match(/class="buyer-voice-role"/g) || []).length, 4);
  assert.match(welcome, /A project sponsor might say/);
  assert.match(welcome, /A department leader might say/);
  assert.match(welcome, /An AI initiative sponsor might say/);
  assert.match(welcome, /A founder might say/);
  assert.doesNotMatch(welcome, /<blockquote|<cite|“We've had six meetings/);
});

test("orientation comparisons remain an accessible carousel", async () => {
  const [html, script, css] = await Promise.all([read("index.html"), read("assets/home-experience.js"), read("assets/home-experience.css")]);
  assert.equal((html.match(/data-reaction-panel=/g) || []).length, 6);
  assert.equal((html.match(/data-reaction-selector=/g) || []).length, 6);
  assert.match(html, /role="tablist"/);
  assert.match(html, /role="tabpanel"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(script, /reactionVoiceMap\.addEventListener\("keydown"/);
  assert.match(script, /reactionStage\.addEventListener\("pointerdown"/);
  assert.match(script, /Math\.abs\(deltaX\) > Math\.abs\(deltaY\)/);
  assert.doesNotMatch(script, /setInterval/);
  assert.match(css, /touch-action:\s*pan-y/);
  assert.match(css, /\.reaction-panels > \[hidden\]\s*\{\s*display:\s*none/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(html, /Swipe or use arrows/);
  assert.match(html, /Earn the next hour/);
  assert.match(html, /Master two things across more organizations/);
});

test("orientation stays discrete without a numbered progress rail", async () => {
  const [html, script, css] = await Promise.all([read("index.html"), read("assets/home-experience.js"), read("assets/home-experience.css")]);
  assert.doesNotMatch(html, /intro-progress|data-intro-progress|aria-label="Introduction progress"/);
  assert.doesNotMatch(script, /introProgressLinks|data-intro-progress/);
  assert.doesNotMatch(css, /\.intro-progress/);
  assert.equal((html.match(/data-intro-step=/g) || []).length, 5);
  assert.match(css, /scroll-snap-type:\s*y mandatory/);
});

test("navigation is immersive before Floor Zero and contextual afterward", async () => {
  const [html, script, css] = await Promise.all([read("index.html"), read("assets/home-experience.js"), read("assets/home-experience.css")]);
  assert.doesNotMatch(html, /class="home-header"|class="home-utility"/);
  assert.doesNotMatch(html, /Skip to floors|Explore Floors/);
  assert.match(html, /class="intro-controls"[\s\S]*?Contact Joe[\s\S]*?data-experience-menu-open/);
  assert.match(html, /class="experience-controls"[^>]*hidden/);
  assert.match(html, /class="experience-control saved-control"[\s\S]*?data-collection-count hidden/);
  assert.match(html, /data-experience-menu[\s\S]*?experience-menu-contact[\s\S]*?Contact Joe[\s\S]*?<nav[^>]*>[\s\S]*?Explore Challenges[\s\S]*?How I Can Help[\s\S]*?About Disruption Joe[\s\S]*?Thinking Museum/);
  const menuNav = html.match(/<nav aria-label="Secondary destinations">[\s\S]*?<\/nav>/)?.[0] ?? "";
  assert.ok(menuNav, "secondary destination list is present");
  assert.doesNotMatch(menuNav, /Contact Joe|Talk With Joe/);
  assert.equal((menuNav.match(/<a /g) || []).length, 4);
  assert.match(html, /href="\/services\/"/);
  assert.match(html, /href="\/about\/"/);
  assert.match(script, /experienceControls\.hidden = name === "intro"/);
  assert.match(script, /element\.hidden = count === 0/);
  assert.match(script, /experienceMenu\.showModal\(\)/);
  assert.match(script, /experienceMenuOpenButtons\.forEach/);
  assert.match(script, /experienceMenu\.addEventListener\("cancel"/);
  assert.match(script, /parts\[0\] === "about-joe" \|\| parts\[0\] === "meet-joe"/);
  assert.match(css, /\.intro-controls\s*\{[^}]*position:\s*fixed/);
  assert.match(css, /\.experience-controls\s*\{[^}]*position:\s*fixed/);
  assert.match(css, /\.experience-menu nav \.experience-menu-feature/);
  assert.match(css, /\.experience-menu-contact\s*\{/);
  assert.match(css, /\.experience-menu::backdrop/);
});

test("About Joe uses grounded experience and preserves exploration state", async () => {
  const [html, script] = await Promise.all([read("index.html"), read("assets/home-experience.js")]);
  for (const evidence of ["roughly ten years", "Google's Design Sprint", "Atlassian's Team Playbook", "Liberating Structures", "technology, product, leadership, and business", "free 30-minute discovery call"]) {
    assert.match(html, new RegExp(evidence.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(html, /id="about-joe"[\s\S]*?data-explore-return/);
  assert.match(script, /function syncExploreReturnLinks\(\)/);
  assert.match(script, /link\.href = destination/);
});

test("Challenge Investigation welcome explains the journey and opens the first Floor", async () => {
  const html = await read("index.html");
  assert.match(html, /id="investigation"[^>]*data-explore-level="lobby"/);
  for (const instruction of ["Welcome to the Challenge Investigation.", "Does any of this sound familiar?", "I've collected 21 common challenges across five organizational outcomes for you to explore.", "Explore the challenges.", "Save a challenge.", "Save this challenge", "Send them to Joe.", "Begin Investigation"]) {
    assert.match(html, new RegExp(instruction));
  }
  assert.match(html, /class="home-action primary investigation-begin" href="#floor\/momentum"/);
  assert.doesNotMatch(html, /Add to Collection/);
  for (const floor of ["momentum", "decisions", "understanding", "possibilities", "ai"]) {
    assert.match(html, new RegExp(`href="#floor/${floor}"`));
  }
});

test("visitor-facing challenge language uses floors and rooms", async () => {
  const [html, script] = await Promise.all([read("index.html"), read("assets/home-experience.js")]);
  assert.match(html, /Browse the five Floors/);
  assert.match(script, /Open the room/);
  assert.match(script, /rooms/);
  assert.doesNotMatch(script, /Open the exhibit|Open any exhibit| exhibits"|>Exhibit</);
});

test("homepage preserves all five established AI stages", async () => {
  const home = await read("assets/home-experience.js");
  const museum = await read("assets/thinking-game.js");
  assert.equal((home.match(/^\s+\{ id:/gm) || []).length, 21);
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
  assert.equal((html.match(/href="\/#lobby"/g) || []).length, 3);
  assert.doesNotMatch(html, /href="\/#floors"/);
});

test("spatial navigation, deep links, and reduced motion are first-class", async () => {
  const [script, css] = await Promise.all([read("assets/home-experience.js"), read("assets/home-experience.css")]);
  assert.match(script, /hashchange/);
  assert.match(script, /parts\[0\] === "investigation"/);
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
