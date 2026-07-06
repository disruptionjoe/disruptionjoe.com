/* HOME: two experiential devices, one small file. No libraries.
   1. The Four Cs assemble themselves: each bar rises and hands off to the
      next, so the causality is performed, not captioned.
   2. Line / Circle / Sphere is manipulable: a hand-driven slider pulls
      scattered dots into coordination and the value readout changes.
   Without this file (or with reduced motion) the page rests in its
   finished, fully-lit state and the three shape panels tell the story. */
(function () {
  "use strict";

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- 1. The Four Cs build themselves ---------- */
  function armConsole() {
    var console_ = document.querySelector(".capability-console");
    if (!console_ || reduce || !("IntersectionObserver" in window)) return;

    var stages = Array.prototype.slice.call(console_.querySelectorAll(".stage"));
    if (!stages.length) return;

    console_.classList.add("console-live");
    var built = false;

    function build() {
      if (built) return;
      built = true;
      stages.forEach(function (stage, i) {
        window.setTimeout(function () {
          stage.classList.add("is-built");
        }, 260 + i * 660);
      });
    }

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { build(); io.disconnect(); }
      });
    }, { threshold: 0.35 });
    io.observe(console_);

    /* Backstop: never leave the bench dim if the observer misfires. */
    window.setTimeout(build, 6000);
  }

  /* ---------- 2. Line / Circle / Sphere, in the visitor's hands ---------- */
  function armBench() {
    var bench = document.getElementById("shape-bench");
    var slider = document.getElementById("shape-slider");
    var field = document.getElementById("shape-field");
    if (!bench || !slider || !field) return;

    var dots = Array.prototype.slice.call(field.querySelectorAll(".sf-dot"));
    var ring = field.querySelector(".sf-ring");
    var sphereEls = Array.prototype.slice.call(field.querySelectorAll(".sf-sphere"));
    var stateEl = bench.querySelector("[data-readout-state]");
    var econEl = bench.querySelector("[data-readout-econ]");
    var noteEl = bench.querySelector("[data-readout-note]");

    /* Where each dot rests when use is scattered (hand-placed), and where it
       lands once the team closes the loop (12 points on one circle). */
    var scatter = [
      [52, 196], [118, 84], [196, 150], [258, 58], [300, 204], [368, 110],
      [422, 186], [474, 66], [540, 148], [596, 210], [628, 92], [688, 168]
    ];
    var cx = 360, cy = 130, r = 86;
    var circle = scatter.map(function (_, i) {
      var a = (i / 12) * Math.PI * 2 - Math.PI / 2;
      return [cx + Math.cos(a) * r, cy + Math.sin(a) * r];
    });

    var states = {
      line:   { label: "Scattered use",          econ: "On the books: hidden cost",
                note: "Wins stay personal. The books feel it before anyone names it." },
      circle: { label: "Coordinated capability", econ: "On the books: savings",
                note: "Good moves get named and shared. The waste starts falling away." },
      sphere: { label: "Integrated capability",  econ: "On the books: new business value",
                note: "The skill belongs to the company now. New value gets reachable." }
    };

    function ease(k) { return k * k * (3 - 2 * k); }
    function clamp(v) { return Math.max(0, Math.min(1, v)); }

    function render() {
      var t = slider.value / 100;
      var k1 = ease(clamp(t / 0.55));          /* scattered -> circle */
      var k2 = ease(clamp((t - 0.6) / 0.4));   /* circle -> sphere */

      dots.forEach(function (dot, i) {
        var x = scatter[i][0] + (circle[i][0] - scatter[i][0]) * k1;
        var y = scatter[i][1] + (circle[i][1] - scatter[i][1]) * k1;
        dot.setAttribute("cx", x.toFixed(1));
        dot.setAttribute("cy", y.toFixed(1));
      });
      if (ring) ring.style.opacity = (k1 * .9).toFixed(2);
      sphereEls.forEach(function (el) { el.style.opacity = k2.toFixed(2); });

      var key = t < 0.35 ? "line" : (t < 0.75 ? "circle" : "sphere");
      if (bench.dataset.state !== key) {
        bench.dataset.state = key;
        stateEl.textContent = states[key].label;
        econEl.textContent = states[key].econ;
        noteEl.textContent = states[key].note;
      }
    }

    slider.addEventListener("input", render);

    /* The markup ships finished (sphere). Once we know hands are available,
       start the visitor at scattered so the journey is theirs to make. */
    slider.value = 0;
    render();
    bench.classList.add("bench-live");
  }

  function init() { armConsole(); armBench(); }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
