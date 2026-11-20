import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import vm from "node:vm";

const root = new URL("../", import.meta.url);
const read = (path) => readFile(new URL(path, root), "utf8");

const parseFloors = (script) => {
  const start = script.indexOf("  var floors = {");
  const end = script.indexOf("\n\n  var viewEls", start);
  assert.ok(start >= 0 && end > start, "floor data block is present");
  return vm.runInNewContext(`(function () {${script.slice(start, end)}; return floors; }())`);
};

test("homepage exposes the approved experience and independent floors", async () => {
  const html = await read("index.html");
  for (const label of ["Thinking Better Together", "One Hour.", "Real Progress.", "Better Momentum", "Better Decisions", "Better Understanding", "Better Possibilities", "Better AI Results"]) {
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
  assert.match(pricing, /Contact Joe/);
  assert.doesNotMatch(pricing, /checkout|automatic renewal|expiration|refund|guaranteed outcome/i);
  assert.match(services, /href="\/pricing\/">See pricing and prepaid options\.<\/a>/);
  assert.match(config, /"source": "\/pricing", "destination": "\/pricing\/index\.html"/);
});

test("threshold and orientation preserve the approved six-screen narrative", async () => {
  const [html, script, css] = await Promise.all([read("index.html"), read("assets/home-experience.js"), read("assets/home-experience.css")]);
  const approvedCopy = [
    "Disruption Joe's Momentum Sessions",
    "Thinking Better Together",
    "One Hour.",
    "Real Progress.",
    "Your team is capable of more.",
    "I've spent years building startups and leading teams across operations, product, and growth. I've even worked on multi-stakeholder governance issues with billions of dollars at stake.",
    "Across all that work, two skills have consistently allowed me to make the biggest difference:",
    "Finding the conversation that needs to happen.",
    "Making that conversation extraordinarily productive.",
    "I've decided to build my business around mastering these two things, one hour at a time.",
    "A shot of productivity.",
    "Momentum Sessions are designed to help you and your team work smarter and faster, using my proprietary playbook.",
    "Rather than asking you to take my word for it, I offer an introductory rate that starts at $20 and rises over your first four sessions. You only pay my full rate after you've felt the difference working with me makes.",
    "First session",
    "$20",
    "Fifth and beyond",
    "$400",
    "I want to earn the next hour.",
    "A better way to work together.",
    "I built this model to be better for your business and better for my craft.",
    "The difference you'll feel",
    "Meetings that feel like they went nowhere.",
    "You always work with Joe, and Joe does two things exceptionally well.",
    "Would a Momentum Session help your team?",
    "If any of these sound familiar, the answer is probably yes.",
    "We keep meeting about it, and nothing changes.",
    "Felt any of these? You can get started for $20.",
    "Here's how ",
    "Two ways to get started.",
    "You already know what you need.",
    "Let's talk about the conversation you want to have and how I can make it extraordinarily productive.",
    "Schedule a Discovery Call",
    "You're not sure where to start.",
    "Explore common challenges to see what sounds familiar. Add them to your collection, and my website will automatically include them in your message to me.",
    "Explore Common Challenges"
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
  assert.match(orientation, /one hour at a time\.\.\.<\/p>/);

  const threshold = html.match(/<section class="intro-step threshold-view"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.ok(threshold, "threshold section is present");
  assert.doesNotMatch(threshold, /home-action|Enter the Experience/i);
  assert.match(threshold, /<button class="threshold-scroll-cue continuation-button"[^>]*data-intro-next/);
  assert.match(threshold, /One Hour\.<span>Real Progress\.<\/span>/);
  assert.match(css, /@media \(max-width: 620px\)[\s\S]*?\.threshold-sign strong\s*\{[^}]*padding-bottom:\s*\.22em;[^}]*line-height:\s*1;[^}]*filter:\s*none !important/);
  assert.match(html, /href="\/pricing\/">See pricing and prepaid options/);
  assert.equal((orientation.match(/class="orientation-scroll-cue continuation-button"/g) || []).length, 3);
  for (const step of ["1", "2", "3"]) {
    assert.match(orientation, new RegExp(`data-intro-step="${step}"[\\s\\S]*?class="orientation-scroll-cue continuation-button"[\\s\\S]*?Keep scrolling[\\s\\S]*?↓`));
  }
  const qualification = html.match(/<section class="intro-step orientation-chapter orientation-qualification"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.doesNotMatch(qualification, /orientation-scroll-cue|Keep scrolling/);
  assert.match(qualification, /href="#intro\/5"[^>]*>Here's how[\s\S]*?↓/);
  const finalOrientation = html.match(/<section class="intro-step orientation-chapter orientation-invitation"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.doesNotMatch(finalOrientation, /orientation-scroll-cue|Keep scrolling/);
  assert.match(css, /\.orientation-scroll-cue\s*\{[^}]*position:\s*fixed[^}]*bottom:\s*\.75rem[^}]*cursor:\s*pointer[^}]*visibility:\s*hidden/);
  assert.match(css, /\.intro-step\.is-current \.orientation-scroll-cue\s*\{[^}]*visibility:\s*visible/);
  assert.equal((html.match(/data-intro-next/g) || []).length, 4);
  assert.match(script, /introNextButtons\.forEach/);
  assert.match(script, /button\.addEventListener\("click", function \(\) \{ moveIntro\(1\); \}\)/);
  const invitation = html.match(/<section class="intro-step orientation-chapter orientation-invitation"[\s\S]*?<\/section>/)?.[0] ?? "";
  assert.match(invitation, /href="\/contact\/\?sourcePage=%2F&amp;intent=30-Minute%20Discovery%20Call">Schedule a Discovery Call/);
  assert.match(invitation, /href="#investigation" data-home-link>Explore Common Challenges/);
  assert.ok(invitation.indexOf("Schedule a Discovery Call") < invitation.indexOf("Explore Common Challenges"));
});

test("Momentum Session recognition list replaces the old attributed statements", async () => {
  const html = await read("index.html");
  const welcome = html.slice(html.indexOf('<section class="explore-level lobby-level investigation-welcome"'), html.indexOf('<section class="explore-level lobby-level" id="lobby"'));
  const orientation = html.slice(html.indexOf('orientation-qualification'), html.indexOf('data-intro-step="5"'));
  const signals = [
    "We keep meeting about it, and nothing changes.",
    "I know my team has better ideas than the ones we're hearing.",
    "We have plenty of priorities, but it's hard to agree on which one matters most.",
    "We're spending real money on AI, but we're not sure where it's helping.",
    "We know how to set goals. It just takes us way too many meetings to get there."
  ];
  let position = -1;
  for (const statement of signals) {
    const nextPosition = orientation.indexOf(statement, position + 1);
    assert.ok(nextPosition > position, `missing or out-of-sequence recognition signal: ${statement}`);
    position = nextPosition;
  }
  assert.equal((orientation.match(/<li><span aria-hidden="true"><\/span>/g) || []).length, 5);
  assert.doesNotMatch(orientation, /<input|type="checkbox"/);
  assert.doesNotMatch(welcome, /Does any of this sound familiar|buyer-voice|Project Sponsor|Department Leader|AI Initiative Sponsor|Founder|might say|<blockquote|<cite/);
});

test("orientation comparisons remain an accessible carousel", async () => {
  const [html, script, css] = await Promise.all([read("index.html"), read("assets/home-experience.js"), read("assets/home-experience.css")]);
  const carousel = html.slice(html.indexOf('<div class="reaction-experience compare-experience"'), html.indexOf('</section>', html.indexOf('<div class="reaction-experience compare-experience"')));
  assert.equal((html.match(/data-reaction-panel=/g) || []).length, 14);
  assert.equal((html.match(/data-reaction-selector=/g) || []).length, 14);
  assert.equal((carousel.match(/data-reaction-label=/g) || []).length, 14);
  assert.match(html, /role="tablist"/);
  assert.match(html, /role="tabpanel"/);
  assert.match(html, /aria-live="polite"/);
  assert.match(script, /reactionVoiceMap\.addEventListener\("keydown"/);
  assert.match(script, /reactionStage\.addEventListener\("pointerdown"/);
  assert.match(script, /event\.target\.closest\("button, a"\)/);
  assert.match(script, /Math\.abs\(deltaX\) > Math\.abs\(deltaY\)/);
  assert.doesNotMatch(script, /setInterval/);
  assert.match(css, /touch-action:\s*pan-y/);
  assert.match(css, /\.reaction-panels > \[hidden\]\s*\{\s*display:\s*none/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(carousel, /data-reaction-position>01 \/ 14/);
  assert.doesNotMatch(carousel, /Swipe or use arrows|<p>|<i aria-hidden="true"><b>/);
  assert.match(css, /\.compare-side strong\s*\{[^}]*font-size:\s*clamp\(1\.6rem, 3vw, 3\.25rem\)/);
  assert.match(css, /\.reaction-voice-map button\[aria-selected="true"\]\s*\{[^}]*width:\s*1\.35rem/);
  assert.match(script, /getAttribute\("data-reaction-label"\)/);
  assert.match(html, /Every session ends with a clear outcome/);
  assert.match(html, /You always work with Joe, and Joe does two things exceptionally well/);
});

test("orientation stays discrete without a numbered progress rail", async () => {
  const [html, script, css] = await Promise.all([read("index.html"), read("assets/home-experience.js"), read("assets/home-experience.css")]);
  assert.doesNotMatch(html, /intro-progress|data-intro-progress|aria-label="Introduction progress"/);
  assert.doesNotMatch(script, /introProgressLinks|data-intro-progress/);
  assert.doesNotMatch(css, /\.intro-progress/);
  assert.equal((html.match(/data-intro-step=/g) || []).length, 6);
  assert.match(css, /scroll-snap-type:\s*y mandatory/);
});

test("navigation is immersive before Floor Zero and contextual afterward", async () => {
  const [html, script, css] = await Promise.all([read("index.html"), read("assets/home-experience.js"), read("assets/home-experience.css")]);
  assert.doesNotMatch(html, /class="home-header"|class="home-utility"/);
  assert.doesNotMatch(html, /Skip to floors|Explore Floors/);
  assert.match(html, /class="intro-controls"[\s\S]*?Contact Joe[\s\S]*?data-experience-menu-open/);
  assert.equal((html.match(/href="https:\/\/linkedin\.com\/in\/disruptionjoe"/g) || []).length, 2);
  assert.equal((html.match(/aria-label="Visit Disruption Joe on LinkedIn"/g) || []).length, 2);
  assert.match(html, /class="intro-controls"[\s\S]*?Contact Joe[\s\S]*?social-control[\s\S]*?data-experience-menu-open/);
  assert.match(html, /class="experience-controls"[\s\S]*?Contact Joe[\s\S]*?social-control[\s\S]*?data-experience-menu-open/);
  assert.match(html, /class="experience-controls"[^>]*hidden/);
  assert.match(html, /class="experience-control saved-control"[\s\S]*?View Collection[\s\S]*?data-collection-count hidden/);
  assert.match(html, /data-experience-menu[\s\S]*?<nav[^>]*>[\s\S]*?Explore Challenges[\s\S]*?How I Can Help[\s\S]*?Pricing[\s\S]*?Facilitation Playbook[\s\S]*?AI Activation Playbook[\s\S]*?About Joe[\s\S]*?Thinking Museum[\s\S]*?<\/nav>[\s\S]*?experience-menu-contact[\s\S]*?Contact Joe/);
  const menuNav = html.match(/<nav aria-label="Primary destinations">[\s\S]*?<\/nav>/)?.[0] ?? "";
  assert.ok(menuNav, "primary destination list is present");
  assert.equal((menuNav.match(/<a /g) || []).length, 7);
  assert.match(html, /href="\/services\/"/);
  assert.match(html, /href="\/about\/"/);
  assert.match(script, /experienceControls\.hidden = name === "intro"/);
  assert.match(script, /element\.hidden = count === 0/);
  assert.match(script, /collectionOpenButtons\.forEach/);
  assert.match(script, /window\.history\.pushState\(null, "", "#collection"\)/);
  assert.match(script, /experienceMenu\.showModal\(\)/);
  assert.match(script, /experienceMenuOpenButtons\.forEach/);
  assert.match(script, /experienceMenu\.addEventListener\("cancel"/);
  assert.match(script, /parts\[0\] === "about-joe" \|\| parts\[0\] === "meet-joe"/);
  assert.match(css, /\.intro-controls\s*\{[^}]*position:\s*fixed/);
  assert.match(css, /\.experience-controls\s*\{[^}]*position:\s*fixed/);
  assert.match(css, /\.social-control\s*\{[^}]*width:\s*2\.85rem/);
  assert.match(css, /\.experience-menu nav \.experience-menu-feature/);
  assert.match(css, /\.experience-menu-contact\s*\{/);
  assert.match(css, /\.experience-menu::backdrop/);
});

test("active commercial pages share the compact header and approved eight-destination menu", async () => {
  const paths = ["services/index.html", "about/index.html", "pricing/index.html", "contact/index.html", "privacy/index.html", "playbook/index.html"];
  const pages = await Promise.all(paths.map(read));
  const approved = ["Explore Challenges", "How I Can Help", "Pricing", "Facilitation Playbook", "AI Activation Playbook", "About Joe", "Thinking Museum", "Contact Joe"];
  pages.forEach((html, index) => {
    assert.match(html, /<nav class="site-nav commercial-nav"/);
    assert.match(html, /<a class="brand" href="\/" aria-label="Return to the beginning of the Disruption Joe homepage"/);
    assert.match(html, /<div class="nav-actions"><a class="nav-contact"[^>]*>Contact Joe<\/a><button class="nav-toggle"[^>]*aria-controls="site-nav-menu"[^>]*><span aria-hidden="true">☰<\/span><\/button><\/div>/);
    const menu = html.match(/<div class="nav-menu"[^>]*>[\s\S]*?<\/div>/)?.[0] ?? "";
    assert.ok(menu, `${paths[index]} navigation is present`);
    let position = -1;
    approved.forEach((label) => {
      const next = menu.indexOf(label, position + 1);
      assert.ok(next > position, `missing or out-of-order navigation destination: ${label}`);
      position = next;
    });
    assert.equal((menu.match(/class="nav-link/g) || []).length, 8);
    assert.doesNotMatch(menu, />Services<|>Method<|AI Enablement Architecture|Planning Call/);
    assert.match(html, /<footer class="footer">[\s\S]*?<div class="footer-nav">[\s\S]*?Explore Challenges[\s\S]*?How I Can Help[\s\S]*?Pricing[\s\S]*?About Joe[\s\S]*?Thinking Museum[\s\S]*?Contact Joe[\s\S]*?Privacy/);
  });

  const [homepage, homeCss, siteCss, siteScript, method, museumExperience] = await Promise.all([
    read("index.html"), read("assets/home-experience.css"), read("assets/site.css"), read("assets/site.js"), read("method/index.html"), read("thinking/experience/index.html")
  ]);
  assert.match(homepage, /class="home-start-control" href="#threshold" data-home-link/);
  assert.equal((homepage.match(/class="experience-control contact-control"/g) || []).length, 2);
  assert.equal((homepage.match(/data-experience-menu-open/g) || []).length, 2);
  assert.match(homeCss, /\.home-start-control\s*\{[^}]*position:\s*fixed[^}]*left:/);
  assert.match(siteCss, /\.commercial-nav \.nav-actions/);
  assert.match(siteCss, /\.commercial-nav \.nav-menu\s*\{[^}]*position:\s*absolute[^}]*display:\s*none/);
  assert.match(siteCss, /\.commercial-nav\.is-open \.nav-menu\s*\{[^}]*display:\s*grid/);
  assert.match(siteScript, /nav\.classList\.contains\("commercial-nav"\)/);
  assert.doesNotMatch(method, /class="site-nav commercial-nav"/);
  assert.doesNotMatch(museumExperience, /class="site-nav commercial-nav"/);
});

test("About Joe preserves its story and adds authentic repository photography and contextual next steps", async () => {
  const about = await read("about/index.html");
  assert.match(about, /<figure class="about-story-portrait"><img src="\/assets\/joe-headshot\.jpg" alt="Joe Hernandez, Disruption Joe" width="768" height="1024"><\/figure>/);
  for (const heading of ["About Joe", "The experience that changed how I think.", "Different problems. The same underlying process.", "Building a life around what I love."]) {
    assert.match(about, new RegExp(heading.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  }
  assert.match(about, /aria-label="Continue exploring"[\s\S]*?See how I can help[\s\S]*?Visit the Thinking Museum/);
  assert.doesNotMatch(about, /<img[^>]+(?:stock|generated|placeholder)/i);
});

test("About Joe lives on its dedicated page and former homepage deep links redirect", async () => {
  const [html, script] = await Promise.all([read("index.html"), read("assets/home-experience.js")]);
  assert.doesNotMatch(html, /id="about-joe"|id="meet-joe"|class="meet-view"/);
  assert.match(script, /parts\[0\] === "about-joe" \|\| parts\[0\] === "meet-joe"/);
  assert.match(script, /window\.location\.replace\("\/about\/"\)/);
  assert.match(html, /href="\/about\/">Learn more about Joe<\/a>/);
});

test("Challenge Investigation welcome leads to the separate elevator lobby", async () => {
  const html = await read("index.html");
  assert.match(html, /id="investigation"[^>]*data-explore-level="investigation"/);
  for (const instruction of ["Welcome to the Challenge Investigation.", "We all run into challenges that get in the way of what we're trying to accomplish.", "I've collected 31 common challenges across five organizational outcomes for you to explore.", "Explore the challenges.", "Add to your collection.", "Add to Collection", "Send them to Joe.", "Begin Investigation"]) {
    assert.match(html, new RegExp(instruction));
  }
  assert.match(html, /class="home-action primary investigation-begin" href="#lobby"/);
  assert.match(html, /id="lobby"[^>]*data-explore-level="lobby"/);
  assert.ok(html.indexOf('id="investigation"') < html.indexOf('id="lobby"'), "welcome precedes the elevator lobby");
  assert.doesNotMatch(html.slice(html.indexOf('id="investigation"'), html.indexOf('id="lobby"')), /Does any of this sound familiar|buyer-voice/);
  for (const instruction of ["Swipe up and down", "Scroll up and down", "Swipe left and right", "Scroll horizontally or use the arrows", "Add to your collection", "Send it to Joe"]) {
    assert.match(html, new RegExp(instruction));
  }
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

test("homepage presents Better AI Results without the superseded stage labels", async () => {
  const home = await read("assets/home-experience.js");
  const museum = await read("assets/thinking-game.js");
  assert.equal((home.match(/^\s+\{ id:/gm) || []).length, 31);
  for (const copy of [
    "Better AI Results",
    "You're already moving on AI. The question is how to move faster, with a better chance it pays off.",
    "We don't have a plan yet.",
    "Results depend on the person.",
    "What works doesn't spread.",
    "Our AI spending lacks direction.",
    "Top performers are hitting limits."
  ]) assert.match(home, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")));
  for (const stage of ["Identify the Floor", "Establish the Floor", "Raise the Floor", "Lead the Change", "Push the Frontier"]) {
    assert.doesNotMatch(home, new RegExp(stage));
    assert.match(museum, new RegExp(stage));
  }
});

test("all 31 rooms use the approved static feeling and dynamic Play placards", async () => {
  const [html, script] = await Promise.all([read("index.html"), read("assets/home-experience.js")]);
  const floors = parseFloors(script);
  const rooms = Object.values(floors).flatMap((floor) => floor.exhibits);
  const expectedIdentity = [
    ["projects-keep-stalling", "Projects keep stalling."],
    ["people-arent-on-board", "People aren't getting on board."],
    ["busy-limited-progress", "Everyone is busy. Progress is limited."],
    ["changes-arent-sticking", "Changes aren't sticking."],
    ["project-started-before-alignment", "The project started before the team aligned."],
    ["choose-a-direction", "Several directions look promising."],
    ["everything-is-priority", "Everything is a priority."],
    ["difficult-tradeoffs", "The tradeoffs are real and uncomfortable."],
    ["allocate-resources", "Resources and ambition don't match."],
    ["goal-setting-too-many-meetings", "Goal-setting takes too many meetings."],
    ["leadership-different-targets", "Leadership is aiming at different targets."],
    ["information-no-picture", "We have information, but no shared picture."],
    ["competing-explanations", "Everyone has a different explanation."],
    ["why-isnt-it-working", "Something important isn't working."],
    ["conditions-changing", "The conditions keep changing."],
    ["could-have-done-better", "We know we could have done that better."],
    ["project-risks-in-everyones-head", "Project risks live in everyone's head."],
    ["reorg-confusion-remains", "The reorg is over. The confusion isn't."],
    ["team-feels-off", "The team feels off, but nobody says why."],
    ["same-ideas", "We keep circling the same ideas."],
    ["challenge-direction", "A promising direction needs to be challenged."],
    ["need-alternatives", "We need real alternatives, not variations."],
    ["opportunity-not-concrete", "The opportunity is exciting but not concrete."],
    ["offsite-moves-us-forward", "We want an offsite that actually moves us forward."],
    ["nobody-trusts-roadmap", "Nobody trusts the roadmap."],
    ["identify-the-floor", "We don't have a plan yet."],
    ["establish-the-floor", "Results depend on the person."],
    ["raise-the-floor", "What works doesn't spread."],
    ["lead-the-change", "Our AI spending lacks direction."],
    ["push-the-frontier", "Top performers are hitting limits."],
    ["ai-experiments-no-strategy", "Our AI experiments don't add up to a strategy."]
  ];
  assert.deepEqual(rooms.map(({ id, title }) => [id, title]), expectedIdentity);
  assert.deepEqual(Object.values(floors).map((floor) => floor.exhibits.length), [5, 6, 8, 6, 6]);
  assert.equal(new Set(rooms.map(({ id }) => id)).size, 31);

  const requiredFields = ["id", "title", "feeling", "scenes", "insight", "play", "inHour", "outcome"];
  rooms.forEach((room) => {
    assert.deepEqual(Object.keys(room), requiredFields, `${room.id} has only the placard fields`);
    requiredFields.forEach((field) => assert.equal(typeof room[field], "string", `${room.id}.${field} is text`));
    assert.match(room.scenes, /^Picture an? .+ Or an? .+/);
  });

  const playCounts = rooms.reduce((counts, room) => ({ ...counts, [room.play]: (counts[room.play] || 0) + 1 }), {});
  assert.deepEqual(playCounts, {
    "Find the Real Problem": 3,
    "Build Alignment with Buy-In": 1,
    "Prioritize the Backlog": 3,
    "Make a Tough Decision": 2,
    "Develop Shared Understanding": 1,
    "The Problem Framing Session": 1,
    "Plan for Uncertainty": 2,
    "The Opportunity Map": 2,
    "The Assumption Test": 1,
    "AI: Where Do We Start?": 1,
    "AI: Increasing Capability": 3,
    "AI: Measuring Results": 1,
    "Kick Off the Project": 1,
    "Team OKR Setting": 1,
    "Leadership Goal Setting": 1,
    "Blameless Retrospective": 1,
    "The RAID Review": 1,
    "Reset After Change": 1,
    "Team Health Check": 1,
    "Run a Better Offsite": 1,
    "Build the Roadmap": 1,
    "AI: Define Our Strategy": 1
  });
  assert.ok(Math.max(...Object.values(playCounts)) <= 3);

  const approvedFeelings = [
    "It's the update meeting where everyone says \"making progress,\" and you all know it isn't true.",
    "The announcement went out. The nods were polite. Nothing changed.",
    "The calendars are full. The work that matters isn't moving.",
    "Everyone agreed to the new way. Six weeks later, it's back to the old way.",
    "Every option has a good story. You can only pick one.",
    "Every initiative has a sponsor. You can't do them all well.",
    "There's no answer where everybody wins.",
    "Something has to give. Nobody wants to say what.",
    "Plenty of reports. Everyone still tells a different story.",
    "Five people, five confident theories, one problem that won't go away.",
    "You can see the symptom. You can't see where to fix it.",
    "You can't wait for certainty, and you can't keep guessing.",
    "Everyone's excited. That's exactly why it needs a hard look.",
    "\"This could be huge.\" But for who, and how?",
    "There's plenty of energy and no shared starting point.",
    "We're investing, but we can't connect the dollars to outcomes.",
    "Our experts are ahead of the organization, and the organization is slowing them down."
  ];
  approvedFeelings.forEach((feeling) => assert.ok(rooms.some((room) => room.feeling === feeling), `approved feeling preserved: ${feeling}`));

  const newPlacards = Object.fromEntries(rooms.filter((room) => ["same-ideas", "need-alternatives", "establish-the-floor", "raise-the-floor"].includes(room.id)).map((room) => [room.id, room]));
  assert.equal(newPlacards["same-ideas"].play, "The Opportunity Map");
  assert.equal(newPlacards["need-alternatives"].play, "Plan for Uncertainty");
  assert.equal(newPlacards["establish-the-floor"].play, "AI: Increasing Capability");
  assert.equal(newPlacards["raise-the-floor"].play, "AI: Increasing Capability");
  assert.equal(newPlacards["establish-the-floor"].feeling, "Some people get great results. Others don't. Nobody can say why.");
  assert.equal(newPlacards["raise-the-floor"].feeling, "The wins are real, but they're stuck in pockets of the organization.");

  const expansionIds = [
    "project-started-before-alignment", "goal-setting-too-many-meetings", "leadership-different-targets",
    "could-have-done-better", "project-risks-in-everyones-head", "reorg-confusion-remains", "team-feels-off",
    "offsite-moves-us-forward", "nobody-trusts-roadmap", "ai-experiments-no-strategy"
  ];
  const expansion = rooms.filter((room) => expansionIds.includes(room.id));
  assert.equal(expansion.length, 10);
  expansion.forEach((room) => {
    const dynamicWords = [room.scenes, room.insight, room.play, room.inHour, room.outcome].join(" ").trim().split(/\s+/).length;
    assert.ok(dynamicWords <= 110, `${room.id} dynamic placard stays under 110 words`);
  });
  assert.equal(rooms.find((room) => room.id === "could-have-done-better").scenes.startsWith("Picture a startup"), true);
  assert.equal(rooms.find((room) => room.id === "offsite-moves-us-forward").play, "Run a Better Offsite");

  assert.doesNotMatch(script, /\bsituation:\s|\bexpanded:\s|\bstage:\s/);
  assert.doesNotMatch(rooms.map((room) => Object.values(room).join(" ")).join(" "), /—/);
  assert.match(html, /data-dialog-scenes/);
  assert.doesNotMatch(html + script, /data-dialog-situation/);
  const renderFloors = script.slice(script.indexOf("function renderFloors"), script.indexOf("renderFloors();"));
  assert.match(renderFloors, /exhibit\.feeling/);
  assert.doesNotMatch(renderFloors, /exhibit\.play|playLead/);
  const renderDialog = script.slice(script.indexOf("function renderDialog"), script.indexOf("function openExhibitDialog"));
  const order = ["exhibit.scenes", "exhibit.insight", "playLead(exhibit.play)", "exhibit.inHour", "exhibit.outcome"].map((token) => renderDialog.indexOf(token));
  assert.ok(order.every((position, index) => position >= 0 && (index === 0 || position > order[index - 1])), "dynamic placard fields render in approved order");
  assert.match(renderDialog, /<strong>You leave with:<\/strong>/);
});

test("collection is contextual, removable, and non-diagnostic", async () => {
  const [html, script] = await Promise.all([read("index.html"), read("assets/home-experience.js")]);
  assert.match(script, /localStorage/);
  assert.match(script, /djc-saved-challenge-labels-v1/);
  assert.match(script, /data-remove-id/);
  assert.match(script, /params\.append\("challenge"/);
  for (const label of ["Add to Collection", "Remove from Collection", "View Collection", "Send Joe a Message"]) {
    assert.match(html + script, new RegExp(label));
  }
  assert.doesNotMatch(html + script, /Save this challenge|Remove from saved|Talk with Joe without a collection|Talk with Joe about these/);
  assert.match(html, /not an automated diagnosis/i);
  assert.doesNotMatch(script, /scoreChallenge|recommendationEngine|diagnos(e|is)Challenge/);
});

test("contact accepts direct inquiries and saved challenge context", async () => {
  const [html, client, endpoint] = await Promise.all([read("contact/index.html"), read("assets/site.js"), read("api/contact.js")]);
  assert.match(html, /name="name"[^>]*required/);
  assert.match(html, /name="email"[^>]*required/);
  assert.match(html, /name="role"/);
  assert.match(html, /name="schedulingLink"[^>]*type="url"[^>]*maxlength="500"/);
  assert.match(html, /Your scheduling link[\s\S]*?https:\/\/calendly\.com\/your-name/);
  assert.match(html, /If you have a Calendly, Google Calendar, or other scheduling link/);
  assert.match(html, /type="submit">Send Message<\/button>/);
  assert.match(html, /data-contact-challenges-field/);
  assert.match(client, /getAll\("challenge"\)/);
  assert.match(client, /djc-saved-challenge-labels-v1/);
  assert.match(client, /schedulingLink: data\.get\("schedulingLink"\)/);
  assert.match(endpoint, /challenges: 4000/);
  assert.match(endpoint, /schedulingLink: 500/);
  assert.match(endpoint, /isValidSchedulingUrl/);
  assert.match(endpoint, /Scheduling link:/);
  assert.match(endpoint, /Role:/);
  assert.equal((html.match(/href="\/#lobby"/g) || []).length, 4);
  assert.doesNotMatch(html, /href="\/#floors"/);
});

test("spatial navigation, deep links, and reduced motion are first-class", async () => {
  const [html, script, css] = await Promise.all([read("index.html"), read("assets/home-experience.js"), read("assets/home-experience.css")]);
  assert.match(script, /hashchange/);
  assert.match(script, /parts\[0\] === "investigation"/);
  assert.match(script, /parts\[0\] === "lobby"/);
  assert.match(script, /parts\[0\] === "floor"/);
  for (const key of ["ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"]) assert.match(script, new RegExp(key));
  assert.match(script, /addEventListener\("wheel"/);
  assert.match(script, /data-room-track/);
  assert.match(script, /data-explore-level/);
  assert.match(css, /scroll-snap-type:\s*y mandatory/);
  assert.match(css, /scroll-snap-type:\s*x mandatory/);
  assert.match(css, /scroll-snap-stop:\s*always/);
  assert.match(css, /prefers-reduced-motion: reduce/);
  assert.match(script, /navigator\.userActivation\.isActive/);
  assert.match(script, /introSettleTimer/);
  assert.match(script, /exploreSettleTimer/);
  assert.match(script, /holdIntroTarget/);
  assert.match(script, /holdExploreTarget/);
  assert.match(script, /introMotionTarget !== null \? introMotionTarget/);
  assert.match(script, /exploreMotionTarget !== null \? exploreMotionTarget/);
  assert.match(script, /currentStep\.scrollHeight > introSequence\.clientHeight \+ 24/);
  assert.match(script, /exploreStack\.addEventListener\("wheel"/);
  assert.match(script, /moveFloor\(event\.deltaY > 0 \? 1 : -1\)/);
  assert.match(css, /@media \(max-width: 620px\) and \(max-height: 680px\)[\s\S]*?\.intro-sequence\s*\{\s*scroll-snap-type:\s*y proximity/);
  assert.doesNotMatch(css, /@media \(max-height: 680px\)\s*\{\s*\.intro-sequence\s*\{\s*scroll-snap-type:\s*y proximity/);
  assert.match(html, /class="home-action primary investigation-begin" href="#lobby" data-explore-next="lobby"/);
  assert.match(html, /class="explore-motion-hint continuation-button" href="#floor\/momentum" data-explore-next="momentum"/);
  assert.match(script, /exploreNextButtons\.forEach/);
  assert.match(script, /scrollExploreTo\(target, null, true\)/);
});

test("vertical floor travel returns to the elevator and drives its doors", async () => {
  const [script, css, museum] = await Promise.all([read("assets/home-experience.js"), read("assets/home-experience.css"), read("assets/thinking-game.js")]);
  assert.match(script, /function updateVerticalDoorOpening\(\)/);
  assert.match(script, /Math\.abs\(\(distance \* 2\) - 1\)/);
  assert.match(script, /setRoom\(resolved, 0, false\)/);
  assert.match(script, /trackStates\[resolved\]\.track\.scrollTo\(\{ left: 0, behavior: "auto" \}\)/);
  assert.match(css, /--elevator-left-shift/);
  assert.match(css, /--elevator-right-shift/);
  assert.match(css, /\.floor-landing-copy\s*\{[^}]*z-index:\s*auto/);
  assert.match(css, /\.floor-landing-copy > \*\s*\{[^}]*z-index:\s*5/);
  assert.doesNotMatch(css, /floor-level\.is-current \.floor-landing\.is-current \.elevator-depth/);
  assert.match(museum, /function updateVerticalDoorOpening\(\)/);
});

test("open challenge placards support room and floor navigation", async () => {
  const [script, css] = await Promise.all([read("assets/home-experience.js"), read("assets/home-experience.css")]);
  assert.match(script, /function moveOpenExhibitRoom\(direction\)/);
  assert.match(script, /function moveOpenExhibitFloor\(direction\)/);
  assert.match(script, /function refreshOpenExhibit\(resetScroll\)/);
  assert.match(script, /exhibitDialog\.addEventListener\("touchstart"/);
  assert.match(script, /exhibitDialog\.addEventListener\("touchmove"/);
  assert.match(script, /exhibitDialog\.addEventListener\("touchend"/);
  assert.match(script, /start\.atBottom\) moveOpenExhibitFloor\(1\)/);
  assert.match(script, /start\.atTop\) moveOpenExhibitFloor\(-1\)/);
  assert.match(script, /exhibitDialog\.addEventListener\("wheel"/);
  assert.match(script, /event\.key === "ArrowRight"[\s\S]*?moveOpenExhibitRoom\(1\)/);
  assert.match(script, /event\.key === "ArrowDown"[\s\S]*?moveOpenExhibitFloor\(1\)/);
  assert.match(css, /\.home-dialog\s*\{[^}]*overscroll-behavior:\s*contain/);
});


// Execute the contact initializer against a small DOM surface. These assertions
// cover actual click handlers, URL updates, and persisted collection state.
class ContactElement {
  constructor(tag = "div") {
    this.tagName = tag;
    this.children = [];
    this.events = {};
    this.value = "";
  }
  set innerHTML(value) { this.html = value; this.children = []; }
  get innerHTML() { return this.html; }
  setAttribute() {}
  appendChild(child) { this.children.push(child); }
  addEventListener(name, handler) { this.events[name] = handler; }
}

async function contactHarness({ url = "https://disruptionjoe.com/contact/", stored = new Map(), storageBlocked = false } = {}) {
  const source = await read("assets/site.js");
  const start = source.indexOf("  function initContactForm() {");
  const end = source.indexOf("\n  ready(function () {", start);
  const elements = new Map();
  const form = new ContactElement("form");
  form.querySelector = (selector) => {
    if (!elements.has(selector)) elements.set(selector, new ContactElement());
    return elements.get(selector);
  };
  const window = {
    location: new URL(url),
    history: {
      state: { contact: true },
      replaceState(state, title, nextUrl) { window.location = new URL(nextUrl, window.location); }
    },
    localStorage: {
      getItem(key) { if (storageBlocked) throw new Error("Blocked storage"); return stored.get(key) ?? null; },
      setItem(key, value) { if (storageBlocked) throw new Error("Blocked storage"); stored.set(key, value); }
    }
  };
  const context = vm.createContext({
    URL, URLSearchParams, window,
    document: { querySelector: () => form, createElement: (tag) => new ContactElement(tag) }
  });
  vm.runInContext(source.slice(start, end) + "\ninitContactForm();", context);
  return {
    window, stored,
    field: elements.get("[data-contact-challenges-field]"),
    remove(index) { elements.get("[data-contact-challenges]").children[index].children[1].events.click(); }
  };
}

const savedLabelsKey = "djc-saved-challenge-labels-v1";
const savedIdsKey = "djc-saved-challenges-v1";
const challengeLabels = ["Projects keep stalling.", "Everything is a priority."];
const challengeIds = ["projects-keep-stalling", "everything-is-priority"];
function savedCollection() {
  return new Map([[savedLabelsKey, JSON.stringify(challengeLabels)], [savedIdsKey, JSON.stringify(challengeIds)]]);
}

test("contact removal persists through reload and updates homepage collection IDs", async () => {
  const params = new URLSearchParams({ intent: "Discovery call", sourcePage: "/", message: "Keep this context" });
  challengeLabels.forEach((label) => params.append("challenge", label));
  const page = await contactHarness({ url: "https://disruptionjoe.com/contact/?" + params + "#details", stored: savedCollection() });
  page.remove(0);
  assert.equal(page.field.value, challengeLabels[1]);
  assert.deepEqual(JSON.parse(page.stored.get(savedIdsKey)), [challengeIds[1]]);
  assert.deepEqual(JSON.parse(page.stored.get(savedLabelsKey)), [challengeLabels[1]]);
  assert.deepEqual(page.window.location.searchParams.getAll("challenge"), [challengeLabels[1]]);
  for (const key of ["intent", "sourcePage", "message"]) assert.equal(page.window.location.searchParams.get(key), params.get(key));
  assert.equal(page.window.location.hash, "#details");
  const reloaded = await contactHarness({ url: page.window.location.href, stored: page.stored });
  assert.equal(reloaded.field.value, challengeLabels[1]);
  reloaded.remove(0);
  assert.deepEqual(JSON.parse(page.stored.get(savedIdsKey)), []);
  assert.deepEqual(JSON.parse(page.stored.get(savedLabelsKey)), []);
  assert.equal((await contactHarness({ url: reloaded.window.location.href, stored: page.stored })).field.value, "");
});

test("direct-contact removal persists and query subsets preserve other saved challenges", async () => {
  const direct = await contactHarness({ stored: savedCollection() });
  assert.equal(direct.field.value, challengeLabels.join("\n"));
  direct.remove(1);
  assert.equal((await contactHarness({ stored: direct.stored })).field.value, challengeLabels[0]);

  const subset = await contactHarness({ url: "https://disruptionjoe.com/contact/?challenge=" + encodeURIComponent(challengeLabels[0]), stored: savedCollection() });
  subset.remove(0);
  assert.deepEqual(JSON.parse(subset.stored.get(savedIdsKey)), [challengeIds[1]]);
  assert.equal(subset.window.location.searchParams.has("challenge"), true);
  assert.equal((await contactHarness({ url: subset.window.location.href, stored: subset.stored })).field.value, "");
  assert.equal((await contactHarness({ stored: subset.stored })).field.value, challengeLabels[1]);
});

test("contact removal survives reload without browser storage", async () => {
  const page = await contactHarness({ url: "https://disruptionjoe.com/contact/?challenge=" + encodeURIComponent(challengeLabels[0]), storageBlocked: true });
  page.remove(0);
  assert.equal((await contactHarness({ url: page.window.location.href, storageBlocked: true })).field.value, "");
});

test("homepage initialization preserves incoming lobby and room deep links", async () => {
  const source = await read("assets/home-experience.js");
  const stateDeclaration = source.match(/  var state = .*;/)[0];
  const setIntroStep = source.slice(source.indexOf("  function setIntroStep("), source.indexOf("  function scrollIntroTo("));
  const startup = source.slice(source.lastIndexOf("\n  updateSavedButtons();"), source.lastIndexOf("})();"));
  for (const hash of ["#lobby", "#investigation", "#floor/momentum/projects-keep-stalling", "#collection", "#intro/2"]) {
    const window = { location: { hash } };
    const context = vm.createContext({
      window, document: { body: { dataset: {} } },
      introSteps: [{ classList: { toggle() {} }, setAttribute() {} }],
      replaceHash(next) { window.location.hash = next; },
      updateSavedButtons() {}, renderCollection() {}, setReaction() {}, setExploreLevel() {}, updateVerticalDoorOpening() {},
      route() { assert.equal(window.location.hash, hash); }
    });
    vm.runInContext(stateDeclaration + "\n" + setIntroStep + "\n" + startup, context);
  }
});


test("contact removal reconciles obsolete IDs without losing unrelated saved challenges", async () => {
  const stored = savedCollection();
  stored.set(savedIdsKey, JSON.stringify(["retired-challenge", ...challengeIds]));
  const contact = await contactHarness({ stored });
  contact.remove(0);
  const source = await read("assets/home-experience.js");
  const readSaved = source.slice(source.indexOf("  function readSaved() {"), source.indexOf("  function writeSaved("));
  const context = vm.createContext({
    STORAGE_KEY: savedIdsKey,
    window: contact.window,
    findExhibit(id) {
      const index = challengeIds.indexOf(id);
      return index < 0 ? null : { exhibit: { title: challengeLabels[index] } };
    }
  });
  vm.runInContext(readSaved, context);
  assert.deepEqual(Array.from(context.readSaved()), [challengeIds[1]]);
});


test("an explicit homepage add restores a challenge removed from contact", async () => {
  const contact = await contactHarness({ stored: savedCollection() });
  contact.remove(0);
  const source = await read("assets/home-experience.js");
  const storageFunctions = source.slice(source.indexOf("  function readSaved() {"), source.indexOf("  function announce("));
  const context = vm.createContext({
    STORAGE_KEY: savedIdsKey, window: contact.window,
    updateSavedButtons() {}, renderCollection() {},
    findExhibit(id) {
      const index = challengeIds.indexOf(id);
      return index < 0 ? null : { exhibit: { title: challengeLabels[index] } };
    }
  });
  vm.runInContext(storageFunctions, context);
  context.writeSaved([...context.readSaved(), challengeIds[0]]);
  assert.deepEqual(Array.from(context.readSaved()), [challengeIds[1], challengeIds[0]]);
  assert.deepEqual(JSON.parse(contact.stored.get("djc-removed-challenge-labels-v1")), []);
});
