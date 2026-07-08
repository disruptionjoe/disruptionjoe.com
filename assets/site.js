(function () {
  "use strict";

  var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var canMotion = !reduceMotion && "IntersectionObserver" in window;

  function ready(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn, { once: true });
    } else {
      fn();
    }
  }

  function initNav() {
    var nav = document.querySelector(".site-nav");
    if (!nav) return;

    var toggle = nav.querySelector(".nav-toggle");
    if (toggle) {
      toggle.addEventListener("click", function () {
        var open = nav.classList.toggle("is-open");
        toggle.setAttribute("aria-expanded", String(open));
      });
    }

    var parent = nav.querySelector(".nav-parent");
    var panel = nav.querySelector(".nav-panel");
    if (parent && panel) {
      parent.addEventListener("click", function () {
        var open = panel.classList.toggle("is-open");
        parent.setAttribute("aria-expanded", String(open));
      });
      document.addEventListener("click", function (event) {
        if (!nav.contains(event.target)) {
          panel.classList.remove("is-open");
          parent.setAttribute("aria-expanded", "false");
        }
      });
    }

    function setScrolled() {
      nav.classList.toggle("is-scrolled", window.scrollY > 16);
    }

    window.addEventListener("scroll", setScrolled, { passive: true });
    setScrolled();
  }

  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!items.length) return;
    if (!canMotion) {
      items.forEach(function (item) { item.classList.add("is-visible"); });
      return;
    }
    document.body.classList.add("js-motion");
    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          io.unobserve(entry.target);
        }
      });
    }, { threshold: .12, rootMargin: "0px 0px -10% 0px" });
    items.forEach(function (item) { io.observe(item); });
  }

  function initPointerLight() {
    if (reduceMotion || window.matchMedia("(pointer: coarse)").matches) return;
    var frames = Array.prototype.slice.call(document.querySelectorAll("[data-light]"));
    frames.forEach(function (frame) {
      frame.addEventListener("pointermove", function (event) {
        var rect = frame.getBoundingClientRect();
        var x = Math.round(((event.clientX - rect.left) / rect.width) * 100);
        var y = Math.round(((event.clientY - rect.top) / rect.height) * 100);
        frame.style.setProperty("--mx", x + "%");
        frame.style.setProperty("--my", y + "%");
      }, { passive: true });
      frame.addEventListener("pointerleave", function () {
        frame.style.removeProperty("--mx");
        frame.style.removeProperty("--my");
      });
    });
  }

  function initShapeLab() {
    var root = document.querySelector("[data-shape-lab]");
    if (!root) return;
    var object = root.querySelector("[data-shape-object]");
    var title = root.querySelector("[data-shape-title]");
    var text = root.querySelector("[data-shape-text]");
    var buttons = Array.prototype.slice.call(root.querySelectorAll("[data-shape-button]"));
    var copy = {
      line: {
        title: "Training and workflow experiments cost money.",
        text: "People start learning, testing prompts, optimizing workflows, and building private shortcuts. Some of it helps. Much of it is still paid discovery the business cannot yet measure or repeat."
      },
      circle: {
        title: "Ordered workflows start saving money.",
        text: "The work becomes consistent enough to compare. Useful patterns are named, workflows get cleaner, and progress becomes measurable instead of anecdotal."
      },
      sphere: {
        title: "Better data starts compounding leverage.",
        text: "The organization iterates on the data, improves agent loops, and moves toward an agent operating system that keeps learning from the work itself."
      }
    };

    function select(key) {
      if (!copy[key]) return;
      if (object) object.setAttribute("data-shape", key);
      if (title) title.textContent = copy[key].title;
      if (text) text.textContent = copy[key].text;
      buttons.forEach(function (button) {
        button.setAttribute("aria-selected", String(button.getAttribute("data-shape-button") === key));
      });
    }

    buttons.forEach(function (button) {
      button.addEventListener("click", function () {
        select(button.getAttribute("data-shape-button"));
      });
    });
    select("line");
  }

  function initBook() {
    var root = document.querySelector("[data-book]");
    if (!root) return;
    var symbol = root.querySelector("[data-book-symbol]");
    var title = root.querySelector("[data-book-title]");
    var text = root.querySelector("[data-book-text]");
    var tabs = Array.prototype.slice.call(root.querySelectorAll("[data-book-tab]"));
    var spreads = {
      practice: ["01", "Practice on real work", "People trust new habits when they use AI on work that already matters, with enough room to be uneven at first."],
      compare: ["02", "Compare with peers", "The room gives people a shared language for what improved, what failed, and what deserves to become repeatable."],
      sense: ["03", "Read the organization", "Confidence gaps, workflow snags, manager readiness, missing standards, and transfer risks become visible while people work."],
      carry: ["04", "Carry it back", "The session leaves artifacts, standards, and next moves that help behavior survive the room."]
    };

    function select(key) {
      var spread = spreads[key];
      if (!spread) return;
      if (symbol) symbol.textContent = spread[0];
      if (title) title.textContent = spread[1];
      if (text) text.textContent = spread[2];
      tabs.forEach(function (tab) {
        tab.setAttribute("aria-selected", String(tab.getAttribute("data-book-tab") === key));
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () {
        select(tab.getAttribute("data-book-tab"));
      });
    });
    select("practice");
  }

  function initStudio() {
    var loader = document.querySelector(".studio-loader");
    if (loader) {
      window.setTimeout(function () {
        loader.classList.add("is-done");
      }, reduceMotion ? 0 : 850);
    }

    var tabs = Array.prototype.slice.call(document.querySelectorAll("[data-zone-link]"));
    var zones = Array.prototype.slice.call(document.querySelectorAll("[data-zone]"));
    if (!tabs.length || !zones.length || !("IntersectionObserver" in window)) return;

    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        var key = entry.target.getAttribute("data-zone");
        tabs.forEach(function (tab) {
          tab.setAttribute("aria-current", String(tab.getAttribute("data-zone-link") === key));
        });
      });
    }, { rootMargin: "-42% 0px -42% 0px", threshold: 0 });
    zones.forEach(function (zone) { spy.observe(zone); });
  }

  function initThinkingExperience() {
    var root = document.querySelector("[data-experience]");
    if (!root) return;
    var progressBar = root.querySelector("[data-experience-progress]");
    var roomLabel = root.querySelector("[data-experience-room]");
    var rooms = Array.prototype.slice.call(root.querySelectorAll("[data-room-title]"));
    var roomCount = rooms.length;
    if (!roomCount) return;
    document.body.style.setProperty("--experience-rooms", String(roomCount));

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function setActive(progress) {
      var index = clamp(Math.round(progress * (roomCount - 1)), 0, roomCount - 1);
      var title = rooms[index].getAttribute("data-room-title") || "entry";
      document.body.style.setProperty("--experience-position", String(index));
      rooms.forEach(function (room, roomIndex) {
        room.classList.toggle("is-current", roomIndex === index);
      });
      if (roomLabel) roomLabel.textContent = title;
    }

    function update() {
      if (window.matchMedia("(max-width: 980px)").matches) {
        document.body.style.setProperty("--experience-progress", "0");
        document.body.style.setProperty("--experience-position", "0");
        if (progressBar) progressBar.style.width = "0%";
        setActive(0);
        return;
      }
      var rect = root.getBoundingClientRect();
      var travel = root.offsetHeight - window.innerHeight;
      var raw = travel > 0 ? (-rect.top / travel) : 0;
      var progress = clamp(raw, 0, 1);
      document.body.style.setProperty("--experience-progress", progress.toFixed(4));
      if (progressBar) progressBar.style.width = (progress * 100).toFixed(2) + "%";
      setActive(progress);
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    update();
  }

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
        source: "site-contact",
        sourcePage: window.location.pathname
      };

      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).then(function (response) {
        if (!response.ok) throw new Error("Contact request failed");
        if (status) status.textContent = "Thanks. Joe will read this and reply directly.";
        form.reset();
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
    initNav();
    initReveal();
    initPointerLight();
    initShapeLab();
    initBook();
    initStudio();
    initThinkingExperience();
    initContactForm();
  });
})();
