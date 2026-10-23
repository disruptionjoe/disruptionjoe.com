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
  var floorView = document.querySelector("[data-home-view='floor']");
  var floorRail = document.querySelector("[data-floor-rail]");
  var floorTitle = document.querySelector("[data-floor-title]");
  var floorKicker = document.querySelector("[data-floor-kicker]");
  var floorIntro = document.querySelector("[data-floor-intro]");
  var exhibitStage = document.querySelector("[data-exhibit-stage]");
  var exhibitPosition = document.querySelector("[data-exhibit-position]");
  var exhibitDialog = document.querySelector("[data-exhibit-dialog]");
  var collectionDialog = document.querySelector("[data-collection-dialog]");
  var live = document.querySelector("[data-home-live]");
  var state = { floor: "momentum", exhibit: 0, view: "threshold", priorHash: "#floors" };
  var touchStartX = null;

  document.documentElement.classList.add("home-js");

  function allExhibits() {
    var list = [];
    floorOrder.forEach(function (floorId) {
      floors[floorId].exhibits.forEach(function (exhibit) { list.push({ floorId: floorId, floorTitle: floors[floorId].title, exhibit: exhibit }); });
    });
    return list;
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
    renderCollection();
  }

  function findExhibit(id) { return allExhibits().filter(function (item) { return item.exhibit.id === id; })[0] || null; }
  function announce(message) { if (live) { live.textContent = ""; window.setTimeout(function () { live.textContent = message; }, 20); } }
  function updateCounts() {
    var count = readSaved().length;
    Array.prototype.slice.call(document.querySelectorAll("[data-collection-count]")).forEach(function (el) {
      el.textContent = String(count); el.setAttribute("aria-label", count + (count === 1 ? " saved challenge" : " saved challenges"));
    });
  }

  function setView(name, focus) {
    state.view = name;
    viewEls.forEach(function (view) {
      var active = view.getAttribute("data-home-view") === name;
      view.hidden = !active; view.classList.toggle("is-active", active); view.setAttribute("aria-hidden", String(!active));
    });
    document.body.setAttribute("data-home-current-view", name);
    if (focus) {
      var activeView = viewEls.filter(function (view) { return view.getAttribute("data-home-view") === name; })[0];
      var heading = activeView ? activeView.querySelector("h1, h2") : null;
      if (heading) { heading.setAttribute("tabindex", "-1"); heading.focus({ preventScroll: true }); }
    }
  }

  function renderFloorRail() {
    floorRail.innerHTML = floorOrder.map(function (floorId) {
      var floor = floors[floorId]; var current = floorId === state.floor ? ' aria-current="page"' : "";
      return '<a href="#floor/' + floorId + '"' + current + '><span>' + floor.number + '</span><strong>' + floor.title.replace("Better ", "") + '</strong></a>';
    }).join("") + '<a class="floor-rail-directory" href="#floors" aria-label="All floors">⌂</a>';
  }

  function renderExhibit() {
    var floor = floors[state.floor]; var exhibit = floor.exhibits[state.exhibit]; var saved = readSaved().indexOf(exhibit.id) >= 0;
    floorKicker.textContent = "Floor " + floor.number + " / " + floor.exhibits.length + " exhibits";
    floorTitle.textContent = floor.title; floorIntro.textContent = floor.intro;
    exhibitPosition.textContent = String(state.exhibit + 1).padStart(2, "0") + " / " + String(floor.exhibits.length).padStart(2, "0");
    exhibitStage.innerHTML = '<article class="exhibit-card" data-exhibit-card><div class="exhibit-card-index"><span>Exhibit</span><strong>' + String(state.exhibit + 1).padStart(2, "0") + '</strong></div><div class="exhibit-card-copy">' + (exhibit.stage ? '<p class="exhibit-stage-name">' + exhibit.stage + '</p>' : "") + '<h3>' + exhibit.title + '</h3><p>' + exhibit.situation + '</p><div class="exhibit-card-actions"><a class="home-action primary" href="#exhibit/' + state.floor + '/' + exhibit.id + '">Open the exhibit</a><button class="home-action secondary" type="button" data-save-id="' + exhibit.id + '" aria-pressed="' + saved + '">' + (saved ? "Saved" : "Save this challenge") + '</button></div></div><div class="exhibit-mark" aria-hidden="true"><span></span><span></span><span></span></div></article>';
    renderFloorRail();
  }

  function selectFloor(floorId, exhibitId, focus) {
    if (!floors[floorId]) floorId = "momentum";
    var changedFloor = state.view !== "floor" || state.floor !== floorId;
    state.floor = floorId;
    var index = exhibitId ? floors[floorId].exhibits.findIndex(function (item) { return item.id === exhibitId; }) : 0;
    state.exhibit = index >= 0 ? index : 0; renderExhibit(); setView("floor", Boolean(focus && changedFloor));
  }

  function moveExhibit(delta) {
    var exhibits = floors[state.floor].exhibits;
    state.exhibit = (state.exhibit + delta + exhibits.length) % exhibits.length;
    window.location.hash = "floor/" + state.floor + "/" + exhibits[state.exhibit].id;
  }

  function toggleSaved(id) {
    var item = findExhibit(id); if (!item) return;
    var saved = readSaved(); var index = saved.indexOf(id);
    if (index >= 0) { saved.splice(index, 1); announce("Removed “" + item.exhibit.title + "” from your collection."); }
    else { saved.push(id); announce("Saved “" + item.exhibit.title + "” to your collection."); }
    writeSaved(saved); if (state.view === "floor") renderExhibit(); if (exhibitDialog.open) renderDialog(item.floorId, id);
  }

  function contactUrl(ids, intent) {
    var params = new URLSearchParams(); params.set("sourcePage", "/"); if (intent) params.set("intent", intent);
    ids.forEach(function (id) { var item = findExhibit(id); if (item) params.append("challenge", item.exhibit.title); });
    return "/contact/?" + params.toString();
  }

  function renderDialog(floorId, exhibitId) {
    var floor = floors[floorId]; var exhibit = floor && floor.exhibits.filter(function (item) { return item.id === exhibitId; })[0]; if (!floor || !exhibit) return;
    exhibitDialog.querySelector("[data-dialog-floor]").textContent = floor.title;
    exhibitDialog.querySelector("[data-dialog-number]").textContent = "Floor " + floor.number;
    exhibitDialog.querySelector("[data-dialog-title]").textContent = exhibit.title;
    exhibitDialog.querySelector("[data-dialog-situation]").textContent = exhibit.situation;
    exhibitDialog.querySelector("[data-dialog-read]").textContent = exhibit.read;
    exhibitDialog.querySelector("[data-dialog-approach]").textContent = exhibit.approach;
    exhibitDialog.querySelector("[data-dialog-result]").textContent = exhibit.result;
    var save = exhibitDialog.querySelector("[data-dialog-save]"); var isSaved = readSaved().indexOf(exhibit.id) >= 0;
    save.textContent = isSaved ? "Remove from saved" : "Save this challenge"; save.setAttribute("aria-pressed", String(isSaved)); save.setAttribute("data-save-id", exhibit.id);
    exhibitDialog.querySelector("[data-dialog-talk]").href = contactUrl([exhibit.id], exhibit.title);
  }

  function openExhibit(floorId, exhibitId) { selectFloor(floorId, exhibitId, false); renderDialog(floorId, exhibitId); if (!exhibitDialog.open) exhibitDialog.showModal(); }
  function closeExhibit(updateHash) {
    if (exhibitDialog.open) exhibitDialog.close();
    if (updateHash) { var exhibit = floors[state.floor].exhibits[state.exhibit]; window.history.replaceState(null, "", "#floor/" + state.floor + "/" + exhibit.id); }
  }

  function renderCollection() {
    updateCounts(); var saved = readSaved(); var list = document.querySelector("[data-collection-list]"); var inquiry = document.querySelector("[data-collection-inquire]");
    if (!list || !inquiry) return;
    try {
      window.localStorage.setItem("djc-saved-challenge-labels-v1", JSON.stringify(saved.map(function (id) {
        var item = findExhibit(id);
        return item ? item.exhibit.title : "";
      }).filter(Boolean)));
    } catch (error) { /* Storage is optional. */ }
    if (!saved.length) {
      list.innerHTML = '<p class="collection-empty">Nothing saved yet. Open any exhibit and save the challenges that sound familiar.</p>';
      inquiry.textContent = "Talk with Joe without a collection"; inquiry.href = contactUrl([], "Plan a focused conversation"); return;
    }
    list.innerHTML = saved.map(function (id) {
      var item = findExhibit(id); if (!item) return "";
      return '<article><div><span>' + item.floorTitle + '</span><strong>' + item.exhibit.title + '</strong></div><button type="button" data-remove-id="' + id + '" aria-label="Remove ' + item.exhibit.title.replace(/"/g, "&quot;") + '">Remove</button></article>';
    }).join("");
    inquiry.textContent = "Talk with Joe about these"; inquiry.href = contactUrl(saved, "Saved homepage challenges");
  }

  function openCollection() { renderCollection(); if (!collectionDialog.open) collectionDialog.showModal(); }
  function route(focus) {
    var hash = window.location.hash.replace(/^#/, "") || "threshold"; var parts = hash.split("/").filter(Boolean);
    closeExhibit(false); if (collectionDialog.open) collectionDialog.close();
    if (parts[0] === "intro") return setView("intro", focus);
    if (parts[0] === "floors") return setView("directory", focus);
    if (parts[0] === "meet-joe") return setView("meet", focus);
    if (parts[0] === "floor") return selectFloor(parts[1], parts[2], focus);
    if (parts[0] === "exhibit") return openExhibit(parts[1], parts[2]);
    if (parts[0] === "collection") { setView(state.view === "threshold" ? "directory" : state.view, false); return openCollection(); }
    setView("threshold", focus);
  }

  document.addEventListener("click", function (event) {
    var save = event.target.closest("[data-save-id]"); var remove = event.target.closest("[data-remove-id]");
    if (save) { event.preventDefault(); toggleSaved(save.getAttribute("data-save-id")); }
    if (remove) { event.preventDefault(); toggleSaved(remove.getAttribute("data-remove-id")); }
  });
  document.querySelector("[data-exhibit-prev]").addEventListener("click", function () { moveExhibit(-1); });
  document.querySelector("[data-exhibit-next]").addEventListener("click", function () { moveExhibit(1); });
  document.querySelector("[data-dialog-close]").addEventListener("click", function () { closeExhibit(true); });
  document.querySelector("[data-collection-close]").addEventListener("click", function () { collectionDialog.close(); window.history.replaceState(null, "", state.priorHash || "#floors"); });
  document.querySelector("[data-collection-continue]").addEventListener("click", function () { collectionDialog.close(); window.location.hash = "floors"; });
  collectionDialog.addEventListener("cancel", function (event) { event.preventDefault(); collectionDialog.close(); window.history.replaceState(null, "", state.priorHash || "#floors"); });
  exhibitDialog.addEventListener("cancel", function (event) { event.preventDefault(); closeExhibit(true); });
  document.addEventListener("keydown", function (event) {
    if (state.view !== "floor" || exhibitDialog.open || collectionDialog.open) return;
    if (event.key === "ArrowLeft") { event.preventDefault(); moveExhibit(-1); }
    if (event.key === "ArrowRight") { event.preventDefault(); moveExhibit(1); }
  });
  floorView.addEventListener("pointerdown", function (event) { touchStartX = event.clientX; }, { passive: true });
  floorView.addEventListener("pointerup", function (event) {
    if (touchStartX === null) return; var distance = event.clientX - touchStartX; touchStartX = null;
    if (Math.abs(distance) > 64) moveExhibit(distance > 0 ? -1 : 1);
  }, { passive: true });
  window.addEventListener("hashchange", function () {
    if (!window.location.hash.startsWith("#collection")) state.priorHash = window.location.hash || "#floors";
    route(true);
  });
  window.addEventListener("storage", renderCollection);
  renderCollection(); state.priorHash = window.location.hash && !window.location.hash.startsWith("#collection") ? window.location.hash : "#floors"; route(false);
})();
