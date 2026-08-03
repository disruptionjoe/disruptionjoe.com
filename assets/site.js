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

  function initAboutLightbox() {
    var images = Array.prototype.slice.call(document.querySelectorAll(".page-about .about-artifact img"));
    if (!images.length) return;

    var activeTrigger = null;
    var lightbox = document.createElement("div");
    lightbox.className = "about-lightbox";
    lightbox.setAttribute("role", "dialog");
    lightbox.setAttribute("aria-modal", "true");
    lightbox.setAttribute("aria-hidden", "true");
    lightbox.innerHTML = [
      '<button class="about-lightbox-close" type="button" aria-label="Close image view">Close</button>',
      '<figure class="about-lightbox-frame">',
      '<img alt="">',
      '<figcaption></figcaption>',
      '</figure>'
    ].join("");
    document.body.appendChild(lightbox);

    var lightboxImage = lightbox.querySelector("img");
    var lightboxCaption = lightbox.querySelector("figcaption");
    var closeButton = lightbox.querySelector("button");

    function getCaption(image) {
      var figure = image.closest("figure");
      var caption = figure ? figure.querySelector("figcaption") : null;
      return caption ? caption.textContent.trim() : image.alt || "About image";
    }

    function openLightbox(image) {
      activeTrigger = image;
      lightboxImage.src = image.currentSrc || image.src;
      lightboxImage.alt = image.alt || "";
      lightboxCaption.textContent = getCaption(image);
      lightbox.classList.add("is-open");
      lightbox.setAttribute("aria-hidden", "false");
      document.body.classList.add("has-about-lightbox");
      closeButton.focus();
    }

    function closeLightbox() {
      if (!lightbox.classList.contains("is-open")) return;
      lightbox.classList.remove("is-open");
      lightbox.setAttribute("aria-hidden", "true");
      document.body.classList.remove("has-about-lightbox");
      lightboxImage.removeAttribute("src");
      if (activeTrigger) activeTrigger.focus();
      activeTrigger = null;
    }

    images.forEach(function (image) {
      image.setAttribute("tabindex", "0");
      image.setAttribute("role", "button");
      image.setAttribute("aria-label", "Open larger view: " + getCaption(image));
      image.addEventListener("click", function () {
        openLightbox(image);
      });
      image.addEventListener("keydown", function (event) {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          openLightbox(image);
        }
      });
    });

    closeButton.addEventListener("click", closeLightbox);
    lightbox.addEventListener("click", function (event) {
      if (event.target === lightbox) closeLightbox();
    });
    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") closeLightbox();
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
    var disableQuery = document.body.classList.contains("page-method-experience")
      ? window.matchMedia("(max-width: 760px)")
      : window.matchMedia("(max-width: 980px)");

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
      if (disableQuery.matches) {
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

    function scrollToRoomFromHash() {
      if (!window.location.hash || disableQuery.matches) return;
      var key = window.location.hash.slice(1);
      var targetIndex = rooms.findIndex(function (room) {
        return room.id === key || room.getAttribute("data-room-title") === key;
      });
      if (targetIndex < 0 || roomCount < 2) return;
      var rootTop = root.getBoundingClientRect().top + window.scrollY;
      var travel = root.offsetHeight - window.innerHeight;
      var progress = targetIndex / (roomCount - 1);
      window.scrollTo({ top: rootTop + (travel * progress), behavior: "auto" });
      update();
    }

    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    window.addEventListener("hashchange", function () {
      window.requestAnimationFrame(scrollToRoomFromHash);
    });
    update();
    window.requestAnimationFrame(function () {
      window.requestAnimationFrame(scrollToRoomFromHash);
    });
  }

  function initHomeActivation() {
    var root = document.querySelector("[data-home-activation]");
    if (!root) return;
    var canvas = root.querySelector("[data-home-activation-canvas]");
    var overlay = root.querySelector("[data-home-activation-overlay]");
    var finale = root.querySelector("[data-home-activation-final]");
    var neon = root.querySelector("[data-home-activation-neon]");
    var roomFrame = root.querySelector(".activation-room-frame");
    var roomDepth = root.querySelector(".entry-depth");
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
    var timing = { word: .7, wordSpan: 1.4, bloom: 7.2, finale: 7.5, hold: 1.8, neonIn: 10.1, neonHold: 9.5, end: 21.5 };
    var restFrame = timing.neonIn + 1.6;
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

      if (neon) {
        var inNeon = smooth((time - timing.neonIn) / .8);
        var outNeon = clamp((time - (timing.neonIn + .8 + timing.neonHold)) / .9, 0, 1);
        var neonVis = inNeon * (1 - outNeon);
        neon.style.opacity = neonVis.toFixed(3);
        // as the neon rises, drop the rest of the animation background so it sits on near-black
        canvas.style.opacity = (1 - neonVis * .93).toFixed(3);
        if (roomFrame) roomFrame.style.opacity = (1 - neonVis).toFixed(3);
        if (roomDepth) roomDepth.style.opacity = (1 - neonVis).toFixed(3);
      }
    }

    function render(time) {
      draw(time);
      updateDOM(time);
    }

    function start() {
      resize();
      window.cancelAnimationFrame(raf);
      if (reduceMotion) {
        render(restFrame);
        return;
      }
      var startTime = performance.now();
      function loop(now) {
        var elapsed = ((now - startTime) / 1000) % (timing.end + 1.5);
        render(Math.min(elapsed, timing.end));
        raf = window.requestAnimationFrame(loop);
      }
      raf = window.requestAnimationFrame(loop);
    }

    window.addEventListener("resize", function () {
      resize();
      if (reduceMotion) render(restFrame);
    }, { passive: true });
    start();
  }

  function initServicesPathway() {
    var root = document.querySelector("[data-service-pathway]");
    if (!root) return;

    var panels = {
      situation: root.querySelector("[data-service-panel='situation']"),
      help: root.querySelector("[data-service-panel='help']"),
      result: root.querySelector("[data-service-panel='result']")
    };
    var step = root.querySelector("[data-service-step]");
    var progress = root.querySelector("[data-service-progress]");
    var room = root.querySelector("[data-service-room]");
    var helpTitle = root.querySelector("[data-service-help-title]");
    var helpBody = root.querySelector("[data-service-help-body]");
    var helpOptions = root.querySelector("[data-service-help-options]");
    var resultTitle = root.querySelector("[data-service-result-title]");
    var resultBody = root.querySelector("[data-service-result-body]");
    var resultList = root.querySelector("[data-service-result-list]");
    var resultLabel = root.querySelector("[data-service-result-label]");
    var resultService = root.querySelector("[data-service-result-service]");
    var resultNote = root.querySelector("[data-service-result-note]");
    var methodLink = root.querySelector("[data-service-method]");
    var intentField = root.querySelector("[data-service-intent]");
    var messageField = root.querySelector("[data-service-message]");
    var submitBtn = root.querySelector("[data-service-submit]");
    var state = { focus: "", help: "" };

    var paths = {
      readiness: {
        title: "The first question is readiness.",
        body: "Before I prescribe a workshop or an enablement plan, we work out whether you need a readiness read, a first safe practice room, or leadership aligned.",
        method: { href: "/method/#enablement", label: "See Enablement Architecture" },
        options: [
          {
            id: "diagnose-readiness",
            label: "Diagnose readiness",
            detail: "Find where people are ready, stuck, cautious, or already doing good work quietly.",
            title: "Book a planning call about AI readiness.",
            service: "AI Activation Planning",
            body: "We read your starting conditions honestly before deciding what to run.",
            bullets: ["Readiness signals", "Early friction", "Practical first move"],
            note: "Best when you need an honest read before committing to a plan.",
            selectIntent: "AI Activation Planning Call",
            message: "I want to talk about diagnosing AI readiness. We need to see where people are ready, cautious, stuck, or already doing useful work before choosing the right move."
          },
          {
            id: "leadership-alignment",
            label: "Align leadership",
            detail: "Get clear on priorities, risk, and what better work should mean before asking people to change.",
            title: "Book a planning call about leadership alignment.",
            service: "Strategic Advisory",
            body: "We name the real adoption problem, the decision pressure, and the first visible move.",
            bullets: ["Priority clarity", "Adoption pressure", "Decision frame"],
            note: "Best when unclear executive expectations are blocking the work.",
            selectIntent: "AI Activation Planning Call",
            message: "I want to talk about aligning leadership on AI adoption. We need clarity on priorities, risk, and what better work should mean before teams move."
          }
        ]
      },
      workshop: {
        title: "You need a room where practice changes behavior.",
        body: "The question is whether I design the room with you or facilitate the session directly.",
        method: { href: "/method/#playbook", label: "See the Playbook" },
        options: [
          {
            id: "design-workshop",
            label: "Design the workshop",
            detail: "Build the arc, exercises, prompts, and artifacts for a serious activation room.",
            title: "Book a planning call about designing an activation workshop.",
            service: "Activation Workshop Design",
            body: "We define the room, the people, the work they practice on, and what they leave with.",
            bullets: ["Session arc", "Real-work exercises", "Follow-through artifact"],
            note: "Best when your team can run the room but the design needs teeth.",
            selectIntent: "Activation session for a team",
            message: "I want to talk about designing an AI activation workshop. We need a session arc, real-work exercises, and artifacts people keep using."
          },
          {
            id: "run-workshop",
            label: "Run the activation room",
            detail: "Facilitate a live session where people use AI on work that matters and leave with real output.",
            title: "Book a planning call about running an activation session.",
            service: "Activation Sessions",
            body: "We identify the team, the work surface, and the behavior that needs to change in the room.",
            bullets: ["Live facilitation", "Practice on real work", "Behavior that transfers"],
            note: "Best when people need to feel the shift, not just hear about it.",
            selectIntent: "Activation session for a team",
            message: "I want to talk about running an AI activation session for a team. We need people to practice on real work and leave with output they can use."
          }
        ]
      },
      "facilitated-work": {
        title: "The work itself needs a room.",
        body: "The question is whether you need one problem solved or that pattern made repeatable.",
        method: { href: "/method/#playbook", label: "See the Playbook" },
        options: [
          {
            id: "solve-with-ai",
            label: "Facilitate the work",
            detail: "Put AI in the room to move a hard problem from ambiguity to decisions and artifacts.",
            title: "Book a planning call about facilitated AI-supported work.",
            service: "Facilitated Work",
            body: "We define the problem, who needs to be in the room, and the output that makes it worth it.",
            bullets: ["Problem framing", "AI in the loop", "Decision artifact"],
            note: "Best when you do not need training first, you need the work to move.",
            selectIntent: "Activation session for a team",
            message: "I want to talk about facilitated AI-supported work. We have a real problem or decision that needs a structured room with AI in the loop."
          },
          {
            id: "repeatable-room",
            label: "Make it repeatable",
            detail: "Turn a facilitated pattern that worked into a room your team can run again.",
            title: "Book a planning call about repeatable facilitated rooms.",
            service: "Facilitation System Design",
            body: "We work out what to make repeatable: inputs, moves, AI roles, review points, and artifacts.",
            bullets: ["Reusable room", "AI roles", "Review points"],
            note: "Best when one good room should become a standing practice.",
            selectIntent: "Activation session for a team",
            message: "I want to talk about turning a facilitated AI-supported pattern into something repeatable, with a room design, AI roles, and review points we can reuse."
          }
        ]
      },
      enablement: {
        title: "Scattered use needs an operating picture.",
        body: "The question is whether the next move is mapping what is happening or building the architecture to scale it.",
        method: { href: "/method/#enablement", label: "Enter Enablement Architecture" },
        options: [
          {
            id: "map-signals",
            label: "Map use cases and friction",
            detail: "Make the real work visible: where AI helps, where people are stuck, and what deserves attention.",
            title: "Book a planning call about mapping use cases and adoption signals.",
            service: "Use-Case and Friction Mapping",
            body: "We figure out what evidence exists and what leaders need to see before deciding.",
            bullets: ["Use-case map", "Friction signals", "Leadership readout"],
            note: "Best when there is activity but not enough visibility to manage it.",
            selectIntent: "Enablement Architecture",
            message: "I want to talk about mapping AI use cases, friction, and adoption signals. We need to see what is happening before deciding what to standardize or scale."
          },
          {
            id: "build-architecture",
            label: "Build enablement architecture",
            detail: "Create the standards, signals, workflows, and reinforcement that let good practice scale.",
            title: "Book a planning call about enablement architecture.",
            service: "AI Enablement Architecture",
            body: "We locate your current capability level and define what has to become true before AI work can scale.",
            bullets: ["Capability map", "Workflow standards", "Scaling signals"],
            note: "Best when scattered wins need to become organizational capability.",
            selectIntent: "Enablement Architecture",
            message: "I want to talk about AI Enablement Architecture. We have scattered AI use and need visibility, standards, signals, and a path to scale."
          }
        ]
      },
      advisory: {
        title: "The decision environment is moving.",
        body: "The question is whether leaders need strategic advice, governance thinking, or a sharper way to explore what is coming.",
        method: { href: "/method/#thinking", label: "Enter AI Accelerated Thinking" },
        options: [
          {
            id: "strategic-advisory",
            label: "Advise leadership",
            detail: "Think through adoption choices, investment priorities, governance, and what should happen next.",
            title: "Book a planning call about strategic AI advisory.",
            service: "Strategic Advisory",
            body: "We focus on the decisions leaders have to make and the evidence they need to make them.",
            bullets: ["Operating choices", "Governance questions", "Priority decisions"],
            note: "Best when you need sharper judgment before a program or platform decision.",
            selectIntent: "AI Activation Planning Call",
            message: "I want to talk about strategic AI advisory. Leaders need help thinking through adoption choices, governance, priorities, and what should happen next."
          },
          {
            id: "frontier-thinking",
            label: "Explore the frontier",
            detail: "Pressure-test ideas, implications, and emerging possibilities with my AI Accelerated Thinking practice.",
            title: "Book a planning call about frontier AI thinking.",
            service: "AI Accelerated Thinking",
            body: "We focus on the question that needs sharper exploration and how to make the thinking useful to the business.",
            bullets: ["Frontier question", "Business implications", "Useful output"],
            note: "Best when the issue is not basic adoption, it is judgment at the edge.",
            selectIntent: "AI Accelerated Thinking / speaking",
            message: "I want to talk about AI Accelerated Thinking. We have a frontier question or strategic implication that needs sharper exploration and a useful business output."
          }
        ]
      }
    };

    function showPanel(name) {
      Object.keys(panels).forEach(function (key) {
        var active = key === name;
        panels[key].hidden = !active;
        panels[key].classList.toggle("is-active", active);
      });
      var meta = {
        situation: ["01 / 03", "Current situation", "33%"],
        help: ["02 / 03", "Likely help", "66%"],
        result: ["03 / 03", "Planning-call focus", "100%"]
      }[name];
      if (step) step.textContent = meta[0];
      if (room) room.textContent = meta[1];
      if (progress) progress.style.width = meta[2];
    }

    function renderHelp(focus) {
      var path = paths[focus];
      if (!path || !helpOptions) return;
      helpTitle.textContent = path.title;
      helpBody.textContent = path.body;
      helpOptions.innerHTML = "";
      path.options.forEach(function (option, index) {
        var button = document.createElement("button");
        button.type = "button";
        button.setAttribute("data-service-help", option.id);
        button.innerHTML = "<span>0" + (index + 1) + "</span><strong></strong><small></small>";
        button.querySelector("strong").textContent = option.label;
        button.querySelector("small").textContent = option.detail;
        helpOptions.appendChild(button);
      });
      showPanel("help");
    }

    function findOption(focus, help) {
      var path = paths[focus];
      if (!path) return null;
      return path.options.filter(function (option) { return option.id === help; })[0] || null;
    }

    function renderResult() {
      var path = paths[state.focus];
      var option = findOption(state.focus, state.help);
      if (!path || !option) return;
      resultTitle.textContent = option.title;
      resultBody.textContent = option.body;
      resultLabel.textContent = "Recommended service";
      resultService.textContent = option.service;
      resultNote.textContent = option.note;
      resultList.innerHTML = "";
      option.bullets.forEach(function (item) {
        var li = document.createElement("li");
        li.textContent = item;
        resultList.appendChild(li);
      });
      if (intentField && option.selectIntent) intentField.value = option.selectIntent;
      if (messageField) messageField.value = option.message;
      if (submitBtn) submitBtn.textContent = option.title.replace("Book a planning call", "Book the planning call");
      methodLink.href = path.method.href;
      methodLink.textContent = path.method.label;
      showPanel("result");
    }

    root.addEventListener("click", function (event) {
      var start = event.target.closest("[data-service-start]");
      var help = event.target.closest("[data-service-help]");
      var back = event.target.closest("[data-service-back]");
      var reset = event.target.closest("[data-service-reset]");
      if (start) {
        state.focus = start.getAttribute("data-service-start");
        state.help = "";
        renderHelp(state.focus);
      }
      if (help) {
        state.help = help.getAttribute("data-service-help");
        renderResult();
      }
      if (back) {
        showPanel(state.help ? "help" : "situation");
        state.help = "";
      }
      if (reset) {
        state.focus = "";
        state.help = "";
        showPanel("situation");
      }
    });

    showPanel("situation");
  }

  function initContactForm() {
    var form = document.querySelector("[data-contact-form]");
    if (!form) return;

    var status = form.querySelector("[data-form-status]");
    var submit = form.querySelector("button[type='submit']");
    var next = form.querySelector("[data-contact-next]");
    var back = form.querySelector("[data-contact-back]");
    var intentStep = form.querySelector("[data-contact-step='intent']");
    var detailsStep = form.querySelector("[data-contact-step='details']");
    var successStep = form.querySelector("[data-contact-success]");
    var intentOptions = form.querySelector("[data-contact-intent-options]");
    var intentTitle = form.querySelector("[data-contact-intent-title]");
    var reference = form.querySelector("[data-contact-reference]");
    var stepReadout = document.querySelector("[data-contact-step-readout]");
    var params = new URLSearchParams(window.location.search);
    var intentParam = params.get("intent");
    var messageParam = params.get("message");
    var sourcePageParam = params.get("sourcePage");
    var serviceFocusParam = params.get("serviceFocus");

    function selectedIntent() {
      return form.querySelector("[name='intent']:checked");
    }

    function setStep(name) {
      var showingDetails = name === "details";
      document.body.classList.toggle("contact-details-active", showingDetails);
      intentStep.hidden = showingDetails;
      detailsStep.hidden = !showingDetails;
      successStep.hidden = true;
      if (stepReadout) stepReadout.textContent = showingDetails ? "Step 02 of 02" : "Step 01 of 02";
      if (showingDetails) {
        var selected = selectedIntent();
        if (selected && intentTitle) intentTitle.textContent = selected.value;
        window.requestAnimationFrame(function () {
          var firstEmpty = form.querySelector("[name='name']");
          if (firstEmpty) firstEmpty.focus({ preventScroll: true });
        });
      }
    }

    function addCustomIntent(value) {
      if (!intentOptions) return null;
      value = String(value || "").slice(0, 180);
      var label = document.createElement("label");
      label.className = "planning-path planning-path-custom";
      var radio = document.createElement("input");
      radio.type = "radio";
      radio.name = "intent";
      radio.value = value;
      var index = document.createElement("span");
      index.className = "planning-path-index";
      index.textContent = "+";
      var copy = document.createElement("span");
      copy.className = "planning-path-copy";
      var strong = document.createElement("strong");
      strong.textContent = value;
      copy.appendChild(strong);
      var arrow = document.createElement("span");
      arrow.className = "planning-path-arrow";
      arrow.setAttribute("aria-hidden", "true");
      arrow.textContent = "→";
      label.appendChild(radio);
      label.appendChild(index);
      label.appendChild(copy);
      label.appendChild(arrow);
      intentOptions.appendChild(label);
      return radio;
    }

    if (intentParam) {
      var radios = Array.prototype.slice.call(form.querySelectorAll("[name='intent']"));
      var intentField = radios.filter(function (radio) { return radio.value === intentParam; })[0];
      if (!intentField) intentField = addCustomIntent(intentParam);
      if (intentField) {
        intentField.checked = true;
        if (next) next.disabled = false;
      }
    }

    if (messageParam) {
      var messageField = form.querySelector("[name='message']");
      if (messageField && !messageField.value) messageField.value = messageParam;
    }

    form.addEventListener("change", function (event) {
      if (event.target.matches("[name='intent']") && next) next.disabled = false;
    });

    if (next) {
      next.addEventListener("click", function () {
        if (!selectedIntent()) return;
        setStep("details");
      });
    }

    if (back) {
      back.addEventListener("click", function () {
        if (status) {
          status.className = "form-status";
          status.textContent = "";
        }
        setStep("intent");
      });
    }

    form.addEventListener("submit", function (event) {
      event.preventDefault();
      if (!form.reportValidity()) return;

      if (status) {
        status.className = "form-status";
        status.textContent = "Sending your note...";
      }
      if (submit) {
        submit.disabled = true;
        submit.setAttribute("data-label", submit.textContent);
        submit.textContent = "Sending...";
      }

      var data = new FormData(form);
      var payload = {
        name: data.get("name") || "",
        email: data.get("email") || "",
        company: data.get("company") || "",
        intent: data.get("intent") || "Not sure yet",
        message: data.get("message") || "",
        website: data.get("website") || "",
        source: serviceFocusParam ? "services-pathway" : "site-contact",
        sourcePage: sourcePageParam || window.location.pathname,
        serviceFocus: serviceFocusParam || ""
      };

      fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      }).then(function (response) {
        return response.json().catch(function () { return {}; }).then(function (body) {
          if (!response.ok) {
            var error = new Error(body.error || "Contact request failed");
            error.code = body.code || "CONTACT_REQUEST_FAILED";
            error.submissionId = body.submissionId || "";
            throw error;
          }
          return body;
        });
      }).then(function (body) {
        detailsStep.hidden = true;
        successStep.hidden = false;
        if (stepReadout) stepReadout.textContent = "Complete";
        if (reference) reference.textContent = body.submissionId || "Received";
        successStep.focus({ preventScroll: true });
      }).catch(function (error) {
        if (status) {
          status.className = "form-status error";
          if (error.code === "CONTACT_NOT_CONFIGURED") {
            status.textContent = "The planning room is not connected yet. Your note is still here. Please email joe@disruptionjoe.com.";
          } else if (error.code === "CONTACT_DELIVERY_FAILED") {
            status.textContent = "Your note could not be delivered. Nothing was cleared. Try again or email joe@disruptionjoe.com."
              + (error.submissionId ? " Reference: " + error.submissionId + "." : "");
          } else if (error.code === "INVALID_CONTACT_REQUEST") {
            status.textContent = error.message;
          } else {
            status.textContent = "Your note could not be sent. Nothing was cleared. Please try again or email joe@disruptionjoe.com.";
          }
        }
      }).finally(function () {
        if (submit) {
          submit.disabled = false;
          submit.textContent = submit.getAttribute("data-label") || "Send the note";
          submit.removeAttribute("data-label");
        }
      });
    });

    if (intentParam && selectedIntent()) {
      setStep("details");
    } else {
      setStep("intent");
    }
  }

  ready(function () {
    initNav();
    initReveal();
    initPointerLight();
    initAboutLightbox();
    initShapeLab();
    initBook();
    initStudio();
    initThinkingExperience();
    initHomeActivation();
    initServicesPathway();
    initContactForm();
  });
})();
