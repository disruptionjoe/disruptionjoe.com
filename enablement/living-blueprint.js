(function () {
  "use strict";

  var pathways = [
    { id: "individual", label: "Individual Capability", short: "Individual", nodes: ["I1","I2","I3","I4"] },
    { id: "team", label: "Team Capability", short: "Team", nodes: ["T1","T2","T3","T4"] },
    { id: "enterprise", label: "Enterprise Capability", short: "Enterprise", nodes: ["E1","E2","E3","E4"] }
  ];

  var roleProfiles = {
    leader: {
      label: "AI Enablement Leader",
      perspective: "I help people and teams build useful, repeatable AI capability across the organization."
    },
    executive: {
      label: "Executive",
      perspective: "I make decisions about business value, investment, risk, priorities, and what should scale."
    },
    champion: {
      label: "Internal Champion",
      perspective: "I help colleagues adopt better ways of working and turn practical examples into shared progress."
    },
    operator: {
      label: "SMB Owner / Operator",
      perspective: "I need practical improvements to recurring work, quality, capacity, and customer outcomes."
    }
  };

  var nodes = {
    I1: node("I1","individual",1,"Useful First Interactions","Learn how to steer AI through safe, work-connected wins.",[],
      ["People are unsure what work to bring into AI.","A generic first answer becomes a reason to stop.","Privacy and visibility concerns keep experimentation shallow."],
      ["Repeat use after the first interaction","More work-connected conversations","Fewer generic-output reactions"],
      "I know a few useful ways AI can help with my real work.",
      ["I2"],["T1"],
      focus("Design the first wins so they generate reusable evidence.","Look for capability change, not attendance or token volume.","Make the safe first interaction visible and easy to repeat.","Start with one recurring task where a useful result matters.")),
    I2: node("I2","individual",2,"Reusable Context","Stop starting from scratch by carrying instructions, examples, files, and decisions forward.",["I1"],
      ["People repeat the same background in every chat.","Useful exchanges disappear into history.","Quality depends on what someone remembers to paste."],
      ["Reusable project spaces appear","Less repeated context-setting","Fewer complaints caused by missing background"],
      "I know how to give AI the context it needs so the work gets better over time.",
      ["I3"],["T1"],
      focus("Teach context as infrastructure, not prompt decoration.","Notice whether knowledge is accumulating into durable assets.","Model one reusable workspace others can understand.","Package the context behind one high-value recurring responsibility.")),
    I3: node("I3","individual",3,"Repeatable Personal Workflows","Turn accidental wins into capabilities that can be run, explained, and improved.",["I2"],
      ["Good results are hard to reproduce.","The best process lives in one person's head.","Prompt tweaking replaces process design."],
      ["Documented AI-assisted workflows","Repeat use across similar tasks","More successful workflows shared with others"],
      "I have a repeatable way of using AI for this kind of work.",
      ["I4","T2","T3"],["T2","T3"],
      focus("Capture the workflow's inputs, judgment points, and evidence of value.","Look for repeatability and transfer, not isolated productivity stories.","Turn your working method into something colleagues can try safely.","Choose the workflow with the clearest time or quality return.")),
    I4: node("I4","individual",4,"Compounding Performance Loops","Move from running workflows manually to reviewing and tuning the system behind the work.",["I3"],
      ["Useful workflows still depend on memory and manual setup.","People optimize outputs instead of the system.","There is no rhythm for reviewing what ran and what improved."],
      ["More condition-triggered workflows","Less manual setup for recurring work","More system improvements than one-off fixes"],
      "I am tuning the system that decides what runs, what improves, and what needs my judgment.",
      ["T4"],["T4"],
      focus("Define review loops and human judgment boundaries before adding autonomy.","Track capacity gained and judgment quality, not only automation counts.","Show the team what was tuned and why, not just what ran.","Create a weekly review of what the system handled and what still needs you.")),
    T1: node("T1","team",1,"Visible Team Capabilities","Make useful individual AI practice visible enough for the team to build on.",["I1","I2"],
      ["Good AI uses stay private.","People duplicate experiments.","Managers hear anecdotes but cannot see patterns."],
      ["More examples captured in demos or retros","Repeated use cases across people","Emerging capabilities named in a shared backlog"],
      "We can see which AI uses are actually helping this team's work.",
      ["T2","E1"],["E1"],
      focus("Create a safe mechanism for surfacing real work without rewarding theater.","Ask which capabilities repeat across roles and produce material value.","Share one credible example and the conditions that made it work.","Run a short capability harvest around real recurring work.")),
    T2: node("T2","team",2,"Shared Work Experiments","Commit to a few bounded AI-supported work areas the team can test together.",["T1","I3"],
      ["Too many ideas compete for attention.","Strong users move ahead alone.","Experiments are too broad to teach the team anything."],
      ["Shared pilots tied to recurring work","Pilot outputs captured in a common space","Agreement on which uses deserve development"],
      "We have a few shared AI pilots tied to work this team actually does.",
      ["T3","E2"],["E2"],
      focus("Design experiments that produce comparable signals and shared learning.","Fund a small portfolio with explicit stop and scale criteria.","Invite colleagues into one bounded test with visible ownership.","Pick one workflow with a meaningful output and a simple success test.")),
    T3: node("T3","team",3,"Reusable Team Workflows","Turn proven capabilities into a shared library with clear inputs, roles, review points, and reuse patterns.",["T2","I3"],
      ["People know examples but not the steps.","Handoffs happen outside the process.","The workflow depends on whoever built it first."],
      ["More workflows in a shared library","Repeat use across team cycles","More workflow-specific quality checks"],
      "We have a library of AI-supported workflows our team can run consistently.",
      ["T4","E3"],["E3"],
      focus("Standardize enough to enable reuse while preserving learning at the edge.","Look for transfer across people, quality consistency, and lower review cost.","Document the steps and judgment points colleagues need to run it well.","Package the workflow so another person can run it without a tour.")),
    T4: node("T4","team",4,"Team Throughput Optimization","Improve the engine that turns people, AI, shared context, and review loops into team outputs.",["T3","I4"],
      ["Teams optimize individual workflows instead of the shared system.","Human review time grows with production.","Nobody can tell which workflows improve throughput or quality."],
      ["Shared outputs scored against quality criteria","Less review time per approved output","More improvements driven by evaluation"],
      "We are improving the engine that turns team inputs into better outputs.",
      ["E4"],["E4"],
      focus("Make evaluation and review capacity part of the workflow architecture.","Compare throughput, quality, risk, and review burden together.","Surface where handoffs or review loops create avoidable friction.","Measure one recurring output from input through approval.")),
    E1: node("E1","enterprise",1,"Structured Adoption Signals","Design pilots and training so they teach the organization what is worth scaling.",["T1"],
      ["Training, pilots, and experiments create disconnected evidence.","Usage grows before leaders know whether it is valuable.","Teams test under different risk assumptions."],
      ["Pilots with workflow scope and success criteria","Training tied to discovery and signal capture","Fewer activities with no shared learning loop"],
      "We are designing AI activities to teach us what is worth scaling.",
      ["E2"],[],
      focus("Define a common signal model without flattening local learning.","Require every funded activity to state what it will teach the organization.","Connect your team's evidence to the wider enablement effort.","Tie each initiative to a business problem and one reusable learning.")),
    E2: node("E2","enterprise",2,"Cross-Team Pattern Recognition","Connect adoption signals so leaders can distinguish repeatable value from activity.",["T2","E1"],
      ["Signals live in separate tools, decks, and updates.","Teams describe success differently.","One-off stories are mistaken for repeatable value."],
      ["Signals captured in a shared format","Patterns identified across functions","More confident investment and shutdown decisions"],
      "We can see which AI uses are creating repeatable value across teams.",
      ["E3"],["E3"],
      focus("Build comparison without turning evidence into a vanity dashboard.","Use patterns to decide where to invest, standardize, or stop.","Help translate local evidence into a form other teams can compare.","Compare a small set of workflows on value, reuse, cost, and risk.")),
    E3: node("E3","enterprise",3,"Scalable Workflow Standards","Turn proven team workflows into reusable standards that keep governance close to the work.",["T3","E2"],
      ["Promising patterns spread through presentations and champions.","Teams rebuild the same workflow.","Governance reviews happen separately from workflow design."],
      ["Standards adopted by multiple teams","Less rebuilding from scratch","Controls embedded directly in workflows"],
      "We know which workflows create value, and we have made them easier for other teams to reuse.",
      ["E4"],["E4"],
      focus("Create living standards with owners, evidence, and revision paths.","Check whether standards accelerate safe reuse rather than add approval layers.","Keep practitioner evidence and exceptions visible as standards mature.","Adopt a proven workflow package before designing a broad platform.")),
    E4: node("E4","enterprise",4,"Safe Autonomous Work Loops","Use evaluation, cost, risk, and workflow performance to improve autonomy boundaries over time.",["T4","E3"],
      ["Standards become static documents.","Automation expands faster than evaluation.","Nobody knows which work can run safely before review."],
      ["Workflows with evaluation and review thresholds","Longer safe agent work loops","Fewer unnecessary low-risk checkpoints"],
      "We know where agents can work autonomously, where humans review, and how those boundaries improve.",
      [],[],
      focus("Treat autonomy as a governed boundary that changes with evidence.","Ask whether risk, cost, and performance remain legible as autonomy expands.","Make the human review contract concrete and observable.","Automate only where the quality test and stop condition are already clear."))
  };

  function node(id,pathway,order,title,framing,prerequisites,before,signals,after,unlocks,related,lensFocus) {
    return { id:id,pathway:pathway,order:order,title:title,framing:framing,prerequisites:prerequisites,before:before,signals:signals,after:after,unlocks:unlocks,related:related,lensFocus:lensFocus };
  }
  function focus(leader,executive,champion,operator) { return { leader:leader,executive:executive,champion:champion,operator:operator }; }

  var state = { current: null, lens: "leader", detail: null, history: [], travelMode: "entry" };
  var app = byId("architecture-app");
  var intro = byId("intro-screen");
  var end = byId("end-screen");
  var navigation = byId("node-navigation");
  var detail = byId("sphere-detail");

  function byId(id) { return document.getElementById(id); }
  function pathwayFor(id) { return pathways.find(function (path) { return path.id === nodes[id].pathway; }); }
  function nodeLabel(id) { return nodes[id] ? nodes[id].title : id; }

  function renderNavigation() {
    navigation.innerHTML = pathways.map(function (path) {
      return '<section class="pathway-group"><div class="pathway-heading"><span>' + path.label + '</span><span>0' + (pathways.indexOf(path)+1) + '</span></div><div class="node-list">' +
        path.nodes.map(function (id) {
          return '<button class="map-node" type="button" data-node="' + id + '" aria-current="false"><span>' + nodes[id].title + '</span></button>';
        }).join("") + '</div></section>';
    }).join("");
  }

  function enterArchitecture(id) {
    intro.hidden = true; end.hidden = true; app.hidden = false;
    byId("skip-link").href = "#node-territory";
    byId("skip-link").textContent = "Skip to current capability";
    travelTo(id, "entry", false);
  }

  function travelTo(id, mode, pushHistory) {
    if (!nodes[id]) return;
    if (pushHistory !== false && state.current && state.current !== id) state.history.push(state.current);
    state.current = id; state.detail = null; state.travelMode = mode || "jump"; detail.hidden = true;
    document.querySelectorAll(".sphere").forEach(function (sphere) { sphere.setAttribute("aria-expanded","false"); });
    var territory = byId("node-territory");
    territory.classList.add("is-traveling");
    window.setTimeout(function () { territory.classList.remove("is-traveling"); }, 520);
    renderNode(mode);
    history.replaceState(null, "", "#" + id.toLowerCase());
    if (window.innerWidth < 721) setMobileMap(false);
  }

  function renderNode(mode) {
    var current = nodes[state.current];
    var path = pathwayFor(state.current);
    byId("node-coordinate").textContent = path.short + " capability / 0" + current.order;
    byId("node-title").textContent = current.title;
    byId("node-framing").textContent = current.framing;
    byId("mobile-location").textContent = path.short + " 0" + current.order;
    byId("diagnosis-prompt").textContent = buildDiagnosisPrompt(current, roleProfiles[state.lens]);
    byId("copy-status").textContent = "";
    document.querySelectorAll(".map-node").forEach(function (button) {
      button.setAttribute("aria-current", button.dataset.node === state.current ? "true" : "false");
    });
    var previous = path.nodes[current.order - 2];
    var next = path.nodes[current.order];
    byId("back-node").disabled = !previous && state.history.length === 0;
    byId("back-node").textContent = previous ? "Back" : "Return";
    byId("next-node").textContent = next ? "Continue" : (state.current === "E4" ? "Complete" : "Explore next layer");
    var travelMode = mode === "lens" ? state.travelMode : mode;
    byId("travel-context").textContent = travelMode === "dependency" ? "Dependency trail" : travelMode === "unlock" ? "Future-state trail" : path.label;
    announce("Arrived at " + current.title);
  }

  function buildDiagnosisPrompt(current, role) {
    var prerequisites = current.prerequisites.length
      ? current.prerequisites.map(nodeLabel).join(", ")
      : "No earlier capability is required; this can be a starting point.";

    return [
      "Help me diagnose our current capability: " + current.title + ".",
      "",
      "My perspective: " + role.label + ". " + role.perspective,
      "",
      "First, inspect any workspace files, connected knowledge, and past conversation history you are actually able and authorized to access. Do not claim access you do not have. Briefly state what you could inspect and what you could not.",
      "",
      "Use this evidence frame:",
      "- This capability is about: " + current.framing,
      "- It builds on: " + prerequisites,
      "- Possible signs we are stuck: " + current.before.join("; "),
      "- Evidence it is working: " + current.signals.join("; "),
      "- The practical outcome we want: " + current.after,
      "- Pay particular attention to this role-specific concern: " + current.lensFocus[state.lens],
      "",
      "Start by asking me exactly three open-ended questions about my role, what I see happening in the work, and where progress feels blocked. Ask all three together, then wait for my answers.",
      "",
      "After I answer, produce:",
      "1. A concise diagnosis grounded in the evidence you found and what I told you.",
      "2. What appears strong, what is uncertain, and what is missing.",
      "3. The most important constraint holding this capability back.",
      "4. Three practical next steps, ordered by leverage and effort.",
      "5. One action I can take this week and one signal that would show it helped.",
      "",
      "Use plain language. Separate observed evidence from inference. Do not give me a maturity score or use specialist jargon. Refer to this as a capability."
    ].join("\n");
  }

  function copyDiagnosisPrompt() {
    var text = byId("diagnosis-prompt").textContent;
    var copied = function () {
      byId("copy-status").textContent = "Copied. Paste it into the AI system that knows your work.";
      announce("Diagnosis prompt copied");
    };
    var failed = function () {
      byId("copy-status").textContent = "Copy was blocked. Select the prompt text and copy it manually.";
    };

    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(text).then(copied, failed);
      return;
    }

    var field = document.createElement("textarea");
    field.value = text;
    field.setAttribute("readonly", "");
    field.style.position = "fixed";
    field.style.opacity = "0";
    document.body.appendChild(field);
    field.select();
    try {
      document.execCommand("copy") ? copied() : failed();
    } catch (error) {
      failed();
    }
    field.remove();
  }

  function showDetail(type) {
    var current = nodes[state.current];
    state.detail = type;
    document.querySelectorAll(".sphere").forEach(function (sphere) {
      sphere.setAttribute("aria-expanded", sphere.dataset.sphere === type ? "true" : "false");
    });
    var titles = {
      prerequisites:"What must be true first?",
      before:"What does stuck look like?",
      signals:"What proves this is working?",
      after:"What does this unlock?"
    };
    byId("detail-kicker").textContent = pathwayFor(state.current).label;
    byId("detail-title").textContent = titles[type];
    var html = "";
    if (type === "prerequisites") {
      html = current.prerequisites.length
        ? "<p>This capability builds on work established elsewhere in the architecture.</p>" + current.prerequisites.map(function (id) { return '<button class="node-link" type="button" data-detail-node="' + id + '">' + nodeLabel(id) + "</button>"; }).join("")
        : "<p>This is an entry point. It can begin before the rest of the architecture is mature.</p>";
    } else if (type === "before") {
      html = "<ul>" + current.before.map(function (item) { return "<li>" + item + "</li>"; }).join("") + "</ul>";
    } else if (type === "signals") {
      html = "<ul>" + current.signals.map(function (item) { return "<li>" + item + "</li>"; }).join("") + "</ul>";
      if (current.unlocks.length) html += "<p>Follow what this can unlock:</p>" + current.unlocks.map(function (id) { return '<button class="node-link" type="button" data-unlock-node="' + id + '">' + nodeLabel(id) + "</button>"; }).join("");
    } else {
      html = '<p class="state-quote">"' + current.after + '"</p><p>Choose your role and copy the diagnosis prompt to turn this into a practical next-step conversation with your AI system.</p>';
      if (current.related.length) html += "<p>Explore a related future state:</p>" + current.related.map(function (id) { return '<button class="node-link" type="button" data-unlock-node="' + id + '">' + nodeLabel(id) + "</button>"; }).join("");
    }
    byId("detail-content").innerHTML = html;
    detail.hidden = false;
    byId("detail-close").focus();
  }

  function closeDetail() {
    if (!state.detail) return;
    var returnTarget = document.querySelector('.sphere[data-sphere="' + state.detail + '"]');
    state.detail = null; detail.hidden = true;
    document.querySelectorAll(".sphere").forEach(function (sphere) { sphere.setAttribute("aria-expanded","false"); });
    if (returnTarget) returnTarget.focus();
  }

  function continueTravel() {
    var current = nodes[state.current];
    var path = pathwayFor(state.current);
    var next = path.nodes[current.order];
    if (next) return travelTo(next, "forward");
    if (state.current === "I4") return travelTo("T1", "unlock");
    if (state.current === "T4") return travelTo("E1", "unlock");
    showEnd();
  }

  function backTravel() {
    var current = nodes[state.current];
    var path = pathwayFor(state.current);
    var previous = path.nodes[current.order - 2];
    if (previous) return travelTo(previous, "back", false);
    var historical = state.history.pop();
    if (historical) return travelTo(historical, "back", false);
    restart();
  }

  function showEnd() {
    app.hidden = true; intro.hidden = true; end.hidden = false;
    history.replaceState(null, "", "#complete");
    byId("end-title").focus();
  }

  function restart() {
    state.current = null; state.detail = null; state.history = [];
    detail.hidden = true; app.hidden = true; end.hidden = true; intro.hidden = false;
    history.replaceState(null, "", window.location.pathname);
    byId("skip-link").href = "#pathway-choices";
    byId("skip-link").textContent = "Skip to starting choices";
    byId("intro-title").focus();
  }

  function setMobileMap(open) {
    var map = byId("architecture-map");
    var toggle = byId("mobile-map-toggle");
    if (window.innerWidth < 721) {
      map.classList.toggle("is-open", !!open);
      map.setAttribute("aria-hidden", open ? "false" : "true");
      if (open) map.removeAttribute("inert");
      else map.setAttribute("inert", "");
      toggle.setAttribute("aria-expanded", open ? "true" : "false");
    } else {
      map.classList.remove("is-open");
      map.removeAttribute("aria-hidden");
      map.removeAttribute("inert");
      toggle.setAttribute("aria-expanded", "false");
    }
  }

  function announce(message) {
    var existing = byId("architecture-announcer");
    if (!existing) {
      existing = document.createElement("div");
      existing.id = "architecture-announcer";
      existing.className = "skip-link";
      existing.setAttribute("aria-live","polite");
      document.body.appendChild(existing);
    }
    existing.textContent = message;
  }

  renderNavigation();
  document.addEventListener("click", function (event) {
    var start = event.target.closest("[data-start-node]");
    var mapNode = event.target.closest("[data-node]");
    var sphere = event.target.closest("[data-sphere]");
    var dependency = event.target.closest("[data-detail-node]");
    var unlock = event.target.closest("[data-unlock-node]");
    var lens = event.target.closest("[data-lens]");
    if (start) enterArchitecture(start.dataset.startNode);
    if (mapNode) travelTo(mapNode.dataset.node, "jump");
    if (sphere) showDetail(sphere.dataset.sphere);
    if (dependency) travelTo(dependency.dataset.detailNode, "dependency");
    if (unlock) travelTo(unlock.dataset.unlockNode, "unlock");
    if (lens) {
      state.lens = lens.dataset.lens;
      document.querySelectorAll("[data-lens]").forEach(function (button) { button.setAttribute("aria-pressed", button === lens ? "true" : "false"); });
      if (state.current) renderNode("lens");
    }
  });

  byId("detail-close").addEventListener("click", closeDetail);
  byId("next-node").addEventListener("click", continueTravel);
  byId("back-node").addEventListener("click", backTravel);
  byId("restart-button").addEventListener("click", restart);
  byId("copy-prompt").addEventListener("click", copyDiagnosisPrompt);
  byId("return-to-map").addEventListener("click", function () { enterArchitecture(state.current || "I1"); });
  byId("mobile-map-toggle").addEventListener("click", function () {
    setMobileMap(!byId("architecture-map").classList.contains("is-open"));
  });
  byId("contact-form").addEventListener("submit", function (event) {
    event.preventDefault();
    byId("form-status").textContent = "No information was sent. Note delivery is not connected yet.";
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") closeDetail();
    if (!state.current || !detail.hidden) return;
    if (event.key === "ArrowRight") continueTravel();
    if (event.key === "ArrowLeft") backTravel();
  });
  window.addEventListener("resize", function () { setMobileMap(false); });

  var hash = window.location.hash.replace("#","").toUpperCase();
  setMobileMap(false);
  if (nodes[hash]) enterArchitecture(hash);
  else if (window.location.hash === "#complete") showEnd();
}());
