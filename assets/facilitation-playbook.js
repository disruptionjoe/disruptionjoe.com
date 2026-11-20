(function () {
  "use strict";

  var grid = document.querySelector("[data-card-grid]");
  if (!grid) return;

  var resultCount = document.querySelector("[data-result-count]");
  var relatedContext = document.querySelector("[data-related-context]");
  var emptyState = document.querySelector("[data-empty-state]");
  var kindButtons = Array.prototype.slice.call(document.querySelectorAll("[data-kind]"));
  var filterControls = Array.prototype.slice.call(document.querySelectorAll("[data-filter]"));
  var clearButton = document.querySelector("[data-clear-filters]");
  var payload;
  var lookup;

  var labels = {
    "ai-heavy": "AI-heavy",
    light: "Light AI support",
    none: "No AI",
    decides: "Decides in the room",
    informs: "Informs a decision",
    diverge: "Diverge",
    converge: "Converge",
    decide: "Decide",
    frame: "Frame",
    check: "Check",
    practice: "Practice"
  };

  fetch("/assets/facilitation-playbook-data.json")
    .then(function (response) {
      if (!response.ok) throw new Error("The playbook data could not be loaded.");
      return response.json();
    })
    .then(function (data) {
      payload = data;
      lookup = new Map([].concat(data.sessions, data.plays, data.techniques).map(function (item) {
        return [item.id, item];
      }));
      populateFilters();
      restoreControls();
      render();
      window.addEventListener("popstate", function () {
        restoreControls();
        render();
      });
    })
    .catch(function (error) {
      resultCount.textContent = error.message;
      emptyState.hidden = false;
    });

  kindButtons.forEach(function (button) {
    button.addEventListener("click", function () {
      kindButtons.forEach(function (item) { item.setAttribute("aria-pressed", String(item === button)); });
      updateUrl({ kind: button.dataset.kind, related: null, card: null });
      render();
    });
  });

  filterControls.forEach(function (control) {
    control.addEventListener(control.type === "search" ? "input" : "change", function () {
      var change = { related: null, card: null };
      change[control.dataset.filter] = control.value.trim() || null;
      updateUrl(change);
      render();
    });
  });

  clearButton.addEventListener("click", function () {
    var url = new URL(window.location.href);
    url.search = "";
    url.hash = "";
    window.history.replaceState(null, "", url);
    restoreControls();
    render();
  });

  function populateFilters() {
    var options = {
      situation: payload.tags.situation,
      outcome: payload.tags.outcome,
      category: payload.tags.category,
      book: payload.tags.book,
      buyer: payload.tags.buyer,
      ai: payload.tags.ai,
      decision: payload.tags.decision
    };
    filterControls.filter(function (control) { return control.tagName === "SELECT"; }).forEach(function (select) {
      options[select.dataset.filter].forEach(function (option) {
        var value = typeof option === "string" ? option : option.value;
        var label = typeof option === "string" ? labels[option] || option : option.label;
        select.add(new Option(label, value));
      });
    });
  }

  function restoreControls() {
    var params = new URLSearchParams(window.location.search);
    var kind = params.get("kind") || "all";
    if (!["session", "play", "technique", "all"].includes(kind)) kind = "all";
    kindButtons.forEach(function (button) {
      button.setAttribute("aria-pressed", String(button.dataset.kind === kind));
    });
    filterControls.forEach(function (control) {
      control.value = params.get(control.dataset.filter) || "";
    });
  }

  function updateUrl(changes) {
    var url = new URL(window.location.href);
    Object.keys(changes).forEach(function (key) {
      var value = changes[key];
      if (!value || (key === "kind" && value === "all")) url.searchParams.delete(key);
      else url.searchParams.set(key, value);
    });
    url.hash = "";
    window.history.replaceState(null, "", url);
  }

  function currentState() {
    var params = new URLSearchParams(window.location.search);
    return {
      kind: params.get("kind") || "all",
      q: (params.get("q") || "").toLowerCase(),
      situation: params.get("situation"),
      outcome: params.get("outcome"),
      category: params.get("category"),
      book: params.get("book"),
      buyer: params.get("buyer"),
      ai: params.get("ai"),
      decision: params.get("decision"),
      related: params.get("related"),
      card: params.get("card")
    };
  }

  function render() {
    if (!payload) return;
    var state = currentState();
    var allItems = [].concat(payload.sessions, payload.plays, payload.techniques);
    var relatedIds = state.related ? relationIds(lookup.get(state.related)) : null;
    var items = allItems.filter(function (item) {
      if (state.kind !== "all" && item.kind !== state.kind) return false;
      if (relatedIds && !relatedIds.has(item.id)) return false;
      if (state.q && !searchText(item).includes(state.q)) return false;
      if (state.situation && !(item.situationTags || []).includes(state.situation)) return false;
      if (state.outcome && !(item.outcomeTags || []).includes(state.outcome)) return false;
      if (state.category && !categories(item).includes(state.category)) return false;
      if (state.book && !(item.books || []).includes(state.book)) return false;
      if (state.buyer && !(item.buyerTags || []).includes(state.buyer)) return false;
      if (state.ai && aiValues(item).indexOf(state.ai) < 0) return false;
      if (state.decision && decisionValues(item).indexOf(state.decision) < 0) return false;
      return true;
    });

    items.sort(function (a, b) {
      var kindOrder = { session: 0, play: 1, technique: 2 };
      return kindOrder[a.kind] - kindOrder[b.kind] || numericId(a.id) - numericId(b.id);
    });

    grid.innerHTML = items.map(function (item) { return card(item, state); }).join("");
    emptyState.hidden = items.length !== 0;
    resultCount.textContent = items.length + (items.length === 1 ? " card" : " cards") + " shown. Filters combine to narrow the shelf.";
    var source = state.related ? lookup.get(state.related) : null;
    relatedContext.hidden = !source;
    relatedContext.textContent = source ? "Related to " + itemName(source) + "." : "";

    if (state.card) {
      var selected = document.getElementById(state.card);
      var details = selected && selected.querySelector("details");
      if (details) details.open = true;
      if (selected && window.location.hash === "#" + state.card) {
        window.requestAnimationFrame(function () { selected.scrollIntoView({ block: "start" }); });
      }
    }
  }

  function categories(item) {
    if (item.kind === "session") return [item.category];
    return item.categories || [];
  }

  function aiValues(item) {
    if (item.kind === "session" || item.kind === "play") return [item.aiInvolvement];
    return [];
  }

  function decisionValues(item) {
    if (item.kind === "session") return [item.decisionMode];
    return item.decisionModes || [];
  }

  function searchText(item) {
    return JSON.stringify(item).toLowerCase();
  }

  function numericId(id) {
    return Number(id.slice(3));
  }

  function card(item, state) {
    if (item.kind === "session") return sessionCard(item, state);
    if (item.kind === "play") return playCard(item, state);
    return techniqueCard(item, state);
  }

  function sessionCard(item, state) {
    var title = escapeHtml(item.title);
    return '<article class="playbook-card session-card" id="' + item.id + '">' +
      '<div class="card-core"><p class="card-eyebrow"><span>Working session</span><span>' + item.id + '</span></p>' +
      '<h3>' + title + '</h3><p class="card-situation">' + escapeHtml(item.situation) + '</p>' +
      '<p class="card-output"><strong>You leave with</strong><br>' + escapeHtml(item.output) + '</p>' +
      tags([item.categoryLabel, labels[item.aiInvolvement], labels[item.decisionMode]]) + '</div>' +
      '<details class="card-details"' + (state.card === item.id ? " open" : "") + '><summary>Open the session</summary><div class="card-detail-body">' +
      '<div><p class="card-line"><strong>Default play sequence</strong></p>' + sequence(item.sequence) + '</div>' +
      relations(item, item.follows, item.leadsTo, item.pairsWith) +
      '<a class="session-cta" href="/contact/?sourcePage=%2Fplaybook%2F&amp;intent=30-Minute%20Discovery%20Call&amp;session=' + encodeURIComponent(item.title) + '">Book a discovery call</a>' +
      '</div></details></article>';
  }

  function playCard(item, state) {
    return '<article class="playbook-card play-card" id="' + item.id + '">' +
      '<div class="card-core"><p class="card-eyebrow"><span>Play</span><span>' + item.id + '</span></p>' +
      '<h3>' + escapeHtml(item.name) + '</h3><p class="card-purpose">' + escapeHtml(item.purpose) + '</p>' +
      tags([].concat(item.books.map(function (book) { return labels[book] || book; }), labels[item.aiInvolvement])) + '</div>' +
      '<details class="card-details"' + (state.card === item.id ? " open" : "") + '><summary>Open the play</summary><div class="card-detail-body">' +
      line("Default", item.default) + line("Say", item.say) + line("Dial it", item.dial) +
      line("Variants", item.variants.length ? item.variants.join(" • ") : "No named variants.") +
      line("AI", item.aiText) + relations(item, item.oftenAfter, item.oftenBefore, []) +
      '</div></details></article>';
  }

  function techniqueCard(item, state) {
    return '<article class="playbook-card technique-card" id="' + item.id + '">' +
      '<div class="card-core"><p class="card-eyebrow"><span>Technique</span><span>' + item.id + '</span></p>' +
      '<h3>' + escapeHtml(item.name) + '</h3><p class="card-purpose">' + escapeHtml(item.purpose) + '</p>' +
      tags(["Facilitator move"]) + '</div>' +
      '<details class="card-details"' + (state.card === item.id ? " open" : "") + '><summary>Open the technique</summary><div class="card-detail-body">' +
      line("Do", item.do) + line("Say", item.say) + relations(item, item.oftenAfter, item.oftenBefore, []) +
      '</div></details></article>';
  }

  function line(label, value) {
    return '<p class="card-line"><strong>' + escapeHtml(label) + '</strong>' + escapeHtml(value || "Not specified.") + '</p>';
  }

  function tags(values) {
    return '<div class="card-tags">' + values.filter(Boolean).map(function (value) {
      return '<span>' + escapeHtml(value) + '</span>';
    }).join("") + '</div>';
  }

  function sequence(steps) {
    return '<ol class="sequence-list">' + steps.map(function (step, index) {
      var related = lookup.get(step.id);
      return '<li><b>' + String(index + 1).padStart(2, "0") + '</b><span><a href="' + cardUrl(step.id) + '">' + escapeHtml(itemName(related)) + '</a><small>' + escapeHtml(step.setting) + '</small></span></li>';
    }).join("") + '</ol>';
  }

  function relations(item, after, before, pairs) {
    var ids = [].concat(after || [], before || [], pairs || []);
    return '<div class="card-relations" aria-label="Before and after">' +
      relationGroup("Often after", after) + relationGroup("Often before", before) +
      (pairs && pairs.length ? relationGroup("Pairs with", pairs) : "") +
      (ids.length ? '<a class="related-view" href="' + relatedUrl(item.id) + '">View related cards</a>' : '<p class="card-line">No before or after relationship is recorded yet.</p>') +
      '</div>';
  }

  function relationGroup(label, ids) {
    var content = ids && ids.length ? ids.map(function (id) {
      return '<a href="' + cardUrl(id) + '">' + escapeHtml(itemName(lookup.get(id))) + '</a>';
    }).join("") : '<span>None recorded</span>';
    return '<div class="relation-group"><strong>' + escapeHtml(label) + '</strong><div class="relation-links">' + content + '</div></div>';
  }

  function relationIds(item) {
    if (!item) return new Set();
    if (item.kind === "session") return new Set([].concat(item.follows, item.leadsTo, item.pairsWith));
    return new Set([].concat(item.oftenAfter || [], item.oftenBefore || []));
  }

  function itemName(item) {
    return item ? item.title || item.name : "Unknown card";
  }

  function cardUrl(id) {
    var item = lookup.get(id);
    var kind = item ? item.kind : "all";
    return "/playbook/?kind=" + encodeURIComponent(kind) + "&card=" + encodeURIComponent(id) + "#" + encodeURIComponent(id);
  }

  function relatedUrl(id) {
    return "/playbook/?related=" + encodeURIComponent(id);
  }

  function escapeHtml(value) {
    return String(value ?? "").replace(/[&<>'"]/g, function (character) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[character];
    });
  }
}());
