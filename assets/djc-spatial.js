(function () {
  "use strict";

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
    var update = function () {
      nav.classList.toggle("is-scrolled", window.scrollY > 18);
    };
    update();
    window.addEventListener("scroll", update, { passive: true });
  }

  function initReveal() {
    var items = Array.prototype.slice.call(document.querySelectorAll(".reveal"));
    if (!items.length) return;
    if (!("IntersectionObserver" in window)) {
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
    }, { rootMargin: "0px 0px -10% 0px", threshold: 0.08 });
    items.forEach(function (item) { observer.observe(item); });
  }

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
        title: "Practice before explanation",
        text: "People build confidence when they try the work in a room that is designed for uneven readiness.",
        change: "The session moves from passive awareness to visible behavior."
      },
      reflection: {
        symbol: "02",
        title: "Reflection turns use into judgment",
        text: "The point is not better prompts. The point is helping people notice what good work feels like with AI in the loop.",
        change: "Participants leave with sharper questions and shared language."
      },
      sensing: {
        symbol: "03",
        title: "The room reveals the system",
        text: "A well-designed activation makes confidence gaps, workflow friction, standards gaps, and ready-to-scale opportunities visible.",
        change: "Leaders see more than participation. They see organizational signal."
      },
      modular: {
        symbol: "04",
        title: "A modular system for changing tools",
        text: "The Playbook is built for a world where tools keep changing. Teams learn how to keep learning with AI.",
        change: "The capability survives the next tool wave."
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

  function initStudio() {
    var root = document.querySelector("[data-studio]");
    if (!root) return;
    var tabs = Array.prototype.slice.call(root.querySelectorAll("[data-studio-tab]"));
    var rooms = Array.prototype.slice.call(root.querySelectorAll("[data-studio-room]"));

    function select(key) {
      tabs.forEach(function (tab) {
        tab.setAttribute("aria-selected", String(tab.getAttribute("data-studio-tab") === key));
      });
      rooms.forEach(function (room) {
        room.classList.toggle("is-active", room.getAttribute("data-studio-room") === key);
      });
    }

    tabs.forEach(function (tab) {
      tab.addEventListener("click", function () { select(tab.getAttribute("data-studio-tab")); });
    });
    select(tabs[0] && tabs[0].getAttribute("data-studio-tab"));
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
        source: "contact",
        sourcePage: "/contact"
      };

      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).then(function (res) {
        if (!res.ok) throw new Error("Contact request failed");
        if (status) status.textContent = "Thanks. Joe will read this and reply directly.";
        form.reset();
      }).catch(function () {
        if (status) {
          status.className = "form-status error";
          status.textContent = "Something did not send. You can email joe@disruptionjoe.com directly.";
        }
      }).finally(function () {
        if (submit) submit.disabled = false;
      });
    });
  }

  ready(function () {
    initNav();
    initReveal();
    initBook();
    initStudio();
    initContactForm();
  });
})();
