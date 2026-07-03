/* ============================================================
   SERVICES — survey wall travel sizing (page-scoped).
   Loaded ONLY by /services. Touches nothing shared.
   The wall is a horizontal row of framed commissions that
   travels past a fixed marker as you scroll. CSS drives the
   travel from the room's --p; this file only measures how far
   the rail must move so the LAST frame lands under the marker.
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

  ready(function () {
    var survey = document.querySelector(".survey");
    if (!survey) return;
    var pin = survey.querySelector(".survey-pin");
    var rail = survey.querySelector(".survey-rail");
    if (!pin || !rail) return;
    var frames = rail.querySelectorAll(".survey-frame");
    if (!frames.length) return;

    // Marker sits at 26% of the pin width; the rail's left padding matches,
    // so the first frame opens just to the right of the marker.
    var MARKER = 0.26;

    function compute() {
      // Only the pinned-travel layout needs a measured distance.
      if (!document.body.classList.contains("js-motion")) {
        survey.style.removeProperty("--rail-travel");
        return;
      }
      var w = pin.getBoundingClientRect().width;
      var markerX = MARKER * w;
      var last = frames[frames.length - 1];
      var lastCenter = last.offsetLeft + last.offsetWidth / 2;
      // Negative: move the rail left until the last frame's centre meets the marker.
      var travel = markerX - lastCenter;
      survey.style.setProperty("--rail-travel", travel + "px");
    }

    compute();
    window.addEventListener("resize", compute, { passive: true });
    window.addEventListener("orientationchange", compute, { passive: true });
    window.addEventListener("load", compute);
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(compute).catch(function () {});
    }
  });
})();
