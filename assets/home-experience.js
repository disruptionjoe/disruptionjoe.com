(function () {
  "use strict";

  var STORAGE_KEY = "djc-saved-challenges-v1";
  var floorOrder = ["momentum", "decisions", "understanding", "possibilities", "ai"];
  var floors = {
    momentum: {
      number: "01", title: "Better Momentum",
      intro: "Recognize what is slowing important work down, then create a conversation that can get it moving again.",
      exhibits: [
        { id: "projects-keep-stalling", title: "Projects keep stalling.", situation: "An important initiative repeatedly loses movement, even though people agree that it matters.", expanded: ["The project has a plan, an owner, and plenty of meetings. So why isn't it moving?", "I'd get the people involved to identify exactly where progress stops. Then we'd compare their answers.", "We might discover an unresolved decision, conflicting expectations, or a dependency that nobody owns. That's a much better place to start than another round of status updates."] },
        { id: "people-arent-on-board", title: "People aren't getting on board.", situation: "A direction has been announced, but commitment is uneven and resistance keeps reappearing.", expanded: ["Imagine asking everyone who's supposed to support an initiative what concerns them about it, before trying to convince them it's a good idea.", "You might discover that the resistance makes perfect sense. Someone sees a risk, a missing piece, or a consequence that hasn't been considered.", "Getting those perspectives into the conversation can make the plan stronger and give people a real reason to commit."] },
        { id: "busy-limited-progress", title: "Everyone is busy. Progress is limited.", situation: "The calendar is full and the activity is real, but the work that matters is not advancing proportionally.", expanded: ["Here's an interesting exercise: Ask everyone on your team to write down the three activities consuming most of their time. Then ask them which three activities contribute most to your shared goals.", "Put the answers side by side.", "What would your team change if everyone could see the difference between where their effort goes and what actually moves the organization forward?"] },
        { id: "changes-arent-sticking", title: "Changes aren't sticking.", situation: "A new process, strategy, or behavior launches, then the organization drifts back to the old way.", expanded: ["Your team agrees on a new way of working. Six weeks later, everyone's back to doing things the old way.", "I'd want to bring the people doing the work together and walk through what actually happens when they try to follow the new approach.", "The resulting conversation could be very different from the one leadership originally thought it needed to have."] }
      ]
    },
    decisions: {
      number: "02", title: "Better Decisions",
      intro: "Give consequential choices the information, participation, and decision structure they deserve.",
      exhibits: [
        { id: "choose-a-direction", title: "Several directions look promising.", situation: "The organization needs to choose where to focus without pretending uncertainty has disappeared.", expanded: ["Your team has three promising ideas. Everyone has a favorite, and each has a convincing argument.", "I'd start by getting the group to agree on what makes a direction worth pursuing. Then we'd evaluate each option against those criteria, looking at the evidence, the assumptions, and what we'd need to learn.", "The goal isn't to make every option look equally good. It's to make the differences clear enough to choose."] },
        { id: "everything-is-priority", title: "Everything is a priority.", situation: "Competing initiatives all have valid sponsors, but the organization cannot do them all well.", expanded: ["Ask each member of your leadership team to independently rank the organization's five most important priorities.", "Now compare the lists.", "You might be surprised by how different they are, even among people who believe they're aligned.", "I'd use those differences to get the group discussing what really matters, what depends on what, and what they're willing to stop doing to make their top priorities achievable."] },
        { id: "difficult-tradeoffs", title: "The tradeoffs are real and uncomfortable.", situation: "A choice affects different groups differently and there is no cost-free answer.", expanded: ["Imagine a decision that helps one department but creates real costs for another. Everyone understands the options, but nobody wants to own the consequences.", "I'd make those consequences visible and get the affected people into the same conversation. Who benefits? Who absorbs the cost? What could make the decision workable?", "Agreement isn't always possible. But people can understand a decision, influence how it's made, and commit to carrying it out."] },
        { id: "allocate-resources", title: "Resources and ambition don't match.", situation: "People, money, or attention must move, but every current commitment has a reason to stay.", expanded: ["Here's a question I like asking teams: If you had to accomplish your most important goal with half the resources, what would you protect?", "The answers reveal what people believe actually creates value.", "From there, we can examine where time, money, and attention are currently going, and which commitments deserve to be reconsidered.", "It's easier to make difficult resource decisions when the team understands what it's protecting."] }
      ]
    },
    understanding: {
      number: "03", title: "Better Understanding",
      intro: "Build a shared picture strong enough to support the decisions and action that come next.",
      exhibits: [
        { id: "information-no-picture", title: "We have information, but no shared picture.", situation: "Reports and expertise are plentiful, yet people still describe the situation differently.", expanded: ["Your finance team sees one story in the numbers. Operations sees another. Customer-facing teams have their own explanation of what's happening.", "I'd bring those perspectives together and have everyone build a shared picture of the situation. We'd look for where the accounts reinforce each other, where they conflict, and what nobody can yet explain.", "The result could be a much better understanding of the organization than any single report provides."] },
        { id: "competing-explanations", title: "Everyone has a different explanation.", situation: "A persistent problem has several plausible causes and each group sees a different piece.", expanded: ["Ask five people why a project is struggling and you might get five confident answers.", "Rather than debating whose explanation is right, I'd have the group map what they believe is causing the problem and examine the evidence behind each theory.", "That often reveals connections people haven't considered, assumptions nobody has tested, and questions worth investigating before committing to a solution."] },
        { id: "why-isnt-it-working", title: "Something important isn't working.", situation: "Performance is off, but the visible symptom does not reveal where to intervene.", expanded: ["A startup I worked with was considering where to invest more in marketing. Everyone had ideas for attracting new users.", "I suggested we first map what happened to the users we were already attracting. When we compared our assumptions with the actual data, we discovered far more people were dropping off during onboarding than we'd expected.", "We'd been preparing to make a marketing decision without understanding the problem."] },
        { id: "conditions-changing", title: "The conditions keep changing.", situation: "Signals are mixed, the future is uncertain, and old assumptions may no longer hold.", expanded: ["Imagine asking your leadership team to write down the assumptions behind its current strategy.", "Which ones were true six months ago but might not be true today? Which ones are you relying on without recent evidence? And what changes would force you to reconsider your direction?", "A focused conversation can help a team distinguish between a strategy that needs better execution and one that needs to adapt to a different reality."] }
      ]
    },
    possibilities: {
      number: "04", title: "Better Possibilities",
      intro: "Create room for stronger ideas, sharper alternatives, and assumptions worth challenging.",
      exhibits: [
        { id: "same-ideas", title: "We keep circling the same ideas.", situation: "The group wants a new direction, but familiar constraints and voices keep producing familiar answers.", expanded: ["Put the same people in the same room, ask the same question, and you'll probably hear the same suggestions.", "I'd change how ideas enter the conversation. Give everyone a chance to think independently, introduce perspectives the group hasn't considered, and look for combinations nobody has proposed.", "The interesting part comes when someone says, 'I hadn't thought of that.' That's when the conversation starts going somewhere new."] },
        { id: "challenge-direction", title: "A promising direction needs to be challenged.", situation: "The team is excited about an idea but wants to test it before commitment hardens into certainty.", expanded: ["Everyone's excited about the new strategy. The presentation is convincing, the opportunity looks enormous, and nobody wants to be the person who slows things down.", "Before committing, I'd ask the team to imagine it's a year later and the initiative has failed. What went wrong?", "Working backward from that imagined failure can expose weak assumptions, overlooked risks, and changes that would make the strategy stronger."] },
        { id: "need-alternatives", title: "We need real alternatives, not variations.", situation: "The available options are minor versions of the same underlying approach.", expanded: ["Three proposals can look different on paper while making essentially the same bet.", "I'd have the team identify what all the options assume to be true. Then we'd deliberately challenge those assumptions and develop approaches that work in fundamentally different ways.", "Instead of choosing between three versions of the same idea, the group might discover an entirely different direction worth pursuing."] },
        { id: "opportunity-not-concrete", title: "The opportunity is exciting but not concrete.", situation: "People sense potential, but they cannot yet explain where it creates value or what to do next.", expanded: ["'We should build an AI-powered platform.' 'There's a huge opportunity in this market.' 'We could create a whole new business around this.'", "Great. But who exactly benefits, what changes for them, and why would they care?", "I'd get the team to turn the exciting idea into a specific picture of who it's for, what problem it solves, and what we'd need to learn before investing further."] }
      ]
    },
    ai: {
      number: "05", title: "Better AI",
      intro: "Use the existing five-stage framework to find the AI conversation your organization needs now.",
      exhibits: [
        { id: "identify-the-floor", stage: "Identify the Floor", title: "We don't have a plan yet.", situation: "People are experimenting in different directions, opportunities keep appearing, and decisions keep arriving before there is a shared view of where to begin.", expanded: ["Marketing is experimenting with AI. Operations has a few promising ideas. Someone in finance has built something useful, but nobody else knows about it.", "I'd bring people together to compare what's happening, identify opportunities worth pursuing, and agree on where to focus first.", "The goal isn't to produce a grand AI strategy document. It's to make a few informed choices about where AI could create real value."] },
        { id: "establish-the-floor", stage: "Establish the Floor", title: "Results depend on the person.", situation: "The tools are available and training is complete, but recurring work is still handled differently from person to person and results are hard to repeat.", expanded: ["Give five people the same AI tool and the same task. You'll probably get five very different results.", "Rather than prescribing another training course, I'd bring those people together to compare how they approach the work. What does the strongest performer do differently? Where do others struggle? Which practices could everyone benefit from?", "The team can begin developing a shared understanding of what good AI-assisted work actually looks like."] },
        { id: "raise-the-floor", stage: "Raise the Floor", title: "What works doesn't spread.", situation: "A few people and teams get real value, but their methods stay isolated, handoffs break down, and everyone else keeps starting over.", expanded: ["Someone on your team has figured out how to do a two-hour task in twenty minutes. A few colleagues know about it, but six months later everyone else is still doing things the old way.", "I'd want to understand what makes that approach effective and what prevents others from adopting it.", "The answer could change how your organization identifies, evaluates, and spreads useful practices."] },
        { id: "lead-the-change", stage: "Lead the Change", title: "Our AI spending lacks direction.", situation: "AI investments feel like disconnected bets instead of a shared path to measurable business value.", expanded: ["Your organization has approved AI tools, funded pilots, and invested in training. Now leadership wants to know what it's getting for the money.", "I'd get the people responsible for those investments to map what each one is supposed to accomplish, how success would be recognized, and what evidence exists so far.", "That conversation can reveal where to invest more, what needs rethinking, and what isn't worth continuing."] },
        { id: "push-the-frontier", stage: "Push the Frontier", title: "Top performers are hitting limits.", situation: "Experts already get strong AI results, but the work is not moving as quickly or reliably as they know it could.", expanded: ["Your strongest AI users already know the basics. They're building complex workflows, experimenting with agents, and finding ways to get more done.", "But they're also running into problems with reliability, coordination, and work that still requires too much human attention.", "I'd bring those practitioners together to examine their approaches, share what they've learned, and identify which limitations are worth solving next."] }
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
  var experienceMenuOpenButtons = Array.prototype.slice.call(document.querySelectorAll("[data-experience-menu-open]"));
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
  var activeMenuTrigger = experienceMenuOpenButtons[0] || null;

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
    var unit = (reactionExperience && reactionExperience.getAttribute("data-reaction-unit")) || "Voice";
    reactionPosition.textContent = unit + " " + String(next + 1).padStart(2, "0") + " of " + String(count);
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
    exhibitDialog.querySelector("[data-dialog-passage]").innerHTML = exhibit.expanded.map(function (paragraph) {
      return "<p>" + escapeHtml(paragraph) + "</p>";
    }).join("");
    var save = exhibitDialog.querySelector("[data-dialog-save]");
    save.setAttribute("data-save-id", exhibit.id);
    exhibitDialog.querySelector("[data-dialog-talk]").href = contactUrl([exhibit.id], "30-Minute Challenge Investigation: " + exhibit.title);
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
      inquiry.href = contactUrl([], "30-Minute Challenge Investigation");
      return;
    }
    list.innerHTML = saved.map(function (id) {
      var item = findExhibit(id);
      if (!item) return "";
      return '<article><div><span>' + escapeHtml(item.floorTitle) + '</span><strong>' + escapeHtml(item.exhibit.title) + '</strong></div><button type="button" data-remove-id="' + id + '" aria-label="Remove ' + escapeHtml(item.exhibit.title) + '">Remove</button></article>';
    }).join("");
    inquiry.textContent = "Talk with Joe about these";
    inquiry.href = contactUrl(saved, "Challenge Investigation with saved homepage challenges");
  }

  function openCollection() {
    renderCollection();
    if (!collectionDialog.open) collectionDialog.showModal();
  }

  function openExperienceMenu(event) {
    activeMenuTrigger = event && event.currentTarget ? event.currentTarget : activeMenuTrigger;
    syncExploreReturnLinks();
    if (!experienceMenu.open) experienceMenu.showModal();
    window.setTimeout(function () { experienceMenuClose.focus({ preventScroll: true }); }, reducedMotion ? 0 : 160);
  }

  function closeExperienceMenu(restoreFocus) {
    if (!experienceMenu.open) return;
    experienceMenu.close();
    if (restoreFocus !== false && activeMenuTrigger) activeMenuTrigger.focus({ preventScroll: true });
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
