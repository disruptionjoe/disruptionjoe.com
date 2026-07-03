/* ============================================================
   PLAYBOOK — "The room, illuminated"
   Page-scoped enhancement. Loads ONLY on /playbook/.
   Memorable moment: lamp-follow discovery. The warm green lamp
   tracks the pointer across the gallery and each practice bench
   brightens by proximity, so the visitor discovers the room by
   lighting it one station at a time.
   Every station keeps a lit, readable resting state; keyboard
   focus and reduced-motion/touch fall back to a fully lit room.
   No shared file is touched; this runs on its own rAF budget.
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

  var reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var coarse = window.matchMedia("(pointer: coarse)").matches;

  function initPlaybookRoom() {
    var room = document.querySelector("[data-lamp-room]");
    if (!room) return;

    var stations = Array.prototype.slice.call(room.querySelectorAll("[data-station]"));
    if (!stations.length) return;

    // No safe / meaningful pointer path: rest the whole room warmly lit
    // so keyboard, screen-reader, touch, and reduced-motion visitors are
    // never left in the dark and contrast holds at the tighter wash.
    if (reduce || coarse) {
      room.classList.add("all-lit");
      return;
    }

    room.classList.add("lamp-live");

    var pending = null;
    var queued = false;

    function apply() {
      queued = false;
      if (!pending) return;
      var px = pending.x;
      var py = pending.y;

      // Read all rects first, then write only paint-only custom properties
      // (--mx/--my/--lit affect gradients + opacity, never layout), so the
      // interleave costs no forced reflow.
      var rr = room.getBoundingClientRect();
      room.style.setProperty("--mx", (((px - rr.left) / rr.width) * 100).toFixed(2) + "%");
      room.style.setProperty("--my", (((py - rr.top) / rr.height) * 100).toFixed(2) + "%");

      for (var i = 0; i < stations.length; i++) {
        var s = stations[i];
        var r = s.getBoundingClientRect();
        var cx = r.left + r.width / 2;
        var cy = r.top + r.height / 2;
        var dx = px - cx;
        var dy = py - cy;
        var d = Math.sqrt(dx * dx + dy * dy);
        var reach = Math.max(r.width, r.height) * 0.85 + 200;
        var lit = 1 - Math.min(d / reach, 1);
        lit = lit * lit; // ease-in so the pool tightens as you approach
        s.style.setProperty("--lit", lit.toFixed(3));
      }
    }

    room.addEventListener("pointermove", function (event) {
      pending = { x: event.clientX, y: event.clientY };
      if (!queued) {
        queued = true;
        requestAnimationFrame(apply);
      }
    }, { passive: true });

    room.addEventListener("pointerleave", function () {
      room.style.removeProperty("--mx");
      room.style.removeProperty("--my");
      for (var i = 0; i < stations.length; i++) {
        stations[i].style.setProperty("--lit", "0");
      }
    });
  }

  /* ============================================================
     STEP INSIDE — the openable "Activation Playbook" book.
     Default markup is OPEN and fully readable, so no-JS and
     reduced-motion visitors get every spread as plain content.
     When motion is welcome, we enhance: the cover starts closed,
     a real button swings it open, and the four moves become
     spreads the visitor can page through one at a time.
     ============================================================ */
  function initPlaybookBook() {
    var book = document.querySelector("[data-playbook-book]");
    if (!book) return;

    var root = book.querySelector("[data-book-el]");
    var toggle = book.querySelector("[data-book-toggle]");
    var spreadsWrap = book.querySelector("[data-book-spreads]");
    var spreads = Array.prototype.slice.call(book.querySelectorAll("[data-spread]"));
    var prev = book.querySelector("[data-book-prev]");
    var next = book.querySelector("[data-book-next]");
    var close = book.querySelector("[data-book-close]");
    var indicator = book.querySelector("[data-book-indicator]");
    if (!root || !toggle || !spreadsWrap || !spreads.length) return;

    // Reduced motion: leave the fallback exactly as authored — cover as a
    // title plate, every spread open and readable, no pager. Nothing to do.
    if (reduce) return;

    root.classList.add("book-live");
    var current = 0;

    function showSpread(i) {
      current = i < 0 ? 0 : (i > spreads.length - 1 ? spreads.length - 1 : i);
      for (var k = 0; k < spreads.length; k++) {
        var on = k === current;
        spreads[k].classList.toggle("is-current", on);
        if (on) { spreads[k].removeAttribute("hidden"); }
        else { spreads[k].setAttribute("hidden", ""); }
      }
      if (indicator) {
        var title = spreads[current].getAttribute("data-spread-title") || "";
        indicator.textContent = "Spread " + (current + 1) + " of " + spreads.length + (title ? ": " + title : "");
      }
      if (prev) prev.disabled = current === 0;
      if (next) next.disabled = current === spreads.length - 1;
    }

    function setOpen(open, moveFocus) {
      root.classList.toggle("is-open", open);
      root.classList.toggle("is-closed", !open);
      toggle.setAttribute("aria-expanded", String(open));
      if (open) {
        spreadsWrap.removeAttribute("aria-hidden");
        showSpread(current);
        if (moveFocus) spreadsWrap.focus();
      } else {
        spreadsWrap.setAttribute("aria-hidden", "true");
        if (moveFocus) toggle.focus();
      }
    }

    toggle.addEventListener("click", function () {
      setOpen(!root.classList.contains("is-open"), true);
    });
    if (prev) prev.addEventListener("click", function () { showSpread(current - 1); });
    if (next) next.addEventListener("click", function () { showSpread(current + 1); });
    if (close) close.addEventListener("click", function () { setOpen(false, true); });

    // Arrow keys page through while the book is open; Escape closes it.
    book.addEventListener("keydown", function (event) {
      if (!root.classList.contains("is-open")) return;
      if (event.key === "ArrowRight") { event.preventDefault(); showSpread(current + 1); }
      else if (event.key === "ArrowLeft") { event.preventDefault(); showSpread(current - 1); }
      else if (event.key === "Escape" || event.key === "Esc") { setOpen(false, true); }
    });

    // Start closed for the "open the book" moment (no focus steal on load).
    showSpread(0);
    setOpen(false, false);
  }

  ready(function () {
    initPlaybookRoom();
    initPlaybookBook();
  });
})();
