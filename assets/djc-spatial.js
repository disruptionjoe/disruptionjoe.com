/* ============================================================
   DJC SPATIAL — motion + interaction spine
   "The visitor moves, the room holds still."
   One rAF for the whole document. Finished lit state is the
   default; motion is added only when it is safe to add.
   ============================================================ */
(function () {
  "use strict";

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  var reduceQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
  function motionOK() { return !reduceQuery.matches; }
  var hasIO = "IntersectionObserver" in window;
  var isCoarse = window.matchMedia("(pointer: coarse)").matches;

  /* --- Shared rAF state (one scroll consumer for the whole page) --- */
  var rooms = [];        // { el, top, height, p }
  var pending = null;     // coalesced pointer { el, x, y }
  var navEl = null;
  var scrolled = false;
  var frameQueued = false;
  var engineOn = false;

  function schedule() {
    if (frameQueued) return;
    frameQueued = true;
    requestAnimationFrame(tick);
  }

  function measure() {
    var y = window.scrollY || window.pageYOffset || 0;
    for (var i = 0; i < rooms.length; i++) {
      var r = rooms[i];
      var rect = r.el.getBoundingClientRect();
      r.top = rect.top + y;
      r.height = rect.height || 1;
    }
  }

  function tick() {
    frameQueued = false;
    var y = window.scrollY || window.pageYOffset || 0;

    // Nav scrolled-state folds into the single tick.
    if (navEl) {
      var next = y > 18;
      if (next !== scrolled) {
        scrolled = next;
        navEl.classList.toggle("is-scrolled", scrolled);
      }
    }

    // One --p write per active room, dead-banded.
    if (engineOn) {
      var center = y + window.innerHeight / 2;
      for (var i = 0; i < rooms.length; i++) {
        var r = rooms[i];
        var p = (center - r.top) / r.height;
        p = p < 0 ? 0 : p > 1 ? 1 : p;
        if (Math.abs(p - r.p) > 0.002) {
          r.p = p;
          r.el.style.setProperty("--p", p.toFixed(4));
        }
      }
    }

    // Pointer-follow lamp, coalesced to one write per frame.
    if (pending) {
      pending.el.style.setProperty("--mx", pending.x + "%");
      pending.el.style.setProperty("--my", pending.y + "%");
      pending = null;
    }
  }

  function initEngine() {
    navEl = document.querySelector(".site-nav");

    if (motionOK()) {
      var roomEls = document.querySelectorAll("[data-room]");
      for (var i = 0; i < roomEls.length; i++) {
        rooms.push({ el: roomEls[i], top: 0, height: 1, p: -1 });
      }
      engineOn = rooms.length > 0;
      if (engineOn) {
        measure();
        // Toggle .in-view so will-change lives only while a room is on screen.
        if (hasIO) {
          var io = new IntersectionObserver(function (entries) {
            entries.forEach(function (e) {
              e.target.classList.toggle("in-view", e.isIntersecting);
            });
          }, { rootMargin: "10% 0px 10% 0px" });
          for (var j = 0; j < roomEls.length; j++) io.observe(roomEls[j]);
        }
      }
    }

    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", function () { measure(); schedule(); }, { passive: true });
    window.addEventListener("orientationchange", function () { measure(); schedule(); }, { passive: true });
    // Recompute rects after fonts/images settle.
    window.addEventListener("load", function () { measure(); schedule(); });
    schedule();
  }

  /* --- Pointer-follow lamp (reuses --mx/--my, throttled into the tick) --- */
  function initPointerDepth() {
    if (isCoarse || !motionOK()) return;
    var items = document.querySelectorAll("[data-tilt]");
    for (var i = 0; i < items.length; i++) {
      (function (item) {
        item.addEventListener("pointermove", function (event) {
          var rect = item.getBoundingClientRect();
          var x = Math.round(((event.clientX - rect.left) / rect.width) * 100);
          var y = Math.round(((event.clientY - rect.top) / rect.height) * 100);
          pending = { el: item, x: x, y: y };
          schedule();
        }, { passive: true });
        item.addEventListener("pointerleave", function () {
          item.style.removeProperty("--mx");
          item.style.removeProperty("--my");
        });
      })(items[i]);
    }
  }

  /* --- Reveal contract (fixes the old no-op) --- */
  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!items.length) return;
    // No safe motion path -> everything is already lit; never arm hidden state.
    if (!hasIO || !motionOK()) {
      items.forEach(function (item) { item.classList.add("is-visible"); });
      return;
    }
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.12 });
    items.forEach(function (item) { observer.observe(item); });
  }

  /* --- Canonical nav: real Method hierarchy + hamburger + floor-plan marker --- */
  function initNav() {
    var nav = document.querySelector(".site-nav");
    if (!nav) return;

    // Mobile hamburger
    var toggle = nav.querySelector(".nav-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
    }

    // Method dropdown / mega-panel
    var dropdowns = Array.prototype.slice.call(nav.querySelectorAll("[data-nav-dropdown]"));
    dropdowns.forEach(function (dd) {
      var caret = dd.querySelector(".nav-caret");
      var panel = dd.querySelector(".nav-panel");
      if (!caret || !panel) return;

      var components = Array.prototype.slice.call(panel.querySelectorAll(".nav-component"));
      function focusComponent(i) {
        if (!components.length) return;
        var n = (i + components.length) % components.length;
        components[n].focus();
      }

      function open() {
        panel.classList.add("is-open");
        caret.setAttribute("aria-expanded", "true");
      }
      function close() {
        panel.classList.remove("is-open");
        caret.setAttribute("aria-expanded", "false");
      }
      caret.addEventListener("click", function (e) {
        e.preventDefault();
        if (panel.classList.contains("is-open")) { close(); }
        else { open(); }
      });
      // ArrowDown from the caret opens the panel and lands on the first component.
      caret.addEventListener("keydown", function (e) {
        if (e.key === "ArrowDown") { e.preventDefault(); open(); focusComponent(0); }
      });
      // Desktop hover intent (CSS also opens on :hover / :focus-within).
      dd.addEventListener("mouseleave", close);
      // Escape closes and returns focus to the caret; Arrow keys rove the components.
      dd.addEventListener("keydown", function (e) {
        if (e.key === "Escape" || e.key === "Esc") {
          close();
          caret.focus();
          return;
        }
        if (e.key === "ArrowDown" || e.key === "ArrowUp") {
          var idx = components.indexOf(document.activeElement);
          if (idx === -1) return; // focus not on a component; leave default behavior
          e.preventDefault();
          focusComponent(idx + (e.key === "ArrowDown" ? 1 : -1));
        }
      });
    });

    // Close any open panel when focus or click leaves the nav entirely.
    document.addEventListener("click", function (e) {
      if (!nav.contains(e.target)) {
        dropdowns.forEach(function (dd) {
          var caret = dd.querySelector(".nav-caret");
          var panel = dd.querySelector(".nav-panel");
          if (panel) panel.classList.remove("is-open");
          if (caret) caret.setAttribute("aria-expanded", "false");
        });
      }
    });

    // Living floor-plan marker: dock the clay mark under the active room.
    var marker = nav.querySelector(".nav-marker");
    if (marker) {
      var placeMarker = function () {
        var active = nav.querySelector('.nav-item[aria-current="page"]')
          || nav.querySelector('.nav-parent[aria-current]')
          || nav.querySelector('.nav-item[aria-current]');
        if (!active) { marker.classList.remove("is-placed"); return; }
        var navRect = nav.getBoundingClientRect();
        var aRect = active.getBoundingClientRect();
        var left = aRect.left - navRect.left;
        marker.style.width = aRect.width + "px";
        marker.style.transform = "translateX(" + left + "px)";
        marker.classList.add("is-placed");
      };
      placeMarker();
      window.addEventListener("resize", placeMarker, { passive: true });
      window.addEventListener("load", placeMarker);
    }
  }

  /* --- Threshold wash on room load-in --- */
  function initThreshold() {
    if (!motionOK()) return;
    if (!document.querySelector(".threshold-wash")) return;
    document.body.classList.add("entering");
    requestAnimationFrame(function () {
      requestAnimationFrame(function () {
        document.body.classList.remove("entering");
      });
    });
  }

  /* --- Playbook book (unchanged behaviour) --- */
  function initBook() {
    var root = document.querySelector("[data-book]");
    if (!root) return;
    var tabs = Array.prototype.slice.call(root.querySelectorAll("[data-book-tab]"));
    var symbol = root.querySelector("[data-book-symbol]");
    var title = root.querySelector("[data-book-title]");
    var text = root.querySelector("[data-book-text]");
    var change = root.querySelector("[data-book-change]");
    var pages = {
      practice: {
        symbol: "01",
        title: "Practice before confidence",
        text: "People trust new habits when they can try them on real work, with room to be uneven at first.",
        change: "The room gives cautious people a safe first move and gives early adopters a better standard."
      },
      reflection: {
        symbol: "02",
        title: "Reflection sharpens judgment",
        text: "The session slows down just enough for people to compare results, name what improved, and notice what still feels risky.",
        change: "Prompt tricks become shared criteria for better work."
      },
      sensing: {
        symbol: "03",
        title: "The room reports back",
        text: "A good activation reveals confidence gaps, workflow friction, unclear standards, and the patterns leaders should scale.",
        change: "Leaders leave with signal, not just attendance."
      },
      modular: {
        symbol: "04",
        title: "Designed for changing tools",
        text: "The Playbook teaches teams how to keep learning with AI as the software changes around them.",
        change: "The capability survives the next interface."
      }
    };
    function select(key) {
      var page = pages[key];
      if (!page) return;
      tabs.forEach(function (tab) {
        tab.setAttribute("aria-selected", String(tab.getAttribute("data-book-tab") === key));
      });
      if (symbol) symbol.textContent = page.symbol;
      if (title) title.textContent = page.title;
      if (text) text.textContent = page.text;
      if (change) change.textContent = page.change;
    }
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () { select(tab.getAttribute("data-book-tab")); });
    });
    select(tabs[0] && tabs[0].getAttribute("data-book-tab"));
  }

  /* --- Thinking studio: chambers as real scroll rooms.
         Tabs become progressive-enhancement anchor-scroll nav.
         (No display:none swap; every chamber is always in the document.) --- */
  function initStudio() {
    var root = document.querySelector("[data-studio]");
    if (!root) return;
    var tabs = Array.prototype.slice.call(root.querySelectorAll("[data-studio-tab]"));
    var chambers = Array.prototype.slice.call(root.querySelectorAll("[data-chamber]"));

    // Legacy fallback: if the page still uses [data-studio-room] tab-swap markup,
    // keep it working exactly as before so nothing breaks pre-rebuild.
    var legacyRooms = Array.prototype.slice.call(root.querySelectorAll("[data-studio-room]"));
    if (legacyRooms.length && !chambers.length) {
      function selectLegacy(key) {
        tabs.forEach(function (tab) {
          tab.setAttribute("aria-selected", String(tab.getAttribute("data-studio-tab") === key));
        });
        legacyRooms.forEach(function (room) {
          room.classList.toggle("is-active", room.getAttribute("data-studio-room") === key);
        });
      }
      tabs.forEach(function (tab) {
        tab.addEventListener("click", function () { selectLegacy(tab.getAttribute("data-studio-tab")); });
      });
      selectLegacy(tabs[0] && tabs[0].getAttribute("data-studio-tab"));
      return;
    }

    // Chamber mode: tabs scroll to chambers; active tab reflects the visible chamber.
    tabs.forEach(function (tab) {
      tab.addEventListener("click", function (e) {
        var key = tab.getAttribute("data-studio-tab");
        var target = root.querySelector('[data-chamber="' + key + '"]');
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: motionOK() ? "smooth" : "auto", block: "start" });
        }
      });
    });
    if (hasIO && chambers.length) {
      var spy = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (!entry.isIntersecting) return;
          var key = entry.target.getAttribute("data-chamber");
          tabs.forEach(function (tab) {
            tab.setAttribute("aria-selected", String(tab.getAttribute("data-studio-tab") === key));
          });
        });
      }, { rootMargin: "-40% 0px -40% 0px", threshold: 0 });
      chambers.forEach(function (c) { spy.observe(c); });
    }

    // One-shot line-draw: each chamber's floor-plan stroke draws once when it
    // enters view, then never re-animates (no per-frame stroke-dashoffset work).
    if (hasIO && motionOK()) {
      var draws = Array.prototype.slice.call(root.querySelectorAll(".chamber-draw"));
      if (draws.length) {
        var drawObserver = new IntersectionObserver(function (entries) {
          entries.forEach(function (entry) {
            if (entry.isIntersecting) {
              entry.target.classList.add("is-drawn");
              drawObserver.unobserve(entry.target);
            }
          });
        }, { threshold: 0.35 });
        draws.forEach(function (d) { drawObserver.observe(d); });
      }
    }
  }

  /* --- Contact form: preserved fetch to /api/contact, adds the calm end-state --- */
  function initContactForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;
    var status = form.querySelector("[data-form-status]");
    var submit = form.querySelector("button[type='submit']");

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (status) {
        status.className = "form-status";
        status.textContent = "Sending your note...";
      }
      if (submit) submit.disabled = true;

      var data = new FormData(form);
      var payload = {
        name: data.get("name") || "",
        email: data.get("email") || "",
        company: data.get("company") || "",
        intent: data.get("intent") || "AI Activation Planning Call",
        message: data.get("message") || "",
        source: form.getAttribute("data-source") || "contact",
        sourcePage: window.location.pathname
      };

      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).then(function (res) {
        if (!res.ok) throw new Error("Contact request failed");
        if (status) status.textContent = "Thanks. Joe will read this and reply directly.";
        form.reset();
        document.body.classList.add("confirmed");
      }).catch(function () {
        if (status) {
          status.className = "form-status error";
          status.textContent = "The form failed to send. You can email joe@disruptionjoe.com directly.";
        }
      }).finally(function () {
        if (submit) submit.disabled = false;
      });
    });
  }

  ready(function () {
    // Arm motion only when BOTH IntersectionObserver and reduced-motion allow it.
    if (hasIO && motionOK()) {
      document.body.classList.add("js-motion");
    }
    initThreshold();
    initEngine();
    initReveal();
    initPointerDepth();
    initNav();
    initBook();
    initStudio();
    initContactForm();
  });
})();
