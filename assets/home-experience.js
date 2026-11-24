(function () {
  "use strict";

  var STORAGE_KEY = "djc-saved-challenges-v1";
  var floorOrder = ["momentum", "decisions", "understanding", "possibilities", "ai"];
  var exploreOrder = ["lobby"].concat(floorOrder, ["basement"]);
  var floors = {
    momentum: {
      number: "01", title: "Better Momentum",
      intro: "Recognize what is slowing important work down, then create a conversation that can get it moving again.",
      exhibits: [
        { id: "projects-keep-stalling", title: "Projects keep stalling.", feeling: "It's the update meeting where everyone says \"making progress,\" and you all know it isn't true.", scenes: "Picture a hospital rolling out a new intake system that's been \"two weeks out\" since spring. Or a software company whose pricing update has had an owner, a deck and a standing meeting for a quarter.", insight: "Nobody's lazy and nobody's against it. It just doesn't move.", play: "Find the Real Problem", inHour: "Instead of another status update, everyone names where the work actually gets stuck. The answers rarely match, and that's where the real problem shows up.", outcome: "a shared map of what's in the way, and agreement on where to push first." },
        { id: "people-arent-on-board", title: "People aren't getting on board.", feeling: "The announcement went out. The nods were polite. Nothing changed.", scenes: "Picture a regional bank rolling out a new sales process that branch managers quietly work around. Or a university whose new strategic plan gets a standing ovation, then sits in a drawer.", insight: "The resistance usually isn't stubbornness. Someone sees a risk, a cost or a missing piece that nobody asked about.", play: "Build Alignment with Buy-In", inHour: "Each group quietly writes what it needs and what success looks like to them. We compare that with what everyone assumed about each other. The gaps are usually where the real work is.", outcome: "clearer agreements, real commitments, and the open concerns written down instead of whispered in the hallway." },
        { id: "busy-limited-progress", title: "Everyone is busy. Progress is limited.", feeling: "The calendars are full. The work that matters isn't moving.", scenes: "Picture a marketing team running twelve campaigns and hitting none of its goals. Or a nonprofit staff that's working weekends and still can't get to the grant that would change next year.", insight: "Activity isn't progress. When everything stays on the list, the important work competes with everything else.", play: "Prioritize the Backlog", inHour: "We sort the work into must-do, choosable and already dead. Everyone helps define what makes something worth doing now, then scores the choices quietly, so the loudest voice doesn't set the order.", outcome: "a ranked list of priorities, and an honest account of what you're choosing not to do." },
        { id: "changes-arent-sticking", title: "Changes aren't sticking.", feeling: "Everyone agreed to the new way. Six weeks later, it's back to the old way.", scenes: "Picture a logistics company whose new scheduling process lasted until the first busy week. Or a clinic whose new handoff checklist quietly stopped getting used.", insight: "The new way may look fine on paper. The real question is what happens when people actually try to follow it.", play: "Find the Real Problem", inHour: "The people doing the work map exactly where the new way gets hard or breaks down. We find the overlaps and check which explanations hold up to evidence.", outcome: "a shared map of where the change breaks, and the first fix that gives it a real chance to hold." },
        { id: "project-started-before-alignment", title: "The project started before the team aligned.", feeling: "The work is underway. The team still isn't working from the same definition of success.", scenes: "Picture a software company building a new customer portal before product, sales and support agree on what it needs to do. Or a government agency launching a public program while each department is working from a different scope.", insight: "A kickoff doesn't need more slides. It needs one shared starting point.", play: "Kick Off the Project", inHour: "Everyone starts with what will be true if the project works, then shapes one goal, success signals and a clear in, out and not-yet scope. We map who contributes and decides, name the top risks and assemble the answers into one project poster.", outcome: "a project poster covering the goal, scope, owners and risks." }
      ]
    },
    decisions: {
      number: "02", title: "Better Decisions",
      intro: "Give consequential choices the information, participation, and decision structure they deserve.",
      exhibits: [
        { id: "choose-a-direction", title: "Several directions look promising.", feeling: "Every option has a good story. You can only pick one.", scenes: "Picture a software company debating whether to go upmarket, go international or double down on its core. Or a school district choosing between three good ideas with funding for one.", insight: "The options aren't the hard part. The hard part is that nobody agreed how to judge them before the debate started.", play: "Make a Tough Decision", inHour: "We agree on the criteria before anyone pitches. Each option goes up side by side, everyone scores quietly, and the person who owns the decision makes the call with the tradeoffs in plain view.", outcome: "a decision, or a clear recommendation with the risks and dissent written down." },
        { id: "everything-is-priority", title: "Everything is a priority.", feeling: "Every initiative has a sponsor. You can't do them all well.", scenes: "Picture a leadership team with fourteen \"top priorities.\" Or a hospital IT group where every department's request is marked urgent.", insight: "Every one of them has a good reason to exist. That doesn't mean they all deserve attention right now.", play: "Prioritize the Backlog", inHour: "We separate what's truly required from what's actually a choice. The room agrees on the three things that matter most, scores the options quietly, and names what it costs to move each one down before anyone draws the line.", outcome: "a ranked list everyone can see, and the tradeoffs out in the open instead of buried." },
        { id: "difficult-tradeoffs", title: "The tradeoffs are real and uncomfortable.", feeling: "There's no answer where everybody wins.", scenes: "Picture a city deciding which neighborhoods get road repairs first. Or a family business choosing between keeping a long-time supplier and staying competitive.", insight: "People understand the options just fine. They also understand who pays for each one.", play: "Make a Tough Decision", inHour: "We set the criteria before comparing options, and everyone scores quietly so rank doesn't decide the first answer. Where the room splits, each side gets short, timed turns to be heard. Then the decision owner calls it.", outcome: "a decision people can respect, even the ones who disagreed, with their dissent on the record." },
        { id: "allocate-resources", title: "Resources and ambition don't match.", feeling: "Something has to give. Nobody wants to say what.", scenes: "Picture a nonprofit whose board approved five new programs and no new staff. Or a manufacturer whose growth plan needs engineers it doesn't have.", insight: "Every current commitment has a reason to stay. The hard part is deciding what deserves scarce time and money now.", play: "Prioritize the Backlog", inHour: "We sort the work into must-do, choosable and already dead. The group ranks what matters, scores the commitments quietly, and puts the cost of each cut on the table before the decision owner confirms the order.", outcome: "a clear plan for where your limited people and money go, and what waits." },
        { id: "goal-setting-too-many-meetings", title: "Goal-setting takes too many meetings.", feeling: "You've spent weeks wordsmithing goals, and the team still doesn't know what to aim for.", scenes: "Picture a healthcare network whose operations team has met four times without agreeing on next-quarter goals. Or a professional services firm where every OKR draft gets longer and less useful.", insight: "The problem isn't ideas. It's trying to write objectives before the room agrees what success looks like.", play: "Team OKR Setting", inHour: "Everyone quietly writes what success looks like at quarter's end. We cluster those answers into candidate objectives, choose two or three, then pairs draft measurable key results and check for bad incentives.", outcome: "2–3 objectives with draft measurable key results and an owner for each result." },
        { id: "leadership-different-targets", title: "Leadership is aiming at different targets.", feeling: "Every leader has a sensible goal. Together, they point the business in different directions.", scenes: "Picture a retail chain where operations is chasing margin, merchandising is chasing growth and stores are chasing speed. Or a nonprofit whose program, fundraising and finance leaders each have a different definition of a good year.", insight: "The goals can all sound reasonable and still pull the organization apart.", play: "Leadership Goal Setting", inHour: "Leaders quietly name the numbers that should guide the business, choose the top two or three and derive goals from them. We rank the goals, make the focus and don't-focus choices explicit, then the decision owner confirms the strategy and measures.", outcome: "3–5 prioritized goals, a focus and don't-focus strategy, and leading measures." }
      ]
    },
    understanding: {
      number: "03", title: "Better Understanding",
      intro: "Build a shared picture strong enough to support the decisions and action that come next.",
      exhibits: [
        { id: "information-no-picture", title: "We have information, but no shared picture.", feeling: "Plenty of reports. Everyone still tells a different story.", scenes: "Picture a retail chain where finance, store operations and marketing each have their own dashboard, and their own explanation of why sales dipped. Or a public health team drowning in data that still can't agree on what's happening in the community.", insight: "More data won't fix it. People need to see what the others are seeing.", play: "Develop Shared Understanding", inHour: "Everyone quietly records what they know and what they've seen firsthand. We read the whole picture together, mark what surprises us, and sort it into shared themes without throwing out the outliers.", outcome: "one shared view of the evidence, where people still disagree, and the unknowns that matter most." },
        { id: "competing-explanations", title: "Everyone has a different explanation.", feeling: "Five people, five confident theories, one problem that won't go away.", scenes: "Picture a subscription company losing customers. Sales blames the product, product blames onboarding, and support blames pricing. Or a school where every group has its own reason test scores are slipping.", insight: "Debating the theories rarely makes the problem clearer. Framing it together usually does.", play: "The Problem Framing Session", inHour: "Each perspective frames the problem on its own first. We separate facts from assumptions and guesses, write a few problem statements that don't sneak in a solution, and pick the one that gives the group the most useful work.", outcome: "a clear definition of the problem, and a better question to go answer." },
        { id: "why-isnt-it-working", title: "Something important isn't working.", feeling: "You can see the symptom. You can't see where to fix it.", scenes: "Picture a contractor whose projects keep running over budget. Or a customer service team whose satisfaction scores dropped and nobody can say why.", insight: "The symptom is real. It just may not be where action will help.", play: "Find the Real Problem", inHour: "Everyone quietly maps where things go wrong along the process. We find the overlaps, weigh what matters most against what you can actually change, and check which explanations the evidence supports.", outcome: "a shared map of the problem, and agreement on the right place to step in." },
        { id: "conditions-changing", title: "The conditions keep changing.", feeling: "You can't wait for certainty, and you can't keep guessing.", scenes: "Picture a construction firm planning next year with interest rates, labor costs and permits all moving at once. Or a healthcare system trying to plan around reimbursement rules that keep changing.", insight: "Waiting for certainty is its own decision, and usually not a good one.", play: "Plan for Uncertainty", inHour: "We name the uncertainties with the biggest impact and use the top two to sketch four possible futures. Everyone plans for all four, then sorts the options into no-regret moves, hedges and big bets.", outcome: "four scenarios, owned actions, early warning signs to watch, and a stalled decision either made or tied to a clear trigger." },
        { id: "could-have-done-better", title: "We know we could have done that better.", feeling: "Nobody needs a culprit. The team needs an honest account of what happened and what to change.", scenes: "Picture a startup looking back on a product decision that didn't land with customers. Or a manufacturing team reviewing a launch that created more rework than anyone expected.", insight: "An honest look back isn't about proving who was right. It's about seeing what people knew at the time and learning from the conditions around the decision.", play: "Blameless Retrospective", inHour: "We build a shared timeline, then everyone quietly records what helped, hurt and surprised them. We separate facts from interpretations, group the contributing conditions and choose two or three changes with owners and a date to check them.", outcome: "a shared timeline, practical lessons and 2–3 owned changes with a check date." },
        { id: "project-risks-in-everyones-head", title: "Project risks live in everyone's head.", feeling: "Everyone can name a risk. Nobody can see the whole picture.", scenes: "Picture a financial services team preparing a platform migration while every function tracks different concerns. Or an education nonprofit launching a new program with assumptions, dependencies and active issues scattered across meetings and inboxes.", insight: "The risk isn't only what might go wrong. It's also what you're assuming, what is already going wrong and what the work depends on.", play: "The RAID Review", inHour: "Everyone quietly fills four boxes: risks, assumptions, issues and dependencies. We deduplicate the list, check which assumptions have evidence, place the biggest risks by impact and likelihood, then name owners for the top items.", outcome: "one prioritized, owned RAID log covering risks, assumptions, issues and dependencies." },
        { id: "reorg-confusion-remains", title: "The reorg is over. The confusion isn't.", feeling: "The org chart changed. People are still working from different versions of what changed with it.", scenes: "Picture a government department six weeks into a reorg, with teams still unsure what they own. Or a professional services firm where a leadership change left the old expectations hanging.", insight: "An announcement says what happened. People still need to know what continues, what ends and how to act now.", play: "Reset After Change", inHour: "After a short briefing, everyone adds what's continuing, ending and new to a Who We Are Now canvas. We turn that into three to five from-to shifts, sort open questions and assign owners and answer dates.", outcome: "a shared Who We Are Now canvas with clear shifts, open questions, owners and answer dates." },
        { id: "team-feels-off", title: "The team feels off, but nobody says why.", feeling: "Something in the way the team works isn't right, but nobody has a shared name for it.", scenes: "Picture a university leadership team that looks aligned but keeps revisiting the same decisions. Or a retail operations team where deadlines slip and people have stopped asking for help.", insight: "When a team feels off, asking people to talk it out usually produces safe answers.", play: "Team Health Check", inHour: "Everyone rates the same health dimensions anonymously, exposing weak and polarized areas without naming individuals. People quietly record what's working and what gets in the way, then choose one or two areas and shape an action for each.", outcome: "health ratings, the weak and polarized areas, and one owned action for each area the team chooses." }
      ]
    },
    possibilities: {
      number: "04", title: "Better Possibilities",
      intro: "Create room for stronger ideas, sharper alternatives, and assumptions worth challenging.",
      exhibits: [
        { id: "same-ideas", title: "We keep circling the same ideas.", feeling: "The smartest people in the room keep handing you the same three ideas.", scenes: "Picture a restaurant group whose growth meeting produces the same three ideas every quarter. Or an energy company whose proposals always start with its existing assets.", insight: "The room isn't short on intelligence. It's stuck inside the same frame.", play: "The Opportunity Map", inHour: "We agree on what makes an opportunity worth pursuing, borrow patterns from other fields, then write alone. We cluster ideas by need and build simple opportunity cards.", outcome: "a wider field of opportunities, with the strongest few ready for a real decision." },
        { id: "challenge-direction", title: "A promising direction needs to be challenged.", feeling: "Everyone's excited. That's exactly why it needs a hard look.", scenes: "Picture a startup about to bet its runway on a new product line. Or a health system ready to launch a new service because one competitor did.", insight: "Enthusiasm is useful. It becomes dangerous when the assumptions underneath it stay invisible.", play: "The Assumption Test", inHour: "Everyone writes down what has to be true for customers to want it, for you to deliver it and for it to pay off. We find the riskiest assumptions, check the evidence, and design the smallest honest test, with the \"we stop if…\" criteria agreed before testing begins.", outcome: "the assumptions that matter most, and owned tests with deadlines and clear stop points." },
        { id: "need-alternatives", title: "We need real alternatives, not variations.", feeling: "Three options. One underlying bet.", scenes: "Picture an airline weighing three plans that all depend on business travel returning. Or a food distributor comparing automation proposals built on the same demand forecast.", insight: "Different proposals can still make the same bet. Change the future and real alternatives appear.", play: "Plan for Uncertainty", inHour: "We name the two highest-impact uncertainties and sketch four different futures. Everyone plans for all four, then sorts the options into no-regret moves, hedges and big bets.", outcome: "four distinct futures, shared moves and clear signals for when to change course." },
        { id: "opportunity-not-concrete", title: "The opportunity is exciting but not concrete.", feeling: "\"This could be huge.\" But for who, and how?", scenes: "Picture a manufacturer that knows its data could become a product, but can't say who would buy it. Or a university sure there's a big opportunity in adult learners, without a clear first step.", insight: "\"This could be huge\" is a beginning, not a case for investment.", play: "The Opportunity Map", inHour: "The group agrees on what makes an opportunity worth pursuing. Pairs build simple cards for each one: who it's for, what they need, the evidence, and the riskiest assumption. Then we lay them all out side by side.", outcome: "a map of your opportunities, and the top few ready for someone to make a real decision." },
        { id: "offsite-moves-us-forward", title: "We want an offsite that actually moves us forward.", feeling: "You have the date and the people. You still need a reason for everyone to be in the room.", scenes: "Picture a manufacturing leadership team planning two days together without a shared view of what must change. Or a professional services partnership that wants more than presentations but isn't sure where to begin.", insight: "A useful offsite starts with the progress it must create, not the agenda blocks.", play: "Run a Better Offsite", inHour: "Everyone pictures the day after and names what should be true. We cluster those answers into three to five goals, define what each decides or produces, map who must attend and test the brief against how the offsite could fail.", outcome: "an agreed offsite brief with goals, decisions or outputs, the right participants, constraints and risks." },
        { id: "nobody-trusts-roadmap", title: "Nobody trusts the roadmap.", feeling: "The roadmap looks tidy. The people doing the work don't believe it.", scenes: "Picture a software product group whose roadmap changes every time a large customer calls. Or a government program with a polished sequence that ignores the dependencies between agencies.", insight: "A roadmap loses trust when it lists work without showing which goals it serves or what has to happen first.", play: "Build the Roadmap", inHour: "Everyone adds missing outcomes, then places each one near the objective it serves before choosing what to pursue. We map the dependencies for the selected outcomes, sort them into ambition tiers and challenge the sequence for hidden risks.", outcome: "an objective-anchored roadmap with selected outcomes, visible dependencies and three ambition tiers." }
      ]
    },
    ai: {
      number: "05", title: "Better AI Results",
      intro: "You're already moving on AI. The question is how to move faster, with a better chance it pays off.",
      exhibits: [
        { id: "identify-the-floor", title: "We don't have a plan yet.", feeling: "There's plenty of energy and no shared starting point.", scenes: "Picture an insurance company where three departments bought three different AI tools in the same quarter. Or a law firm where half the associates use AI daily and the partners aren't sure it's allowed.", insight: "People are experimenting. Nobody can see the whole picture or agree where to begin.", play: "AI: Where Do We Start?", inHour: "Everyone quietly maps what they use AI for today, what else they could do, and what's stopping them. We group the frictions and the ideas by workflow, then sort them by value and readiness.", outcome: "a shared map of where AI can help and what's in the way, ready to shape your next step." },
        { id: "establish-the-floor", title: "Results depend on the person.", feeling: "Some people get great results. Others don't. Nobody can say why.", scenes: "Picture an accounting firm where only one team gets reliable AI drafts. Or a telecom company where results depend on which analyst does the work.", insight: "The difference is practice, not access. Good work becomes repeatable when people can see the method.", play: "AI: Increasing Capability", inHour: "Everyone brings a real task, watches a short demonstration, then runs the same inspect, plan, adjust, execute, steer and reuse loop. What worked becomes a repeatable process.", outcome: "repeatable practices, ideas to borrow and commitments for the next month." },
        { id: "raise-the-floor", title: "What works doesn't spread.", feeling: "The wins are real, but they're stuck in pockets of the organization.", scenes: "Picture a hotel group where one property automates weekly reports and the others do them by hand. Or a pharmaceutical company with an AI review process nobody else can reproduce.", insight: "A win is not a capability until other people can use the method.", play: "AI: Increasing Capability", inHour: "The people getting results map their reusable processes. Everyone studies the maps, marks what to borrow, tries one and chooses a weekly habit or next experiment.", outcome: "practices people can borrow, named commitments and a date to see what spread." },
        { id: "lead-the-change", title: "Our AI spending lacks direction.", feeling: "We're investing, but we can't connect the dollars to outcomes.", scenes: "Picture a CFO looking at a dozen AI licenses, two pilots and a training budget, and being asked what it's all worth. Or a nonprofit whose board wants to know if the AI grant is paying off.", insight: "The tools and pilots are easy to see. The value they're supposed to produce often isn't.", play: "AI: Measuring Results", inHour: "We map the current AI work and what it's actually producing. Then we trace each effort from team change to early signal to business value, and check every link against real evidence. Each effort gets a verdict: continue, change, stop or start.", outcome: "investment decisions backed by evidence, and a few measures that tie AI to real results." },
        { id: "push-the-frontier", title: "Top performers are hitting limits.", feeling: "Our experts are ahead of the organization, and the organization is slowing them down.", scenes: "Picture a product team whose best engineers built AI workflows that IT won't approve. Or a consulting firm whose top analysts are doing frontier work with no time, tools or permission to go further.", insight: "Your strongest people already know the basics. They need to compare notes, and they need the organization to catch up.", play: "AI: Increasing Capability", inHour: "Experts map the AI processes they rely on and work through a structured practice round on hard, real work. They borrow methods from each other and name the time, tools or permission they need from leadership.", outcome: "sharper practices, commitments for the next month, and a clear ask for leaders to say yes to." },
        { id: "ai-experiments-no-strategy", title: "Our AI experiments don't add up to a strategy.", feeling: "The pilots, tools and ideas keep multiplying. The strategy doesn't.", scenes: "Picture a financial services company with AI pilots in compliance, service and sales but no shared way to judge them. Or a manufacturer where each plant is buying tools without common priorities or guardrails.", insight: "Experiments create activity. Strategy decides where AI should create value and what won't be pursued.", play: "AI: Define Our Strategy", inHour: "We start from business goals, choose two or three places where AI could create value and score current uses for value and readiness. The group sets will do, won't do and not yet, adds guardrails and builds an outcome chain for each priority.", outcome: "a defensible AI strategy with priorities, guardrails, a won't-do list and measurable outcome chains." }
      ]
    }
  };

  function normalizeExplorePathname() {
    var pathname = window.location.pathname.replace(/\/+$/, "") || "/";
    var targetHash = "";
    if ((pathname === "/" && window.location.hash === "#lobby") || ["/lobby", "/floors", "/investigation", "/challenge-investigation", "/floor", "/exhibit"].indexOf(pathname) >= 0) {
      window.history.replaceState(null, "", "/lobby" + window.location.search);
      return;
    } else if (pathname.indexOf("/floor/") === 0 || pathname.indexOf("/exhibit/") === 0) {
      targetHash = "#" + pathname.slice(1);
    } else if (pathname === "/collection" || pathname === "/basement") {
      targetHash = "#" + pathname.slice(1);
    }
    if (targetHash) window.history.replaceState(null, "", "/" + window.location.search + targetHash);
  }

  function normalizeMergedLobbyDom() {
    var legacyWelcome = document.querySelector('[data-explore-level="investigation"]');
    var legacyRailLink = document.querySelector('[data-floor-nav="investigation"]');
    if (legacyWelcome) legacyWelcome.remove();
    if (legacyRailLink) legacyRailLink.remove();

    Array.prototype.slice.call(document.querySelectorAll('a[href="#investigation"], a[href="#challenge-investigation"], a[href="#lobby"]:not([data-floor-nav]):not([data-explore-next])')).forEach(function (link) {
      link.href = "#lobby";
      link.removeAttribute("data-explore-return");
      link.setAttribute("data-lobby-entry", "");
    });

    var lobbyFrame = document.querySelector('[data-explore-level="lobby"] .lobby-frame');
    if (lobbyFrame && !lobbyFrame.querySelector(".lobby-instruction-floors")) {
      lobbyFrame.innerHTML =
        '<div class="lobby-heading"><h2 id="lobby-title">Find the challenges that sound familiar.</h2><p>Sometimes it\'s hard to name what\'s slowing you down until you see it.</p></div>' +
        '<div class="lobby-instructions" aria-label="How to explore">' +
          '<div class="lobby-instruction-floors"><span aria-hidden="true">↕</span><p><strong class="touch-direction">Swipe up and down.</strong><strong class="pointer-direction">Scroll up and down.</strong><small>Each floor is an outcome:</small></p></div>' +
          '<nav class="lobby-destinations" aria-label="Choose a floor">' +
            '<a href="#floor/momentum"><span>01</span><strong>Better Momentum</strong></a>' +
            '<a href="#floor/decisions"><span>02</span><strong>Better Decisions</strong></a>' +
            '<a href="#floor/understanding"><span>03</span><strong>Better Understanding</strong></a>' +
            '<a href="#floor/possibilities"><span>04</span><strong>Better Possibilities</strong></a>' +
            '<a href="#floor/ai"><span>05</span><strong>Better AI Results</strong></a>' +
          '</nav>' +
          '<div><span aria-hidden="true">↔</span><p><strong class="touch-direction">Swipe left and right</strong><strong class="pointer-direction">Use the arrows</strong><small>on a floor to see the challenges that get in the way of that outcome.</small></p></div>' +
          '<div><span aria-hidden="true">＋</span><p><strong>Add the ones that feel familiar</strong><small>to your collection, then send them to Joe in a message.</small></p></div>' +
        '</div>';
    }
  }

  normalizeExplorePathname();
  normalizeMergedLobbyDom();

  var viewEls = Array.prototype.slice.call(document.querySelectorAll("[data-home-view]"));
  var introSequence = document.querySelector("[data-intro-sequence]");
  var introSteps = Array.prototype.slice.call(document.querySelectorAll("[data-intro-step]"));
  var introNextButtons = Array.prototype.slice.call(document.querySelectorAll("[data-intro-next]"));
  var lobbyEntryLinks = Array.prototype.slice.call(document.querySelectorAll("[data-lobby-entry]"));
  var reactionExperience = document.querySelector("[data-reaction-experience]");
  var reactionStage = document.querySelector("[data-reaction-stage]");
  var reactionVoiceMap = document.querySelector("[data-reaction-voice-map]");
  var reactionSelectors = Array.prototype.slice.call(document.querySelectorAll("[data-reaction-selector]"));
  var reactionPanels = Array.prototype.slice.call(document.querySelectorAll("[data-reaction-panel]"));
  var reactionPosition = document.querySelector("[data-reaction-position]");
  var reactionTheme = document.querySelector("[data-reaction-theme]");
  var exploreStack = document.querySelector("[data-explore-stack]");
  var exploreNextButtons = Array.prototype.slice.call(document.querySelectorAll("[data-explore-next]"));
  var basementLevel = document.querySelector("[data-explore-level=basement]");
  var exploreNavLinks = Array.prototype.slice.call(document.querySelectorAll("[data-floor-nav]"));
  var exhibitDialog = document.querySelector("[data-exhibit-dialog]");
  var collectionDialog = document.querySelector("[data-collection-dialog]");
  var collectionOpenButtons = Array.prototype.slice.call(document.querySelectorAll("[data-collection-open]"));
  var experienceControls = document.querySelector("[data-experience-controls]");
  var experienceMenu = document.querySelector("[data-experience-menu]");
  var experienceMenuOpenButtons = Array.prototype.slice.call(document.querySelectorAll("[data-experience-menu-open]"));
  var experienceMenuClose = document.querySelector("[data-experience-menu-close]");
  var live = document.querySelector("[data-home-live]");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  // Keep initial view setup from replacing a deep link before route() reads it.
  var state = { view: "intro", introStep: 0, floor: "lobby", room: 0, priorHash: "#lobby", routing: true };
  var trackStates = {};
  var introScrollFrame = 0;
  var exploreScrollFrame = 0;
  var introSettleTimer = 0;
  var exploreSettleTimer = 0;
  var introMotionTimer = 0;
  var exploreMotionTimer = 0;
  var introMotionTarget = null;
  var exploreMotionTarget = null;
  var introWheelLocked = false;
  var exploreWheelLocked = false;
  var exhibitWheelLocked = false;
  var exhibitTouch = null;
  var reactionIndex = 0;
  var reactionPointer = null;
  var activeMenuTrigger = experienceMenuOpenButtons[0] || null;

  document.documentElement.classList.add("home-js");

  function escapeHtml(value) {
    return String(value).replace(/[&<>\"]/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character];
    });
  }

  function playLead(play) {
    return "The play I'd run: " + escapeHtml(play) + (/[.!?]$/.test(play) ? "" : ".");
  }

  function allExhibits() {
    var list = [];
    floorOrder.forEach(function (floorId) {
      floors[floorId].exhibits.forEach(function (exhibit) {
        list.push({ floorId: floorId, floorTitle: floors[floorId].title, exhibit: exhibit });
      });
    });
    return list;
  }

  function findExhibit(id) {
    return allExhibits().filter(function (item) { return item.exhibit.id === id; })[0] || null;
  }

  function readSaved() {
    try {
      var parsed = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
      var removed = [];
      try { removed = JSON.parse(window.localStorage.getItem("djc-removed-challenge-labels-v1") || "[]"); }
      catch (error) { /* Ignore a malformed optional removal record. */ }
      if (!Array.isArray(removed)) removed = [];
      return Array.isArray(parsed) ? parsed.filter(function (id) {
        var item = typeof id === "string" && findExhibit(id);
        return item && removed.indexOf(item.exhibit.title) < 0;
      }) : [];
    } catch (error) { return []; }
  }

  function writeSaved(ids) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
      window.localStorage.setItem("djc-saved-challenge-labels-v1", JSON.stringify(ids.map(function (id) {
        var item = findExhibit(id);
        return item ? item.exhibit.title : "";
      }).filter(Boolean)));
      // An explicit add can restore a challenge removed on the contact page.
      var removed = [];
      try { removed = JSON.parse(window.localStorage.getItem("djc-removed-challenge-labels-v1") || "[]"); }
      catch (error) { /* Ignore a malformed optional removal record. */ }
      if (Array.isArray(removed)) {
        window.localStorage.setItem("djc-removed-challenge-labels-v1", JSON.stringify(removed.filter(function (label) {
          return !ids.some(function (id) {
            var item = findExhibit(id);
            return item && item.exhibit.title === label;
          });
        })));
      }
    } catch (error) { /* Storage is optional. */ }
    updateSavedButtons();
    renderCollection();
  }

  function announce(message) {
    if (!live) return;
    live.textContent = "";
    window.setTimeout(function () { live.textContent = message; }, 20);
  }

  function pulse(duration) {
    if (navigator.vibrate && (!navigator.userActivation || navigator.userActivation.isActive)) navigator.vibrate(duration || 5);
  }

  function scrollBehavior() {
    return reducedMotion ? "auto" : "smooth";
  }

  function holdIntroTarget(index) {
    introMotionTarget = index;
    window.clearTimeout(introMotionTimer);
    introMotionTimer = window.setTimeout(function () { introMotionTarget = null; }, reducedMotion ? 20 : 620);
  }

  function holdExploreTarget(index) {
    exploreMotionTarget = index;
    window.clearTimeout(exploreMotionTimer);
    exploreMotionTimer = window.setTimeout(function () { exploreMotionTarget = null; }, reducedMotion ? 20 : 620);
  }

  function roomHash(floorId, roomIndex) {
    if (floorId === "lobby" || floorId === "basement") return "#" + floorId;
    if (!floors[floorId] || roomIndex <= 0) return "#floor/" + floorId;
    return "#floor/" + floorId + "/" + floors[floorId].exhibits[roomIndex - 1].id;
  }

  function exhibitHash(floorId, roomIndex) {
    if (!floors[floorId] || roomIndex <= 0 || roomIndex > floors[floorId].exhibits.length) return roomHash(floorId, roomIndex);
    return "#exhibit/" + floorId + "/" + floors[floorId].exhibits[roomIndex - 1].id;
  }

  function replaceHash(hash) {
    var target = hash === "#lobby" ? "/lobby" + window.location.search : "/" + window.location.search + hash;
    if (window.location.pathname + window.location.search + window.location.hash !== target) window.history.replaceState(null, "", target);
    if (!hash.startsWith("#collection")) state.priorHash = hash;
  }

  function setReaction(index, focusSelector, revealSelector) {
    if (!reactionSelectors.length || !reactionPanels.length) return;
    var count = reactionSelectors.length;
    var next = (index + count) % count;
    reactionIndex = next;
    reactionSelectors.forEach(function (selector, selectorIndex) {
      var current = selectorIndex === next;
      selector.setAttribute("aria-selected", String(current));
      selector.tabIndex = current ? 0 : -1;
    });
    reactionPanels.forEach(function (panel, panelIndex) {
      var current = panelIndex === next;
      panel.hidden = !current;
      panel.classList.toggle("is-active", current);
    });
    reactionPosition.textContent = String(next + 1).padStart(2, "0") + " / " + String(count).padStart(2, "0");
    reactionTheme.textContent = reactionSelectors[next].getAttribute("data-reaction-label");
    if (revealSelector && reactionVoiceMap.scrollWidth > reactionVoiceMap.clientWidth) {
      reactionVoiceMap.scrollTo({
        left: reactionSelectors[next].offsetLeft - (reactionVoiceMap.clientWidth - reactionSelectors[next].offsetWidth) / 2,
        behavior: scrollBehavior()
      });
    }
    if (focusSelector) reactionSelectors[next].focus({ preventScroll: true });
  }

  function renderFloors() {
    floorOrder.forEach(function (floorId) {
      var floor = floors[floorId];
      var section = document.createElement("section");
      var dots = '<a class="room-dot is-landing" href="#floor/' + floorId + '" aria-label="' + escapeHtml(floor.title) + ' elevator landing" data-room-dot="0"></a>';
      var rooms = floor.exhibits.map(function (exhibit, index) {
        var roomNumber = String(index + 1).padStart(2, "0");
        dots += '<a class="room-dot" href="#floor/' + floorId + '/' + exhibit.id + '" aria-label="Room ' + roomNumber + ': ' + escapeHtml(exhibit.title) + '" data-room-dot="' + (index + 1) + '"></a>';
        return '<article class="room-panel challenge-room" data-room-index="' + (index + 1) + '" data-room-id="' + exhibit.id + '" aria-labelledby="room-' + floorId + '-' + exhibit.id + '" tabindex="-1">' +
          '<div class="challenge-room-index"><span>Room</span><strong>' + roomNumber + '</strong></div>' +
          '<div class="challenge-room-copy">' +
            '<h3 id="room-' + floorId + '-' + exhibit.id + '">' + escapeHtml(exhibit.title) + '</h3>' +
            '<p>' + escapeHtml(exhibit.feeling) + '</p>' +
            '<div class="exhibit-card-actions"><a class="home-action primary" href="#exhibit/' + floorId + '/' + exhibit.id + '">Open the room</a><button class="home-action secondary" type="button" data-save-id="' + exhibit.id + '">Add to Collection</button></div>' +
          '</div>' +
          '<div class="challenge-room-mark" aria-hidden="true"><span></span><span></span><span></span></div>' +
        '</article>';
      }).join("");

      section.className = "explore-level floor-level";
      section.id = "floor-" + floorId;
      section.dataset.exploreLevel = floorId;
      section.setAttribute("aria-labelledby", "floor-title-" + floorId);
      section.setAttribute("tabindex", "-1");
      section.innerHTML =
        '<header class="floor-level-header">' +
          '<div><p class="home-kicker">Floor ' + floor.number + '</p><h2 id="floor-title-' + floorId + '">' + escapeHtml(floor.title) + '</h2></div>' +
          '<div class="room-navigation"><button type="button" data-room-prev="' + floorId + '" aria-label="Previous room">←</button><div class="room-dots" aria-label="Rooms on ' + escapeHtml(floor.title) + '">' + dots + '</div><span data-room-count="' + floorId + '">Elevator</span><button type="button" data-room-next="' + floorId + '" aria-label="Next room">→</button></div>' +
        '</header>' +
        '<div class="room-track" data-room-track="' + floorId + '" aria-label="' + escapeHtml(floor.title) + ' elevator landing and rooms">' +
          '<article class="room-panel floor-landing" data-room-index="0" aria-labelledby="landing-title-' + floorId + '" tabindex="-1">' +
            '<div class="elevator-frame">' +
              '<div class="elevator-depth" aria-hidden="true"><span></span><span></span><span></span></div>' +
              '<div class="elevator-indicator"><span>Floor</span><strong>' + floor.number + '</strong></div>' +
              '<div class="floor-landing-copy"><p class="home-kicker">' + floor.exhibits.length + ' rooms</p><h3 id="landing-title-' + floorId + '">' + escapeHtml(floor.title) + '</h3><p>' + escapeHtml(floor.intro) + '</p><p class="floor-enter-hint">Swipe, scroll horizontally, or use the arrows to explore rooms <span aria-hidden="true">→</span></p></div>' +
            '</div>' +
            '<p class="floor-change-hint" aria-hidden="true">↕ Move vertically to another floor</p>' +
          '</article>' + rooms +
        '</div>';
      exploreStack.insertBefore(section, basementLevel);

      var track = section.querySelector("[data-room-track]");
      trackStates[floorId] = {
        floorId: floorId,
        section: section,
        track: track,
        cards: Array.prototype.slice.call(track.querySelectorAll("[data-room-index]")),
        dots: Array.prototype.slice.call(section.querySelectorAll("[data-room-dot]")),
        count: section.querySelector("[data-room-count]"),
        prev: section.querySelector("[data-room-prev]"),
        next: section.querySelector("[data-room-next]"),
        index: 0,
        scrollFrame: 0
      };
    });
  }

  renderFloors();

  var exploreLevels = Array.prototype.slice.call(document.querySelectorAll("[data-explore-level]"));
  exploreOrder = exploreLevels.map(function (level) { return level.getAttribute("data-explore-level"); });

  function setView(name) {
    state.view = name;
    viewEls.forEach(function (view) {
      var active = view.getAttribute("data-home-view") === name;
      view.hidden = !active;
      view.classList.toggle("is-active", active);
      view.setAttribute("aria-hidden", String(!active));
    });
    document.body.setAttribute("data-home-current-view", name);
    experienceControls.hidden = name === "intro";
  }

  function setIntroStep(index, withPulse) {
    var boundedIndex = Math.max(0, Math.min(introSteps.length - 1, index));
    if (withPulse && boundedIndex !== state.introStep) pulse(4);
    state.introStep = boundedIndex;
    introSteps.forEach(function (step, stepIndex) {
      var current = stepIndex === boundedIndex;
      step.classList.toggle("is-current", current);
      step.setAttribute("aria-hidden", current ? "false" : "true");
      step.inert = !current;
    });
    document.body.dataset.introStep = String(boundedIndex);
    if (state.view === "intro" && !state.routing) {
      replaceHash(boundedIndex === 0 ? "#threshold" : "#intro/" + boundedIndex);
    }
  }

  function scrollIntroTo(index, focus) {
    var boundedIndex = Math.max(0, Math.min(introSteps.length - 1, index));
    setView("intro");
    setIntroStep(boundedIndex, false);
    holdIntroTarget(boundedIndex);
    window.requestAnimationFrame(function () {
      introSequence.scrollTo({ top: introSteps[boundedIndex].offsetTop, behavior: scrollBehavior() });
      if (focus) window.setTimeout(function () { introSteps[boundedIndex].focus({ preventScroll: true }); }, reducedMotion ? 0 : 420);
    });
  }

  function updateSavedButtons() {
    var saved = readSaved();
    Array.prototype.slice.call(document.querySelectorAll("[data-save-id]")).forEach(function (button) {
      var isSaved = saved.indexOf(button.getAttribute("data-save-id")) >= 0;
      button.setAttribute("aria-pressed", String(isSaved));
      button.textContent = isSaved ? "Remove from Collection" : "Add to Collection";
    });
    var count = saved.length;
    Array.prototype.slice.call(document.querySelectorAll("[data-collection-count]")).forEach(function (element) {
      element.textContent = String(count);
      element.hidden = count === 0;
      element.setAttribute("aria-label", count + (count === 1 ? " saved challenge" : " saved challenges"));
      var trigger = element.closest(".saved-control");
      if (trigger) trigger.setAttribute("aria-label", count ? "View Collection, " + count + (count === 1 ? " challenge" : " challenges") : "View Collection");
    });
    var basementContact = document.querySelector("[data-basement-contact]");
    if (basementContact) basementContact.href = contactUrl(saved, saved.length ? "Discovery call with collected challenges" : "30-Minute Discovery Call");
  }

  function setRoom(floorId, index, withPulse) {
    var trackState = trackStates[floorId];
    if (!trackState) return;
    var boundedIndex = Math.max(0, Math.min(trackState.cards.length - 1, index));
    if (withPulse && boundedIndex !== trackState.index) pulse(4);
    trackState.index = boundedIndex;
    if (state.floor === floorId) state.room = boundedIndex;
    trackState.section.classList.toggle("is-at-landing", boundedIndex === 0);
    trackState.cards.forEach(function (card, cardIndex) {
      var current = cardIndex === boundedIndex;
      card.classList.toggle("is-current", current);
      card.setAttribute("aria-hidden", current ? "false" : "true");
      card.inert = !current;
    });
    trackState.dots.forEach(function (dot, dotIndex) {
      if (dotIndex === boundedIndex) dot.setAttribute("aria-current", "true");
      else dot.removeAttribute("aria-current");
    });
    trackState.count.textContent = boundedIndex === 0
      ? "Elevator"
      : "Room " + String(boundedIndex).padStart(2, "0") + " / " + String(floors[floorId].exhibits.length).padStart(2, "0");
    trackState.prev.disabled = boundedIndex === 0;
    trackState.next.disabled = boundedIndex === trackState.cards.length - 1;
    if (state.view === "explore" && state.floor === floorId && !state.routing) replaceHash(roomHash(floorId, boundedIndex));
  }

  function setDoorOpening(trackState, openness) {
    var progress = Math.max(0, Math.min(1, openness));
    trackState.section.style.setProperty("--elevator-left-shift", String(progress * -100) + "%");
    trackState.section.style.setProperty("--elevator-right-shift", String(progress * 100) + "%");
  }

  function updateVerticalDoorOpening() {
    var viewportRect = exploreStack.getBoundingClientRect();
    var viewportHeight = Math.max(viewportRect.height, 1);
    Object.keys(trackStates).forEach(function (floorId) {
      var trackState = trackStates[floorId];
      if (reducedMotion) {
        setDoorOpening(trackState, 1);
        return;
      }
      var sectionTop = trackState.section.getBoundingClientRect().top - viewportRect.top;
      var distance = Math.min(1, Math.abs(sectionTop) / viewportHeight);
      setDoorOpening(trackState, Math.abs((distance * 2) - 1));
    });
  }

  function setExploreLevel(floorId, withPulse) {
    var resolved = exploreOrder.indexOf(floorId) >= 0 ? floorId : "lobby";
    var floorChanged = resolved !== state.floor;
    if (withPulse && floorChanged) pulse(5);
    if (floors[resolved] && floorChanged) {
      setRoom(resolved, 0, false);
      trackStates[resolved].track.scrollTo({ left: 0, behavior: "auto" });
    }
    state.floor = resolved;
    state.room = floors[resolved] ? trackStates[resolved].index : 0;
    exploreLevels.forEach(function (level) {
      var current = level.getAttribute("data-explore-level") === resolved;
      level.classList.toggle("is-current", current);
      level.setAttribute("aria-hidden", current ? "false" : "true");
      level.inert = !current;
    });
    exploreNavLinks.forEach(function (link) {
      if (link.getAttribute("data-floor-nav") === resolved) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
    document.body.dataset.exploreFloor = resolved;
    if (state.view === "explore" && !state.routing) replaceHash(roomHash(resolved, state.room));
  }

  function scrollRoomTo(floorId, roomIndex, focus) {
    var trackState = trackStates[floorId];
    if (!trackState) return;
    var boundedIndex = Math.max(0, Math.min(trackState.cards.length - 1, roomIndex));
    setRoom(floorId, boundedIndex, false);
    window.requestAnimationFrame(function () {
      trackState.track.scrollTo({ left: boundedIndex * trackState.track.clientWidth, behavior: scrollBehavior() });
      if (focus) window.setTimeout(function () { trackState.cards[boundedIndex].focus({ preventScroll: true }); }, reducedMotion ? 0 : 420);
    });
  }

  function scrollExploreTo(floorId, exhibitId, focus) {
    var resolved = exploreOrder.indexOf(floorId) >= 0 ? floorId : "lobby";
    var level = exploreLevels.filter(function (item) { return item.getAttribute("data-explore-level") === resolved; })[0];
    var roomIndex = 0;
    if (floors[resolved] && exhibitId) {
      var found = floors[resolved].exhibits.findIndex(function (exhibit) { return exhibit.id === exhibitId; });
      roomIndex = found >= 0 ? found + 1 : 0;
    }
    setView("explore");
    setExploreLevel(resolved, false);
    holdExploreTarget(exploreOrder.indexOf(resolved));
    if (floors[resolved]) setRoom(resolved, roomIndex, false);
    window.requestAnimationFrame(function () {
      exploreStack.scrollTo({ top: level.offsetTop, behavior: scrollBehavior() });
      if (floors[resolved]) scrollRoomTo(resolved, roomIndex, focus);
      else if (focus) window.setTimeout(function () { level.focus({ preventScroll: true }); }, reducedMotion ? 0 : 420);
    });
  }

  function moveIntro(direction) {
    var next = Math.max(0, Math.min(introSteps.length - 1, state.introStep + direction));
    if (next === state.introStep) return;
    setIntroStep(next, true);
    holdIntroTarget(next);
    introSequence.scrollTo({ top: introSteps[next].offsetTop, behavior: scrollBehavior() });
  }

  function moveFloor(direction) {
    var currentIndex = Math.max(0, exploreOrder.indexOf(state.floor));
    var nextIndex = Math.max(0, Math.min(exploreOrder.length - 1, currentIndex + direction));
    if (nextIndex === currentIndex) return;
    var nextFloor = exploreOrder[nextIndex];
    var level = exploreLevels[nextIndex];
    setExploreLevel(nextFloor, true);
    holdExploreTarget(nextIndex);
    exploreStack.scrollTo({ top: level.offsetTop, behavior: scrollBehavior() });
  }

  function moveRoom(direction) {
    if (!floors[state.floor]) return;
    var trackState = trackStates[state.floor];
    var next = Math.max(0, Math.min(trackState.cards.length - 1, trackState.index + direction));
    if (next === trackState.index) return;
    setRoom(state.floor, next, true);
    trackState.track.scrollTo({ left: next * trackState.track.clientWidth, behavior: scrollBehavior() });
  }

  function toggleSaved(id) {
    var item = findExhibit(id);
    if (!item) return;
    var saved = readSaved();
    var index = saved.indexOf(id);
    if (index >= 0) {
      saved.splice(index, 1);
      announce("Removed “" + item.exhibit.title + "” from your collection.");
    } else {
      saved.push(id);
      announce("Added “" + item.exhibit.title + "” to your collection.");
    }
    writeSaved(saved);
  }

  function contactUrl(ids, intent) {
    var params = new URLSearchParams();
    params.set("sourcePage", "/");
    if (intent) params.set("intent", intent);
    ids.forEach(function (id) {
      var item = findExhibit(id);
      if (item) params.append("challenge", item.exhibit.title);
    });
    return "/contact/?" + params.toString();
  }

  function renderDialog(floorId, exhibitId) {
    var floor = floors[floorId];
    var exhibit = floor && floor.exhibits.filter(function (item) { return item.id === exhibitId; })[0];
    if (!floor || !exhibit) return false;
    exhibitDialog.querySelector("[data-dialog-floor]").textContent = floor.title;
    exhibitDialog.querySelector("[data-dialog-number]").textContent = "Floor " + floor.number;
    exhibitDialog.querySelector("[data-dialog-title]").textContent = exhibit.title;
    exhibitDialog.querySelector("[data-dialog-scenes]").textContent = exhibit.scenes;
    exhibitDialog.querySelector("[data-dialog-passage]").innerHTML =
      "<p>" + escapeHtml(exhibit.insight) + "</p>" +
      "<p><strong>" + playLead(exhibit.play) + "</strong> " + escapeHtml(exhibit.inHour) + "</p>" +
      "<p><strong>You leave with:</strong> " + escapeHtml(exhibit.outcome) + "</p>";
    var save = exhibitDialog.querySelector("[data-dialog-save]");
    save.setAttribute("data-save-id", exhibit.id);
    exhibitDialog.querySelector("[data-dialog-talk]").href = contactUrl([exhibit.id], "30-Minute Discovery Call: " + exhibit.title);
    updateSavedButtons();
    return true;
  }

  function openExhibit(floorId, exhibitId) {
    if (!renderDialog(floorId, exhibitId)) return;
    if (!exhibitDialog.open) exhibitDialog.showModal();
    window.setTimeout(function () { exhibitDialog.querySelector("[data-dialog-close]").focus({ preventScroll: true }); }, reducedMotion ? 0 : 180);
  }

  function closeExhibit(updateHash) {
    if (exhibitDialog.open) exhibitDialog.close();
    if (updateHash) replaceHash(roomHash(state.floor, state.room));
  }

  function refreshOpenExhibit(resetScroll) {
    var floor = floors[state.floor];
    var exhibit = floor && floor.exhibits[state.room - 1];
    if (!exhibit || !renderDialog(state.floor, exhibit.id)) return false;
    if (resetScroll) exhibitDialog.scrollTop = 0;
    replaceHash(exhibitHash(state.floor, state.room));
    announce(floor.title + ": " + exhibit.title);
    return true;
  }

  function moveOpenExhibitRoom(direction) {
    if (!exhibitDialog.open || !floors[state.floor]) return false;
    var trackState = trackStates[state.floor];
    var next = Math.max(1, Math.min(trackState.cards.length - 1, state.room + direction));
    if (next === state.room) return false;
    scrollRoomTo(state.floor, next, false);
    pulse(4);
    return refreshOpenExhibit(true);
  }

  function moveOpenExhibitFloor(direction) {
    if (!exhibitDialog.open || !floors[state.floor]) return false;
    var currentIndex = floorOrder.indexOf(state.floor);
    var nextIndex = Math.max(0, Math.min(floorOrder.length - 1, currentIndex + direction));
    if (nextIndex === currentIndex) return false;
    var nextFloor = floorOrder[nextIndex];
    var nextRoom = Math.max(1, Math.min(floors[nextFloor].exhibits.length, state.room || 1));
    setExploreLevel(nextFloor, true);
    holdExploreTarget(exploreOrder.indexOf(nextFloor));
    exploreStack.scrollTo({ top: trackStates[nextFloor].section.offsetTop, behavior: scrollBehavior() });
    scrollRoomTo(nextFloor, nextRoom, false);
    pulse(5);
    return refreshOpenExhibit(true);
  }

  function renderCollection() {
    updateSavedButtons();
    var saved = readSaved();
    var list = document.querySelector("[data-collection-list]");
    var inquiry = document.querySelector("[data-collection-inquire]");
    if (!list || !inquiry) return;
    try {
      window.localStorage.setItem("djc-saved-challenge-labels-v1", JSON.stringify(saved.map(function (id) {
        var item = findExhibit(id);
        return item ? item.exhibit.title : "";
      }).filter(Boolean)));
    } catch (error) { /* Storage is optional. */ }
    if (!saved.length) {
      list.innerHTML = '<p class="collection-empty">Your collection is empty. Open any room and add the challenges that sound familiar.</p>';
      inquiry.textContent = "Send Joe a Message";
      inquiry.href = contactUrl([], "30-Minute Discovery Call");
      return;
    }
    list.innerHTML = saved.map(function (id) {
      var item = findExhibit(id);
      if (!item) return "";
      return '<article><div><span>' + escapeHtml(item.floorTitle) + '</span><strong>' + escapeHtml(item.exhibit.title) + '</strong></div><button type="button" data-remove-id="' + id + '" aria-label="Remove ' + escapeHtml(item.exhibit.title) + ' from Collection">Remove from Collection</button></article>';
    }).join("");
    inquiry.textContent = "Send Joe a Message";
    inquiry.href = contactUrl(saved, "Discovery call with collected challenges");
  }

  function openCollection() {
    renderCollection();
    if (!collectionDialog.open) collectionDialog.showModal();
  }

  function openExperienceMenu(event) {
    activeMenuTrigger = event && event.currentTarget ? event.currentTarget : activeMenuTrigger;
    if (!experienceMenu.open) experienceMenu.showModal();
    window.setTimeout(function () { experienceMenuClose.focus({ preventScroll: true }); }, reducedMotion ? 0 : 160);
  }

  function closeExperienceMenu(restoreFocus) {
    if (!experienceMenu.open) return;
    experienceMenu.close();
    if (restoreFocus !== false && activeMenuTrigger) activeMenuTrigger.focus({ preventScroll: true });
  }

  function route(focus) {
    var pathname = window.location.pathname.replace(/\/+$/, "") || "/";
    var hash = window.location.hash.replace(/^#/, "");
    if (!hash && pathname === "/lobby") hash = "lobby";
    if (!hash) hash = "threshold";
    var parts = hash.split("/").filter(Boolean);
    state.routing = true;
    closeExhibit(false);
    if (collectionDialog.open) collectionDialog.close();
    closeExperienceMenu(false);

    if (parts[0] === "threshold") scrollIntroTo(0, focus);
    else if (parts[0] === "intro") scrollIntroTo(Number(parts[1] || 1), focus);
    else if (parts[0] === "investigation" || parts[0] === "challenge-investigation") {
      replaceHash("#lobby");
      scrollExploreTo("lobby", null, focus);
    }
    else if (parts[0] === "lobby" || parts[0] === "floors") scrollExploreTo("lobby", null, focus);
    else if (parts[0] === "floor") scrollExploreTo(parts[1], parts[2], focus);
    else if (parts[0] === "exhibit") {
      scrollExploreTo(parts[1], parts[2], false);
      window.setTimeout(function () { openExhibit(parts[1], parts[2]); }, reducedMotion ? 0 : 220);
    } else if (parts[0] === "basement") scrollExploreTo("basement", null, focus);
    else if (parts[0] === "about-joe" || parts[0] === "meet-joe") {
      window.location.replace("/about/");
      return;
    } else if (parts[0] === "collection") {
      if (state.view === "intro") scrollExploreTo("lobby", null, false);
      openCollection();
    } else scrollIntroTo(0, focus);

    window.setTimeout(function () { state.routing = false; }, reducedMotion ? 20 : 620);
  }

  introSequence.addEventListener("scroll", function () {
    if (introScrollFrame) window.cancelAnimationFrame(introScrollFrame);
    introScrollFrame = window.requestAnimationFrame(function () {
      var next = introMotionTarget !== null ? introMotionTarget : introSteps.reduce(function (closest, step, index) {
        return Math.abs(step.offsetTop - introSequence.scrollTop) < Math.abs(introSteps[closest].offsetTop - introSequence.scrollTop) ? index : closest;
      }, 0);
      setIntroStep(next, next !== state.introStep);
      introScrollFrame = 0;
    });
    window.clearTimeout(introSettleTimer);
    introSettleTimer = window.setTimeout(function () {
      var current = introSteps[state.introStep];
      if (current.scrollHeight > introSequence.clientHeight + 24) return;
      if (Math.abs(introSequence.scrollTop - current.offsetTop) > 2) introSequence.scrollTo({ top: current.offsetTop, behavior: scrollBehavior() });
    }, 140);
  }, { passive: true });

  introSequence.addEventListener("wheel", function (event) {
    if (state.view !== "intro" || reducedMotion || Math.abs(event.deltaY) <= Math.abs(event.deltaX) || Math.abs(event.deltaY) < 12) return;
    var currentStep = introSteps[state.introStep];
    if (currentStep.scrollHeight > introSequence.clientHeight + 24) return;
    event.preventDefault();
    if (introWheelLocked) return;
    introWheelLocked = true;
    moveIntro(event.deltaY > 0 ? 1 : -1);
    window.setTimeout(function () { introWheelLocked = false; }, 560);
  }, { passive: false });

  exploreStack.addEventListener("scroll", function () {
    if (exploreScrollFrame) window.cancelAnimationFrame(exploreScrollFrame);
    exploreScrollFrame = window.requestAnimationFrame(function () {
      var next = exploreMotionTarget !== null ? exploreMotionTarget : exploreLevels.reduce(function (closest, level, index) {
        return Math.abs(level.offsetTop - exploreStack.scrollTop) < Math.abs(exploreLevels[closest].offsetTop - exploreStack.scrollTop) ? index : closest;
      }, 0);
      var nextFloor = exploreLevels[next].getAttribute("data-explore-level");
      setExploreLevel(nextFloor, nextFloor !== state.floor);
      updateVerticalDoorOpening();
      exploreScrollFrame = 0;
    });
    window.clearTimeout(exploreSettleTimer);
    exploreSettleTimer = window.setTimeout(function () {
      var currentIndex = Math.max(0, exploreOrder.indexOf(state.floor));
      var current = exploreLevels[currentIndex];
      if (current && Math.abs(exploreStack.scrollTop - current.offsetTop) > 2) exploreStack.scrollTo({ top: current.offsetTop, behavior: scrollBehavior() });
    }, 140);
  }, { passive: true });

  exploreStack.addEventListener("wheel", function (event) {
    if (state.view !== "explore" || reducedMotion || Math.abs(event.deltaY) <= Math.abs(event.deltaX) || Math.abs(event.deltaY) < 12) return;
    event.preventDefault();
    if (exploreWheelLocked) return;
    exploreWheelLocked = true;
    moveFloor(event.deltaY > 0 ? 1 : -1);
    window.setTimeout(function () { exploreWheelLocked = false; }, 560);
  }, { passive: false });

  Object.keys(trackStates).forEach(function (floorId) {
    var trackState = trackStates[floorId];
    trackState.track.addEventListener("scroll", function () {
      if (trackState.scrollFrame) window.cancelAnimationFrame(trackState.scrollFrame);
      trackState.scrollFrame = window.requestAnimationFrame(function () {
        var next = Math.round(trackState.track.scrollLeft / Math.max(trackState.track.clientWidth, 1));
        setRoom(floorId, next, next !== trackState.index);
        trackState.scrollFrame = 0;
      });
    }, { passive: true });
    trackState.track.addEventListener("wheel", function (event) {
      if (!event.shiftKey || Math.abs(event.deltaY) < 8) return;
      event.preventDefault();
      moveRoom(event.deltaY > 0 ? 1 : -1);
    }, { passive: false });
    trackState.prev.addEventListener("click", function () { if (state.floor !== floorId) setExploreLevel(floorId, false); moveRoom(-1); });
    trackState.next.addEventListener("click", function () { if (state.floor !== floorId) setExploreLevel(floorId, false); moveRoom(1); });
  });

  reactionSelectors.forEach(function (selector) {
    selector.addEventListener("click", function () {
      setReaction(Number(selector.getAttribute("data-reaction-selector")), false, true);
    });
  });
  introNextButtons.forEach(function (button) {
    button.addEventListener("click", function () { moveIntro(1); });
  });
  lobbyEntryLinks.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      closeExperienceMenu(false);
      if (window.location.pathname !== "/lobby" || window.location.hash) window.history.pushState(null, "", "/lobby" + window.location.search);
      state.priorHash = "#lobby";
      state.routing = true;
      scrollExploreTo("lobby", null, true);
      window.setTimeout(function () { state.routing = false; }, reducedMotion ? 20 : 620);
    });
  });
  exploreNextButtons.forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      var target = link.getAttribute("data-explore-next");
      var hash = roomHash(target, 0);
      window.history.pushState(null, "", hash);
      state.priorHash = hash;
      scrollExploreTo(target, null, true);
    });
  });
  document.querySelector("[data-reaction-prev]").addEventListener("click", function () {
    setReaction(reactionIndex - 1, false, true);
  });
  document.querySelector("[data-reaction-next]").addEventListener("click", function () {
    setReaction(reactionIndex + 1, false, true);
  });
  reactionVoiceMap.addEventListener("keydown", function (event) {
    if (event.key === "ArrowRight" || event.key === "ArrowLeft" || event.key === "Home" || event.key === "End") {
      event.preventDefault();
      event.stopPropagation();
      var next = event.key === "Home" ? 0 : event.key === "End" ? reactionSelectors.length - 1 : reactionIndex + (event.key === "ArrowRight" ? 1 : -1);
      setReaction(next, true, true);
    }
  });
  reactionStage.addEventListener("pointerdown", function (event) {
    if (!event.isPrimary || event.target.closest("button, a")) return;
    reactionPointer = { id: event.pointerId, x: event.clientX, y: event.clientY };
    reactionStage.setPointerCapture(event.pointerId);
  });
  reactionStage.addEventListener("pointerup", function (event) {
    if (!reactionPointer || reactionPointer.id !== event.pointerId) return;
    var deltaX = event.clientX - reactionPointer.x;
    var deltaY = event.clientY - reactionPointer.y;
    reactionPointer = null;
    if (Math.abs(deltaX) > 46 && Math.abs(deltaX) > Math.abs(deltaY) * 1.2) {
      setReaction(reactionIndex + (deltaX < 0 ? 1 : -1), false, true);
    }
  });
  reactionStage.addEventListener("pointercancel", function () { reactionPointer = null; });

  document.addEventListener("click", function (event) {
    var save = event.target.closest("[data-save-id]");
    var remove = event.target.closest("[data-remove-id]");
    if (save) {
      event.preventDefault();
      toggleSaved(save.getAttribute("data-save-id"));
    }
    if (remove) {
      event.preventDefault();
      toggleSaved(remove.getAttribute("data-remove-id"));
    }
  });

  document.addEventListener("keydown", function (event) {
    var target = event.target;
    if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
    var isInteractive = target && target.closest && target.closest("a, button");

    if (collectionDialog.open || experienceMenu.open) return;
    if (exhibitDialog.open) {
      if (isInteractive && (event.key === " " || event.key === "Enter")) return;
      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault(); moveOpenExhibitFloor(1);
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault(); moveOpenExhibitFloor(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault(); moveOpenExhibitRoom(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault(); moveOpenExhibitRoom(-1);
      }
      return;
    }

    if (state.view === "intro") {
      if (isInteractive && (event.key === " " || event.key === "Enter")) return;
      if (event.key === "ArrowDown" || event.key === "PageDown" || event.key === " ") {
        event.preventDefault(); moveIntro(1);
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault(); moveIntro(-1);
      }
      return;
    }

    if (state.view === "explore") {
      if (event.key === "ArrowDown" || event.key === "PageDown") {
        event.preventDefault(); moveFloor(1);
      } else if (event.key === "ArrowUp" || event.key === "PageUp") {
        event.preventDefault(); moveFloor(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault(); moveRoom(1);
      } else if (event.key === "ArrowLeft") {
        event.preventDefault(); moveRoom(-1);
      }
    }
  });

  exhibitDialog.addEventListener("touchstart", function (event) {
    if (event.touches.length !== 1 || event.target.closest("button, a")) {
      exhibitTouch = null;
      return;
    }
    var touch = event.touches[0];
    exhibitTouch = {
      x: touch.clientX,
      y: touch.clientY,
      atTop: exhibitDialog.scrollTop <= 8,
      atBottom: exhibitDialog.scrollTop + exhibitDialog.clientHeight >= exhibitDialog.scrollHeight - 8
    };
  }, { passive: true });

  exhibitDialog.addEventListener("touchend", function (event) {
    if (!exhibitTouch || !event.changedTouches.length) return;
    var touch = event.changedTouches[0];
    var deltaX = touch.clientX - exhibitTouch.x;
    var deltaY = touch.clientY - exhibitTouch.y;
    var start = exhibitTouch;
    exhibitTouch = null;
    if (Math.abs(deltaX) > 48 && Math.abs(deltaX) > Math.abs(deltaY) * 1.15) {
      moveOpenExhibitRoom(deltaX < 0 ? 1 : -1);
    } else if (Math.abs(deltaY) > 60 && Math.abs(deltaY) > Math.abs(deltaX) * 1.15) {
      if (deltaY < 0 && start.atBottom) moveOpenExhibitFloor(1);
      else if (deltaY > 0 && start.atTop) moveOpenExhibitFloor(-1);
    }
  }, { passive: true });

  exhibitDialog.addEventListener("touchmove", function (event) {
    if (!exhibitTouch || event.touches.length !== 1) return;
    var touch = event.touches[0];
    var deltaX = touch.clientX - exhibitTouch.x;
    var deltaY = touch.clientY - exhibitTouch.y;
    if (Math.abs(deltaY) <= 60 || Math.abs(deltaY) <= Math.abs(deltaX) * 1.15) return;
    var start = exhibitTouch;
    if ((deltaY < 0 && start.atBottom) || (deltaY > 0 && start.atTop)) {
      exhibitTouch = null;
      moveOpenExhibitFloor(deltaY < 0 ? 1 : -1);
    }
  }, { passive: true });

  exhibitDialog.addEventListener("touchcancel", function () { exhibitTouch = null; }, { passive: true });

  exhibitDialog.addEventListener("wheel", function (event) {
    if (exhibitWheelLocked) return;
    var horizontal = Math.abs(event.deltaX) > Math.abs(event.deltaY) && Math.abs(event.deltaX) >= 12;
    var atTop = exhibitDialog.scrollTop <= 4;
    var atBottom = exhibitDialog.scrollTop + exhibitDialog.clientHeight >= exhibitDialog.scrollHeight - 4;
    var moved = false;
    if (horizontal) {
      event.preventDefault();
      moved = moveOpenExhibitRoom(event.deltaX > 0 ? 1 : -1);
    } else if (Math.abs(event.deltaY) >= 12 && ((event.deltaY > 0 && atBottom) || (event.deltaY < 0 && atTop))) {
      event.preventDefault();
      moved = moveOpenExhibitFloor(event.deltaY > 0 ? 1 : -1);
    }
    if (!moved) return;
    exhibitWheelLocked = true;
    window.setTimeout(function () { exhibitWheelLocked = false; }, 560);
  }, { passive: false });

  document.querySelector("[data-dialog-close]").addEventListener("click", function () { closeExhibit(true); });
  collectionOpenButtons.forEach(function (button) {
    button.addEventListener("click", function (event) {
      event.preventDefault();
      state.priorHash = roomHash(state.floor, state.room);
      if (window.location.hash !== "#collection") window.history.pushState(null, "", "#collection");
      openCollection();
    });
  });
  experienceMenuOpenButtons.forEach(function (button) { button.addEventListener("click", openExperienceMenu); });
  experienceMenuClose.addEventListener("click", function () { closeExperienceMenu(true); });
  experienceMenu.addEventListener("cancel", function (event) {
    event.preventDefault();
    closeExperienceMenu(true);
  });
  experienceMenu.addEventListener("click", function (event) {
    if (event.target === experienceMenu) closeExperienceMenu(true);
    else if (event.target.closest("a")) closeExperienceMenu(false);
  });
  document.querySelector("[data-collection-close]").addEventListener("click", function () {
    collectionDialog.close();
    window.history.replaceState(null, "", state.priorHash || "#lobby");
  });
  document.querySelector("[data-collection-continue]").addEventListener("click", function () {
    collectionDialog.close();
    window.location.hash = roomHash(state.floor, state.room);
  });
  collectionDialog.addEventListener("cancel", function (event) {
    event.preventDefault();
    collectionDialog.close();
    window.history.replaceState(null, "", state.priorHash || "#lobby");
  });
  exhibitDialog.addEventListener("cancel", function (event) { event.preventDefault(); closeExhibit(true); });

  window.addEventListener("hashchange", function () {
    if (!window.location.hash.startsWith("#collection")) state.priorHash = window.location.hash || "#lobby";
    route(true);
  });
  window.addEventListener("storage", renderCollection);
  window.addEventListener("pageshow", renderCollection);
  window.addEventListener("resize", function () {
    introSequence.scrollTop = introSteps[state.introStep].offsetTop;
    exploreStack.scrollTop = exploreLevels[exploreOrder.indexOf(state.floor)].offsetTop;
    Object.keys(trackStates).forEach(function (floorId) {
      var trackState = trackStates[floorId];
      trackState.track.scrollLeft = trackState.index * trackState.track.clientWidth;
    });
    updateVerticalDoorOpening();
  }, { passive: true });

  updateSavedButtons();
  renderCollection();
  setReaction(0, false, false);
  setIntroStep(0, false);
  setExploreLevel("lobby", false);
  updateVerticalDoorOpening();
  state.priorHash = window.location.hash && !window.location.hash.startsWith("#collection") ? window.location.hash : "#lobby";
  route(false);
})();
