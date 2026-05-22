(function () {
  "use strict";

  var path = window.location.pathname.replace(/\/+$/, "") || "/";
  if (path === "/ride" || path.indexOf("/ride/") === 0) return;
  if (path === "/blog" || path.indexOf("/blog/") === 0) return;

  function addPageClasses() {
    var body = document.body;
    if (!body) return;

    document.documentElement.classList.add("dj-activation-root");
    body.classList.add("dj-activation-page");

    var section = path === "/" ? "home" : path.split("/").filter(Boolean)[0];
    if (section) body.classList.add("dj-" + section.replace(/[^a-z0-9-]/gi, "").toLowerCase() + "-page");
  }

  function firstVisible(selectors) {
    for (var i = 0; i < selectors.length; i += 1) {
      var nodes = document.querySelectorAll(selectors[i]);
      for (var j = 0; j < nodes.length; j += 1) {
        var node = nodes[j];
        if (node && node.querySelector("h1") && node.getBoundingClientRect().height > 0) {
          return node;
        }
      }
    }
    return null;
  }

  function findHero() {
    return firstVisible([
      ".hero",
      ".svc-hero",
      ".design-hero",
      ".page-header",
      "main > header",
      "main > article",
      "main > section:first-child",
      ".page-container",
      "main"
    ]);
  }

  function addHeadlineShimmer(hero) {
    var headline = hero && hero.querySelector("h1");
    if (!headline) headline = document.querySelector("h1");
    if (!headline) return;
    headline.classList.add("dj-shimmer-headline");
  }

  function addHeroAccents(hero) {
    if (!hero || hero.querySelector(".dj-activation-sparkline")) return;
    hero.classList.add("dj-activated-hero");

    var one = document.createElement("span");
    var two = document.createElement("span");
    one.className = "dj-activation-sparkline one";
    two.className = "dj-activation-sparkline two";
    one.setAttribute("aria-hidden", "true");
    two.setAttribute("aria-hidden", "true");
    hero.appendChild(one);
    hero.appendChild(two);
  }

  function shouldAddField(hero) {
    if (!hero) return false;
    if (hero.classList.contains("svc-hero")) return false;
    if (hero.querySelector(".svc-hero-canvas, #heroCanvas, .dj-activation-field")) return false;
    return true;
  }

  function addActivationField(hero) {
    if (!shouldAddField(hero)) return null;

    var field = document.createElement("div");
    field.className = "dj-activation-field";
    field.setAttribute("aria-hidden", "true");
    field.innerHTML = [
      '<canvas class="dj-activation-canvas"></canvas>',
      '<span class="dj-depth-plane one"></span>',
      '<span class="dj-depth-plane two"></span>',
      '<span class="dj-depth-plane three"></span>'
    ].join("");

    hero.classList.add("dj-activation-has-field");
    hero.insertBefore(field, hero.firstChild);
    return field.querySelector("canvas");
  }

  function decorateSections() {
    var sections = document.querySelectorAll("section, main > article, main > header");
    sections.forEach(function (section) {
      section.classList.add("dj-activated-section");
    });
  }

  function shouldDecorateCard(node) {
    var className = typeof node.className === "string" ? node.className : "";
    var tagName = node.tagName ? node.tagName.toLowerCase() : "";
    var reject = /(^|\s)(card-label|form-error|success-state|hero-actions|cta-row|trust-passes|snapshot-outputs|hero-checklist)(\s|$)/;
    if (reject.test(className)) return false;
    if (tagName === "button" || tagName === "input" || tagName === "label") return false;

    var rect = node.getBoundingClientRect();
    if (rect.width < 130 || rect.height < 72) return false;
    return true;
  }

  function decorateCards() {
    var selector = [
      "section .card",
      "section [class*='-card']",
      "section [class*='Card']",
      "section [class*='-panel']",
      "section [class*='-tile']",
      "section [class*='module']",
      "section [class*='offer']",
      ".hero [class*='-card']",
      ".hero-form-card"
    ].join(",");

    var cards = document.querySelectorAll(selector);
    cards.forEach(function (card) {
      if (shouldDecorateCard(card)) card.classList.add("dj-activated-card");
    });
  }

  function decorateImage(img) {
    if (!img || img.closest("nav, footer")) return;

    var src = (img.getAttribute("src") || "").toLowerCase();
    if (src.indexOf("logo") !== -1 || src.indexOf("icon") !== -1) return;

    var rect = img.getBoundingClientRect();
    if (rect.width < 120 || rect.height < 80) return;

    img.classList.add("dj-activated-image");

    var wrap = img.parentElement;
    if (wrap && !wrap.matches("body, html") && !wrap.classList.contains("dj-activated-image-wrap")) {
      wrap.classList.add("dj-activated-image-wrap");
    }
  }

  function decorateImages() {
    var images = document.querySelectorAll("section img, main img, .hero img");
    images.forEach(function (img) {
      if (img.complete) {
        decorateImage(img);
      } else {
        img.addEventListener("load", function () { decorateImage(img); }, { once: true });
      }
    });
  }

  function makeRandom(seedValue) {
    var seed = seedValue;
    return function () {
      seed = (seed * 1664525 + 1013904223) % 4294967296;
      return seed / 4294967296;
    };
  }

  function initCanvas(canvas) {
    if (!canvas) return;

    var ctx = canvas.getContext("2d");
    if (!ctx) return;

    var width = 0;
    var height = 0;
    var dpr = 1;
    var nodes = [];
    var random = makeRandom(42);
    var resizeFrame = 0;

    function resize() {
      var rect = canvas.getBoundingClientRect();
      dpr = 1;
      width = Math.max(1, Math.floor(rect.width));
      height = Math.max(1, Math.floor(rect.height));
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      buildNodes();
    }

    function buildNodes() {
      random = makeRandom(42);
      nodes = [];
      var count = width < 720 ? 24 : 34;

      for (var i = 0; i < count; i += 1) {
        var leftBias = i < Math.floor(count * 0.34);
        var x = leftBias ? 0.08 + random() * 0.34 : 0.32 + random() * 0.62;
        var y = 0.14 + random() * 0.72;
        var z = 0.25 + random() * 0.95;

        nodes.push({
          x: x,
          y: y,
          baseX: x,
          baseY: y,
          vx: (random() - 0.5) * 0.0007,
          vy: (random() - 0.5) * 0.0007,
          z: z,
          phase: random() * Math.PI * 2,
          cool: random() > 0.94
        });
      }
    }

    function drawConnections(time) {
      for (var i = 0; i < nodes.length; i += 1) {
        for (var j = i + 1; j < nodes.length; j += 1) {
          var a = nodes[i];
          var b = nodes[j];
          var dx = a.x - b.x;
          var dy = a.y - b.y;
          var dz = Math.abs(a.z - b.z);
          var distance = Math.sqrt(dx * dx + dy * dy);
          var threshold = 0.108 - dz * 0.026;

          if (distance < threshold) {
            var alpha = Math.pow(1 - distance / threshold, 1.9) * (0.12 + Math.min(a.z, b.z) * 0.14);
            var ax = a.x * width;
            var ay = a.y * height;
            var bx = b.x * width;
            var by = b.y * height;

            ctx.beginPath();
            ctx.moveTo(ax, ay);
            ctx.lineTo(bx, by);
            ctx.strokeStyle = "rgba(212, 188, 148, " + alpha.toFixed(3) + ")";
            ctx.lineWidth = 0.42 + Math.min(a.z, b.z) * 0.36;
            ctx.stroke();

            if ((i + j) % 8 === 0) {
              var pulse = (time * 0.000055 + a.phase) % 1;
              var px = ax + (bx - ax) * pulse;
              var py = ay + (by - ay) * pulse;

              ctx.beginPath();
              ctx.arc(px, py, 1 + Math.min(a.z, b.z), 0, Math.PI * 2);
              ctx.fillStyle = "rgba(212, 188, 148, " + Math.min(0.42, alpha + 0.14).toFixed(3) + ")";
              ctx.shadowColor = "rgba(212, 188, 148, 0.3)";
              ctx.shadowBlur = 8;
              ctx.fill();
              ctx.shadowBlur = 0;
            }
          }
        }
      }
    }

    function drawNodes(time) {
      nodes.slice().sort(function (a, b) { return a.z - b.z; }).forEach(function (node) {
        var x = node.x * width;
        var y = node.y * height;
        var scale = 0.75 + node.z * 1.2;
        var alpha = 0.16 + node.z * 0.3;
        var pulse = 0.82 + Math.sin(time * 0.0012 + node.phase) * 0.18;
        var r = (1.25 + scale) * pulse;
        var color = node.cool ? "169, 216, 255" : "212, 188, 148";

        ctx.beginPath();
        ctx.arc(x, y, r + 4 * node.z, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + color + ", " + (alpha * 0.06).toFixed(3) + ")";
        ctx.fill();

        ctx.beginPath();
        ctx.arc(x, y, r, 0, Math.PI * 2);
        ctx.fillStyle = "rgba(" + color + ", " + alpha.toFixed(3) + ")";
        ctx.shadowColor = "rgba(" + color + ", 0.26)";
        ctx.shadowBlur = 6 + node.z * 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });
    }

    function draw(time) {
      ctx.clearRect(0, 0, width, height);
      ctx.globalCompositeOperation = "lighter";
      drawConnections(time);
      drawNodes(time);
      ctx.globalCompositeOperation = "source-over";
    }

    resize();
    draw(0);
    window.addEventListener("resize", function () {
      if (resizeFrame) window.cancelAnimationFrame(resizeFrame);
      resizeFrame = window.requestAnimationFrame(function () {
        resizeFrame = 0;
        resize();
        draw(0);
      });
    }, { passive: true });
  }

  function init() {
    addPageClasses();
    var hero = findHero();
    addHeadlineShimmer(hero);
    addHeroAccents(hero);
    decorateSections();
    decorateCards();
    decorateImages();
    initCanvas(addActivationField(hero));
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
