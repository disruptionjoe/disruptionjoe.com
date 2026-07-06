/* The Working Notebook: one small script.
   1. Arms ink-stroke draw-ins (unless reduced motion is preferred).
   2. Nav toggles for mobile menu and the Method flyout.
   Everything on the page is fully readable and fully drawn without this file. */
(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  if (!reduce) document.documentElement.classList.add("js-ink");

  function init() {
    // Draw each figure's strokes once, the first time it is seen.
    if (!reduce && "IntersectionObserver" in window) {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-inked");
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.35 });
      document.querySelectorAll("[data-ink]").forEach(function (el) { observer.observe(el); });
    } else {
      document.querySelectorAll("[data-ink]").forEach(function (el) { el.classList.add("is-inked"); });
    }

    // Mobile menu.
    var head = document.querySelector(".letterhead");
    var toggle = document.querySelector(".nav-toggle");
    if (head && toggle) {
      toggle.addEventListener("click", function () {
        var open = head.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", open ? "true" : "false");
      });
    }

    // Method flyout (hover/focus works without JS; this adds tap support).
    document.querySelectorAll(".nav-has-panel").forEach(function (li) {
      var caret = li.querySelector(".nav-caret");
      if (!caret) return;
      caret.addEventListener("click", function () {
        var open = li.classList.toggle("is-open");
        caret.setAttribute("aria-expanded", open ? "true" : "false");
      });
    });

    document.addEventListener("keydown", function (e) {
      if (e.key !== "Escape") return;
      document.querySelectorAll(".nav-has-panel.is-open").forEach(function (li) {
        li.classList.remove("is-open");
        var caret = li.querySelector(".nav-caret");
        if (caret) caret.setAttribute("aria-expanded", "false");
      });
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
