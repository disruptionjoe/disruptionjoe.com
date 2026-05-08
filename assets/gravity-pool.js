/**
 * Gravity Pool of Problems
 *
 * Canvas-based physics demo: floating problem cards drawn into a central
 * "SESSION" gravity well. Used on the homepage (interactive, with input)
 * and on the /ride kiosk (auto-absorb mode, no input).
 *
 * Public API:
 *   const pool = window.initGravityPool({
 *     canvas,                // HTMLCanvasElement (required)
 *     problems,              // [{ text, type? }]   default list provided
 *     autoAbsorb,            // bool, default false
 *     absorbInterval,        // ms, default 4500
 *     maxCards,              // int, default 16
 *   });
 *   pool.addProblem(text);   // spawn a new card from the edge
 *   pool.start(); pool.stop(); pool.destroy();
 */
(function () {
  'use strict';

  const DEFAULT_PROBLEMS = [
    { text: 'Roll out Copilot to 200 people' },
    { text: "Marketing can't agree on Q3 priorities" },
    { text: 'Should we use AI in customer support?' },
    { text: 'Redesign the customer journey' },
    { text: 'Build an AI strategy for next year' },
    { text: 'Quarterly planning is broken' },
    { text: 'Adopt Cursor across engineering' },
    { text: 'Sales handoff is leaking deals' },
    { text: 'AI guidelines for the legal team' },
    { text: 'New product positioning' },
    { text: 'Train the team on prompting' },
    { text: 'Onboarding is too slow' },
    { text: 'Choose between Claude and GPT' },
    { text: 'Reset team OKRs' },
    { text: 'Generative AI in marketing' },
    { text: 'Restructure the leadership team' },
    { text: 'Deploy a chatbot for sales' },
    { text: 'Pricing model needs rethinking' },
    { text: 'Stand up an AI ethics review' },
    { text: 'Customer churn is climbing' },
  ];

  function clamp(v, min, max) { return Math.max(min, Math.min(max, v)); }

  function inferType(text) {
    return /\bai\b|copilot|cursor|gpt|claude|chatbot|gen-?ai|generative|prompt|llm|bot/i.test(text)
      ? 'ai' : 'biz';
  }

  window.initGravityPool = function initGravityPool(opts) {
    const canvas = opts.canvas;
    if (!canvas) throw new Error('initGravityPool: canvas required');
    const problems = (opts.problems || DEFAULT_PROBLEMS).map(p => ({
      text: p.text,
      type: p.type || inferType(p.text),
    }));
    const autoAbsorb = !!opts.autoAbsorb;
    const absorbInterval = opts.absorbInterval || 4500;
    const maxCards = opts.maxCards || 16;

    const ctx = canvas.getContext('2d');
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    let width = 0, height = 0, centerX = 0, centerY = 0;

    function resize() {
      const rect = canvas.getBoundingClientRect();
      if (rect.width <= 0 || rect.height <= 0) return;
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      width = rect.width;
      height = rect.height;
      centerX = width / 2;
      centerY = height / 2;
    }

    const cards = [];

    function makeCard(p, fromEdge = false) {
      const minDim = Math.min(width, height) || 400;
      const isCompact = minDim < 500;
      const fontSize = isCompact ? 11 : 13;
      const padX = isCompact ? 14 : 28;
      const maxW = isCompact ? Math.min(140, width * 0.42) : 240;
      const minW = isCompact ? 80 : 110;
      const h = isCompact ? 28 : 36;

      ctx.font = '500 ' + fontSize + 'px "Space Grotesk", -apple-system, sans-serif';

      // Truncate text with ellipsis to fit in maxW
      let display = p.text;
      let textW = ctx.measureText(display).width;
      if (textW + padX > maxW) {
        while (display.length > 4) {
          display = display.slice(0, -1);
          textW = ctx.measureText(display + '…').width;
          if (textW + padX <= maxW) break;
        }
        display = display + '…';
      }

      const w = clamp(ctx.measureText(display).width + padX, minW, maxW);

      // Bound restDist by canvas shape so circular orbits fit within rectangular bounds
      const halfW = (width / 2) - (w / 2) - 8;
      const halfH = (height / 2) - (h / 2) - 8;
      const maxOrbit = Math.max(60, Math.min(halfW, halfH));
      const cardExtent = Math.max(w, h) * 0.55;
      const innerR = minDim * 0.14 + cardExtent;
      const orbitRange = Math.max(20, maxOrbit - innerR);
      const restDist = innerR + Math.random() * orbitRange;

      const angle = Math.random() * Math.PI * 2;
      const r = fromEdge ? Math.max(width, height) * 0.65 : restDist;
      const speed = 0.35 + Math.random() * 0.45;
      const dir = Math.random() > 0.5 ? 1 : -1;

      return {
        text: display,
        type: p.type,
        fontSize,
        x: centerX + Math.cos(angle) * r,
        y: centerY + Math.sin(angle) * r,
        vx: -Math.sin(angle) * speed * dir,
        vy: Math.cos(angle) * speed * dir,
        w, h,
        restDist,
        opacity: fromEdge ? 0 : 1,
        absorbing: false,
        absorbStart: 0,
        dragOffsetX: 0,
        dragOffsetY: 0,
      };
    }

    function init() {
      resize();
      cards.length = 0;
      // Adapt card count to canvas area so small viewports don't choke
      const area = width * height;
      const adaptive = Math.max(5, Math.min(maxCards, Math.round(area / 28000)));
      const slice = problems.slice(0, Math.min(adaptive, problems.length));
      for (const p of slice) cards.push(makeCard(p));
    }

    // Drag
    let dragging = null;
    let dragHistory = [];

    function getPos(e) {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    }

    function findCardAt(px, py) {
      for (let i = cards.length - 1; i >= 0; i--) {
        const c = cards[i];
        if (c.absorbing) continue;
        if (Math.abs(px - c.x) < c.w / 2 && Math.abs(py - c.y) < c.h / 2) return c;
      }
      return null;
    }

    function onPointerDown(e) {
      const { x, y } = getPos(e);
      const c = findCardAt(x, y);
      if (c) {
        try { canvas.setPointerCapture(e.pointerId); } catch (err) {}
        dragging = c;
        c.dragOffsetX = x - c.x;
        c.dragOffsetY = y - c.y;
        dragHistory = [{ x, y, t: performance.now() }];
        e.preventDefault();
      }
    }

    function onPointerMove(e) {
      if (!dragging) return;
      const { x, y } = getPos(e);
      dragging.x = x - dragging.dragOffsetX;
      dragging.y = y - dragging.dragOffsetY;
      const t = performance.now();
      dragHistory.push({ x, y, t });
      if (dragHistory.length > 6) dragHistory.shift();
      e.preventDefault();
    }

    function onPointerUp(e) {
      if (!dragging) return;
      // Compute fling velocity from recent pointer history
      if (dragHistory.length >= 2) {
        const a = dragHistory[0];
        const b = dragHistory[dragHistory.length - 1];
        const dt = Math.max(b.t - a.t, 1);
        dragging.vx = (b.x - a.x) / dt * 14;
        dragging.vy = (b.y - a.y) / dt * 14;
      }
      try { canvas.releasePointerCapture(e.pointerId); } catch (err) {}
      dragging = null;
      dragHistory = [];
    }

    canvas.addEventListener('pointerdown', onPointerDown);
    canvas.addEventListener('pointermove', onPointerMove);
    canvas.addEventListener('pointerup', onPointerUp);
    canvas.addEventListener('pointercancel', onPointerUp);
    canvas.addEventListener('pointerleave', onPointerUp);
    canvas.style.touchAction = 'none';

    // Auto absorb
    let absorbTimer = null;
    function maybeAbsorb() {
      const alive = cards.filter(c => !c.absorbing && c !== dragging);
      if (alive.length < 4) return;
      const target = alive[Math.floor(Math.random() * alive.length)];
      target.absorbing = true;
      target.absorbStart = performance.now();
    }

    // Animation
    let raf = null;
    let lastT = 0;
    let running = false;

    function step(now) {
      const dt = clamp((now - lastT) / 16.67, 0, 2);
      lastT = now;

      const minDim = Math.min(width, height) || 400;

      // Pairwise soft repulsion so cards spread out instead of overlapping
      for (let i = 0; i < cards.length; i++) {
        const a = cards[i];
        if (a.absorbing || a === dragging) continue;
        for (let j = i + 1; j < cards.length; j++) {
          const b = cards[j];
          if (b.absorbing) continue;
          const dx = b.x - a.x;
          const dy = b.y - a.y;
          const minX = (a.w + b.w) / 2 + 6;
          const minY = (a.h + b.h) / 2 + 6;
          const ax = Math.abs(dx);
          const ay = Math.abs(dy);
          if (ax < minX && ay < minY) {
            const overlapX = (minX - ax) / minX;
            const overlapY = (minY - ay) / minY;
            const overlap = Math.min(overlapX, overlapY);
            const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
            const ux = dx / dist;
            const uy = dy / dist;
            const force = 0.18 * overlap;
            a.vx -= ux * force * dt;
            a.vy -= uy * force * dt;
            if (b !== dragging) {
              b.vx += ux * force * dt;
              b.vy += uy * force * dt;
            }
          }
        }
      }

      for (const c of cards) {
        if (c === dragging) continue;
        if (c.absorbing) {
          const t = (now - c.absorbStart) / 700;
          if (t >= 1) { c.dead = true; continue; }
          c.x += (centerX - c.x) * 0.12 * dt;
          c.y += (centerY - c.y) * 0.12 * dt;
          c.opacity = 1 - t;
          continue;
        }
        if (c.opacity < 1) c.opacity = Math.min(1, c.opacity + 0.05 * dt);

        const dx = centerX - c.x;
        const dy = centerY - c.y;
        const dist = Math.sqrt(dx * dx + dy * dy) || 0.01;
        const ux = dx / dist;
        const uy = dy / dist;
        const offset = dist - c.restDist;

        // Spring-ish restoring force toward this card's rest distance
        c.vx += ux * offset * 0.0008 * dt;
        c.vy += uy * offset * 0.0008 * dt;

        // Tangential drift (gentle orbit)
        c.vx += -uy * 0.0022 * dt;
        c.vy += ux * 0.0022 * dt;

        // Rectangular containment: keep card edges inside the canvas
        const halfW = width / 2 - c.w / 2 - 4;
        const halfH = height / 2 - c.h / 2 - 4;
        const cxRel = c.x - centerX;
        const cyRel = c.y - centerY;
        if (Math.abs(cxRel) > halfW) {
          const over = Math.abs(cxRel) - halfW;
          c.vx -= Math.sign(cxRel) * over * 0.08 * dt;
          // hard clamp to avoid persistent off-screen drift
          c.x = centerX + Math.sign(cxRel) * (halfW + over * 0.5);
          c.vx *= 0.85;
        }
        if (Math.abs(cyRel) > halfH) {
          const over = Math.abs(cyRel) - halfH;
          c.vy -= Math.sign(cyRel) * over * 0.08 * dt;
          c.y = centerY + Math.sign(cyRel) * (halfH + over * 0.5);
          c.vy *= 0.85;
        }

        // Soft inner barrier: keep card edges out of the core
        const cardExtent = Math.max(c.w, c.h) * 0.55;
        const minR = Math.min(width, height) * 0.14 + cardExtent;
        if (dist < minR) {
          const push = (minR - dist);
          c.vx -= ux * push * 0.030 * dt;
          c.vy -= uy * push * 0.030 * dt;
        }

        // Damping
        c.vx *= 0.985;
        c.vy *= 0.985;

        const maxV = 5.5;
        const v2 = c.vx * c.vx + c.vy * c.vy;
        if (v2 > maxV * maxV) {
          const v = Math.sqrt(v2);
          c.vx = (c.vx / v) * maxV;
          c.vy = (c.vy / v) * maxV;
        }

        c.x += c.vx * dt;
        c.y += c.vy * dt;
      }

      for (let i = cards.length - 1; i >= 0; i--) {
        if (cards[i].dead) {
          cards.splice(i, 1);
          if (autoAbsorb && problems.length) {
            cards.push(makeCard(problems[Math.floor(Math.random() * problems.length)], true));
          }
        }
      }

      ctx.clearRect(0, 0, width, height);
      drawCore(now);
      const sorted = cards.slice().sort((a, b) => a.y - b.y);
      for (const c of sorted) drawCard(c);

      if (running) raf = requestAnimationFrame(step);
    }

    function drawCore(now) {
      const minDim = Math.min(width, height) || 400;
      const r = clamp(minDim * 0.07, 36, 78);

      // Outer ambient glow
      const g1 = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, r * 5);
      g1.addColorStop(0, 'rgba(212, 188, 148, 0.28)');
      g1.addColorStop(0.45, 'rgba(212, 188, 148, 0.06)');
      g1.addColorStop(1, 'rgba(212, 188, 148, 0)');
      ctx.fillStyle = g1;
      ctx.beginPath();
      ctx.arc(centerX, centerY, r * 5, 0, Math.PI * 2);
      ctx.fill();

      // Core fill
      ctx.beginPath();
      ctx.arc(centerX, centerY, r, 0, Math.PI * 2);
      ctx.fillStyle = '#0a0a0a';
      ctx.fill();
      ctx.strokeStyle = 'rgba(212, 188, 148, 0.85)';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Pulse ring
      const pulse = (Math.sin(now / 1100) + 1) / 2;
      ctx.beginPath();
      ctx.arc(centerX, centerY, r + 5 + pulse * 10, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(212, 188, 148, ' + (0.30 * (1 - pulse)).toFixed(3) + ')';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Label
      ctx.fillStyle = '#f5f5f5';
      ctx.font = '700 ' + clamp(minDim * 0.024, 11, 16) + 'px "Space Mono", monospace';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('SESSION', centerX, centerY);
    }

    function drawCard(c) {
      ctx.save();
      ctx.globalAlpha = c.opacity;

      const x = c.x - c.w / 2;
      const y = c.y - c.h / 2;
      const r = 5;

      ctx.fillStyle = c.type === 'ai'
        ? 'rgba(212, 188, 148, 0.08)'
        : 'rgba(245, 245, 245, 0.045)';
      ctx.strokeStyle = c === dragging
        ? 'rgba(212, 188, 148, 0.95)'
        : c.type === 'ai'
          ? 'rgba(212, 188, 148, 0.50)'
          : 'rgba(245, 245, 245, 0.22)';
      ctx.lineWidth = c === dragging ? 1.5 : 1;

      ctx.beginPath();
      ctx.moveTo(x + r, y);
      ctx.arcTo(x + c.w, y, x + c.w, y + c.h, r);
      ctx.arcTo(x + c.w, y + c.h, x, y + c.h, r);
      ctx.arcTo(x, y + c.h, x, y, r);
      ctx.arcTo(x, y, x + c.w, y, r);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = c.type === 'ai' ? '#d4bc94' : '#cccccc';
      ctx.font = '500 ' + (c.fontSize || 13) + 'px "Space Grotesk", -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(c.text, c.x, c.y);

      ctx.restore();
    }

    function start() {
      if (running) return;
      running = true;
      lastT = performance.now();
      raf = requestAnimationFrame(step);
      if (autoAbsorb && !absorbTimer) absorbTimer = setInterval(maybeAbsorb, absorbInterval);
    }

    function stop() {
      running = false;
      if (raf) cancelAnimationFrame(raf);
      raf = null;
      if (absorbTimer) clearInterval(absorbTimer);
      absorbTimer = null;
    }

    function destroy() {
      stop();
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('pointerleave', onPointerUp);
      window.removeEventListener('resize', onWindowResize);
    }

    function addProblem(text) {
      const card = makeCard({ text, type: inferType(text) }, true);
      cards.push(card);
      while (cards.length > maxCards + 4) cards.shift();
    }

    function onWindowResize() { resize(); }
    window.addEventListener('resize', onWindowResize);

    init();

    return { addProblem, start, stop, destroy };
  };
})();
