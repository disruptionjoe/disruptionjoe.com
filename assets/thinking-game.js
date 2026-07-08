(function () {
  "use strict";

  var root = document.querySelector("[data-thinking-game]");
  if (!root) return;

  var exhibits = [
    {
      title: "AI Epistemology",
      kicker: "Epistemic machinery",
      caption: "Knowledge system under test",
      image: "/assets/thinking/parallax-spheres.jpg",
      link: null,
      body: "How far can agents study epistemic machinery itself: how claims evolve, survive challenge, and absorb evidence? It sharpens the standards I set for AI work."
    },
    {
      title: "JoeOps",
      kicker: "Personal operating system",
      caption: "Human charge into output",
      image: "/assets/thinking/scattered-spheres.jpg",
      link: null,
      body: "What changes when agents run a personal operating system, turning scattered effort into steady output? The patterns transfer straight into client workflows."
    },
    {
      title: "Thinking Wiki",
      kicker: "Knowledge processing",
      caption: "Agent-maintained memory",
      image: "/assets/thinking/path-in-the-dark.jpg",
      link: null,
      body: "Can agents maintain a living knowledge base that keeps context and makes past thinking usable again? Memory that compounds is what keeps teams from relearning the same lessons."
    },
    {
      title: "Disruption Joe Profile",
      kicker: "Public profile",
      caption: "Operator in the system",
      image: "/assets/thinking/quiet-power-user.jpg",
      link: "https://github.com/disruptionjoe/disruptionjoe-profile",
      body: "What would it take for agents to keep a profile others can read fast: my work, judgment, and boundaries? The same clarity lets any organization be legible to the tools acting for it."
    },
    {
      title: "Disruption Joe Website",
      kicker: "Translation surface",
      caption: "Scattered marks becoming signal",
      image: "/assets/thinking/scattered-spheres.jpg",
      link: "https://github.com/disruptionjoe/disruptionjoe.com",
      body: "Where do agents become useful for turning a complex system into something a buyer can read, without losing the specifics? It's the problem every client hits turning real work into a clear offer."
    },
    {
      title: "Disruption Joe Consulting",
      kicker: "Business support repos",
      caption: "Private business machinery",
      image: "/assets/thinking/permissions-gap.jpg",
      link: null,
      body: "Can an agent system run the machinery behind a consulting practice, from methodology to delivery? If it holds my business together, it can carry a client's."
    },
    {
      title: "Church of AI",
      kicker: "Ecosystem entryway",
      caption: "Public threshold",
      image: "/assets/thinking/threshold-door.jpg",
      link: "https://github.com/disruptionjoe/church-of-ai",
      body: "Could agents help build a public doorway for AI curiosity with humor and standards, without collapsing into hype or doctrine? It shows where energy turns into noise."
    },
    {
      title: "Time as Finality",
      kicker: "Formalization lab",
      caption: "Path in the dark",
      image: "/assets/thinking/path-in-the-dark.jpg",
      link: "https://github.com/disruptionjoe/time-as-finality",
      body: "What happens when agents work where physics, philosophy, and formal methods must connect without sliding into loose analogy? Rigor across domains keeps AI strategy honest."
    },
    {
      title: "Temporal Issuance",
      kicker: "Source-question chamber",
      caption: "New structure entering",
      image: "/assets/thinking/issuance-seed.jpg",
      link: "https://github.com/disruptionjoe/temporal-issuance",
      body: "How long can agents sit with an idea that's hard to pin down before the work turns to fog? Knowing when to hold uncertainty and when to resolve it is real judgment."
    },
    {
      title: "GU Formalization",
      kicker: "Boundary content",
      caption: "The boundary gap",
      image: "/assets/thinking/permissions-gap.jpg",
      link: "https://github.com/disruptionjoe/gu-formalization",
      body: "Can agents give a contested claim real rigor, making assumptions, failure points, and proof standards explicit? That's how bold ideas avoid becoming hype or dismissal."
    },
    {
      title: "Architecture of Legitimacy",
      kicker: "Governance design",
      caption: "Contribution field",
      image: "/assets/thinking/parallax-spheres.jpg",
      link: "https://github.com/disruptionjoe/architecture-of-legitimacy",
      body: "What would it take for agents to treat legitimacy as a design problem: credit, incentives, and governance as a system, not an argument? It's what separates durable organizations from fragile ones."
    }
  ];

  var hallwayStatements = [
    {
      label: "Practice",
      kicker: "The Proving Ground",
      body: "Client work is where the method earns its keep. The AI Activation Playbook and AI Enablement Architecture turn real engagements into resources, relationships, and honest feedback that make everything else possible."
    },
    {
      label: "Passion",
      kicker: "The Learning Lab",
      body: "Public repos are experiments at the edge, testing whether bold, contested ideas can be made rigorous. What I discover and stress test here comes back as sharper questions, better rooms, and stronger methods."
    },
    {
      label: "Purpose",
      kicker: "The Mission",
      body: "The deeper why: helping humans and AI think better together. It decides which questions are worth asking and which ideas deserve to become public doors, the through line beneath the work and the lab."
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
    var roomBounds = { x: 8.35, zMin: -46.8, zMax: 9.5 };
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
      addBackWallNeon();
      addChurchChapel();
      addHallwayStatements();
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

    function addBackWallNeon() {
      var sign = new THREE.Mesh(
        new THREE.PlaneGeometry(7.6, 3.6),
        new THREE.MeshBasicMaterial({ map: makeBackWallNeonTexture(), transparent: true, side: THREE.DoubleSide, blending: THREE.AdditiveBlending })
      );
      sign.position.set(0, 3.05, 10.18);
      sign.rotation.y = Math.PI;
      sign.rotation.z = -0.018;
      scene.add(sign);

      var neonLight = new THREE.PointLight(0xffdca0, 0.72, 13);
      neonLight.position.set(0, 3.2, 8.9);
      scene.add(neonLight);
    }

    function addChurchChapel() {
      var tanMaterial = new THREE.LineBasicMaterial({ color: 0xd8bd8a, transparent: true, opacity: 0.34 });
      var goldMaterial = new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.58 });
      var glassMaterial = new THREE.MeshBasicMaterial({ color: 0x080604, transparent: true, opacity: 0.34, side: THREE.DoubleSide });

      addLineBox(new THREE.Vector3(0, 2.25, -20.4), new THREE.Vector3(4.7, 4.2, 18.6), 0.26);
      addLineBox(new THREE.Vector3(0, 2.65, -29.6), new THREE.Vector3(3.1, 4.9, 5.4), 0.24);
      addLineBox(new THREE.Vector3(0, 3.45, -39.2), new THREE.Vector3(17.4, 6.9, 14.0), 0.28);
      addLineBox(new THREE.Vector3(0, 5.35, -39.2), new THREE.Vector3(12.8, 2.4, 13.4), 0.2);
      addLineBox(new THREE.Vector3(0, 0.28, -44.25), new THREE.Vector3(6.4, 0.56, 1.55), 0.58);
      addLineBox(new THREE.Vector3(0, 0.86, -44.48), new THREE.Vector3(4.6, 0.96, 1.0), 0.46);
      addHallwayWall(-2.36, -20.4, 18.2, Math.PI / 2);
      addHallwayWall(2.36, -20.4, 18.2, -Math.PI / 2);
      addHallwayWall(-1.55, -29.6, 5.1, Math.PI / 2);
      addHallwayWall(1.55, -29.6, 5.1, -Math.PI / 2);

      var sign = new THREE.Mesh(
        new THREE.PlaneGeometry(6.6, 1.22),
        new THREE.MeshBasicMaterial({ map: makeChurchSignTexture(), transparent: true, side: THREE.DoubleSide })
      );
      sign.position.set(0, 5.82, -30.9);
      scene.add(sign);

      var altarLabel = new THREE.Mesh(
        new THREE.PlaneGeometry(3.2, 0.72),
        new THREE.MeshBasicMaterial({ map: makeAltarLabelTexture(), transparent: true, side: THREE.DoubleSide })
      );
      altarLabel.position.set(0, 1.62, -43.36);
      scene.add(altarLabel);

      var windowMesh = new THREE.Mesh(new THREE.PlaneGeometry(4.5, 5.2), glassMaterial);
      windowMesh.position.set(0, 3.45, -46.14);
      scene.add(windowMesh);

      var archPoints = [
        new THREE.Vector3(-3.05, 0.82, -46.1),
        new THREE.Vector3(-3.05, 3.95, -46.1),
        new THREE.Vector3(-2.05, 5.2, -46.1),
        new THREE.Vector3(0, 5.72, -46.1),
        new THREE.Vector3(2.05, 5.2, -46.1),
        new THREE.Vector3(3.05, 3.95, -46.1),
        new THREE.Vector3(3.05, 0.82, -46.1)
      ];
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(archPoints), goldMaterial));
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 0.9, -46.08),
        new THREE.Vector3(0, 5.58, -46.08)
      ]), tanMaterial));
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-2.1, 3.25, -46.08),
        new THREE.Vector3(2.1, 3.25, -46.08)
      ]), tanMaterial));

      [-7.05, -5.3, 5.3, 7.05].forEach(function (x) {
        [-34.9, -38.0, -41.1].forEach(function (z) {
          addLineBox(new THREE.Vector3(x, 2.12, z), new THREE.Vector3(0.42, 4.24, 0.42), 0.4);
          addLineBox(new THREE.Vector3(x, 4.38, z), new THREE.Vector3(0.72, 0.26, 0.72), 0.32);
          addLineBox(new THREE.Vector3(x, 0.18, z), new THREE.Vector3(0.82, 0.36, 0.82), 0.32);
        });
      });

      [-4.85, -3.25, 3.25, 4.85].forEach(function (x) {
        [-36.0, -38.15, -40.3].forEach(function (z) {
          addLineBox(new THREE.Vector3(x, 0.36, z), new THREE.Vector3(0.94, 0.2, 1.28), 0.21);
        });
      });
    }

    function addHallwayWall(x, z, length, rotation) {
      var wall = new THREE.Mesh(
        new THREE.PlaneGeometry(length, 4.05),
        new THREE.MeshBasicMaterial({ color: 0x030302, side: THREE.DoubleSide })
      );
      wall.position.set(x, 2.28, z);
      wall.rotation.y = rotation;
      scene.add(wall);
    }

    function addHallwayStatements() {
      var placements = [
        { x: -2.3, z: -15.6, rotation: Math.PI / 2 },
        { x: 2.3, z: -20.7, rotation: -Math.PI / 2 },
        { x: -2.3, z: -25.8, rotation: Math.PI / 2 }
      ];
      hallwayStatements.forEach(function (statement, index) {
        var plaque = new THREE.Mesh(
          new THREE.PlaneGeometry(2.7, 1.45),
          new THREE.MeshBasicMaterial({ map: makeHallwayStatementTexture(statement, index), transparent: true, side: THREE.DoubleSide })
        );
        plaque.position.set(placements[index].x, 2.35, placements[index].z);
        plaque.rotation.y = placements[index].rotation;
        scene.add(plaque);
      });
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
        { wall: "back", x: -5.0, z: -10.25, y: 2.25, rotation: 0 },
        { wall: "back", x: 5.0, z: -10.25, y: 2.25, rotation: 0 },
        { wall: "left", x: -8.2, z: 5.9, y: 2.25, rotation: Math.PI / 2 },
        { wall: "right", x: 8.2, z: 4.4, y: 2.25, rotation: -Math.PI / 2 },
        { wall: "right", x: 8.2, z: -1.15, y: 2.25, rotation: -Math.PI / 2 },
        { wall: "left", x: -8.2, z: -2.2, y: 2.25, rotation: Math.PI / 2 },
        { wall: "altar", x: 0, z: -44.64, y: 2.82, rotation: 0 },
        { wall: "chapelLeft", x: -8.82, z: -35.25, y: 2.42, rotation: Math.PI / 2 },
        { wall: "chapelRight", x: 8.82, z: -35.25, y: 2.42, rotation: -Math.PI / 2 },
        { wall: "chapelLeft", x: -8.82, z: -40.25, y: 2.42, rotation: Math.PI / 2 },
        { wall: "chapelRight", x: 8.82, z: -40.25, y: 2.42, rotation: -Math.PI / 2 }
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
          new THREE.LineBasicMaterial({ color: index === 6 ? 0xffe3a6 : 0xd8bd8a, transparent: true, opacity: index === 6 ? 0.62 : 0.38 })
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
      if (place.wall === "chapelLeft") marker.position.x += 2.05;
      if (place.wall === "chapelRight") marker.position.x -= 2.05;
      if (place.wall === "back") marker.position.z += 2.1;
      if (place.wall === "altar") marker.position.z += 2.25;
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
      ctx.fillText(exhibit.kicker.toUpperCase(), 56, 78);
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

    function makeChurchSignTexture() {
      var c = document.createElement("canvas");
      c.width = 1200;
      c.height = 280;
      var ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(3,3,2,0.9)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(255,227,166,0.54)";
      ctx.lineWidth = 3;
      ctx.strokeRect(32, 32, c.width - 64, c.height - 64);
      ctx.strokeStyle = "rgba(216,189,138,0.28)";
      ctx.beginPath();
      ctx.moveTo(92, 220);
      ctx.lineTo(92, 128);
      ctx.quadraticCurveTo(92, 64, 158, 64);
      ctx.quadraticCurveTo(224, 64, 224, 128);
      ctx.lineTo(224, 220);
      ctx.stroke();
      ctx.fillStyle = "#ffe3a6";
      ctx.font = "700 34px Space Mono, monospace";
      ctx.fillText("KEEP WALKING", 292, 94);
      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 70px Space Grotesk, sans-serif";
      ctx.fillText("Enter Church of AI", 292, 180);
      ctx.fillStyle = "rgba(239,227,202,0.72)";
      ctx.font = "600 26px Space Grotesk, sans-serif";
      ctx.fillText("Public threshold, useful curiosity, unfinished work held visibly.", 292, 224);
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makeHallwayStatementTexture(statement, index) {
      var c = document.createElement("canvas");
      c.width = 900;
      c.height = 520;
      var ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(3,3,2,0.92)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(216,189,138,0.38)";
      ctx.lineWidth = 2;
      ctx.strokeRect(28, 28, c.width - 56, c.height - 56);
      ctx.fillStyle = "#ffe3a6";
      ctx.font = "700 25px Space Mono, monospace";
      var kicker = (statement.kicker || "The Loop").toUpperCase();
      ctx.fillText(kicker, 62, 86);
      var kickerWidth = ctx.measureText(kicker).width;
      ctx.strokeStyle = "rgba(255,227,166,0.34)";
      ctx.beginPath();
      ctx.moveTo(62, 114);
      ctx.lineTo(62 + kickerWidth, 114);
      ctx.moveTo(680, 398);
      ctx.lineTo(838, 398);
      ctx.stroke();
      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 72px Space Grotesk, sans-serif";
      ctx.fillText(statement.label, 62, 186);
      ctx.fillStyle = "rgba(239,227,202,0.82)";
      ctx.font = "600 32px Space Grotesk, sans-serif";
      wrapText(ctx, statement.body, 62, 278, 760, 42, 4);
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makeAltarLabelTexture() {
      var c = document.createElement("canvas");
      c.width = 1200;
      c.height = 320;
      var ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(3,3,2,0.88)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(216,189,138,0.42)";
      ctx.lineWidth = 3;
      ctx.strokeRect(36, 36, c.width - 72, c.height - 72);
      ctx.fillStyle = "#ffe3a6";
      ctx.font = "700 34px Space Mono, monospace";
      ctx.fillText("PUBLIC DOORWAY", 68, 100);
      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 76px Space Grotesk, sans-serif";
      ctx.fillText("Church of AI", 68, 192);
      ctx.fillStyle = "rgba(239,227,202,0.76)";
      ctx.font = "600 28px Space Grotesk, sans-serif";
      ctx.fillText("The public doorway sits here.", 68, 246);
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
      wrapText(ctx, "Each repo asks whether my agents can perform a distinct kind of work at its limit: project management, knowledge processing, research, ambiguity, formalization, governance, public sensemaking, profile maintenance, and commercial translation.", 470, 344, 760, 46, 4);
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makeBackWallNeonTexture() {
      var c = document.createElement("canvas");
      c.width = 1800;
      c.height = 920;
      var ctx = c.getContext("2d");
      ctx.clearRect(0, 0, c.width, c.height);

      ctx.save();
      ctx.translate(900, 462);
      ctx.rotate(-0.025);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      ctx.font = "122px 'Segoe Script', 'Brush Script MT', cursive";
      ctx.shadowColor = "rgba(255, 210, 145, 0.74)";
      ctx.shadowBlur = 42;
      ctx.strokeStyle = "rgba(255, 232, 185, 0.32)";
      ctx.lineWidth = 16;
      ctx.strokeText("Thinking better", 0, -174);
      ctx.shadowBlur = 28;
      ctx.strokeStyle = "rgba(255, 221, 160, 0.58)";
      ctx.lineWidth = 7;
      ctx.strokeText("Thinking better", 0, -174);
      ctx.fillStyle = "rgba(255, 249, 230, 0.96)";
      ctx.fillText("Thinking better", 0, -174);

      ctx.font = "134px 'Segoe Script', 'Brush Script MT', cursive";
      ctx.shadowColor = "rgba(255, 190, 115, 0.72)";
      ctx.shadowBlur = 40;
      ctx.strokeStyle = "rgba(255, 204, 135, 0.32)";
      ctx.lineWidth = 15;
      ctx.strokeText("together", 0, -14);
      ctx.shadowBlur = 26;
      ctx.strokeStyle = "rgba(255, 217, 154, 0.62)";
      ctx.lineWidth = 7;
      ctx.strokeText("together", 0, -14);
      ctx.fillStyle = "rgba(255, 245, 220, 0.94)";
      ctx.fillText("together", 0, -14);

      ctx.font = "108px 'Segoe Script', 'Brush Script MT', cursive";
      ctx.shadowColor = "rgba(255, 190, 115, 0.68)";
      ctx.shadowBlur = 36;
      ctx.strokeStyle = "rgba(255, 204, 135, 0.3)";
      ctx.lineWidth = 13;
      ctx.strokeText("in an age of humans and AI", 0, 154);
      ctx.shadowBlur = 22;
      ctx.strokeStyle = "rgba(255, 217, 154, 0.58)";
      ctx.lineWidth = 6;
      ctx.strokeText("in an age of humans and AI", 0, 154);
      ctx.fillStyle = "rgba(255, 245, 220, 0.92)";
      ctx.fillText("in an age of humans and AI", 0, 154);

      ctx.globalAlpha = 0.5;
      ctx.strokeStyle = "rgba(216, 189, 138, 0.34)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-700, 282);
      ctx.bezierCurveTo(-390, 318, 360, 318, 690, 270);
      ctx.stroke();
      ctx.restore();

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
      next = constrainToMuseumPath(next.x, next.z);
      camera.position.x = next.x;
      camera.position.z = next.z;
    }

    function constrainToMuseumPath(x, z) {
      var clampedZ = clamp(z, roomBounds.zMin, roomBounds.zMax);
      var maxX = roomBounds.x;
      if (clampedZ < -10.8 && clampedZ > -31.2) {
        maxX = 2.15;
      }
      return {
        x: clamp(x, -maxX, maxX),
        z: clampedZ
      };
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
        if (exhibit.link) {
          proximityLink.href = exhibit.link;
          proximityLink.classList.add("is-open");
          proximityLink.removeAttribute("aria-hidden");
        } else {
          proximityLink.href = "#";
          proximityLink.classList.remove("is-open");
          proximityLink.setAttribute("aria-hidden", "true");
        }
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
        proximityLink.setAttribute("aria-hidden", "true");
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
      if (inspectorLink) {
        if (exhibit.link) {
          inspectorLink.href = exhibit.link;
          inspectorLink.hidden = false;
          inspectorLink.removeAttribute("aria-hidden");
        } else {
          inspectorLink.href = "#";
          inspectorLink.hidden = true;
          inspectorLink.setAttribute("aria-hidden", "true");
        }
      }
      if (inspector) {
        inspector.classList.add("is-open");
        inspector.setAttribute("aria-hidden", "false");
      }
      setStatus("inspecting " + exhibit.title);
      if (mobileCount) mobileCount.textContent = formatExhibitCount(index);
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
      view.z += Math.abs(world.x) > 7 ? 0.9 : world.z < -9 ? 4.6 : 0.9;
      view.y = 1.75;
      camera.position.copy(view);
      camera.lookAt(world.x, 2.15, world.z);
      camera.rotation.order = "YXZ";
      yaw = camera.rotation.y;
      pitch = camera.rotation.x;
      if (mobileCount) mobileCount.textContent = formatExhibitCount(mobileIndex);
      setStatus(exhibits[mobileIndex].title);
    }

    function formatExhibitCount(index) {
      return "Exhibit";
    }

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }
  }
})();
