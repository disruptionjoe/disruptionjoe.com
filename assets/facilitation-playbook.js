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

    renderBooks(items, state);
    emptyState.hidden = items.length !== 0;
    resultCount.textContent = items.length + (items.length === 1 ? " card" : " cards") + " match. Choose filters in any combination.";
    var source = state.related ? lookup.get(state.related) : null;
    relatedContext.hidden = !source;
    relatedContext.textContent = source ? "Related to " + itemName(source) + "." : "";

    if (state.card) {
      var selected = document.getElementById(state.card);
      var details = selected && selected.querySelector("details");
      if (details) details.open = true;
      if (selected && window.location.hash === "#" + state.card) {
        window.requestAnimationFrame(function () { selected.scrollIntoView({ block: "nearest", inline: "start" }); });
      }
    }
  }


  var bookDefinitions = [
    ["frame", "Frame", "Find the question worth answering."],
    ["diverge", "Diverge", "Make room for possibilities and perspectives."],
    ["converge", "Converge", "Bring the strongest ideas into focus."],
    ["decide", "Decide", "Turn the conversation into a choice."],
    ["check", "Check", "Test the thinking before moving forward."],
    ["practice", "Practice", "Make new ways of working stick."],
    ["sessions", "Working sessions", "Bring the plays together around a useful outcome."],
    ["techniques", "Techniques", "Small moves that help everyone contribute."]
  ];
  var bookSelect = document.querySelector("[data-book-select]");
  var filterPanel = document.querySelector(".book-filters");
  document.querySelector("[data-show-results]").addEventListener("click", function () {
    filterPanel.open = false;
    grid.focus({preventScroll: true});
  });
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape" && filterPanel.open) {
      filterPanel.open = false;
      filterPanel.querySelector("summary").focus();
    }
  });
  var activeBook = 0;
  var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  function moveBook(index) {
    var books = Array.from(grid.children);
    index = Math.max(0, Math.min(books.length - 1, index));
    if (books[index]) books[index].scrollIntoView({block: "start", inline: "nearest", behavior: reducedMotion ? "auto" : "smooth"});
  }
  bookSelect.addEventListener("change", function () { moveBook(Number(bookSelect.value)); });
  document.querySelector("[data-book-prev]").addEventListener("click", function () { moveBook(activeBook - 1); });
  document.querySelector("[data-book-next]").addEventListener("click", function () { moveBook(activeBook + 1); });
  var bookFrame = 0;
  grid.addEventListener("scroll", function () {
    if (bookFrame) return;
    bookFrame = requestAnimationFrame(function () {
      bookFrame = 0;
      activeBook = Math.round(grid.scrollTop / Math.max(grid.clientHeight, 1));
      bookSelect.value = String(activeBook);
      document.querySelector("[data-book-prev]").disabled = activeBook === 0;
      document.querySelector("[data-book-next]").disabled = activeBook >= grid.children.length - 1;
    });
  }, {passive:true});
  grid.addEventListener("click", function (event) {
    var button = event.target.closest("[data-page-move]");
    if (!button) return;
    var track = button.closest(".book-volume").querySelector(".book-pages");
    var index = Math.round(track.scrollLeft / Math.max(track.clientWidth, 1));
    var target = Math.max(0, Math.min(track.children.length - 1, index + Number(button.dataset.pageMove)));
    track.children[target].scrollIntoView({block: "nearest", inline: "start", behavior: reducedMotion ? "auto" : "smooth"});
  });
  grid.addEventListener("keydown", function (event) {
    if (event.target.closest("a,button,input,select,summary,textarea")) return;
    var volume = event.target.closest(".book-volume") || grid.children[activeBook];
    if (!volume) return;
    if (event.key === "ArrowDown" || event.key === "ArrowUp") {
      event.preventDefault(); moveBook(activeBook + (event.key === "ArrowDown" ? 1 : -1));
    } else if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
      event.preventDefault();
      volume.querySelector('[data-page-move="' + (event.key === "ArrowRight" ? 1 : -1) + '"]').click();
    }
  });
  function renderBooks(items, state) {
    var books = bookDefinitions.map(function (definition) {
      return {definition:definition, items:items.filter(function (item) {
        var key = item.kind === "session" ? "sessions" : item.kind === "technique" ? "techniques" : item.books[0];
        return key === definition[0];
      })};
    }).filter(function (book) { return book.items.length; });
    bookSelect.innerHTML = books.map(function (book, index) {
      return '<option value="' + index + '">' + escapeHtml(book.definition[1]) + ' (' + book.items.length + ')</option>';
    }).join("");
    grid.innerHTML = books.map(function (book, index) {
      var d = book.definition;
      return '<section class="book-volume" aria-label="' + escapeHtml(d[1]) + '" tabindex="0">' +
        '<div class="book-pages" aria-label="' + escapeHtml(d[1]) + ' pages" tabindex="0">' +
        '<div class="book-page book-cover"><div class="book-cover-inner"><p class="book-number">Vol. ' + String(index + 1).padStart(2,"0") + ' / ' + book.items.length + ' pages</p>' +
        '<h2>' + escapeHtml(d[1]) + '</h2><p class="book-description">' + escapeHtml(d[2]) + '</p>' +
        '<button type="button" class="book-open" data-page-move="1">Open the book →</button>' +
        '<p class="book-directions">↕ Swipe or scroll between books<br>↔ Swipe or use the arrows to turn pages</p></div></div>' +
        book.items.map(function (item) { return '<div class="book-page">' + card(item, state) + '</div>'; }).join("") +
        '</div><nav class="book-pagination" aria-label="' + escapeHtml(d[1]) + ' page navigation"><button type="button" data-page-move="-1" aria-label="Previous page">←</button><span data-page-count aria-live="polite">Cover / ' + book.items.length + '</span><button type="button" data-page-move="1" aria-label="Next page">→</button></nav></section>';
    }).join("");
    activeBook = 0;
    grid.scrollTop = 0;
    document.querySelector("[data-book-prev]").disabled = true;
    document.querySelector("[data-book-next]").disabled = books.length <= 1;
    grid.querySelectorAll(".book-pages").forEach(function (track) {
      var frame = 0;
      function update() {
        frame = 0;
        var index = Math.round(track.scrollLeft / Math.max(track.clientWidth,1));
        var nav = track.parentNode.querySelector(".book-pagination");
        nav.querySelector("[data-page-count]").textContent = (index ? "Page " + index : "Cover") + " / " + (track.children.length - 1);
        nav.querySelector('[data-page-move="-1"]').disabled = index === 0;
        nav.querySelector('[data-page-move="1"]').disabled = index === track.children.length - 1;
      }
      track.addEventListener("scroll", function () { if (!frame) frame = requestAnimationFrame(update); }, {passive:true});
      update();
    });
    var count = filterControls.filter(function (control) { return Boolean(control.value); }).length;
    if (state.kind !== "all") count++;
    if (state.related) count++;
    document.querySelector("[data-filter-count]").textContent = count ? "(" + count + ")" : "";
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
