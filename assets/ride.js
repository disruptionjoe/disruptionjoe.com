(function () {
  "use strict";

  var SLIDE_DELAY = 9000;
  var slides = Array.prototype.slice.call(document.querySelectorAll("[data-slide]"));
  if (!slides.length) return;

  var previous = document.querySelector("[data-previous]");
  var next = document.querySelector("[data-next]");
  var toggle = document.querySelector("[data-toggle]");
  var position = document.querySelector("[data-position]");
  var progress = document.querySelector("[data-progress]");
  var index = 0;
  var paused = false;
  var timer = 0;

  function render(nextIndex) {
    index = (nextIndex + slides.length) % slides.length;
    slides.forEach(function (slide, slideIndex) {
      var active = slideIndex === index;
      slide.classList.toggle("is-active", active);
      slide.setAttribute("aria-hidden", String(!active));
    });
    if (position) position.textContent = (index + 1) + " / " + slides.length;
    if (progress) progress.style.width = (((index + 1) / slides.length) * 100) + "%";
  }

  function stopTimer() {
    window.clearTimeout(timer);
    timer = 0;
  }

  function schedule() {
    stopTimer();
    if (paused || document.hidden) return;
    timer = window.setTimeout(function () {
      render(index + 1);
      schedule();
    }, SLIDE_DELAY);
  }

  function move(change) {
    render(index + change);
    schedule();
  }

  function setPaused(nextPaused) {
    paused = nextPaused;
    if (toggle) {
      toggle.textContent = paused ? "Play" : "Pause";
      toggle.setAttribute("aria-pressed", String(paused));
    }
    schedule();
  }

  if (previous) previous.addEventListener("click", function () { move(-1); });
  if (next) next.addEventListener("click", function () { move(1); });
  if (toggle) toggle.addEventListener("click", function () { setPaused(!paused); });

  document.addEventListener("keydown", function (event) {
    if (event.key === "ArrowLeft") move(-1);
    if (event.key === "ArrowRight") move(1);
    if (event.key === " " || event.key === "Spacebar") {
      event.preventDefault();
      setPaused(!paused);
    }
  });

  document.addEventListener("visibilitychange", schedule);
  render(0);
  schedule();
})();
