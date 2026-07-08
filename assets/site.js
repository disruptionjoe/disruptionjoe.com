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
    var stages = Array.prototype.slice.call(root.querySelectorAll("[data-shape-stage]"));
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
      stages.forEach(function (stage) {
        stage.classList.toggle("is-active", stage.getAttribute("data-shape-stage") === key);
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

  function initHomeActivation() {
    var root = document.querySelector("[data-home-activation]");
    if (!root) return;
    var canvas = root.querySelector("[data-home-activation-canvas]");
    var overlay = root.querySelector("[data-home-activation-overlay]");
    var finale = root.querySelector("[data-home-activation-final]");
    if (!canvas || !overlay || !finale) return;

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var nodes = [
      { x: .14, y: .38 }, { x: .24, y: .66 }, { x: .30, y: .29 }, { x: .39, y: .52 },
      { x: .33, y: .79 }, { x: .47, y: .35 }, { x: .50, y: .67 }, { x: .58, y: .47 },
      { x: .55, y: .81 }, { x: .66, y: .27 }, { x: .71, y: .62 }, { x: .79, y: .43 },
      { x: .87, y: .69 }
    ].map(function (node) {
      return { x: node.x, y: node.y, act: -1 };
    });
    var edges = [[0,2],[0,1],[1,3],[1,4],[2,3],[2,5],[3,5],[3,6],[4,6],[5,7],[6,7],[6,8],[5,9],[7,9],[7,11],[7,10],[8,10],[9,11],[10,11],[10,12],[11,12]];
    var words = [
      { text: "curious", node: 2, sx: .40, sy: .10, hit: 2.55 },
      { text: "cautious", node: 0, sx: .05, sy: .62, hit: 2.85 },
      { text: "waiting", node: 1, sx: .16, sy: .93, hit: 3.15 },
      { text: "interested", node: 6, sx: .52, sy: .95, hit: 3.45 },
      { text: "skeptical", node: 4, sx: .30, sy: .96, hit: 3.75 },
      { text: "overwhelmed", node: 9, sx: .72, sy: .07, hit: 4.05 },
      { text: "busy", node: 11, sx: .95, sy: .20, hit: 4.35 },
      { text: "unsure", node: 8, sx: .60, sy: .97, hit: 4.65 }
    ];
    var spreads = [
      { node: 5, from: 2, at: 4.70 },
      { node: 3, from: 1, at: 5.00 },
      { node: 7, from: 6, at: 5.35 },
      { node: 10, from: 8, at: 5.70 },
      { node: 12, from: 11, at: 6.05 }
    ];
    var fragments = [
      { node: 2, off: [88, -8], text: "I could use this for proposals." },
      { node: 6, off: [92, 30], text: "This changes onboarding." },
      { node: 9, off: [-92, 40], text: "This could help our customers." },
      { node: 11, off: [-104, 38], text: "Wait, this is a product idea." },
      { node: 3, off: [6, 82], text: "I finally see where this fits." }
    ];
    var timing = { word: .7, wordSpan: 1.4, bloom: 7.2, finale: 7.5, hold: 1.8, end: 10.2 };
    var seed = 49734321;
    var raf = 0;
    var width = 0;
    var height = 0;
    var ix = function (x) { return x; };
    var iy = function (y) { return y; };

    function rnd() {
      seed ^= seed << 13;
      seed ^= seed >>> 17;
      seed ^= seed << 5;
      return (seed >>> 0) / 4294967296;
    }

    words.forEach(function (word, index) {
      word.inAt = timing.word + index * (timing.wordSpan / words.length);
      nodes[word.node].act = word.hit;
    });
    spreads.forEach(function (spread) {
      nodes[spread.node].act = spread.at + .55;
    });

    var sparks = nodes.map(function () {
      var list = [];
      for (var i = 0; i < 7; i += 1) {
        list.push({ angle: rnd() * Math.PI * 2, speed: 30 + rnd() * 46, length: 6 + rnd() * 7 });
      }
      return list;
    });

    fragments.forEach(function (fragment) {
      fragment.inAt = nodes[fragment.node].act + .45;
      var el = document.createElement("div");
      el.className = "home-activation-frag";
      el.textContent = fragment.text;
      overlay.appendChild(el);
      fragment.el = el;
    });

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }

    function smooth(value) {
      var t = clamp(value, 0, 1);
      return t * t * (3 - 2 * t);
    }

    function easeOut(value) {
      var t = clamp(value, 0, 1);
      return 1 - (1 - t) * (1 - t);
    }

    function resize() {
      var rect = canvas.getBoundingClientRect();
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      var dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ix = function (x) { return .055 * width + x * .89 * width; };
      iy = function (y) { return .13 * height + y * .74 * height; };
    }

    function nodeAct(index, time) {
      var act = nodes[index].act;
      return act < 0 ? 0 : smooth((time - act) / .62);
    }

    function draw(time) {
      ctx.clearRect(0, 0, width, height);
      var netFade = smooth(time / .7);
      var bloom = 0;
      nodes.forEach(function (_, index) { bloom += nodeAct(index, time); });
      bloom /= nodes.length;
      var surge = Math.exp(-Math.pow((time - timing.bloom) / .95, 2));

      if (bloom > .01 || surge > .01) {
        var glow = ctx.createRadialGradient(width * .5, height * .52, 0, width * .5, height * .52, Math.max(width, height) * .62);
        var alpha = .10 * bloom + .16 * surge;
        glow.addColorStop(0, "rgba(212,188,148," + alpha + ")");
        glow.addColorStop(.5, "rgba(212,188,148," + (alpha * .32) + ")");
        glow.addColorStop(1, "rgba(212,188,148,0)");
        ctx.fillStyle = glow;
        ctx.fillRect(0, 0, width, height);
      }

      edges.forEach(function (edge) {
        var from = nodes[edge[0]];
        var to = nodes[edge[1]];
        var lit = Math.min(nodeAct(edge[0], time), nodeAct(edge[1], time));
        ctx.strokeStyle = "rgba(212,188,148," + (.16 * netFade + lit * .36 + lit * surge * .28) + ")";
        ctx.lineWidth = .6 + lit * 1.1;
        ctx.beginPath();
        ctx.moveTo(ix(from.x), iy(from.y));
        ctx.lineTo(ix(to.x), iy(to.y));
        ctx.stroke();
      });

      spreads.forEach(function (spread) {
        var u = (time - spread.at) / .55;
        if (u <= 0 || u >= 1.25) return;
        var from = nodes[spread.from];
        var to = nodes[spread.node];
        var p = easeOut(Math.min(u, 1));
        var x = ix(from.x) + (ix(to.x) - ix(from.x)) * p;
        var y = iy(from.y) + (iy(to.y) - iy(from.y)) * p;
        var fade = clamp(1.25 - u, 0, 1);
        ctx.fillStyle = "rgba(240,236,228," + (.9 * fade) + ")";
        ctx.beginPath();
        ctx.arc(x, y, 2.6, 0, Math.PI * 2);
        ctx.fill();
      });

      nodes.forEach(function (node, index) {
        var x = ix(node.x);
        var y = iy(node.y);
        var active = nodeAct(index, time);
        var breathe = 1 + .06 * Math.sin(time * 1.6 + index);
        var halo = .18 * netFade + active * .58 + active * surge * .48;
        if (halo > .01) {
          var radius = (10 + active * 30) * breathe;
          var nodeGlow = ctx.createRadialGradient(x, y, 0, x, y, radius);
          nodeGlow.addColorStop(0, "rgba(212,188,148," + (.34 * halo) + ")");
          nodeGlow.addColorStop(1, "rgba(212,188,148,0)");
          ctx.fillStyle = nodeGlow;
          ctx.beginPath();
          ctx.arc(x, y, radius, 0, Math.PI * 2);
          ctx.fill();
        }
        ctx.fillStyle = active > .02 ? "rgba(245,236,214," + (.44 * netFade + active * .95) + ")" : "rgba(170,170,170," + (.44 * netFade) + ")";
        ctx.beginPath();
        ctx.arc(x, y, (2.2 + active * 2.4) * breathe, 0, Math.PI * 2);
        ctx.fill();

        if (node.act >= 0) {
          var sparkTime = (time - node.act) / .78;
          if (sparkTime > 0 && sparkTime < 1) {
            var fadeSpark = 1 - sparkTime;
            var distance = easeOut(sparkTime);
            sparks[index].forEach(function (spark) {
              var sx = x + Math.cos(spark.angle) * spark.speed * distance;
              var sy = y + Math.sin(spark.angle) * spark.speed * distance;
              ctx.strokeStyle = "rgba(240,236,228," + (.85 * fadeSpark) + ")";
              ctx.lineWidth = 1.4 * fadeSpark;
              ctx.beginPath();
              ctx.moveTo(sx, sy);
              ctx.lineTo(sx - Math.cos(spark.angle) * spark.length * fadeSpark, sy - Math.sin(spark.angle) * spark.length * fadeSpark);
              ctx.stroke();
            });
          }
        }
      });

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = "600 12px 'Space Mono', monospace";
      words.forEach(function (word) {
        if (time < word.inAt) return;
        var node = nodes[word.node];
        var move = smooth((time - word.inAt) / (word.hit - word.inAt));
        var x = ix(word.sx) + (ix(node.x) - ix(word.sx)) * move;
        var y = iy(word.sy) + (iy(node.y) - iy(word.sy)) * move;
        var opacity = .72;
        if (time < word.inAt + .45) opacity = smooth((time - word.inAt) / .45) * .72;
        if (time > word.hit - .18) opacity = clamp((word.hit - time) / .18, 0, 1) * .72;
        if (opacity <= .01) return;
        ctx.fillStyle = "rgba(170,170,170," + opacity + ")";
        ctx.fillText(word.text.toUpperCase(), x, y - 13);
      });
    }

    function updateDOM(time) {
      fragments.forEach(function (fragment) {
        var node = nodes[fragment.node];
        var x = ix(node.x) + fragment.off[0];
        var y = iy(node.y) + fragment.off[1];
        var opacity = smooth((time - fragment.inAt) / .5);
        if (time > timing.finale - .3) opacity *= clamp((timing.finale + .25 - time) / .55, 0, 1);
        fragment.el.style.opacity = opacity.toFixed(3);
        fragment.el.style.transform = "translate(-50%, -50%) translateY(" + ((1 - smooth((time - fragment.inAt) / .5)) * 8).toFixed(1) + "px)";
        fragment.el.style.left = x + "px";
        fragment.el.style.top = y + "px";
      });
      var inFinal = smooth((time - timing.finale) / .55);
      var outFinal = clamp((time - (timing.finale + timing.hold)) / .6, 0, 1);
      finale.style.opacity = (inFinal * (1 - outFinal)).toFixed(3);
      finale.style.transform = "translate(-50%, calc(-50% + " + (-outFinal * 22).toFixed(1) + "px)) scale(" + (.92 + .08 * inFinal).toFixed(3) + ")";
    }

    function render(time) {
      draw(time);
      updateDOM(time);
    }

    function start() {
      resize();
      window.cancelAnimationFrame(raf);
      if (reduceMotion) {
        render(timing.end);
        return;
      }
      var startTime = performance.now();
      function loop(now) {
        var elapsed = ((now - startTime) / 1000) % (timing.end + 2.5);
        render(Math.min(elapsed, timing.end));
        raf = window.requestAnimationFrame(loop);
      }
      raf = window.requestAnimationFrame(loop);
    }

    window.addEventListener("resize", function () {
      resize();
      if (reduceMotion) render(timing.end);
    }, { passive: true });
    start();
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
    initHomeActivation();
    initContactForm();
  });
})();
