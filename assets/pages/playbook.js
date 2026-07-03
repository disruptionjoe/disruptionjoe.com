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

  ready(initPlaybookRoom);
})();
