(function () {
  "use strict";

  var root = document.querySelector("[data-thinking-game]");
  if (!root) return;

  var exhibits = [
    {
      title: "Time as Finality",
      kicker: "Practice room 01 / formalization lab",
      caption: "Path in the dark",
      image: "/assets/thinking/path-in-the-dark.jpg",
      link: "https://github.com/disruptionjoe/time-as-finality",
      body: "Can I get agents to help test the edge of cross-disciplinary research, where physics, philosophy, causality, records, and formal methods have to connect without turning into loose analogy?"
    },
    {
      title: "Temporal Issuance",
      kicker: "Practice room 02 / source-question chamber",
      caption: "New structure entering",
      image: "/assets/thinking/issuance-seed.jpg",
      link: "https://github.com/disruptionjoe/temporal-issuance",
      body: "Can I get agents to honestly investigate an idea that is hard to nail down, keeping ambiguity alive long enough to learn from it without letting the work become fog?"
    },
    {
      title: "GU Formalization",
      kicker: "Practice room 03 / boundary content room",
      caption: "The boundary gap",
      image: "/assets/thinking/permissions-gap.jpg",
      link: "https://github.com/disruptionjoe/gu-formalization",
      body: "Can I get agents to respectfully investigate a highly disputed claim at the edge of mathematical and physical reasoning, while making assumptions, failure points, and proof standards explicit?"
    },
    {
      title: "Architecture of Legitimacy",
      kicker: "Passion room / governance design",
      caption: "Contribution field",
      image: "/assets/thinking/parallax-spheres.jpg",
      link: "https://github.com/disruptionjoe/architecture-of-legitimacy",
      body: "Can I get agents to reason about legitimacy as a design problem, where contribution, credit, incentives, governance, and capture resistance have to become an operating system instead of an argument?"
    },
    {
      title: "Church of AI",
      kicker: "Purpose room / ecosystem entryway",
      caption: "Public threshold",
      image: "/assets/thinking/threshold-door.jpg",
      link: "https://github.com/disruptionjoe/church-of-ai",
      body: "Can I get agents to help build a public doorway for AI curiosity that has humor, standards, tools, and community energy without collapsing into hype, doctrine, or empty performance?"
    },
    {
      title: "Disruption Joe Profile",
      kicker: "Operator wall / public profile",
      caption: "Operator in the system",
      image: "/assets/thinking/quiet-power-user.jpg",
      link: "https://github.com/disruptionjoe/disruptionjoe-profile",
      body: "Can I get agents to maintain a high-signal operating profile that lets humans and other agents understand my work, judgment, evidence, services, and boundaries quickly?"
    },
    {
      title: "Disruption Joe Website",
      kicker: "Commercial front room / translation surface",
      caption: "Scattered marks becoming signal",
      image: "/assets/thinking/scattered-spheres.jpg",
      link: "https://github.com/disruptionjoe/disruptionjoe.com",
      body: "Can I get agents to translate a complex working system into a buyer-readable experience without losing the taste, stakes, specificity, and conversion clarity that make the work real?"
    }
  ];

  var canvas = root.querySelector("[data-game-canvas]");
  var startButton = root.querySelector("[data-game-start]");
  var status = root.querySelector("[data-game-status]");
  var instructions = root.querySelector("[data-game-instructions]");
  var proximity = root.querySelector("[data-game-proximity]");
  var proximityKicker = root.querySelector("[data-proximity-kicker]");
  var proximityTitle = root.querySelector("[data-proximity-title]");
  var proximityBody = root.querySelector("[data-proximity-body]");
  var proximityLink = root.querySelector("[data-proximity-link]");
  var inspector = root.querySelector("[data-game-inspector]");
  var inspectorClose = root.querySelector("[data-inspector-close]");
  var inspectorKicker = root.querySelector("[data-inspector-kicker]");
  var inspectorTitle = root.querySelector("[data-inspector-title]");
  var inspectorBody = root.querySelector("[data-inspector-body]");
  var inspectorLink = root.querySelector("[data-inspector-link]");
  var fallback = root.querySelector("[data-game-fallback]");
  var mobilePrev = root.querySelector("[data-mobile-prev]");
  var mobileNext = root.querySelector("[data-mobile-next]");
  var mobileInspect = root.querySelector("[data-mobile-inspect]");
  var mobileCount = root.querySelector("[data-mobile-count]");

  if (!canvas) return;

  function setStatus(text) {
    if (status) status.textContent = text;
  }

  function showFallback(message) {
    if (fallback) {
      fallback.hidden = false;
      var text = fallback.querySelector("p");
      if (text && message) text.textContent = message;
    }
    setStatus("graphics unavailable");
  }

  import("/assets/vendor/three.module.min.js").then(function (THREE) {
    initMuseum(THREE);
  }).catch(function () {
    showFallback("The local 3D library did not load. The current Thinking experience is still available.");
  });

  function initMuseum(THREE) {
    var isMobile = window.matchMedia("(max-width: 820px), (pointer: coarse)").matches;
    var scene = new THREE.Scene();
    scene.background = new THREE.Color(0x030302);

    var camera = new THREE.PerspectiveCamera(66, 1, 0.1, 120);
    camera.position.set(0, 1.68, 8.8);
    camera.rotation.order = "YXZ";

    var renderer;
    try {
      renderer = new THREE.WebGLRenderer({ canvas: canvas, antialias: true, alpha: false, powerPreference: "high-performance", preserveDrawingBuffer: true });
    } catch (error) {
      showFallback("The browser could not create a WebGL renderer for this experiment.");
      return;
    }

    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    renderer.outputColorSpace = THREE.SRGBColorSpace;

    var raycaster = new THREE.Raycaster();
    var pointer = new THREE.Vector2(0, 0);
    var interactive = [];
    var exhibitAnchors = [];
    var commandBillboard = null;
    var mobileIndex = 0;
    var currentProximityIndex = -1;
    var started = false;
    var yaw = 0;
    var pitch = 0;
    var keys = {};
    var lastFrameTime = performance.now();
    var roomBounds = { x: 7.3, zMin: -10.4, zMax: 9.5 };
    var centralObject = { x: 0, z: 0.1, radius: 1.85 };
    var proximityRange = 4.35;

    root.dataset.mode = isMobile ? "mobile" : "desktop";

    buildScene();
    resize();
    if (isMobile) {
      setMobileExhibit(0);
    } else {
      startDesktopExperience();
    }
    animate();
    setStatus(isMobile ? "guided walkthrough" : "arrow keys to move");
    root.dataset.ready = "true";

    if (startButton) {
      startButton.addEventListener("click", function () {
        startExperience();
      });
    }

    if (inspectorClose) {
      inspectorClose.addEventListener("click", closeInspector);
    }

    if (mobilePrev) {
      mobilePrev.addEventListener("click", function () {
        setMobileExhibit(mobileIndex - 1);
      });
    }

    if (mobileNext) {
      mobileNext.addEventListener("click", function () {
        setMobileExhibit(mobileIndex + 1);
      });
    }

    if (mobileInspect) {
      mobileInspect.addEventListener("click", function () {
        openInspector(mobileIndex);
      });
    }

    document.addEventListener("keydown", function (event) {
      keys[event.code] = true;
      keys[String(event.key).toLowerCase()] = true;
      root.dataset.lastKey = event.code + ":" + event.key;
      if (event.code.indexOf("Arrow") === 0) {
        event.preventDefault();
        dismissInstructions();
      }
      if (event.code === "Escape") {
        closeInspector();
        closeProximity();
      }
    });

    document.addEventListener("keyup", function (event) {
      keys[event.code] = false;
      keys[String(event.key).toLowerCase()] = false;
    });

    window.addEventListener("resize", function () {
      isMobile = window.matchMedia("(max-width: 820px), (pointer: coarse)").matches;
      root.dataset.mode = isMobile ? "mobile" : "desktop";
      resize();
      if (isMobile) setMobileExhibit(mobileIndex);
    }, { passive: true });

    function startExperience() {
      if (!isMobile) {
        startDesktopExperience();
        return;
      }
      started = true;
      root.dataset.started = "true";
      root.classList.add("is-started");
      closeInspector();
      setStatus("guided walkthrough");
      setMobileExhibit(mobileIndex);
    }

    function startDesktopExperience() {
      started = true;
      root.dataset.started = "true";
      root.classList.add("is-started");
      setStatus("arrow keys to move");
      window.setTimeout(dismissInstructions, 7200);
    }

    function dismissInstructions() {
      if (!instructions) return;
      root.classList.add("has-dismissed-instructions");
    }

    function resize() {
      var rect = root.getBoundingClientRect();
      var width = Math.max(1, Math.floor(rect.width));
      var height = Math.max(1, Math.floor(rect.height));
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    function buildScene() {
      var ambient = new THREE.AmbientLight(0xd8bd8a, 0.55);
      scene.add(ambient);

      var keyLight = new THREE.PointLight(0xffe3a6, 1.1, 22);
      keyLight.position.set(0, 4.8, 1);
      scene.add(keyLight);

      var backLight = new THREE.PointLight(0xd8bd8a, 0.7, 18);
      backLight.position.set(0, 3.6, -8);
      scene.add(backLight);

      addWireRoom();
      addCentralObject();
      addExhibits();
    }

    function addWireRoom() {
      var tan = new THREE.Color(0xd8bd8a);
      var gold = new THREE.Color(0xffe3a6);
      var grid = new THREE.GridHelper(18, 18, tan, tan);
      grid.material.transparent = true;
      grid.material.opacity = 0.20;
      grid.position.y = 0;
      scene.add(grid);

      addLineBox(new THREE.Vector3(0, 2.9, -0.6), new THREE.Vector3(17, 5.8, 22), 0.24);
      addLineBox(new THREE.Vector3(0, 2.9, -0.6), new THREE.Vector3(11.5, 4.4, 15.2), 0.18);

      var pathMaterial = new THREE.LineBasicMaterial({ color: gold, transparent: true, opacity: 0.36 });
      var points = [
        new THREE.Vector3(-5.6, 0.03, 8.5),
        new THREE.Vector3(-2.7, 0.03, 4.2),
        new THREE.Vector3(2.5, 0.03, 2.1),
        new THREE.Vector3(5.7, 0.03, -2.2),
        new THREE.Vector3(2.2, 0.03, -6.4),
        new THREE.Vector3(-2.4, 0.03, -8.4)
      ];
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), pathMaterial));
    }

    function addCentralObject() {
      var tanMaterial = new THREE.LineBasicMaterial({ color: 0xd8bd8a, transparent: true, opacity: 0.52 });
      var goldMaterial = new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.66 });
      var dimMaterial = new THREE.LineBasicMaterial({ color: 0xd8bd8a, transparent: true, opacity: 0.26 });
      var glassMaterial = new THREE.MeshBasicMaterial({ color: 0x0a0704, transparent: true, opacity: 0.42, side: THREE.DoubleSide });

      addLineBox(new THREE.Vector3(0, 0.58, centralObject.z), new THREE.Vector3(3.05, 1.16, 3.05), 0.42);
      addLineBox(new THREE.Vector3(0, 1.38, centralObject.z), new THREE.Vector3(2.15, 0.38, 2.15), 0.32);

      var slab = new THREE.Mesh(new THREE.CylinderGeometry(1.34, 1.34, 0.08, 6), glassMaterial);
      slab.position.set(0, 1.26, centralObject.z);
      slab.rotation.y = Math.PI / 6;
      scene.add(slab);

      var ring = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.TorusGeometry(1.28, 0.018, 8, 96)),
        goldMaterial
      );
      ring.position.set(0, 1.52, centralObject.z);
      ring.rotation.x = Math.PI / 2;
      scene.add(ring);

      var core = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.OctahedronGeometry(0.52, 1)),
        goldMaterial
      );
      core.position.set(0, 1.78, centralObject.z);
      scene.add(core);

      var haloOne = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.TorusGeometry(1.75, 0.012, 8, 112)),
        dimMaterial
      );
      haloOne.position.set(0, 0.05, centralObject.z);
      haloOne.rotation.x = Math.PI / 2;
      scene.add(haloOne);

      var haloTwo = haloOne.clone();
      haloTwo.scale.set(1.32, 1.32, 1.32);
      haloTwo.material = tanMaterial;
      haloTwo.material.opacity = 0.2;
      scene.add(haloTwo);

      var tableLabel = new THREE.Mesh(
        new THREE.PlaneGeometry(2.4, 0.52),
        new THREE.MeshBasicMaterial({ map: makeTableLabelTexture(), transparent: true, side: THREE.DoubleSide })
      );
      tableLabel.position.set(0, 0.9, centralObject.z + 1.56);
      tableLabel.rotation.x = -0.06;
      scene.add(tableLabel);

      commandBillboard = new THREE.Mesh(
        new THREE.PlaneGeometry(4.25, 2.05),
        new THREE.MeshBasicMaterial({ map: makeCommandCenterTexture(), transparent: true, side: THREE.DoubleSide })
      );
      commandBillboard.position.set(0, 3.05, centralObject.z);
      scene.add(commandBillboard);
    }

    function addLineBox(position, size, opacity) {
      var geo = new THREE.BoxGeometry(size.x, size.y, size.z);
      var edges = new THREE.EdgesGeometry(geo);
      var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xd8bd8a, transparent: true, opacity: opacity }));
      line.position.copy(position);
      scene.add(line);
    }

    function addExhibits() {
      var placements = [
        { wall: "left", x: -8.2, z: 6.4, y: 2.25, rotation: Math.PI / 2 },
        { wall: "right", x: 8.2, z: 5.0, y: 2.25, rotation: -Math.PI / 2 },
        { wall: "left", x: -8.2, z: 1.3, y: 2.25, rotation: Math.PI / 2 },
        { wall: "right", x: 8.2, z: -0.9, y: 2.25, rotation: -Math.PI / 2 },
        { wall: "left", x: -8.2, z: -4.4, y: 2.25, rotation: Math.PI / 2 },
        { wall: "right", x: 8.2, z: -5.9, y: 2.25, rotation: -Math.PI / 2 },
        { wall: "back", x: 0, z: -10.25, y: 2.25, rotation: 0 }
      ];

      exhibits.forEach(function (exhibit, index) {
        var place = placements[index];
        var group = new THREE.Group();
        group.position.set(place.x, place.y, place.z);
        group.rotation.y = place.rotation;
        group.userData.exhibitIndex = index;

        var plate = new THREE.Mesh(
          new THREE.PlaneGeometry(3.6, 3.9),
          new THREE.MeshBasicMaterial({ color: 0x080604, transparent: true, opacity: 0.82, side: THREE.DoubleSide })
        );
        plate.position.z = -0.02;
        plate.userData.exhibitIndex = index;
        group.add(plate);
        interactive.push(plate);

        var texture = new THREE.TextureLoader().load(exhibit.image);
        texture.colorSpace = THREE.SRGBColorSpace;
        var image = new THREE.Mesh(
          new THREE.PlaneGeometry(2.5, 1.55),
          new THREE.MeshBasicMaterial({ map: texture, transparent: true })
        );
        image.position.set(0, 0.78, 0.03);
        image.userData.exhibitIndex = index;
        group.add(image);
        interactive.push(image);

        var label = new THREE.Mesh(
          new THREE.PlaneGeometry(3.15, 1.45),
          new THREE.MeshBasicMaterial({ map: makeLabelTexture(exhibit, index), transparent: true })
        );
        label.position.set(0, -1.05, 0.04);
        label.userData.exhibitIndex = index;
        group.add(label);
        interactive.push(label);

        var frame = new THREE.LineSegments(
          new THREE.EdgesGeometry(new THREE.BoxGeometry(3.72, 4.02, 0.03)),
          new THREE.LineBasicMaterial({ color: index === 3 ? 0xffe3a6 : 0xd8bd8a, transparent: true, opacity: index === 3 ? 0.62 : 0.38 })
        );
        frame.userData.exhibitIndex = index;
        group.add(frame);
        interactive.push(frame);

        scene.add(group);
        exhibitAnchors.push(group);
        addApproachMarker(place);
      });
    }

    function addApproachMarker(place) {
      var markerMaterial = new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.34 });
      var marker = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(1.5, 0.02, 0.84)),
        markerMaterial
      );
      marker.position.set(place.x, 0.035, place.z);
      marker.rotation.y = place.rotation;
      if (place.wall === "left") marker.position.x += 2.05;
      if (place.wall === "right") marker.position.x -= 2.05;
      if (place.wall === "back") marker.position.z += 2.1;
      scene.add(marker);
    }

    function makeLabelTexture(exhibit, index) {
      var c = document.createElement("canvas");
      c.width = 1024;
      c.height = 512;
      var ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(3,3,2,0.96)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(216,189,138,0.42)";
      ctx.lineWidth = 2;
      ctx.strokeRect(28, 28, c.width - 56, c.height - 56);
      ctx.fillStyle = "#ffe3a6";
      ctx.font = "700 26px Space Mono, monospace";
      ctx.fillText(String(index + 1).padStart(2, "0") + " / " + exhibit.kicker.toUpperCase(), 56, 78);
      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 58px Space Grotesk, sans-serif";
      wrapText(ctx, exhibit.title, 56, 165, 900, 62, 2);
      ctx.fillStyle = "rgba(239,227,202,0.76)";
      ctx.font = "600 24px Space Grotesk, sans-serif";
      wrapText(ctx, exhibit.caption, 56, 370, 860, 34, 2);
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makeTableLabelTexture() {
      var c = document.createElement("canvas");
      c.width = 1024;
      c.height = 256;
      var ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(3,3,2,0.86)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(255,227,166,0.48)";
      ctx.lineWidth = 2;
      ctx.strokeRect(28, 28, c.width - 56, c.height - 56);
      ctx.fillStyle = "#ffe3a6";
      ctx.font = "700 30px Space Mono, monospace";
      ctx.fillText("CAPACITYOS COMMAND TABLE", 56, 78);
      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 54px Space Grotesk, sans-serif";
      ctx.fillText("Test the agents.", 56, 154);
      ctx.fillStyle = "rgba(239,227,202,0.76)";
      ctx.font = "600 24px Space Grotesk, sans-serif";
      ctx.fillText("Each wall is a different boundary condition.", 56, 204);
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makeCommandCenterTexture() {
      var c = document.createElement("canvas");
      c.width = 1400;
      c.height = 680;
      var ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(3,3,2,0.82)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(216,189,138,0.42)";
      ctx.lineWidth = 2;
      ctx.strokeRect(36, 36, c.width - 72, c.height - 72);
      ctx.strokeStyle = "rgba(255,227,166,0.5)";
      ctx.strokeRect(82, 82, c.width - 164, c.height - 164);

      ctx.strokeStyle = "rgba(216,189,138,0.34)";
      ctx.beginPath();
      ctx.moveTo(128, 210);
      ctx.lineTo(260, 132);
      ctx.lineTo(392, 210);
      ctx.lineTo(392, 366);
      ctx.lineTo(260, 444);
      ctx.lineTo(128, 366);
      ctx.closePath();
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(260, 132);
      ctx.lineTo(260, 444);
      ctx.moveTo(128, 210);
      ctx.lineTo(392, 366);
      ctx.moveTo(392, 210);
      ctx.lineTo(128, 366);
      ctx.stroke();

      ctx.fillStyle = "#ffe3a6";
      ctx.font = "700 34px Space Mono, monospace";
      ctx.fillText("CAPACITYOS / COMMAND CENTER", 470, 154);
      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 76px Space Grotesk, sans-serif";
      ctx.fillText("Agent edge testing", 470, 258);
      ctx.fillStyle = "rgba(239,227,202,0.84)";
      ctx.font = "600 34px Space Grotesk, sans-serif";
      wrapText(ctx, "Each repo asks whether my agents can perform a distinct kind of work at its limit: research, ambiguity, formalization, governance, public sensemaking, profile maintenance, and commercial translation.", 470, 344, 760, 46, 4);
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function wrapText(ctx, text, x, y, maxWidth, lineHeight, maxLines) {
      var words = text.split(" ");
      var line = "";
      var lines = 0;
      for (var n = 0; n < words.length; n += 1) {
        var test = line + words[n] + " ";
        if (ctx.measureText(test).width > maxWidth && n > 0) {
          ctx.fillText(line.trim(), x, y);
          line = words[n] + " ";
          y += lineHeight;
          lines += 1;
          if (lines >= maxLines) return;
        } else {
          line = test;
        }
      }
      ctx.fillText(line.trim(), x, y);
    }

    function animate() {
      var now = performance.now();
      var dt = Math.min((now - lastFrameTime) / 1000, 0.05);
      lastFrameTime = now;
      if (!isMobile && started) {
        updateMovement(dt);
        updateProximity();
      }
      if (commandBillboard) {
        commandBillboard.lookAt(camera.position.x, commandBillboard.position.y, camera.position.z);
      }
      root.dataset.camera = camera.position.x.toFixed(2) + "," + camera.position.z.toFixed(2);
      root.dataset.look = yaw.toFixed(3) + "," + pitch.toFixed(3);
      renderer.render(scene, camera);
      window.requestAnimationFrame(animate);
    }

    function updateMovement(dt) {
      var speed = (keys.ShiftLeft || keys.ShiftRight) ? 5.2 : 3.25;
      var turnSpeed = 1.7;
      var forward = Number(Boolean(keys.ArrowUp || keys.arrowup)) - Number(Boolean(keys.ArrowDown || keys.arrowdown));
      var turn = Number(Boolean(keys.ArrowLeft || keys.arrowleft)) - Number(Boolean(keys.ArrowRight || keys.arrowright));
      root.dataset.motion = forward.toFixed(0) + "," + turn.toFixed(0);

      if (turn) {
        yaw += turn * turnSpeed * dt;
        camera.rotation.set(pitch, yaw, 0);
      }

      if (!forward) return;

      var sin = Math.sin(yaw);
      var cos = Math.cos(yaw);
      var dx = -forward * sin * speed * dt;
      var dz = forward * cos * speed * dt;
      var next = avoidCentralObject(camera.position.x + dx, camera.position.z - dz);
      camera.position.x = clamp(next.x, -roomBounds.x, roomBounds.x);
      camera.position.z = clamp(next.z, roomBounds.zMin, roomBounds.zMax);
    }

    function avoidCentralObject(x, z) {
      var dx = x - centralObject.x;
      var dz = z - centralObject.z;
      var distance = Math.sqrt(dx * dx + dz * dz);
      if (distance >= centralObject.radius || distance === 0) return { x: x, z: z };
      var scale = centralObject.radius / distance;
      return {
        x: centralObject.x + dx * scale,
        z: centralObject.z + dz * scale
      };
    }

    function updateProximity() {
      var nearestIndex = -1;
      var nearestDistance = Infinity;
      var world = new THREE.Vector3();

      exhibitAnchors.forEach(function (anchor, index) {
        anchor.getWorldPosition(world);
        var dx = camera.position.x - world.x;
        var dz = camera.position.z - world.z;
        var distance = Math.sqrt(dx * dx + dz * dz);
        if (distance < nearestDistance) {
          nearestDistance = distance;
          nearestIndex = index;
        }
      });

      root.dataset.nearest = nearestIndex + ":" + nearestDistance.toFixed(2);
      if (nearestIndex >= 0 && nearestDistance <= proximityRange) {
        openProximity(nearestIndex);
      } else {
        closeProximity();
      }
    }

    function openProximity(index) {
      if (currentProximityIndex === index && proximity && proximity.classList.contains("is-open")) return;
      var exhibit = exhibits[index];
      if (!exhibit) return;
      currentProximityIndex = index;
      if (proximityKicker) proximityKicker.textContent = exhibit.kicker;
      if (proximityTitle) proximityTitle.textContent = exhibit.title;
      if (proximityBody) proximityBody.textContent = exhibit.body;
      if (proximityLink) {
        proximityLink.href = exhibit.link;
        proximityLink.classList.add("is-open");
      }
      if (proximity) {
        proximity.classList.add("is-open");
        proximity.setAttribute("aria-hidden", "false");
      }
      setStatus("near " + exhibit.title);
    }

    function closeProximity() {
      if (currentProximityIndex === -1 && proximity && !proximity.classList.contains("is-open")) return;
      currentProximityIndex = -1;
      if (proximity) {
        proximity.classList.remove("is-open");
        proximity.setAttribute("aria-hidden", "true");
      }
      if (proximityLink) {
        proximityLink.classList.remove("is-open");
      }
      if (!isMobile) setStatus("arrow keys to move");
    }

    function pickExhibit() {
      raycaster.setFromCamera(pointer, camera);
      var hits = raycaster.intersectObjects(interactive, false);
      if (!hits.length) {
        setStatus("aim at a wall exhibit");
        return;
      }
      var hit = hits.find(function (item) {
        return typeof item.object.userData.exhibitIndex === "number";
      });
      if (!hit) return;
      if (hit.distance > proximityRange) {
        setStatus("walk closer to inspect");
        return;
      }
      openProximity(hit.object.userData.exhibitIndex);
    }

    function openInspector(index) {
      var exhibit = exhibits[index];
      if (!exhibit) return;
      mobileIndex = index;
      if (inspectorKicker) inspectorKicker.textContent = exhibit.kicker;
      if (inspectorTitle) inspectorTitle.textContent = exhibit.title;
      if (inspectorBody) inspectorBody.textContent = exhibit.body;
      if (inspectorLink) inspectorLink.href = exhibit.link;
      if (inspector) {
        inspector.classList.add("is-open");
        inspector.setAttribute("aria-hidden", "false");
      }
      setStatus("inspecting " + exhibit.title);
      if (mobileCount) mobileCount.textContent = String(index + 1).padStart(2, "0") + " / 07";
    }

    function closeInspector() {
      if (!inspector) return;
      inspector.classList.remove("is-open");
      inspector.setAttribute("aria-hidden", "true");
      setStatus(isMobile ? "guided walkthrough" : "arrow keys to move");
    }

    function setMobileExhibit(nextIndex) {
      mobileIndex = (nextIndex + exhibits.length) % exhibits.length;
      var anchor = exhibitAnchors[mobileIndex];
      if (!anchor) return;
      var world = new THREE.Vector3();
      anchor.getWorldPosition(world);
      var view = world.clone();
      var sideOffset = world.x < 0 ? 3.9 : world.x > 0 ? -3.9 : 0;
      view.x += sideOffset;
      view.z += world.z < -9 ? 4.6 : 0.9;
      view.y = 1.75;
      camera.position.copy(view);
      camera.lookAt(world.x, 2.15, world.z);
      camera.rotation.order = "YXZ";
      yaw = camera.rotation.y;
      pitch = camera.rotation.x;
      if (mobileCount) mobileCount.textContent = String(mobileIndex + 1).padStart(2, "0") + " / 07";
      setStatus(exhibits[mobileIndex].title);
    }

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }
  }
})();
