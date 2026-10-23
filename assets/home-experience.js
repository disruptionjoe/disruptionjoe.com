(function () {
  "use strict";

  var STORAGE_KEY = "djc-saved-challenges-v1";
  var floorOrder = ["momentum", "decisions", "understanding", "possibilities", "ai"];
  var floors = {
    momentum: {
      number: "01", title: "Better Momentum",
      intro: "Recognize what is slowing important work down, then create a conversation that can get it moving again.",
      exhibits: [
        { id: "projects-keep-stalling", title: "Projects keep stalling.", situation: "An important initiative repeatedly loses movement, even though people agree that it matters.", read: "A stalled project is not always a project-management problem. The group may be carrying different definitions of the challenge, different priorities, or unresolved decisions that ordinary status meetings never surface.", approach: "Bring the sponsor and the people closest to the work into a focused session that separates symptoms from constraints and makes the real decision points visible.", result: "A clearer shared picture of what is blocking progress and an owned next move." },
        { id: "people-arent-on-board", title: "People aren't getting on board.", situation: "A direction has been announced, but commitment is uneven and resistance keeps reappearing.", read: "The gap may not be a communication failure. People may not understand the reasoning, see their knowledge reflected, or trust how the direction was reached.", approach: "Structure the conversation so relevant concerns and operating realities can be examined without pretending every decision is democratic.", result: "Clearer reasoning, surfaced constraints, and more legitimate commitments." },
        { id: "busy-limited-progress", title: "Everyone is busy. Progress is limited.", situation: "The calendar is full and the activity is real, but the work that matters is not advancing proportionally.", read: "Activity can hide competing priorities, ambiguous ownership, and decisions that no one has actually made.", approach: "Make the work and tradeoffs visible, clarify what must be decided, and identify where attention will have the most leverage.", result: "A smaller set of meaningful priorities with explicit ownership and next actions." },
        { id: "changes-arent-sticking", title: "Changes aren't sticking.", situation: "A new process, strategy, or behavior launches, then the organization drifts back to the old way.", read: "Adoption often breaks when the people doing the work cannot connect the change to reality or when follow-through has no shared structure.", approach: "Use the room to examine what the change asks of people, what the operating environment rewards, and what support or decisions are missing.", result: "A more credible path from announced change to sustained practice." }
      ]
    },
    decisions: {
      number: "02", title: "Better Decisions",
      intro: "Give consequential choices the information, participation, and decision structure they deserve.",
      exhibits: [
        { id: "choose-a-direction", title: "Several directions look promising.", situation: "The organization needs to choose where to focus without pretending uncertainty has disappeared.", read: "The group may be comparing options against different, unstated definitions of success.", approach: "Agree on the decision, surface the criteria and uncertainty, and compare real alternatives in a form the accountable decision-maker can use.", result: "A reasoned direction and a shared understanding of why it was chosen." },
        { id: "everything-is-priority", title: "Everything is a priority.", situation: "Competing initiatives all have valid sponsors, but the organization cannot do them all well.", read: "Prioritization fails when it is treated as ranking preferences instead of making explicit tradeoffs under actual constraints.", approach: "Connect priorities to outcomes, capacity, dependencies, and consequences so the choice becomes concrete.", result: "A defensible set of priorities and clarity about what will not be pursued now." },
        { id: "difficult-tradeoffs", title: "The tradeoffs are real and uncomfortable.", situation: "A choice affects different groups differently and there is no cost-free answer.", read: "Avoiding the tension usually makes the decision less transparent, not less consequential.", approach: "Create a process that names interests and constraints, tests options, and keeps decision authority explicit.", result: "A more useful decision with understandable reasoning, even without universal agreement." },
        { id: "allocate-resources", title: "Resources and ambition don't match.", situation: "People, money, or attention must move, but every current commitment has a reason to stay.", read: "Allocation conversations become political when the connection between resources and intended outcomes remains implicit.", approach: "Put outcomes, evidence, opportunity cost, and ownership into the same conversation.", result: "Investment choices that match the work the organization says matters most." }
      ]
    },
    understanding: {
      number: "03", title: "Better Understanding",
      intro: "Build a shared picture strong enough to support the decisions and action that come next.",
      exhibits: [
        { id: "information-no-picture", title: "We have information, but no shared picture.", situation: "Reports and expertise are plentiful, yet people still describe the situation differently.", read: "More data will not resolve a difference in framing, assumptions, or what each group believes matters.", approach: "Bring the evidence and perspectives into one structured sensemaking process, making agreements and uncertainties visible.", result: "A shared picture of the situation without flattening meaningful differences." },
        { id: "competing-explanations", title: "Everyone has a different explanation.", situation: "A persistent problem has several plausible causes and each group sees a different piece.", read: "The organization can rush into solutions before it has tested the stories it is telling itself.", approach: "Map competing explanations, inspect the evidence behind them, and identify what would distinguish one from another.", result: "A stronger working explanation and clearer next inquiry or intervention." },
        { id: "why-isnt-it-working", title: "Something important isn't working.", situation: "Performance is off, but the visible symptom does not reveal where to intervene.", read: "The cause may sit across handoffs, incentives, decisions, or operating conditions rather than inside one team.", approach: "Trace the experience across boundaries and let the people closest to each part assemble the system together.", result: "A clearer diagnosis owned by the people who can act on it." },
        { id: "conditions-changing", title: "The conditions keep changing.", situation: "Signals are mixed, the future is uncertain, and old assumptions may no longer hold.", read: "The goal is not false certainty. It is a shared understanding of what is known, what is changing, and what deserves attention.", approach: "Sort signals from noise, challenge assumptions, and identify the implications that remain important across plausible futures.", result: "A more resilient picture of the landscape and the next questions to answer." }
      ]
    },
    possibilities: {
      number: "04", title: "Better Possibilities",
      intro: "Create room for stronger ideas, sharper alternatives, and assumptions worth challenging.",
      exhibits: [
        { id: "same-ideas", title: "We keep circling the same ideas.", situation: "The group wants a new direction, but familiar constraints and voices keep producing familiar answers.", read: "Ideation is limited by the material and perspectives the conversation makes available, not just by individual creativity.", approach: "Reframe the challenge, introduce useful differences, and separate generating possibilities from judging them.", result: "A broader and more relevant set of possibilities to examine." },
        { id: "challenge-direction", title: "A promising direction needs to be challenged.", situation: "The team is excited about an idea but wants to test it before commitment hardens into certainty.", read: "Supportive scrutiny can strengthen a direction without turning the room into a debate to win.", approach: "Surface assumptions, invite informed challenge, and ask what evidence or conditions would change the choice.", result: "A stronger direction, a useful pivot, or justified confidence in continuing." },
        { id: "need-alternatives", title: "We need real alternatives, not variations.", situation: "The available options are minor versions of the same underlying approach.", read: "A decision is only as good as the alternatives the group is able to imagine and take seriously.", approach: "Use different frames, constraints, and stakeholder perspectives to produce genuinely distinct paths.", result: "Alternatives that expose meaningful choices rather than cosmetic differences." },
        { id: "opportunity-not-concrete", title: "The opportunity is exciting but not concrete.", situation: "People sense potential, but they cannot yet explain where it creates value or what to do next.", read: "Possibility becomes useful when the group can connect it to a real need, operating context, and testable next move.", approach: "Translate the idea into value, assumptions, affected people, and the smallest informative experiment or decision.", result: "A possibility the organization can responsibly explore, test, or set aside." }
      ]
    },
    ai: {
      number: "05", title: "Better AI",
      intro: "Use the existing five-stage framework to find the AI conversation your organization needs now.",
      exhibits: [
        { id: "identify-the-floor", stage: "Identify the Floor", title: "We don't have a plan yet.", situation: "People are experimenting in different directions, opportunities keep appearing, and decisions keep arriving before there is a shared view of where to begin.", read: "AI adoption starts with people, not prompts. First understand who is already moving, what fears or risks are holding people back, and where the strongest opportunities sit.", approach: "Bring leaders and relevant practitioners together to examine the current landscape, the real work, and the choices in front of the organization.", result: "A clearer starting point for AI priorities, participation, and next moves." },
        { id: "establish-the-floor", stage: "Establish the Floor", title: "Results depend on the person.", situation: "The tools are available and training is complete, but recurring work is still handled differently from person to person and results are hard to repeat.", read: "Confidence leads to consistent capability when people have clear expectations, useful support, and at least one workflow they can practice and improve.", approach: "Use a focused working session to compare practice, expose friction, and define what a reliable AI-enabled workflow requires.", result: "A shared, testable way of working that can improve through use." },
        { id: "raise-the-floor", stage: "Raise the Floor", title: "What works doesn't spread.", situation: "A few people and teams get real value, but their methods stay isolated, handoffs break down, and everyone else keeps starting over.", read: "Capability compounds when proven practices can travel across teams with enough context, standards, support, and feedback.", approach: "Connect the people doing strong work with the leaders and partners needed to make that work legible and portable.", result: "A practical path for sharing what works without forcing every team into identical practice." },
        { id: "lead-the-change", stage: "Lead the Change", title: "Our AI spending lacks direction.", situation: "AI investments feel like disconnected bets instead of a shared path to measurable business value.", read: "Leaders need agreement on the outcomes AI should improve, how priorities will be set, and who owns the decisions.", approach: "Structure the leadership conversation around value, evidence, decision rights, and the conditions for continuing, changing, or stopping investments.", result: "A more coherent AI direction and a clearer basis for investment decisions." },
        { id: "push-the-frontier", stage: "Push the Frontier", title: "Top performers are hitting limits.", situation: "Experts already get strong AI results, but the work is not moving as quickly or reliably as they know it could.", read: "Frontier work needs a different conversation from basic adoption: one about ambitious workflows, evaluation, operating support, and where expert attention has the most leverage.", approach: "Bring the technical and business perspectives together to examine the current limit and choose the next capability worth building or testing.", result: "A focused frontier move grounded in valuable work rather than novelty." }
      ]
    }
  };

  var viewEls = Array.prototype.slice.call(document.querySelectorAll("[data-home-view]"));
  var introSequence = document.querySelector("[data-intro-sequence]");
  var introSteps = Array.prototype.slice.call(document.querySelectorAll("[data-intro-step]"));
  var reactionExperience = document.querySelector("[data-reaction-experience]");
  var reactionStage = document.querySelector("[data-reaction-stage]");
  var reactionVoiceMap = document.querySelector("[data-reaction-voice-map]");
  var reactionSelectors = Array.prototype.slice.call(document.querySelectorAll("[data-reaction-selector]"));
  var reactionPanels = Array.prototype.slice.call(document.querySelectorAll("[data-reaction-panel]"));
  var reactionPosition = document.querySelector("[data-reaction-position]");
  var reactionTheme = document.querySelector("[data-reaction-theme]");
  var exploreStack = document.querySelector("[data-explore-stack]");
  var exploreNavLinks = Array.prototype.slice.call(document.querySelectorAll("[data-floor-nav]"));
  var exhibitDialog = document.querySelector("[data-exhibit-dialog]");
  var collectionDialog = document.querySelector("[data-collection-dialog]");
  var experienceControls = document.querySelector("[data-experience-controls]");
  var experienceMenu = document.querySelector("[data-experience-menu]");
  var experienceMenuOpen = document.querySelector("[data-experience-menu-open]");
  var experienceMenuClose = document.querySelector("[data-experience-menu-close]");
  var exploreReturnLinks = Array.prototype.slice.call(document.querySelectorAll("[data-explore-return]"));
  var live = document.querySelector("[data-home-live]");
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var state = { view: "intro", introStep: 0, floor: "lobby", room: 0, priorHash: "#lobby", routing: false };
  var trackStates = {};
  var introScrollFrame = 0;
  var exploreScrollFrame = 0;
  var introWheelLocked = false;
  var reactionIndex = 0;
  var reactionPointer = null;

  document.documentElement.classList.add("home-js");

  function escapeHtml(value) {
    return String(value).replace(/[&<>\"]/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[character];
    });
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
      return Array.isArray(parsed) ? parsed.filter(function (id) { return typeof id === "string"; }) : [];
    } catch (error) { return []; }
  }

  function writeSaved(ids) {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
      window.localStorage.setItem("djc-saved-challenge-labels-v1", JSON.stringify(ids.map(function (id) {
        var item = findExhibit(id);
        return item ? item.exhibit.title : "";
      }).filter(Boolean)));
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
    if (navigator.vibrate) navigator.vibrate(duration || 5);
  }

  function scrollBehavior() {
    return reducedMotion ? "auto" : "smooth";
  }

  function roomHash(floorId, roomIndex) {
    if (floorId === "lobby") return "#lobby";
    if (!floors[floorId] || roomIndex <= 0) return "#floor/" + floorId;
    return "#floor/" + floorId + "/" + floors[floorId].exhibits[roomIndex - 1].id;
  }

  function replaceHash(hash) {
    if (window.location.hash !== hash) window.history.replaceState(null, "", hash);
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
    reactionPosition.textContent = "Voice " + String(next + 1).padStart(2, "0") + " of " + String(count);
    reactionTheme.textContent = reactionSelectors[next].querySelector("strong").textContent;
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
            (exhibit.stage ? '<p class="exhibit-stage-name">' + escapeHtml(exhibit.stage) + '</p>' : "") +
            '<h3 id="room-' + floorId + '-' + exhibit.id + '">' + escapeHtml(exhibit.title) + '</h3>' +
            '<p>' + escapeHtml(exhibit.situation) + '</p>' +
            '<div class="exhibit-card-actions"><a class="home-action primary" href="#exhibit/' + floorId + '/' + exhibit.id + '">Open the room</a><button class="home-action secondary" type="button" data-save-id="' + exhibit.id + '">Save this challenge</button></div>' +
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
      exploreStack.appendChild(section);

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
      button.textContent = button.hasAttribute("data-dialog-save")
        ? (isSaved ? "Remove from saved" : "Save this challenge")
        : (isSaved ? "Saved" : "Save this challenge");
    });
    var count = saved.length;
    Array.prototype.slice.call(document.querySelectorAll("[data-collection-count]")).forEach(function (element) {
      element.textContent = String(count);
      element.hidden = count === 0;
      element.setAttribute("aria-label", count + (count === 1 ? " saved challenge" : " saved challenges"));
      var trigger = element.closest(".saved-control");
      if (trigger) trigger.setAttribute("aria-label", count ? "Saved challenges, " + count : "Saved challenges");
    });
  }

  function syncExploreReturnLinks() {
    var destination = roomHash(state.floor, state.room);
    exploreReturnLinks.forEach(function (link) { link.href = destination; });
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
    syncExploreReturnLinks();
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
    var resolved = floorId === "lobby" || floors[floorId] ? floorId : "lobby";
    var floorChanged = resolved !== state.floor;
    if (withPulse && floorChanged) pulse(5);
    if (resolved !== "lobby" && floorChanged) {
      setRoom(resolved, 0, false);
      trackStates[resolved].track.scrollTo({ left: 0, behavior: "auto" });
    }
    state.floor = resolved;
    state.room = resolved === "lobby" ? 0 : trackStates[resolved].index;
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
    syncExploreReturnLinks();
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
    var resolved = floorId === "lobby" || floors[floorId] ? floorId : "lobby";
    var level = exploreLevels.filter(function (item) { return item.getAttribute("data-explore-level") === resolved; })[0];
    var roomIndex = 0;
    if (resolved !== "lobby" && exhibitId) {
      var found = floors[resolved].exhibits.findIndex(function (exhibit) { return exhibit.id === exhibitId; });
      roomIndex = found >= 0 ? found + 1 : 0;
    }
    setView("explore");
    setExploreLevel(resolved, false);
    if (resolved !== "lobby") setRoom(resolved, roomIndex, false);
    window.requestAnimationFrame(function () {
      exploreStack.scrollTo({ top: level.offsetTop, behavior: scrollBehavior() });
      if (resolved !== "lobby") scrollRoomTo(resolved, roomIndex, focus);
      else if (focus) window.setTimeout(function () { level.focus({ preventScroll: true }); }, reducedMotion ? 0 : 420);
    });
  }

  function moveIntro(direction) {
    var next = Math.max(0, Math.min(introSteps.length - 1, state.introStep + direction));
    if (next === state.introStep) return;
    setIntroStep(next, true);
    introSequence.scrollTo({ top: introSteps[next].offsetTop, behavior: scrollBehavior() });
  }

  function moveFloor(direction) {
    var order = ["lobby"].concat(floorOrder);
    var currentIndex = Math.max(0, order.indexOf(state.floor));
    var nextIndex = Math.max(0, Math.min(order.length - 1, currentIndex + direction));
    if (nextIndex === currentIndex) return;
    var nextFloor = order[nextIndex];
    var level = exploreLevels[nextIndex];
    setExploreLevel(nextFloor, true);
    exploreStack.scrollTo({ top: level.offsetTop, behavior: scrollBehavior() });
  }

  function moveRoom(direction) {
    if (state.floor === "lobby") return;
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
      announce("Saved “" + item.exhibit.title + "” to your collection.");
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
    exhibitDialog.querySelector("[data-dialog-situation]").textContent = exhibit.situation;
    exhibitDialog.querySelector("[data-dialog-read]").textContent = exhibit.read;
    exhibitDialog.querySelector("[data-dialog-approach]").textContent = exhibit.approach;
    exhibitDialog.querySelector("[data-dialog-result]").textContent = exhibit.result;
    var save = exhibitDialog.querySelector("[data-dialog-save]");
    save.setAttribute("data-save-id", exhibit.id);
    exhibitDialog.querySelector("[data-dialog-talk]").href = contactUrl([exhibit.id], exhibit.title);
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
      list.innerHTML = '<p class="collection-empty">Nothing saved yet. Open any room and save the challenges that sound familiar.</p>';
      inquiry.textContent = "Talk with Joe without a collection";
      inquiry.href = contactUrl([], "Plan a focused conversation");
      return;
    }
    list.innerHTML = saved.map(function (id) {
      var item = findExhibit(id);
      if (!item) return "";
      return '<article><div><span>' + escapeHtml(item.floorTitle) + '</span><strong>' + escapeHtml(item.exhibit.title) + '</strong></div><button type="button" data-remove-id="' + id + '" aria-label="Remove ' + escapeHtml(item.exhibit.title) + '">Remove</button></article>';
    }).join("");
    inquiry.textContent = "Talk with Joe about these";
    inquiry.href = contactUrl(saved, "Saved homepage challenges");
  }

  function openCollection() {
    renderCollection();
    if (!collectionDialog.open) collectionDialog.showModal();
  }

  function openExperienceMenu() {
    syncExploreReturnLinks();
    if (!experienceMenu.open) experienceMenu.showModal();
    window.setTimeout(function () { experienceMenuClose.focus({ preventScroll: true }); }, reducedMotion ? 0 : 160);
  }

  function closeExperienceMenu(restoreFocus) {
    if (!experienceMenu.open) return;
    experienceMenu.close();
    if (restoreFocus !== false) experienceMenuOpen.focus({ preventScroll: true });
  }

  function route(focus) {
    var hash = window.location.hash.replace(/^#/, "") || "threshold";
    var parts = hash.split("/").filter(Boolean);
    state.routing = true;
    closeExhibit(false);
    if (collectionDialog.open) collectionDialog.close();
    closeExperienceMenu(false);

    if (parts[0] === "threshold") scrollIntroTo(0, focus);
    else if (parts[0] === "intro") scrollIntroTo(Number(parts[1] || 1), focus);
    else if (parts[0] === "lobby" || parts[0] === "floors") scrollExploreTo("lobby", null, focus);
    else if (parts[0] === "floor") scrollExploreTo(parts[1], parts[2], focus);
    else if (parts[0] === "exhibit") {
      scrollExploreTo(parts[1], parts[2], false);
      window.setTimeout(function () { openExhibit(parts[1], parts[2]); }, reducedMotion ? 0 : 220);
    } else if (parts[0] === "about-joe" || parts[0] === "meet-joe") {
      setView("meet");
      syncExploreReturnLinks();
      if (focus) {
        var meetHeading = document.querySelector("#about-title");
        meetHeading.setAttribute("tabindex", "-1");
        meetHeading.focus({ preventScroll: true });
      }
    } else if (parts[0] === "collection") {
      if (state.view === "intro") scrollExploreTo("lobby", null, false);
      openCollection();
    } else scrollIntroTo(0, focus);

    window.setTimeout(function () { state.routing = false; }, reducedMotion ? 20 : 620);
  }

  introSequence.addEventListener("scroll", function () {
    if (introScrollFrame) window.cancelAnimationFrame(introScrollFrame);
    introScrollFrame = window.requestAnimationFrame(function () {
      var next = introSteps.reduce(function (closest, step, index) {
        return Math.abs(step.offsetTop - introSequence.scrollTop) < Math.abs(introSteps[closest].offsetTop - introSequence.scrollTop) ? index : closest;
      }, 0);
      setIntroStep(next, next !== state.introStep);
      introScrollFrame = 0;
    });
  }, { passive: true });

  introSequence.addEventListener("wheel", function (event) {
    if (state.view !== "intro" || reducedMotion || Math.abs(event.deltaY) <= Math.abs(event.deltaX) || Math.abs(event.deltaY) < 12) return;
    var currentStep = introSteps[state.introStep];
    if (currentStep.scrollHeight > introSequence.clientHeight + 2) return;
    event.preventDefault();
    if (introWheelLocked) return;
    introWheelLocked = true;
    moveIntro(event.deltaY > 0 ? 1 : -1);
    window.setTimeout(function () { introWheelLocked = false; }, 560);
  }, { passive: false });

  exploreStack.addEventListener("scroll", function () {
    if (exploreScrollFrame) window.cancelAnimationFrame(exploreScrollFrame);
    exploreScrollFrame = window.requestAnimationFrame(function () {
      var next = exploreLevels.reduce(function (closest, level, index) {
        return Math.abs(level.offsetTop - exploreStack.scrollTop) < Math.abs(exploreLevels[closest].offsetTop - exploreStack.scrollTop) ? index : closest;
      }, 0);
      var nextFloor = exploreLevels[next].getAttribute("data-explore-level");
      setExploreLevel(nextFloor, nextFloor !== state.floor);
      updateVerticalDoorOpening();
      exploreScrollFrame = 0;
    });
  }, { passive: true });

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
    if (!event.isPrimary) return;
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
    if (exhibitDialog.open || collectionDialog.open || experienceMenu.open) return;
    var target = event.target;
    if (target && /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName)) return;
    var isInteractive = target && target.closest && target.closest("a, button");

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

  document.querySelector("[data-dialog-close]").addEventListener("click", function () { closeExhibit(true); });
  experienceMenuOpen.addEventListener("click", openExperienceMenu);
  experienceMenuClose.addEventListener("click", function () { closeExperienceMenu(true); });
  experienceMenu.addEventListener("cancel", function (event) {
    event.preventDefault();
    closeExperienceMenu(true);
  });
  experienceMenu.addEventListener("click", function (event) {
    if (event.target === experienceMenu) closeExperienceMenu(true);
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
  window.addEventListener("resize", function () {
    introSequence.scrollTop = introSteps[state.introStep].offsetTop;
    exploreStack.scrollTop = exploreLevels[["lobby"].concat(floorOrder).indexOf(state.floor)].offsetTop;
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
