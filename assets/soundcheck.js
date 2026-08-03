(function () {
  "use strict";

  var root = document.querySelector("[data-soundcheck]");
  if (!root) return;

  var microsoftWti = "https://www.microsoft.com/en-us/worklab/work-trend-index/agents-human-agency-and-the-opportunity-for-every-organization";
  var gallupAdoption = "https://www.gallup.com/workplace/712736/organizational-adoption-jumps-six-points.aspx";
  var kyndrylTrust = "https://www.kyndryl.com/in/en/institute/2026/06/trust-gap";
  var kyndrylPilots = "https://www.kyndryl.com/us/en/about-us/news/2026/04/ai-pilots-workforce-readiness";

  var signals = [
    {
      id: "workflow",
      short: "AI stays outside work",
      crowd: "AI is available. The work did not change.",
      title: "AI never becomes part of the real workflow",
      quote: "We have the tools, but we have not changed how the work actually happens.",
      work: "AI helps with a draft or summary, but people still gather the same inputs, complete the old handoffs, redo formatting, and remember to open a separate tool. A faster step does not improve the whole process.",
      lens: "Where the recurring work begins and ends, which steps AI genuinely replaces, and whether the result can survive a second person using it.",
      routes: { identify: 1, establish: 5, scale: 2 },
      evidence: [
        ["Knowledge workers compare isolated experimentation with AI embedded in recurring work.", "Reddit / operations", "https://www.reddit.com/r/AIforOPS/comments/1uca8v0/how_is_your_team_actually_adopting_ai_at_work/"],
        ["Gallup finds organizational integration rising while job-relevant use remains uneven.", "Gallup / July 2026", gallupAdoption]
      ]
    },
    {
      id: "power",
      short: "Power users only",
      crowd: "Our best users became everyone else's help desk.",
      title: "Value is concentrated in isolated power users",
      quote: "A few people have valuable workflows. Their colleagues cannot see them, repeat them, or benefit from them.",
      work: "Strong research, synthesis, meeting follow-through, and document workflows live in personal chat histories, private prompt libraries, or individual intuition. When the person leaves the room, the capability leaves too.",
      lens: "What the strongest users are actually doing, which parts are transferable, and how to spread the practice without turning champions into permanent support staff.",
      routes: { identify: 2, establish: 3, scale: 5 },
      evidence: [
        ["Product teams describe AI use as individual experimentation rather than shared operating practice.", "Reddit / product managers", "https://www.reddit.com/r/AIProductManagers/comments/1ucrenr/how_is_your_product_team_actually_using_ai/"],
        ["Microsoft reports that sharing practices and documenting repeatable workflows distinguish stronger AI environments.", "Microsoft / Work Trend Index 2026", microsoftWti]
      ]
    },
    {
      id: "training",
      short: "Training doesn't stick",
      crowd: "The workshop landed. Monday looked the same.",
      title: "Generic training does not transfer into daily behavior",
      quote: "People leave knowing how to open the tool, not what they should do differently on real work.",
      work: "Feature tours and prompt lists rarely address the judgment inside research, project management, client work, operations, or leadership. Attendance is visible. Transfer is not.",
      lens: "Which role-specific work is worth changing, what acceptable output looks like, and whether participants can build a second useful process after the session.",
      routes: { identify: 1, establish: 6, scale: 1 },
      evidence: [
        ["Workers describe repeated organizational AI efforts without durable changes in practice.", "Reddit / workplace", "https://www.reddit.com/r/antiai/comments/1v1r3ae/my_company_has_been_trying_to_use_ai_for_6_months/"],
        ["Microsoft links stronger outcomes to organizational learning systems, manager behavior, and work redesign.", "Microsoft / Work Trend Index 2026", microsoftWti]
      ]
    },
    {
      id: "review",
      short: "No review standard",
      crowd: "We save time until somebody checks everything.",
      title: "Teams lack a usable review and escalation standard",
      quote: "We say ‘trust but verify,’ but nobody agrees on what to verify, how much is enough, or when an expert must step in.",
      work: "Polished briefs, reports, recommendations, and research syntheses can hide weak evidence. Blanket verification removes the speed gain, while casual review creates quality and reputation risk.",
      lens: "The consequence of a wrong answer, the evidence standard, who owns final judgment, and which checks can be lightweight, sampled, or expert-led.",
      routes: { identify: 1, establish: 5, scale: 2, performance: 1 },
      evidence: [
        ["A professional research user separates discovery, verification, and synthesis because polished prose can hide weak evidence.", "Reddit / professional AI use", "https://www.reddit.com/r/ChatGPTPro/comments/1v7wcla/i_get_better_research_when_chatgpt_audits_claims/"],
        ["Microsoft reports that stronger AI environments make quality standards explicit.", "Microsoft / Work Trend Index 2026", microsoftWti]
      ]
    },
    {
      id: "standards",
      short: "No shared standards",
      crowd: "Everyone uses AI. No one uses it the same way.",
      title: "Standards and guardrails are unclear or unusable",
      quote: "Use AI, but do not create risk. Experiment, but follow rules nobody can translate into the work.",
      work: "Source handling, disclosure, confidential data, storage, citations, approval, and acceptable quality vary by person and tool. Managers cannot compare the work or reproduce the result.",
      lens: "The smallest enabling standard that protects the work without making the approved route less useful than shadow practice.",
      routes: { identify: 2, establish: 3, scale: 5, leadership: 1 },
      evidence: [
        ["IT managers describe the bind between sensitive-data exposure and the productivity cost of blocking useful tools.", "Reddit / IT managers", "https://www.reddit.com/r/ITManagers/comments/1v9l90x/our_employees_are_using_chatgpt_and_other_ai/"],
        ["Microsoft identifies clear rules and documented quality standards as part of organizational readiness.", "Microsoft / Work Trend Index 2026", microsoftWti]
      ]
    },
    {
      id: "context",
      short: "Context is scattered",
      crowd: "The agent cannot see what the team already knows.",
      title: "AI cannot reliably reach the right organizational context",
      quote: "Our knowledge is fragmented across files, applications, permissions, and people. Nobody is sure what the agent actually knows.",
      work: "Research trails, project decisions, client history, policies, and source material sit in disconnected systems. Summaries become incomplete and status reports become unreliable.",
      lens: "The real source of truth, ownership and permissions, context quality, and whether a better workflow is possible before adding another connector or agent.",
      routes: { identify: 5, establish: 1, scale: 4 },
      evidence: [
        ["A community proposal argues that individual chat histories do not match how teams build shared decisions and context.", "OpenAI community", "https://community.openai.com/t/product-vision-proposal-to-chat-gpt/1385659"],
        ["Microsoft finds many capable workers blocked by organizational systems that have not caught up.", "Microsoft / Work Trend Index 2026", microsoftWti]
      ]
    },
    {
      id: "operations",
      short: "Demos break in practice",
      crowd: "The demo worked. The first exception broke it.",
      title: "Agents work in demos but fail under real operations",
      quote: "The happy path looked excellent. Then a source changed, a credential expired, or the person who built it left.",
      work: "Recurring reports, request routing, meeting follow-through, and research assembly need ownership, monitoring, exceptions, documentation, manual override, and a safe failure state.",
      lens: "What happens halfway through, who can see failure, who owns recovery, and whether the workflow can be maintained when the original builder is absent.",
      routes: { identify: 1, establish: 3, scale: 6, leadership: 1 },
      evidence: [
        ["Kyndryl describes the gap between impressive pilots and safe, consistent operation at scale.", "Kyndryl / April 2026", kyndrylPilots],
        ["Operations practitioners discuss how adoption changes once AI touches actual recurring work.", "Reddit / operations", "https://www.reddit.com/r/AIforOPS/comments/1uca8v0/how_is_your_team_actually_adopting_ai_at_work/"]
      ]
    },
    {
      id: "managers",
      short: "Managers lack support",
      crowd: "Leadership says adopt. Managers still own the risk.",
      title: "Managers do not have the support to make change stick",
      quote: "People are told to experiment, but their managers still reward the old work and remain accountable when AI fails.",
      work: "Direct managers control workload, quality expectations, meeting norms, disclosure, learning time, and whether failed experiments can be discussed honestly.",
      lens: "What managers are expected to model, which decisions they actually control, and whether incentives, capacity, and accountability support the requested behavior.",
      routes: { identify: 1, establish: 1, scale: 2, leadership: 7 },
      evidence: [
        ["Manager modeling is associated with higher reported value, critical thinking, and trust in agentic AI.", "Microsoft / Work Trend Index 2026", microsoftWti],
        ["Only one in four AI users surveyed said leadership was clearly and consistently aligned on AI.", "Microsoft / Work Trend Index 2026", microsoftWti]
      ]
    },
    {
      id: "measurement",
      short: "Usage without value",
      crowd: "We can count prompts. We cannot point to progress.",
      title: "Organizations measure activity instead of business outcomes",
      quote: "Usage went up. We still cannot say whether cycle time, quality, rework, or customer outcomes changed.",
      work: "License dashboards and self-reported time savings do not show whether a team improved a workflow or redirected recovered capacity into more valuable work.",
      lens: "The before-and-after baseline, who owns the outcome, where value should appear, and what signal would justify continuing, changing, or stopping.",
      routes: { identify: 7, establish: 2, scale: 3, leadership: 1 },
      evidence: [
        ["An enterprise employee described AI access being reduced when the organization could not see enough return.", "Reddit / enterprise workplace", "https://www.reddit.com/r/auscorp/comments/1u215eu/has_anyone_elses_workplace_scaled_back_or_cut_ai/"],
        ["Gallup distinguishes rising organizational integration from consistent job-relevant use.", "Gallup / July 2026", gallupAdoption]
      ]
    },
    {
      id: "load",
      short: "Review overload",
      crowd: "We make more. Now someone has to review more.",
      title: "AI increases review, coordination, and cognitive load",
      quote: "The task got faster. The work of specifying, checking, reconciling, and coordinating expanded.",
      work: "Researchers face more possibilities to validate. Managers receive more status narratives and proposed actions. Senior people become inspection bottlenecks for a growing volume of plausible output.",
      lens: "Where scarce human attention creates the most value, what can be sampled, and whether AI is reducing work or merely increasing the volume that senior people must absorb.",
      routes: { identify: 2, establish: 3, scale: 2, leadership: 1, performance: 4 },
      evidence: [
        ["Atlassian reports role expansion and more cross-functional work without stronger colleague relationships.", "Atlassian / June 2026", "https://www.atlassian.com/blog/ai-at-work/new-research-reveals-how-ai-is-making-jobs-bigger"],
        ["Microsoft places a premium on judgment, clarity of intent, and work design as agent use grows.", "Microsoft / Work Trend Index 2026", microsoftWti]
      ]
    },
    {
      id: "sprawl",
      short: "Tools keep changing",
      crowd: "The stack changes faster than our practices can settle.",
      title: "Tool sprawl and product churn keep breaking routines",
      quote: "The documented workflow changes by plan, product, model, permission, and interface. People fall back to their own systems.",
      work: "Teams move context among ChatGPT, Claude, Copilot, Gemini, custom agents, and function-specific tools. Training assets and standard operating procedures age quickly.",
      lens: "Which capability the work needs, which constraints actually matter, and what vendor-neutral practice can survive the next interface change.",
      routes: { identify: 6, establish: 2, scale: 3 },
      evidence: [
        ["IT leaders describe unsanctioned tool use growing around approved-tool friction.", "Reddit / IT managers", "https://www.reddit.com/r/ITManagers/comments/1v9l90x/our_employees_are_using_chatgpt_and_other_ai/"],
        ["Kyndryl reports that workforce, governance, and operating-model readiness lag the speed of adoption.", "Kyndryl / June 2026", kyndrylTrust]
      ]
    },
    {
      id: "trust",
      short: "Job fear stays hidden",
      crowd: "People wonder if sharing helps train their replacement.",
      title: "Job-security ambiguity suppresses honest participation",
      quote: "People are asked to expose the workarounds and judgment that make their jobs valuable without knowing what will happen to the saved time.",
      work: "Employees hide successful workflows, avoid documenting tacit expertise, or perform adoption symbolically. Managers may hesitate to surface productivity gains if they expect immediate headcount pressure.",
      lens: "The psychological contract around saved time, whose voice shaped the use cases, and whether the change narrative makes honest participation rational.",
      routes: { identify: 2, scale: 1, leadership: 8 },
      evidence: [
        ["Kyndryl argues that distrust can be a rational response to poorly designed use cases and unclear implementation.", "Kyndryl / June 2026", kyndrylTrust],
        ["Microsoft reports a tension between pressure to adapt and the safety of focusing on current goals.", "Microsoft / Work Trend Index 2026", microsoftWti]
      ]
    }
  ];

  var routes = {
    identify: {
      code: "ROUTE 01 / IDENTIFY THE FLOOR",
      title: "Understand where you are",
      summary: "Your mix points to a visibility problem. Before adding another program, make meaningful use, existing workflows, capability variation, and the real friction visible. The goal is a grounded starting point, not a generic maturity score."
    },
    establish: {
      code: "ROUTE 02 / ESTABLISH THE FLOOR",
      title: "Build reliable AI ways of working",
      summary: "Your mix points to a transfer problem. Work on one recurring process per participant, make the quality and judgment requirements explicit, embed measurement, and test whether people can create another process themselves."
    },
    scale: {
      code: "ROUTE 03 / RAISE THE FLOOR",
      title: "Connect what works and scale it",
      summary: "Your mix points to a coordination and operating-system problem. Connect useful workflows through shared context, handoffs, standards, ownership, review, and measurement so capability can move beyond isolated people and teams."
    },
    leadership: {
      code: "ROUTE 04 / RAISE THE CEILING",
      title: "Help leaders guide AI-enabled change",
      summary: "Your mix points to a leadership condition shaping everything else. Clarify the situation, make the consequential decisions, align ownership and incentives, and establish progress signals people can trust."
    },
    performance: {
      code: "ROUTE 05 / RAISE THE CEILING",
      title: "Push high-value work further",
      summary: "Your floor may not be the main constraint. Start with consequential research, strategy, innovation, or specialized knowledge work and explore what already-capable people can do at the edge of current agent capability."
    }
  };

  var positions = [
    [7, 31], [18, 63], [28, 22], [38, 55], [48, 14], [58, 49],
    [68, 24], [78, 57], [89, 30], [14, 12], [84, 10], [52, 70]
  ];
  var values = {};
  var frontier = false;
  var soloIndex = -1;

  var crowd = root.querySelector("[data-crowd]");
  var crowdPeople = root.querySelector("[data-crowd-people]");
  var channelBank = root.querySelector("[data-channel-bank]");
  var helpButton = root.querySelector("[data-help]");
  var resetButton = root.querySelector("[data-reset]");
  var playButton = root.querySelector("[data-play]");
  var frontierButton = root.querySelector("[data-frontier]");
  var roomReadout = root.querySelector("[data-room-readout]");
  var signalCount = root.querySelector("[data-signal-count]");
  var navStatus = document.querySelector("[data-nav-status]");
  var drawer = root.querySelector("[data-solo-drawer]");
  var drawerScrim = root.querySelector("[data-drawer-scrim]");
  var soloClose = root.querySelector("[data-solo-close]");
  var soloMix = root.querySelector("[data-solo-mix]");
  var result = root.querySelector("[data-result]");
  var resultClose = root.querySelector("[data-result-close]");
  var resultRemix = root.querySelector("[data-result-remix]");
  var coach = root.querySelector("[data-coach]");
  var coachCount = root.querySelector("[data-coach-count]");
  var coachKicker = root.querySelector("[data-coach-kicker]");
  var coachTitle = root.querySelector("[data-coach-title]");
  var coachCopy = root.querySelector("[data-coach-copy]");
  var coachNext = root.querySelector("[data-coach-next]");
  var coachSkip = root.querySelector("[data-coach-skip]");
  var crowdButtons = [];
  var channelStrips = [];
  var faders = [];
  var coachStep = 0;

  var coachSteps = [
    {
      kicker: "On the mixing board",
      title: "Raise or lower a channel.",
      copy: "Move a fader up when a problem feels loud in your organization. Pull it down when the signal is weaker."
    },
    {
      kicker: "Under every channel",
      title: "Press Solo to inspect the problem.",
      copy: "Solo opens the real-world signal, how it appears in knowledge work, readable evidence links, and what Joe would listen for."
    },
    {
      kicker: "In the crowd above",
      title: "You can start with the problem itself.",
      copy: "Click any problem you recognize in the crowd. Its channel will turn up automatically. Then keep building your mix."
    }
  ];

  for (var personIndex = 0; personIndex < 60; personIndex += 1) {
    var person = document.createElement("span");
    var row = personIndex % 4;
    var x = (personIndex * 37 + row * 11) % 103;
    var y = -9 + row * 9 + ((personIndex * 7) % 6);
    var scale = .58 + row * .17 + ((personIndex % 5) * .025);
    var opacity = .48 + row * .11;
    person.className = "crowd-person";
    person.style.setProperty("--x", x + "%");
    person.style.setProperty("--y", y + "%");
    person.style.setProperty("--scale", scale.toFixed(2));
    person.style.setProperty("--opacity", Math.min(opacity, .9).toFixed(2));
    person.style.setProperty("--person-color", row < 2 ? "#070604" : "#020201");
    crowdPeople.appendChild(person);
  }

  signals.forEach(function (signal, index) {
    values[signal.id] = 0;

    var crowdButton = document.createElement("button");
    crowdButton.type = "button";
    crowdButton.className = "crowd-signal";
    crowdButton.dataset.signal = signal.id;
    crowdButton.dataset.channel = String(index + 1).padStart(2, "0");
    crowdButton.style.setProperty("--x", positions[index][0] + "%");
    crowdButton.style.setProperty("--y", positions[index][1] + "%");
    crowdButton.textContent = signal.crowd;
    crowdButton.setAttribute("aria-pressed", "false");
    crowdButton.addEventListener("click", function () {
      setValue(index, values[signal.id] > 0 ? 0 : 72);
    });
    crowd.appendChild(crowdButton);
    crowdButtons.push(crowdButton);

    var strip = document.createElement("section");
    strip.className = "channel-strip";
    strip.dataset.signal = signal.id;
    strip.innerHTML = [
      '<span class="channel-number">CH ' + String(index + 1).padStart(2, "0") + "</span>",
      '<span class="channel-led" aria-hidden="true"></span>',
      '<label class="channel-fader-wrap"><span class="sr-only">Intensity for ' + signal.title + '</span><input class="channel-fader" type="range" min="0" max="100" value="0" aria-label="Intensity for ' + signal.title + '"></label>',
      '<button class="channel-solo" type="button">Solo</button>',
      '<span class="channel-name">' + signal.short + "</span>"
    ].join("");
    var fader = strip.querySelector("input");
    var solo = strip.querySelector("button");
    fader.addEventListener("input", function () { setValue(index, Number(fader.value), true); });
    solo.addEventListener("click", function () { openSolo(index); });
    channelBank.appendChild(strip);
    channelStrips.push(strip);
    faders.push(fader);
  });

  function liveIndexes() {
    return signals.map(function (signal, index) {
      return values[signal.id] > 0 ? index : -1;
    }).filter(function (index) { return index >= 0; });
  }

  function setValue(index, value, fromFader) {
    var signal = signals[index];
    var next = Math.max(0, Math.min(100, Number(value) || 0));
    values[signal.id] = next;
    if (!fromFader) faders[index].value = String(next);
    var live = next > 0;
    channelStrips[index].classList.toggle("is-live", live);
    crowdButtons[index].classList.toggle("is-live", live);
    crowdButtons[index].setAttribute("aria-pressed", String(live));
    updateMix();
  }

  function updateMix() {
    var live = liveIndexes();
    var total = live.length + (frontier ? 1 : 0);
    root.classList.toggle("has-signal", total > 0);
    playButton.disabled = total === 0;
    signalCount.textContent = total + (total === 1 ? " signal live" : " signals live");
    navStatus.textContent = total ? total + " live" : "Room quiet";
    if (!total) {
      roomReadout.textContent = "Choose what sounds familiar";
    } else if (frontier && !live.length) {
      roomReadout.textContent = "The floor is stable. The frontier is live.";
    } else if (live.length === 1) {
      roomReadout.textContent = signals[live[0]].crowd;
    } else {
      roomReadout.textContent = live.length + " connected frictions are shaping the room";
    }
    if (soloIndex >= 0) updateSoloButton();
  }

  function openSolo(index) {
    soloIndex = index;
    var signal = signals[index];
    root.querySelector("[data-solo-kicker]").textContent = "Channel " + String(index + 1).padStart(2, "0") + " / Solo / " + signal.short;
    root.querySelector("[data-solo-title]").textContent = signal.title;
    root.querySelector("[data-solo-quote]").textContent = signal.quote;
    root.querySelector("[data-solo-work]").textContent = signal.work;
    root.querySelector("[data-solo-lens]").textContent = signal.lens;
    var evidenceRoot = root.querySelector("[data-solo-evidence]");
    evidenceRoot.innerHTML = "";
    signal.evidence.forEach(function (item) {
      var link = document.createElement("a");
      link.className = "evidence-link";
      link.href = item[2];
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      var title = document.createElement("span");
      var source = document.createElement("small");
      title.textContent = item[0];
      source.textContent = item[1] + " / Read source ↗";
      link.appendChild(title);
      link.appendChild(source);
      evidenceRoot.appendChild(link);
    });
    updateSoloButton();
    drawer.classList.add("is-open");
    drawer.setAttribute("aria-hidden", "false");
    drawerScrim.hidden = false;
    soloClose.focus();
  }

  function updateSoloButton() {
    if (soloIndex < 0) return;
    var live = values[signals[soloIndex].id] > 0;
    soloMix.textContent = live ? "Remove this signal from my mix" : "Add this signal to my mix";
  }

  function closeSolo(returnFocus) {
    if (!drawer.classList.contains("is-open")) return;
    var priorIndex = soloIndex;
    drawer.classList.remove("is-open");
    drawer.setAttribute("aria-hidden", "true");
    drawerScrim.hidden = true;
    soloIndex = -1;
    if (returnFocus && priorIndex >= 0) channelStrips[priorIndex].querySelector("button").focus();
  }

  function calculateRoute() {
    var scores = { identify: 0, establish: 0, scale: 0, leadership: 0, performance: frontier ? 180 : 0 };
    signals.forEach(function (signal) {
      var intensity = values[signal.id] / 100;
      Object.keys(signal.routes).forEach(function (key) {
        scores[key] += signal.routes[key] * intensity;
      });
    });
    return Object.keys(scores).sort(function (a, b) { return scores[b] - scores[a]; })[0];
  }

  function showResult() {
    var routeKey = calculateRoute();
    var route = routes[routeKey];
    var chosen = signals.filter(function (signal) { return values[signal.id] > 0; })
      .sort(function (a, b) { return values[b.id] - values[a.id]; });
    root.querySelector("[data-result-code]").textContent = route.code;
    root.querySelector("[data-result-title]").textContent = route.title;
    root.querySelector("[data-result-summary]").textContent = route.summary;
    var list = root.querySelector("[data-result-signals]");
    list.innerHTML = "";
    chosen.slice(0, 6).forEach(function (signal) {
      var item = document.createElement("li");
      var label = document.createElement("span");
      var level = document.createElement("b");
      label.textContent = signal.short;
      level.textContent = values[signal.id] + "%";
      item.appendChild(label);
      item.appendChild(level);
      list.appendChild(item);
    });
    if (frontier) {
      var frontierItem = document.createElement("li");
      frontierItem.innerHTML = "<span>Push the current frontier</span><b>LIVE</b>";
      list.appendChild(frontierItem);
    }
    var contact = root.querySelector("[data-result-link]");
    contact.href = "/contact/?intent=" + encodeURIComponent(route.title)
      + "&sourcePage=" + encodeURIComponent("/soundcheck/")
      + "&serviceFocus=" + encodeURIComponent(route.title);
    result.classList.add("is-open");
    result.setAttribute("aria-hidden", "false");
    resultClose.focus();
  }

  function closeResult(returnFocus) {
    result.classList.remove("is-open");
    result.setAttribute("aria-hidden", "true");
    if (returnFocus) playButton.focus();
  }

  function resetMix() {
    signals.forEach(function (signal, index) { setValue(index, 0); });
    frontier = false;
    frontierButton.setAttribute("aria-pressed", "false");
    updateMix();
  }

  function showCoach(step) {
    coachStep = Math.max(0, Math.min(coachSteps.length - 1, step));
    var content = coachSteps[coachStep];
    coach.dataset.step = String(coachStep);
    coach.classList.remove("is-done");
    coachCount.textContent = (coachStep + 1) + " of " + coachSteps.length;
    coachKicker.textContent = content.kicker;
    coachTitle.textContent = content.title;
    coachCopy.textContent = content.copy;
    coachNext.textContent = coachStep === coachSteps.length - 1 ? "Start mixing" : "Next";
    coachNext.focus();
  }

  function finishCoach() {
    coach.classList.add("is-done");
    try { window.sessionStorage.setItem("djc-soundcheck-coach-v1", "complete"); } catch (error) { /* storage is optional */ }
    crowdButtons[0].focus();
  }

  helpButton.addEventListener("click", function () { showCoach(0); });
  coachNext.addEventListener("click", function () {
    if (coachStep < coachSteps.length - 1) showCoach(coachStep + 1);
    else finishCoach();
  });
  coachSkip.addEventListener("click", finishCoach);
  resetButton.addEventListener("click", resetMix);
  playButton.addEventListener("click", showResult);
  frontierButton.addEventListener("click", function () {
    frontier = !frontier;
    frontierButton.setAttribute("aria-pressed", String(frontier));
    updateMix();
  });
  soloClose.addEventListener("click", function () { closeSolo(true); });
  drawerScrim.addEventListener("click", function () { closeSolo(true); });
  soloMix.addEventListener("click", function () {
    if (soloIndex < 0) return;
    var current = values[signals[soloIndex].id];
    setValue(soloIndex, current > 0 ? 0 : 72);
  });
  resultClose.addEventListener("click", function () { closeResult(true); });
  resultRemix.addEventListener("click", function () { closeResult(true); });
  document.addEventListener("keydown", function (event) {
    if (event.key !== "Escape") return;
    if (!coach.classList.contains("is-done")) finishCoach();
    else if (result.classList.contains("is-open")) closeResult(true);
    else if (drawer.classList.contains("is-open")) closeSolo(true);
  });

  updateMix();
  var coachComplete = false;
  try { coachComplete = window.sessionStorage.getItem("djc-soundcheck-coach-v1") === "complete"; } catch (error) { coachComplete = false; }
  if (coachComplete) coach.classList.add("is-done");
  else showCoach(0);
}());
