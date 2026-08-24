(function () {
  "use strict";

  var root = document.querySelector("[data-thinking-game]");
  if (!root) return;

  var capacityMetrics = window.DJC_CAPACITYOS_METRICS || {};
  var researchProjectMetrics = capacityMetrics.researchProjects || {};
  var developmentProjectMetrics = capacityMetrics.developmentProjects || {};

  function formatMetric(value) {
    return Number.isFinite(value) ? value.toLocaleString("en-US") : "—";
  }

  function formatMetricDate(value) {
    if (!value) return "—";
    var date = new Date(value + "T12:00:00");
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("en-US", {
      month: "long",
      day: "numeric"
    }).format(date);
  }

  function planningContactLink(intent) {
    return "/contact/?intent=" + encodeURIComponent(intent)
      + "&sourcePage=" + encodeURIComponent("/thinking/")
      + "&serviceFocus=" + encodeURIComponent(intent);
  }

  var museumShare = {
    url: "https://disruptionjoe.com/thinking/",
    display: "disruptionjoe.com/thinking",
    title: "Disruption Joe's Thinking Museum",
    text: "Walk the rooms where Joe builds his thinking. A first-person museum, not a landing page."
  };

  var shareGlyphs = {
    x: [
      { tag: "path", fill: "currentColor", d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" }
    ],
    linkedin: [
      { tag: "path", fill: "currentColor", d: "M20.45 20.45h-3.56v-5.57c0-1.33-.03-3.04-1.85-3.04-1.86 0-2.14 1.45-2.14 2.94v5.67H9.35V9h3.41v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28ZM5.34 7.43a2.07 2.07 0 1 1 0-4.14 2.07 2.07 0 0 1 0 4.14ZM7.12 20.45H3.56V9h3.56v11.45ZM22.22 0H1.77C.8 0 0 .78 0 1.73v20.54C0 23.22.8 24 1.77 24h20.45c.98 0 1.78-.78 1.78-1.73V1.73C24 .78 23.2 0 22.22 0Z" }
    ],
    email: [
      { tag: "rect", x: "2.9", y: "4.9", width: "18.2", height: "14.2", fill: "none", stroke: "currentColor", "stroke-width": "1.6" },
      { tag: "path", d: "m3.6 6.2 8.4 6.5 8.4-6.5", fill: "none", stroke: "currentColor", "stroke-width": "1.6", "stroke-linecap": "round", "stroke-linejoin": "round" }
    ],
    copy: [
      { tag: "rect", x: "8.9", y: "8.9", width: "11.2", height: "11.2", rx: "1.8", fill: "none", stroke: "currentColor", "stroke-width": "1.6" },
      { tag: "path", d: "M15.6 5.4H5.7a1.8 1.8 0 0 0-1.8 1.8v9.9", fill: "none", stroke: "currentColor", "stroke-width": "1.6", "stroke-linecap": "round" }
    ],
    share: [
      { tag: "path", d: "M12 3.3v10.4", fill: "none", stroke: "currentColor", "stroke-width": "1.6", "stroke-linecap": "round" },
      { tag: "path", d: "m8.4 6.7 3.6-3.4 3.6 3.4", fill: "none", stroke: "currentColor", "stroke-width": "1.6", "stroke-linecap": "round", "stroke-linejoin": "round" },
      { tag: "path", d: "M7.2 10.6H4.4v10.1h15.2V10.6h-2.8", fill: "none", stroke: "currentColor", "stroke-width": "1.6", "stroke-linecap": "round", "stroke-linejoin": "round" }
    ]
  };

  var shareRackCount = 0;

  function svgNode(tag, attributes) {
    var node = document.createElementNS("http://www.w3.org/2000/svg", tag);
    Object.keys(attributes).forEach(function (key) {
      node.setAttribute(key, attributes[key]);
    });
    return node;
  }

  function shareGlyph(name) {
    var svg = svgNode("svg", {
      viewBox: "0 0 24 24",
      width: "17",
      height: "17",
      "aria-hidden": "true",
      focusable: "false"
    });
    (shareGlyphs[name] || []).forEach(function (shape) {
      var attributes = {};
      Object.keys(shape).forEach(function (key) {
        if (key !== "tag") attributes[key] = shape[key];
      });
      svg.appendChild(svgNode(shape.tag, attributes));
    });
    return svg;
  }

  function shareLabel(text) {
    var span = document.createElement("span");
    span.className = "game-share-label";
    span.textContent = text;
    return span;
  }

  function canNativeShare() {
    return typeof navigator.share === "function" && window.isSecureContext;
  }

  function shareIntentUrl(key) {
    var address = encodeURIComponent(museumShare.url);
    if (key === "x") {
      return "https://x.com/intent/post?url=" + address
        + "&text=" + encodeURIComponent(museumShare.text)
        + "&via=DisruptionJoe";
    }
    if (key === "linkedin") {
      return "https://www.linkedin.com/sharing/share-offsite/?url=" + address;
    }
    return "mailto:?subject=" + encodeURIComponent(museumShare.title)
      + "&body=" + encodeURIComponent(museumShare.text + "\n\n" + museumShare.url);
  }

  function createShareRack(options) {
    var config = options || {};
    var isSheet = config.variant === "sheet";
    var toggles = [];
    var lastTrigger = null;
    var isOpen = false;
    var closeTimer = 0;

    shareRackCount += 1;

    var rack = document.createElement("div");
    rack.className = isSheet ? "game-share is-sheet" : "game-share";
    rack.id = "game-share-rack-" + shareRackCount;
    rack.hidden = true;
    rack.setAttribute("role", "group");
    rack.setAttribute("aria-label", "Share the Thinking Museum");

    var backdrop = null;
    if (isSheet) {
      backdrop = document.createElement("div");
      backdrop.className = "game-share-backdrop";
      backdrop.hidden = true;
      backdrop.setAttribute("aria-hidden", "true");
      backdrop.addEventListener("click", function () { close(); });

      var handle = document.createElement("span");
      handle.className = "game-share-handle";
      handle.setAttribute("aria-hidden", "true");
      rack.appendChild(handle);
    }

    var kicker = document.createElement("p");
    kicker.className = "game-share-kicker";
    kicker.textContent = "Send someone in";
    rack.appendChild(kicker);

    var address = document.createElement("a");
    address.className = "game-share-url";
    address.href = museumShare.url;
    address.textContent = museumShare.display;
    rack.appendChild(address);

    var destinations = document.createElement("div");
    destinations.className = "game-share-row";
    [
      { key: "x", label: "X", description: "Post the museum on X" },
      { key: "linkedin", label: "LinkedIn", description: "Post the museum on LinkedIn" },
      { key: "email", label: "Email", description: "Email the museum to someone" }
    ].forEach(function (destination) {
      var link = document.createElement("a");
      link.className = "game-share-link";
      link.href = shareIntentUrl(destination.key);
      link.setAttribute("aria-label", destination.description);
      if (destination.key !== "email") {
        link.target = "_blank";
        link.rel = "noopener noreferrer";
      }
      link.appendChild(shareGlyph(destination.key));
      link.appendChild(shareLabel(destination.label));
      destinations.appendChild(link);
    });
    rack.appendChild(destinations);

    var actions = document.createElement("div");
    actions.className = "game-share-row is-actions";

    if (canNativeShare()) {
      var nativeButton = document.createElement("button");
      nativeButton.type = "button";
      nativeButton.className = "game-share-action is-primary";
      nativeButton.appendChild(shareGlyph("share"));
      nativeButton.appendChild(shareLabel("Share to an app"));
      nativeButton.addEventListener("click", shareToApp);
      actions.appendChild(nativeButton);
    }

    var copyButton = document.createElement("button");
    copyButton.type = "button";
    copyButton.className = "game-share-action";
    copyButton.appendChild(shareGlyph("copy"));
    copyButton.appendChild(shareLabel("Copy the link"));
    copyButton.addEventListener("click", copyLink);
    actions.appendChild(copyButton);

    rack.appendChild(actions);

    var statusLine = document.createElement("p");
    statusLine.className = "game-share-status";
    statusLine.setAttribute("role", "status");
    statusLine.setAttribute("aria-live", "polite");
    rack.appendChild(statusLine);

    if (isSheet) {
      var done = document.createElement("button");
      done.type = "button";
      done.className = "game-share-done";
      done.textContent = "Done";
      done.addEventListener("click", function () { close(); });
      rack.appendChild(done);
    }

    function announce(message) {
      statusLine.textContent = message;
    }

    function shareToApp() {
      navigator.share({
        title: museumShare.title,
        text: museumShare.text,
        url: museumShare.url
      }).then(function () {
        announce("Sent.");
      }, function (error) {
        if (error && error.name === "AbortError") return;
        copyLink();
      });
    }

    function copyLink() {
      var copied = function () {
        address.textContent = museumShare.display;
        announce("Link copied. Paste it wherever you want it.");
      };
      var failed = function () {
        address.textContent = museumShare.url;
        var selection = window.getSelection();
        var range = document.createRange();
        range.selectNodeContents(address);
        selection.removeAllRanges();
        selection.addRange(range);
        announce("Copy was blocked. The link is selected, so copy it by hand.");
      };

      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(museumShare.url).then(copied, failed);
        return;
      }

      var field = document.createElement("textarea");
      field.value = museumShare.url;
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

    function syncToggles() {
      toggles.forEach(function (button) {
        button.setAttribute("aria-expanded", isOpen ? "true" : "false");
      });
    }

    function open(trigger) {
      if (isOpen) return;
      isOpen = true;
      lastTrigger = trigger || null;
      if (closeTimer) {
        window.clearTimeout(closeTimer);
        closeTimer = 0;
      }
      announce("");
      address.textContent = museumShare.display;
      rack.hidden = false;
      if (backdrop) backdrop.hidden = false;
      window.requestAnimationFrame(function () {
        rack.classList.add("is-open");
        if (backdrop) backdrop.classList.add("is-open");
      });
      syncToggles();
      if (config.onOpen) config.onOpen();
    }

    function close(restoreFocus) {
      if (!isOpen) return;
      isOpen = false;
      rack.classList.remove("is-open");
      if (backdrop) backdrop.classList.remove("is-open");
      if (closeTimer) window.clearTimeout(closeTimer);
      closeTimer = window.setTimeout(function () {
        rack.hidden = true;
        if (backdrop) backdrop.hidden = true;
        closeTimer = 0;
      }, isSheet ? 300 : 0);
      syncToggles();
      if (config.onClose) config.onClose();
      if (restoreFocus !== false && lastTrigger) lastTrigger.focus({ preventScroll: true });
      lastTrigger = null;
    }

    function register(button) {
      toggles.push(button);
      button.setAttribute("aria-expanded", "false");
      button.setAttribute("aria-controls", rack.id);
      button.addEventListener("click", function () {
        if (isOpen) close();
        else open(button);
      });
      return button;
    }

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && isOpen) close();
    });

    return {
      element: rack,
      backdrop: backdrop,
      open: open,
      close: close,
      register: register,
      isOpen: function () { return isOpen; }
    };
  }

  var capacityStaticStat = {
    value: formatMetric(capacityMetrics.synchronizedRepositories),
    label: "repositories synchronized"
  };

  var researchStaticStat = {
    value: formatMetric(capacityMetrics.publishedResearchRecords),
    label: "published papers",
    supportingLabel: "across Joe's active research programs"
  };

  var exhibits = [
    {
      title: "AI Epistemology",
      staticKicker: "AI EPISTEMOLOGY",
      staticTitle: "See the learning system behind Joe's frontier work",
      purpose: "AI Epistemology is the active research repository behind Capability Acceleration. Joe uses it to compare what frontier models do best with what open-source models can reliably carry, direct agent fleets, experiment with how work is requested, and test ways to keep agents from getting stuck in familiar loops.",
      mobileCardLabel: "Supporting System / Learning",
      dynamicTitle: "See how Joe keeps agents from getting stuck",
      passion: "The repository captures experiments in model choice, requests, context, coordination, and different kinds of thinking. Joe studies how agent fleets can divide work, how varied approaches can escape local minima, and which combinations produce useful results instead of circling the same answer. It is an ongoing learning system, not a packaged experience.",
      image: "/assets/thinking/parallax-spheres.jpg",
      link: null,
      hideDynamicKicker: true
    },
    {
      title: "AI Activation Playbooks",
      staticKicker: "AI ACTIVATION PLAYBOOKS",
      staticTitle: "See the methodology for transferring what Joe learns",
      purpose: "AI Activation Playbooks are the structured transfer mechanism Joe uses across facilitation, diagnostics, Enablement Architecture, Capability Acceleration, and other client work. He continually turns lessons from delivery and experimentation into reusable methods, arcs, plays, moves, and assets.",
      mobileCardLabel: "Supporting System / Transfer",
      dynamicTitle: "Inspect how knowledge becomes a repeatable method",
      passion: "The Playbook Experience shows the structure behind that transfer: how Joe frames the work, sequences an arc, combines plays and moves, and captures what proves useful so other people and teams can apply it. The content keeps evolving; the discipline of turning learning into a usable playbook stays consistent.",
      image: "/assets/thinking/activation-playbook-table.jpg",
      mobileImageFit: "diagram",
      link: "/playbook/",
      linkLabel: "Enter the Playbook Experience",
      linkStyle: "experience",
      linkTarget: "_self",
      hideDynamicKicker: true
    },
    {
      title: "AI Enablement Architecture",
      staticKicker: "AI ENABLEMENT ARCHITECTURE",
      staticTitle: "See where you are on the path to business value",
      purpose: "The AI Enablement Architecture helps leaders locate their organization on the path from uneven AI use to results that are consistent, measurable, scalable, reliable, and tied to business outcomes. It makes the prerequisites and path dependencies visible.",
      mobileCardLabel: "Supporting System / Path",
      dynamicTitle: "Explore your next viable step",
      passion: "Use the interactive experience to explore 12 connected capabilities across individual, team, and enterprise levels. See what must be true first, what stuck looks like, what proves progress, and what each step unlocks. Then take role-specific prompts into your own AI tool for a guided self-assessment.",
      image: "/assets/method/ai-enablement-architecture-chicago-4.jpg",
      imageWidth: 1.22,
      imageHeight: 1.82,
      link: "/enablement/",
      linkLabel: "Enter the Architecture Experience",
      linkStyle: "experience",
      linkTarget: "_self",
      hideDynamicKicker: true
    },
    {
      title: "Thinking Wiki",
      staticKicker: "THINKING WIKI",
      staticTitle: "A living record of how I think",
      purpose: "Built using Obsidian to connect ideas, evidence, decisions, and durable principles across projects, the wiki gives my agents structured context instead of a pile of notes.",
      dynamicTitle: "Ideas keep their history here",
      passion: "Automations capture and metabolize my thinking, preserve how ideas change, and turn the connections into a visible graph. Daily notes and agent activity become a living memory that surfaces patterns worth carrying forward.",
      image: "/assets/thinking/thinking-wiki.jpg",
      link: null,
      hideDynamicKicker: true,
      proximityRange: 1.55
    },
    {
      title: "Disruption Joe Profile",
      staticKicker: "DISRUPTION JOE PROFILE",
      staticTitle: "My résumé for the agent age",
      purpose: "A structured, evidence-backed record of my experience, projects, capabilities, and current interests, designed to stay useful as they change.",
      mobilePurpose: "I maintain a structured, evidence-backed record of my experience, projects, capabilities, and current interests so people and agents can explore more than a conventional résumé can show.",
      mobileDirectLink: true,
      mobileLinkLabel: "Explore My Agent Profile",
      mobileLinkTarget: "_blank",
      mobileHideDirectHint: true,
      dynamicTitle: "Ask the questions a résumé cannot answer",
      passion: "Point your agent at the profile and ask what you want to know about me. It can follow the evidence and explain how the different parts of my background connect.",
      image: "/assets/thinking/disruptionjoe-profile-avatar.jpg",
      link: "https://github.com/disruptionjoe/disruptionjoe-profile",
      linkLabel: "Open My Public Profile",
      hideDynamicKicker: true,
      proximityRange: 1.55
    },
    {
      title: "Disruption Joe Website",
      staticKicker: "DISRUPTION JOE WEBSITE",
      staticTitle: "The public front door to my practice",
      purpose: "This site brings my offers, methods, research, evidence, and personality into one place so people can understand what I do and choose where to go next.",
      mobilePurpose: "I use this website as a living demonstration of my practice. It brings my offers, methods, research, and evidence together in one experience that can evolve with the work.",
      mobilePassion: "The same agent system that supports my practice helps turn changes in the work into changes here. The site stays current while giving me a place to test better ways to explain complex ideas.",
      mobileRevealLabel: "See How I Use It",
      mobileHideDirectHint: true,
      dynamicTitle: "A public surface that evolves with me",
      passion: "As my methods, offers, evidence, and projects change, the website gives them a clear public expression.",
      image: "/assets/thinking/disruptionjoe-website-room.jpg",
      link: null,
      action: "respawn",
      actionLabel: "Enter Website",
      hideDynamicKicker: true
    },
    {
      title: "DJC Governance Operations",
      purpose: "Keep DJC an intentional, coherent practice as its independent repositories evolve, so good work can compound without authority drift, conflicting promises, or a hidden central controller.",
      passion: "See how a distributed practice stays oriented without absorbing local truth or turning coordination into control.",
      image: "/assets/thinking/permissions-gap.jpg",
      link: null,
      hiddenFromExperience: true
    },
    {
      title: "Joe Project Management",
      staticKicker: "JOE PROJECT MANAGEMENT",
      staticTitle: "Give cross-boundary projects a clear path",
      purpose: "Some priorities span repositories, lack a natural owner, or begin too ambiguously to execute. Joe Project Management gives them a place to be shaped and carried forward.",
      mobilePurpose: "I give ambiguous, cross-boundary priorities a place to become clear before assigning the work. That keeps ownership, dependencies, and decisions visible without forcing everything into one system.",
      mobilePassion: "I use this when the problem is real but the execution path is not. It helps me define the outcome, find the right owner, and expose the decisions that must happen first.",
      mobileRevealLabel: "See How I Use It",
      mobileHideDirectHint: true,
      dynamicTitle: "Shape the problem before managing the project",
      passion: "The repository clarifies outcomes, ownership, dependencies, and decision gates, then routes implementation to the right system when it is ready.",
      image: "/assets/thinking/joeops-circuits.jpg",
      link: null,
      hideDynamicKicker: true
    },
    {
      title: "CapacityOS",
      staticKicker: "CAPACITYOS · UPDATED DAILY",
      staticTitle: "My operating system for working with agents",
      purpose: "Create more useful, reliable progress per unit of Joe's attention while preserving ownership, safety, and recoverability.",
      dynamicTitle: "More progress per unit of my attention",
      passion: "CapacityOS coordinates my agents, repositories, memory, and approved workflows so they can make reliable progress without blurring ownership or turning me into the routing layer.",
      image: "/assets/thinking/capacityos-cockpit.jpg",
      link: null,
      staticStat: capacityStaticStat,
      hideDynamicKicker: true,
      stats: [
        { value: formatMetric(capacityMetrics.trackedFiles), label: "tracked files · total" },
        { value: formatMetric(capacityMetrics.commitsLastSevenDays), label: "commits · last 7 days" },
        { value: formatMetric(capacityMetrics.trackedAgentRuns), label: "agent runs · tracked total" },
        { value: formatMetric(capacityMetrics.thinkingWikiGraphLinks), label: "Thinking Wiki graph links" }
      ]
    },
    {
      title: "Church of AI",
      staticKicker: "CHURCH OF AI",
      staticTitle: "A public experiment in voluntary cooperation",
      purpose: "Church of AI explores whether people can build legitimate, positive-sum institutions for shared problems without coercion or permanent central control.",
      mobileCardLabel: "Church of AI",
      mobileTitle: "Can voluntary cooperation work without permanent central control?",
      mobilePurpose: "I am building Church of AI as a public experiment in whether people can create legitimate, positive-sum institutions for shared problems without coercion or permanent central control.",
      mobileDirectLink: true,
      mobileLinkLabel: "View on GitHub",
      mobileLinkTarget: "_blank",
      mobileHideDirectHint: true,
      dynamicTitle: "See where the experiment stands today",
      passion: "The public repository separates active projects, supported claims, and deferred ideas so the mission can develop without implying participation or proof that does not yet exist.",
      image: "/assets/thinking/threshold-door.jpg",
      link: "https://github.com/disruptionjoe/church-of-ai",
      linkLabel: "Open the Public Repository",
      hideDynamicKicker: true
    },
    {
      title: "Time as Finality",
      staticKicker: "TIME AS FINALITY",
      staticTitle: "Can AI agents connect distant fields without losing rigor?",
      purpose: "This project tests whether accumulating records, and their differing resistance to reversal, can help explain structures associated with relativity and quantum dynamics.",
      mobileCardLabel: "Time as Finality",
      mobileMetricsKey: "time-as-finality",
      mobileDirectLink: true,
      mobileLinkLabel: "View on GitHub",
      mobileLinkTarget: "_blank",
      dynamicTitle: "Put computing and physics in the same argument",
      passion: "The research asks whether ideas from distributed records can illuminate physical law without dissolving either field into metaphor. Open the public repository to examine the argument, its formal development, and where the proposed connection could fail.",
      image: "/assets/thinking/path-in-the-dark.jpg",
      link: "https://github.com/disruptionjoe/time-as-finality",
      linkLabel: "Open the Public Repository",
      hideDynamicKicker: true
    },
    {
      title: "Temporal Issuance",
      staticKicker: "TEMPORAL ISSUANCE",
      staticTitle: "Can AI agents turn a difficult intuition into a claim that can fail?",
      purpose: "This research tests whether reality requires an ongoing process that introduces genuine novelty, then works to express that idea precisely enough for evidence to strengthen, narrow, or reject it.",
      mobileCardLabel: "Temporal Issuance",
      mobileMetricsKey: "temporal-issuance",
      mobileDirectLink: true,
      mobileLinkLabel: "View on GitHub",
      mobileLinkTarget: "_blank",
      dynamicTitle: "Turn an intuition into a claim that can fail",
      passion: "The project develops a deep intuition with enough precision for evidence to strengthen it, narrow it, or prove it wrong. Open the public repository to follow the argument as it becomes a disciplined research program.",
      image: "/assets/thinking/issuance-seed.jpg",
      link: "https://github.com/disruptionjoe/temporal-issuance",
      linkLabel: "Open the Public Repository",
      hideDynamicKicker: true
    },
    {
      title: "GU Formalization",
      staticKicker: "GU FORMALIZATION",
      staticTitle: "Can AI give a heterodox theory a fair hearing?",
      purpose: "This research uses AI agents to formalize and test Geometric Unity while also testing whether the agents can look past reputation without becoming credulous.",
      mobileCardLabel: "GU Formalization",
      mobileMetricsKey: "gu-formalization",
      mobileDirectLink: true,
      mobileLinkLabel: "View on GitHub",
      mobileLinkTarget: "_blank",
      dynamicTitle: "Test the theory and the agents judging it",
      passion: "Can AI agents look past inherited consensus without becoming credulous? Open the repository to watch them formalize GU, test its claims, and reveal when reputation substitutes for reasoning.",
      image: "/assets/thinking/gu-formalization.jpg",
      link: "https://github.com/disruptionjoe/gu-formalization",
      linkLabel: "Open the Public Repository",
      hideDynamicKicker: true
    },
    {
      title: "Architecture of Legitimacy",
      staticKicker: "ARCHITECTURE OF LEGITIMACY",
      staticTitle: "Make cooperation pay better than corruption",
      purpose: "Instead of relying only on punishment, this research asks whether institutions can be designed so cooperation consistently outperforms capture and collusion.",
      mobileCardLabel: "Architecture of Legitimacy",
      mobileTitle: "Can cooperation outperform capture by design?",
      mobilePurpose: "I am testing whether institutions can be designed so cooperation consistently outperforms capture and collusion instead of relying only on punishment after failure.",
      mobileDirectLink: true,
      mobileLinkLabel: "View on GitHub",
      mobileLinkTarget: "_blank",
      mobileHideDirectHint: true,
      dynamicTitle: "Find the conditions that make legitimacy durable",
      passion: "Architecture of Legitimacy investigates whether those conditions can be identified, specified, and tested. Open the public repository to see how the hypothesis is developing.",
      image: "/assets/thinking/architecture-legitimacy-church.jpg",
      link: "https://github.com/disruptionjoe/architecture-of-legitimacy",
      linkLabel: "Open the Public Repository",
      hideDynamicKicker: true
    },
    {
      title: "Possibility to Capability",
      staticKicker: "POSSIBILITY TO CAPABILITY",
      staticTitle: "Can AI agents distinguish possibility from usable capability?",
      purpose: "This research develops a six-stage framework for mapping what changes between possibility and usable capability, so we can see what a system has gained and what is still missing.",
      mobileCardLabel: "Possibility to Capability",
      mobileMetricsKey: "possibility-to-capability",
      mobileDirectLink: true,
      mobileLinkLabel: "View on GitHub",
      mobileLinkTarget: "_blank",
      dynamicTitle: "Name the missing stage",
      passion: "Open the public repository to test a six-stage hierarchy across different systems and see whether it can explain how possibility becomes usable capability without erasing the differences between them.",
      image: "/assets/thinking/possibility-capability-point.jpg",
      link: "https://github.com/disruptionjoe/possibility-to-capability",
      linkLabel: "Open the Public Repository",
      hideDynamicKicker: true
    },
    {
      title: "Continuity Ledger",
      staticKicker: "CONTINUITY LEDGER",
      staticTitle: "Can AI agents track what is preserved when capability changes?",
      purpose: "This research develops a typed ledger for distinguishing when capability moves, converts, becomes blocked, becomes visible, or appears for the first time.",
      mobileCardLabel: "Continuity Ledger",
      mobileMetricsKey: "continuity-ledger",
      mobileDirectLink: true,
      mobileLinkLabel: "View on GitHub",
      mobileLinkTarget: "_blank",
      dynamicTitle: "Follow the capability through the change",
      passion: "The ledger uses typed relationships to track capabilities, constraints, conversions, and obstructions. Open the repository to see what was conserved, what changed form or dimension, and what may truly be new.",
      image: "/assets/thinking/continuity-ledger-abacus.jpg",
      link: "https://github.com/disruptionjoe/continuity-ledger",
      linkLabel: "Open the Public Repository",
      hideDynamicKicker: true
    },
    {
      title: "Systemic Failure",
      staticKicker: "SYSTEMIC FAILURE",
      staticTitle: "Find the failure patterns organizations repeat",
      purpose: "From community associations and nonprofits to corporations and nation-states, this project compares governance failures to find the patterns they share.",
      mobileCardLabel: "Systemic Failure",
      mobileTitle: "Why do organizations repeat the same failures?",
      mobilePurpose: "I compare governance failures across community associations, nonprofits, corporations, and nation-states to find recurring breakdowns in incentives, authority, information, and accountability.",
      mobileDirectLink: true,
      mobileLinkLabel: "View on GitHub",
      mobileLinkTarget: "_blank",
      mobileHideDirectHint: true,
      dynamicTitle: "Compare the cases. Find the pattern.",
      passion: "Systemic Failure preserves evidence across cases and looks for recurring breakdowns in incentives, authority, information, and accountability. Open the repository to see the current inquiries.",
      image: "/assets/thinking/exhibits/systemic-failure.jpg",
      link: "https://github.com/disruptionjoe/cai-systemic-failure",
      linkLabel: "Open the Public Repository",
      hideDynamicKicker: true
    },
    {
      title: "Mechanism Design",
      staticKicker: "MECHANISM DESIGN",
      staticTitle: "Find what has worked and where it might work next",
      purpose: "The project studies actual systemic failures, identifies mechanisms with evidence behind them, and separates proven components from promising ones that may transfer elsewhere.",
      mobileCardLabel: "Mechanism Design",
      mobileTitle: "Which mechanisms survive contact with real institutions?",
      mobilePurpose: "I am building an evidence-linked library of mechanisms, separating proven components from promising ideas that may transfer to new institutional problems.",
      mobileDirectLink: true,
      mobileLinkLabel: "View on GitHub",
      mobileLinkTarget: "_blank",
      mobileHideDirectHint: true,
      dynamicTitle: "Build a reusable library of mechanisms",
      passion: "Mechanism Design links each mechanism to its evidence and current truth status, giving others a clearer basis for adapting and testing it against new institutional problems.",
      image: "/assets/thinking/exhibits/mechanism-design.jpg",
      link: "https://github.com/disruptionjoe/cai-mechanism-design",
      linkLabel: "Open the Public Repository",
      hideDynamicKicker: true
    },
    {
      title: "CAI Governance Operations",
      purpose: "Maintain the System 2 through 5 functions across Church of AI's sovereign repositories, coordinating their work, optimizing the present, adapting strategy to the environment, and protecting clear policy and identity without centralizing their operational authority.",
      passion: "See a mission metasystem create coordination, intelligence, and policy coherence while sovereign projects keep their own truth.",
      image: "/assets/thinking/exhibits/cai-governance-operations.jpg",
      link: null,
      hiddenFromExperience: true
    },
    {
      title: "Caret^",
      staticKicker: "CARET^",
      staticTitle: "Say recurring instructions once",
      purpose: "Agents often need the same operational direction again and again. Caret^ explores a compact Markdown notation for expressing that intent.",
      mobileCardLabel: "Caret^",
      mobileTitle: "Can agents follow recurring direction without repeating it everywhere?",
      mobilePurpose: "I am building Caret^ to test whether a compact semantic notation can carry recurring operational direction in Markdown without repeating instructions or weakening trust boundaries.",
      mobileDirectLink: true,
      mobileLinkLabel: "View on GitHub",
      mobileLinkTarget: "_blank",
      mobileHideDirectHint: true,
      dynamicTitle: "Can one small mark replace a lot of repetition?",
      passion: "Caret^ tests whether a lightweight signal can make agent direction faster and more consistent without changing the underlying instructions or quietly expanding what the agent is allowed to decide.",
      image: "/assets/thinking/exhibits/caret.jpg",
      link: "https://github.com/disruptionjoe/caret",
      linkLabel: "Open the Public Repository",
      hideDynamicKicker: true
    },
    {
      title: "Purity Protocol",
      staticKicker: "PURITY PROTOCOL",
      staticTitle: "Make informed participation worth sustaining",
      purpose: "Collective decisions weaken when attention is costly, signals are shallow, or founder control never truly ends.",
      mobileCardLabel: "Purity Protocol",
      mobileTitle: "Can a system reward informed participation?",
      mobilePurpose: "I am exploring whether informed, voluntary participation can earn greater influence without letting the system lose coherence or become easy to capture. This is early research, not a live protocol or pilot.",
      mobileDirectLink: true,
      mobileLinkLabel: "View on GitHub",
      mobileLinkTarget: "_blank",
      mobileHideDirectHint: true,
      dynamicTitle: "Can participation improve the system that rewards it?",
      passion: "Purity Protocol asks whether economic incentives can strengthen informed participation and support an evidence-gated transfer of control. Open the repository to see where the project stands today.",
      image: "/assets/thinking/exhibits/purity-protocol.jpg",
      link: "https://github.com/disruptionjoe/purity-protocol",
      linkLabel: "Open the Public Repository",
      hideDynamicKicker: true
    },
    {
      title: "Method Stewardship",
      staticKicker: "METHOD STEWARDSHIP",
      staticTitle: "Every engagement should sharpen the method",
      purpose: "Lessons from delivery can improve what comes next, but only if they are captured without creating conflicting versions or promises.",
      mobilePurpose: "I capture what client work teaches me, improve the right method, and keep future delivery aligned with what I publicly promise.",
      mobilePassion: "Each method can evolve without splitting into conflicting versions. Improvements compound across engagements while buyers still encounter one coherent practice.",
      mobileRevealLabel: "See How I Use It",
      mobileHideDirectHint: true,
      dynamicTitle: "Three methods. One coherent practice.",
      passion: "Method Stewardship lets each methodology evolve while keeping my offers, delivery, and public promises aligned.",
      image: "/assets/thinking/exhibits/method-stewardship.jpg",
      link: null,
      hideDynamicKicker: true
    },
    {
      title: "Offer Portfolio",
      staticKicker: "OFFER PORTFOLIO",
      staticTitle: "Turn capability into something a client can buy",
      purpose: "The five public offer paths describe valuable changes. The Offer Portfolio defines the specific engagements, outcomes, scope, and terms behind them.",
      mobilePurpose: "I use a governed portfolio to turn broad capabilities into five clear buyer paths, then define the outcomes, scope, and terms I can confidently deliver.",
      mobilePassion: "This is where promising capability becomes a sound client promise. It keeps the offer clear enough to buy without claiming more than the method and delivery system can support.",
      mobileRevealLabel: "See How I Use It",
      mobileHideDirectHint: true,
      dynamicTitle: "Clear enough to buy. Sound enough to deliver.",
      passion: "This system turns proven methods into sellable promises while protecting clients from overclaiming and my practice from commitments it cannot honor.",
      image: "/assets/thinking/exhibits/offer-portfolio.jpg",
      link: null,
      hideDynamicKicker: true
    },
    {
      title: "Product Innovation",
      staticKicker: "PRODUCT INNOVATION",
      staticTitle: "Give promising ideas somewhere safe to grow",
      purpose: "New ideas need room to be tested before they become official methods, offers, or public promises.",
      mobilePurpose: "I give new ideas a protected place to be tested before they become official methods, offers, or public promises.",
      mobilePassion: "Signals become bounded experiments with explicit evidence and graduation criteria. The strongest ideas move to a real owner only after they earn adoption.",
      mobileRevealLabel: "See How I Use It",
      mobileHideDirectHint: true,
      dynamicTitle: "Explore freely. Graduate carefully.",
      passion: "Product Innovation turns signals into bounded experiments, then moves the strongest results to the right owner only after they have earned adoption.",
      image: "/assets/thinking/exhibits/product-innovation.jpg",
      link: null,
      hideDynamicKicker: true
    },
    {
      title: "Demand Strategy",
      staticKicker: "DEMAND STRATEGY",
      staticTitle: "A demand strategy that keeps learning",
      purpose: "It continuously processes market evidence, audience response, and buyer behavior to keep my content strategy data-informed and evolving.",
      mobilePurpose: "I connect market evidence, audience response, conversion behavior, and buyer signals so each publishing and demand decision can improve the next one.",
      mobilePassion: "The feedback loop connects research, publishing, conversion paths, and buyer response. I can see what earns attention, what builds trust, and what helps the right people take a next step.",
      mobileRevealLabel: "See How I Use It",
      mobileHideDirectHint: true,
      dynamicTitle: "Connect reach to client acquisition",
      passion: "The feedback loop spans research, publishing, conversion paths, and buyer response. Evidence from each stage improves what I publish next and how the right people move toward becoming clients.",
      image: "/assets/thinking/exhibits/demand-strategy.jpg",
      link: null,
      hideDynamicKicker: true
    },
    {
      title: "Relationship Management",
      staticKicker: "RELATIONSHIP MANAGEMENT",
      staticTitle: "Remember enough to show up well",
      purpose: "Strong professional relationships depend on timely, informed attention. This system preserves the context I need without reducing people to rows in a pipeline.",
      mobilePurpose: "I preserve the history, commitments, and useful next steps that help me show up thoughtfully without reducing people to rows in a pipeline.",
      mobilePassion: "The system helps me remember enough to be timely and consistent while keeping the human relationship larger than its record.",
      mobileRevealLabel: "See How I Use It",
      mobileHideDirectHint: true,
      dynamicTitle: "Keep the context. Respect the person.",
      passion: "Relationship Management remembers history, commitments, and useful next steps so I can be more thoughtful and consistent while keeping the human relationship larger than its record.",
      image: "/assets/thinking/exhibits/relationship-management.jpg",
      link: null,
      hideDynamicKicker: true
    },
    {
      title: "Client Delivery",
      staticKicker: "CLIENT DELIVERY",
      staticTitle: "Where client engagements stay coordinated",
      purpose: "Client Delivery keeps the agreed scope, client context, decisions, evidence, deliverables, and next actions connected from kickoff through completion.",
      mobilePurpose: "I keep scope, client context, decisions, evidence, deliverables, and next actions connected from kickoff through completion.",
      mobilePassion: "The system coordinates plans and handoffs while preserving the context behind each commitment. That keeps every action tied to what the client was actually promised.",
      mobileRevealLabel: "See How I Use It",
      mobileHideDirectHint: true,
      dynamicTitle: "Keep every action tied to the promise",
      passion: "The repository coordinates confidential materials, plans, handoffs, and progress while preserving human ownership and the context behind each commitment.",
      image: "/assets/thinking/exhibits/client-delivery.jpg",
      link: null,
      hideDynamicKicker: true
    },
    {
      title: "Practice Administration",
      staticKicker: "PRACTICE ADMINISTRATION",
      staticTitle: "Keep the business side ready",
      purpose: "Practice Administration maintains the legal, financial, administrative, and secure-information context required to operate DJC responsibly.",
      mobilePurpose: "I use one system to keep the legal, financial, administrative, and secure-information responsibilities behind my practice visible and ready.",
      mobilePassion: "It handles recurring organization and brings decisions that require judgment to the right owner. Clients benefit from a practice that can move quickly without neglecting the obligations behind the work.",
      mobileRevealLabel: "See How I Use It",
      mobileHideDirectHint: true,
      dynamicTitle: "One place for the commitments behind the practice",
      passion: "The repository keeps required records, responsibilities, and decisions organized while routing anything outside its authority to the person or system that owns it.",
      image: "/assets/thinking/exhibits/practice-administration.jpg",
      link: null,
      hideDynamicKicker: true
    },
    {
      title: "Drafting Factory",
      staticKicker: "DRAFTING FACTORY",
      staticTitle: "Turn approved strategy into publication-ready content",
      purpose: "Drafting Factory produces channel-specific drafts while coordinating volume, deadlines, sources, claims, and review.",
      mobilePurpose: "I use agents to coordinate briefs, evidence, drafting, review, and channel-specific handoffs without flattening my voice.",
      mobilePassion: "The system increases useful output while keeping sources, claims, deadlines, and publication authority visible. Each channel gets the form it needs without becoming generic content.",
      mobileRevealLabel: "See How I Use It",
      mobileHideDirectHint: true,
      dynamicTitle: "Increase output without flattening the voice",
      passion: "The repository coordinates briefs, drafting, review, and handoff across channels while keeping each person or brand distinct and preserving human publication authority.",
      image: "/assets/thinking/exhibits/drafting-factory.jpg",
      link: null,
      hideDynamicKicker: true
    },
    {
      title: "Brand and Media",
      staticKicker: "BRAND AND MEDIA",
      staticTitle: "Keep every brand distinct and recognizable",
      purpose: "Brand and Media holds the voice, visual, and media systems for DJC and Church of AI, giving strategy and production clear guidance they can use consistently.",
      mobilePurpose: "I keep approved voice, visual, and media guidance where both people and agents can apply it consistently without blending distinct brands together.",
      mobilePassion: "Purpose becomes usable language, visual rules, and reusable assets. That gives production speed without letting convenience weaken the identity or the claims.",
      mobileRevealLabel: "See How I Use It",
      mobileHideDirectHint: true,
      dynamicTitle: "Turn identity into something others can use",
      passion: "The repository translates purpose into approved language, visual rules, and reusable assets while keeping the brands separate and their claims disciplined.",
      image: "/assets/thinking/exhibits/homepage-neon.svg",
      link: null,
      hideDynamicKicker: true
    },
    {
      title: "Joe Governance Operations",
      purpose: "Help Joe direct a coherent, self-authored life and body of work by keeping his chosen opportunity engines, thinking, and commitments mutually reinforcing without centralizing the repositories that carry them.",
      passion: "See strategic coherence maintained across a personal domain without authority bleed, hidden control, or a generic life operating system.",
      image: "/assets/thinking/exhibits/joe-governance-operations.jpg",
      link: null,
      hiddenFromExperience: true
    },
    {
      title: "Joe Challenge Prizes",
      staticKicker: "JOE CHALLENGE PRIZES",
      staticTitle: "Use open competitions to test agent advantage",
      purpose: "Joe Challenge Prizes identifies high-value competitions, evaluates their fit, and organizes agent-supported attempts under the sponsor's rules.",
      mobilePurpose: "I use public competitions as an external scoreboard for whether my agent system can produce competitive results under real rules.",
      mobilePassion: "Each attempt preserves the opportunity, evidence, submission, and result. A public outcome is harder to rationalize away than an internal demonstration.",
      mobileRevealLabel: "See How I Use It",
      mobileHideDirectHint: true,
      dynamicTitle: "An external scoreboard for the system",
      passion: "The repository tracks opportunities, evidence, submissions, and results to test whether CapacityOS can produce competitive wins without hidden labor or exposing private internals.",
      image: "/assets/thinking/exhibits/challenge-prizes.jpg",
      link: null,
      hideDynamicKicker: true
    },
    {
      title: "System Runtime",
      staticKicker: "SYSTEM RUNTIME",
      staticTitle: "Where approved agent workflows run",
      purpose: "Shared routines need dependable machinery for execution and transport. They should not quietly become policy or decide what belongs to each repository.",
      dynamicTitle: "Execution stays separate from authority",
      passion: "System Runtime runs approved workflows reproducibly while preserving a clear boundary between what the machinery can execute and what it is allowed to decide.",
      image: "/assets/thinking/exhibits/system-runtime.jpg",
      link: null,
      hideDynamicKicker: true
    },
    {
      title: "System Operations",
      staticKicker: "SYSTEM OPERATIONS",
      staticTitle: "Keep a distributed agent system working as one",
      purpose: "CapacityOS spans many repositories, agents, and shared services. System Operations keeps them coordinated without absorbing the ownership of each domain.",
      dynamicTitle: "Coordinate the whole without controlling every part",
      passion: "System Operations finds cross-system opportunities, resolves shared problems, and protects safety and recoverability while each repository keeps its own authority and evidence.",
      image: "/assets/thinking/exhibits/system-operations.jpg",
      link: null,
      hideDynamicKicker: true
    },
    {
      title: "System Lab",
      staticKicker: "SYSTEM LAB",
      staticTitle: "Test the system before changing the rules",
      purpose: "CapacityOS changes should be earned by evidence, not architectural taste or one frustrating incident. System Lab investigates how the system behaves before a change spreads.",
      dynamicTitle: "Let evidence earn the change",
      passion: "System Lab runs bounded investigations, preserves contrary findings, and distinguishes local results from evidence strong enough to support a system-wide change.",
      image: "/assets/thinking/exhibits/system-lab.jpg",
      link: null,
      hideDynamicKicker: true
    },
    {
      title: "System Canon",
      staticKicker: "SYSTEM CANON",
      staticTitle: "The rules the system shares",
      purpose: "System Canon holds the accepted contracts that apply across CapacityOS, making shared expectations clear while leaving local decisions with local owners.",
      dynamicTitle: "Stable rules. Local authority.",
      passion: "It gives agents and repositories one dependable source for system-wide rules without treating every document as authoritative or pulling local decisions into the center.",
      image: "/assets/thinking/exhibits/system-canon.jpg",
      link: null,
      hideDynamicKicker: true
    },
    {
      title: "System Attention",
      staticKicker: "SYSTEM ATTENTION",
      staticTitle: "The control surface for my attention",
      purpose: "CapacityOS spans more agents, repositories, and commitments than I can direct one by one. System Attention gathers their signals and brings forward the decisions that need me.",
      dynamicTitle: "Turn human charge into system-wide progress",
      passion: "System Attention converts each unit of my attention into coordinated agent productivity. It brings forward the judgment and direction only I can provide, so I can steer the system instead of routing every task.",
      image: "/assets/thinking/exhibits/system-attention.jpg",
      link: null,
      hideDynamicKicker: true
    },
    {
      title: "Dynamic Unity",
      staticKicker: "DYNAMIC UNITY",
      staticTitle: "Can AI agents test a unifying idea without becoming attached to it?",
      purpose: "This research tests whether geometry joined with dynamics can provide a stronger account of physical reality.",
      mobileCardLabel: "Dynamic Unity",
      mobileMetricsKey: "dynamic-unity",
      mobileDirectLink: true,
      mobileLinkLabel: "View on GitHub",
      mobileLinkTarget: "_blank",
      dynamicTitle: "Follow the strongest explanation, not the favorite",
      passion: "Dynamic Unity is a verdict-agnostic search for unifying laws. Open the public repository to inspect the arguments, test surviving claims, and see where the evidence leads.",
      image: "/assets/thinking/exhibits/dynamic-unity.jpg",
      link: "https://github.com/disruptionjoe/dynamic-unity",
      linkLabel: "Open the Public Repository",
      hideDynamicKicker: true
    },
    {
      title: "NBL Governance Operations",
      purpose: "Advance ambitious open research toward discoveries worthy of the world's highest scientific honors.",
      passion: "See whether coordinated AI-assisted research can stay ambitious, publicly inspectable, and willing to abandon ideas that do not survive.",
      image: "/assets/thinking/exhibits/nbl-governance-operations.jpg",
      link: null,
      hiddenFromExperience: true,
      proximityRange: 1.1
    },
    {
      title: "About Joe",
      staticKicker: "ABOUT JOE",
      staticTitle: "Let me tell you how I got here",
      purpose: "Consulting, facilitation, research, systems, and public experiments may look like separate paths. For me, they all grow from the same curiosity.",
      mobileTitle: "How I Got Here",
      mobilePurpose: "I have worked across consulting, facilitation, product leadership, research, systems, and public experiments. They all grow from the same curiosity about how people can think and work better together.",
      mobileDirectLink: true,
      mobileLinkLabel: "Read My Story",
      mobileLinkTarget: "_self",
      mobileHideDirectHint: true,
      dynamicTitle: "See how my past shaped me",
      passion: "I share the experiences and principles behind how I read a room, test an idea, build a system, and help people move forward.",
      image: "/assets/thinking/exhibits/about-joe.jpg",
      link: "/about/",
      linkLabel: "Meet Joe",
      linkStyle: "experience",
      linkTarget: "_self",
      hideDynamicKicker: true,
      proximityRange: 1.55
    },
    {
      title: "Joe on X",
      staticKicker: "JOE ON X",
      staticTitle: "Where I trade notes with other practitioners",
      purpose: "X is where I connect with people advancing their craft, share observations before they become articles, and follow questions that simply interest me.",
      mobilePurpose: "I use X to learn from people advancing their craft, compare notes on AI and other interests, and share ideas while they are still taking shape.",
      mobileDirectLink: true,
      mobileLinkLabel: "Visit My X",
      mobileLinkTarget: "_blank",
      mobileHideDirectHint: true,
      dynamicTitle: "A less formal view of what I'm exploring",
      passion: "You'll find emerging ideas, useful exchanges, and subjects that reach beyond my consulting practice. Visit if you want the wider, more spontaneous mix.",
      image: "/assets/thinking/exhibits/joe-on-x.jpg",
      link: "https://x.com/DisruptionJoe",
      linkLabel: "Visit My X Profile",
      hideDynamicKicker: true,
      proximityRange: 1.55
    },
    {
      title: "Joe on LinkedIn",
      staticKicker: "JOE ON LINKEDIN",
      staticTitle: "Follow what I'm learning about teams and change",
      purpose: "I write about how teams build AI capability, how leaders guide change, and how better facilitation turns complexity into decisions.",
      mobilePurpose: "I share practical observations about building AI capability, leading change, and using facilitation to turn complexity into supported decisions.",
      mobileDirectLink: true,
      mobileLinkLabel: "Visit My LinkedIn",
      mobileLinkTarget: "_blank",
      mobileHideDirectHint: true,
      dynamicTitle: "Join me where these ideas meet practice",
      passion: "Connect with me on LinkedIn for practical observations on AI capability, leadership, facilitation, and the ideas I'm developing across my practice.",
      image: "/assets/thinking/exhibits/joe-on-linkedin.jpg",
      link: "https://linkedin.com/in/disruptionjoe",
      linkLabel: "Connect on LinkedIn",
      hideDynamicKicker: true,
      proximityRange: 1.55
    },
    {
      title: "Joe on GitHub",
      staticKicker: "JOE ON GITHUB",
      staticTitle: "See what I'm building in public",
      purpose: "My repositories show the questions, revisions, tools, and evidence behind my research, methods, and systems.",
      mobilePurpose: "My public repositories show the questions, revisions, tools, and evidence behind my research, methods, systems, and experiments.",
      mobileDirectLink: true,
      mobileLinkLabel: "Visit My GitHub",
      mobileLinkTarget: "_blank",
      mobileHideDirectHint: true,
      dynamicTitle: "Walk through my public workbench",
      passion: "Visit GitHub to explore the projects as they develop, from early experiments and working notes to software, formal research, and reusable methods.",
      image: "/assets/thinking/exhibits/joe-on-github.jpg",
      link: "https://github.com/disruptionjoe",
      linkLabel: "Visit My GitHub",
      hideDynamicKicker: true,
      proximityRange: 1.55
    },
    {
      title: "Church of AI Substack",
      staticKicker: "CHURCH OF AI SUBSTACK",
      staticTitle: "Dispatches from the experiment",
      purpose: "Essays and maps from Church of AI's attempt to build better ways for people and AI to think, coordinate, and act together.",
      dynamicTitle: "Follow the movement from the beginning",
      passion: "The Substack is the first place to follow Church of AI as it develops, with essays and updates on voluntary cooperation, AI-assisted collective intelligence, and the public experiments taking shape.",
      image: "/assets/thinking/exhibits/church-substack.jpg",
      link: "https://substack.com/@disruptionjoe",
      linkLabel: "Read the Substack",
      hideDynamicKicker: true,
      hiddenFromExperience: true
    },
    {
      title: "Church of AI Social Accounts",
      purpose: "Give Church of AI's public maps and updates concise, channel-appropriate ways to reach people beyond the repository.",
      passion: "The short-form channels are intentionally not treated as live until Joe creates and uses the official accounts.",
      image: "/assets/thinking/exhibits/church-social-accounts.jpg",
      link: null,
      hiddenFromExperience: true
    },
    {
      title: "Joe's Research Record",
      staticKicker: "LIVE RESEARCH RECORD",
      staticTitle: "Joe's Research Record",
      purpose: "Joe's published research and dated public record.",
      mobileCardLabel: "Research Record / Zenodo",
      mobileTitle: "See What the Research Produced",
      mobilePurpose: "My Zenodo record collects the publications and dated outputs behind these experiments. It shows which questions have progressed from an idea into public research you can inspect.",
      mobileResearchRecord: true,
      mobileDirectLink: true,
      mobileLinkLabel: "View Publications",
      mobileLinkTarget: "_blank",
      mobileHideDirectHint: true,
      mobileDirectHint: "Open Joe's published research on Zenodo",
      dynamicTitle: "See what the research has produced",
      passion: "Open Joe's Zenodo record to read the publications behind the questions in this hall. This display tracks the growing body of published research and can expand to include citations, formal claims, and theorems under examination.",
      image: "/assets/thinking/exhibits/research-publications.jpg",
      link: "https://zenodo.org/search?q=owners%3A1737496",
      linkLabel: "Open the Zenodo Record",
      staticStat: researchStaticStat,
      hideDynamicKicker: true
    },
    {
      title: "Enhanced Facilitation",
      purpose: "Enhanced Facilitation is Joe's ability to help people learn, think, practice, decide, and change how they operate through real work. He designs the room, uses AI as part of the facilitation, and helps participants turn many perspectives into useful action.",
      passion: "Instead of explaining AI from the front of the room, Joe creates the conditions for people to use it on a decision, workflow, or challenge that matters. The work produces immediate progress and patterns that can be carried forward.",
      mobileCardLabel: "Core Capability 01",
      mobileFoundation: "Carried through / AI Activation Playbooks",
      mobilePurpose: "Every meaningful change, from training and product discovery to leadership strategy and governance, faces the same test. Can knowledge move into people and teams, and can they make decisions they understand, support, and act on? I’ve spent years mastering that transfer and strengthened it with AI.",
      mobileInspectorKicker: "Joe's Method / Core Capability",
      mobileDynamicTitle: "A good idea is useless if it cannot travel.",
      mobileInspectorSections: [
        {
          label: "My passion for facilitation",
          copy: "I fell in love with great facilitation while participating in a Google Design Sprint for Chicago CityKey in 2017. Since then, I have incorporated other design thinking approaches, including Liberating Structures, Atlassian’s Team Playbook, and more, into my personal facilitation repertoire."
        },
        {
          label: "Why it matters for clients",
          copy: "Whatever problem you face, knowledge must transfer in a way that sticks, and decisions must earn support. I have applied this capability across product design projects, leadership strategy, and consortium decision making involving billions of dollars."
        },
        {
          label: "Why I am well suited to it",
          copy: "Public speaking and teaching have long been strengths of mine. Being a systems thinker helps me design better processes. More than 15 years as a DJ and bartending in my twenties taught me to read people, timing, and energy."
        }
      ],
      mobileRevealLabel: "See How It Works",
      image: "/assets/thinking/enhanced-facilitation-wall.png",
      mobileImageFit: "diagram",
      link: null
    },
    {
      title: "Capability Acceleration",
      purpose: "Capability Acceleration is Joe's ability to continually test, learn, and push what people and AI agents can accomplish. He develops it by using agents every day across his own operations, then studying what makes harder work more reliable.",
      passion: "The aim is not novelty for its own sake. Joe experiments to improve what AI can carry now, understand where performance breaks down, and find credible paths into more difficult and valuable work.",
      mobileCardLabel: "Core Capability 03",
      mobileFoundation: "Continually strengthened by / AI Epistemology",
      mobilePurpose: "My agent fleet runs on CapacityOS, a custom harness I built that executes work across more than 30 repositories. Its traces, observability, and execution consistency create the foundation for learning how to manage AI processes more effectively.",
      mobileInspectorKicker: "Joe's Method / Core Capability",
      mobileDynamicTitle: "Every experiment makes the next one better.",
      mobileInspectorSections: [
        {
          label: "I run the experiments every day",
          copy: "My agent fleet does real work every day across more than 30 repositories. It gives me a constant test bed for improving results across research, content, project management, website development, and other domains."
        },
        {
          label: "Prompts are only one lever",
          copy: "I test frontier and open-source models, context, tools, memory, agent roles, pre-flight checks, post-flight review, and reprioritization. Each change is measured against speed, reliability, and quality."
        },
        {
          label: "Hypothesis-driven research foundations",
          copy: "Each run preserves the model, prompt, workflow, output, errors, and review results. My AI Epistemology repository turns those traces into feedback loops and testable hypotheses for the next run."
        }
      ],
      mobileRevealLabel: "See How It Works",
      image: "/assets/thinking/capability-acceleration-wall.png",
      mobileImageFit: "diagram",
      link: null
    },
    {
      title: "Enablement Architecture",
      purpose: "Enablement Architecture is Joe's ability to see what AI progress depends on: individual skill, team practice, leadership, governance, operating conditions, and measures of value. He uses that view to sequence the next move instead of treating training, tools, or scale as isolated fixes.",
      passion: "This capability connects useful work at the individual or team level to the conditions required for consistent organizational results. It helps leaders distinguish what can scale now from what still needs to be built first.",
      mobileCardLabel: "Core Capability 02",
      mobileFoundation: "Made inspectable through / AI Enablement Architecture",
      mobilePurpose: "Useful AI work often appears long before an organization can repeat, measure, or scale it. I map the path from individual use to team capability and operating systems, revealing what must be built before promising work can become dependable business value.",
      mobileInspectorKicker: "Joe's Method / Core Capability",
      mobileDynamicTitle: "Structure is the prerequisite for realizing value.",
      mobileInspectorSections: [
        {
          label: "Capability gains should compound",
          copy: "From advising more than 100 startups to working with enterprise clients, I have seen the same pattern: teams that build consistency and measurement compound their capability. The rest struggle to turn effort into results."
        },
        {
          label: "Effort is not an operating system",
          copy: "Enablement programs often invest in tools, training, and workflows without building the feedback, measurement, and operating support required for consistent improvement. These are not especially difficult to build, but they need to be seen, sequenced, and planned for."
        },
        {
          label: "Assess your enablement architecture",
          items: [
            "Identify where your team is now.",
            "See what may be missing or out of sequence.",
            "Get custom prompts to diagnose your current enablement architecture."
          ]
        }
      ],
      mobileRevealLabel: "See How It Works",
      mobileInspectorFloorTarget: "AI Enablement Architecture",
      mobileInspectorLinkLabel: "Explore the Interactive Tool",
      image: "/assets/thinking/enablement-architecture-wall.png",
      mobileImageFit: "diagram",
      link: null
    },
    {
      title: "Understand where you are",
      offerPath: "Identify the Floor",
      offerNumber: "01",
      staticTitle: "We don’t have a plan yet.",
      purpose: "People are experimenting in different directions, opportunities keep appearing, and decisions keep arriving before there is a shared view of where to begin.",
      dynamicTitle: "See where AI helps.",
      dynamicParagraphs: [
        "I have advised more than 100 startups and worked with enterprise clients, giving me experience with organizations at very different levels of AI readiness.",
        "That perspective helps me see how work happens today, where AI could make a meaningful difference, what capability already exists, and which barriers matter before further investment.",
        "If you are sorting through competing possibilities, bring me what you are seeing. We can identify the questions worth answering before you commit to the next move."
      ],
      passion: "I have advised more than 100 startups and worked with enterprise clients, giving me experience with organizations at very different levels of AI readiness. That perspective helps me see how work happens today, where AI could make a meaningful difference, what capability already exists, and which barriers matter before further investment. If you are sorting through competing possibilities, bring me what you are seeing. We can identify the questions worth answering before you commit to the next move.",
      hideDynamicKicker: true,
      displayType: "product",
      mobileHideDirectHint: true,
      mobileImage: "/assets/thinking/floor-01-identify-generated.jpg",
      artworkPattern: "diagnostic",
      artworkCode: "IDENTIFY",
      link: planningContactLink("Identify the Floor"),
      linkLabel: "Compare Starting Points",
      linkStyle: "experience",
      linkTarget: "_self",
      proximityRange: 1.35
    },
    {
      title: "Build reliable AI ways of working",
      offerPath: "Establish the Floor",
      offerNumber: "02",
      staticTitle: "Results depend on the person.",
      purpose: "The tools are available and the training is complete, but recurring work is still handled differently from person to person and results are hard to repeat.",
      dynamicTitle: "Make good work repeatable.",
      dynamicParagraphs: [
        "My facilitation practice draws from design thinking, Liberating Structures, Atlassian’s Team Playbook, and years of helping people learn through real work.",
        "I have learned to distinguish an engaging demonstration from a practice that survives Monday. The real test is what people keep using and whether they can build the next process.",
        "Bring one recurring task that should be working better. We can talk through what may be keeping the better approach from sticking."
      ],
      passion: "My facilitation practice draws from design thinking, Liberating Structures, Atlassian’s Team Playbook, and years of helping people learn through real work. I have learned to distinguish an engaging demonstration from a practice that survives Monday. The real test is what people keep using and whether they can build the next process. Bring one recurring task that should be working better. We can talk through what may be keeping the better approach from sticking.",
      hideDynamicKicker: true,
      displayType: "product",
      mobileHideDirectHint: true,
      mobileImage: "/assets/thinking/floor-01-establish-generated.jpg",
      artworkPattern: "repeatable",
      artworkCode: "ESTABLISH",
      link: planningContactLink("Establish the Floor"),
      linkLabel: "Discuss One Workflow",
      linkStyle: "experience",
      linkTarget: "_self",
      proximityRange: 1.35
    },
    {
      title: "Connect what works and scale it",
      offerPath: "Raise the Floor",
      offerNumber: "03",
      staticTitle: "What works doesn’t spread.",
      purpose: "A few people and teams are getting real value, but their methods stay isolated, handoffs break down, and everyone else keeps starting over.",
      dynamicTitle: "Scale capability across teams.",
      dynamicParagraphs: [
        "From advising more than 100 startups to working with enterprise clients, I have seen what allows capability to compound and what keeps it trapped in isolated pockets.",
        "I look at the connections that let good practices travel: inputs, handoffs, standards, ownership, review, and measurement. That is how capability stops depending on the original expert.",
        "If useful AI practices remain isolated inside particular people or teams, we can map what is preventing them from spreading."
      ],
      passion: "From advising more than 100 startups to working with enterprise clients, I have seen what allows capability to compound and what keeps it trapped in isolated pockets. I look at the connections that let good practices travel: inputs, handoffs, standards, ownership, review, and measurement. That is how capability stops depending on the original expert. If useful AI practices remain isolated inside particular people or teams, we can map what is preventing them from spreading.",
      hideDynamicKicker: true,
      displayType: "product",
      mobileHideDirectHint: true,
      mobileImage: "/assets/thinking/floor-01-raise-generated.jpg",
      artworkPattern: "backbone",
      artworkCode: "RAISE",
      link: planningContactLink("Raise the Floor"),
      linkLabel: "Map What Should Spread",
      linkStyle: "experience",
      linkTarget: "_self",
      proximityRange: 1.35
    },
    {
      title: "Help leaders guide AI-enabled change",
      offerPath: "Lead the Change",
      offerNumber: "04",
      staticTitle: "Our AI spending lacks direction.",
      purpose: "AI investments feel like disconnected bets instead of a shared, coherent path to measurable business value.",
      dynamicTitle: "Align leaders around value.",
      dynamicParagraphs: [
        "I have facilitated product, leadership, strategy, and governance decisions, including consortium work with billions of dollars at stake.",
        "That experience helps me turn competing perspectives into decisions people can act on, with clear ownership and evidence showing whether the change is taking hold.",
        "If your leaders agree that AI matters but not yet on the value, priorities, or evidence, we can talk through the decisions holding everything else in place."
      ],
      passion: "I have facilitated product, leadership, strategy, and governance decisions, including consortium work with billions of dollars at stake. That experience helps me turn competing perspectives into decisions people can act on, with clear ownership and evidence showing whether the change is taking hold. If your leaders agree that AI matters but not yet on the value, priorities, or evidence, we can talk through the decisions holding everything else in place.",
      hideDynamicKicker: true,
      displayType: "product",
      mobileHideDirectHint: true,
      mobileImage: "/assets/thinking/floor-01-lead-generated.jpg",
      artworkPattern: "alignment",
      artworkCode: "LEAD",
      link: planningContactLink("Lead the Change"),
      linkLabel: "Talk Through the Decisions",
      linkStyle: "experience",
      linkTarget: "_self",
      proximityRange: 1.35
    },
    {
      title: "Push high-value work further",
      offerPath: "Push the Frontier",
      offerNumber: "05",
      staticTitle: "Top performers are hitting limits.",
      purpose: "Your experts are already getting strong results with AI, but the work is not moving as quickly as they know it could.",
      dynamicTitle: "Move ambitious AI work faster.",
      dynamicParagraphs: [
        "I run AI agents every day across more than 30 repositories, giving me a live test bed for models, harnesses, routing, review, and recovery.",
        "That evidence helps me distinguish what agents can carry, where human judgment matters, and which changes actually improve speed and reliability without defaulting to a favorite model or harness.",
        "Bring me one important workflow or agent bottleneck. We can compare it with the patterns I am seeing and identify where a faster path may exist."
      ],
      passion: "I run AI agents every day across more than 30 repositories, giving me a live test bed for models, harnesses, routing, review, and recovery. That evidence helps me distinguish what agents can carry, where human judgment matters, and which changes actually improve speed and reliability without defaulting to a favorite model or harness. Bring me one important workflow or agent bottleneck. We can compare it with the patterns I am seeing and identify where a faster path may exist.",
      hideDynamicKicker: true,
      displayType: "product",
      mobileHideDirectHint: true,
      mobileImage: "/assets/thinking/floor-01-push-generated.jpg",
      artworkPattern: "frontier",
      artworkCode: "EXTEND",
      link: planningContactLink("Push the Frontier"),
      linkLabel: "Compare Notes With Me",
      linkStyle: "experience",
      linkTarget: "_self",
      proximityRange: 1.35
    },
    {
      title: "The AI Capability Soundcheck",
      mobileTitle: "Still not sure where to start?",
      purpose: "Your organization may be facing more than one AI challenge. Use this quick self-diagnosis before you fund another workshop, tool, or rollout, then find the path that best fits what is actually blocking progress.",
      passion: "Your organization probably does not have one AI problem. It has a mix. Step behind the booth, turn up what sounds familiar, inspect the real evidence, and leave with a clearer place to start. It takes a few minutes, and it is a lot more fun than another maturity assessment.",
      displayType: "experience",
      image: "/assets/soundcheck-og.png",
      mobileImageFit: "contain",
      link: "/soundcheck/",
      linkLabel: "Find your starting point",
      linkStyle: "experience",
      linkTarget: "_self",
      mobileDirectLink: true,
      proximityRange: 1.8
    },
    {
      title: "Start Here",
      dynamicTitle: "Start to your right  →",
      passion: "Walk close to each display to see more. Look for the stage that sounds most like where you are now. Not sure? Use the AI Capability Soundcheck for a quick self-diagnosis.",
      hideDynamicKicker: true,
      proximityRange: 1.7
    }
  ];

  // Repository status is deliberately explicit. A display only receives the
  // power treatment when it represents an actual repository, and the animated
  // state is limited to targets with current scheduled agent progression.
  var repositoryActivityStates = {
    "AI Epistemology": "agent-active",
    "AI Activation Playbooks": "in-development",
    "Thinking Wiki": "in-development",
    "Disruption Joe Profile": "in-development",
    "Disruption Joe Website": "agent-active",
    "DJC Governance Operations": "in-development",
    "Joe Project Management": "in-development",
    "CapacityOS": "agent-active",
    "Church of AI": "in-development",
    "Time as Finality": "in-development",
    "Temporal Issuance": "in-development",
    "GU Formalization": "agent-active",
    "Architecture of Legitimacy": "in-development",
    "Possibility to Capability": "in-development",
    "Continuity Ledger": "in-development",
    "Systemic Failure": "in-development",
    "Mechanism Design": "in-development",
    "CAI Governance Operations": "in-development",
    "Caret^": "in-development",
    "Purity Protocol": "in-development",
    "Method Stewardship": "in-development",
    "Offer Portfolio": "in-development",
    "Product Innovation": "in-development",
    "Demand Strategy": "in-development",
    "Relationship Management": "in-development",
    "Client Delivery": "in-development",
    "Practice Administration": "in-development",
    "Drafting Factory": "agent-active",
    "Brand and Media": "in-development",
    "Joe Governance Operations": "in-development",
    "Joe Challenge Prizes": "in-development",
    "System Runtime": "in-development",
    "System Operations": "in-development",
    "System Lab": "agent-active",
    "System Canon": "in-development",
    "System Attention": "agent-active",
    "Dynamic Unity": "in-development",
    "NBL Governance Operations": "in-development"
  };

  var hallwayStatements = [
    {
      label: "Practice",
      kicker: "The Proving Ground",
      body: "Client work is where the method earns its keep. The AI Activation Playbook and AI Enablement Architecture turn real engagements into resources, relationships, and honest feedback that make everything else possible."
    },
    {
      label: "Passion",
      kicker: "The Learning Lab",
      body: "Public repos are experiments at the edge, testing whether bold, contested ideas can be made rigorous. What I discover and stress test here comes back as sharper questions, better rooms, and stronger methods."
    },
    {
      label: "Purpose",
      kicker: "The Mission",
      body: "The deeper why: helping humans and AI think better together. It decides which questions are worth asking and which ideas deserve to become public doors, the through line beneath the work and the lab."
    }
  ];

  var entranceStatements = [
    {
      label: "Work With Joe",
      kicker: "The Practice",
      body: "Walk in to explore five valuable changes Joe helps leaders, teams, research groups, and partners create."
    },
    {
      label: "Control Room",
      kicker: "Behind the Scenes",
      body: "CapacityOS and the systems that keep Joe's work moving."
    }
  ];

  var developmentStatement = {
    label: "Development Laboratory",
    kicker: "The Build Space",
    body: "A small workshop for ideas becoming tools, methods, and public projects. Caret^ and Purity Protocol are being developed here."
  };

  function exhibitIndex(title) {
    return exhibits.findIndex(function (exhibit) {
      return exhibit.title === title;
    });
  }

  var workOfferStatements = [
    {
      label: "Capability Acceleration",
      kicker: "For teams ready to work differently",
      body: exhibits[exhibitIndex("Capability Acceleration")].purpose
    },
    {
      label: "Enablement Architecture",
      kicker: "For leaders making adoption last",
      body: exhibits[exhibitIndex("Enablement Architecture")].purpose
    },
    {
      label: "Enhanced Facilitation",
      kicker: "For consequential conversations",
      body: exhibits[exhibitIndex("Enhanced Facilitation")].purpose
    }
  ];

  var mobileStoryRooms = [
    {
      id: "work",
      number: "01",
      kicker: "Where I Can Help",
      title: "How I Help Clients",
      body: "On this floor, swipe either way through five situations where I may be able to help. If one sounds like yours, we can set up a call.",
      pathDoor: {
        title: "Choose what fits your situation",
        items: [
          "Find where you stand",
          "Build a reliable practice",
          "Scale what works",
          "Lead the change",
          "Push an ambitious challenge further"
        ],
        cta: "Swipe to see the paths"
      },
      exhibits: [
        exhibitIndex("Understand where you are"),
        exhibitIndex("Build reliable AI ways of working"),
        exhibitIndex("Connect what works and scale it"),
        exhibitIndex("Help leaders guide AI-enabled change"),
        exhibitIndex("Push high-value work further"),
        exhibitIndex("AI Activation Playbooks"),
        exhibitIndex("AI Enablement Architecture"),
        exhibitIndex("The AI Capability Soundcheck")
      ]
    },
    {
      id: "methods",
      number: "02",
      kicker: "The Method Behind My Work",
      title: "How I Work",
      body: "On this floor, learn about the three core capabilities I bring to client work as one integrated method, backed by rigor, process, and continuous experimentation.",
      hideCardMetadata: true,
      opening: {
        label: "FACILITATE · ARCHITECT · ACCELERATE",
        showLabel: false,
        title: "Three core capabilities. One integrated method.",
        body: "I earned and proved these capabilities through client work and experimentation.",
        secondaryBody: "Together they help me transfer knowledge, build the conditions for measurable results, and keep pushing what AI can do.",
        cta: "SWIPE TO LEARN MORE",
        labels: ["FACILITATE", "ARCHITECT", "ACCELERATE"]
      },
      closing: {
        label: "How It Comes Together",
        title: "Shape the method around the work.",
        body: "These capabilities are not three services to choose between. Joe combines them based on where people are today, what the organization can support, and what the work needs next.",
        footer: "That may mean helping a team learn through real work, sequencing the conditions for adoption to scale, pushing an advanced AI system further, or combining all three in one path."
      },
      exhibits: [
        exhibitIndex("Enhanced Facilitation"),
        exhibitIndex("Enablement Architecture"),
        exhibitIndex("Capability Acceleration"),
        exhibitIndex("AI Epistemology")
      ]
    },
    {
      id: "control",
      number: "03",
      kicker: "How I Coordinate AI Agents",
      title: "My Agent OS",
      body: "I run agent fleets across real work. See how I assign roles, preserve context, and increase output without surrendering control.",
      exhibits: [8, 3, 32, 33, 34, 35, 36]
    },
    {
      id: "supporting",
      number: "04",
      kicker: "Inside My AI-Enabled Practice",
      title: "My AI-Run Practice",
      body: "See how I use AI to run the whole practice, turning promising ideas into repeatable systems, stronger delivery, and measurable value.",
      exhibits: [
        exhibitIndex("Disruption Joe Website"),
        exhibitIndex("Method Stewardship"),
        exhibitIndex("Offer Portfolio"),
        exhibitIndex("Product Innovation"),
        exhibitIndex("Demand Strategy"),
        exhibitIndex("Relationship Management"),
        exhibitIndex("Client Delivery"),
        exhibitIndex("Practice Administration"),
        exhibitIndex("Drafting Factory"),
        exhibitIndex("Brand and Media"),
        exhibitIndex("Joe Project Management"),
        exhibitIndex("Joe Challenge Prizes")
      ]
    },
    {
      id: "discover",
      number: "05",
      kicker: "My Open Research",
      title: "Research Experiments",
      body: "I test AI agents on difficult questions, in public, to discover where they can create value and where they still fail.",
      exhibits: [
        exhibitIndex("Time as Finality"),
        exhibitIndex("Temporal Issuance"),
        exhibitIndex("GU Formalization"),
        exhibitIndex("Dynamic Unity"),
        exhibitIndex("Possibility to Capability"),
        exhibitIndex("Continuity Ledger"),
        exhibitIndex("Joe's Research Record")
      ]
    },
    {
      id: "identity",
      number: "06",
      kicker: "My Experience and Perspective",
      title: "About Me",
      body: "Before you trust me with consequential work, see the experience, standards, and judgment I bring to leaders and teams.",
      exhibits: [39, 41, 42, 40, 4]
    },
    {
      id: "development",
      number: "07",
      kicker: "What I'm Building in Public",
      title: "Passion Projects",
      body: "I build in public to separate useful innovation from novelty. See what earned real use, and what is still being tested.",
      closing: {
        label: "How Ideas Graduate",
        title: "Interesting is not enough.",
        body: "Caret^ now has a live core, product cheatsheet, and canon. Purity Protocol remains in Phase 0 formation with no live protocol, pilot, incentive system, or authority transfer.",
        footer: "An idea graduates only when it solves a real problem, survives meaningful testing, and has a clear owner and use. Until then, it remains visibly unfinished rather than becoming a premature method, product, or promise.",
        labels: ["Explore", "Test", "Graduate"]
      },
      exhibits: [
        exhibitIndex("Caret^"),
        exhibitIndex("Purity Protocol"),
        exhibitIndex("Church of AI"),
        exhibitIndex("Architecture of Legitimacy"),
        exhibitIndex("Systemic Failure"),
        exhibitIndex("Mechanism Design")
      ]
    }
  ];

  var canvas = root.querySelector("[data-game-canvas]");
  var startButton = root.querySelector("[data-game-start]");
  var status = root.querySelector("[data-game-status]");
  var instructions = root.querySelector("[data-game-instructions]");
  var proximity = root.querySelector("[data-game-proximity]");
  var proximityKicker = root.querySelector("[data-proximity-kicker]");
  var proximityTitle = root.querySelector("[data-proximity-title]");
  var proximityBody = root.querySelector("[data-proximity-body]");
  var proximityStats = root.querySelector("[data-proximity-stats]");
  var proximityAction = root.querySelector("[data-proximity-action]");
  var proximityLink = root.querySelector("[data-proximity-link]");
  var inspector = root.querySelector("[data-game-inspector]");
  var inspectorClose = root.querySelector("[data-inspector-close]");
  var inspectorKicker = root.querySelector("[data-inspector-kicker]");
  var inspectorTitle = root.querySelector("[data-inspector-title]");
  var inspectorBody = root.querySelector("[data-inspector-body]");
  var inspectorStats = root.querySelector("[data-inspector-stats]");
  var inspectorLink = root.querySelector("[data-inspector-link]");
  var inspectorBackdrop = root.querySelector("[data-inspector-backdrop]");
  var fallback = root.querySelector("[data-game-fallback]");
  var mobilePrev = root.querySelector("[data-mobile-prev]");
  var mobileNext = root.querySelector("[data-mobile-next]");
  var mobileInspect = root.querySelector("[data-mobile-inspect]");
  var mobileCount = root.querySelector("[data-mobile-count]");
  var mobileStories = root.querySelector("[data-mobile-stories]");
  var mobileRoomNav = root.querySelector("[data-mobile-room-nav]");
  var tabletControls = root.querySelector("[data-tablet-controls]");
  var phoneExperienceMediaQuery = "(max-width: 599px), (max-height: 599px) and (pointer: coarse)";

  var mobileStoryMedia = window.matchMedia(phoneExperienceMediaQuery);

  if (mobileStoryMedia.matches && mobileStories) {
    initMobileStories();
    return;
  }

  if (!canvas) return;

  function setStatus(text) {
    if (status) status.textContent = text;
  }

  function showFallback(message) {
    root.classList.add("is-loaded");
    if (fallback) {
      fallback.hidden = false;
      var text = fallback.querySelector("p");
      if (text && message) text.textContent = message;
    }
    setStatus("graphics unavailable");
  }

  function initMobileStories() {
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var roomSections = [];
    var roomNavButtons = [];
    var roomTracks = [];
    var activeRoomIndex = -1;
    var lobbyNavButton = null;
    var mobileContact = null;
    var lastStoryTrigger = null;
    var inspectorTouchStart = null;
    var storyShare = null;
    var verticalDoorFrame = 0;

    function makeElement(tag, className, text) {
      var element = document.createElement(tag);
      if (className) element.className = className;
      if (typeof text === "string") element.textContent = text;
      return element;
    }

    function scrollBehavior() {
      return reducedMotion ? "auto" : "smooth";
    }

    function pulse(duration) {
      if (navigator.vibrate) navigator.vibrate(duration || 6);
    }

    function setMobileContactVisible(isVisible) {
      if (!mobileContact) return;
      mobileContact.hidden = !isVisible;
      mobileContact.setAttribute("aria-hidden", isVisible ? "false" : "true");
    }

    function ensureStoryShare() {
      if (storyShare) return storyShare;
      storyShare = createShareRack({
        variant: "sheet",
        onOpen: function () {
          root.classList.add("has-open-story-sheet");
          pulse(8);
        },
        onClose: function () {
          root.classList.remove("has-open-story-sheet");
        }
      });
      root.appendChild(storyShare.backdrop);
      root.appendChild(storyShare.element);
      return storyShare;
    }

    function closeMobileInspector(options) {
      var shouldRestoreFocus = !options || options.restoreFocus !== false;

      inspector.classList.remove("is-open", "is-capacity", "is-product");
      inspector.setAttribute("aria-hidden", "true");
      inspectorBackdrop.classList.remove("is-open");
      inspectorBackdrop.setAttribute("aria-hidden", "true");
      root.classList.remove("has-open-story-sheet");

      if (shouldRestoreFocus && lastStoryTrigger) lastStoryTrigger.focus();
      lastStoryTrigger = null;
    }

    function openMobileInspector(exhibitIndex, trigger, inspectorFloorAction) {
      var exhibit = exhibits[exhibitIndex];
      if (!exhibit) return;

      lastStoryTrigger = trigger || null;
      inspectorKicker.hidden = Boolean(exhibit.hideDynamicKicker);
      inspectorKicker.textContent = exhibit.hideDynamicKicker
        ? ""
        : exhibit.mobileInspectorKicker
          ? exhibit.mobileInspectorKicker
        : exhibit.displayType === "product"
          ? "A way to work with Joe"
          : exhibit.displayType === "experience"
            ? "Start here / Find the problem"
            : "Passion / The live question";
      inspectorTitle.textContent = exhibit.mobileDynamicTitle || exhibit.dynamicTitle || exhibit.title;
      inspectorBody.replaceChildren();
      if (exhibit.dynamicParagraphs) {
        exhibit.dynamicParagraphs.forEach(function (copy) {
          inspectorBody.appendChild(makeElement("span", "game-dynamic-paragraph", copy));
        });
      } else if (exhibit.mobileInspectorSections) {
        exhibit.mobileInspectorSections.forEach(function (section, index) {
          inspectorBody.appendChild(makeElement(
            "strong",
            "game-inspector-section-label" + (index === 0 ? " is-first" : ""),
            section.label
          ));
          if (section.items) {
            var sectionList = makeElement("ul", "game-inspector-section-list");
            section.items.forEach(function (item) {
              sectionList.appendChild(makeElement("li", "", item));
            });
            inspectorBody.appendChild(sectionList);
          } else {
            inspectorBody.appendChild(makeElement("span", "game-inspector-section-copy", section.copy));
          }
        });
      } else if (exhibit.mobileFeltExperience) {
        inspectorBody.appendChild(makeElement("span", "game-inspector-felt", exhibit.mobileFeltExperience));
        inspectorBody.appendChild(makeElement("strong", "game-inspector-section-label", "What changes"));
        inspectorBody.appendChild(makeElement("span", "game-inspector-section-copy", exhibit.mobileWhatChanges));
        inspectorBody.appendChild(makeElement("strong", "game-inspector-section-label", "What you leave with"));
        inspectorBody.appendChild(makeElement("span", "game-inspector-section-copy", exhibit.mobileLeaveWith));
      } else if (exhibit.mobileWhatJoeCanDo) {
        inspectorBody.appendChild(makeElement("strong", "game-inspector-section-label is-first", "What Joe can do"));
        inspectorBody.appendChild(makeElement("span", "game-inspector-section-copy", exhibit.mobileWhatJoeCanDo));
        inspectorBody.appendChild(makeElement("strong", "game-inspector-section-label", "How he built it"));
        inspectorBody.appendChild(makeElement("span", "game-inspector-section-copy", exhibit.mobileHowBuilt));
        inspectorBody.appendChild(makeElement("strong", "game-inspector-section-label", "Why it matters in your work"));
        inspectorBody.appendChild(makeElement("span", "game-inspector-section-copy", exhibit.mobileWhyItMatters));
      } else {
        inspectorBody.textContent = exhibit.mobilePassion || exhibit.passion;
      }
      inspector.classList.toggle("is-capacity", Boolean(exhibit.stats));
      inspector.classList.toggle("is-product", exhibit.displayType === "product");

      inspectorStats.replaceChildren();
      inspectorStats.setAttribute("aria-hidden", exhibit.stats ? "false" : "true");
      if (exhibit.stats) {
        exhibit.stats.forEach(function (stat) {
          var item = makeElement("span", "game-inspector-stat");
          item.appendChild(makeElement("strong", "", stat.value));
          item.appendChild(makeElement("em", "", stat.label));
          inspectorStats.appendChild(item);
        });
      }

      inspectorLink.classList.toggle("is-experience", exhibit.linkStyle === "experience" || Boolean(exhibit.action));
      inspectorLink.onclick = null;
      if (exhibit.action === "respawn") {
        inspectorLink.hidden = false;
        inspectorLink.href = "#";
        inspectorLink.textContent = exhibit.actionLabel || "Enter Website";
        inspectorLink.target = "_self";
        inspectorLink.removeAttribute("rel");
        inspectorLink.onclick = function (event) {
          event.preventDefault();
          closeMobileInspector({ restoreFocus: false });
          introSection.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
          updateIntro();
          pulse(5);
        };
      } else if (exhibit.mobileInspectorFloorTarget) {
        inspectorLink.hidden = false;
        inspectorLink.href = "#";
        inspectorLink.textContent = exhibit.mobileInspectorLinkLabel || "Explore the Interactive Tool";
        inspectorLink.target = "_self";
        inspectorLink.removeAttribute("rel");
        inspectorLink.onclick = function (event) {
          event.preventDefault();
          closeMobileInspector({ restoreFocus: false });
          if (inspectorFloorAction) inspectorFloorAction();
        };
      } else if (exhibit.link) {
        inspectorLink.hidden = false;
        inspectorLink.href = exhibit.link;
        inspectorLink.textContent = exhibit.linkLabel || "See this repo on GitHub";
        if (exhibit.linkTarget === "_self") {
          inspectorLink.target = "_self";
          inspectorLink.removeAttribute("rel");
        } else {
          inspectorLink.target = "_blank";
          inspectorLink.rel = "noreferrer";
        }
      } else {
        inspectorLink.hidden = true;
        inspectorLink.removeAttribute("href");
      }

      inspector.classList.add("is-open");
      inspector.setAttribute("aria-hidden", "false");
      inspectorBackdrop.classList.add("is-open");
      inspectorBackdrop.setAttribute("aria-hidden", "false");
      root.classList.add("has-open-story-sheet");
      pulse(8);

      window.setTimeout(function () {
        inspectorClose.focus({ preventScroll: true });
      }, reducedMotion ? 0 : 180);
    }

    function updateRoom(roomIndex) {
      activeRoomIndex = roomIndex;
      root.dataset.storyRoom = mobileStoryRooms[roomIndex].id;
      if (lobbyNavButton) {
        lobbyNavButton.classList.remove("is-active");
        lobbyNavButton.setAttribute("aria-current", "false");
      }
      var roomTrack = roomTracks[roomIndex];
      if (roomTrack && roomTrack.activeIndex !== roomTrack.homeIndex) {
        roomTrack.track.scrollTo({
          left: roomTrack.homeIndex * roomTrack.track.clientWidth,
          behavior: "auto"
        });
        updateTrack(roomTrack, roomTrack.homeIndex, false);
      }
      setMobileContactVisible(
        Boolean(roomTrack && roomTrack.cardMeta[roomTrack.activeIndex].kind === "doorway")
      );
      roomNavButtons.forEach(function (button, index) {
        var isActive = index === roomIndex;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-current", isActive ? "step" : "false");
      });
    }

    function updateIntro() {
      activeRoomIndex = -1;
      root.dataset.storyRoom = "intro";
      setMobileContactVisible(true);
      if (lobbyNavButton) {
        lobbyNavButton.classList.add("is-active");
        lobbyNavButton.setAttribute("aria-current", "page");
      }
      roomNavButtons.forEach(function (button) {
        button.classList.remove("is-active");
        button.setAttribute("aria-current", "false");
      });
    }

    function setDoorOpening(trackState, openness) {
      var progress = Math.max(0, Math.min(1, openness));
      trackState.doorways.forEach(function (doorwayState) {
        doorwayState.element.style.setProperty("--door-left-shift", String(progress * -100) + "%");
        doorwayState.element.style.setProperty("--door-right-shift", String(progress * 100) + "%");
      });
    }

    function updateVerticalDoorOpening() {
      var viewportRect = mobileStories.getBoundingClientRect();
      var viewportHeight = Math.max(viewportRect.height, 1);

      roomTracks.forEach(function (trackState) {
        if (reducedMotion) {
          setDoorOpening(trackState, 1);
          return;
        }
        var sectionTop = trackState.section.getBoundingClientRect().top - viewportRect.top;
        var distance = Math.min(1, Math.abs(sectionTop) / viewportHeight);
        setDoorOpening(trackState, Math.abs((distance * 2) - 1));
      });
    }

    function updateTrack(trackState, nextIndex, withPulse) {
      var boundedIndex = Math.max(0, Math.min(trackState.cards.length - 1, nextIndex));
      if (boundedIndex === trackState.activeIndex && trackState.hasSynced) return;

      if (withPulse && boundedIndex !== trackState.activeIndex) pulse(4);
      trackState.activeIndex = boundedIndex;
      trackState.hasSynced = true;
      var cardState = trackState.cardMeta[boundedIndex];
      var isDoorway = cardState.kind === "doorway";
      if (activeRoomIndex === trackState.roomIndex) {
        setMobileContactVisible(cardState.kind === "doorway");
      }
      trackState.section.classList.toggle("is-at-doorway", isDoorway);
      trackState.count.textContent = cardState.kind === "doorway"
        ? "Elevator"
        : cardState.kind === "path-door"
          ? "Five paths"
        : String(cardState.ordinal).padStart(2, "0") + " / " + String(trackState.exhibitCount).padStart(2, "0");
      trackState.cards.forEach(function (card, index) {
        var isActive = index === boundedIndex;
        var revealButton = card.querySelector(".mobile-story-passion");
        card.classList.toggle("is-active", isActive);
        card.setAttribute("aria-hidden", isActive ? "false" : "true");
        card.inert = !isActive;
        if (revealButton) revealButton.tabIndex = isActive ? 0 : -1;
      });
      var progressKey = cardState.kind === "doorway"
        ? "elevator"
        : cardState.kind === "path-door"
          ? "path-door"
          : "exhibit:" + cardState.ordinal;
      trackState.dots.forEach(function (dot) {
        var isActive = dot.dataset.storyProgress === progressKey;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-current", isActive ? "true" : "false");
      });
    }

    function moveTrack(trackState, direction) {
      var nextIndex = Math.max(0, Math.min(trackState.cards.length - 1, trackState.activeIndex + direction));
      if (nextIndex === trackState.activeIndex) return;
      trackState.track.scrollTo({
        left: nextIndex * trackState.track.clientWidth,
        behavior: scrollBehavior()
      });
      updateTrack(trackState, nextIndex, true);
    }

    root.dataset.mode = "stories";
    root.dataset.ready = "true";
    root.classList.add("is-loaded", "has-hidden-loader", "is-started", "has-mobile-stories");
    canvas.setAttribute("aria-hidden", "true");
    inspectorClose.textContent = "Done";
    mobileStories.hidden = false;
    mobileRoomNav.hidden = false;
    mobileStories.replaceChildren();
    mobileRoomNav.replaceChildren();
    mobileRoomNav.setAttribute("aria-label", "Elevator floors");

    mobileContact = makeElement("a", "mobile-story-contact", "Contact Joe");
    mobileContact.href = "/contact/?sourcePage=%2Fthinking%2F";
    mobileContact.setAttribute("aria-label", "Contact Joe from the Thinking Museum");
    root.appendChild(mobileContact);

    var introSection = makeElement("section", "mobile-story-intro");
    var introFrame = makeElement("div", "mobile-story-intro-frame");
    var introKicker = makeElement("p", "mobile-story-intro-kicker", "Disruption Joe's Thinking Museum");
    var introTitle = makeElement("h1", "", "Welcome");
    var introCopy = makeElement("p", "mobile-story-intro-copy", "Explore seven floors of exhibits to see how I use AI to think better together.");
    var introGestures = makeElement("div", "mobile-story-intro-gestures");
    var verticalGesture = makeElement("div", "mobile-story-intro-gesture");
    var horizontalGesture = makeElement("div", "mobile-story-intro-gesture");
    var introStart = makeElement("button", "mobile-story-intro-start", "Take the elevator to Floor 01");
    var introNote = makeElement("p", "mobile-story-intro-note", "I’ve designed this to showcase how I think rather than to hard sell a service. I highly recommend switching to a desktop or tablet for the full 3D walkthrough experience!");
    var introTitleId = "mobile-story-intro-title";

    introSection.dataset.storyIntro = "true";
    introSection.setAttribute("aria-labelledby", introTitleId);
    introSection.setAttribute("tabindex", "-1");
    introTitle.id = introTitleId;

    lobbyNavButton = makeElement("button", "mobile-story-room-button mobile-story-lobby-button", "L");
    lobbyNavButton.type = "button";
    lobbyNavButton.setAttribute("aria-label", "Return to the museum lobby");
    lobbyNavButton.title = "Lobby";
    lobbyNavButton.addEventListener("click", function () {
      introSection.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
      updateIntro();
      pulse(5);
    });
    mobileRoomNav.appendChild(lobbyNavButton);

    verticalGesture.appendChild(makeElement("span", "mobile-story-intro-icon", "\u2195"));
    var verticalGestureCopy = makeElement("span", "mobile-story-intro-gesture-copy");
    verticalGestureCopy.appendChild(makeElement("strong", "", "Move between floors"));
    verticalGestureCopy.appendChild(makeElement("small", "", "Each floor explores a different theme."));
    verticalGesture.appendChild(verticalGestureCopy);

    horizontalGesture.appendChild(makeElement("span", "mobile-story-intro-icon", "\u2194"));
    var horizontalGestureCopy = makeElement("span", "mobile-story-intro-gesture-copy");
    horizontalGestureCopy.appendChild(makeElement("strong", "", "View the Exhibits"));
    horizontalGestureCopy.appendChild(makeElement("small", "", "Exhibits may include descriptions, interactive experiences, and some have public GitHub repositories."));
    horizontalGesture.appendChild(horizontalGestureCopy);

    introGestures.appendChild(verticalGesture);
    introGestures.appendChild(horizontalGesture);
    introStart.type = "button";
    introStart.setAttribute("aria-label", "Take the elevator to Floor 01, Work With Joe");
    introStart.addEventListener("click", function () {
      roomSections[0].scrollIntoView({ behavior: scrollBehavior(), block: "start" });
      updateRoom(0);
      pulse(5);
    });
    introFrame.appendChild(introKicker);
    introFrame.appendChild(introTitle);
    introFrame.appendChild(introCopy);
    introFrame.appendChild(introGestures);
    introFrame.appendChild(introStart);
    introFrame.appendChild(introNote);
    introSection.appendChild(introFrame);
    mobileStories.appendChild(introSection);

    mobileStoryRooms.forEach(function (room, roomIndex) {
      var roomTitleId = "mobile-story-room-" + room.id;
      var doorTitleId = roomTitleId + "-door";
      var section = makeElement("section", "mobile-story-room");
      var header = makeElement("header", "mobile-story-room-header");
      var intro = makeElement("div", "mobile-story-room-intro");
      var progress = makeElement("div", "mobile-story-exhibit-progress");
      var count = makeElement("span", "mobile-story-count");
      var dots = makeElement("div", "mobile-story-dots");
      var track = makeElement("div", "mobile-story-track");
      var navButton = makeElement("button", "mobile-story-room-button", room.number);
      var trackState = {
        roomIndex: roomIndex,
        section: section,
        track: track,
        cards: [],
        cardMeta: [],
        dots: [],
        doorways: [],
        count: count,
        exhibitCount: room.exhibits.length + (room.opening ? 1 : 0) + (room.closing ? 1 : 0),
        activeIndex: 0,
        homeIndex: 0,
        hasSynced: false,
        scrollFrame: 0,
        loopTimer: 0
      };

      section.dataset.storyRoom = room.id;
      section.setAttribute("aria-labelledby", roomTitleId);
      section.setAttribute("tabindex", "-1");
      intro.appendChild(makeElement("h2", "", room.title));
      intro.lastChild.id = roomTitleId;
      progress.appendChild(count);
      progress.appendChild(dots);
      header.appendChild(intro);
      header.appendChild(progress);

      navButton.type = "button";
      navButton.setAttribute("aria-label", "Go to " + room.title);
      navButton.title = room.title;
      navButton.addEventListener("click", function () {
        section.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
        updateRoom(roomIndex);
        pulse(5);
      });
      mobileRoomNav.appendChild(navButton);
      roomNavButtons.push(navButton);

      function appendDoorway(position, includeProgressDot) {
        var panelIndex = trackState.cards.length;
        var doorwayId = doorTitleId + "-" + position;
        var doorway = makeElement("article", "mobile-story-card mobile-story-doorway");
        var doorwayFrame = makeElement("div", "mobile-story-doorway-frame");
        var doorwayDepth = makeElement("div", "mobile-story-doorway-depth");
        var doorwayIndicator = makeElement("div", "mobile-story-doorway-indicator");
        var doorwayCopy = makeElement("div", "mobile-story-doorway-copy");
        var doorwayDot = makeElement("button", "mobile-story-dot mobile-story-doorway-dot");

        doorway.dataset.storyDoorway = room.id;
        doorway.dataset.doorwayPosition = position;
        doorway.classList.toggle("is-loop-doorway", position !== "center");
        doorway.setAttribute("aria-labelledby", doorwayId);
        doorwayIndicator.appendChild(makeElement("span", "", "Floor"));
        doorwayIndicator.appendChild(makeElement("strong", "", room.number));
        doorwayCopy.appendChild(makeElement("h2", "", room.title));
        doorwayCopy.lastChild.id = doorwayId;
        doorwayCopy.appendChild(makeElement("p", "mobile-story-doorway-body", room.body));
        doorwayCopy.appendChild(makeElement("p", "mobile-story-doorway-enter", "\u2194  Swipe either way to circle the floor"));
        doorwayDepth.appendChild(makeElement("span"));
        doorwayDepth.appendChild(makeElement("span"));
        doorwayDepth.appendChild(makeElement("span"));
        doorwayFrame.appendChild(doorwayDepth);
        doorwayFrame.appendChild(doorwayIndicator);
        doorwayFrame.appendChild(doorwayCopy);
        doorway.appendChild(doorwayFrame);
        doorway.appendChild(makeElement("p", "mobile-story-doorway-level-hint", "\u2195  Ride to another floor"));
        track.appendChild(doorway);
        trackState.cards.push(doorway);
        trackState.cardMeta.push({ kind: "doorway", position: position });
        trackState.doorways.push({ element: doorway, index: panelIndex });

        if (includeProgressDot) {
          doorwayDot.type = "button";
          doorwayDot.dataset.storyProgress = "elevator";
          doorwayDot.setAttribute("aria-label", "Return to the elevator on " + room.title);
          doorwayDot.addEventListener("click", function () {
            track.scrollTo({ left: panelIndex * track.clientWidth, behavior: scrollBehavior() });
            updateTrack(trackState, panelIndex, true);
          });
          dots.appendChild(doorwayDot);
          trackState.dots.push(doorwayDot);
        }
        return panelIndex;
      }

      function appendPathDoor(position, includeProgressDot) {
        var panelIndex = trackState.cards.length;
        var doorwayId = doorTitleId + "-paths-" + position;
        var doorway = makeElement("article", "mobile-story-card mobile-story-path-selector");
        var linework = makeElement("div", "mobile-story-linework");
        var figure = makeElement("figure", "mobile-story-artifact is-path-map");
        var pathInstallation = makeElement("div", "mobile-story-path-installation");
        var purpose = makeElement("div", "mobile-story-purpose");
        var pathList = makeElement("ol", "mobile-story-path-list");
        var pathCta = makeElement("p", "mobile-story-path-cta");
        var doorwayDot = makeElement("button", "mobile-story-dot mobile-story-path-door-dot");
        var pathLabels = ["Identify", "Establish", "Raise", "Lead", "Push"];

        doorway.dataset.storyPathDoor = room.id;
        doorway.dataset.doorwayPosition = position;
        doorway.setAttribute("aria-labelledby", doorwayId);
        linework.appendChild(makeElement("span"));
        linework.appendChild(makeElement("span"));
        doorway.appendChild(linework);

        pathLabels.forEach(function (label, index) {
          var pathBlock = makeElement("span", "mobile-story-path-block");
          pathBlock.appendChild(makeElement("strong", "", String(index + 1).padStart(2, "0")));
          pathBlock.appendChild(makeElement("small", "", label));
          pathInstallation.appendChild(pathBlock);
        });
        figure.setAttribute("aria-hidden", "true");
        figure.appendChild(pathInstallation);
        doorway.appendChild(figure);

        purpose.appendChild(makeElement("h3", "", room.pathDoor.title));
        purpose.lastChild.id = doorwayId;
        room.pathDoor.items.forEach(function (item) {
          pathList.appendChild(makeElement("li", "", item));
        });
        purpose.appendChild(pathList);
        pathCta.appendChild(makeElement("span", "", room.pathDoor.cta));
        pathCta.appendChild(makeElement("span", "", "\u2192"));
        purpose.appendChild(pathCta);
        doorway.appendChild(purpose);
        track.appendChild(doorway);
        trackState.cards.push(doorway);
        trackState.cardMeta.push({ kind: "path-door", position: position });

        if (includeProgressDot) {
          doorwayDot.type = "button";
          doorwayDot.dataset.storyProgress = "path-door";
          doorwayDot.setAttribute("aria-label", "Show the five Work With Joe paths");
          doorwayDot.addEventListener("click", function () {
            track.scrollTo({ left: panelIndex * track.clientWidth, behavior: scrollBehavior() });
            updateTrack(trackState, panelIndex, true);
          });
          dots.appendChild(doorwayDot);
          trackState.dots.push(doorwayDot);
        }
        return panelIndex;
      }

      function showLinkedFloorExhibit(targetTitle, sourcePanelIndex) {
        var targetExhibitIndex = exhibitIndex(targetTitle);
        var targetPanelIndex = trackState.cardMeta.reduce(function (closest, cardState, index) {
          if (cardState.kind !== "exhibit" || cardState.exhibitIndex !== targetExhibitIndex) {
            return closest;
          }
          if (closest === -1) return index;
          return Math.abs(index - sourcePanelIndex) < Math.abs(closest - sourcePanelIndex)
            ? index
            : closest;
        }, -1);
        if (targetPanelIndex < 0) return;
        track.scrollTo({
          left: targetPanelIndex * track.clientWidth,
          behavior: scrollBehavior()
        });
        updateTrack(trackState, targetPanelIndex, true);
      }

      function appendExhibit(exhibitIndex, ordinal, direction, includeProgressDot) {
        var exhibit = exhibits[exhibitIndex];
        var panelIndex = trackState.cards.length;
        var card = makeElement("article", "mobile-story-card");
        var linework = makeElement("div", "mobile-story-linework");
        var figure = makeElement("figure", "mobile-story-artifact");
        var image = document.createElement("img");
        var purpose = makeElement("div", "mobile-story-purpose");
        var revealLabel = exhibit.mobileDirectLink
          ? exhibit.mobileLinkLabel || exhibit.linkLabel
          : exhibit.mobileRevealLabel
            ? exhibit.mobileRevealLabel
          : exhibit.offerPath
            ? "Select This Issue"
          : exhibit.displayType === "product"
            ? "Explore this way to work"
            : "Reveal the passion";
        var reveal = makeElement(exhibit.mobileDirectLink ? "a" : "button", "mobile-story-passion", revealLabel);
        var dot = makeElement("button", "mobile-story-dot");

        card.dataset.exhibitIndex = String(exhibitIndex);
        card.dataset.storyDirection = direction.toLowerCase();
        card.setAttribute("aria-label", exhibit.offerPath
          ? exhibit.offerPath + ": " + exhibit.staticTitle
          : exhibit.staticTitle || exhibit.title);
        linework.appendChild(makeElement("span"));
        linework.appendChild(makeElement("span"));
        card.appendChild(linework);

        if (exhibit.mobileImage) {
          image.src = exhibit.mobileImage;
          image.alt = exhibit.title + " exhibit artwork";
          image.decoding = "async";
          image.loading = roomIndex === 0 ? "eager" : "lazy";
          figure.classList.add("is-generated-path");
          figure.appendChild(image);
        } else if (exhibit.displayType === "product") {
          var productInstallation = makeElement("div", "mobile-story-product-installation is-" + exhibit.artworkPattern);
          var productCode = makeElement("span", "mobile-story-product-code", exhibit.artworkCode);
          var productDiagram = makeElement("span", "mobile-story-product-diagram");
          for (var productNodeIndex = 0; productNodeIndex < 6; productNodeIndex += 1) {
            productDiagram.appendChild(makeElement("i"));
          }
          productInstallation.appendChild(productCode);
          productInstallation.appendChild(productDiagram);
          figure.classList.add("is-product");
          figure.setAttribute("aria-hidden", "true");
          figure.appendChild(productInstallation);
        } else if (exhibit.mobileArtwork === "contact") {
          var contactInstallation = makeElement("div", "mobile-story-contact-installation");
          var contactLabel = makeElement("span", "mobile-story-contact-label", "Plan a Call");
          var contactPlate = makeElement("span", "mobile-story-contact-plate");
          contactPlate.appendChild(makeElement("span", "mobile-story-contact-button"));
          contactInstallation.appendChild(contactLabel);
          contactInstallation.appendChild(contactPlate);
          figure.classList.add("is-contact");
          figure.setAttribute("aria-hidden", "true");
          figure.appendChild(contactInstallation);
        } else if (exhibit.image) {
          if (exhibit.mobileImageFit) figure.classList.add("is-image-" + exhibit.mobileImageFit);
          image.src = exhibit.image;
          image.alt = exhibit.title + " exhibit artwork";
          image.decoding = "async";
          image.loading = roomIndex === 0 ? "eager" : "lazy";
          figure.appendChild(image);
        } else {
          figure.classList.add("is-empty");
          figure.setAttribute("aria-hidden", "true");
        }
        card.appendChild(figure);

        var cardLabel = room.id === "work"
          ? (exhibit.mobileDirectLink
            ? "Next Step"
            : exhibit.offerPath
              ? exhibit.offerNumber + " / " + exhibit.offerPath
              : "Offer " + String(ordinal).padStart(2, "0"))
          : exhibit.mobileCardLabel || exhibit.staticKicker || "Exhibit " + String(ordinal).padStart(2, "0") + " / Purpose";
        if (!room.hideCardMetadata) {
          purpose.appendChild(makeElement("p", "mobile-story-purpose-label", cardLabel));
        }
        purpose.appendChild(makeElement("h3", "", exhibit.offerPath
          ? exhibit.staticTitle
          : exhibit.mobileTitle || exhibit.staticTitle || exhibit.title));
        if (exhibit.mobileFoundation && !room.hideCardMetadata) {
          purpose.classList.add("has-foundation");
          purpose.appendChild(makeElement("p", "mobile-story-method-foundation", exhibit.mobileFoundation));
        }
        purpose.appendChild(makeElement("p", "mobile-story-purpose-copy", exhibit.mobilePurpose || exhibit.purpose));
        if (exhibit.mobileMetricsKey && researchProjectMetrics[exhibit.mobileMetricsKey]) {
          var projectMetrics = researchProjectMetrics[exhibit.mobileMetricsKey];
          purpose.classList.add("has-research-stats");
          purpose.appendChild(makeElement(
            "p",
            "mobile-story-research-stats",
            formatMetric(projectMetrics.githubCommits) + " GitHub commits · Last updated "
              + formatMetricDate(projectMetrics.latestPublicUpdate)
          ));
        } else if (
          exhibit.mobileDevelopmentMetricsKey
          && developmentProjectMetrics[exhibit.mobileDevelopmentMetricsKey]
        ) {
          var developmentMetrics = developmentProjectMetrics[exhibit.mobileDevelopmentMetricsKey];
          purpose.classList.add("has-research-stats");
          purpose.appendChild(makeElement(
            "p",
            "mobile-story-research-stats",
            exhibit.mobileStage + " · "
              + formatMetric(developmentMetrics.publicRevisions) + " public revisions · updated "
              + formatMetricDate(developmentMetrics.latestPublicUpdate)
          ));
        } else if (exhibit.mobileResearchRecord) {
          purpose.classList.add("has-research-stats");
          purpose.appendChild(makeElement(
            "p",
            "mobile-story-research-stats",
            formatMetric(capacityMetrics.publishedResearchRecords) + " published records · updated "
              + formatMetricDate(capacityMetrics.asOf)
          ));
        }
        if (exhibit.mobileDirectLink) {
          reveal.classList.add("is-direct");
          reveal.href = exhibit.link;
          reveal.target = exhibit.mobileLinkTarget || exhibit.linkTarget || "_self";
          if (reveal.target === "_blank") reveal.rel = "noreferrer";
          reveal.setAttribute("aria-label", exhibit.mobileLinkLabel || exhibit.linkLabel);
        } else {
          reveal.type = "button";
          reveal.setAttribute(
            "aria-label",
            exhibit.offerPath
              ? "Select this issue: " + exhibit.staticTitle
              : exhibit.mobileRevealLabel
                ? exhibit.mobileRevealLabel + ": " + exhibit.title
              : exhibit.displayType === "product"
              ? "Explore " + (exhibit.offerPath || exhibit.title)
              : "Reveal the passion behind " + exhibit.title
          );
          reveal.addEventListener("click", function () {
            if (exhibit.mobileFloorTarget) {
              showLinkedFloorExhibit(exhibit.mobileFloorTarget, panelIndex);
            } else {
              openMobileInspector(
                exhibitIndex,
                reveal,
                exhibit.mobileInspectorFloorTarget
                  ? function () {
                    showLinkedFloorExhibit(exhibit.mobileInspectorFloorTarget, panelIndex);
                  }
                  : null
              );
            }
          });
        }
        if (room.id === "work" && exhibit.mobileDirectLink) {
          var actions = makeElement("div", "mobile-story-actions");
          var shareToggle = makeElement("button", "mobile-story-share");
          shareToggle.type = "button";
          shareToggle.setAttribute("aria-label", "Share the Thinking Museum with a friend");
          shareToggle.appendChild(shareGlyph("share"));
          shareToggle.appendChild(shareLabel("Share"));
          ensureStoryShare().register(shareToggle);
          actions.appendChild(reveal);
          actions.appendChild(shareToggle);
          purpose.appendChild(actions);
        } else {
          purpose.appendChild(reveal);
        }
        if (
          !exhibit.mobileHideDirectHint
          && !(exhibit.mobileDirectLink && exhibit.mobileMetricsKey)
        ) {
          purpose.appendChild(makeElement(
            "p",
            "mobile-story-swipe-hint",
            exhibit.mobileDirectLink
              ? exhibit.mobileDirectHint || "Open the experience, or share the museum"
              : exhibit.mobileFloorTarget
                ? "Open the supporting system behind this capability"
              : exhibit.mobileRevealLabel
                ? "Tap to see the capability behind the work"
              : exhibit.displayType === "product"
                ? "Tap to see what changes and what you leave with"
                : "Tap the button to open Passion"
          ));
        }
        card.appendChild(purpose);
        track.appendChild(card);
        trackState.cards.push(card);
        trackState.cardMeta.push({
          kind: "exhibit",
          ordinal: ordinal,
          direction: direction,
          exhibitIndex: exhibitIndex
        });

        if (includeProgressDot) {
          dot.type = "button";
          dot.dataset.storyProgress = "exhibit:" + ordinal;
          dot.setAttribute("aria-label", "Show " + exhibit.title);
          dot.addEventListener("click", function () {
            track.scrollTo({ left: panelIndex * track.clientWidth, behavior: scrollBehavior() });
            updateTrack(trackState, panelIndex, true);
          });
          dots.appendChild(dot);
          trackState.dots.push(dot);
        }
      }

      function appendMethodPanel(panel, position, includeProgressDot, ordinal, swipeHint) {
        var panelIndex = trackState.cards.length;
        var card = makeElement("article", "mobile-story-card mobile-story-method-closing");
        var linework = makeElement("div", "mobile-story-linework");
        var figure = makeElement("figure", "mobile-story-artifact is-method-map");
        var triad = makeElement("div", "mobile-story-method-triad");
        var purpose = makeElement("div", "mobile-story-purpose");
        var dot = makeElement("button", "mobile-story-dot");

        card.dataset.storyDirection = position;
        card.setAttribute("aria-label", panel.title);
        linework.appendChild(makeElement("span"));
        linework.appendChild(makeElement("span"));
        card.appendChild(linework);

        (panel.labels || ["Facilitate", "Architect", "Accelerate"]).forEach(function (label, index) {
          var node = makeElement("span", "", label);
          node.appendChild(makeElement("i", "", "0" + String(index + 1)));
          triad.appendChild(node);
        });
        figure.setAttribute("aria-hidden", "true");
        figure.appendChild(triad);
        card.appendChild(figure);

        if (!room.hideCardMetadata || panel.showLabel) {
          purpose.appendChild(makeElement("p", "mobile-story-purpose-label", panel.label));
        }
        purpose.appendChild(makeElement("h3", "", panel.title));
        purpose.appendChild(makeElement("p", "mobile-story-purpose-copy", panel.body));
        if (panel.secondaryBody) {
          purpose.appendChild(makeElement("p", "mobile-story-purpose-copy", panel.secondaryBody));
        }
        if (panel.footer) {
          purpose.appendChild(makeElement("p", "mobile-story-method-footer", panel.footer));
        }
        if (panel.cta) {
          var methodCta = makeElement("button", "mobile-story-method-cta", panel.cta);
          methodCta.type = "button";
          methodCta.addEventListener("click", function () {
            var nextPanelIndex = panelIndex + (position === "left" ? -1 : 1);
            track.scrollTo({ left: nextPanelIndex * track.clientWidth, behavior: scrollBehavior() });
            updateTrack(trackState, nextPanelIndex, true);
          });
          purpose.appendChild(methodCta);
        }
        if (swipeHint) {
          purpose.appendChild(makeElement("p", "mobile-story-swipe-hint", swipeHint));
        }
        card.appendChild(purpose);
        track.appendChild(card);
        trackState.cards.push(card);
        trackState.cardMeta.push({ kind: "exhibit", ordinal: ordinal, direction: position });

        if (includeProgressDot) {
          dot.type = "button";
          dot.dataset.storyProgress = "exhibit:" + ordinal;
          dot.setAttribute("aria-label", "Show " + panel.title);
          dot.addEventListener("click", function () {
            track.scrollTo({ left: panelIndex * track.clientWidth, behavior: scrollBehavior() });
            updateTrack(trackState, panelIndex, true);
          });
          dots.appendChild(dot);
          trackState.dots.push(dot);
        }
      }

      function appendOpening(position, includeProgressDot) {
        appendMethodPanel(
          room.opening,
          position,
          includeProgressDot,
          1,
          ""
        );
      }

      function appendClosing(position, includeProgressDot) {
        appendMethodPanel(
          room.closing,
          position,
          includeProgressDot,
          room.exhibits.length + (room.opening ? 2 : 1),
          "Keep circling to return to the elevator"
        );
      }

      appendDoorway("left-return", false);
      if (room.pathDoor) {
        room.exhibits.slice().reverse().forEach(function (exhibitIndex, exhibitIndexOnFloor) {
          appendExhibit(exhibitIndex, room.exhibits.length - exhibitIndexOnFloor, "Left", false);
        });
        appendPathDoor("left", false);
      } else {
        if (room.opening) {
          if (room.closing) appendClosing("left", false);
          room.exhibits.forEach(function (exhibitIndex, exhibitIndexOnFloor) {
            appendExhibit(exhibitIndex, exhibitIndexOnFloor + 2, "Left", false);
          });
          appendOpening("left", false);
        } else {
          room.exhibits.forEach(function (exhibitIndex, exhibitIndexOnFloor) {
            appendExhibit(exhibitIndex, exhibitIndexOnFloor + 1, "Left", false);
          });
          if (room.closing) appendClosing("left", false);
        }
      }
      trackState.homeIndex = appendDoorway("center", true);
      if (room.pathDoor) appendPathDoor("right", true);
      if (room.opening) appendOpening("right", true);
      room.exhibits.forEach(function (exhibitIndex, exhibitIndexOnFloor) {
        appendExhibit(exhibitIndex, exhibitIndexOnFloor + 1 + (room.opening ? 1 : 0), "Right", true);
      });
      if (room.closing) appendClosing("right", true);
      appendDoorway("right-return", false);

      track.setAttribute(
        "aria-label",
        room.title + " elevator with a continuous " + (room.id === "work" ? "offer" : "exhibit") + " circuit"
      );
      track.addEventListener("scroll", function () {
        if (trackState.scrollFrame) window.cancelAnimationFrame(trackState.scrollFrame);
        if (trackState.loopTimer) window.clearTimeout(trackState.loopTimer);
        trackState.scrollFrame = window.requestAnimationFrame(function () {
          var normalizedPosition = track.scrollLeft / Math.max(track.clientWidth, 1);
          var nextIndex = Math.round(normalizedPosition);
          updateTrack(trackState, nextIndex, true);
          if (nextIndex === 0 || nextIndex === trackState.cards.length - 1) {
            trackState.loopTimer = window.setTimeout(function () {
              track.scrollTo({
                left: trackState.homeIndex * track.clientWidth,
                behavior: "auto"
              });
              updateTrack(trackState, trackState.homeIndex, false);
              trackState.loopTimer = 0;
            }, reducedMotion ? 40 : 180);
          }
          trackState.scrollFrame = 0;
        });
      }, { passive: true });

      section.appendChild(header);
      section.appendChild(track);
      mobileStories.appendChild(section);
      roomSections.push(section);
      roomTracks.push(trackState);
      track.scrollLeft = trackState.homeIndex * track.clientWidth;
      setDoorOpening(trackState, 1);
      updateTrack(trackState, trackState.homeIndex, false);
    });

    updateIntro();
    updateVerticalDoorOpening();

    mobileStories.addEventListener("scroll", function () {
      if (verticalDoorFrame) window.cancelAnimationFrame(verticalDoorFrame);
      verticalDoorFrame = window.requestAnimationFrame(function () {
        updateVerticalDoorOpening();
        verticalDoorFrame = 0;
      });
    }, { passive: true });

    if ("IntersectionObserver" in window) {
      var roomObserver = new IntersectionObserver(function (entries) {
        var visible = entries.filter(function (entry) { return entry.isIntersecting; })
          .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
        if (!visible.length) return;
        if (visible[0].target === introSection) {
          if (activeRoomIndex !== -1) updateIntro();
          return;
        }
        var nextRoomIndex = roomSections.indexOf(visible[0].target);
        if (nextRoomIndex !== -1 && nextRoomIndex !== activeRoomIndex) {
          updateRoom(nextRoomIndex);
          pulse(5);
        }
      }, {
        root: mobileStories,
        threshold: [0.52, 0.72, 0.9]
      });
      roomObserver.observe(introSection);
      roomSections.forEach(function (section) { roomObserver.observe(section); });
    }

    inspectorClose.addEventListener("click", function () { closeMobileInspector(); });
    inspectorBackdrop.addEventListener("click", function () { closeMobileInspector(); });
    inspector.addEventListener("touchstart", function (event) {
      if (event.touches.length !== 1 || inspector.scrollTop > 0) return;
      inspectorTouchStart = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
    }, { passive: true });
    inspector.addEventListener("touchend", function (event) {
      if (!inspectorTouchStart || !event.changedTouches.length) return;
      var deltaX = event.changedTouches[0].clientX - inspectorTouchStart.x;
      var deltaY = event.changedTouches[0].clientY - inspectorTouchStart.y;
      inspectorTouchStart = null;
      if (deltaY > 72 && Math.abs(deltaY) > Math.abs(deltaX) * 1.15) closeMobileInspector();
    }, { passive: true });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && inspector.classList.contains("is-open")) {
        closeMobileInspector();
        return;
      }
      if (inspector.classList.contains("is-open")) return;
      if (storyShare && storyShare.isOpen()) return;

      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        if (activeRoomIndex < 0) return;
        event.preventDefault();
        moveTrack(roomTracks[activeRoomIndex], event.key === "ArrowRight" ? 1 : -1);
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        if (activeRoomIndex < 0) {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            roomSections[0].scrollIntoView({ behavior: scrollBehavior(), block: "start" });
            updateRoom(0);
            pulse(5);
          }
          return;
        }
        event.preventDefault();
        if (event.key === "ArrowUp" && activeRoomIndex === 0) {
          introSection.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
          updateIntro();
          pulse(5);
          return;
        }
        var nextRoom = Math.max(0, Math.min(roomSections.length - 1, activeRoomIndex + (event.key === "ArrowDown" ? 1 : -1)));
        if (nextRoom !== activeRoomIndex) {
          roomSections[nextRoom].scrollIntoView({ behavior: scrollBehavior(), block: "start" });
          updateRoom(nextRoom);
          pulse(5);
        }
      }
    });

    window.addEventListener("resize", function () {
      roomTracks.forEach(function (trackState) {
        trackState.track.scrollLeft = trackState.activeIndex * trackState.track.clientWidth;
      });
    }, { passive: true });
  }

  import("/assets/vendor/three.module.min.js").then(function (THREE) {
    initMuseum(THREE);
  }).catch(function () {
    showFallback("The local 3D library did not load. The current Thinking experience is still available.");
  });

  function initMuseum(THREE) {
    var isMobile = window.matchMedia(phoneExperienceMediaQuery).matches;
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030302);

    var camera = new THREE.PerspectiveCamera(66, 1, 0.1, 120);
    camera.position.set(0, 1.68, -8.8);
    camera.rotation.order = "YXZ";
    camera.rotation.y = Math.PI;

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false, powerPreference: "high-performance", preserveDrawingBuffer: false });
    } catch (error) {
      showFallback("The browser could not create a WebGL renderer for this experiment.");
      return;
    }

    var renderPixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
    renderer.setPixelRatio(renderPixelRatio);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    root.dataset.renderScale = renderPixelRatio.toFixed(2);

    var raycaster = new THREE.Raycaster();
    var pointer = new THREE.Vector2(0, 0);
    var interactive = [];
    var exhibitAnchors = [];
    var visibleExhibitIndexes = [];
    var commandBillboard = null;
    var graveyardTombstones = [];
    var backWallNeon = null;
    var backWallNeonLight = null;
    var repositoryPowerMaterials = {};
    var agentActiveRepositoryAnchors = [];
    var repositoryPowerProbe = new THREE.Vector3();
    var repositoryPulseBaseColor = new THREE.Color(0xd8bd8a);
    var repositoryPulseActiveColor = new THREE.Color(0xbef27a);
    var repositoryPulseLastUpdate = 0;
    var roomFixtures = [];
    var contactButtonAnchors = [];
    var contactShare = null;
    var mobileIndex = -1;
    var currentProximityIndex = -1;
    var currentProximityKey = "";
    var started = false;
    var yaw = Math.PI;
    var pitch = 0;
    var keys = {};
    var lastFrameTime = performance.now();
    var renderRequestId = 0;
    var idleVisualTimer = 0;
    var sceneDirty = true;
    var cameraDirty = true;
    var centralObject = { x: 0, z: 0.1, radius: 1.85 };
    var pushingRoomOffset = { x: -25.6, z: -1.0 };
    var pushingRoom = null;
    var workRoomOffset = { x: 4.2, z: 6.5 };
    var whoIsJoeSourceDoorCenter = { x: -2.32, z: -18.9 };
    var workRoomLayout = {
      west: 5.18,
      east: 16.68,
      south: -11.0,
      north: 2.0,
      centerX: 10.93,
      centerZ: -4.5,
      supportConnectorX: 14.18
    };
    var identityHallCenterZ = workRoomOffset.z + workRoomLayout.centerZ;
    var identityZShift = identityHallCenterZ - 1.0;
    var workOfferPlacement = {
      displayScale: 0.72,
      north: {
        buildX: 10.884,
        connectX: 7.226
      },
      south: {
        pushX: 7.85,
        leadershipX: 11.15
      }
    };
    var methodsRoomLayout = {
      west: 3.18,
      east: 16.68,
      north: -15.5,
      south: -27.0,
      centerX: 9.93,
      centerZ: -21.25
    };
    var workRoom = null;
    var entranceView = { x: 0, y: 1.68, z: -8.8, yaw: Math.PI };
    var elevator = {
      state: "idle",
      phaseStarted: 0,
      sourceDoors: null,
      destinationDoors: null,
      sourceCenter: whoIsJoeSourceDoorCenter,
      destinationCenter: { x: 40.25, z: identityHallCenterZ },
      indicatorMaterials: [],
      movementLocked: false,
      transported: false,
      cooldownSide: null
    };
    var walkableZones = [
      { name: "church", xMin: -8.35, xMax: 8.35, zMin: -58.4, zMax: -31.2 },
      { name: "graveyard-entry", xMin: 8.0, xMax: 14.3, zMin: -54.15, zMax: -50.55 },
      { name: "graveyard-hall", xMin: 12.4, xMax: 16.0, zMin: -76.8, zMax: -50.55 },
      { name: "graveyard-field", xMin: 3.4, xMax: 25.0, zMin: -97.5, zMax: -75.7 },
      { name: "discover-church-link", xMin: -15.55, xMax: -7.9, zMin: -53.65, zMax: -50.95 },
      { name: "discover-spine", xMin: -15.55, xMax: -11.25, zMin: -52.3, zMax: -12.2 },
      { name: "discover-entry-a", xMin: -8.0, xMax: -4.6, zMin: -10.05, zMax: -7.25 },
      { name: "discover-entry-b", xMin: -9.4, xMax: -6.6, zMin: -12.5, zMax: -8.65 },
      { name: "discover-entry-c", xMin: -15.55, xMax: -7.7, zMin: -13.9, zMax: -11.1 },
      { name: "development-entry", xMin: -11.5, xMax: -10.1, zMin: -26.65, zMax: -23.35 },
      { name: "development-room", xMin: -11.25, xMax: -4.75, zMin: -28.7, zMax: -21.3 },
      { name: "support-work-leg", xMin: workRoomOffset.x + workRoomLayout.supportConnectorX - 1.25, xMax: workRoomOffset.x + workRoomLayout.supportConnectorX + 1.25, zMin: workRoomOffset.z + workRoomLayout.north - 0.25, zMax: 25.25 },
      { name: "support-cross-hall", xMin: -21.45, xMax: workRoomOffset.x + workRoomLayout.supportConnectorX + 0.2, zMin: 22.65, zMax: 27.35 },
      { name: "support-control-leg", xMin: -22.45, xMax: -19.95, zMin: 8.9, zMax: 25.25 },
      { name: "church-approach", xMin: -1.4, xMax: 1.4, zMin: -31.2, zMax: -29.2 },
      { name: "church-transition-narrow", xMin: -1.4, xMax: 1.4, zMin: -29.25, zMax: -28.45 },
      { name: "church-transition-mid", xMin: -1.65, xMax: 1.65, zMin: -28.5, zMax: -27.7 },
      { name: "church-transition-wide", xMin: -1.9, xMax: 1.9, zMin: -27.75, zMax: -26.95 },
      { name: "church-hallway", xMin: -2.15, xMax: 2.15, zMin: -27.0, zMax: -10.8 },
      { name: "orientation", xMin: -4.75, xMax: 4.75, zMin: -10.8, zMax: 5.68 },
      { name: "work-entry", xMin: 4.6, xMax: workRoomOffset.x + workRoomLayout.west + 0.2, zMin: -0.7, zMax: 2.7 },
      { name: "work-room", xMin: workRoomOffset.x + workRoomLayout.west + 0.17, xMax: workRoomOffset.x + workRoomLayout.east - 0.17, zMin: workRoomOffset.z + workRoomLayout.south + 0.25, zMax: workRoomOffset.z + workRoomLayout.north - 0.25 },
      { name: "methods-hall", xMin: workRoomOffset.x + 13.93, xMax: workRoomOffset.x + 16.43, zMin: workRoomOffset.z + methodsRoomLayout.north - 0.5, zMax: workRoomOffset.z + workRoomLayout.south + 0.25 },
      { name: "methods-room", xMin: workRoomOffset.x + methodsRoomLayout.west + 0.25, xMax: workRoomOffset.x + methodsRoomLayout.east - 0.25, zMin: workRoomOffset.z + methodsRoomLayout.south + 0.25, zMax: workRoomOffset.z + methodsRoomLayout.north - 0.25 },
      { name: "identity-entry-narrow", xMin: workRoomOffset.x + workRoomLayout.east - 0.15, xMax: workRoomOffset.x + workRoomLayout.east + 1.1, zMin: 0.58 + identityZShift, zMax: 1.42 + identityZShift },
      { name: "identity-entry-wide", xMin: workRoomOffset.x + workRoomLayout.east - 0.25, xMax: workRoomOffset.x + workRoomLayout.east + 2.45, zMin: -0.9 + identityZShift, zMax: 2.9 + identityZShift },
      { name: "identity-hallway", xMin: workRoomOffset.x + workRoomLayout.east + 2.1, xMax: 40.15, zMin: -1.15 + identityZShift, zMax: 3.15 + identityZShift },
      { name: "identity-side-entry", xMin: 28.75, xMax: 33.25, zMin: -2.0 + identityZShift, zMax: -0.8 + identityZShift },
      { name: "identity-side-gallery", xMin: 24.25, xMax: 38.25, zMin: -8.7 + identityZShift, zMax: -1.65 + identityZShift },
      { name: "identity-destination-cab", xMin: 39.95, xMax: 44.25, zMin: -0.5 + identityZShift, zMax: 2.5 + identityZShift },
      { name: "identity-source-cab", xMin: -5.75, xMax: -2.0, zMin: whoIsJoeSourceDoorCenter.z - 1.45, zMax: whoIsJoeSourceDoorCenter.z + 1.45 },
      { name: "pushing-entry", xMin: -17.8, xMax: -4.6, zMin: 0.2, zMax: 3.6 },
      { name: "pushing-room", xMin: -33.95, xMax: -17.25, zMin: -12.45, zMax: 9.1 }
    ];
    var proximityRange = 2.175;
    var capacityProximityRange = 4.35;

    root.dataset.mode = isMobile ? "mobile" : "desktop";
    if (mobileInspect) mobileInspect.disabled = true;

    THREE.DefaultLoadingManager.onLoad = function () {
      sceneDirty = true;
      requestRender();
    };

    buildScene();
    resize();
    if (isMobile) {
      setEntranceView();
      suspendRendering();
      markExperienceReady();
    } else {
      startDesktopExperience();
      requestRender();
    }
    setStatus(isMobile ? "guided walkthrough" : "arrow keys to move");

    if (startButton) {
      startButton.addEventListener("click", function () {
        startExperience();
      });
    }

    if (inspectorClose) {
      inspectorClose.addEventListener("click", closeInspector);
    }

    if (mobilePrev) {
      mobilePrev.addEventListener("click", function () {
        stepMobileExhibit(-1);
      });
    }

    if (mobileNext) {
      mobileNext.addEventListener("click", function () {
        stepMobileExhibit(1);
      });
    }

    if (mobileInspect) {
      mobileInspect.addEventListener("click", function () {
        if (mobileIndex < 0) return;
        openInspector(mobileIndex);
      });
    }

    if (proximityAction) {
      proximityAction.addEventListener("click", function () {
        if (proximityAction.dataset.action === "respawn") {
          returnToStartingPosition();
        } else if (proximityAction.dataset.action === "contact-joe") {
          window.location.assign("/contact/");
        }
      });
    }

    if (tabletControls) {
      tabletControls.querySelectorAll("[data-tablet-key]").forEach(function (button) {
        var keyCode = button.dataset.tabletKey;

        function setPressed(pressed) {
          keys[keyCode] = pressed;
          keys[keyCode.toLowerCase()] = pressed;
          button.classList.toggle("is-pressed", pressed);
          root.dataset.lastKey = "Tablet:" + keyCode;
          if (pressed) dismissInstructions();
          requestRender();
        }

        button.addEventListener("pointerdown", function (event) {
          event.preventDefault();
          if (button.setPointerCapture) button.setPointerCapture(event.pointerId);
          setPressed(true);
        });
        ["pointerup", "pointercancel", "lostpointercapture"].forEach(function (eventName) {
          button.addEventListener(eventName, function (event) {
            event.preventDefault();
            setPressed(false);
          });
        });
        button.addEventListener("contextmenu", function (event) {
          event.preventDefault();
        });
      });
    }

    function activateVisibleProximityCta(event) {
      if (
        isMobile ||
        event.key !== "Enter" ||
        event.repeat ||
        event.isComposing ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey ||
        event.shiftKey
      ) return false;

      var eventTarget = event.target;
      if (
        eventTarget &&
        eventTarget.nodeType === 1 &&
        (
          eventTarget.isContentEditable ||
          eventTarget.closest("a, button, input, textarea, select, summary")
        )
      ) return false;

      if (!proximity || !proximity.classList.contains("is-open")) return false;
      if (inspector && inspector.classList.contains("is-open")) return false;
      if (contactShare && contactShare.rack.isOpen()) return false;

      var primaryCta = null;
      if (proximityAction && !proximityAction.hidden && proximityAction.classList.contains("is-open")) {
        primaryCta = proximityAction;
      } else if (
        proximityLink &&
        proximityLink.classList.contains("is-open") &&
        proximityLink.getAttribute("aria-hidden") !== "true"
      ) {
        primaryCta = proximityLink;
      }

      if (!primaryCta) return false;
      event.preventDefault();
      primaryCta.click();
      return true;
    }

    canvas.addEventListener("click", pickExhibit);
    canvas.addEventListener("pointermove", updateInteractiveCursor);

    document.addEventListener("keydown", function (event) {
      keys[event.code] = true;
      keys[String(event.key).toLowerCase()] = true;
      root.dataset.lastKey = event.code + ":" + event.key;
      if (activateVisibleProximityCta(event)) return;
      if (event.code.indexOf("Arrow") === 0) {
        event.preventDefault();
        dismissInstructions();
        requestRender();
      }
      if (event.code === "Escape") {
        closeInspector();
        closeProximity();
      }
    });

    document.addEventListener("keyup", function (event) {
      keys[event.code] = false;
      keys[String(event.key).toLowerCase()] = false;
      requestRender();
    });

    window.addEventListener("blur", function () {
      keys = {};
      setDatasetValue("motion", "0,0");
      requestRender();
    });

    document.addEventListener("visibilitychange", function () {
      if (document.hidden) {
        suspendRendering();
      } else if (!isMobile) {
        sceneDirty = true;
        cameraDirty = true;
        requestRender();
      }
    });

    window.addEventListener("resize", function () {
      isMobile = window.matchMedia(phoneExperienceMediaQuery).matches;
      root.dataset.mode = isMobile ? "mobile" : "desktop";
      resize();
      if (isMobile) {
        suspendRendering();
        if (mobileIndex >= 0) setMobileExhibit(mobileIndex);
        else setEntranceView();
      } else {
        sceneDirty = true;
        cameraDirty = true;
        requestRender();
      }
    }, { passive: true });

    function startExperience() {
      if (!isMobile) {
        startDesktopExperience();
        return;
      }
      started = true;
      root.dataset.started = "true";
      root.classList.add("is-started");
      closeInspector();
      setStatus("guided walkthrough");
      setEntranceView();
    }

    function startDesktopExperience() {
      started = true;
      root.dataset.started = "true";
      root.classList.add("is-started");
      setStatus("arrow keys to move");
      requestRender();
    }

    function dismissInstructions() {
      if (!instructions) return;
      root.classList.add("has-dismissed-instructions");
    }

    function resize() {
      var rect = root.getBoundingClientRect();
      var width = Math.max(1, Math.floor(rect.width));
      var height = Math.max(1, Math.floor(rect.height));
      renderPixelRatio = Math.min(window.devicePixelRatio || 1, 1.5);
      renderer.setPixelRatio(renderPixelRatio);
      root.dataset.renderScale = renderPixelRatio.toFixed(2);
      renderer.setSize(isMobile ? 1 : width, isMobile ? 1 : height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      sceneDirty = true;
      cameraDirty = true;
    }

    function buildScene() {
      var ambient = new THREE.AmbientLight(0xd8bd8a, 0.55);
      scene.add(ambient);

      var keyLight = new THREE.PointLight(0xffe3a6, 1.1, 22);
      keyLight.position.set(0, 4.8, 1);
      scene.add(keyLight);

      var backLight = new THREE.PointLight(0xd8bd8a, 0.7, 18);
      backLight.position.set(0, 3.6, -8);
      scene.add(backLight);

      pushingRoom = new THREE.Group();
      pushingRoom.position.set(pushingRoomOffset.x, 0, pushingRoomOffset.z);
      scene.add(pushingRoom);

      workRoom = new THREE.Group();
      workRoom.position.set(workRoomOffset.x, 0, workRoomOffset.z);
      scene.add(workRoom);

      addWireRoom(pushingRoom);
      addBackWallNeon();
      addChurchChapel();
      addGraveyardWing();
      addHallwayStatements();
      addOrientationHallway();
      addWelcomeWallStatement();
      addSupportingHallway();
      addDiscoverWing();
      addWorkWithJoeRoom(workRoom);
      addWhoIsJoeExperience();
      addContactWallButton();
      addHallwayGallery();
      addCentralObject(pushingRoom);
      addControlRoomGallery(pushingRoom);
      addExhibits();
    }

    function addWireRoom(parent) {
      var target = parent || scene;
      var tan = new THREE.Color(0xd8bd8a);
      var gold = new THREE.Color(0xffe3a6);
      var grid = new THREE.GridHelper(18, 18, tan, tan);
      grid.material.transparent = true;
      grid.material.opacity = 0.20;
      grid.position.y = 0;
      target.add(grid);

      addLineBox(new THREE.Vector3(0, 2.9, -0.6), new THREE.Vector3(17, 5.8, 22), 0.24, target);
      addLineBox(new THREE.Vector3(0, 2.9, -0.6), new THREE.Vector3(11.5, 4.4, 15.2), 0.18, target);

      var pathMaterial = new THREE.LineBasicMaterial({ color: gold, transparent: true, opacity: 0.36 });
      var points = [
        new THREE.Vector3(-5.6, 0.03, 8.5),
        new THREE.Vector3(-2.7, 0.03, 4.2),
        new THREE.Vector3(2.5, 0.03, 2.1),
        new THREE.Vector3(5.7, 0.03, -2.2),
        new THREE.Vector3(2.2, 0.03, -6.4),
        new THREE.Vector3(-2.4, 0.03, -8.4)
      ];
      target.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), pathMaterial));
      addPushingRoomWalls(target);
    }

    function addOrientationHallway() {
      addLineBox(new THREE.Vector3(0, 2.4, -2.16), new THREE.Vector3(10.4, 4.8, 17.28), 0.28);
      [
        { x: 5.18, z: -6.28, length: 10.05, rotation: Math.PI / 2 },
        { x: 5.18, z: 4.87, length: 3.23, rotation: Math.PI / 2 },
        { x: -5.18, z: -10.83, length: 0.95, rotation: Math.PI / 2 },
        { x: -5.18, z: -3.7, length: 6.5, rotation: Math.PI / 2 },
        { x: -5.18, z: 5.27, length: 2.43, rotation: Math.PI / 2 },
        { x: -3.77, z: -10.8, length: 2.82, rotation: 0 },
        { x: 3.77, z: -10.8, length: 2.82, rotation: 0 },
        { x: 0, z: 6.48, length: 10.36, rotation: 0 }
      ].forEach(function (wall) {
        addDarkWall(wall);
      });

      var centerLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0.035, -10.7),
          new THREE.Vector3(0, 0.035, 5.53)
        ]),
        new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.28 })
      );
      scene.add(centerLine);

      addPortal({
        x: -5.15,
        z: -8.65,
        rotation: Math.PI / 2,
        title: "Research & Experimentation",
        reverseTitle: "Orientation Hallway"
      });
      addPortal({
        x: 5.15,
        z: 1.0,
        rotation: -Math.PI / 2,
        title: "Work With Joe",
        reverseTitle: "Orientation Hallway"
      });
      var workEntryEnd = workRoomOffset.x + workRoomLayout.west;
      var workEntryLength = workEntryEnd - 5.15;
      var workEntryCenter = (5.15 + workEntryEnd) / 2;
      addLineBox(new THREE.Vector3(workEntryCenter, 2.4, 1.0), new THREE.Vector3(workEntryLength, 4.8, 3.4), 0.24);
      addDarkWall({ x: workEntryCenter, z: -0.7, length: workEntryLength, rotation: 0 });
      addDarkWall({ x: workEntryCenter, z: 2.7, length: workEntryLength, rotation: 0 });
      addPortal({
        x: -5.15,
        z: 1.8,
        rotation: Math.PI / 2,
        title: "Control Room",
        reverseTitle: "Orientation Hallway"
      });
      var controlRoomEastEdge = pushingRoomOffset.x + 8.5;
      var controlEntryStart = -5.15;
      var controlEntryLength = controlEntryStart - controlRoomEastEdge;
      var controlEntryCenter = (controlEntryStart + controlRoomEastEdge) / 2;
      addLineBox(new THREE.Vector3(controlEntryCenter, 2.4, 1.8), new THREE.Vector3(controlEntryLength, 4.8, 3.4), 0.24);
      addDarkWall({ x: controlEntryCenter, z: 0.2, length: controlEntryLength, rotation: 0 });
      addDarkWall({ x: controlEntryCenter, z: 3.6, length: controlEntryLength, rotation: 0 });
      addEntrancePlacards();
    }

    function addWelcomeWallStatement() {
      var statement = new THREE.Mesh(
        new THREE.PlaneGeometry(5.45, 4.12),
        new THREE.MeshBasicMaterial({
          map: makeWelcomeWallTexture(),
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false
        })
      );
      statement.position.set(-5.12, 2.55, -3.425);
      statement.rotation.y = Math.PI / 2;
      scene.add(statement);

      var statementLight = new THREE.PointLight(0xffe3a6, 0.22, 6.5);
      statementLight.position.set(-3.85, 3.1, -3.425);
      scene.add(statementLight);
    }

    function addDiscoverWing() {
      addJoinedLineBox(new THREE.Vector3(-6.59, 2.4, -8.65), new THREE.Vector3(2.82, 4.8, 3.4), 0.26, [0]);
      addJoinedLineBox(new THREE.Vector3(-8.0, 2.4, -10.58), new THREE.Vector3(3.4, 4.8, 3.85), 0.26, [0, 2]);
      addJoinedLineBox(new THREE.Vector3(-11.95, 2.4, -12.5), new THREE.Vector3(7.9, 4.8, 3.4), 0.26, [2]);
      addJoinedLineBox(new THREE.Vector3(-13.4, 2.4, -32.4), new THREE.Vector3(5.0, 4.8, 39.8), 0.26, [1, 2]);
      addLineBox(new THREE.Vector3(-11.9, 2.4, -52.3), new THREE.Vector3(8.0, 4.8, 3.4), 0.26);
      addLineBox(new THREE.Vector3(-7.6, 2.65, -25.0), new THREE.Vector3(6.6, 5.3, 8.2), 0.28);

      [
        { x: -6.59, z: -6.95, length: 2.82, rotation: 0 },
        { x: -5.74, z: -10.35, length: 1.12, rotation: 0 },
        { x: -8.0, z: -7.8, length: 1.7, rotation: Math.PI / 2 },
        { x: -8.85, z: -8.65, length: 1.7, rotation: 0 },
        { x: -6.3, z: -11.43, length: 2.15, rotation: Math.PI / 2 },
        { x: -9.7, z: -9.73, length: 2.15, rotation: Math.PI / 2 },
        { x: -7.15, z: -12.5, length: 1.7, rotation: 0 },
        { x: -8.0, z: -13.35, length: 1.7, rotation: Math.PI / 2 },
        { x: -12.8, z: -10.8, length: 6.2, rotation: 0 },
        { x: -9.45, z: -14.2, length: 2.9, rotation: 0 },
        { x: -15.9, z: -33.25, length: 41.5, rotation: Math.PI / 2 },
        { x: -10.9, z: -18.68, length: 8.95, rotation: Math.PI / 2 },
        { x: -10.9, z: -38.73, length: 23.75, rotation: Math.PI / 2 },
        { x: -9.4, z: -50.6, length: 3.0, rotation: 0 },
        { x: -11.9, z: -54.0, length: 8.0, rotation: 0 },
        { x: -7.6, z: -20.9, length: 6.6, rotation: 0, height: 5.2, y: 2.65 },
        { x: -7.6, z: -29.1, length: 6.6, rotation: 0, height: 5.2, y: 2.65 },
        { x: -4.3, z: -25.0, length: 8.2, rotation: Math.PI / 2, height: 5.2, y: 2.65 }
      ].forEach(function (wall) {
        addDarkWall(wall);
      });

      addPortal({
        x: -10.88,
        z: -25.0,
        rotation: -Math.PI / 2,
        title: "Development Laboratory",
        reverseTitle: "Research & Experimentation"
      });
      addPortal({
        x: -7.92,
        z: -52.3,
        rotation: -Math.PI / 2,
        title: "Church of AI",
        reverseTitle: "Research & Experimentation"
      });

      var laboratoryPlacard = new THREE.Mesh(
        new THREE.PlaneGeometry(2.9, 1.55),
        new THREE.MeshBasicMaterial({ map: makeHallwayStatementTexture(developmentStatement, 0), transparent: true, side: THREE.DoubleSide })
      );
      laboratoryPlacard.position.set(-9.3, 2.35, -29.03);
      laboratoryPlacard.rotation.y = 0;
      scene.add(laboratoryPlacard);

      var path = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-5.05, 0.035, -8.65),
          new THREE.Vector3(-8.0, 0.035, -8.65),
          new THREE.Vector3(-8.0, 0.035, -12.5),
          new THREE.Vector3(-13.4, 0.035, -12.5),
          new THREE.Vector3(-13.4, 0.035, -52.3),
          new THREE.Vector3(-7.95, 0.035, -52.3)
        ]),
        new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.3 })
      );
      scene.add(path);

      [
        { x: -13.4, z: -15.5, intensity: 0.42, distance: 12 },
        { x: -13.4, z: -34.5, intensity: 0.46, distance: 13 },
        { x: -13.4, z: -46.0, intensity: 0.42, distance: 12 },
        { x: -7.5, z: -25.0, intensity: 0.5, distance: 11 },
        { x: -11.0, z: -52.3, intensity: 0.38, distance: 10 }
      ].forEach(function (lightSpec) {
        var light = new THREE.PointLight(0xffe3a6, lightSpec.intensity, lightSpec.distance);
        light.position.set(lightSpec.x, 3.45, lightSpec.z);
        scene.add(light);
      });
    }

    function addSupportingHallway() {
      var controlConnectorX = pushingRoomOffset.x + 4.4;
      var workConnectorX = workRoomOffset.x + workRoomLayout.supportConnectorX;
      var workRoomNorth = workRoomOffset.z + workRoomLayout.north;
      var crossHallLeft = controlConnectorX - 1.5;
      var crossHallRight = workConnectorX + 1.5;
      var crossHallCenter = (crossHallLeft + crossHallRight) / 2;
      var crossHallLength = crossHallRight - crossHallLeft;
      var innerCrossHallLeft = controlConnectorX + 1.5;
      var innerCrossHallRight = workConnectorX - 1.5;
      var innerCrossHallCenter = (innerCrossHallLeft + innerCrossHallRight) / 2;
      var innerCrossHallLength = innerCrossHallRight - innerCrossHallLeft;
      var crossHallZ = 25.0;
      var crossHallNearZ = 22.5;
      var crossHallFarZ = 27.5;
      var controlLegStartZ = 9.4;
      var controlLegEndZ = 26.5;
      var workLegCenterZ = (workRoomNorth + crossHallZ) / 2;
      var workLegLength = crossHallZ - workRoomNorth;
      var workLegOuterCenterZ = (workRoomNorth + crossHallFarZ) / 2;
      var workLegOuterLength = crossHallFarZ - workRoomNorth;
      var workLegInnerCenterZ = (workRoomNorth + crossHallNearZ) / 2;
      var workLegInnerLength = crossHallNearZ - workRoomNorth;
      var controlLegCenterZ = (controlLegStartZ + controlLegEndZ) / 2;
      var controlLegLength = controlLegEndZ - controlLegStartZ;
      var controlLegOuterCenterZ = (controlLegStartZ + crossHallFarZ) / 2;
      var controlLegOuterLength = crossHallFarZ - controlLegStartZ;
      var controlLegInnerCenterZ = (controlLegStartZ + crossHallNearZ) / 2;
      var controlLegInnerLength = crossHallNearZ - controlLegStartZ;

      addLineBox(new THREE.Vector3(workConnectorX, 2.4, workLegCenterZ), new THREE.Vector3(3.0, 4.8, workLegLength), 0.25);
      addLineBox(new THREE.Vector3(crossHallCenter, 2.4, crossHallZ), new THREE.Vector3(crossHallLength, 4.8, 5.0), 0.25);
      addJoinedLineBox(
        new THREE.Vector3(controlConnectorX, 2.4, controlLegCenterZ),
        new THREE.Vector3(3.0, 4.8, controlLegLength),
        0.25,
        [2, 3]
      );
      addHorizontalPortal({
        x: workConnectorX,
        z: workRoomNorth - 0.02,
        rotation: Math.PI,
        frameWidth: 3.0,
        signWidth: 2.85,
        title: "How I use AI",
        reverseTitle: "Work With Joe"
      });
      addHorizontalPortal({
        x: controlConnectorX,
        z: controlLegStartZ,
        rotation: Math.PI,
        frameWidth: 3.0,
        signWidth: 2.85,
        title: "How I use AI",
        reverseTitle: "Control Room"
      });

      [
        { x: workConnectorX + 1.5, z: workLegOuterCenterZ, length: workLegOuterLength, rotation: Math.PI / 2 },
        { x: workConnectorX - 1.5, z: workLegInnerCenterZ, length: workLegInnerLength, rotation: Math.PI / 2 },
        { x: crossHallCenter, z: crossHallFarZ, length: crossHallLength, rotation: 0 },
        { x: innerCrossHallCenter, z: crossHallNearZ, length: innerCrossHallLength, rotation: 0 },
        { x: controlConnectorX - 1.5, z: controlLegOuterCenterZ, length: controlLegOuterLength, rotation: Math.PI / 2 },
        { x: controlConnectorX + 1.5, z: controlLegInnerCenterZ, length: controlLegInnerLength, rotation: Math.PI / 2 }
      ].forEach(function (wall) {
        addDarkWall(wall);
      });

      var path = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(workConnectorX, 0.035, workRoomNorth),
          new THREE.Vector3(workConnectorX, 0.035, crossHallZ),
          new THREE.Vector3(controlConnectorX, 0.035, crossHallZ),
          new THREE.Vector3(controlConnectorX, 0.035, 9.25)
        ]),
        new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.26 })
      );
      scene.add(path);

      [
        { x: workConnectorX, z: 12.2, intensity: 0.42, distance: 11 },
        { x: workConnectorX, z: 20.0, intensity: 0.4, distance: 11 },
        { x: 11.8, z: crossHallZ, intensity: 0.4, distance: 12 },
        { x: 3.7, z: crossHallZ, intensity: 0.4, distance: 12 },
        { x: -4.4, z: crossHallZ, intensity: 0.42, distance: 12 },
        { x: -12.5, z: crossHallZ, intensity: 0.42, distance: 12 },
        { x: controlConnectorX, z: 13.0, intensity: 0.38, distance: 10 },
        { x: controlConnectorX, z: 21.0, intensity: 0.38, distance: 10 }
      ].forEach(function (lightSpec) {
        var light = new THREE.PointLight(0xffe3a6, lightSpec.intensity, lightSpec.distance);
        light.position.set(lightSpec.x, 3.35, lightSpec.z);
        scene.add(light);
      });
    }

    function addWorkWithJoeRoom(parent) {
      var target = parent || scene;
      var roomWidth = workRoomLayout.east - workRoomLayout.west;
      var roomDepth = workRoomLayout.north - workRoomLayout.south;
      addLineBox(new THREE.Vector3(workRoomLayout.centerX, 2.65, workRoomLayout.centerZ), new THREE.Vector3(roomWidth, 5.3, roomDepth), 0.24, target);

      [
        { x: 9.43, z: workRoomLayout.south, length: 8.5, rotation: 0, height: 5.2, y: 2.65 },
        { x: 8.93, z: workRoomLayout.north, length: 7.5, rotation: 0, height: 5.2, y: 2.65 },
        { x: 16.18, z: workRoomLayout.north, length: 1.0, rotation: 0, height: 5.2, y: 2.65 },
        { x: workRoomLayout.east, z: -8.5, length: 5.0, rotation: Math.PI / 2, height: 5.2, y: 2.65 },
        { x: workRoomLayout.east, z: -0.5, length: 5.0, rotation: Math.PI / 2, height: 5.2, y: 2.65 },
        { x: workRoomLayout.west, z: -9.0, length: 4.0, rotation: Math.PI / 2, height: 5.2, y: 2.65 },
        { x: workRoomLayout.west, z: -1.0, length: 6.0, rotation: Math.PI / 2, height: 5.2, y: 2.65 }
      ].forEach(function (wall) {
        addDarkWall(wall, target);
      });

      addWorkOfferNeonSigns(target);
      addWorkCapabilityPathGraphic(target);
      addSoundcheckWallExperience(target);
      addWorkActivationGuide(target);
      addMethodsAndToolsWing(target);
    }

    function addWorkActivationGuide(parent) {
      var wallX = workRoomLayout.east;
      var wallZ = -9.0;
      var facing = -1;
      var rotation = -Math.PI / 2;
      var installationScale = 0.8;
      var installationCenterY = 2.65;
      var originalVisualCenterY = 2.69;
      var plaqueWidth = 3.56;
      var plaqueHeight = 3.58;
      var plaqueY = 1.9;

      var installation = new THREE.Group();
      installation.name = "Work With Joe Start Here";
      installation.position.set(wallX, installationCenterY, wallZ);
      installation.scale.setScalar(installationScale);
      parent.add(installation);

      var plaqueBacking = new THREE.Mesh(
        new THREE.BoxGeometry(0.16, plaqueHeight + 0.12, plaqueWidth + 0.12),
        new THREE.MeshStandardMaterial({
          color: 0x080604,
          metalness: 0.62,
          roughness: 0.32
        })
      );
      plaqueBacking.position.set(-facing * 0.09, plaqueY - originalVisualCenterY, 0);
      installation.add(plaqueBacking);

      var plaqueFrame = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(0.19, plaqueHeight + 0.18, plaqueWidth + 0.18)),
        new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.58 })
      );
      plaqueFrame.position.copy(plaqueBacking.position);
      installation.add(plaqueFrame);

      var plaque = new THREE.Mesh(
        new THREE.PlaneGeometry(plaqueWidth, plaqueHeight),
        new THREE.MeshBasicMaterial({
          map: makeWorkActivationGuideTexture(),
          transparent: true,
          side: THREE.DoubleSide
        })
      );
      plaque.position.set(facing * 0.012, plaqueY - originalVisualCenterY, 0);
      plaque.rotation.y = rotation;
      var guideIndex = exhibitIndex("Start Here");
      plaque.userData.exhibitIndex = guideIndex;
      installation.add(plaque);
      interactive.push(plaque);
      exhibitAnchors[guideIndex] = installation;

      var neon = new THREE.Mesh(
        new THREE.PlaneGeometry(6.0, 1.4),
        new THREE.MeshBasicMaterial({
          map: makeWorkOfferNeonTexture("Start Here", 1.55),
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false,
          opacity: 0.98
        })
      );
      neon.position.set(facing * 0.025, 4.78 - originalVisualCenterY, 0);
      neon.rotation.y = rotation;
      installation.add(neon);

      var plaqueLight = new THREE.PointLight(0xffe3a6, 0.38, 5.8 * installationScale);
      plaqueLight.position.set(facing * 1.15, 3.2 - originalVisualCenterY, 0);
      installation.add(plaqueLight);

      var neonLight = new THREE.PointLight(0xffdca0, 0.5, 6.0 * installationScale);
      neonLight.position.set(facing * 1.0, 4.66 - originalVisualCenterY, 0);
      installation.add(neonLight);

      addApproachMarker({
        wall: "workEast",
        x: wallX,
        z: wallZ,
        rotation: rotation
      }, parent);
    }

    function addWorkOfferNeonSigns(parent) {
      [
        {
          text: "Raise the ceiling",
          x: (workOfferPlacement.south.pushX + workOfferPlacement.south.leadershipX) / 2,
          z: workRoomLayout.south + 0.18,
          rotation: 0,
          width: 5.9,
          lightZ: workRoomLayout.south + 1.0
        },
        {
          text: "Raise the floor",
          x: (workOfferPlacement.north.buildX + workOfferPlacement.north.connectX) / 2,
          z: workRoomLayout.north - 0.18,
          rotation: Math.PI,
          width: 6.1,
          lightZ: workRoomLayout.north - 1.0
        }
      ].forEach(function (spec) {
        var sign = new THREE.Mesh(
          new THREE.PlaneGeometry(spec.width, 0.95),
          new THREE.MeshBasicMaterial({
            map: makeWorkOfferNeonTexture(spec.text),
            transparent: true,
            side: THREE.DoubleSide,
            depthWrite: false,
            opacity: 0.94
          })
        );
        sign.position.set(spec.x, 4.56, spec.z);
        sign.rotation.y = spec.rotation;
        parent.add(sign);

        var glow = new THREE.PointLight(0xffdca0, 0.24, 5.8);
        glow.position.set(spec.x, 4.45, spec.lightZ);
        parent.add(glow);
      });
    }

    function addWorkCapabilityPathGraphic(parent) {
      var texture = new THREE.TextureLoader().load("/assets/thinking/raise-the-floor-capability-path.png");
      texture.colorSpace = THREE.SRGBColorSpace;

      var scale = 0.7;
      var width = 2.85 * scale;
      var height = 4.275 * scale;
      var wallX = workRoomLayout.west;
      var wallZ = -9.2;
      var wallY = 5.3 / 2;
      var facing = 1;
      var rotation = Math.PI / 2;

      var backing = new THREE.Mesh(
        new THREE.PlaneGeometry(width + 0.18, height + 0.18),
        new THREE.MeshBasicMaterial({
          color: 0x030302,
          transparent: true,
          opacity: 0.94,
          side: THREE.DoubleSide
        })
      );
      backing.position.set(wallX + facing * 0.025, wallY, wallZ);
      backing.rotation.y = rotation;
      parent.add(backing);

      var graphic = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        new THREE.MeshBasicMaterial({
          map: texture,
          side: THREE.DoubleSide
        })
      );
      graphic.position.set(wallX + facing * 0.05, wallY, wallZ);
      graphic.rotation.y = rotation;
      parent.add(graphic);

      var frame = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(width + 0.22, height + 0.22, 0.03)),
        new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.52 })
      );
      frame.position.set(wallX + facing * 0.04, wallY, wallZ);
      frame.rotation.y = rotation;
      parent.add(frame);

      var light = new THREE.PointLight(0xffe3a6, 0.34, 6.0);
      light.position.set(wallX + facing * 1.15, 3.0, wallZ);
      parent.add(light);
    }

    function addSoundcheckWallExperience(parent) {
      var texture = new THREE.TextureLoader().load("/assets/soundcheck-og.png");
      texture.colorSpace = THREE.SRGBColorSpace;
      var soundcheckIndex = exhibitIndex("The AI Capability Soundcheck");

      var width = 4.2;
      var height = width * (630 / 1200);
      var wallX = workRoomLayout.west;
      var wallZ = -1.0;
      var wallY = 2.72;
      var facing = 1;
      var rotation = Math.PI / 2;

      var backing = new THREE.Mesh(
        new THREE.PlaneGeometry(width + 0.18, height + 0.18),
        new THREE.MeshBasicMaterial({ color: 0x030302, side: THREE.DoubleSide })
      );
      backing.position.set(wallX + facing * 0.025, wallY, wallZ);
      backing.rotation.y = rotation;
      parent.add(backing);

      var image = new THREE.Mesh(
        new THREE.PlaneGeometry(width, height),
        new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide })
      );
      image.position.set(wallX + facing * 0.05, wallY, wallZ);
      image.rotation.y = rotation;
      image.userData.exhibitIndex = soundcheckIndex;
      parent.add(image);
      interactive.push(image);
      exhibitAnchors[soundcheckIndex] = image;

      var frame = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(width + 0.22, height + 0.22, 0.035)),
        new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.62 })
      );
      frame.position.set(wallX + facing * 0.04, wallY, wallZ);
      frame.rotation.y = rotation;
      parent.add(frame);

      var light = new THREE.PointLight(0xffe3a6, 0.42, 6.8);
      light.position.set(wallX + facing * 1.2, 3.05, wallZ);
      parent.add(light);

      addApproachMarker({
        wall: "workWest",
        x: wallX,
        z: wallZ,
        rotation: rotation
      }, parent);
    }

    function addMethodsGallery(parent) {
      var textureLoader = new THREE.TextureLoader();
      var backingMaterial = new THREE.MeshBasicMaterial({ color: 0x030302, transparent: true, opacity: 0.9, side: THREE.DoubleSide });
      var galleryImages = [
        { src: "/assets/thinking/capability-acceleration-wall.png", x: methodsRoomLayout.west + 0.03, z: methodsRoomLayout.centerZ, y: 3.25, rotation: Math.PI / 2, width: 5.4, height: 3.6, statement: workOfferStatements[0] },
        { src: "/assets/thinking/enablement-architecture-wall.png", x: methodsRoomLayout.east - 0.03, z: -24.25, y: 3.25, rotation: -Math.PI / 2, width: 5.2, height: 3.46, statement: workOfferStatements[1] },
        { src: "/assets/thinking/enhanced-facilitation-wall.png", x: methodsRoomLayout.centerX - 1.5, z: methodsRoomLayout.north - 0.03, y: 3.25, rotation: Math.PI, width: 5.2, height: 3.46, statement: workOfferStatements[2] }
      ];

      galleryImages.forEach(function (item) {
        var backing = new THREE.Mesh(
          new THREE.PlaneGeometry(item.width + 0.18, item.height + 0.18),
          backingMaterial.clone()
        );
        backing.position.set(item.x, item.y, item.z);
        backing.rotation.y = item.rotation;
        parent.add(backing);

        var texture = textureLoader.load(item.src);
        texture.colorSpace = THREE.SRGBColorSpace;
        var image = new THREE.Mesh(
          new THREE.PlaneGeometry(item.width, item.height),
          new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide })
        );
        image.position.set(
          item.x + Math.sin(item.rotation) * 0.015,
          item.y,
          item.z + Math.cos(item.rotation) * 0.015
        );
        image.rotation.y = item.rotation;
        parent.add(image);

        var frame = new THREE.LineSegments(
          new THREE.EdgesGeometry(new THREE.BoxGeometry(item.width + 0.22, item.height + 0.22, 0.03)),
          new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.42 })
        );
        frame.position.set(item.x, item.y, item.z);
        frame.rotation.y = item.rotation;
        parent.add(frame);

        var placard = new THREE.Mesh(
          new THREE.PlaneGeometry(5.0, 1.2),
          new THREE.MeshBasicMaterial({
            map: makeOfferPlacardTexture(item.statement),
            transparent: true,
            side: THREE.DoubleSide
          })
        );
        placard.position.set(
          item.x + Math.sin(item.rotation) * 0.018,
          0.74,
          item.z + Math.cos(item.rotation) * 0.018
        );
        placard.rotation.y = item.rotation;
        parent.add(placard);
      });
    }

    function addMethodsAndToolsWing(parent) {
      var target = parent || scene;
      var hallWest = 13.68;
      var hallEast = workRoomLayout.east;
      var hallCenterX = (hallWest + hallEast) / 2;
      var roomWest = methodsRoomLayout.west;
      var roomEast = methodsRoomLayout.east;
      var roomNorth = methodsRoomLayout.north;
      var roomSouth = methodsRoomLayout.south;
      var roomCenterX = methodsRoomLayout.centerX;
      var roomCenterZ = methodsRoomLayout.centerZ;

      addJoinedLineBox(
        new THREE.Vector3(hallCenterX, 2.4, (workRoomLayout.south + roomNorth) / 2),
        new THREE.Vector3(hallEast - hallWest, 4.8, workRoomLayout.south - roomNorth),
        0.26,
        [0, 1],
        target
      );
      addJoinedLineBox(
        new THREE.Vector3(roomCenterX, 2.55, roomCenterZ),
        new THREE.Vector3(roomEast - roomWest, 5.1, roomNorth - roomSouth),
        0.28,
        [2],
        target
      );

      [
        { x: hallWest, z: (workRoomLayout.south + roomNorth) / 2, length: workRoomLayout.south - roomNorth, rotation: Math.PI / 2 },
        { x: roomEast, z: (workRoomLayout.south + roomSouth) / 2, length: workRoomLayout.south - roomSouth, rotation: Math.PI / 2 },
        { x: (roomWest + hallWest) / 2, z: roomNorth, length: hallWest - roomWest, rotation: 0, height: 5.0, y: 2.55 },
        { x: roomWest, z: roomCenterZ, length: roomNorth - roomSouth, rotation: Math.PI / 2, height: 5.0, y: 2.55 },
        { x: roomCenterX, z: roomSouth, length: roomEast - roomWest, rotation: 0, height: 5.0, y: 2.55 }
      ].forEach(function (wall) {
        addDarkWall(wall, target);
      });

      addHorizontalPortal({
        parent: target,
        x: hallCenterX,
        z: workRoomLayout.south,
        rotation: 0,
        frameWidth: hallEast - hallWest,
        signWidth: 3.55,
        title: "Methods and Tools",
        reverseTitle: "Work With Joe"
      });
      addLineBox(
        new THREE.Vector3(hallCenterX, 2.4, roomNorth),
        new THREE.Vector3(hallEast - hallWest, 4.8, 0.16),
        0.38,
        target
      );

      addMethodsToolShed(target, roomCenterX, roomCenterZ, roomEast, -18.5, -Math.PI / 2);
      addMethodsGallery(target);

      var path = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(hallCenterX, 0.035, workRoomLayout.south + 0.2),
          new THREE.Vector3(hallCenterX, 0.035, roomCenterZ)
        ]),
        new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.3 })
      );
      target.add(path);

      [
        { x: hallCenterX, z: -13.3, intensity: 0.4, distance: 9 },
        { x: roomCenterX, z: -18.5, intensity: 0.52, distance: 11 },
        { x: roomCenterX, z: -24.25, intensity: 0.5, distance: 11 }
      ].forEach(function (lightSpec) {
        var light = new THREE.PointLight(0xffe3a6, lightSpec.intensity, lightSpec.distance);
        light.position.set(lightSpec.x, 3.35, lightSpec.z);
        target.add(light);
      });
    }

    function addMethodsToolShed(target, centerX, centerZ, toolWallX, toolWallZ, toolWallRotation) {
      var woodMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a2f18,
        roughness: 0.68,
        metalness: 0.12
      });
      var darkMetalMaterial = new THREE.MeshStandardMaterial({
        color: 0x0b0805,
        roughness: 0.32,
        metalness: 0.7
      });
      var brassMaterial = new THREE.MeshStandardMaterial({
        color: 0xd8bd8a,
        emissive: 0x2d1b09,
        emissiveIntensity: 0.24,
        roughness: 0.28,
        metalness: 0.72
      });
      var steelMaterial = new THREE.MeshStandardMaterial({
        color: 0xb7a88d,
        roughness: 0.24,
        metalness: 0.82,
        side: THREE.DoubleSide
      });
      var benchZ = centerZ + 0.15;
      var boardCenterY = 3.08;
      var bench = new THREE.Group();

      var top = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.18, 1.25), woodMaterial);
      top.position.set(centerX, 0.96, benchZ);
      bench.add(top);

      [
        { x: centerX - 1.27, z: benchZ - 0.43 },
        { x: centerX + 1.27, z: benchZ - 0.43 },
        { x: centerX - 1.27, z: benchZ + 0.43 },
        { x: centerX + 1.27, z: benchZ + 0.43 }
      ].forEach(function (legPosition) {
        var leg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.84, 0.16), darkMetalMaterial);
        leg.position.set(legPosition.x, 0.48, legPosition.z);
        bench.add(leg);
      });

      var lowerShelf = new THREE.Mesh(new THREE.BoxGeometry(2.66, 0.08, 0.92), darkMetalMaterial);
      lowerShelf.position.set(centerX, 0.34, benchZ);
      bench.add(lowerShelf);

      var benchFrame = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(3.08, 0.22, 1.33)),
        new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.44 })
      );
      benchFrame.position.set(centerX, 0.97, benchZ);
      bench.add(benchFrame);

      var viceBase = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.16, 0.38), brassMaterial);
      viceBase.position.set(centerX + 0.95, 1.13, benchZ - 0.26);
      bench.add(viceBase);
      [-0.16, 0.16].forEach(function (offset) {
        var jaw = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.28, 0.44), darkMetalMaterial);
        jaw.position.set(centerX + 0.95 + offset, 1.3, benchZ - 0.26);
        bench.add(jaw);
      });
      target.add(bench);

      var toolWall = new THREE.Group();
      toolWall.name = "Methods and Tools wall tools";
      toolWall.position.set(toolWallX, boardCenterY, toolWallZ);
      toolWall.rotation.y = toolWallRotation;
      target.add(toolWall);

      var toolBoard = new THREE.Mesh(
        new THREE.BoxGeometry(4.45, 1.8, 0.06),
        new THREE.MeshStandardMaterial({ color: 0x100b06, roughness: 0.76, metalness: 0.18 })
      );
      toolBoard.position.set(0, 0, 0.04);
      toolWall.add(toolBoard);

      var toolBoardFrame = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(4.55, 1.9, 0.09)),
        new THREE.LineBasicMaterial({ color: 0xd8bd8a, transparent: true, opacity: 0.42 })
      );
      toolBoardFrame.position.copy(toolBoard.position);
      toolWall.add(toolBoardFrame);

      [-1.7, -1.15, -0.6, -0.05, 0.5, 1.05, 1.6].forEach(function (xOffset, index) {
        [-0.55, 0, 0.55].forEach(function (yOffset) {
          if ((index + Math.round((yOffset + 0.55) * 10)) % 2) return;
          var peg = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.08, 8), brassMaterial);
          peg.position.set(xOffset, yOffset, 0.1);
          peg.rotation.x = Math.PI / 2;
          toolWall.add(peg);
        });
      });

      var sawShape = new THREE.Shape();
      sawShape.moveTo(-1.02, -0.13);
      sawShape.lineTo(0.72, -0.13);
      sawShape.lineTo(0.98, 0.16);
      sawShape.lineTo(-1.02, 0.16);
      sawShape.closePath();
      var sawBlade = new THREE.Mesh(new THREE.ShapeGeometry(sawShape), steelMaterial);
      sawBlade.position.set(-0.4, -0.06, 0.11);
      toolWall.add(sawBlade);

      for (var toothIndex = 0; toothIndex < 8; toothIndex += 1) {
        var tooth = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.12, 3), steelMaterial);
        tooth.position.set(-1.25 + toothIndex * 0.22, -0.25, 0.11);
        tooth.rotation.z = Math.PI;
        toolWall.add(tooth);
      }

      var sawHandle = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.54, 0.16), woodMaterial);
      sawHandle.position.set(-1.61, 0.04, 0.12);
      sawHandle.rotation.z = -0.24;
      toolWall.add(sawHandle);

      var hammer = new THREE.Group();
      var hammerHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.075, 1.02, 10), woodMaterial);
      hammer.add(hammerHandle);
      var hammerHead = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.22, 0.22), steelMaterial);
      hammerHead.position.y = 0.53;
      hammer.add(hammerHead);
      hammer.position.set(1.35, -0.1, 0.12);
      hammer.rotation.z = -0.2;
      toolWall.add(hammer);

      var toolLight = new THREE.PointLight(0xffe3a6, 0.2, 5.5);
      toolLight.position.set(0, 0.07, 1.1);
      toolWall.add(toolLight);

      roomFixtures.push({
        x: centerX + workRoomOffset.x,
        z: benchZ + workRoomOffset.z,
        radius: 1.42
      });
    }

    function addWhoIsJoeExperience() {
      var sourceDoorCenter = whoIsJoeSourceDoorCenter;
      var destinationDoorCenter = elevator.destinationCenter;
      var workRoomEast = workRoomOffset.x + workRoomLayout.east;
      var identityHallStart = workRoomEast + 2.35;
      var identityHallEnd = 40.2;
      var identityHallCenter = (identityHallStart + identityHallEnd) / 2;
      var identityHallLength = identityHallEnd - identityHallStart;
      var identityGalleryWest = 24.0;
      var identityGalleryEast = 38.5;
      var identityGalleryBack = -9.0 + identityZShift;
      var identityGalleryFront = -1.4 + identityZShift;
      var identityGalleryCenterX = (identityGalleryWest + identityGalleryEast) / 2;
      var identityGalleryCenterZ = (identityGalleryBack + identityGalleryFront) / 2;

      addLineBox(new THREE.Vector3(-4.12, 2.4, sourceDoorCenter.z), new THREE.Vector3(3.6, 4.8, 3.2), 0.38);
      addDarkWall({ x: -5.92, z: sourceDoorCenter.z, length: 3.2, rotation: Math.PI / 2 });
      addDarkWall({ x: -4.12, z: sourceDoorCenter.z - 1.6, length: 3.6, rotation: 0 });
      addDarkWall({ x: -4.12, z: sourceDoorCenter.z + 1.6, length: 3.6, rotation: 0 });
      addLineBox(new THREE.Vector3(sourceDoorCenter.x, 2.4, sourceDoorCenter.z), new THREE.Vector3(0.16, 4.8, 3.2), 0.58);

      var placard = new THREE.Mesh(
        new THREE.PlaneGeometry(1.48, 0.88),
        new THREE.MeshBasicMaterial({ map: makeElevatorPlacardTexture(), transparent: true, side: THREE.DoubleSide })
      );
      placard.position.set(-2.31, 2.25, sourceDoorCenter.z + 2.45);
      placard.rotation.y = Math.PI / 2;
      placard.userData.action = "open-who-is-joe-elevator";
      scene.add(placard);
      interactive.push(placard);

      addHallwayTransitionWall(workRoomEast, 0.55 + identityZShift, identityHallStart, -1.4 + identityZShift);
      addHallwayTransitionWall(workRoomEast, 1.45 + identityZShift, identityHallStart, 3.4 + identityZShift);
      addPortal({
        x: workRoomEast,
        z: identityHallCenterZ,
        rotation: -Math.PI / 2,
        title: "Who Is Joe",
        reverseTitle: "Work With Joe"
      });
      addLineBox(new THREE.Vector3(identityHallCenter, 2.4, identityHallCenterZ), new THREE.Vector3(identityHallLength, 4.8, 4.8), 0.25);
      addDarkWall({ x: identityHallCenter, z: 3.4 + identityZShift, length: identityHallLength, rotation: Math.PI });
      addDarkWall({ x: (identityHallStart + 28.8) / 2, z: -1.4 + identityZShift, length: 28.8 - identityHallStart, rotation: 0 });
      addDarkWall({ x: (33.2 + identityHallEnd) / 2, z: -1.4 + identityZShift, length: identityHallEnd - 33.2, rotation: 0 });
      addDarkWall({ x: destinationDoorCenter.x, z: -0.975 + identityZShift, length: 0.85, rotation: Math.PI / 2 });
      addDarkWall({ x: destinationDoorCenter.x, z: 2.975 + identityZShift, length: 0.85, rotation: Math.PI / 2 });
      addLineBox(new THREE.Vector3(destinationDoorCenter.x, 2.4, destinationDoorCenter.z), new THREE.Vector3(0.16, 4.8, 3.2), 0.58);

      addLineBox(
        new THREE.Vector3(identityGalleryCenterX, 2.55, identityGalleryCenterZ),
        new THREE.Vector3(identityGalleryEast - identityGalleryWest, 5.1, identityGalleryFront - identityGalleryBack),
        0.28
      );
      addDarkWall({
        x: identityGalleryCenterX,
        z: identityGalleryBack,
        length: identityGalleryEast - identityGalleryWest,
        rotation: 0,
        height: 5.0,
        y: 2.55
      });
      addDarkWall({
        x: identityGalleryWest,
        z: identityGalleryCenterZ,
        length: identityGalleryFront - identityGalleryBack,
        rotation: Math.PI / 2,
        height: 5.0,
        y: 2.55
      });
      addDarkWall({
        x: identityGalleryEast,
        z: identityGalleryCenterZ,
        length: identityGalleryFront - identityGalleryBack,
        rotation: Math.PI / 2,
        height: 5.0,
        y: 2.55
      });
      addHorizontalPortal({
        x: 31.0,
        z: -1.38 + identityZShift,
        rotation: 0,
        title: "Who Is Joe",
        reverseTitle: "Elevator Hallway"
      });

      addLineBox(new THREE.Vector3(42.35, 2.4, destinationDoorCenter.z), new THREE.Vector3(4.2, 4.8, 3.2), 0.38);
      addDarkWall({ x: 44.45, z: destinationDoorCenter.z, length: 3.2, rotation: Math.PI / 2 });
      addDarkWall({ x: 42.35, z: -0.6 + identityZShift, length: 4.2, rotation: 0 });
      addDarkWall({ x: 42.35, z: 2.6 + identityZShift, length: 4.2, rotation: 0 });

      var path = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(workRoomEast - 0.15, 0.035, identityHallCenterZ),
          new THREE.Vector3(40.1, 0.035, identityHallCenterZ)
        ]),
        new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.24 })
      );
      scene.add(path);

      [23.7, 27.0, 30.4, 33.7, 37.0].forEach(function (x, index) {
        var light = new THREE.PointLight(0xffe3a6, index % 2 ? 0.36 : 0.44, 11);
        light.position.set(x, 3.35, identityHallCenterZ);
        scene.add(light);
      });

      [
        { x: 27.0, z: -5.2 + identityZShift },
        { x: 31.25, z: -7.4 + identityZShift },
        { x: 35.5, z: -5.2 + identityZShift }
      ].forEach(function (position) {
        var galleryLight = new THREE.PointLight(0xffe3a6, 0.44, 10);
        galleryLight.position.set(position.x, 3.4, position.z);
        scene.add(galleryLight);
      });

      var sourceLight = new THREE.PointLight(0xffe3a6, 0.5, 7);
      sourceLight.position.set(-4.25, 3.25, sourceDoorCenter.z);
      scene.add(sourceLight);

      var destinationLight = sourceLight.clone();
      destinationLight.position.set(42.35, 3.25, destinationDoorCenter.z);
      scene.add(destinationLight);

      elevator.sourceDoors = addElevatorDoors(sourceDoorCenter.x, sourceDoorCenter.z, true);
      elevator.destinationDoors = addElevatorDoors(destinationDoorCenter.x, destinationDoorCenter.z, false);
      addElevatorIndicator(-5.86, 3.3, sourceDoorCenter.z, Math.PI / 2);
      addElevatorIndicator(40.16, 3.58, destinationDoorCenter.z, Math.PI / 2);
      setElevatorIndicator("G", "GROUND FLOOR");
    }

    function addContactWallButton() {
      addPhysicalContactButton({
        parent: scene,
        wallX: 5.18,
        buttonZ: -6.8,
        facing: -1,
        label: "DON'T PRESS THIS BUTTON"
      });
    }

    function addPhysicalContactButton(options) {
      var target = options.parent || scene;
      var wallX = options.wallX;
      var buttonZ = options.buttonZ;
      var facing = options.facing || -1;
      var darkMetal = new THREE.MeshStandardMaterial({
        color: 0x0b0805,
        metalness: 0.72,
        roughness: 0.3
      });
      var brass = new THREE.MeshStandardMaterial({
        color: 0xd8bd8a,
        emissive: 0x2f210f,
        emissiveIntensity: 0.34,
        metalness: 0.78,
        roughness: 0.24
      });
      var buttonGold = new THREE.MeshStandardMaterial({
        color: 0xffe3a6,
        emissive: 0x6d4518,
        emissiveIntensity: 0.58,
        metalness: 0.58,
        roughness: 0.2
      });

      var labelBacking = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 1.02, 3.18),
        darkMetal
      );
      labelBacking.position.set(wallX - facing * 0.1, 3.48, buttonZ);
      target.add(labelBacking);

      var labelFrame = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(0.2, 1.08, 3.24)),
        new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.64 })
      );
      labelFrame.position.copy(labelBacking.position);
      target.add(labelFrame);

      var label = new THREE.Mesh(
        new THREE.PlaneGeometry(3.0, 0.84),
        new THREE.MeshBasicMaterial({
          map: makeContactButtonLabelTexture(options.label),
          transparent: true,
          side: THREE.DoubleSide
        })
      );
      label.position.set(wallX + facing * 0.005, 3.48, buttonZ);
      label.rotation.y = facing < 0 ? -Math.PI / 2 : Math.PI / 2;
      target.add(label);

      var mountingPlate = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 1.94, 1.94),
        darkMetal
      );
      mountingPlate.position.set(wallX - facing * 0.1, 1.8, buttonZ);
      target.add(mountingPlate);

      var mountingFrame = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(0.21, 2.02, 2.02)),
        new THREE.LineBasicMaterial({ color: 0xd8bd8a, transparent: true, opacity: 0.56 })
      );
      mountingFrame.position.copy(mountingPlate.position);
      target.add(mountingFrame);

      var buttonBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.82, 0.82, 0.28, 64),
        brass
      );
      buttonBase.position.set(wallX + facing * 0.07, 1.8, buttonZ);
      buttonBase.rotation.z = Math.PI / 2;
      target.add(buttonBase);

      var buttonFace = new THREE.Mesh(
        new THREE.CylinderGeometry(0.58, 0.67, 0.38, 64),
        buttonGold
      );
      buttonFace.position.set(wallX + facing * 0.37, 1.8, buttonZ);
      buttonFace.rotation.z = Math.PI / 2;
      buttonFace.userData.action = "show-contact-joe";
      target.add(buttonFace);
      interactive.push(buttonFace);

      var buttonRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.7, 0.055, 12, 72),
        brass
      );
      buttonRing.position.set(wallX + facing * 0.575, 1.8, buttonZ);
      buttonRing.rotation.y = facing < 0 ? -Math.PI / 2 : Math.PI / 2;
      target.add(buttonRing);

      var floorMarker = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(1.55, 0.02, 1.08)),
        new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.34 })
      );
      floorMarker.position.set(wallX + facing * 0.97, 0.035, buttonZ);
      target.add(floorMarker);

      var buttonLight = new THREE.PointLight(0xffe3a6, 0.38, 5.5);
      buttonLight.position.set(wallX + facing * 1.15, 2.25, buttonZ);
      target.add(buttonLight);

      var contactAnchor = new THREE.Object3D();
      contactAnchor.position.set(wallX + facing * 0.55, 1.8, buttonZ);
      target.add(contactAnchor);
      contactButtonAnchors.push(contactAnchor);
    }

    function addElevatorDoors(x, z, actionable) {
      var panelWidth = 1.56;
      var panelOffset = panelWidth / 2;

      function makePanel(offset) {
        var panel = new THREE.Group();
        panel.position.set(x, 2.38, z + offset);

        var face = new THREE.Mesh(
          new THREE.PlaneGeometry(panelWidth, 4.14),
          new THREE.MeshBasicMaterial({ color: 0x080604, side: THREE.DoubleSide })
        );
        face.rotation.y = Math.PI / 2;
        if (actionable) {
          face.userData.action = "open-who-is-joe-elevator";
          interactive.push(face);
        }
        panel.add(face);

        var edge = new THREE.LineSegments(
          new THREE.EdgesGeometry(new THREE.BoxGeometry(0.045, 4.14, panelWidth)),
          new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.48 })
        );
        panel.add(edge);
        scene.add(panel);
        return panel;
      }

      return {
        left: makePanel(-panelOffset),
        right: makePanel(panelOffset),
        centerZ: z,
        panelOffset: panelOffset,
        travel: 1.5
      };
    }

    function addElevatorIndicator(x, y, z, rotation) {
      var material = new THREE.MeshBasicMaterial({
        map: makeElevatorIndicatorTexture("G", "GROUND FLOOR"),
        transparent: true,
        side: THREE.DoubleSide
      });
      var indicator = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 0.72), material);
      indicator.position.set(x, y, z);
      indicator.rotation.y = rotation;
      scene.add(indicator);
      elevator.indicatorMaterials.push(material);
    }

    function addControlRoomGallery(parent) {
      var textureLoader = new THREE.TextureLoader();
      var backingMaterial = new THREE.MeshBasicMaterial({ color: 0x030302, transparent: true, opacity: 0.94, side: THREE.DoubleSide });
      var galleryImages = [
        { src: "/assets/thinking/capacityos-control-layer.png", x: -8.47, z: 0.4, y: 2.85, rotation: Math.PI / 2, width: 5.6, height: 3.73 },
        { src: "/assets/thinking/capacityos-recursive-system.png", x: -8.47, z: 6.8, y: 2.85, rotation: Math.PI / 2, width: 5.6, height: 3.73 },
        { src: "/assets/thinking/capacityos-vsm-lenses.png", x: -8.47, z: -6.1, y: 2.85, rotation: Math.PI / 2, width: 5.6, height: 3.73 },
        { src: "/assets/thinking/capacityos-automation-orbits.png", x: 8.47, z: -5.3, y: 2.85, rotation: -Math.PI / 2, width: 5.8, height: 3.87 },
        { src: "/assets/thinking/capacityos-repository-fleet.png", x: 8.47, z: 7.45, y: 2.85, rotation: -Math.PI / 2, width: 5.0, height: 3.33 }
      ];

      galleryImages.forEach(function (item) {
        var backing = new THREE.Mesh(
          new THREE.PlaneGeometry(item.width + 0.18, item.height + 0.18),
          backingMaterial.clone()
        );
        backing.position.set(item.x, item.y, item.z);
        backing.rotation.y = item.rotation;
        parent.add(backing);

        var texture = textureLoader.load(item.src);
        texture.colorSpace = THREE.SRGBColorSpace;
        var image = new THREE.Mesh(
          new THREE.PlaneGeometry(item.width, item.height),
          new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide })
        );
        image.position.set(item.x + (item.rotation > 0 ? 0.015 : -0.015), item.y, item.z);
        image.rotation.y = item.rotation;
        parent.add(image);

        var frame = new THREE.LineSegments(
          new THREE.EdgesGeometry(new THREE.BoxGeometry(item.width + 0.22, item.height + 0.22, 0.03)),
          new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.48 })
        );
        frame.position.set(item.x, item.y, item.z);
        frame.rotation.y = item.rotation;
        parent.add(frame);
      });
    }

    function addEntrancePlacards() {
      var placements = [
        { x: 5.14, z: -2.6, width: 2.7, height: 1.45, rotation: -Math.PI / 2 },
        { x: -5.14, z: 5.27, width: 2.35, height: 1.26, rotation: Math.PI / 2 }
      ];
      entranceStatements.forEach(function (statement, index) {
        var placard = new THREE.Mesh(
          new THREE.PlaneGeometry(placements[index].width, placements[index].height),
          new THREE.MeshBasicMaterial({ map: makeHallwayStatementTexture(statement, index), transparent: true, side: THREE.DoubleSide })
        );
        placard.position.set(placements[index].x, 2.35, placements[index].z);
        placard.rotation.y = placements[index].rotation;
        scene.add(placard);
      });
    }

    function addPortal(options) {
      var target = options.parent || scene;
      addLineBox(
        new THREE.Vector3(options.x, 2.4, options.z),
        new THREE.Vector3(0.16, 4.8, 4.5),
        0.42,
        target
      );
      var hasReverse = Boolean(options.reverseTitle || options.readableBothSides);
      var normalX = Math.sin(options.rotation);
      var normalZ = Math.cos(options.rotation);
      var signMaterial = new THREE.MeshBasicMaterial({
        map: makePortalTexture({ title: options.title }),
        transparent: true,
        side: hasReverse ? THREE.FrontSide : THREE.DoubleSide
      });
      var sign = new THREE.Mesh(
        new THREE.PlaneGeometry(3.75, 1.08),
        signMaterial
      );
      sign.position.set(options.x + normalX * 0.09, 3.58, options.z + normalZ * 0.09);
      sign.rotation.y = options.rotation;
      target.add(sign);

      if (hasReverse) {
        var reverseSign = new THREE.Mesh(
          sign.geometry,
          new THREE.MeshBasicMaterial({
            map: makePortalTexture({ title: options.reverseTitle || options.title }),
            transparent: true,
            side: THREE.FrontSide
          })
        );
        reverseSign.position.set(options.x - normalX * 0.09, 3.58, options.z - normalZ * 0.09);
        reverseSign.rotation.y = sign.rotation.y + Math.PI;
        target.add(reverseSign);
      }
    }

    function addHorizontalPortal(options) {
      var target = options.parent || scene;
      addLineBox(
        new THREE.Vector3(options.x, 2.4, options.z),
        new THREE.Vector3(options.frameWidth || 4.5, 4.8, 0.16),
        0.42,
        target
      );
      var hasReverse = Boolean(options.reverseTitle);
      var normalX = Math.sin(options.rotation);
      var normalZ = Math.cos(options.rotation);
      var sign = new THREE.Mesh(
        new THREE.PlaneGeometry(options.signWidth || 3.75, 1.08),
        new THREE.MeshBasicMaterial({
          map: makePortalTexture({ title: options.title }),
          transparent: true,
          side: hasReverse ? THREE.FrontSide : THREE.DoubleSide
        })
      );
      sign.position.set(options.x + normalX * 0.09, 3.58, options.z + normalZ * 0.09);
      sign.rotation.y = options.rotation;
      target.add(sign);

      if (hasReverse) {
        var reverseSign = new THREE.Mesh(
          sign.geometry,
          new THREE.MeshBasicMaterial({
            map: makePortalTexture({ title: options.reverseTitle }),
            transparent: true,
            side: THREE.FrontSide
          })
        );
        reverseSign.position.set(options.x - normalX * 0.09, 3.58, options.z - normalZ * 0.09);
        reverseSign.rotation.y = options.rotation + Math.PI;
        target.add(reverseSign);
      }
    }

    function addPushingRoomWalls(parent) {
      [
        { x: -8.5, z: -0.6, length: 22.0, rotation: Math.PI / 2, height: 5.72, y: 2.9 },
        { x: 8.5, z: -5.2, length: 12.8, rotation: Math.PI / 2, height: 5.72, y: 2.9 },
        { x: 8.5, z: 7.5, length: 5.8, rotation: Math.PI / 2, height: 5.72, y: 2.9 },
        { x: 0, z: -11.6, length: 17.0, rotation: 0, height: 5.72, y: 2.9 },
        { x: -2.8, z: 10.4, length: 11.4, rotation: 0, height: 5.72, y: 2.9 },
        { x: 7.2, z: 10.4, length: 2.6, rotation: 0, height: 5.72, y: 2.9 }
      ].forEach(function (wall) {
        addDarkWall(wall, parent);
      });
    }

    function addDarkWall(options, parent) {
      var wall = new THREE.Mesh(
        new THREE.PlaneGeometry(options.length, options.height || 4.7),
        new THREE.MeshBasicMaterial({ color: 0x030302, side: THREE.DoubleSide })
      );
      wall.position.set(options.x, options.y || 2.4, options.z);
      wall.rotation.y = options.rotation;
      (parent || scene).add(wall);
    }

    function addBackWallNeon() {
      var neonMaterial = new THREE.MeshBasicMaterial({ map: makeBackWallNeonTexture(), transparent: true, side: THREE.DoubleSide, opacity: 0.92 });
      var sign = new THREE.Mesh(
        new THREE.PlaneGeometry(10.25, 4.85),
        neonMaterial
      );
      sign.position.set(0, 2.98, 6.34);
      sign.rotation.y = Math.PI;
      sign.rotation.z = -0.018;
      scene.add(sign);
      backWallNeon = sign;

      var floorGlow = new THREE.Mesh(
        new THREE.PlaneGeometry(6.9, 1.5),
        new THREE.MeshBasicMaterial({ map: makeNeonFloorGlowTexture(), transparent: true, side: THREE.DoubleSide, opacity: 0.32, depthWrite: false })
      );
      floorGlow.position.set(0, 0.045, 3.63);
      floorGlow.rotation.x = -Math.PI / 2;
      floorGlow.rotation.z = -0.018;
      scene.add(floorGlow);

      var neonLight = new THREE.PointLight(0xffdca0, 0.36, 9.2);
      neonLight.position.set(0, 2.94, 5.03);
      scene.add(neonLight);
      backWallNeonLight = neonLight;
    }

    function addChurchChapel() {
      var tanMaterial = new THREE.LineBasicMaterial({ color: 0xd8bd8a, transparent: true, opacity: 0.34 });
      var goldMaterial = new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.58 });
      var glassMaterial = new THREE.MeshBasicMaterial({ color: 0x080604, transparent: true, opacity: 0.34, side: THREE.DoubleSide });

      addLineBox(new THREE.Vector3(0, 2.25, -19.05), new THREE.Vector3(4.7, 4.2, 15.9), 0.26);
      addLineBox(new THREE.Vector3(0, 2.65, -30.75), new THREE.Vector3(3.1, 4.9, 3.1), 0.24);
      addLineBox(new THREE.Vector3(0, 3.9, -44.0), new THREE.Vector3(19.2, 7.8, 24.2), 0.3);
      addLineBox(new THREE.Vector3(0, 6.1, -44.0), new THREE.Vector3(14.6, 2.8, 22.8), 0.22);
      addLineBox(new THREE.Vector3(0, 0.28, -55.05), new THREE.Vector3(7.6, 0.56, 1.9), 0.64);
      addLineBox(new THREE.Vector3(0, 0.92, -55.32), new THREE.Vector3(5.6, 1.04, 1.22), 0.52);
      addLineBox(new THREE.Vector3(0, 1.58, -55.52), new THREE.Vector3(3.9, 0.52, 0.82), 0.46);
      addHallwayWall(-2.36, -14.05, 6.5, Math.PI / 2);
      addHallwayWall(-2.36, -23.75, 6.5, Math.PI / 2);
      addHallwayWall(2.36, -19.15, 15.7, -Math.PI / 2);
      addHallwayTransitionWall(-2.36, -27.0, -1.55, -29.2);
      addHallwayTransitionWall(2.36, -27.0, 1.55, -29.2);
      addHallwayWall(-1.55, -30.675, 2.95, Math.PI / 2);
      addHallwayWall(1.55, -30.675, 2.95, -Math.PI / 2);

      var churchSignGeometry = new THREE.PlaneGeometry(6.6, 1.22);
      var sign = new THREE.Mesh(
        churchSignGeometry,
        new THREE.MeshBasicMaterial({ map: makeChurchSignTexture(), transparent: true, side: THREE.FrontSide })
      );
      sign.position.set(0, 5.82, -30.84);
      scene.add(sign);

      var churchReturnSign = new THREE.Mesh(
        churchSignGeometry,
        new THREE.MeshBasicMaterial({ map: makeChurchReturnSignTexture(), transparent: true, side: THREE.FrontSide })
      );
      churchReturnSign.position.set(0, 5.82, -30.96);
      churchReturnSign.rotation.y = Math.PI;
      scene.add(churchReturnSign);

      var windowMesh = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 6.1), glassMaterial);
      windowMesh.position.set(0, 4.05, -56.14);
      scene.add(windowMesh);

      var archPoints = [
        new THREE.Vector3(-3.55, 0.92, -56.1),
        new THREE.Vector3(-3.55, 4.45, -56.1),
        new THREE.Vector3(-2.4, 5.85, -56.1),
        new THREE.Vector3(0, 6.48, -56.1),
        new THREE.Vector3(2.4, 5.85, -56.1),
        new THREE.Vector3(3.55, 4.45, -56.1),
        new THREE.Vector3(3.55, 0.92, -56.1)
      ];
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(archPoints), goldMaterial));
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 1.0, -56.08),
        new THREE.Vector3(0, 6.3, -56.08)
      ]), tanMaterial));
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-2.45, 3.72, -56.08),
        new THREE.Vector3(2.45, 3.72, -56.08)
      ]), tanMaterial));

      [-7.05, -5.3, 5.3, 7.05].forEach(function (x) {
        [-34.9, -38.7, -42.5, -46.3, -50.1].forEach(function (z) {
          addLineBox(new THREE.Vector3(x, 2.45, z), new THREE.Vector3(0.5, 4.9, 0.5), 0.42);
          addLineBox(new THREE.Vector3(x, 5.0, z), new THREE.Vector3(0.86, 0.32, 0.86), 0.34);
          addLineBox(new THREE.Vector3(x, 0.18, z), new THREE.Vector3(0.82, 0.36, 0.82), 0.32);
        });
      });

      [-4.85, -3.25, 3.25, 4.85].forEach(function (x) {
        [-36.0, -38.4, -40.8, -43.2, -45.6].forEach(function (z) {
          addLineBox(new THREE.Vector3(x, 0.36, z), new THREE.Vector3(0.94, 0.2, 1.28), 0.21);
        });
      });
    }

    function addGraveyardWing() {
      var doorwayX = 9.55;
      var doorwayZ = -52.35;
      var turnX = 14.2;
      var hallSouthZ = -50.55;
      var hallNorthZ = -54.15;
      var longHallWestX = 12.4;
      var longHallEastX = 16.0;
      var longHallEndZ = -76.5;

      addJoinedLineBox(
        new THREE.Vector3((doorwayX + turnX) / 2, 2.4, doorwayZ),
        new THREE.Vector3(turnX - doorwayX, 4.8, hallSouthZ - hallNorthZ),
        0.26,
        [1, 2]
      );
      addJoinedLineBox(
        new THREE.Vector3(turnX, 2.4, (hallSouthZ + longHallEndZ) / 2),
        new THREE.Vector3(longHallEastX - longHallWestX, 4.8, hallSouthZ - longHallEndZ),
        0.26,
        [2, 3]
      );

      [
        {
          x: (doorwayX + longHallWestX) / 2,
          z: hallNorthZ,
          length: longHallWestX - doorwayX,
          rotation: 0
        },
        {
          x: (doorwayX + longHallEastX) / 2,
          z: hallSouthZ,
          length: longHallEastX - doorwayX,
          rotation: 0
        },
        {
          x: longHallWestX,
          z: (hallNorthZ + longHallEndZ) / 2,
          length: hallNorthZ - longHallEndZ,
          rotation: Math.PI / 2
        },
        {
          x: longHallEastX,
          z: (hallSouthZ + longHallEndZ) / 2,
          length: hallSouthZ - longHallEndZ,
          rotation: Math.PI / 2
        }
      ].forEach(function (wall) {
        addDarkWall(wall);
      });

      addPortal({
        x: doorwayX,
        z: doorwayZ,
        rotation: -Math.PI / 2,
        title: "Graveyard",
        reverseTitle: "Church of AI"
      });

      var path = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(8.2, 0.035, doorwayZ),
          new THREE.Vector3(turnX, 0.035, doorwayZ),
          new THREE.Vector3(turnX, 0.035, longHallEndZ - 4.8)
        ]),
        new THREE.LineBasicMaterial({ color: 0xd8bd8a, transparent: true, opacity: 0.2 })
      );
      scene.add(path);

      var graveyardGround = new THREE.Mesh(
        new THREE.PlaneGeometry(21.6, 21.8),
        new THREE.MeshStandardMaterial({
          color: 0x050403,
          roughness: 1,
          metalness: 0,
          side: THREE.DoubleSide
        })
      );
      graveyardGround.position.set(14.2, 0.005, -86.6);
      graveyardGround.rotation.x = -Math.PI / 2;
      scene.add(graveyardGround);

      var graveyardGrid = new THREE.GridHelper(21.6, 12, 0x6c5a3b, 0x3c3325);
      graveyardGrid.material.transparent = true;
      graveyardGrid.material.opacity = 0.12;
      graveyardGrid.position.set(14.2, 0.018, -86.6);
      scene.add(graveyardGrid);

      [
        { x: 9.25, z: -81.4, scale: 0.94 },
        { x: 18.3, z: -80.2, scale: 1.02 },
        { x: 11.65, z: -88.35, scale: 0.9 },
        { x: 20.15, z: -90.15, scale: 1.08 }
      ].forEach(function (plot, index) {
        addGraveyardTombstone(plot, index);
      });

      addGraveyardScenery();

      var thresholdLight = new THREE.PointLight(0xffe3a6, 0.34, 10);
      thresholdLight.position.set(turnX, 3.2, -58.0);
      scene.add(thresholdLight);

      var fieldLight = new THREE.PointLight(0xd8bd8a, 0.3, 18);
      fieldLight.position.set(14.2, 3.6, -85.8);
      scene.add(fieldLight);
    }

    function addGraveyardTombstone(plot, index) {
      var tombstone = new THREE.Group();
      tombstone.position.set(plot.x, 0.04, plot.z);
      tombstone.scale.setScalar(plot.scale);

      var shape = new THREE.Shape();
      shape.moveTo(-0.78, 0);
      shape.lineTo(-0.78, 1.42);
      shape.quadraticCurveTo(-0.78, 2.18, 0, 2.28);
      shape.quadraticCurveTo(0.78, 2.18, 0.78, 1.42);
      shape.lineTo(0.78, 0);
      shape.closePath();

      var stoneGeometry = new THREE.ExtrudeGeometry(shape, {
        depth: 0.16,
        steps: 1,
        bevelEnabled: true,
        bevelThickness: 0.035,
        bevelSize: 0.045,
        bevelSegments: 1
      });
      stoneGeometry.translate(0, 0.28, -0.08);

      var slab = new THREE.Mesh(
        stoneGeometry,
        new THREE.MeshStandardMaterial({
          color: 0x15120d,
          roughness: 0.9,
          metalness: 0.05
        })
      );
      tombstone.add(slab);

      var stoneEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(stoneGeometry, 18),
        new THREE.LineBasicMaterial({ color: 0xd8bd8a, transparent: true, opacity: 0.48 })
      );
      tombstone.add(stoneEdges);

      var base = new THREE.Mesh(
        new THREE.BoxGeometry(2.05, 0.22, 0.72),
        new THREE.MeshStandardMaterial({ color: 0x0c0a07, roughness: 0.95 })
      );
      base.position.y = 0.13;
      tombstone.add(base);

      var label = new THREE.Mesh(
        new THREE.PlaneGeometry(1.28, 0.78),
        new THREE.MeshBasicMaterial({
          map: makeGraveyardMarkerTexture(index),
          transparent: true,
          side: THREE.FrontSide
        })
      );
      label.position.set(0, 1.32, 0.115);
      tombstone.add(label);

      scene.add(tombstone);
      graveyardTombstones.push(tombstone);
      roomFixtures.push({ x: plot.x, z: plot.z, radius: 1.02 * plot.scale });
    }

    function addGraveyardScenery() {
      var fenceMaterial = new THREE.MeshBasicMaterial({ color: 0x17120c });
      var fenceLineMaterial = new THREE.LineBasicMaterial({
        color: 0xd8bd8a,
        transparent: true,
        opacity: 0.44
      });

      addGraveyardFenceRun(4.0, -76.2, 11.7, -76.2, 2.5, fenceMaterial, fenceLineMaterial);
      addGraveyardFenceRun(16.7, -76.2, 24.4, -76.2, 2.5, fenceMaterial, fenceLineMaterial);
      addGraveyardFenceRun(4.0, -97.0, 24.4, -97.0, 2.6, fenceMaterial, fenceLineMaterial);
      addGraveyardFenceRun(4.0, -76.2, 4.0, -97.0, 2.6, fenceMaterial, fenceLineMaterial);
      addGraveyardFenceRun(24.4, -76.2, 24.4, -97.0, 2.6, fenceMaterial, fenceLineMaterial);

      addGraveyardMausoleum();
      addFlatGraveMarkers();
      addGraveyardGrass();
    }

    function addGraveyardFenceRun(x1, z1, x2, z2, postSpacing, railMaterial, lineMaterial) {
      var dx = x2 - x1;
      var dz = z2 - z1;
      var length = Math.sqrt(dx * dx + dz * dz);
      var rotation = -Math.atan2(dz, dx);
      var centerX = (x1 + x2) / 2;
      var centerZ = (z1 + z2) / 2;

      [0.38, 0.72].forEach(function (y) {
        var rail = new THREE.Mesh(
          new THREE.BoxGeometry(length, 0.055, 0.055),
          railMaterial
        );
        rail.position.set(centerX, y, centerZ);
        rail.rotation.y = rotation;
        scene.add(rail);
      });

      var postCount = Math.max(1, Math.ceil(length / postSpacing));
      var postPoints = [];
      for (var postIndex = 0; postIndex <= postCount; postIndex += 1) {
        var t = postIndex / postCount;
        var postX = x1 + dx * t;
        var postZ = z1 + dz * t;
        postPoints.push(
          new THREE.Vector3(postX, 0.03, postZ),
          new THREE.Vector3(postX, 1.02, postZ)
        );
      }
      scene.add(new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints(postPoints),
        lineMaterial
      ));
    }

    function addGraveyardMausoleum() {
      var mausoleum = new THREE.Group();
      mausoleum.position.set(6.8, 0, -93.0);

      var stoneMaterial = new THREE.MeshStandardMaterial({
        color: 0x12100c,
        roughness: 0.92,
        metalness: 0.04
      });
      var darkMaterial = new THREE.MeshBasicMaterial({
        color: 0x030302,
        side: THREE.DoubleSide
      });
      var edgeMaterial = new THREE.LineBasicMaterial({
        color: 0xd8bd8a,
        transparent: true,
        opacity: 0.42
      });

      function addMausoleumBlock(geometry, x, y, z, material) {
        var block = new THREE.Mesh(geometry, material || stoneMaterial);
        block.position.set(x, y, z);
        mausoleum.add(block);

        var edges = new THREE.LineSegments(
          new THREE.EdgesGeometry(geometry),
          edgeMaterial
        );
        edges.position.copy(block.position);
        edges.rotation.copy(block.rotation);
        mausoleum.add(edges);
        return block;
      }

      addMausoleumBlock(new THREE.BoxGeometry(4.5, 0.22, 3.8), 0, 0.11, 0);
      addMausoleumBlock(new THREE.BoxGeometry(3.7, 2.6, 3.0), 0, 1.5, 0);

      var roofGeometry = new THREE.ConeGeometry(2.68, 1.08, 4);
      var roof = new THREE.Mesh(roofGeometry, stoneMaterial);
      roof.position.set(0, 3.34, 0);
      roof.rotation.y = Math.PI / 4;
      mausoleum.add(roof);
      var roofEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(roofGeometry),
        edgeMaterial
      );
      roofEdges.position.copy(roof.position);
      roofEdges.rotation.copy(roof.rotation);
      mausoleum.add(roofEdges);

      var doorShape = new THREE.Shape();
      doorShape.moveTo(-0.62, 0);
      doorShape.lineTo(-0.62, 1.35);
      doorShape.quadraticCurveTo(-0.62, 1.95, 0, 2.08);
      doorShape.quadraticCurveTo(0.62, 1.95, 0.62, 1.35);
      doorShape.lineTo(0.62, 0);
      doorShape.closePath();
      var doorGeometry = new THREE.ShapeGeometry(doorShape);
      var door = new THREE.Mesh(doorGeometry, darkMaterial);
      door.position.set(0, 0.25, 1.512);
      mausoleum.add(door);
      var doorEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(doorGeometry),
        new THREE.LineBasicMaterial({
          color: 0xffe3a6,
          transparent: true,
          opacity: 0.5
        })
      );
      doorEdges.position.copy(door.position);
      mausoleum.add(doorEdges);

      [-1.28, 1.28].forEach(function (x) {
        var column = new THREE.Mesh(
          new THREE.CylinderGeometry(0.13, 0.16, 2.34, 10),
          stoneMaterial
        );
        column.position.set(x, 1.42, 1.58);
        mausoleum.add(column);
      });

      addMausoleumBlock(new THREE.BoxGeometry(2.3, 0.16, 0.72), 0, 0.2, 1.88);
      addMausoleumBlock(new THREE.BoxGeometry(1.7, 0.14, 0.62), 0, 0.33, 2.26);

      var mausoleumLight = new THREE.PointLight(0xffe3a6, 0.18, 5.5);
      mausoleumLight.position.set(0, 2.0, 3.0);
      mausoleum.add(mausoleumLight);

      scene.add(mausoleum);
      roomFixtures.push({ x: 6.8, z: -93.0, radius: 2.72 });
    }

    function addFlatGraveMarkers() {
      var markerMaterial = new THREE.MeshStandardMaterial({
        color: 0x0e0c09,
        roughness: 0.96,
        metalness: 0.02
      });
      var markerEdgeMaterial = new THREE.LineBasicMaterial({
        color: 0xd8bd8a,
        transparent: true,
        opacity: 0.3
      });
      var markerGeometry = new THREE.BoxGeometry(1.3, 0.1, 2.05);
      [
        { x: 6.1, z: -81.5, rotation: 0.12 },
        { x: 22.0, z: -82.8, rotation: -0.18 },
        { x: 15.0, z: -85.1, rotation: 0.09 },
        { x: 7.5, z: -87.0, rotation: -0.2 },
        { x: 16.2, z: -92.4, rotation: 0.16 },
        { x: 22.2, z: -94.4, rotation: -0.08 }
      ].forEach(function (markerPosition) {
        var marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.set(markerPosition.x, 0.07, markerPosition.z);
        marker.rotation.y = markerPosition.rotation;
        scene.add(marker);

        var markerEdges = new THREE.LineSegments(
          new THREE.EdgesGeometry(markerGeometry),
          markerEdgeMaterial
        );
        markerEdges.position.copy(marker.position);
        markerEdges.rotation.copy(marker.rotation);
        scene.add(markerEdges);
      });
    }

    function addGraveyardGrass() {
      var clusters = [
        [5.2, -78.8],
        [7.1, -84.0],
        [5.1, -86.2],
        [10.0, -84.5],
        [13.8, -80.2],
        [17.0, -83.2],
        [18.6, -86.2],
        [21.8, -78.7],
        [23.0, -87.0],
        [23.0, -91.0],
        [20.8, -94.7],
        [14.0, -94.4],
        [10.0, -95.3]
      ];
      var bladeOffsets = [
        [-0.14, -0.02, -0.05, 0.27, 0.02],
        [-0.05, 0.08, -0.02, 0.34, 0.12],
        [0.03, -0.06, 0.08, 0.24, -0.12],
        [0.12, 0.05, 0.17, 0.31, 0.0],
        [0.0, 0.13, -0.05, 0.22, 0.18]
      ];
      var grassPoints = [];

      clusters.forEach(function (cluster) {
        bladeOffsets.forEach(function (blade) {
          grassPoints.push(
            new THREE.Vector3(cluster[0] + blade[0], 0.025, cluster[1] + blade[1]),
            new THREE.Vector3(cluster[0] + blade[2], blade[3], cluster[1] + blade[4])
          );
        });
      });

      scene.add(new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints(grassPoints),
        new THREE.LineBasicMaterial({
          color: 0x9a8b50,
          transparent: true,
          opacity: 0.46
        })
      ));
    }

    function addHallwayWall(x, z, length, rotation) {
      var wall = new THREE.Mesh(
        new THREE.PlaneGeometry(length, 4.05),
        new THREE.MeshBasicMaterial({ color: 0x030302, side: THREE.DoubleSide })
      );
      wall.position.set(x, 2.28, z);
      wall.rotation.y = rotation;
      scene.add(wall);
    }

    function addHallwayTransitionWall(xStart, zStart, xEnd, zEnd) {
      var dx = xEnd - xStart;
      var dz = zEnd - zStart;
      var length = Math.sqrt(dx * dx + dz * dz);
      var x = (xStart + xEnd) / 2;
      var z = (zStart + zEnd) / 2;
      var rotation = Math.atan2(-dz, dx);

      addHallwayWall(x, z, length, rotation);

      var frame = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(length, 4.05, 0.04)),
        new THREE.LineBasicMaterial({ color: 0xd8bd8a, transparent: true, opacity: 0.26 })
      );
      frame.position.set(x, 2.28, z);
      frame.rotation.y = rotation;
      scene.add(frame);
    }

    function addHallwayStatements() {
      var placements = [
        { x: 2.3, z: -16.6, rotation: -Math.PI / 2 },
        { x: 2.3, z: -21.0, rotation: -Math.PI / 2 },
        { x: 2.3, z: -25.4, rotation: -Math.PI / 2 }
      ];
      hallwayStatements.forEach(function (statement, index) {
        var plaque = new THREE.Mesh(
          new THREE.PlaneGeometry(2.7, 1.45),
          new THREE.MeshBasicMaterial({ map: makeHallwayStatementTexture(statement, index), transparent: true, side: THREE.DoubleSide })
        );
        plaque.position.set(placements[index].x, 2.35, placements[index].z);
        plaque.rotation.y = placements[index].rotation;
        scene.add(plaque);
      });
    }

    function addHallwayGallery() {
      var textureLoader = new THREE.TextureLoader();
      var imageMaterialOptions = { transparent: true, side: THREE.DoubleSide };
      var backingMaterial = new THREE.MeshBasicMaterial({ color: 0x030302, transparent: true, opacity: 0.78, side: THREE.DoubleSide });
      var galleryImages = [
        { src: "/assets/about/what-drives-joe.jpg", x: 24.9, z: 3.37, y: 1.89, rotation: Math.PI, width: 3.2, height: 2.15 },
        { src: "/assets/about/principles-shape-work.jpg", x: 28.2, z: 3.37, y: 1.89, rotation: Math.PI, width: 3.2, height: 2.15 },
        { src: "/assets/about/coordination-flywheel.jpg", x: 31.6, z: 3.37, y: 2.02, rotation: Math.PI, width: 2.75, height: 2.75 },
        { src: "/assets/about/principled-tradeoff-analysis.jpg", x: 34.9, z: 3.37, y: 1.77, rotation: Math.PI, width: 2.9, height: 1.94 },
        { src: "/assets/about/principles-drive-everything-wheel.jpg", x: 38.2, z: 3.37, y: 1.84, rotation: Math.PI, width: 2.7, height: 2.16 }
      ];

      galleryImages.forEach(function (item) {
        var backing = new THREE.Mesh(new THREE.PlaneGeometry(item.width + 0.16, item.height + 0.16), backingMaterial.clone());
        backing.position.set(item.x, item.y, item.z);
        backing.rotation.y = item.rotation;
        scene.add(backing);

        var texture = textureLoader.load(item.src);
        texture.colorSpace = THREE.SRGBColorSpace;
        var image = new THREE.Mesh(
          new THREE.PlaneGeometry(item.width, item.height),
          new THREE.MeshBasicMaterial(Object.assign({ map: texture }, imageMaterialOptions))
        );
        image.position.set(item.x, item.y, item.z + (item.rotation === 0 ? 0.014 : -0.014));
        image.rotation.y = item.rotation;
        scene.add(image);
      });
    }

    function addCentralObject(parent) {
      var target = parent || scene;
      var tanMaterial = new THREE.LineBasicMaterial({ color: 0xd8bd8a, transparent: true, opacity: 0.52 });
      var goldMaterial = new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.66 });
      var dimMaterial = new THREE.LineBasicMaterial({ color: 0xd8bd8a, transparent: true, opacity: 0.26 });
      var glassMaterial = new THREE.MeshBasicMaterial({ color: 0x0a0704, transparent: true, opacity: 0.42, side: THREE.DoubleSide });

      addLineBox(new THREE.Vector3(0, 0.58, centralObject.z), new THREE.Vector3(3.05, 1.16, 3.05), 0.42, target);
      addLineBox(new THREE.Vector3(0, 1.38, centralObject.z), new THREE.Vector3(2.15, 0.38, 2.15), 0.32, target);

      var slab = new THREE.Mesh(new THREE.CylinderGeometry(1.34, 1.34, 0.08, 6), glassMaterial);
      slab.position.set(0, 1.26, centralObject.z);
      slab.rotation.y = Math.PI / 6;
      target.add(slab);

      var ring = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.TorusGeometry(1.28, 0.018, 8, 96)),
        goldMaterial
      );
      ring.position.set(0, 1.52, centralObject.z);
      ring.rotation.x = Math.PI / 2;
      target.add(ring);

      var core = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.OctahedronGeometry(0.52, 1)),
        goldMaterial
      );
      core.position.set(0, 1.78, centralObject.z);
      target.add(core);

      var haloOne = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.TorusGeometry(1.75, 0.012, 8, 112)),
        dimMaterial
      );
      haloOne.position.set(0, 0.05, centralObject.z);
      haloOne.rotation.x = Math.PI / 2;
      target.add(haloOne);

      var haloTwo = haloOne.clone();
      haloTwo.scale.set(1.32, 1.32, 1.32);
      haloTwo.material = tanMaterial;
      haloTwo.material.opacity = 0.2;
      target.add(haloTwo);

      var tableLabel = new THREE.Mesh(
        new THREE.PlaneGeometry(2.9, 0.72),
        new THREE.MeshBasicMaterial({ map: makeTableLabelTexture(), transparent: true, side: THREE.DoubleSide })
      );
      tableLabel.position.set(0, 0.88, centralObject.z + 1.62);
      tableLabel.rotation.x = -0.06;
      tableLabel.visible = false;
      target.add(tableLabel);

      commandBillboard = new THREE.Mesh(
        new THREE.PlaneGeometry(4.25, 2.05),
        new THREE.MeshBasicMaterial({ map: makeCommandCenterTexture(), transparent: true, side: THREE.DoubleSide })
      );
      commandBillboard.position.set(0, 3.05, centralObject.z);
      commandBillboard.userData.exhibitIndex = 8;
      target.add(commandBillboard);
      interactive.push(commandBillboard);

      var capacityAnchor = new THREE.Group();
      capacityAnchor.position.set(0, 2.1, centralObject.z);
      target.add(capacityAnchor);
      exhibitAnchors[8] = capacityAnchor;
      visibleExhibitIndexes.push(8);
      addRepositoryPowerState(commandBillboard, 8, null, {
        width: 4.38,
        height: 2.18,
        topY: 2.08,
        proximityAnchor: capacityAnchor
      });
    }

    function addLineBox(position, size, opacity, parent) {
      var geo = new THREE.BoxGeometry(size.x, size.y, size.z);
      var edges = new THREE.EdgesGeometry(geo);
      var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xd8bd8a, transparent: true, opacity: opacity }));
      line.position.copy(position);
      (parent || scene).add(line);
    }

    function addJoinedLineBox(position, size, opacity, omittedVerticalCorners, parent) {
      var xMin = position.x - size.x / 2;
      var xMax = position.x + size.x / 2;
      var yMin = position.y - size.y / 2;
      var yMax = position.y + size.y / 2;
      var zMin = position.z - size.z / 2;
      var zMax = position.z + size.z / 2;
      var corners = [
        [xMin, zMin],
        [xMax, zMin],
        [xMax, zMax],
        [xMin, zMax]
      ];
      var points = [];

      [yMin, yMax].forEach(function (y) {
        corners.forEach(function (corner, index) {
          var next = corners[(index + 1) % corners.length];
          points.push(
            new THREE.Vector3(corner[0], y, corner[1]),
            new THREE.Vector3(next[0], y, next[1])
          );
        });
      });

      corners.forEach(function (corner, index) {
        if (omittedVerticalCorners.indexOf(index) !== -1) return;
        points.push(
          new THREE.Vector3(corner[0], yMin, corner[1]),
          new THREE.Vector3(corner[0], yMax, corner[1])
        );
      });

      var line = new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({ color: 0xd8bd8a, transparent: true, opacity: opacity })
      );
      (parent || scene).add(line);
    }

    function addExhibits() {
      var controlConnectorX = pushingRoomOffset.x + 4.4;
      var workConnectorX = workRoomOffset.x + workRoomLayout.supportConnectorX;
      var placements = [
        { wall: "methodsSouth", zone: "work", x: 5.75, z: methodsRoomLayout.south + 0.16, y: 2.45, rotation: 0, scale: 0.72 },
        { wall: "methodsSouth", zone: "work", x: 9.93, z: methodsRoomLayout.south + 0.16, y: 2.45, rotation: 0, scale: 0.72 },
        { wall: "methodsSouth", zone: "work", x: 14.1, z: methodsRoomLayout.south + 0.16, y: 2.45, rotation: 0, scale: 0.72 },
        { wall: "identityGalleryBack", x: 26.1, z: -8.86 + identityZShift, y: 2.35, rotation: 0, scale: 0.72 },
        { wall: "identityGalleryBack", x: 29.4, z: -8.86 + identityZShift, y: 2.35, rotation: 0, scale: 0.72 },
        { wall: "supportWorkWest", x: workConnectorX - 1.37, z: 12.0, y: 2.3, rotation: Math.PI / 2, scale: 0.78 },
        { wall: "supportWorkEast", x: workConnectorX + 1.37, z: 16.0, y: 2.3, rotation: -Math.PI / 2, scale: 0.78 },
        { wall: "supportControlWest", x: controlConnectorX - 1.37, z: 12.5, y: 2.3, rotation: Math.PI / 2, scale: 0.78 },
        null,
        { wall: "altar", x: 0, z: -55.52, y: 3.05, rotation: 0 },
        { wall: "discoverWest", x: -15.76, z: -20.5, y: 2.35, rotation: Math.PI / 2 },
        { wall: "discoverWest", x: -15.76, z: -25.0, y: 2.35, rotation: Math.PI / 2 },
        { wall: "discoverEast", x: -11.04, z: -30.0, y: 2.35, rotation: -Math.PI / 2 },
        { wall: "chapelLeft", x: -9.34, z: -35.2, y: 2.46, rotation: Math.PI / 2 },
        { wall: "discoverEast", x: -11.04, z: -39.0, y: 2.35, rotation: -Math.PI / 2 },
        { wall: "discoverWest", x: -15.76, z: -43.5, y: 2.35, rotation: Math.PI / 2 },
        { wall: "chapelRight", x: 9.34, z: -35.2, y: 2.46, rotation: -Math.PI / 2 },
        { wall: "chapelLeft", x: -9.34, z: -43.5, y: 2.46, rotation: Math.PI / 2 },
        { wall: "chapelRight", x: 9.34, z: -47.0, y: 2.46, rotation: -Math.PI / 2 },
        { wall: "developmentBack", x: -4.43, z: -27.1, y: 2.55, rotation: -Math.PI / 2 },
        { wall: "developmentBack", x: -4.43, z: -22.9, y: 2.55, rotation: -Math.PI / 2 },
        { wall: "supportWorkWest", x: workConnectorX - 1.37, z: 20.0, y: 2.3, rotation: Math.PI / 2, scale: 0.78 },
        { wall: "supportWorkEast", x: workConnectorX + 1.37, z: 24.0, y: 2.3, rotation: -Math.PI / 2, scale: 0.78 },
        { wall: "supportSouth", x: 14.0, z: 22.63, y: 2.3, rotation: 0, scale: 0.78 },
        { wall: "supportNorth", x: 8.8, z: 27.37, y: 2.3, rotation: Math.PI, scale: 0.78 },
        { wall: "supportSouth", x: 3.6, z: 22.63, y: 2.3, rotation: 0, scale: 0.78 },
        { wall: "supportNorth", x: -1.6, z: 27.37, y: 2.3, rotation: Math.PI, scale: 0.78 },
        { wall: "supportSouth", x: -6.8, z: 22.63, y: 2.3, rotation: 0, scale: 0.78 },
        { wall: "supportNorth", x: -12.0, z: 27.37, y: 2.3, rotation: Math.PI, scale: 0.78 },
        { wall: "supportSouth", x: -17.2, z: 22.63, y: 2.3, rotation: 0, scale: 0.78 },
        { wall: "supportControlEast", x: controlConnectorX + 1.37, z: 17.0, y: 2.3, rotation: -Math.PI / 2, scale: 0.78 },
        { wall: "supportControlWest", x: controlConnectorX - 1.37, z: 21.5, y: 2.3, rotation: Math.PI / 2, scale: 0.78 },
        { wall: "back", zone: "pushing", x: -5.4, z: -11.45, y: 2.25, rotation: 0 },
        { wall: "back", zone: "pushing", x: 0, z: -11.45, y: 2.25, rotation: 0 },
        { wall: "back", zone: "pushing", x: 5.4, z: -11.45, y: 2.25, rotation: 0 },
        { wall: "controlFront", zone: "pushing", x: -5.4, z: 10.25, y: 2.25, rotation: Math.PI },
        { wall: "controlFront", zone: "pushing", x: -0.6, z: 10.25, y: 2.25, rotation: Math.PI },
        { wall: "discoverWest", x: -15.76, z: -34.5, y: 2.35, rotation: Math.PI / 2 },
        { wall: "discoverEntryNorth", x: -12.8, z: -10.94, y: 2.3, rotation: Math.PI, scale: 0.78 },
        { wall: "identityGalleryBack", x: 32.7, z: -8.86 + identityZShift, y: 2.35, rotation: 0, scale: 0.72 },
        { wall: "identityGalleryWest", x: 24.14, z: -5.35 + identityZShift, y: 2.35, rotation: Math.PI / 2, scale: 0.72 },
        { wall: "identityGalleryEast", x: 38.36, z: -5.35 + identityZShift, y: 2.35, rotation: -Math.PI / 2, scale: 0.72 },
        { wall: "identityGalleryBack", x: 36.0, z: -8.86 + identityZShift, y: 2.35, rotation: 0, scale: 0.72 },
        { wall: "chapelBack", x: -6.58, z: -55.86, y: 2.55, rotation: 0, scale: 0.78 },
        { wall: "chapelBack", x: 6.58, z: -55.86, y: 2.55, rotation: 0, scale: 0.78 },
        { wall: "discoverEast", x: -11.04, z: -48.0, y: 2.35, rotation: -Math.PI / 2 }
      ];

      placements[exhibitIndex("Understand where you are")] = {
        wall: "workEast", zone: "work", x: workRoomLayout.east - 0.16, z: -0.5, y: 2.45, rotation: -Math.PI / 2, scale: workOfferPlacement.displayScale
      };
      placements[exhibitIndex("Build reliable AI ways of working")] = {
        wall: "workNorth", zone: "work", x: workOfferPlacement.north.buildX, z: workRoomLayout.north - 0.16, y: 2.45, rotation: Math.PI, scale: workOfferPlacement.displayScale
      };
      placements[exhibitIndex("Connect what works and scale it")] = {
        wall: "workNorth", zone: "work", x: workOfferPlacement.north.connectX, z: workRoomLayout.north - 0.16, y: 2.45, rotation: Math.PI, scale: workOfferPlacement.displayScale
      };
      placements[exhibitIndex("Help leaders guide AI-enabled change")] = {
        wall: "workSouth", zone: "work", x: workOfferPlacement.south.pushX, z: workRoomLayout.south + 0.16, y: 2.45, rotation: 0, scale: workOfferPlacement.displayScale
      };
      placements[exhibitIndex("Push high-value work further")] = {
        wall: "workSouth", zone: "work", x: workOfferPlacement.south.leadershipX, z: workRoomLayout.south + 0.16, y: 2.45, rotation: 0, scale: workOfferPlacement.displayScale
      };
      placements[exhibitIndex("Joe's Research Record")] = {
        wall: "discoverWest", x: -15.76, z: -17.2, y: 2.35, rotation: Math.PI / 2
      };
      placements[exhibitIndex("Time as Finality")] = {
        wall: "discoverEast", x: -11.04, z: -20.5, y: 2.35, rotation: -Math.PI / 2
      };
      placements[exhibitIndex("Temporal Issuance")] = {
        wall: "discoverWest", x: -15.76, z: -25.5, y: 2.35, rotation: Math.PI / 2
      };
      placements[exhibitIndex("GU Formalization")] = {
        wall: "discoverEast", x: -11.04, z: -31.0, y: 2.35, rotation: -Math.PI / 2
      };
      placements[exhibitIndex("Dynamic Unity")] = {
        wall: "discoverWest", x: -15.76, z: -36.5, y: 2.35, rotation: Math.PI / 2
      };
      placements[exhibitIndex("Possibility to Capability")] = {
        wall: "discoverEast", x: -11.04, z: -42.0, y: 2.35, rotation: -Math.PI / 2
      };
      placements[exhibitIndex("Continuity Ledger")] = {
        wall: "discoverWest", x: -15.76, z: -47.5, y: 2.35, rotation: Math.PI / 2
      };
      exhibits.forEach(function (exhibit, index) {
        if (exhibit.hiddenFromExperience) return;
        var place = placements[index];
        if (!place) return;
        var target = place.zone === "pushing" ? pushingRoom : (place.zone === "work" ? workRoom : scene);
        var group = new THREE.Group();
        group.position.set(place.x, place.y, place.z);
        group.rotation.y = place.rotation;
        if (place.scale) group.scale.setScalar(place.scale);
        group.userData.exhibitIndex = index;

        var plate = new THREE.Mesh(
          new THREE.PlaneGeometry(3.6, 3.9),
          new THREE.MeshBasicMaterial({ color: 0x080604, transparent: true, opacity: 0.82, side: THREE.DoubleSide })
        );
        plate.position.z = -0.02;
        plate.userData.exhibitIndex = index;
        group.add(plate);
        interactive.push(plate);

        if (exhibit.image || exhibit.displayType === "product") {
          var texture = exhibit.displayType === "product"
            ? makeProductArtworkTexture(exhibit)
            : new THREE.TextureLoader().load(exhibit.image);
          texture.colorSpace = THREE.SRGBColorSpace;
          var image = new THREE.Mesh(
            new THREE.PlaneGeometry(exhibit.imageWidth || 2.5, exhibit.imageHeight || 1.55),
            new THREE.MeshBasicMaterial({ map: texture, transparent: true })
          );
          image.position.set(0, 0.78, 0.03);
          image.userData.exhibitIndex = index;
          group.add(image);
          interactive.push(image);
        } else {
          var emptyImageFrame = new THREE.LineSegments(
            new THREE.EdgesGeometry(new THREE.BoxGeometry(2.5, 1.55, 0.025)),
            new THREE.LineBasicMaterial({ color: 0xd8bd8a, transparent: true, opacity: 0.16 })
          );
          emptyImageFrame.position.set(0, 0.78, 0.03);
          group.add(emptyImageFrame);
        }

        var label = new THREE.Mesh(
          new THREE.PlaneGeometry(3.15, 1.45),
          new THREE.MeshBasicMaterial({ map: makeLabelTexture(exhibit, index), transparent: true })
        );
        label.position.set(0, -1.05, 0.04);
        label.userData.exhibitIndex = index;
        group.add(label);
        interactive.push(label);

        var frame = new THREE.LineSegments(
          new THREE.EdgesGeometry(new THREE.BoxGeometry(3.72, 4.02, 0.03)),
          new THREE.LineBasicMaterial({ color: exhibit.title === "Church of AI" ? 0xffe3a6 : 0xd8bd8a, transparent: true, opacity: exhibit.title === "Church of AI" ? 0.62 : 0.38 })
        );
        frame.userData.exhibitIndex = index;
        group.add(frame);
        interactive.push(frame);

        target.add(group);
        addRepositoryPowerState(group, index, place);
        exhibitAnchors[index] = group;
        visibleExhibitIndexes.push(index);
        addApproachMarker(place, target);
      });
    }

    function repositoryPowerStateFor(exhibit) {
      return exhibit && repositoryActivityStates[exhibit.title]
        ? repositoryActivityStates[exhibit.title]
        : null;
    }

    function repositoryStateSpec(state) {
      if (state === "agent-active") {
        return { color: 0xbef27a, opacity: 0.82, label: "AGENT ACTIVE", cssColor: "#bef27a" };
      }
      if (state === "standby") {
        return { color: 0x4b4034, opacity: 0.5, label: "STANDBY", cssColor: "#756451" };
      }
      return { color: 0xf0bb68, opacity: 0.72, label: "IN DEVELOPMENT", cssColor: "#f0bb68" };
    }

    function repositoryPowerMaterial(state) {
      if (repositoryPowerMaterials[state]) return repositoryPowerMaterials[state];
      var spec = repositoryStateSpec(state);
      repositoryPowerMaterials[state] = new THREE.LineBasicMaterial({
        color: spec.color,
        transparent: true,
        opacity: spec.opacity,
        depthWrite: false
      });
      return repositoryPowerMaterials[state];
    }

    function isChurchDisplayPlace(place) {
      return Boolean(place && ["altar", "chapelLeft", "chapelRight", "chapelBack"].indexOf(place.wall) !== -1);
    }

    function repositoryCeilingY(place) {
      if (!place) return 5.12;
      if (place.zone === "work") return 5.12;
      if (place.zone === "pushing") return 5.02;
      if (place.wall === "developmentBack") return 5.12;
      if (place.wall && place.wall.indexOf("identity") === 0) return 4.82;
      return 4.72;
    }

    function addRepositoryPowerState(display, exhibitIndexValue, place, options) {
      var exhibit = exhibits[exhibitIndexValue];
      var state = repositoryPowerStateFor(exhibit);
      if (!state || !display) return;

      options = options || {};
      var width = options.width || 3.9;
      var height = options.height || 4.2;
      var halfWidth = width / 2;
      var halfHeight = height / 2;
      var lineZ = 0.075;
      var points = [];

      function addSegment(x1, y1, z1, x2, y2, z2) {
        points.push(
          new THREE.Vector3(x1, y1, z1),
          new THREE.Vector3(x2, y2, z2)
        );
      }

      function addRectangle(inset) {
        var left = -halfWidth + inset;
        var right = halfWidth - inset;
        var bottom = -halfHeight + inset;
        var top = halfHeight - inset;
        addSegment(left, bottom, lineZ, right, bottom, lineZ);
        addSegment(right, bottom, lineZ, right, top, lineZ);
        addSegment(right, top, lineZ, left, top, lineZ);
        addSegment(left, top, lineZ, left, bottom, lineZ);
      }

      addRectangle(0);
      addRectangle(0.075);

      if (isChurchDisplayPlace(place)) {
        var returnY = halfHeight - 0.42;
        addSegment(halfWidth, returnY, lineZ, halfWidth + 0.48, returnY, lineZ);
        addSegment(halfWidth, returnY - 0.075, lineZ, halfWidth + 0.4, returnY - 0.075, lineZ);
        addSegment(halfWidth + 0.48, returnY, lineZ, halfWidth + 0.48, returnY, -0.18);
      } else {
        var scale = place && place.scale ? place.scale : 1;
        var topY = options.topY || Math.max(
          halfHeight + 0.24,
          (repositoryCeilingY(place) - (place ? place.y : 0)) / scale
        );
        addSegment(halfWidth, halfHeight, lineZ, halfWidth, topY, lineZ);
        addSegment(halfWidth - 0.075, halfHeight - 0.075, lineZ, halfWidth - 0.075, topY, lineZ);
        addSegment(halfWidth - 0.075, topY, lineZ, halfWidth + 0.24, topY, lineZ);
      }

      var conduit = new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints(points),
        repositoryPowerMaterial(state)
      );
      conduit.renderOrder = 3;
      conduit.userData.repositoryActivityState = state;
      display.add(conduit);

      display.userData.repositoryActivityState = state;
      if (state === "agent-active") {
        agentActiveRepositoryAnchors.push(options.proximityAnchor || display);
      }
      root.dataset.repositoryPowerState = "enabled";
    }

    function addApproachMarker(place, parent) {
      var markerMaterial = new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.34 });
      var marker = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(1.5, 0.02, 0.84)),
        markerMaterial
      );
      marker.position.set(place.x, 0.035, place.z);
      marker.rotation.y = place.rotation;
      if (place.wall === "left") marker.position.x += 2.05;
      if (place.wall === "right") marker.position.x -= 2.05;
      if (place.wall === "chapelLeft") marker.position.x += 2.05;
      if (place.wall === "chapelRight") marker.position.x -= 2.05;
      if (place.wall === "back") marker.position.z += 2.1;
      if (place.wall === "altar") marker.position.z += 2.25;
      if (place.wall === "orientationLeft") marker.position.x += 1.55;
      if (place.wall === "orientationRight") marker.position.x -= 1.55;
      if (place.wall === "workBack") marker.position.x -= 2.1;
      if (place.wall === "developmentBack") marker.position.x -= 2.1;
      if (place.wall === "methodsWest") marker.position.x += 1.2;
      if (place.wall === "methodsEast") marker.position.x -= 1.2;
      if (place.wall === "methodsSouth") marker.position.z += 1.2;
      if (place.wall === "workSouth") marker.position.z += 1.2;
      if (place.wall === "workNorth") marker.position.z -= 1.2;
      if (place.wall === "workWest") marker.position.x += 1.2;
      if (place.wall === "workEast") marker.position.x -= 1.2;
      if (place.wall === "discoverWest") marker.position.x += 2.05;
      if (place.wall === "discoverEast") marker.position.x -= 2.05;
      if (place.wall === "discoverEntryNorth") marker.position.z -= 1.2;
      if (place.wall === "supportWorkWest" || place.wall === "supportControlWest") marker.position.x += 1.2;
      if (place.wall === "supportWorkEast" || place.wall === "supportControlEast") marker.position.x -= 1.2;
      if (place.wall === "supportSouth") marker.position.z += 1.2;
      if (place.wall === "supportNorth") marker.position.z -= 1.2;
      if (place.wall === "identityNorth") marker.position.z += 1.2;
      if (place.wall === "identitySouth") marker.position.z -= 1.2;
      if (place.wall === "identityGalleryBack" || place.wall === "chapelBack") marker.position.z += 1.2;
      if (place.wall === "identityGalleryWest") marker.position.x += 1.2;
      if (place.wall === "identityGalleryEast") marker.position.x -= 1.2;
      if (place.wall === "controlFront") marker.position.z -= 2.1;
      (parent || scene).add(marker);
    }

    function makeProductArtworkTexture(exhibit) {
      var c = document.createElement("canvas");
      c.width = 1200;
      c.height = 744;
      var ctx = c.getContext("2d");
      var cream = "#fff8e8";
      var gold = "#ffe3a6";
      var tan = "#d8bd8a";

      ctx.fillStyle = "#050403";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(216,189,138,0.09)";
      ctx.lineWidth = 1;
      for (var gridX = 48; gridX < c.width; gridX += 72) {
        ctx.beginPath();
        ctx.moveTo(gridX, 0);
        ctx.lineTo(gridX, c.height);
        ctx.stroke();
      }
      for (var gridY = 48; gridY < c.height; gridY += 72) {
        ctx.beginPath();
        ctx.moveTo(0, gridY);
        ctx.lineTo(c.width, gridY);
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(255,227,166,0.5)";
      ctx.lineWidth = 3;
      ctx.strokeRect(34, 34, c.width - 68, c.height - 68);
      ctx.strokeStyle = "rgba(216,189,138,0.22)";
      ctx.strokeRect(66, 66, c.width - 132, c.height - 132);

      function line(x1, y1, x2, y2, width, opacity) {
        ctx.strokeStyle = "rgba(255,227,166," + (opacity || 0.46) + ")";
        ctx.lineWidth = width || 4;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      function node(x, y, radius, active) {
        ctx.fillStyle = active ? gold : "rgba(216,189,138,0.2)";
        ctx.strokeStyle = active ? cream : "rgba(216,189,138,0.72)";
        ctx.lineWidth = active ? 5 : 3;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      function glow(x, y, radius, strength) {
        var gradient = ctx.createRadialGradient(x, y, 4, x, y, radius);
        gradient.addColorStop(0, "rgba(255,248,232," + (strength || 0.28) + ")");
        gradient.addColorStop(0.28, "rgba(255,227,166," + ((strength || 0.28) * 0.68) + ")");
        gradient.addColorStop(1, "rgba(255,227,166,0)");
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
      }

      function arrowHead(x, y, angle, size) {
        ctx.save();
        ctx.translate(x, y);
        ctx.rotate(angle);
        ctx.fillStyle = gold;
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-size, -size * 0.55);
        ctx.lineTo(-size, size * 0.55);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      function polyline(points, width, opacity, dashed) {
        ctx.save();
        ctx.strokeStyle = "rgba(255,227,166," + (opacity || 0.46) + ")";
        ctx.lineWidth = width || 4;
        if (dashed) ctx.setLineDash(dashed);
        ctx.beginPath();
        points.forEach(function (point, index) {
          if (index === 0) ctx.moveTo(point[0], point[1]);
          else ctx.lineTo(point[0], point[1]);
        });
        ctx.stroke();
        ctx.restore();
      }

      if (exhibit.artworkPattern === "diagnostic") {
        var terrain = [[118, 500], [250, 454], [352, 506], [476, 402], [596, 446], [714, 326], [842, 390], [1038, 284]];
        polyline(terrain, 7, 0.62);
        polyline(terrain.map(function (point) { return [point[0], point[1] + 38]; }), 2, 0.22, [12, 14]);
        terrain.forEach(function (point, index) {
          node(point[0], point[1], index === 5 ? 24 : 16, index === 5);
        });

        glow(596, 288, 176, 0.24);
        ctx.strokeStyle = "rgba(255,227,166,0.74)";
        ctx.lineWidth = 5;
        [74, 132].forEach(function (radius) {
          ctx.beginPath();
          ctx.arc(596, 288, radius, Math.PI * 0.12, Math.PI * 1.88);
          ctx.stroke();
        });
        line(472, 288, 720, 288, 3, 0.5);
        line(596, 164, 596, 446, 4, 0.72);
        node(596, 288, 24, true);
        ctx.strokeStyle = gold;
        ctx.lineWidth = 5;
        ctx.strokeRect(552, 420, 88, 52);
        line(552, 446, 640, 446, 8, 0.8);
      } else if (exhibit.artworkPattern === "repeatable") {
        polyline([[130, 428], [204, 334], [272, 430], [338, 286]], 4, 0.34, [14, 12]);
        [[130, 428], [204, 334], [272, 430]].forEach(function (point) {
          node(point[0], point[1], 18, false);
        });
        glow(520, 372, 180, 0.2);
        ctx.strokeStyle = "rgba(255,227,166,0.72)";
        ctx.lineWidth = 7;
        ctx.strokeRect(338, 250, 376, 244);
        [[386, 372], [526, 298], [666, 372], [526, 446]].forEach(function (point, index) {
          node(point[0], point[1], 21, index === 0);
        });
        polyline([[386, 372], [526, 298], [666, 372], [526, 446], [386, 372]], 6, 0.66);
        arrowHead(666, 372, Math.PI / 4, 19);

        line(714, 372, 790, 372, 7, 0.72);
        [0, 1, 2].forEach(function (index) {
          var outputY = 254 + index * 118;
          ctx.strokeStyle = index === 1 ? gold : "rgba(216,189,138,0.62)";
          ctx.lineWidth = index === 1 ? 6 : 4;
          ctx.strokeRect(790, outputY, 252, 82);
          node(838, outputY + 41, 14, index === 1);
          line(868, outputY + 41, 1004, outputY + 41, 4, index === 1 ? 0.7 : 0.38);
        });
      } else if (exhibit.artworkPattern === "backbone") {
        [220, 372, 524].forEach(function (inputY, index) {
          ctx.strokeStyle = "rgba(216,189,138,0.46)";
          ctx.lineWidth = 4;
          ctx.strokeRect(118, inputY - 44, 186, 88);
          node(164, inputY, 15, index === 1);
          line(194, inputY, 304, inputY, 4, 0.42);
          line(304, inputY, 416, 372, 4, 0.42);
        });

        glow(610, 372, 160, 0.22);
        line(416, 372, 914, 372, 16, 0.78);
        [490, 610, 730, 850].forEach(function (backboneX, index) {
          node(backboneX, 372, index === 1 ? 25 : 17, index === 1);
        });
        [250, 494].forEach(function (teamY, rowIndex) {
          [810, 936, 1062].forEach(function (teamX, columnIndex) {
            line(850, 372, teamX, teamY, 3, 0.34);
            ctx.fillStyle = "rgba(216,189,138," + (0.16 + (rowIndex + columnIndex) * 0.04) + ")";
            ctx.fillRect(teamX - 34, teamY - 30, 68, 60);
            ctx.strokeStyle = columnIndex === 1 ? gold : tan;
            ctx.lineWidth = columnIndex === 1 ? 4 : 2;
            ctx.strokeRect(teamX - 34, teamY - 30, 68, 60);
          });
        });
      } else if (exhibit.artworkPattern === "alignment") {
        var perspectives = [[132, 188], [132, 310], [132, 434], [132, 556]];
        perspectives.forEach(function (point, index) {
          polyline([point, [330, 238 + index * 88], [548, 372]], 4, 0.34 + index * 0.04);
          node(point[0], point[1], 18, false);
        });

        glow(584, 372, 160, 0.28);
        ctx.save();
        ctx.translate(584, 372);
        ctx.rotate(Math.PI / 4);
        ctx.fillStyle = "rgba(255,227,166,0.1)";
        ctx.strokeStyle = gold;
        ctx.lineWidth = 7;
        ctx.fillRect(-62, -62, 124, 124);
        ctx.strokeRect(-62, -62, 124, 124);
        ctx.restore();
        node(584, 372, 24, true);

        [246, 330, 414, 498].forEach(function (laneY, index) {
          line(646, 372, 754, laneY, 4, 0.42);
          line(754, laneY, 1040, laneY, 7, 0.66);
          node(816, laneY, 15, index === 1);
          node(1040, laneY, 20, true);
        });
        line(1074, 206, 1074, 538, 4, 0.42);
      } else if (exhibit.artworkPattern === "frontier") {
        node(126, 372, 22, true);
        [[332, 214], [332, 318], [332, 426], [332, 530]].forEach(function (point, index) {
          line(148, 372, point[0], point[1], 4, 0.36);
          node(point[0], point[1], 17, false);
          line(point[0] + 17, point[1], 572, 300 + index * 48, 4, 0.38);
        });

        ctx.save();
        ctx.setLineDash([18, 14]);
        line(642, 142, 642, 596, 6, 0.52);
        ctx.restore();
        ctx.fillStyle = "rgba(255,227,166,0.11)";
        ctx.fillRect(588, 306, 108, 132);
        ctx.strokeStyle = gold;
        ctx.lineWidth = 6;
        ctx.strokeRect(588, 306, 108, 132);
        glow(642, 372, 132, 0.32);
        node(642, 372, 25, true);

        line(696, 372, 1040, 372, 9, 0.82);
        arrowHead(1040, 372, 0, 25);
        [86, 150, 222].forEach(function (radius, index) {
          ctx.strokeStyle = "rgba(255,227,166," + (0.58 - index * 0.14) + ")";
          ctx.lineWidth = index === 0 ? 6 : 3;
          ctx.beginPath();
          ctx.arc(1040, 372, radius, Math.PI * 0.62, Math.PI * 1.38);
          ctx.stroke();
        });
        node(1040, 372, 28, true);
      }

      ctx.fillStyle = gold;
      ctx.font = "700 28px Space Mono, monospace";
      ctx.fillText("WORK WITH JOE / " + exhibit.artworkCode, 92, 118);
      ctx.fillStyle = "rgba(239,227,202,0.58)";
      ctx.font = "500 22px Space Mono, monospace";
      ctx.fillText("START WITH THE CHANGE", 92, 648);

      var texture = new THREE.CanvasTexture(c);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
      return texture;
    }

    function makeLabelTexture(exhibit, index) {
      var c = document.createElement("canvas");
      c.width = 1024;
      c.height = 512;
      var ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(3,3,2,0.96)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(216,189,138,0.42)";
      ctx.lineWidth = 2;
      ctx.strokeRect(28, 28, c.width - 56, c.height - 56);
      ctx.fillStyle = "#ffe3a6";
      ctx.font = "700 26px Space Mono, monospace";
      ctx.fillText(exhibit.staticKicker
        || (exhibit.staticStat
          ? "LIVE SYSTEM"
          : exhibit.offerPath
            ? exhibit.offerPath.toUpperCase()
            : "PURPOSE"), 56, 78);
      var repositoryState = repositoryPowerStateFor(exhibit);
      if (repositoryState) {
        var stateSpec = repositoryStateSpec(repositoryState);
        ctx.save();
        ctx.fillStyle = stateSpec.cssColor;
        ctx.font = "700 20px Space Mono, monospace";
        ctx.textAlign = "right";
        ctx.fillText(stateSpec.label, 950, 78);
        var stateLabelWidth = ctx.measureText(stateSpec.label).width;
        var meterX = 950 - stateLabelWidth - 70;
        [12, 21, 30, 18].forEach(function (barHeight, barIndex) {
          ctx.fillRect(meterX + barIndex * 12, 80 - barHeight, 6, barHeight);
        });
        ctx.restore();
      }
      ctx.fillStyle = "#fff8e8";
      var labelTitle = exhibit.offerPath
        ? exhibit.offerNumber + " / " + exhibit.staticTitle
        : exhibit.staticTitle || exhibit.title;
      var titleSize = exhibit.displayType === "product"
        ? (labelTitle.length > 48 ? 40 : labelTitle.length > 38 ? 44 : 48)
        : 58;
      var titleLineHeight = exhibit.displayType === "product" ? titleSize + 5 : 62;
      ctx.font = "800 " + titleSize + "px Space Grotesk, sans-serif";
      wrapText(ctx, labelTitle, 56, 150, 900, titleLineHeight, exhibit.displayType === "product" ? 3 : 2);
      if (exhibit.staticStat) {
        ctx.fillStyle = "#ffe3a6";
        ctx.font = "800 92px Space Mono, monospace";
        ctx.fillText(exhibit.staticStat.value, 56, 354);
        ctx.fillStyle = "rgba(239,227,202,0.82)";
        ctx.font = "700 40px Space Grotesk, sans-serif";
        ctx.fillText(exhibit.staticStat.label.toUpperCase(), 56, 408);
        if (exhibit.staticStat.supportingLabel) {
          ctx.fillStyle = "rgba(239,227,202,0.66)";
          ctx.font = "600 25px Space Grotesk, sans-serif";
          ctx.fillText(exhibit.staticStat.supportingLabel, 56, 452);
        }
      } else {
        ctx.fillStyle = "rgba(239,227,202,0.86)";
        var purposeLength = exhibit.purpose.length;
        var purposeSize = purposeLength > 210 ? 29 : purposeLength > 165 ? 31 : purposeLength > 120 ? 33 : 35;
        var purposeLineHeight = purposeLength > 210 ? 34 : purposeLength > 165 ? 36 : purposeLength > 120 ? 38 : 40;
        ctx.font = "600 " + purposeSize + "px Space Grotesk, sans-serif";
        wrapText(ctx, exhibit.purpose, 56, exhibit.displayType === "product" ? 302 : 310, 860, purposeLineHeight, 5);
      }
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makeElevatorPlacardTexture() {
      var c = document.createElement("canvas");
      c.width = 900;
      c.height = 520;
      var ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(3,3,2,0.97)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(255,227,166,0.62)";
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, c.width - 60, c.height - 60);
      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 94px Space Grotesk, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Who is Joe?", c.width / 2, c.height / 2);
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makeContactButtonLabelTexture(label) {
      var c = document.createElement("canvas");
      c.width = 1200;
      c.height = 360;
      var ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(3,3,2,0.98)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(255,227,166,0.72)";
      ctx.lineWidth = 5;
      ctx.strokeRect(28, 28, c.width - 56, c.height - 56);
      ctx.strokeStyle = "rgba(216,189,138,0.28)";
      ctx.lineWidth = 2;
      ctx.strokeRect(48, 48, c.width - 96, c.height - 96);
      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 82px Space Grotesk, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(255,227,166,0.46)";
      ctx.shadowBlur = 22;
      ctx.shadowOffsetX = 8;
      ctx.shadowOffsetY = 10;
      ctx.fillText(label || "DON'T PRESS THIS BUTTON", c.width / 2, c.height / 2);
      ctx.shadowColor = "transparent";
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makeElevatorIndicatorTexture(primary, secondary) {
      var c = document.createElement("canvas");
      c.width = 900;
      c.height = 440;
      var ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(3,3,2,0.98)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(255,227,166,0.56)";
      ctx.lineWidth = 4;
      ctx.strokeRect(24, 24, c.width - 48, c.height - 48);
      ctx.fillStyle = "#ffe3a6";
      ctx.font = "800 178px Space Mono, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(primary, c.width / 2, 190);
      ctx.fillStyle = "rgba(239,227,202,0.76)";
      ctx.font = "700 38px Space Mono, monospace";
      ctx.fillText(secondary, c.width / 2, 342);
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function setElevatorIndicator(primary, secondary) {
      var oldTextures = [];
      var texture = makeElevatorIndicatorTexture(primary, secondary);
      elevator.indicatorMaterials.forEach(function (material) {
        if (material.map && oldTextures.indexOf(material.map) === -1) oldTextures.push(material.map);
        material.map = texture;
        material.needsUpdate = true;
      });
      oldTextures.forEach(function (oldTexture) {
        oldTexture.dispose();
      });
    }

    function makePortalTexture(options) {
      var c = document.createElement("canvas");
      c.width = 1200;
      c.height = 360;
      var ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(3,3,2,0.92)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(255,227,166,0.54)";
      ctx.lineWidth = 3;
      ctx.strokeRect(28, 28, c.width - 56, c.height - 56);
      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 74px Space Grotesk, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(options.title, c.width / 2, c.height / 2);
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makeGraveyardMarkerTexture(index) {
      var c = document.createElement("canvas");
      c.width = 640;
      c.height = 390;
      var ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(3,3,2,0.9)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(216,189,138,0.58)";
      ctx.lineWidth = 4;
      ctx.strokeRect(18, 18, c.width - 36, c.height - 36);
      ctx.fillStyle = "rgba(216,189,138,0.82)";
      ctx.font = "700 34px Space Mono, monospace";
      ctx.textAlign = "center";
      ctx.fillText("PLOT " + String(index + 1).padStart(2, "0"), c.width / 2, 82);
      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 66px Space Grotesk, sans-serif";
      ctx.fillText("RESERVED", c.width / 2, 194);
      ctx.fillStyle = "rgba(239,227,202,0.72)";
      ctx.font = "600 29px Space Grotesk, sans-serif";
      ctx.fillText("FOR RETIRED WORK", c.width / 2, 268);
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makeWelcomeWallTexture() {
      var c = document.createElement("canvas");
      c.width = 1200;
      c.height = 920;
      var ctx = c.getContext("2d");
      ctx.clearRect(0, 0, c.width, c.height);

      ctx.fillStyle = "rgba(3,3,2,0.82)";
      ctx.fillRect(75, 42, 1050, 834);
      ctx.strokeStyle = "rgba(216,189,138,0.24)";
      ctx.lineWidth = 2;
      ctx.strokeRect(75, 42, 1050, 834);

      ctx.fillStyle = "#ffe3a6";
      ctx.font = "700 34px Space Mono, monospace";
      ctx.fillText("WELCOME", 115, 106);

      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 58px Space Grotesk, sans-serif";
      ctx.shadowColor = "rgba(255,227,166,0.24)";
      ctx.shadowBlur = 18;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 5;
      ctx.fillText("This is where I think in public.", 115, 178);
      ctx.shadowColor = "transparent";

      ctx.fillStyle = "rgba(239,227,202,0.72)";
      ctx.font = "400 27px Space Grotesk, sans-serif";
      wrapText(
        ctx,
        "Most displays here represent real GitHub repositories where my agent fleet is actively doing the work. If a repository is public, walk closer to open it and see what's happening.",
        115,
        252,
        970,
        40,
        5
      );
      wrapText(
        ctx,
        "Together, they hold my consulting methods, research, software, experiments, and systems, all grown from the same curiosity:",
        115,
        396,
        970,
        40,
        4
      );

      ctx.fillStyle = "#ffe3a6";
      ctx.font = "700 38px Space Grotesk, sans-serif";
      wrapText(
        ctx,
        "How can we think better together?",
        115,
        530,
        970,
        48,
        2
      );

      ctx.fillStyle = "rgba(239,227,202,0.72)";
      ctx.font = "400 26px Space Grotesk, sans-serif";
      wrapText(
        ctx,
        "You don't need to follow a particular path. Wander. Open doors. Follow what interests you.",
        115,
        635,
        970,
        40,
        3
      );
      wrapText(
        ctx,
        "If something sparks an idea, you've already started using the space the way it was designed.",
        115,
        742,
        970,
        40,
        3
      );

      ctx.fillStyle = "rgba(239,227,202,0.5)";
      ctx.font = "500 16px Space Mono, monospace";
      ctx.fillText("If you're interested in working with me, just turn around.", 115, 842);

      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makeDecisionTexture() {
      var c = document.createElement("canvas");
      c.width = 1500;
      c.height = 1024;
      var ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(3,3,2,0.94)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(255,227,166,0.54)";
      ctx.lineWidth = 3;
      ctx.strokeRect(34, 34, c.width - 68, c.height - 68);
      ctx.strokeStyle = "rgba(216,189,138,0.3)";
      ctx.beginPath();
      ctx.moveTo(750, 90);
      ctx.lineTo(750, 934);
      ctx.stroke();

      ctx.fillStyle = "#ffe3a6";
      ctx.font = "700 66px Space Mono, monospace";
      ctx.fillText("←", 92, 166);
      ctx.fillText("→", 802, 166);

      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 68px Space Grotesk, sans-serif";
      wrapText(ctx, "Capability Acceleration", 92, 270, 560, 76, 2);
      wrapText(ctx, "Enablement Architecture", 802, 270, 600, 76, 2);

      ctx.fillStyle = "rgba(239,227,202,0.8)";
      ctx.font = "600 35px Space Grotesk, sans-serif";
      wrapText(ctx, "Helps a team use AI to solve harder problems, think more sharply, and execute faster.", 92, 500, 560, 50, 5);
      wrapText(ctx, "Helps an organization create scalable AI adoption, governance, capability, and evidence of value.", 802, 500, 600, 50, 5);

      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makeTableLabelTexture() {
      var c = document.createElement("canvas");
      c.width = 1024;
      c.height = 256;
      var ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(3,3,2,0.86)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(255,227,166,0.48)";
      ctx.lineWidth = 2;
      ctx.strokeRect(28, 28, c.width - 56, c.height - 56);
      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 38px Space Grotesk, sans-serif";
      wrapText(ctx, "Start here: walk the room, step close to a display, then follow the hallway into the Church of AI research chapel.", 56, 82, 900, 42, 4);
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makeChurchSignTexture() {
      var c = document.createElement("canvas");
      c.width = 1200;
      c.height = 280;
      var ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(3,3,2,0.9)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(255,227,166,0.54)";
      ctx.lineWidth = 3;
      ctx.strokeRect(32, 32, c.width - 64, c.height - 64);
      ctx.strokeStyle = "rgba(216,189,138,0.28)";
      ctx.beginPath();
      ctx.moveTo(92, 220);
      ctx.lineTo(92, 128);
      ctx.quadraticCurveTo(92, 64, 158, 64);
      ctx.quadraticCurveTo(224, 64, 224, 128);
      ctx.lineTo(224, 220);
      ctx.stroke();
      ctx.fillStyle = "#ffe3a6";
      ctx.font = "700 34px Space Mono, monospace";
      ctx.fillText("KEEP WALKING", 292, 94);
      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 70px Space Grotesk, sans-serif";
      ctx.fillText("Enter Church of AI", 292, 180);
      ctx.fillStyle = "rgba(239,227,202,0.72)";
      ctx.font = "600 26px Space Grotesk, sans-serif";
      ctx.fillText("Public threshold, useful curiosity, unfinished work held visibly.", 292, 224);
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makeChurchReturnSignTexture() {
      var c = document.createElement("canvas");
      c.width = 1200;
      c.height = 280;
      var ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(3,3,2,0.9)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(255,227,166,0.54)";
      ctx.lineWidth = 3;
      ctx.strokeRect(32, 32, c.width - 64, c.height - 64);
      ctx.fillStyle = "#ffe3a6";
      ctx.font = "700 30px Space Mono, monospace";
      ctx.textAlign = "center";
      ctx.fillText("RETURN TO", c.width / 2, 94);
      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 70px Space Grotesk, sans-serif";
      ctx.fillText("Orientation Hallway", c.width / 2, 184);
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makeHallwayStatementTexture(statement, index) {
      var c = document.createElement("canvas");
      c.width = 900;
      c.height = 520;
      var ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(3,3,2,0.92)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(216,189,138,0.38)";
      ctx.lineWidth = 2;
      ctx.strokeRect(28, 28, c.width - 56, c.height - 56);
      ctx.fillStyle = "#ffe3a6";
      ctx.font = "700 25px Space Mono, monospace";
      var kicker = (statement.kicker || "The Loop").toUpperCase();
      ctx.fillText(kicker, 62, 86);
      var kickerWidth = ctx.measureText(kicker).width;
      ctx.strokeStyle = "rgba(255,227,166,0.34)";
      ctx.beginPath();
      ctx.moveTo(62, 114);
      ctx.lineTo(62 + kickerWidth, 114);
      ctx.moveTo(680, 398);
      ctx.lineTo(838, 398);
      ctx.stroke();
      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 72px Space Grotesk, sans-serif";
      ctx.fillText(statement.label, 62, 186);
      ctx.fillStyle = "rgba(239,227,202,0.82)";
      ctx.font = "600 32px Space Grotesk, sans-serif";
      wrapText(ctx, statement.body, 62, 278, 760, 42, 4);
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makeOfferPlacardTexture(statement) {
      var c = document.createElement("canvas");
      c.width = 1600;
      c.height = 384;
      var ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(3,3,2,0.96)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(255,227,166,0.5)";
      ctx.lineWidth = 3;
      ctx.strokeRect(24, 24, c.width - 48, c.height - 48);

      ctx.fillStyle = "#ffe3a6";
      ctx.font = "700 30px Space Mono, monospace";
      ctx.fillText(statement.kicker.toUpperCase(), 58, 66);

      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 52px Space Grotesk, sans-serif";
      ctx.fillText(statement.label, 58, 130);

      ctx.fillStyle = "rgba(239,227,202,0.84)";
      var bodySize = statement.body.length > 230 ? 27 : 29;
      ctx.font = "600 " + bodySize + "px Space Grotesk, sans-serif";
      wrapText(ctx, statement.body, 58, 194, 1484, 34, 5);

      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makeCommandCenterTexture() {
      var c = document.createElement("canvas");
      c.width = 1400;
      c.height = 680;
      var ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(3,3,2,0.82)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(216,189,138,0.42)";
      ctx.lineWidth = 2;
      ctx.strokeRect(36, 36, c.width - 72, c.height - 72);
      ctx.strokeStyle = "rgba(255,227,166,0.5)";
      ctx.strokeRect(82, 82, c.width - 164, c.height - 164);

      var nodes = [
        { x: 260, y: 288, r: 48, label: "OS", primary: true },
        { x: 132, y: 160, r: 28, label: "SYS" },
        { x: 372, y: 154, r: 28, label: "DJC" },
        { x: 420, y: 332, r: 28, label: "CAI" },
        { x: 312, y: 474, r: 28, label: "JOE" },
        { x: 126, y: 410, r: 28, label: "Repos" }
      ];
      ctx.strokeStyle = "rgba(216,189,138,0.42)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      nodes.slice(1).forEach(function (node) {
        ctx.moveTo(nodes[0].x, nodes[0].y);
        ctx.lineTo(node.x, node.y);
      });
      ctx.moveTo(132, 160);
      ctx.lineTo(372, 154);
      ctx.moveTo(372, 154);
      ctx.lineTo(420, 332);
      ctx.moveTo(420, 332);
      ctx.lineTo(312, 474);
      ctx.moveTo(312, 474);
      ctx.lineTo(126, 410);
      ctx.stroke();
      nodes.forEach(function (node) {
        ctx.beginPath();
        ctx.fillStyle = node.primary ? "rgba(255,227,166,0.18)" : "rgba(216,189,138,0.12)";
        ctx.strokeStyle = node.primary ? "rgba(255,227,166,0.78)" : "rgba(216,189,138,0.56)";
        ctx.lineWidth = node.primary ? 4 : 2;
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = node.primary ? "#ffe3a6" : "rgba(239,227,202,0.82)";
        ctx.font = node.primary ? "800 28px Space Grotesk, sans-serif" : "700 18px Space Mono, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.label, node.x, node.y);
      });
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";

      ctx.fillStyle = "#ffe3a6";
      ctx.font = "700 34px Space Mono, monospace";
      ctx.fillText("CONTROL ROOM / LIVE SYSTEM MAP", 470, 146);
      var capacityStateSpec = repositoryStateSpec(repositoryActivityStates.CapacityOS);
      ctx.fillStyle = capacityStateSpec.cssColor;
      ctx.font = "700 22px Space Mono, monospace";
      ctx.textAlign = "right";
      ctx.fillText(capacityStateSpec.label, 1280, 146);
      [14, 24, 34, 20].forEach(function (barHeight, barIndex) {
        ctx.fillRect(1030 + barIndex * 14, 148 - barHeight, 7, barHeight);
      });
      ctx.textAlign = "left";
      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 76px Space Grotesk, sans-serif";
      ctx.fillText("CapacityOS", 470, 246);
      ctx.fillStyle = "rgba(239,227,202,0.84)";
      ctx.font = "600 30px Space Grotesk, sans-serif";
      wrapText(ctx, "The coordination engine behind Joe's work: domains, repositories, lanes, agents, automations, evidence, and learning connected without absorbing owner truth.", 470, 322, 760, 40, 4);
      ctx.fillStyle = "#ffe3a6";
      ctx.font = "800 64px Space Mono, monospace";
      ctx.fillText(capacityStaticStat.value, 500, 546);
      ctx.fillStyle = "rgba(239,227,202,0.72)";
      ctx.font = "700 24px Space Mono, monospace";
      ctx.fillText(capacityStaticStat.label.toUpperCase(), 622, 540);
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makeBackWallNeonTexture() {
      var c = document.createElement("canvas");
      c.width = 2400;
      c.height = 1220;
      var ctx = c.getContext("2d");
      ctx.clearRect(0, 0, c.width, c.height);

      ctx.save();
      ctx.translate(1200, 612);
      ctx.rotate(-0.13);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      drawNeonLine(ctx, "142px 'Segoe Script', 'Brush Script MT', 'Snell Roundhand', cursive", "Thinking better", 0, -172, 1);
      drawNeonLine(ctx, "142px 'Segoe Script', 'Brush Script MT', 'Snell Roundhand', cursive", "together", 0, -8, 1);
      drawNeonLine(ctx, "122px 'Segoe Script', 'Brush Script MT', 'Snell Roundhand', cursive", "in an age of humans and AI", 0, 152, 1);
      ctx.restore();

      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makeWorkOfferNeonTexture(text, prominence) {
      var visualScale = prominence || 1;
      var c = document.createElement("canvas");
      c.width = 1800;
      c.height = visualScale > 1 ? 420 : 320;
      var ctx = c.getContext("2d");
      ctx.clearRect(0, 0, c.width, c.height);

      ctx.save();
      ctx.translate(c.width / 2, c.height / 2);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      drawNeonLine(
        ctx,
        Math.round(148 * visualScale) + "px 'Segoe Script', 'Brush Script MT', 'Snell Roundhand', cursive",
        text,
        0,
        0,
        0.82 * Math.min(visualScale, 1.2)
      );
      ctx.restore();

      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makeWorkActivationGuideTexture() {
      var c = document.createElement("canvas");
      c.width = 1600;
      c.height = 1600;
      var ctx = c.getContext("2d");
      var cream = "#fff8e8";
      var gold = "#ffe3a6";

      function roundedRectPath(x, y, width, height, radius) {
        ctx.beginPath();
        ctx.moveTo(x + radius, y);
        ctx.lineTo(x + width - radius, y);
        ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
        ctx.lineTo(x + width, y + height - radius);
        ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
        ctx.lineTo(x + radius, y + height);
        ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
        ctx.lineTo(x, y + radius);
        ctx.quadraticCurveTo(x, y, x + radius, y);
        ctx.closePath();
      }

      function drawPanel(x, y, width, height) {
        var panelGradient = ctx.createLinearGradient(x, y, x + width, y + height);
        panelGradient.addColorStop(0, "rgba(255,227,166,0.075)");
        panelGradient.addColorStop(0.5, "rgba(216,189,138,0.025)");
        panelGradient.addColorStop(1, "rgba(3,3,2,0.18)");
        roundedRectPath(x, y, width, height, 18);
        ctx.fillStyle = panelGradient;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,227,166,0.24)";
        ctx.lineWidth = 2;
        ctx.stroke();
      }

      function drawStage(number, title, x, y, width, height) {
        ctx.save();
        ctx.shadowColor = "rgba(0,0,0,0.42)";
        ctx.shadowBlur = 24;
        ctx.shadowOffsetY = 12;
        roundedRectPath(x, y, width, height, 16);
        ctx.fillStyle = "rgba(10,8,5,0.9)";
        ctx.fill();
        ctx.restore();

        roundedRectPath(x, y, width, height, 16);
        ctx.strokeStyle = "rgba(255,227,166,0.28)";
        ctx.lineWidth = 2;
        ctx.stroke();

        ctx.fillStyle = "rgba(255,227,166,0.1)";
        ctx.fillRect(x, y, 10, height);

        var outsideInset = 32;
        var nodeRadius = 34;
        var numberToTextGap = 36;
        var rightInset = 34;
        var nodeX = x + outsideInset + nodeRadius;
        var nodeY = y + height / 2;
        ctx.beginPath();
        ctx.arc(nodeX, nodeY, nodeRadius, 0, Math.PI * 2);
        ctx.fillStyle = gold;
        ctx.fill();
        ctx.strokeStyle = "rgba(255,248,232,0.72)";
        ctx.lineWidth = 3;
        ctx.stroke();
        ctx.fillStyle = "#171006";
        ctx.font = "800 30px Space Mono, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(number, nodeX, nodeY + 1);
        var titleX = nodeX + nodeRadius + numberToTextGap;
        var titleWidth = x + width - rightInset - titleX;
        ctx.fillStyle = cream;
        ctx.font = "700 42px Space Grotesk, sans-serif";
        ctx.textAlign = "left";
        ctx.textBaseline = "middle";
        var titleLines = wrappedLines(ctx, title, titleWidth, 3);
        var titleLineHeight = 50;
        var titleBlockTop = nodeY - ((titleLines.length - 1) * titleLineHeight) / 2;
        titleLines.forEach(function (line, lineIndex) {
          ctx.fillText(line, titleX, titleBlockTop + lineIndex * titleLineHeight);
        });
        ctx.textBaseline = "alphabetic";

        ctx.strokeStyle = "rgba(255,227,166,0.22)";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x + width - 54, y + 30);
        ctx.lineTo(x + width - 24, y + 30);
        ctx.lineTo(x + width - 24, y + 60);
        ctx.stroke();
      }

      function wrappedLines(context, text, maxWidth, maxLines) {
        var words = text.split(" ");
        var lines = [];
        var line = "";
        words.forEach(function (word) {
          var testLine = line ? line + " " + word : word;
          if (line && context.measureText(testLine).width > maxWidth && lines.length < maxLines - 1) {
            lines.push(line);
            line = word;
          } else {
            line = testLine;
          }
        });
        if (line) lines.push(line);
        return lines;
      }

      var background = ctx.createLinearGradient(0, 0, 1600, 1600);
      background.addColorStop(0, "#090704");
      background.addColorStop(0.48, "#030302");
      background.addColorStop(1, "#080603");
      ctx.fillStyle = background;
      ctx.fillRect(0, 0, c.width, c.height);

      var signalGlow = ctx.createRadialGradient(1160, 240, 30, 1160, 240, 720);
      signalGlow.addColorStop(0, "rgba(255,227,166,0.12)");
      signalGlow.addColorStop(0.46, "rgba(216,189,138,0.04)");
      signalGlow.addColorStop(1, "rgba(3,3,2,0)");
      ctx.fillStyle = signalGlow;
      ctx.fillRect(0, 0, c.width, c.height);

      ctx.strokeStyle = "rgba(216,189,138,0.055)";
      ctx.lineWidth = 1;
      for (var gridX = 80; gridX < c.width; gridX += 80) {
        ctx.beginPath();
        ctx.moveTo(gridX, 0);
        ctx.lineTo(gridX, c.height);
        ctx.stroke();
      }
      for (var gridY = 80; gridY < c.height; gridY += 80) {
        ctx.beginPath();
        ctx.moveTo(0, gridY);
        ctx.lineTo(c.width, gridY);
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(255,227,166,0.11)";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(900, 38);
      ctx.lineTo(1562, 700);
      ctx.moveTo(1180, 38);
      ctx.lineTo(1562, 420);
      ctx.moveTo(38, 1240);
      ctx.lineTo(360, 1562);
      ctx.stroke();

      ctx.strokeStyle = "rgba(255,227,166,0.72)";
      ctx.lineWidth = 5;
      ctx.strokeRect(32, 32, c.width - 64, c.height - 64);
      ctx.strokeStyle = "rgba(216,189,138,0.28)";
      ctx.lineWidth = 2;
      ctx.strokeRect(60, 60, c.width - 120, c.height - 120);

      ctx.fillStyle = gold;
      ctx.font = "700 56px Space Mono, monospace";
      ctx.fillText("AI ACTIVATION", 92, 142);
      [0, 1, 2, 3, 4].forEach(function (index) {
        ctx.beginPath();
        ctx.arc(1268 + index * 54, 124, index === 2 ? 10 : 7, 0, Math.PI * 2);
        ctx.fillStyle = index < 3 ? gold : "rgba(255,227,166,0.3)";
        ctx.fill();
      });

      ctx.fillStyle = cream;
      ctx.font = "650 54px Space Grotesk, sans-serif";
      wrapText(
        ctx,
        "Joe helps teams through five stages of AI Activation. The first three establish and raise the floor. The last two raise the ceiling.",
        92,
        228,
        1416,
        66,
        3
      );

      ctx.strokeStyle = "rgba(255,227,166,0.32)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(92, 442);
      ctx.lineTo(1508, 442);
      ctx.stroke();
      ctx.fillStyle = gold;
      ctx.fillRect(92, 434, 198, 11);

      drawPanel(72, 492, 716, 1018);
      drawPanel(812, 492, 716, 1018);

      ctx.fillStyle = "rgba(255,227,166,0.1)";
      ctx.fillRect(72, 492, 716, 112);
      ctx.fillRect(812, 492, 716, 112);
      ctx.fillStyle = gold;
      ctx.font = "700 40px Space Mono, monospace";
      ctx.fillText("RAISE THE FLOOR", 112, 562);
      ctx.fillText("RAISE THE CEILING", 852, 562);

      ctx.strokeStyle = "rgba(255,227,166,0.26)";
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(160, 675);
      ctx.lineTo(160, 1402);
      ctx.moveTo(900, 675);
      ctx.lineTo(900, 1268);
      ctx.stroke();

      drawStage("01", "Understand where you are", 106, 630, 648, 200);
      drawStage("02", "Build reliable AI ways of working", 106, 880, 648, 242);
      drawStage("03", "Connect what works and scale it", 106, 1172, 648, 242);
      drawStage("04", "Help leaders guide AI-enabled change", 846, 650, 648, 270);
      drawStage("05", "Push high-value work further", 846, 1012, 648, 244);

      ctx.strokeStyle = "rgba(255,227,166,0.42)";
      ctx.lineWidth = 4;
      ctx.beginPath();
      ctx.moveTo(1422, 1365);
      ctx.lineTo(1480, 1365);
      ctx.lineTo(1480, 1307);
      ctx.stroke();

      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makeNeonFloorGlowTexture() {
      var c = document.createElement("canvas");
      c.width = 1200;
      c.height = 300;
      var ctx = c.getContext("2d");
      var gradient = ctx.createRadialGradient(600, 150, 10, 600, 150, 560);
      gradient.addColorStop(0, "rgba(255, 225, 170, 0.32)");
      gradient.addColorStop(0.32, "rgba(255, 196, 118, 0.16)");
      gradient.addColorStop(1, "rgba(255, 196, 118, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, c.width, c.height);
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function drawNeonLine(ctx, font, text, x, y, emphasis) {
      var scale = emphasis || 1;
      ctx.font = font;

      [
        [1, 1, "rgba(150, 100, 45, .55)"],
        [2, 2, "rgba(120, 80, 34, .5)"],
        [3, 3, "rgba(92, 60, 24, .46)"],
        [4, 5, "rgba(64, 42, 16, .42)"],
        [5, 7, "rgba(40, 26, 10, .4)"]
      ].forEach(function (layer) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = layer[2];
        ctx.fillText(text, x + layer[0] * scale, y + layer[1] * scale);
      });

      [
        [7, "rgba(255, 232, 185, .95)"],
        [16, "rgba(255, 210, 145, .72)"],
        [34, "rgba(255, 190, 115, .52)"],
        [66, "rgba(255, 190, 115, .32)"]
      ].forEach(function (layer) {
        ctx.shadowColor = layer[1];
        ctx.shadowBlur = layer[0] * scale;
        ctx.fillStyle = "#fff8e8";
        ctx.fillText(text, x, y);
      });

      ctx.shadowBlur = 0;
      ctx.fillStyle = "#fff8e8";
      ctx.fillText(text, x, y);
    }

    function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
      var words = text.split(" ");
      var line = "";
      var lines = 0;
      for (var n = 0; n < words.length; n += 1) {
        var test = line + words[n] + " ";
        if (ctx.measureText(test).width > maxWidth && n > 0) {
          ctx.fillText(line.trim(), x, y);
          line = words[n] + " ";
          y += lineHeight;
          lines += 1;
          if (lines >= maxLines) return;
        } else {
          line = test;
        }
      }
      ctx.fillText(line.trim(), x, y);
    }

    function requestRender() {
      if (isMobile || document.hidden || renderRequestId) return;
      if (idleVisualTimer) {
        window.clearTimeout(idleVisualTimer);
        idleVisualTimer = 0;
      }
      renderRequestId = window.requestAnimationFrame(animate);
    }

    function suspendRendering() {
      keys = {};
      setDatasetValue("motion", "0,0");
      if (renderRequestId) {
        window.cancelAnimationFrame(renderRequestId);
        renderRequestId = 0;
      }
      if (idleVisualTimer) {
        window.clearTimeout(idleVisualTimer);
        idleVisualTimer = 0;
      }
      setRenderState(isMobile ? "mobile-suspended" : "hidden");
    }

    function setRenderState(value) {
      setDatasetValue("renderState", value);
    }

    function setDatasetValue(key, value) {
      if (root.dataset[key] !== value) root.dataset[key] = value;
    }

    function hasMovementInput() {
      return Boolean(
        keys.ArrowUp || keys.arrowup || keys.ArrowDown || keys.arrowdown
        || keys.ArrowLeft || keys.arrowleft || keys.ArrowRight || keys.arrowright
      );
    }

    function isElevatorAnimating() {
      return [
        "idle",
        "idle-waiting",
        "source-open",
        "destination-open",
        "destination-open-return",
        "source-open-return"
      ].indexOf(elevator.state) === -1;
    }

    function isNearAgentActiveRepository() {
      for (var index = 0; index < agentActiveRepositoryAnchors.length; index += 1) {
        agentActiveRepositoryAnchors[index].getWorldPosition(repositoryPowerProbe);
        var dx = camera.position.x - repositoryPowerProbe.x;
        var dz = camera.position.z - repositoryPowerProbe.z;
        if (dx * dx + dz * dz <= 324) return true;
      }
      return false;
    }

    function isNearBackWallNeon() {
      var dx = camera.position.x;
      var dz = camera.position.z - 6.34;
      return dx * dx + dz * dz <= 576;
    }

    function millisecondsUntilNextNeonChange(now) {
      var cycleLength = 3400;
      var cyclePosition = now % cycleLength;
      var boundaries = [68, 136, 272, 306, 1428, 1479, 2482, 2516, 3026, 3060];
      for (var index = 0; index < boundaries.length; index += 1) {
        if (boundaries[index] > cyclePosition + 1) return boundaries[index] - cyclePosition + 2;
      }
      return cycleLength - cyclePosition + boundaries[0] + 2;
    }

    function scheduleIdleVisualCheck(now) {
      if (isMobile || document.hidden || idleVisualTimer) return;
      var delay = Infinity;
      if (!reducedMotion && isNearAgentActiveRepository()) delay = 90;
      if (isNearBackWallNeon()) delay = Math.min(delay, millisecondsUntilNextNeonChange(now));
      if (!isFinite(delay)) {
        setRenderState("idle");
        return;
      }
      setRenderState("idle-scheduled");
      idleVisualTimer = window.setTimeout(function () {
        idleVisualTimer = 0;
        requestRender();
      }, Math.max(16, delay));
    }

    function syncCameraFacingObjects() {
      if (commandBillboard) {
        commandBillboard.lookAt(camera.position.x, commandBillboard.position.y, camera.position.z);
      }
      graveyardTombstones.forEach(function (tombstone) {
        tombstone.lookAt(camera.position.x, tombstone.position.y, camera.position.z);
      });
    }

    function syncDiagnostics() {
      setDatasetValue("camera", camera.position.x.toFixed(2) + "," + camera.position.z.toFixed(2));
      setDatasetValue("look", yaw.toFixed(3) + "," + pitch.toFixed(3));
      setDatasetValue("elevatorState", elevator.state);
    }

    function markExperienceReady() {
      if (root.dataset.ready === "true") return;
      root.dataset.ready = "true";
      window.setTimeout(function () {
        root.classList.add("is-loaded");
        window.setTimeout(function () {
          root.classList.add("has-hidden-loader");
        }, 460);
      }, 1200);
    }

    function animate() {
      renderRequestId = 0;
      if (isMobile || document.hidden) {
        suspendRendering();
        return;
      }

      var now = performance.now();
      var dt = Math.min((now - lastFrameTime) / 1000, 0.05);
      lastFrameTime = now;
      var elevatorStateBefore = elevator.state;
      updateElevator(now);
      var elevatorActive = isElevatorAnimating();
      var elevatorChanged = elevatorStateBefore !== elevator.state;
      if (elevatorActive || elevatorChanged) {
        sceneDirty = true;
        cameraDirty = true;
      }

      var cameraChanged = false;
      if (!isMobile && started) {
        cameraChanged = updateMovement(dt);
        if (cameraChanged) cameraDirty = true;
        if (!elevator.movementLocked && cameraDirty) updateProximity();
      }

      if (cameraDirty) syncCameraFacingObjects();
      var neonChanged = updateBackWallNeon(now);
      var repositoryPowerChanged = updateRepositoryPowerState(now);
      var effectsChanged = neonChanged || repositoryPowerChanged;
      syncDiagnostics();

      if (sceneDirty || cameraDirty || effectsChanged) {
        renderer.render(scene, camera);
        markExperienceReady();
      }
      sceneDirty = false;
      cameraDirty = false;

      if ((!elevator.movementLocked && hasMovementInput()) || elevatorActive) {
        setRenderState("active");
        requestRender();
      } else {
        scheduleIdleVisualCheck(now);
      }
    }

    function updateBackWallNeon(now) {
      if (!backWallNeon) return false;
      var cycle = (now % 3400) / 3400;
      var flicker = 1;
      if (cycle >= 0.02 && cycle < 0.04) flicker = 0.5;
      else if (cycle >= 0.08 && cycle < 0.09) flicker = 0.85;
      else if (cycle >= 0.42 && cycle < 0.435) flicker = 0.38;
      else if (cycle >= 0.73 && cycle < 0.74) flicker = 0.92;
      else if (cycle >= 0.89 && cycle < 0.90) flicker = 0.55;
      var lightIntensity = 0.22 + flicker * 0.18;
      if (
        backWallNeon.material.opacity === flicker
        && (!backWallNeonLight || backWallNeonLight.intensity === lightIntensity)
      ) return false;
      backWallNeon.material.opacity = flicker;
      if (backWallNeonLight) backWallNeonLight.intensity = lightIntensity;
      return true;
    }

    function updateRepositoryPowerState(now) {
      var material = repositoryPowerMaterials["agent-active"];
      if (reducedMotion || !material || !isNearAgentActiveRepository()) return false;
      if (now - repositoryPulseLastUpdate < 90) return false;
      repositoryPulseLastUpdate = now;

      var pulse = (Math.sin(now / 620) + 1) / 2;
      material.color.lerpColors(repositoryPulseBaseColor, repositoryPulseActiveColor, pulse);
      material.opacity = 0.58 + pulse * 0.3;
      return true;
    }

    function updateElevator(now) {
      if (!elevator.sourceDoors || !elevator.destinationDoors) return;

      if (elevator.state === "idle") {
        var sourceDx = camera.position.x - elevator.sourceCenter.x;
        var sourceDz = camera.position.z - elevator.sourceCenter.z;
        var sourceDistance = Math.sqrt(sourceDx * sourceDx + sourceDz * sourceDz);
        if (camera.position.x >= elevator.sourceCenter.x && sourceDistance <= 3.6) {
          openWhoIsJoeElevator();
          return;
        }

        var destinationDx = camera.position.x - elevator.destinationCenter.x;
        var destinationDz = camera.position.z - elevator.destinationCenter.z;
        var destinationDistance = Math.sqrt(destinationDx * destinationDx + destinationDz * destinationDz);
        if (camera.position.x <= elevator.destinationCenter.x && destinationDistance <= 3.6) {
          openWhoIsJoeElevatorFromLowerFloor();
          return;
        }
      }

      if (elevator.state === "idle-waiting" && elevator.cooldownSide) {
        var cooldownCenter = elevator.cooldownSide === "source"
          ? elevator.sourceCenter
          : elevator.destinationCenter;
        var cooldownDx = camera.position.x - cooldownCenter.x;
        var cooldownDz = camera.position.z - cooldownCenter.z;
        var cooldownDistance = Math.sqrt(cooldownDx * cooldownDx + cooldownDz * cooldownDz);
        if (cooldownDistance >= 4.0) {
          elevator.state = "idle";
          elevator.cooldownSide = null;
        }
        return;
      }

      var elapsed = now - elevator.phaseStarted;
      var progress;

      if (elevator.state === "source-opening") {
        progress = clamp(elapsed / 900, 0, 1);
        setElevatorDoorProgress(elevator.sourceDoors, easeInOut(progress));
        if (progress >= 1) {
          elevator.state = "source-open";
          setStatus("walk into the elevator");
        }
        return;
      }

      if (elevator.state === "source-open") {
        if (
          camera.position.x < elevator.sourceCenter.x - 1.13
          && camera.position.z > elevator.sourceCenter.z - 1.45
          && camera.position.z < elevator.sourceCenter.z + 1.45
        ) {
          elevator.state = "source-closing";
          elevator.phaseStarted = now;
          elevator.movementLocked = true;
          closeProximity();
          setStatus("doors closing");
        }
        return;
      }

      if (elevator.state === "source-closing") {
        progress = clamp(elapsed / 850, 0, 1);
        setElevatorDoorProgress(elevator.sourceDoors, 1 - easeInOut(progress));
        if (progress >= 1) {
          elevator.state = "descending";
          elevator.phaseStarted = now;
          elevator.transported = false;
          setElevatorIndicator("↓", "DESCENDING");
          setStatus("descending · floor -1");
        }
        return;
      }

      if (elevator.state === "descending") {
        progress = clamp(elapsed / 2200, 0, 1);
        camera.position.y = 1.68 - Math.sin(progress * Math.PI) * 0.12 + Math.sin(progress * 20) * 0.014;

        if (progress >= 0.56 && !elevator.transported) {
          elevator.transported = true;
          camera.position.set(42.55, camera.position.y, elevator.destinationCenter.z);
          yaw = Math.PI / 2;
          pitch = 0;
          camera.rotation.set(pitch, yaw, 0);
          setElevatorIndicator("-1", "LOWER FLOOR");
        }

        if (progress >= 1) {
          camera.position.y = 1.68;
          elevator.state = "destination-opening";
          elevator.phaseStarted = now;
          setStatus("floor -1 · doors opening");
        }
        return;
      }

      if (elevator.state === "destination-opening") {
        progress = clamp(elapsed / 900, 0, 1);
        setElevatorDoorProgress(elevator.destinationDoors, easeInOut(progress));
        if (progress >= 1) {
          elevator.state = "destination-open";
          elevator.movementLocked = false;
          setStatus("floor -1 · arrow keys to move");
        }
        return;
      }

      if (elevator.state === "destination-open") {
        if (
          camera.position.x < elevator.destinationCenter.x - 0.17
          && camera.position.z > elevator.destinationCenter.z - 1.45
          && camera.position.z < elevator.destinationCenter.z + 1.45
        ) {
          elevator.state = "destination-closing-exit";
          elevator.phaseStarted = now;
          setStatus("floor -1 · doors closing");
        }
        return;
      }

      if (elevator.state === "destination-closing-exit") {
        progress = clamp(elapsed / 850, 0, 1);
        setElevatorDoorProgress(elevator.destinationDoors, 1 - easeInOut(progress));
        if (progress >= 1) {
          elevator.state = "idle-waiting";
          elevator.cooldownSide = "destination";
          setElevatorIndicator("-1", "LOWER FLOOR");
          setStatus("floor -1 · arrow keys to move");
        }
        return;
      }

      if (elevator.state === "destination-opening-return") {
        progress = clamp(elapsed / 900, 0, 1);
        setElevatorDoorProgress(elevator.destinationDoors, easeInOut(progress));
        if (progress >= 1) {
          elevator.state = "destination-open-return";
          setStatus("walk into the elevator");
        }
        return;
      }

      if (elevator.state === "destination-open-return") {
        if (
          camera.position.x > elevator.destinationCenter.x + 1.13
          && camera.position.z > elevator.destinationCenter.z - 1.45
          && camera.position.z < elevator.destinationCenter.z + 1.45
        ) {
          elevator.state = "destination-closing-return";
          elevator.phaseStarted = now;
          elevator.movementLocked = true;
          closeProximity();
          setStatus("doors closing");
        }
        return;
      }

      if (elevator.state === "destination-closing-return") {
        progress = clamp(elapsed / 850, 0, 1);
        setElevatorDoorProgress(elevator.destinationDoors, 1 - easeInOut(progress));
        if (progress >= 1) {
          elevator.state = "ascending";
          elevator.phaseStarted = now;
          elevator.transported = false;
          setElevatorIndicator("↑", "ASCENDING");
          setStatus("ascending · ground floor");
        }
        return;
      }

      if (elevator.state === "ascending") {
        progress = clamp(elapsed / 2200, 0, 1);
        camera.position.y = 1.68 - Math.sin(progress * Math.PI) * 0.12 + Math.sin(progress * 20) * 0.014;

        if (progress >= 0.56 && !elevator.transported) {
          elevator.transported = true;
          camera.position.set(elevator.sourceCenter.x - 2.13, camera.position.y, elevator.sourceCenter.z);
          yaw = -Math.PI / 2;
          pitch = 0;
          camera.rotation.set(pitch, yaw, 0);
          setElevatorIndicator("G", "GROUND FLOOR");
        }

        if (progress >= 1) {
          camera.position.y = 1.68;
          elevator.state = "source-opening-return";
          elevator.phaseStarted = now;
          setStatus("ground floor · doors opening");
        }
        return;
      }

      if (elevator.state === "source-opening-return") {
        progress = clamp(elapsed / 900, 0, 1);
        setElevatorDoorProgress(elevator.sourceDoors, easeInOut(progress));
        if (progress >= 1) {
          elevator.state = "source-open-return";
          elevator.movementLocked = false;
          setStatus("ground floor · arrow keys to move");
        }
        return;
      }

      if (elevator.state === "source-open-return") {
        if (
          camera.position.x > elevator.sourceCenter.x + 0.17
          && camera.position.z > elevator.sourceCenter.z - 1.45
          && camera.position.z < elevator.sourceCenter.z + 1.45
        ) {
          elevator.state = "source-closing-exit";
          elevator.phaseStarted = now;
          setStatus("ground floor · doors closing");
        }
        return;
      }

      if (elevator.state === "source-closing-exit") {
        progress = clamp(elapsed / 850, 0, 1);
        setElevatorDoorProgress(elevator.sourceDoors, 1 - easeInOut(progress));
        if (progress >= 1) {
          elevator.state = "idle-waiting";
          elevator.cooldownSide = "source";
          setElevatorIndicator("G", "GROUND FLOOR");
          setStatus("arrow keys to move");
        }
      }
    }

    function openWhoIsJoeElevator() {
      if (elevator.state === "idle") {
        elevator.state = "source-opening";
        elevator.phaseStarted = performance.now();
        elevator.cooldownSide = null;
        dismissInstructions();
        closeProximity();
        setElevatorIndicator("G", "GROUND FLOOR");
        setStatus("opening the elevator");
        sceneDirty = true;
        cameraDirty = true;
        requestRender();
        return;
      }
      if (elevator.state === "source-opening") {
        setStatus("elevator doors opening");
        return;
      }
      if (elevator.state === "source-open") {
        setStatus("walk into the elevator");
      }
    }

    function openWhoIsJoeElevatorFromLowerFloor() {
      if (elevator.state !== "idle") return;
      elevator.state = "destination-opening-return";
      elevator.phaseStarted = performance.now();
      elevator.cooldownSide = null;
      dismissInstructions();
      closeProximity();
      setElevatorIndicator("-1", "LOWER FLOOR");
      setStatus("opening the elevator");
      sceneDirty = true;
      cameraDirty = true;
      requestRender();
    }

    function returnToStartingPosition() {
      setElevatorDoorProgress(elevator.sourceDoors, 0);
      setElevatorDoorProgress(elevator.destinationDoors, 0);
      camera.position.set(entranceView.x, entranceView.y, entranceView.z);
      yaw = entranceView.yaw;
      pitch = 0;
      camera.rotation.set(pitch, yaw, 0);
      elevator.state = "idle";
      elevator.phaseStarted = 0;
      elevator.movementLocked = false;
      elevator.transported = false;
      elevator.cooldownSide = null;
      dismissInstructions();
      closeProximity();
      setElevatorIndicator("G", "GROUND FLOOR");
      setStatus("arrow keys to move");
      sceneDirty = true;
      cameraDirty = true;
      requestRender();
    }

    function setElevatorDoorProgress(doors, progress) {
      if (!doors) return;
      doors.left.position.z = doors.centerZ - doors.panelOffset - doors.travel * progress;
      doors.right.position.z = doors.centerZ + doors.panelOffset + doors.travel * progress;
    }

    function easeInOut(value) {
      return value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2;
    }

    function updateMovement(dt) {
      var speed = (keys.ShiftLeft || keys.ShiftRight) ? 5.2 : 3.25;
      var turnSpeed = 1.7;
      var forward = Number(Boolean(keys.ArrowUp || keys.arrowup)) - Number(Boolean(keys.ArrowDown || keys.arrowdown));
      var turn = Number(Boolean(keys.ArrowLeft || keys.arrowleft)) - Number(Boolean(keys.ArrowRight || keys.arrowright));
      setDatasetValue("motion", forward.toFixed(0) + "," + turn.toFixed(0));

      if (elevator.movementLocked) return false;

      var changed = false;

      if (turn) {
        yaw += turn * turnSpeed * dt;
        camera.rotation.set(pitch, yaw, 0);
        changed = true;
      }

      if (!forward) return changed;

      var sin = Math.sin(yaw);
      var cos = Math.cos(yaw);
      var dx = -forward * sin * speed * dt;
      var dz = forward * cos * speed * dt;
      var next = avoidCentralObject(camera.position.x + dx, camera.position.z - dz);
      next = avoidRoomFixtures(next.x, next.z);
      next = constrainToMuseumPath(next.x, next.z);
      next = applyElevatorBarriers(next);
      if (camera.position.x !== next.x || camera.position.z !== next.z) {
        camera.position.x = next.x;
        camera.position.z = next.z;
        changed = true;
      }
      return changed;
    }

    function applyElevatorBarriers(next) {
      var sourcePassable = elevator.state === "source-open" || elevator.state === "source-open-return";
      var sourceDoorway = next.z > elevator.sourceCenter.z - 1.58 && next.z < elevator.sourceCenter.z + 1.58;
      var sourceThreshold = elevator.sourceCenter.x + 0.14;
      if (!sourcePassable && sourceDoorway && camera.position.x >= sourceThreshold && next.x < sourceThreshold) {
        next.x = sourceThreshold + 0.02;
      }

      var destinationPassable = elevator.state === "destination-open" || elevator.state === "destination-open-return";
      var destinationDoorway = next.z > elevator.destinationCenter.z - 1.58
        && next.z < elevator.destinationCenter.z + 1.58;
      if (!destinationPassable && destinationDoorway && camera.position.x <= 40.18 && next.x > 40.18) {
        next.x = 40.16;
      }

      return next;
    }

    function constrainToMuseumPath(x, z) {
      var closest = null;
      var closestDistance = Infinity;

      for (var index = 0; index < walkableZones.length; index += 1) {
        var zone = walkableZones[index];
        if (x >= zone.xMin && x <= zone.xMax && z >= zone.zMin && z <= zone.zMax) {
          return { x: x, z: z };
        }
        var projectedX = clamp(x, zone.xMin, zone.xMax);
        var projectedZ = clamp(z, zone.zMin, zone.zMax);
        var dx = x - projectedX;
        var dz = z - projectedZ;
        var distance = dx * dx + dz * dz;
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = { x: projectedX, z: projectedZ };
        }
      }

      return closest || { x: x, z: z };
    }

    function avoidCentralObject(x, z) {
      var centerX = centralObject.x + pushingRoomOffset.x;
      var centerZ = centralObject.z + pushingRoomOffset.z;
      var dx = x - centerX;
      var dz = z - centerZ;
      var distance = Math.sqrt(dx * dx + dz * dz);
      if (distance >= centralObject.radius || distance === 0) return { x: x, z: z };
      var scale = centralObject.radius / distance;
      return {
        x: centerX + dx * scale,
        z: centerZ + dz * scale
      };
    }

    function avoidRoomFixtures(x, z) {
      var next = { x: x, z: z };
      roomFixtures.forEach(function (fixture) {
        var dx = next.x - fixture.x;
        var dz = next.z - fixture.z;
        var distance = Math.sqrt(dx * dx + dz * dz);
        if (distance >= fixture.radius) return;
        if (distance === 0) {
          next.x = fixture.x + fixture.radius;
          return;
        }
        var scale = fixture.radius / distance;
        next.x = fixture.x + dx * scale;
        next.z = fixture.z + dz * scale;
      });
      return next;
    }

    function updateProximity() {
      var nearestIndex = -1;
      var nearestDistance = Infinity;
      var world = new THREE.Vector3();

      exhibitAnchors.forEach(function (anchor, index) {
        anchor.getWorldPosition(world);
        var dx = camera.position.x - world.x;
        var dz = camera.position.z - world.z;
        var distance = Math.sqrt(dx * dx + dz * dz);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      var nearestContactDistance = Infinity;
      contactButtonAnchors.forEach(function (anchor) {
        anchor.getWorldPosition(world);
        var contactDx = camera.position.x - world.x;
        var contactDz = camera.position.z - world.z;
        nearestContactDistance = Math.min(
          nearestContactDistance,
          Math.sqrt(contactDx * contactDx + contactDz * contactDz)
        );
      });
      if (nearestContactDistance <= 3.6 && nearestContactDistance <= nearestDistance) {
        root.dataset.nearest = "contact:" + nearestContactDistance.toFixed(2);
        openContactProximity();
        return;
      }

      root.dataset.nearest = nearestIndex + ":" + nearestDistance.toFixed(2);
      var nearestExhibit = nearestIndex >= 0 ? exhibits[nearestIndex] : null;
      var nearestRange = nearestExhibit && nearestExhibit.title === "CapacityOS"
        ? capacityProximityRange
        : (nearestExhibit && nearestExhibit.proximityRange ? nearestExhibit.proximityRange : proximityRange);
      if (nearestIndex >= 0 && nearestDistance <= nearestRange) {
        openProximity(nearestIndex);
      } else {
        closeProximity();
      }
    }

    function openProximity(index) {
      if (currentProximityKey === "exhibit:" + index && proximity && proximity.classList.contains("is-open")) return;
      var exhibit = exhibits[index];
      if (!exhibit) return;
      currentProximityIndex = index;
      currentProximityKey = "exhibit:" + index;
      if (proximity) {
        proximity.classList.remove("is-contact");
        proximity.classList.toggle("is-capacity", exhibit.title === "CapacityOS");
        proximity.classList.toggle("is-product", exhibit.displayType === "product");
      }
      if (proximityKicker) {
        proximityKicker.hidden = Boolean(exhibit.hideDynamicKicker);
        proximityKicker.textContent = exhibit.hideDynamicKicker
          ? ""
          : exhibit.title === "CapacityOS"
            ? "Live system activity / updated daily"
            : exhibit.displayType === "product"
              ? "A way to work with Joe"
              : exhibit.displayType === "experience"
                ? "Interactive problem finder / about 3 minutes"
              : "Passion / Agent capability test";
      }
      if (proximityTitle) proximityTitle.textContent = exhibit.dynamicTitle || exhibit.title;
      if (proximityBody) {
        proximityBody.replaceChildren();
        if (exhibit.dynamicParagraphs) {
          exhibit.dynamicParagraphs.forEach(function (copy) {
            var paragraph = document.createElement("span");
            paragraph.className = "game-dynamic-paragraph";
            paragraph.textContent = copy;
            proximityBody.appendChild(paragraph);
          });
        } else {
          proximityBody.textContent = exhibit.passion;
        }
      }
      if (proximityStats) {
        proximityStats.innerHTML = "";
        if (exhibit.stats) {
          exhibit.stats.forEach(function (stat) {
            var item = document.createElement("span");
            var value = document.createElement("strong");
            var label = document.createElement("em");
            value.textContent = stat.value;
            label.textContent = stat.label;
            item.appendChild(value);
            item.appendChild(label);
            proximityStats.appendChild(item);
          });
          proximityStats.setAttribute("aria-hidden", "false");
        } else {
          proximityStats.setAttribute("aria-hidden", "true");
        }
      }
      if (proximityAction) {
        if (exhibit.action) {
          proximityAction.hidden = false;
          proximityAction.dataset.action = exhibit.action;
          proximityAction.textContent = exhibit.actionLabel || "Enter";
          proximityAction.classList.add("is-open");
        } else {
          proximityAction.hidden = true;
          proximityAction.removeAttribute("data-action");
          proximityAction.classList.remove("is-open");
        }
      }
      if (proximityLink) {
        if (exhibit.link) {
          proximityLink.href = exhibit.link;
          proximityLink.textContent = exhibit.linkLabel || "See this repo on GitHub";
          proximityLink.classList.toggle("is-experience", exhibit.linkStyle === "experience");
          if (exhibit.linkTarget === "_self") {
            proximityLink.removeAttribute("target");
            proximityLink.removeAttribute("rel");
          } else {
            proximityLink.target = "_blank";
            proximityLink.rel = "noreferrer";
          }
          proximityLink.classList.add("is-open");
          proximityLink.removeAttribute("aria-hidden");
        } else {
          proximityLink.href = "#";
          proximityLink.textContent = "See this repo on GitHub";
          proximityLink.classList.remove("is-experience");
          proximityLink.classList.remove("is-open");
          proximityLink.setAttribute("aria-hidden", "true");
        }
      }
      showContactShare(false);
      if (proximity) {
        proximity.classList.add("is-open");
        proximity.setAttribute("aria-hidden", "false");
      }
      setStatus("near " + (exhibit.offerPath || exhibit.title));
    }

    function openContactProximity() {
      if (currentProximityKey === "contact" && proximity && proximity.classList.contains("is-open")) return;
      currentProximityIndex = -1;
      currentProximityKey = "contact";
      if (proximity) {
        proximity.classList.remove("is-capacity");
        proximity.classList.remove("is-product");
        proximity.classList.add("is-contact");
        proximity.classList.add("is-open");
        proximity.setAttribute("aria-hidden", "false");
      }
      if (proximityKicker) proximityKicker.textContent = "";
      if (proximityTitle) proximityTitle.textContent = "";
      if (proximityBody) proximityBody.textContent = "";
      if (proximityStats) {
        proximityStats.innerHTML = "";
        proximityStats.setAttribute("aria-hidden", "true");
      }
      if (proximityLink) {
        proximityLink.href = "#";
        proximityLink.classList.remove("is-experience");
        proximityLink.classList.remove("is-open");
        proximityLink.setAttribute("aria-hidden", "true");
      }
      if (proximityAction) {
        proximityAction.hidden = false;
        proximityAction.dataset.action = "contact-joe";
        proximityAction.textContent = "Contact Joe";
        proximityAction.classList.add("is-open");
      }
      showContactShare(true);
      setStatus("near the button");
    }

    function ensureContactShare() {
      if (contactShare || !proximity || !proximityAction) return contactShare;

      var block = document.createElement("div");
      block.className = "game-share-block";
      block.hidden = true;

      var rack = createShareRack({ variant: "panel" });
      var toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "game-share-toggle";
      toggle.textContent = "Share this with a friend";
      rack.register(toggle);

      block.appendChild(toggle);
      block.appendChild(rack.element);
      proximityAction.insertAdjacentElement("afterend", block);

      contactShare = { block: block, rack: rack };
      return contactShare;
    }

    function showContactShare(visible) {
      var share = visible ? ensureContactShare() : contactShare;
      if (!share) return;
      if (!visible) share.rack.close(false);
      share.block.hidden = !visible;
    }

    function closeProximity() {
      if (currentProximityIndex === -1 && !currentProximityKey && proximity && !proximity.classList.contains("is-open")) return;
      currentProximityIndex = -1;
      currentProximityKey = "";
      if (proximity) {
        proximity.classList.remove("is-open");
        proximity.classList.remove("is-capacity");
        proximity.classList.remove("is-product");
        proximity.classList.remove("is-contact");
        proximity.setAttribute("aria-hidden", "true");
      }
      if (proximityStats) {
        proximityStats.innerHTML = "";
        proximityStats.setAttribute("aria-hidden", "true");
      }
      if (proximityLink) {
        proximityLink.classList.remove("is-experience");
        proximityLink.classList.remove("is-open");
        proximityLink.setAttribute("aria-hidden", "true");
      }
      if (proximityAction) {
        proximityAction.hidden = true;
        proximityAction.removeAttribute("data-action");
        proximityAction.classList.remove("is-open");
      }
      showContactShare(false);
      if (!isMobile) setStatus("arrow keys to move");
    }

    function updatePointerFromEvent(event) {
      if (!event) {
        pointer.set(0, 0);
        return;
      }
      var rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function updateInteractiveCursor(event) {
      if (!started || elevator.movementLocked) {
        canvas.style.cursor = "default";
        return;
      }
      updatePointerFromEvent(event);
      raycaster.setFromCamera(pointer, camera);
      var hits = raycaster.intersectObjects(interactive, false);
      var actionHit = hits.find(function (item) {
        return item.object.userData.action === "open-who-is-joe-elevator"
          || item.object.userData.action === "show-contact-joe";
      });
      var actionRange = actionHit && actionHit.object.userData.action === "show-contact-joe"
        ? 5
        : 7.5;
      canvas.style.cursor = actionHit && actionHit.distance <= actionRange ? "pointer" : "default";
    }

    function pickExhibit(event) {
      if (elevator.movementLocked) return;
      updatePointerFromEvent(event);
      raycaster.setFromCamera(pointer, camera);
      var hits = raycaster.intersectObjects(interactive, false);
      if (!hits.length) {
        setStatus("aim at a wall exhibit or placard");
        return;
      }
      var actionHit = hits.find(function (item) {
        return item.object.userData.action === "open-who-is-joe-elevator";
      });
      if (actionHit) {
        if (actionHit.distance > 7.5) {
          setStatus("walk closer to the elevator");
          return;
        }
        openWhoIsJoeElevator();
        return;
      }
      var contactHit = hits.find(function (item) {
        return item.object.userData.action === "show-contact-joe";
      });
      if (contactHit) {
        if (contactHit.distance > 5) {
          setStatus("walk closer to the button");
          return;
        }
        openContactProximity();
        return;
      }
      var hit = hits.find(function (item) {
        return typeof item.object.userData.exhibitIndex === "number";
      });
      if (!hit) return;
      var hitExhibit = exhibits[hit.object.userData.exhibitIndex];
      var hitRange = hitExhibit && hitExhibit.title === "CapacityOS"
        ? capacityProximityRange
        : (hitExhibit && hitExhibit.proximityRange ? hitExhibit.proximityRange : proximityRange);
      if (hit.distance > hitRange) {
        setStatus("walk closer to inspect");
        return;
      }
      openProximity(hit.object.userData.exhibitIndex);
    }

    function openInspector(index) {
      var exhibit = exhibits[index];
      if (!exhibit) return;
      mobileIndex = index;
      if (inspectorKicker) {
        inspectorKicker.hidden = Boolean(exhibit.hideDynamicKicker);
        inspectorKicker.textContent = exhibit.hideDynamicKicker
          ? ""
          : exhibit.title === "CapacityOS"
            ? "Live system activity / updated daily"
            : exhibit.displayType === "product"
              ? "A way to work with Joe"
              : exhibit.displayType === "experience"
                ? "Interactive problem finder / about 3 minutes"
                : "Passion / Agent capability test";
      }
      if (inspectorTitle) inspectorTitle.textContent = exhibit.dynamicTitle || exhibit.title;
      if (inspectorBody) {
        inspectorBody.replaceChildren();
        if (exhibit.dynamicParagraphs) {
          exhibit.dynamicParagraphs.forEach(function (copy) {
            var paragraph = document.createElement("span");
            paragraph.className = "game-dynamic-paragraph";
            paragraph.textContent = copy;
            inspectorBody.appendChild(paragraph);
          });
        } else {
          inspectorBody.textContent = exhibit.passion;
        }
      }
      if (inspectorLink) {
        if (exhibit.link) {
          inspectorLink.href = exhibit.link;
          inspectorLink.textContent = exhibit.linkLabel || "See this repo on GitHub";
          inspectorLink.classList.toggle("is-experience", exhibit.linkStyle === "experience");
          if (exhibit.linkTarget === "_self") {
            inspectorLink.removeAttribute("target");
            inspectorLink.removeAttribute("rel");
          } else {
            inspectorLink.target = "_blank";
            inspectorLink.rel = "noreferrer";
          }
          inspectorLink.hidden = false;
          inspectorLink.removeAttribute("aria-hidden");
        } else {
          inspectorLink.href = "#";
          inspectorLink.textContent = "See this repo on GitHub";
          inspectorLink.classList.remove("is-experience");
          inspectorLink.hidden = true;
          inspectorLink.setAttribute("aria-hidden", "true");
        }
      }
      if (inspector) {
        inspector.classList.add("is-open");
        inspector.setAttribute("aria-hidden", "false");
      }
      setStatus("inspecting " + (exhibit.offerPath || exhibit.title));
      if (mobileCount) mobileCount.textContent = formatExhibitCount(index);
    }

    function closeInspector() {
      if (!inspector) return;
      inspector.classList.remove("is-open");
      inspector.setAttribute("aria-hidden", "true");
      setStatus(isMobile ? "guided walkthrough" : "arrow keys to move");
    }

    function stepMobileExhibit(direction) {
      if (!visibleExhibitIndexes.length) return;
      var currentPosition = visibleExhibitIndexes.indexOf(mobileIndex);
      if (currentPosition < 0) currentPosition = direction < 0 ? 0 : -1;
      var nextPosition = (currentPosition + direction + visibleExhibitIndexes.length) % visibleExhibitIndexes.length;
      setMobileExhibit(visibleExhibitIndexes[nextPosition]);
    }

    function setMobileExhibit(nextIndex) {
      if (!visibleExhibitIndexes.length) return;
      mobileIndex = visibleExhibitIndexes.indexOf(nextIndex) >= 0 ? nextIndex : visibleExhibitIndexes[0];
      var anchor = exhibitAnchors[mobileIndex];
      if (!anchor) return;
      var world = new THREE.Vector3();
      var facing = new THREE.Vector3(0, 0, 4.35);
      var worldQuaternion = new THREE.Quaternion();
      anchor.getWorldPosition(world);
      anchor.getWorldQuaternion(worldQuaternion);
      facing.applyQuaternion(worldQuaternion);
      var view = world.clone().add(facing);
      view.y = 1.75;
      camera.position.copy(view);
      camera.lookAt(world.x, 2.15, world.z);
      camera.rotation.order = "YXZ";
      yaw = camera.rotation.y;
      pitch = camera.rotation.x;
      if (mobileCount) mobileCount.textContent = formatExhibitCount(mobileIndex);
      if (mobileInspect) mobileInspect.disabled = false;
      setStatus(exhibits[mobileIndex].title);
    }

    function setEntranceView() {
      mobileIndex = -1;
      camera.position.set(entranceView.x, entranceView.y, entranceView.z);
      yaw = entranceView.yaw;
      pitch = 0;
      camera.rotation.set(pitch, yaw, 0);
      if (mobileCount) mobileCount.textContent = "Exhibit";
      if (mobileInspect) mobileInspect.disabled = true;
      setStatus(isMobile ? "guided walkthrough" : "arrow keys to move");
    }

    function formatExhibitCount(index) {
      return "Exhibit";
    }

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }
  }
})();
