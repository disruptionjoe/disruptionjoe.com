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
    var root = document.querySelector("[data-playbook-experience]");
    if (!root) return;

    var spreads = Array.prototype.slice.call(root.querySelectorAll("[data-spread]"));
    var railButtons = Array.prototype.slice.call(root.querySelectorAll("[data-spread-target]"));
    var prev = root.querySelector("[data-prev]");
    var next = root.querySelector("[data-next]");
    var count = root.querySelector("[data-spread-count]");
    var bookSurface = root.querySelector("[data-book-surface]");
    var activeIndex = 0;
    var touchStartX = null;

    function pad(value) {
      return String(value).padStart(2, "0");
    }

    function setActive(nextIndex) {
      if (!spreads.length) return;
      var clamped = Math.max(0, Math.min(spreads.length - 1, nextIndex));
      var previousIndex = activeIndex;
      activeIndex = clamped;

      spreads.forEach(function (spread, index) {
        var active = index === activeIndex;
        spread.hidden = !active;
        spread.classList.toggle("is-active", active);
        spread.classList.toggle("is-exiting-left", index === previousIndex && activeIndex > previousIndex);
      });

      railButtons.forEach(function (button, index) {
        button.setAttribute("aria-current", String(index === activeIndex));
      });

      if (prev) prev.disabled = activeIndex === 0;
      if (next) next.disabled = activeIndex === spreads.length - 1;
      if (count) count.textContent = pad(activeIndex) + " / " + pad(spreads.length - 1);
    }

    function go(delta) {
      setActive(activeIndex + delta);
    }

    railButtons.forEach(function (button) {
      button.addEventListener("click", function () {
        setActive(Number(button.getAttribute("data-spread-target") || 0));
      });
    });

    if (prev) prev.addEventListener("click", function () { go(-1); });
    if (next) next.addEventListener("click", function () { go(1); });

    document.addEventListener("keydown", function (event) {
      if (event.key === "ArrowLeft") go(-1);
      if (event.key === "ArrowRight") go(1);
    });

    if (bookSurface) {
      bookSurface.addEventListener("touchstart", function (event) {
        touchStartX = event.changedTouches && event.changedTouches.length ? event.changedTouches[0].clientX : null;
      }, { passive: true });

      bookSurface.addEventListener("touchend", function (event) {
        if (touchStartX === null || !event.changedTouches || !event.changedTouches.length) return;
        var delta = event.changedTouches[0].clientX - touchStartX;
        touchStartX = null;
        if (Math.abs(delta) < 38) return;
        go(delta < 0 ? 1 : -1);
      }, { passive: true });

      bookSurface.addEventListener("click", function (event) {
        if (event.target.closest("a, button")) return;
        var rect = bookSurface.getBoundingClientRect();
        var midpoint = rect.left + rect.width / 2;
        go(event.clientX < midpoint ? -1 : 1);
      });
    }

    setActive(0);
  });
}());
