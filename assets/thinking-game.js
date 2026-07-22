(function () {
  "use strict";

  var root = document.querySelector("[data-thinking-game]");
  if (!root) return;

  var exhibits = [
    {
      title: "AI Epistemology",
      kicker: "Agent coordination science",
      caption: "Hypotheses beyond local minima",
      placardKicker: "Agent coordination lab",
      placardCaption: "If coordination has a ceiling, this tests where.",
      image: "/assets/thinking/parallax-spheres.jpg",
      link: null,
      body: "Can agent fleets, alone and with humans, be studied precisely enough to escape local minima and produce capabilities that look impossible from ordinary workflows? This is where I catalog and test those hypotheses."
    },
    {
      title: "AI Activation Playbooks",
      kicker: "Designed behavior change",
      caption: "Training, discovery, and leadership alignment",
      placardKicker: "Activation methodology",
      placardCaption: "How real work becomes designed behavior change.",
      image: "/assets/thinking/activation-playbook-table.jpg",
      link: "/playbook/",
      linkLabel: "Enter the Playbook Experience",
      linkStyle: "experience",
      linkTarget: "_self",
      body: "See how Joe designs activation sessions that turn training, discovery, assessment, and leadership alignment into useful behavior change. The Playbook shows how real work, structured practice, and tangible outputs create momentum that can feed enduring improvement across the organization. Enter to explore the method and leave with ideas you can use."
    },
    {
      title: "AI Enablement Architecture",
      kicker: "Organizational adoption system",
      caption: "Dependencies, direction, and scale",
      placardKicker: "Adoption architecture",
      placardCaption: "See what must become true before the next move can hold.",
      image: "/assets/method/ai-enablement-architecture-chicago-4.jpg",
      imageWidth: 1.22,
      imageHeight: 1.82,
      link: "/enablement/",
      linkLabel: "Enter the Architecture Experience",
      linkStyle: "experience",
      linkTarget: "_self",
      body: "See how Joe helps leaders turn scattered AI use into an operating path the organization can sustain. The architecture reveals dependencies across individuals, teams, and enterprise systems so you can locate what is ready to grow next. Enter to explore the map and leave with role-specific prompts you can use to diagnose your organization and plan the next move."
    },
    {
      title: "Thinking Wiki",
      kicker: "Knowledge processing",
      caption: "Agent-maintained memory",
      placardKicker: "Living knowledge base",
      placardCaption: "Where captured thinking becomes usable context.",
      image: "/assets/thinking/thinking-wiki.jpg",
      link: null,
      body: "Thinking Wiki turns captured ideas, decisions, and open questions into a living knowledge system. Agents help preserve provenance, reconnect old thinking to current work, and keep useful context from disappearing between projects."
    },
    {
      title: "Disruption Joe Profile",
      kicker: "Agent-first profile",
      caption: "Mountable public context",
      placardKicker: "Agent-readable profile",
      placardCaption: "A public context layer built for agents.",
      image: "/assets/thinking/disruptionjoe-profile-avatar.jpg",
      link: "https://github.com/disruptionjoe/disruptionjoe-profile",
      body: "What happens when a public profile is designed first for agents: a repo people can mount so their tools can ask grounded questions about my work, judgment, boundaries, and services instead of scraping a brochure?"
    },
    {
      title: "Disruption Joe Website",
      kicker: "Translation surface",
      caption: "Scattered marks becoming signal",
      placardKicker: "Public translation layer",
      placardCaption: "How scattered work becomes readable signal.",
      image: "/assets/thinking/disruptionjoe-website-room.jpg",
      link: "https://github.com/disruptionjoe/disruptionjoe.com",
      body: "Where do agents become useful for turning a complex system into something a buyer can read, without losing the specifics? It's the problem every client hits turning real work into a clear offer."
    },
    {
      title: "Disruption Joe Consulting",
      kicker: "Business support repos",
      caption: "Private business machinery",
      placardKicker: "Practice operating layer",
      placardCaption: "The private machinery behind the practice.",
      image: "/assets/thinking/permissions-gap.jpg",
      link: null,
      body: "Can an agent system run the machinery behind a consulting practice, from methodology to delivery? If it holds my business together, it can carry a client's."
    },
    {
      title: "Joe Project Management",
      kicker: "Work progression",
      caption: "Commitments into movement",
      placardKicker: "Project control layer",
      placardCaption: "Where outcomes become sequenced movement.",
      image: "/assets/thinking/joeops-circuits.jpg",
      link: null,
      body: "This is the project and commitment system behind the work: outcomes, programs, work cards, dependencies, decisions, and closure evidence. It keeps Joe's attention focused while agents maintain the map and move what they can."
    },
    {
      title: "Capacity OS",
      kicker: "Coordination engine",
      caption: "Federated repo fleet",
      placardKicker: "Control room",
      placardCaption: "The system behind the work.",
      image: "/assets/thinking/capacityos-cockpit.jpg",
      link: null,
      stats: [
        { value: "04", label: "bounded domain cycles" },
        { value: "05", label: "VSM lenses" },
        { value: "03", label: "run types" },
        { value: "01", label: "owner per truth" }
      ],
      body: "Capacity OS is the coordination engine behind Joe's work. It connects domains, repositories, lanes, agents, automations, evidence, and learning while each repository keeps ownership of its own truth."
    },
    {
      title: "Church of AI",
      kicker: "Ecosystem entryway",
      caption: "Public threshold",
      placardKicker: "Public curiosity doorway",
      placardCaption: "A doorway where curiosity meets standards.",
      image: "/assets/thinking/threshold-door.jpg",
      link: "https://github.com/disruptionjoe/church-of-ai",
      body: "Could agents help build a public doorway for AI curiosity with humor and standards, without collapsing into hype or doctrine? It shows where energy turns into noise."
    },
    {
      title: "Time as Finality",
      kicker: "Formalization lab",
      caption: "Path in the dark",
      placardKicker: "Cross-domain research lab",
      placardCaption: "A dark path across physics, philosophy, and proof.",
      image: "/assets/thinking/path-in-the-dark.jpg",
      link: "https://github.com/disruptionjoe/time-as-finality",
      body: "What happens when agents work where physics, philosophy, and formal methods must connect without sliding into loose analogy? Rigor across domains keeps AI strategy honest."
    },
    {
      title: "Temporal Issuance",
      kicker: "Source-question chamber",
      caption: "New structure entering",
      placardKicker: "Uncertainty chamber",
      placardCaption: "An unstable idea held long enough to sharpen.",
      image: "/assets/thinking/issuance-seed.jpg",
      link: "https://github.com/disruptionjoe/temporal-issuance",
      body: "How long can agents sit with an idea that's hard to pin down before the work turns to fog? Knowing when to hold uncertainty and when to resolve it is real judgment."
    },
    {
      title: "GU Formalization",
      kicker: "Boundary content",
      caption: "The boundary gap",
      placardKicker: "Contested claim lab",
      placardCaption: "A contested edge case built for careful pressure.",
      image: "/assets/thinking/gu-formalization.jpg",
      link: "https://github.com/disruptionjoe/gu-formalization",
      body: "Can agents give a contested claim real rigor, making assumptions, failure points, and proof standards explicit? That's how bold ideas avoid becoming hype or dismissal."
    },
    {
      title: "Architecture of Legitimacy",
      kicker: "Governance design",
      caption: "Contribution field",
      placardKicker: "Governance design studio",
      placardCaption: "Where trust, credit, and governance become architecture.",
      image: "/assets/thinking/architecture-legitimacy-church.jpg",
      link: "https://github.com/disruptionjoe/architecture-of-legitimacy",
      body: "What would it take for agents to treat legitimacy as a design problem: credit, incentives, and governance as a system, not an argument? It's what separates durable organizations from fragile ones."
    },
    {
      title: "Possibility to Capability",
      kicker: "Neutral research layer",
      caption: "Possibility becoming access",
      placardKicker: "Cross-repo research gate",
      placardCaption: "Where possibility, records, and capability are separated.",
      image: "/assets/thinking/possibility-capability-point.jpg",
      link: "https://github.com/disruptionjoe/possibility-to-capability",
      body: "Can agents hold a neutral layer between physical possibility, dynamics, records, access, capability, and finality without forcing the source repos into artificial agreement? This tests whether cross-repo synthesis can stay rigorous."
    },
    {
      title: "Continuity Ledger",
      kicker: "Provisional research skeleton",
      caption: "What survives the handoff",
      placardKicker: "Agency transduction ledger",
      placardCaption: "A proposed ledger for what is preserved or lost.",
      image: "/assets/thinking/continuity-ledger-abacus.jpg",
      link: null,
      body: "Can agents track what carries across substrates, measurement regimes, interfaces, and no-go boundaries without pretending continuity is a single magic invariant? This is a provisional research room for testing that accounting discipline."
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

  var entranceStatements = [
    {
      label: "Work With Joe",
      kicker: "The Practice",
      body: "Walk in to see two ways Joe can work with you: helping your team solve harder problems with AI, or designing the systems that let adoption scale."
    },
    {
      label: "Control Room",
      kicker: "Behind the Scenes",
      body: "Capacity OS and the systems that keep Joe's work moving."
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
  var proximityStats = root.querySelector("[data-proximity-stats]");
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
    root.classList.add("is-loaded");
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
    camera.position.set(0, 1.68, -8.8);
    camera.rotation.order = "YXZ";
    camera.rotation.y = Math.PI;

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
    var visibleExhibitIndexes = [];
    var commandBillboard = null;
    var backWallNeon = null;
    var backWallNeonLight = null;
    var mobileIndex = -1;
    var currentProximityIndex = -1;
    var currentProximityKey = "";
    var started = false;
    var yaw = Math.PI;
    var pitch = 0;
    var keys = {};
    var lastFrameTime = performance.now();
    var centralObject = { x: 0, z: 0.1, radius: 1.85 };
    var pushingRoomOffset = { x: -14.6, z: -1.0 };
    var pushingRoom = null;
    var workRoomOffset = { x: 0, z: 6.5 };
    var workRoom = null;
    var entranceView = { x: 0, y: 1.68, z: -8.8, yaw: Math.PI };
    var walkableZones = [
      { name: "church", xMin: -8.35, xMax: 8.35, zMin: -58.4, zMax: -31.2 },
      { name: "church-approach", xMin: -1.4, xMax: 1.4, zMin: -31.2, zMax: -29.2 },
      { name: "church-transition-narrow", xMin: -1.4, xMax: 1.4, zMin: -29.25, zMax: -28.45 },
      { name: "church-transition-mid", xMin: -1.65, xMax: 1.65, zMin: -28.5, zMax: -27.7 },
      { name: "church-transition-wide", xMin: -1.9, xMax: 1.9, zMin: -27.75, zMax: -26.95 },
      { name: "church-hallway", xMin: -2.15, xMax: 2.15, zMin: -27.0, zMax: -10.8 },
      { name: "orientation", xMin: -4.75, xMax: 4.75, zMin: -10.8, zMax: 5.68 },
      { name: "work-entry", xMin: 4.6, xMax: 5.55, zMin: -0.7, zMax: 2.7 },
      { name: "work-room", xMin: 5.35, xMax: 13.35, zMin: -3.25, zMax: 5.25 },
      { name: "pushing-entry", xMin: -6.8, xMax: -4.6, zMin: 0.2, zMax: 3.6 },
      { name: "pushing-room", xMin: -22.95, xMax: -6.25, zMin: -12.45, zMax: 9.1 }
    ];
    var proximityRange = 4.35;

    root.dataset.mode = isMobile ? "mobile" : "desktop";
    if (mobileInspect) mobileInspect.disabled = true;

    buildScene();
    resize();
    if (isMobile) {
      setEntranceView();
    } else {
      startDesktopExperience();
    }
    animate();
    setStatus(isMobile ? "guided walkthrough" : "arrow keys to move");

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
        stepMobileExhibit(-1);
      });
    }

    if (mobileNext) {
      mobileNext.addEventListener("click", function () {
        stepMobileExhibit(1);
      });
    }

    if (mobileInspect) {
      mobileInspect.addEventListener("click", function () {
        if (mobileIndex < 0) return;
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
      if (isMobile) {
        if (mobileIndex >= 0) setMobileExhibit(mobileIndex);
        else setEntranceView();
      }
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
      setEntranceView();
    }

    function startDesktopExperience() {
      started = true;
      root.dataset.started = "true";
      root.classList.add("is-started");
      setStatus("arrow keys to move");
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

      pushingRoom = new THREE.Group();
      pushingRoom.position.set(pushingRoomOffset.x, 0, pushingRoomOffset.z);
      scene.add(pushingRoom);

      workRoom = new THREE.Group();
      workRoom.position.set(workRoomOffset.x, 0, workRoomOffset.z);
      scene.add(workRoom);

      addWireRoom(pushingRoom);
      addBackWallNeon();
      addChurchChapel();
      addHallwayStatements();
      addHallwayGallery();
      addOrientationHallway();
      addWorkWithJoeRoom(workRoom);
      addCentralObject(pushingRoom);
      addControlRoomGallery(pushingRoom);
      addExhibits();
    }

    function addWireRoom(parent) {
      var target = parent || scene;
      var tan = new THREE.Color(0xd8bd8a);
      var gold = new THREE.Color(0xffe3a6);
      var grid = new THREE.GridHelper(18, 18, tan, tan);
      grid.material.transparent = true;
      grid.material.opacity = 0.20;
      grid.position.y = 0;
      target.add(grid);

      addLineBox(new THREE.Vector3(0, 2.9, -0.6), new THREE.Vector3(17, 5.8, 22), 0.24, target);
      addLineBox(new THREE.Vector3(0, 2.9, -0.6), new THREE.Vector3(11.5, 4.4, 15.2), 0.18, target);

      var pathMaterial = new THREE.LineBasicMaterial({ color: gold, transparent: true, opacity: 0.36 });
      var points = [
        new THREE.Vector3(-5.6, 0.03, 8.5),
        new THREE.Vector3(-2.7, 0.03, 4.2),
        new THREE.Vector3(2.5, 0.03, 2.1),
        new THREE.Vector3(5.7, 0.03, -2.2),
        new THREE.Vector3(2.2, 0.03, -6.4),
        new THREE.Vector3(-2.4, 0.03, -8.4)
      ];
      target.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(points), pathMaterial));
      addPushingRoomWalls(target);
    }

    function addOrientationHallway() {
      addLineBox(new THREE.Vector3(0, 2.4, -2.16), new THREE.Vector3(10.4, 4.8, 17.28), 0.28);
      [
        { x: 5.18, z: -6.28, length: 10.05, rotation: Math.PI / 2 },
        { x: 5.18, z: 4.87, length: 3.23, rotation: Math.PI / 2 },
        { x: -5.18, z: -5.88, length: 10.85, rotation: Math.PI / 2 },
        { x: -5.18, z: 5.27, length: 2.43, rotation: Math.PI / 2 },
        { x: -3.77, z: -10.8, length: 2.82, rotation: 0 },
        { x: 3.77, z: -10.8, length: 2.82, rotation: 0 },
        { x: 0, z: 6.48, length: 10.36, rotation: 0 }
      ].forEach(function (wall) {
        addDarkWall(wall);
      });

      var centerLine = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0.035, -10.7),
          new THREE.Vector3(0, 0.035, 5.53)
        ]),
        new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.28 })
      );
      scene.add(centerLine);

      addPortal({
        x: 5.15,
        z: 1.0,
        rotation: -Math.PI / 2,
        title: "Work With Joe"
      });
      addPortal({
        x: -5.15,
        z: 1.8,
        rotation: Math.PI / 2,
        title: "Control Room"
      });
      addLineBox(new THREE.Vector3(-5.68, 2.4, 1.8), new THREE.Vector3(1.1, 4.8, 3.4), 0.24);
      addDarkWall({ x: -5.72, z: 0.2, length: 1.08, rotation: 0 });
      addDarkWall({ x: -5.72, z: 3.6, length: 1.08, rotation: 0 });
      addEntrancePlacards();
    }

    function addWorkWithJoeRoom(parent) {
      var target = parent || scene;
      addLineBox(new THREE.Vector3(9.4, 2.65, -5.5), new THREE.Vector3(8.5, 5.3, 9.0), 0.24, target);

      [
        { x: 9.4, z: -10.0, length: 8.5, rotation: 0, height: 5.2, y: 2.65 },
        { x: 9.4, z: -1.0, length: 8.5, rotation: 0, height: 5.2, y: 2.65 },
        { x: 13.65, z: -5.5, length: 9.0, rotation: Math.PI / 2, height: 5.2, y: 2.65 },
        { x: 5.18, z: -8.625, length: 2.75, rotation: Math.PI / 2, height: 5.2, y: 2.65 },
        { x: 5.18, z: -2.125, length: 2.25, rotation: Math.PI / 2, height: 5.2, y: 2.65 }
      ].forEach(function (wall) {
        addDarkWall(wall, target);
      });

      addWorkWithJoeGallery(target);
    }

    function addWorkWithJoeGallery(parent) {
      var textureLoader = new THREE.TextureLoader();
      var backingMaterial = new THREE.MeshBasicMaterial({ color: 0x030302, transparent: true, opacity: 0.9, side: THREE.DoubleSide });
      var galleryImages = [
        { src: "/assets/thinking/capability-acceleration-wall.png", x: 9.4, z: -9.97, y: 2.65, rotation: 0, width: 5.6, height: 3.73 },
        { src: "/assets/thinking/enablement-architecture-wall.png", x: 9.4, z: -1.03, y: 2.65, rotation: Math.PI, width: 5.6, height: 3.73 }
      ];

      galleryImages.forEach(function (item) {
        var backing = new THREE.Mesh(
          new THREE.PlaneGeometry(item.width + 0.18, item.height + 0.18),
          backingMaterial.clone()
        );
        backing.position.set(item.x, item.y, item.z);
        backing.rotation.y = item.rotation;
        parent.add(backing);

        var texture = textureLoader.load(item.src);
        texture.colorSpace = THREE.SRGBColorSpace;
        var image = new THREE.Mesh(
          new THREE.PlaneGeometry(item.width, item.height),
          new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide })
        );
        image.position.set(item.x, item.y, item.z + (item.rotation === 0 ? 0.015 : -0.015));
        image.rotation.y = item.rotation;
        parent.add(image);

        var frame = new THREE.LineSegments(
          new THREE.EdgesGeometry(new THREE.BoxGeometry(item.width + 0.22, item.height + 0.22, 0.03)),
          new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.42 })
        );
        frame.position.set(item.x, item.y, item.z);
        frame.rotation.y = item.rotation;
        parent.add(frame);
      });
    }

    function addControlRoomGallery(parent) {
      var textureLoader = new THREE.TextureLoader();
      var backingMaterial = new THREE.MeshBasicMaterial({ color: 0x030302, transparent: true, opacity: 0.94, side: THREE.DoubleSide });
      var galleryImages = [
        { src: "/assets/thinking/capacityos-control-layer.png", x: -8.47, z: 6.8, y: 2.85, rotation: Math.PI / 2, width: 5.6, height: 3.73 },
        { src: "/assets/thinking/capacityos-recursive-system.png", x: -8.47, z: 0.4, y: 2.85, rotation: Math.PI / 2, width: 5.6, height: 3.73 },
        { src: "/assets/thinking/capacityos-vsm-lenses.png", x: -8.47, z: -6.1, y: 2.85, rotation: Math.PI / 2, width: 5.6, height: 3.73 },
        { src: "/assets/thinking/capacityos-automation-orbits.png", x: 8.47, z: -5.3, y: 2.85, rotation: -Math.PI / 2, width: 5.8, height: 3.87 },
        { src: "/assets/thinking/capacityos-repository-fleet.png", x: 8.47, z: 7.45, y: 2.85, rotation: -Math.PI / 2, width: 5.0, height: 3.33 }
      ];

      galleryImages.forEach(function (item) {
        var backing = new THREE.Mesh(
          new THREE.PlaneGeometry(item.width + 0.18, item.height + 0.18),
          backingMaterial.clone()
        );
        backing.position.set(item.x, item.y, item.z);
        backing.rotation.y = item.rotation;
        parent.add(backing);

        var texture = textureLoader.load(item.src);
        texture.colorSpace = THREE.SRGBColorSpace;
        var image = new THREE.Mesh(
          new THREE.PlaneGeometry(item.width, item.height),
          new THREE.MeshBasicMaterial({ map: texture, transparent: true, side: THREE.DoubleSide })
        );
        image.position.set(item.x + (item.rotation > 0 ? 0.015 : -0.015), item.y, item.z);
        image.rotation.y = item.rotation;
        parent.add(image);

        var frame = new THREE.LineSegments(
          new THREE.EdgesGeometry(new THREE.BoxGeometry(item.width + 0.22, item.height + 0.22, 0.03)),
          new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.48 })
        );
        frame.position.set(item.x, item.y, item.z);
        frame.rotation.y = item.rotation;
        parent.add(frame);
      });
    }

    function addEntrancePlacards() {
      var placements = [
        { x: 5.14, z: -2.6, width: 2.7, height: 1.45, rotation: -Math.PI / 2 },
        { x: -5.14, z: 5.27, width: 2.35, height: 1.26, rotation: Math.PI / 2 }
      ];
      entranceStatements.forEach(function (statement, index) {
        var placard = new THREE.Mesh(
          new THREE.PlaneGeometry(placements[index].width, placements[index].height),
          new THREE.MeshBasicMaterial({ map: makeHallwayStatementTexture(statement, index), transparent: true, side: THREE.DoubleSide })
        );
        placard.position.set(placements[index].x, 2.35, placements[index].z);
        placard.rotation.y = placements[index].rotation;
        scene.add(placard);
      });
    }

    function addPortal(options) {
      addLineBox(
        new THREE.Vector3(options.x, 2.4, options.z),
        new THREE.Vector3(0.16, 4.8, 4.5),
        0.42
      );
      var sign = new THREE.Mesh(
        new THREE.PlaneGeometry(3.75, 1.08),
        new THREE.MeshBasicMaterial({ map: makePortalTexture(options), transparent: true, side: THREE.DoubleSide })
      );
      sign.position.set(options.x + (options.x > 0 ? -0.09 : 0.09), 3.58, options.z);
      sign.rotation.y = options.rotation;
      scene.add(sign);
    }

    function addPushingRoomWalls(parent) {
      [
        { x: -8.5, z: -0.6, length: 22.0, rotation: Math.PI / 2, height: 5.72, y: 2.9 },
        { x: 8.5, z: -5.2, length: 12.8, rotation: Math.PI / 2, height: 5.72, y: 2.9 },
        { x: 8.5, z: 7.5, length: 5.8, rotation: Math.PI / 2, height: 5.72, y: 2.9 },
        { x: 0, z: -11.6, length: 17.0, rotation: 0, height: 5.72, y: 2.9 },
        { x: 0, z: 10.4, length: 17.0, rotation: 0, height: 5.72, y: 2.9 }
      ].forEach(function (wall) {
        addDarkWall(wall, parent);
      });
    }

    function addDarkWall(options, parent) {
      var wall = new THREE.Mesh(
        new THREE.PlaneGeometry(options.length, options.height || 4.7),
        new THREE.MeshBasicMaterial({ color: 0x030302, side: THREE.DoubleSide })
      );
      wall.position.set(options.x, options.y || 2.4, options.z);
      wall.rotation.y = options.rotation;
      (parent || scene).add(wall);
    }

    function addBackWallNeon() {
      var neonMaterial = new THREE.MeshBasicMaterial({ map: makeBackWallNeonTexture(), transparent: true, side: THREE.DoubleSide, opacity: 0.92 });
      var sign = new THREE.Mesh(
        new THREE.PlaneGeometry(10.25, 4.85),
        neonMaterial
      );
      sign.position.set(0, 2.98, 6.34);
      sign.rotation.y = Math.PI;
      sign.rotation.z = -0.018;
      scene.add(sign);
      backWallNeon = sign;

      var floorGlow = new THREE.Mesh(
        new THREE.PlaneGeometry(6.9, 1.5),
        new THREE.MeshBasicMaterial({ map: makeNeonFloorGlowTexture(), transparent: true, side: THREE.DoubleSide, opacity: 0.32, depthWrite: false })
      );
      floorGlow.position.set(0, 0.045, 3.63);
      floorGlow.rotation.x = -Math.PI / 2;
      floorGlow.rotation.z = -0.018;
      scene.add(floorGlow);

      var neonLight = new THREE.PointLight(0xffdca0, 0.36, 9.2);
      neonLight.position.set(0, 2.94, 5.03);
      scene.add(neonLight);
      backWallNeonLight = neonLight;
    }

    function addChurchChapel() {
      var tanMaterial = new THREE.LineBasicMaterial({ color: 0xd8bd8a, transparent: true, opacity: 0.34 });
      var goldMaterial = new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.58 });
      var glassMaterial = new THREE.MeshBasicMaterial({ color: 0x080604, transparent: true, opacity: 0.34, side: THREE.DoubleSide });

      addLineBox(new THREE.Vector3(0, 2.25, -19.05), new THREE.Vector3(4.7, 4.2, 15.9), 0.26);
      addLineBox(new THREE.Vector3(0, 2.65, -30.75), new THREE.Vector3(3.1, 4.9, 3.1), 0.24);
      addLineBox(new THREE.Vector3(0, 3.9, -44.0), new THREE.Vector3(19.2, 7.8, 24.2), 0.3);
      addLineBox(new THREE.Vector3(0, 6.1, -44.0), new THREE.Vector3(14.6, 2.8, 22.8), 0.22);
      addLineBox(new THREE.Vector3(0, 0.28, -55.05), new THREE.Vector3(7.6, 0.56, 1.9), 0.64);
      addLineBox(new THREE.Vector3(0, 0.92, -55.32), new THREE.Vector3(5.6, 1.04, 1.22), 0.52);
      addLineBox(new THREE.Vector3(0, 1.58, -55.52), new THREE.Vector3(3.9, 0.52, 0.82), 0.46);
      addHallwayWall(-2.36, -19.15, 15.7, Math.PI / 2);
      addHallwayWall(2.36, -19.15, 15.7, -Math.PI / 2);
      addHallwayTransitionWall(-2.36, -27.0, -1.55, -29.2);
      addHallwayTransitionWall(2.36, -27.0, 1.55, -29.2);
      addHallwayWall(-1.55, -30.675, 2.95, Math.PI / 2);
      addHallwayWall(1.55, -30.675, 2.95, -Math.PI / 2);

      var sign = new THREE.Mesh(
        new THREE.PlaneGeometry(6.6, 1.22),
        new THREE.MeshBasicMaterial({ map: makeChurchSignTexture(), transparent: true, side: THREE.DoubleSide })
      );
      sign.position.set(0, 5.82, -30.9);
      scene.add(sign);

      var windowMesh = new THREE.Mesh(new THREE.PlaneGeometry(5.2, 6.1), glassMaterial);
      windowMesh.position.set(0, 4.05, -56.14);
      scene.add(windowMesh);

      var archPoints = [
        new THREE.Vector3(-3.55, 0.92, -56.1),
        new THREE.Vector3(-3.55, 4.45, -56.1),
        new THREE.Vector3(-2.4, 5.85, -56.1),
        new THREE.Vector3(0, 6.48, -56.1),
        new THREE.Vector3(2.4, 5.85, -56.1),
        new THREE.Vector3(3.55, 4.45, -56.1),
        new THREE.Vector3(3.55, 0.92, -56.1)
      ];
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints(archPoints), goldMaterial));
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(0, 1.0, -56.08),
        new THREE.Vector3(0, 6.3, -56.08)
      ]), tanMaterial));
      scene.add(new THREE.Line(new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(-2.45, 3.72, -56.08),
        new THREE.Vector3(2.45, 3.72, -56.08)
      ]), tanMaterial));

      [-7.05, -5.3, 5.3, 7.05].forEach(function (x) {
        [-34.9, -38.7, -42.5, -46.3, -50.1].forEach(function (z) {
          addLineBox(new THREE.Vector3(x, 2.45, z), new THREE.Vector3(0.5, 4.9, 0.5), 0.42);
          addLineBox(new THREE.Vector3(x, 5.0, z), new THREE.Vector3(0.86, 0.32, 0.86), 0.34);
          addLineBox(new THREE.Vector3(x, 0.18, z), new THREE.Vector3(0.82, 0.36, 0.82), 0.32);
        });
      });

      [-4.85, -3.25, 3.25, 4.85].forEach(function (x) {
        [-36.0, -38.4, -40.8, -43.2, -45.6].forEach(function (z) {
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

    function addHallwayTransitionWall(xStart, zStart, xEnd, zEnd) {
      var dx = xEnd - xStart;
      var dz = zEnd - zStart;
      var length = Math.sqrt(dx * dx + dz * dz);
      var x = (xStart + xEnd) / 2;
      var z = (zStart + zEnd) / 2;
      var rotation = Math.atan2(-dz, dx);

      addHallwayWall(x, z, length, rotation);

      var frame = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(length, 4.05, 0.04)),
        new THREE.LineBasicMaterial({ color: 0xd8bd8a, transparent: true, opacity: 0.26 })
      );
      frame.position.set(x, 2.28, z);
      frame.rotation.y = rotation;
      scene.add(frame);
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

    function addHallwayGallery() {
      var textureLoader = new THREE.TextureLoader();
      var imageMaterialOptions = { transparent: true, side: THREE.DoubleSide };
      var backingMaterial = new THREE.MeshBasicMaterial({ color: 0x030302, transparent: true, opacity: 0.78, side: THREE.DoubleSide });
      var galleryImages = [
        { src: "/assets/about/what-drives-joe.jpg", x: 2.31, z: -14.0, y: 1.89, rotation: -Math.PI / 2, width: 3.66, height: 2.46 },
        { src: "/assets/about/principles-shape-work.jpg", x: -2.31, z: -19.5, y: 1.89, rotation: Math.PI / 2, width: 3.66, height: 2.46 },
        { src: "/assets/about/coordination-flywheel.jpg", x: 2.31, z: -24.8, y: 2.02, rotation: -Math.PI / 2, width: 2.82, height: 2.82 },
        { src: "/assets/about/principled-tradeoff-analysis.jpg", x: -1.52, z: -30.675, y: 1.77, rotation: Math.PI / 2, width: 2.94, height: 1.97 },
        { src: "/assets/about/principles-drive-everything-wheel.jpg", x: 1.52, z: -30.75, y: 1.84, rotation: -Math.PI / 2, width: 2.82, height: 2.26 }
      ];

      galleryImages.forEach(function (item) {
        var backing = new THREE.Mesh(new THREE.PlaneGeometry(item.width + 0.16, item.height + 0.16), backingMaterial.clone());
        backing.position.set(item.x, item.y, item.z);
        backing.rotation.y = item.rotation;
        scene.add(backing);

        var texture = textureLoader.load(item.src);
        texture.colorSpace = THREE.SRGBColorSpace;
        var image = new THREE.Mesh(
          new THREE.PlaneGeometry(item.width, item.height),
          new THREE.MeshBasicMaterial(Object.assign({ map: texture }, imageMaterialOptions))
        );
        image.position.set(item.x, item.y, item.z);
        image.rotation.y = item.rotation;
        if (item.rotation > 0) image.position.x += 0.014;
        if (item.rotation < 0) image.position.x -= 0.014;
        scene.add(image);
      });
    }

    function addCentralObject(parent) {
      var target = parent || scene;
      var tanMaterial = new THREE.LineBasicMaterial({ color: 0xd8bd8a, transparent: true, opacity: 0.52 });
      var goldMaterial = new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.66 });
      var dimMaterial = new THREE.LineBasicMaterial({ color: 0xd8bd8a, transparent: true, opacity: 0.26 });
      var glassMaterial = new THREE.MeshBasicMaterial({ color: 0x0a0704, transparent: true, opacity: 0.42, side: THREE.DoubleSide });

      addLineBox(new THREE.Vector3(0, 0.58, centralObject.z), new THREE.Vector3(3.05, 1.16, 3.05), 0.42, target);
      addLineBox(new THREE.Vector3(0, 1.38, centralObject.z), new THREE.Vector3(2.15, 0.38, 2.15), 0.32, target);

      var slab = new THREE.Mesh(new THREE.CylinderGeometry(1.34, 1.34, 0.08, 6), glassMaterial);
      slab.position.set(0, 1.26, centralObject.z);
      slab.rotation.y = Math.PI / 6;
      target.add(slab);

      var ring = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.TorusGeometry(1.28, 0.018, 8, 96)),
        goldMaterial
      );
      ring.position.set(0, 1.52, centralObject.z);
      ring.rotation.x = Math.PI / 2;
      target.add(ring);

      var core = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.OctahedronGeometry(0.52, 1)),
        goldMaterial
      );
      core.position.set(0, 1.78, centralObject.z);
      target.add(core);

      var haloOne = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.TorusGeometry(1.75, 0.012, 8, 112)),
        dimMaterial
      );
      haloOne.position.set(0, 0.05, centralObject.z);
      haloOne.rotation.x = Math.PI / 2;
      target.add(haloOne);

      var haloTwo = haloOne.clone();
      haloTwo.scale.set(1.32, 1.32, 1.32);
      haloTwo.material = tanMaterial;
      haloTwo.material.opacity = 0.2;
      target.add(haloTwo);

      var tableLabel = new THREE.Mesh(
        new THREE.PlaneGeometry(2.9, 0.72),
        new THREE.MeshBasicMaterial({ map: makeTableLabelTexture(), transparent: true, side: THREE.DoubleSide })
      );
      tableLabel.position.set(0, 0.88, centralObject.z + 1.62);
      tableLabel.rotation.x = -0.06;
      tableLabel.visible = false;
      target.add(tableLabel);

      commandBillboard = new THREE.Mesh(
        new THREE.PlaneGeometry(4.25, 2.05),
        new THREE.MeshBasicMaterial({ map: makeCommandCenterTexture(), transparent: true, side: THREE.DoubleSide })
      );
      commandBillboard.position.set(0, 3.05, centralObject.z);
      commandBillboard.userData.exhibitIndex = 8;
      target.add(commandBillboard);
      interactive.push(commandBillboard);

      var capacityAnchor = new THREE.Group();
      capacityAnchor.position.set(0, 2.1, centralObject.z);
      target.add(capacityAnchor);
      exhibitAnchors[8] = capacityAnchor;
      visibleExhibitIndexes.push(8);
    }

    function addLineBox(position, size, opacity, parent) {
      var geo = new THREE.BoxGeometry(size.x, size.y, size.z);
      var edges = new THREE.EdgesGeometry(geo);
      var line = new THREE.LineSegments(edges, new THREE.LineBasicMaterial({ color: 0xd8bd8a, transparent: true, opacity: opacity }));
      line.position.copy(position);
      (parent || scene).add(line);
    }

    function addExhibits() {
      var placements = [
        null,
        { wall: "workBack", zone: "work", x: 13.47, z: -7.78, y: 2.55, rotation: -Math.PI / 2 },
        { wall: "workBack", zone: "work", x: 13.47, z: -3.22, y: 2.55, rotation: -Math.PI / 2 },
        { wall: "back", zone: "pushing", x: -5.4, z: -11.45, y: 2.25, rotation: 0 },
        { wall: "back", zone: "pushing", x: 0, z: -11.45, y: 2.25, rotation: 0 },
        null,
        null,
        { wall: "back", zone: "pushing", x: 5.4, z: -11.45, y: 2.25, rotation: 0 },
        null,
        { wall: "altar", x: 0, z: -55.52, y: 3.05, rotation: 0 },
        { wall: "chapelLeft", x: -9.34, z: -34.7, y: 2.46, rotation: Math.PI / 2 },
        { wall: "chapelRight", x: 9.34, z: -34.7, y: 2.46, rotation: -Math.PI / 2 },
        { wall: "chapelLeft", x: -9.34, z: -40.6, y: 2.46, rotation: Math.PI / 2 },
        { wall: "chapelRight", x: 9.34, z: -40.6, y: 2.46, rotation: -Math.PI / 2 },
        { wall: "chapelLeft", x: -9.34, z: -46.5, y: 2.46, rotation: Math.PI / 2 },
        { wall: "chapelRight", x: 9.34, z: -46.5, y: 2.46, rotation: -Math.PI / 2 }
      ];

      exhibits.forEach(function (exhibit, index) {
        var place = placements[index];
        if (!place) return;
        var target = place.zone === "pushing" ? pushingRoom : (place.zone === "work" ? workRoom : scene);
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
          new THREE.PlaneGeometry(exhibit.imageWidth || 2.5, exhibit.imageHeight || 1.55),
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
          new THREE.LineBasicMaterial({ color: exhibit.title === "Church of AI" ? 0xffe3a6 : 0xd8bd8a, transparent: true, opacity: exhibit.title === "Church of AI" ? 0.62 : 0.38 })
        );
        frame.userData.exhibitIndex = index;
        group.add(frame);
        interactive.push(frame);

        target.add(group);
        exhibitAnchors[index] = group;
        visibleExhibitIndexes.push(index);
        addApproachMarker(place, target);
      });
    }

    function addApproachMarker(place, parent) {
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
      if (place.wall === "orientationLeft") marker.position.x += 1.55;
      if (place.wall === "orientationRight") marker.position.x -= 1.55;
      if (place.wall === "workBack") marker.position.x -= 2.1;
      (parent || scene).add(marker);
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
      var placardKicker = exhibit.placardKicker || exhibit.kicker;
      var placardCaption = exhibit.placardCaption || exhibit.caption;
      ctx.fillText(placardKicker.toUpperCase(), 56, 78);
      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 58px Space Grotesk, sans-serif";
      wrapText(ctx, exhibit.title, 56, 165, 900, 62, 2);
      ctx.fillStyle = "rgba(239,227,202,0.76)";
      ctx.font = "600 24px Space Grotesk, sans-serif";
      wrapText(ctx, placardCaption, 56, 370, 860, 34, 2);
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makePortalTexture(options) {
      var c = document.createElement("canvas");
      c.width = 1200;
      c.height = 360;
      var ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(3,3,2,0.92)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(255,227,166,0.54)";
      ctx.lineWidth = 3;
      ctx.strokeRect(28, 28, c.width - 56, c.height - 56);
      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 74px Space Grotesk, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(options.title, c.width / 2, c.height / 2);
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makeDecisionTexture() {
      var c = document.createElement("canvas");
      c.width = 1500;
      c.height = 1024;
      var ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(3,3,2,0.94)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(255,227,166,0.54)";
      ctx.lineWidth = 3;
      ctx.strokeRect(34, 34, c.width - 68, c.height - 68);
      ctx.strokeStyle = "rgba(216,189,138,0.3)";
      ctx.beginPath();
      ctx.moveTo(750, 90);
      ctx.lineTo(750, 934);
      ctx.stroke();

      ctx.fillStyle = "#ffe3a6";
      ctx.font = "700 66px Space Mono, monospace";
      ctx.fillText("←", 92, 166);
      ctx.fillText("→", 802, 166);

      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 68px Space Grotesk, sans-serif";
      wrapText(ctx, "Capability Acceleration", 92, 270, 560, 76, 2);
      wrapText(ctx, "Enablement Architecture", 802, 270, 600, 76, 2);

      ctx.fillStyle = "rgba(239,227,202,0.8)";
      ctx.font = "600 35px Space Grotesk, sans-serif";
      wrapText(ctx, "Helps a team use AI to solve harder problems, think more sharply, and execute faster.", 92, 500, 560, 50, 5);
      wrapText(ctx, "Helps an organization create scalable AI adoption, governance, capability, and evidence of value.", 802, 500, 600, 50, 5);

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
      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 38px Space Grotesk, sans-serif";
      wrapText(ctx, "Start here: walk the room, step close to a display, then follow the hallway into the Church of AI research chapel.", 56, 82, 900, 42, 4);
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

      var nodes = [
        { x: 260, y: 288, r: 48, label: "OS", primary: true },
        { x: 132, y: 160, r: 28, label: "SYS" },
        { x: 372, y: 154, r: 28, label: "DJC" },
        { x: 420, y: 332, r: 28, label: "CAI" },
        { x: 312, y: 474, r: 28, label: "JOE" },
        { x: 126, y: 410, r: 28, label: "Repos" }
      ];
      ctx.strokeStyle = "rgba(216,189,138,0.42)";
      ctx.lineWidth = 3;
      ctx.beginPath();
      nodes.slice(1).forEach(function (node) {
        ctx.moveTo(nodes[0].x, nodes[0].y);
        ctx.lineTo(node.x, node.y);
      });
      ctx.moveTo(132, 160);
      ctx.lineTo(372, 154);
      ctx.moveTo(372, 154);
      ctx.lineTo(420, 332);
      ctx.moveTo(420, 332);
      ctx.lineTo(312, 474);
      ctx.moveTo(312, 474);
      ctx.lineTo(126, 410);
      ctx.stroke();
      nodes.forEach(function (node) {
        ctx.beginPath();
        ctx.fillStyle = node.primary ? "rgba(255,227,166,0.18)" : "rgba(216,189,138,0.12)";
        ctx.strokeStyle = node.primary ? "rgba(255,227,166,0.78)" : "rgba(216,189,138,0.56)";
        ctx.lineWidth = node.primary ? 4 : 2;
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        ctx.fillStyle = node.primary ? "#ffe3a6" : "rgba(239,227,202,0.82)";
        ctx.font = node.primary ? "800 28px Space Grotesk, sans-serif" : "700 18px Space Mono, monospace";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(node.label, node.x, node.y);
      });
      ctx.textAlign = "left";
      ctx.textBaseline = "alphabetic";

      ctx.fillStyle = "#ffe3a6";
      ctx.font = "700 34px Space Mono, monospace";
      ctx.fillText("CONTROL ROOM / LIVE SYSTEM MAP", 470, 146);
      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 76px Space Grotesk, sans-serif";
      ctx.fillText("Capacity OS", 470, 246);
      ctx.fillStyle = "rgba(239,227,202,0.84)";
      ctx.font = "600 30px Space Grotesk, sans-serif";
      wrapText(ctx, "The coordination engine behind Joe's work: domains, repositories, lanes, agents, automations, evidence, and learning connected without absorbing owner truth.", 470, 322, 760, 40, 4);
      ctx.fillStyle = "#ffe3a6";
      ctx.font = "800 42px Space Grotesk, sans-serif";
      ctx.fillText("04", 500, 526);
      ctx.fillText("05", 720, 526);
      ctx.fillText("03", 940, 526);
      ctx.fillStyle = "rgba(239,227,202,0.72)";
      ctx.font = "700 20px Space Mono, monospace";
      ctx.fillText("DOMAIN CYCLES", 558, 524);
      ctx.fillText("VSM LENSES", 778, 524);
      ctx.fillText("RUN TYPES", 998, 524);
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makeBackWallNeonTexture() {
      var c = document.createElement("canvas");
      c.width = 2400;
      c.height = 1220;
      var ctx = c.getContext("2d");
      ctx.clearRect(0, 0, c.width, c.height);

      ctx.save();
      ctx.translate(1200, 612);
      ctx.rotate(-0.13);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.lineJoin = "round";
      ctx.lineCap = "round";

      drawNeonLine(ctx, "142px 'Segoe Script', 'Brush Script MT', 'Snell Roundhand', cursive", "Thinking better", 0, -172, 1);
      drawNeonLine(ctx, "142px 'Segoe Script', 'Brush Script MT', 'Snell Roundhand', cursive", "together", 0, -8, 1);
      drawNeonLine(ctx, "122px 'Segoe Script', 'Brush Script MT', 'Snell Roundhand', cursive", "in an age of humans and AI", 0, 152, 1);
      ctx.restore();

      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makeNeonFloorGlowTexture() {
      var c = document.createElement("canvas");
      c.width = 1200;
      c.height = 300;
      var ctx = c.getContext("2d");
      var gradient = ctx.createRadialGradient(600, 150, 10, 600, 150, 560);
      gradient.addColorStop(0, "rgba(255, 225, 170, 0.32)");
      gradient.addColorStop(0.32, "rgba(255, 196, 118, 0.16)");
      gradient.addColorStop(1, "rgba(255, 196, 118, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, c.width, c.height);
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function drawNeonLine(ctx, font, text, x, y, emphasis) {
      var scale = emphasis || 1;
      ctx.font = font;

      [
        [1, 1, "rgba(150, 100, 45, .55)"],
        [2, 2, "rgba(120, 80, 34, .5)"],
        [3, 3, "rgba(92, 60, 24, .46)"],
        [4, 5, "rgba(64, 42, 16, .42)"],
        [5, 7, "rgba(40, 26, 10, .4)"]
      ].forEach(function (layer) {
        ctx.shadowBlur = 0;
        ctx.fillStyle = layer[2];
        ctx.fillText(text, x + layer[0] * scale, y + layer[1] * scale);
      });

      [
        [7, "rgba(255, 232, 185, .95)"],
        [16, "rgba(255, 210, 145, .72)"],
        [34, "rgba(255, 190, 115, .52)"],
        [66, "rgba(255, 190, 115, .32)"]
      ].forEach(function (layer) {
        ctx.shadowColor = layer[1];
        ctx.shadowBlur = layer[0] * scale;
        ctx.fillStyle = "#fff8e8";
        ctx.fillText(text, x, y);
      });

      ctx.shadowBlur = 0;
      ctx.fillStyle = "#fff8e8";
      ctx.fillText(text, x, y);
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
      updateBackWallNeon(now);
      root.dataset.camera = camera.position.x.toFixed(2) + "," + camera.position.z.toFixed(2);
      root.dataset.look = yaw.toFixed(3) + "," + pitch.toFixed(3);
      renderer.render(scene, camera);
      if (root.dataset.ready !== "true") {
        root.dataset.ready = "true";
        window.setTimeout(function () {
          root.classList.add("is-loaded");
          window.setTimeout(function () {
            root.classList.add("has-hidden-loader");
          }, 460);
        }, 1200);
      }
      window.requestAnimationFrame(animate);
    }

    function updateBackWallNeon(now) {
      if (!backWallNeon) return;
      var cycle = (now % 3400) / 3400;
      var flicker = 1;
      if (cycle >= 0.02 && cycle < 0.04) flicker = 0.5;
      else if (cycle >= 0.08 && cycle < 0.09) flicker = 0.85;
      else if (cycle >= 0.42 && cycle < 0.435) flicker = 0.38;
      else if (cycle >= 0.73 && cycle < 0.74) flicker = 0.92;
      else if (cycle >= 0.89 && cycle < 0.90) flicker = 0.55;
      backWallNeon.material.opacity = flicker;
      if (backWallNeonLight) backWallNeonLight.intensity = 0.22 + flicker * 0.18;
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
      var closest = null;
      var closestDistance = Infinity;

      for (var index = 0; index < walkableZones.length; index += 1) {
        var zone = walkableZones[index];
        if (x >= zone.xMin && x <= zone.xMax && z >= zone.zMin && z <= zone.zMax) {
          return { x: x, z: z };
        }
        var projectedX = clamp(x, zone.xMin, zone.xMax);
        var projectedZ = clamp(z, zone.zMin, zone.zMax);
        var dx = x - projectedX;
        var dz = z - projectedZ;
        var distance = dx * dx + dz * dz;
        if (distance < closestDistance) {
          closestDistance = distance;
          closest = { x: projectedX, z: projectedZ };
        }
      }

      return closest || { x: x, z: z };
    }

    function avoidCentralObject(x, z) {
      var centerX = centralObject.x + pushingRoomOffset.x;
      var centerZ = centralObject.z + pushingRoomOffset.z;
      var dx = x - centerX;
      var dz = z - centerZ;
      var distance = Math.sqrt(dx * dx + dz * dz);
      if (distance >= centralObject.radius || distance === 0) return { x: x, z: z };
      var scale = centralObject.radius / distance;
      return {
        x: centerX + dx * scale,
        z: centerZ + dz * scale
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
      if (currentProximityKey === "exhibit:" + index && proximity && proximity.classList.contains("is-open")) return;
      var exhibit = exhibits[index];
      if (!exhibit) return;
      currentProximityIndex = index;
      currentProximityKey = "exhibit:" + index;
      if (proximity) proximity.classList.toggle("is-capacity", exhibit.title === "Capacity OS");
      if (proximityKicker) proximityKicker.textContent = exhibit.kicker;
      if (proximityTitle) proximityTitle.textContent = exhibit.title;
      if (proximityBody) proximityBody.textContent = exhibit.body;
      if (proximityStats) {
        proximityStats.innerHTML = "";
        if (exhibit.stats) {
          exhibit.stats.forEach(function (stat) {
            var item = document.createElement("span");
            var value = document.createElement("strong");
            var label = document.createElement("em");
            value.textContent = stat.value;
            label.textContent = stat.label;
            item.appendChild(value);
            item.appendChild(label);
            proximityStats.appendChild(item);
          });
          proximityStats.setAttribute("aria-hidden", "false");
        } else {
          proximityStats.setAttribute("aria-hidden", "true");
        }
      }
      if (proximityLink) {
        if (exhibit.link) {
          proximityLink.href = exhibit.link;
          proximityLink.textContent = exhibit.linkLabel || "See this repo on GitHub";
          proximityLink.classList.toggle("is-experience", exhibit.linkStyle === "experience");
          if (exhibit.linkTarget === "_self") {
            proximityLink.removeAttribute("target");
            proximityLink.removeAttribute("rel");
          } else {
            proximityLink.target = "_blank";
            proximityLink.rel = "noreferrer";
          }
          proximityLink.classList.add("is-open");
          proximityLink.removeAttribute("aria-hidden");
        } else {
          proximityLink.href = "#";
          proximityLink.textContent = "See this repo on GitHub";
          proximityLink.classList.remove("is-experience");
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
      if (currentProximityIndex === -1 && !currentProximityKey && proximity && !proximity.classList.contains("is-open")) return;
      currentProximityIndex = -1;
      currentProximityKey = "";
      if (proximity) {
        proximity.classList.remove("is-open");
        proximity.classList.remove("is-capacity");
        proximity.setAttribute("aria-hidden", "true");
      }
      if (proximityStats) {
        proximityStats.innerHTML = "";
        proximityStats.setAttribute("aria-hidden", "true");
      }
      if (proximityLink) {
        proximityLink.classList.remove("is-experience");
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
          inspectorLink.textContent = exhibit.linkLabel || "See this repo on GitHub";
          inspectorLink.classList.toggle("is-experience", exhibit.linkStyle === "experience");
          if (exhibit.linkTarget === "_self") {
            inspectorLink.removeAttribute("target");
            inspectorLink.removeAttribute("rel");
          } else {
            inspectorLink.target = "_blank";
            inspectorLink.rel = "noreferrer";
          }
          inspectorLink.hidden = false;
          inspectorLink.removeAttribute("aria-hidden");
        } else {
          inspectorLink.href = "#";
          inspectorLink.textContent = "See this repo on GitHub";
          inspectorLink.classList.remove("is-experience");
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

    function stepMobileExhibit(direction) {
      if (!visibleExhibitIndexes.length) return;
      var currentPosition = visibleExhibitIndexes.indexOf(mobileIndex);
      if (currentPosition < 0) currentPosition = direction < 0 ? 0 : -1;
      var nextPosition = (currentPosition + direction + visibleExhibitIndexes.length) % visibleExhibitIndexes.length;
      setMobileExhibit(visibleExhibitIndexes[nextPosition]);
    }

    function setMobileExhibit(nextIndex) {
      if (!visibleExhibitIndexes.length) return;
      mobileIndex = visibleExhibitIndexes.indexOf(nextIndex) >= 0 ? nextIndex : visibleExhibitIndexes[0];
      var anchor = exhibitAnchors[mobileIndex];
      if (!anchor) return;
      var world = new THREE.Vector3();
      var facing = new THREE.Vector3(0, 0, 4.35);
      var worldQuaternion = new THREE.Quaternion();
      anchor.getWorldPosition(world);
      anchor.getWorldQuaternion(worldQuaternion);
      facing.applyQuaternion(worldQuaternion);
      var view = world.clone().add(facing);
      view.y = 1.75;
      camera.position.copy(view);
      camera.lookAt(world.x, 2.15, world.z);
      camera.rotation.order = "YXZ";
      yaw = camera.rotation.y;
      pitch = camera.rotation.x;
      if (mobileCount) mobileCount.textContent = formatExhibitCount(mobileIndex);
      if (mobileInspect) mobileInspect.disabled = false;
      setStatus(exhibits[mobileIndex].title);
    }

    function setEntranceView() {
      mobileIndex = -1;
      camera.position.set(entranceView.x, entranceView.y, entranceView.z);
      yaw = entranceView.yaw;
      pitch = 0;
      camera.rotation.set(pitch, yaw, 0);
      if (mobileCount) mobileCount.textContent = "Exhibit";
      if (mobileInspect) mobileInspect.disabled = true;
      setStatus(isMobile ? "guided walkthrough" : "arrow keys to move");
    }

    function formatExhibitCount(index) {
      return "Exhibit";
    }

    function clamp(value, min, max) {
      return Math.max(min, Math.min(max, value));
    }
  }
})();
