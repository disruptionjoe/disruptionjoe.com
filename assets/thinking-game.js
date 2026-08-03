(function () {
  "use strict";

  var root = document.querySelector("[data-thinking-game]");
  if (!root) return;

  var capacityMetrics = window.DJC_CAPACITYOS_METRICS || {};

  function formatMetric(value) {
    return Number.isFinite(value) ? value.toLocaleString("en-US") : "—";
  }

  function planningContactLink(intent) {
    return "/contact/?intent=" + encodeURIComponent(intent)
      + "&sourcePage=" + encodeURIComponent("/thinking/")
      + "&serviceFocus=" + encodeURIComponent(intent);
  }

  var capacityStaticStat = {
    value: formatMetric(capacityMetrics.synchronizedRepositories),
    label: "repositories synchronized"
  };

  var exhibits = [
    {
      title: "AI Epistemology",
      purpose: "Determine whether AI-native systems can make epistemic machinery an explicit engineering object, and which methods improve search and judgment under what limits.",
      passion: "Explore whether agents can make knowledge production more legible, revisable, and evolvable than inherited institutions alone.",
      image: "/assets/thinking/parallax-spheres.jpg",
      link: "https://github.com/disruptionjoe/ai-epistemology"
    },
    {
      title: "AI Activation Playbooks",
      purpose: "Build a living methodology that creates situation-specific Activation Playbooks for more consistent, credible, and effective client work.",
      passion: "See the three distinct playbooks behind Joe's work: Enhanced Facilitation, Capability Acceleration, and Enablement Architecture.",
      image: "/assets/thinking/activation-playbook-table.jpg",
      link: "/playbook/",
      linkLabel: "Enter the Playbook Experience",
      linkStyle: "experience",
      linkTarget: "_self"
    },
    {
      title: "AI Enablement Architecture",
      purpose: "Make AI adoption visible and sequenced so capability can grow across individuals, teams, and the enterprise.",
      passion: "Diagnose where your organization is in its transformation journey, then see the dependencies shaping its next viable move.",
      image: "/assets/method/ai-enablement-architecture-chicago-4.jpg",
      imageWidth: 1.22,
      imageHeight: 1.82,
      link: "/enablement/",
      linkLabel: "Enter the Architecture Experience",
      linkStyle: "experience",
      linkTarget: "_self"
    },
    {
      title: "Thinking Wiki",
      purpose: "Give Joe a living intellectual home where his personal constitution, working ideas, and cross-domain patterns can become a coherent, developing body of thought rather than disconnected fragments.",
      passion: "Follow how an idea forms, changes, connects, gains evidence, and keeps its uncertainty across time and contexts.",
      image: "/assets/thinking/thinking-wiki.jpg",
      link: null,
      proximityRange: 1.55
    },
    {
      title: "Disruption Joe Profile",
      purpose: "Make Joe's public identity, credibility, and body of work understandable to people who need to decide whether to work with, learn from, or follow his work.",
      passion: "Meet a multidimensional person through the evidence of his evolving work, not a flattened resume or sales persona.",
      image: "/assets/thinking/disruptionjoe-profile-avatar.jpg",
      link: "https://github.com/disruptionjoe/disruptionjoe-profile",
      proximityRange: 1.55
    },
    {
      title: "Disruption Joe Website",
      purpose: "Make DJC's value, method, and proof tangible and current for the right people, so they can understand why Joe is different, trust the work, and choose an appropriate next step.",
      passion: "Step behind the website to see the person, thinking, and public work that give the practice its shape.",
      image: "/assets/thinking/disruptionjoe-website-room.jpg",
      link: "https://github.com/disruptionjoe/disruptionjoe.com",
      action: "enter-who-is-joe",
      actionLabel: "Enter Who Is Joe"
    },
    {
      title: "DJC Governance Operations",
      purpose: "Keep DJC an intentional, coherent practice as its independent repositories evolve, so good work can compound without authority drift, conflicting promises, or a hidden central controller.",
      passion: "See how a distributed practice stays oriented without absorbing local truth or turning coordination into control.",
      image: "/assets/thinking/permissions-gap.jpg",
      link: null
    },
    {
      title: "Joe Project Management",
      purpose: "Give Joe a trustworthy way to turn the things he needs accomplished, especially work that spans or lacks a natural repository owner, into well-shaped, responsibly governed progress and completed results.",
      passion: "Follow ambiguous, cross-boundary work from problem shaping through real decision gates to an implementation-ready handoff.",
      image: "/assets/thinking/joeops-circuits.jpg",
      link: null
    },
    {
      title: "CapacityOS",
      purpose: "Create more useful, reliable progress per unit of Joe's attention while preserving ownership, safety, and recoverability.",
      passion: "See whether a federated agent system can improve at the relationship level without centralizing local work or overgeneralizing weak evidence.",
      image: "/assets/thinking/capacityos-cockpit.jpg",
      link: null,
      staticStat: capacityStaticStat,
      stats: [
        { value: formatMetric(capacityMetrics.trackedFiles), label: "tracked files · total" },
        { value: formatMetric(capacityMetrics.commitsLastSevenDays), label: "commits · last 7 days" },
        { value: formatMetric(capacityMetrics.trackedAgentRuns), label: "agent runs · tracked total" },
        { value: formatMetric(capacityMetrics.thinkingWikiGraphLinks), label: "Thinking Wiki graph links" }
      ]
    },
    {
      title: "Church of AI",
      purpose: "Enable voluntary, legitimate agency over shared problems and resources, so positive-sum cooperation can outcompete coercive, extractive, or failing legacy institutions.",
      passion: "Enter an opt-in public experiment in better coordination, with honest boundaries around what is proven, active, and still deferred.",
      image: "/assets/thinking/threshold-door.jpg",
      link: "https://github.com/disruptionjoe/church-of-ai"
    },
    {
      title: "Time as Finality",
      purpose: "Test whether individual and collective record accumulation, with differing resistance to reversal, can ground physical structures including relativity and quantum dynamics.",
      passion: "Test whether distributed computing and physics can inform each other without either dissolving into metaphor.",
      image: "/assets/thinking/path-in-the-dark.jpg",
      link: "https://github.com/disruptionjoe/time-as-finality"
    },
    {
      title: "Temporal Issuance",
      purpose: "Determine whether ongoing issuance is necessary to keep reality open to genuine novelty rather than collapsing into a closed, fully determined process.",
      passion: "Watch a deep intuition become a disciplined research object that remains exposed to honest failure.",
      image: "/assets/thinking/issuance-seed.jpg",
      link: "https://github.com/disruptionjoe/temporal-issuance"
    },
    {
      title: "GU Formalization",
      purpose: "Adversarially establish GU's honest truth-status: force it, falsify it, or place it precisely, and determine what it would take to be a true account of physics.",
      passion: "See a serious heterodox claim investigated with disciplined skepticism, neither credulous nor prematurely dismissive.",
      image: "/assets/thinking/gu-formalization.jpg",
      link: "https://github.com/disruptionjoe/gu-formalization"
    },
    {
      title: "Architecture of Legitimacy",
      purpose: "Determine whether findable, substrate-bounded conditions can make enduring legitimacy constructible in a positive-sum game, with corruption and collusion nonviable rather than merely punishable.",
      passion: "Explore whether legitimate institutions can outperform extractive alternatives and accelerate durable positive-sum collaboration.",
      image: "/assets/thinking/architecture-legitimacy-church.jpg",
      link: "https://github.com/disruptionjoe/architecture-of-legitimacy"
    },
    {
      title: "Possibility to Capability",
      purpose: "Determine whether the possibility-to-dynamics-to-records-to-access-to-capability-to-finality hierarchy is a valid, transferable diagnostic of what changed in a system.",
      passion: "Test a shared diagnostic that connects projects without erasing their distinct meanings, evidence, or responsibilities.",
      image: "/assets/thinking/possibility-capability-point.jpg",
      link: "https://github.com/disruptionjoe/possibility-to-capability"
    },
    {
      title: "Continuity Ledger",
      purpose: "Determine whether constructed binding constraints, tracked through typed continuity relations, can generate new agency or capability rather than merely convert, disclose, import, or relabel what already exists.",
      passion: "Investigate whether agency can escape apparent limits without hidden subsidies, altered definitions, or after-the-fact explanations.",
      image: "/assets/thinking/continuity-ledger-abacus.jpg",
      link: "https://github.com/disruptionjoe/continuity-ledger"
    },
    {
      title: "Systemic Failure",
      purpose: "Make systemic failure legible without manufacturing certainty, turning credible signals, evidence, prior art, and contradiction into source-preserving models and answerable inquiries.",
      passion: "See complex failure clearly enough to respond without collapsing it into blame, ideology, or false certainty.",
      image: "/assets/thinking/exhibits/systemic-failure.jpg",
      link: "https://github.com/disruptionjoe/cai-systemic-failure"
    },
    {
      title: "Mechanism Design",
      purpose: "Discover and incubate solutions for consequential problems without a rightful existing owner, moving from inquiry through design, least-consequential proof, disposition, and earned graduation.",
      passion: "Follow a possible solution from diagnosis toward proof without mistaking cleverness or simulation for legitimate impact.",
      image: "/assets/thinking/exhibits/mechanism-design.jpg",
      link: "https://github.com/disruptionjoe/cai-mechanism-design"
    },
    {
      title: "CAI Governance Operations",
      purpose: "Maintain the System 2 through 5 functions across Church of AI's sovereign repositories, coordinating their work, optimizing the present, adapting strategy to the environment, and protecting clear policy and identity without centralizing their operational authority.",
      passion: "See a mission metasystem create coordination, intelligence, and policy coherence while sovereign projects keep their own truth.",
      image: "/assets/thinking/exhibits/cai-governance-operations.jpg",
      link: null
    },
    {
      title: "Caret^",
      purpose: "Reduce repeated agent instructions by turning recurring operational intent into compact Markdown-native notation.",
      passion: "Can a tiny semantic signal make agent direction clearer, faster, and more consistent without blurring authority?",
      image: "/assets/thinking/exhibits/caret.jpg",
      link: "https://github.com/disruptionjoe/caret"
    },
    {
      title: "Purity Protocol",
      purpose: "Make decentralized collective decision-making durable by building informed attention into its economic structure, so individual participation can reinforce collective increasing returns and sustain better, more representative signal over time.",
      passion: "Explore whether legitimate decentralization can begin founder-led, then transfer through explicit evidence gates without capture or permanent founder control.",
      image: "/assets/thinking/exhibits/purity-protocol.jpg",
      link: "https://github.com/disruptionjoe/purity-protocol"
    },
    {
      title: "Method Stewardship",
      purpose: "Keep DJC's methods coherent and trustworthy as they evolve, so clients receive a practice whose offers and delivery reinforce one another rather than becoming disconnected ideas.",
      passion: "See how distinct methods evolve independently while staying coherent enough to strengthen one practice.",
      image: "/assets/thinking/exhibits/method-stewardship.jpg",
      link: null
    },
    {
      title: "Offer Portfolio",
      purpose: "Make it possible for the right clients to confidently buy DJC help that is clear, valuable, and genuinely deliverable, protecting trust on both sides.",
      passion: "See evolving methods become precise promises without overstating proof or creating commitments delivery cannot honor.",
      image: "/assets/thinking/exhibits/offer-portfolio.jpg",
      link: null
    },
    {
      title: "Product Innovation",
      purpose: "Give DJC a protected innovation space that turns signals and ideas into bounded experiments and owner-routed proposals, while keeping offer and methodology canon clear until adoption is earned.",
      passion: "Watch ambiguity become useful experiments without confusing exploration with canonical promises or methods.",
      image: "/assets/thinking/exhibits/product-innovation.jpg",
      link: null
    },
    {
      title: "Demand Strategy",
      purpose: "Expand awareness of Disruption Joe Consulting among the organizations and people it can genuinely help, so more of the right people encounter, understand, and can choose its offers.",
      passion: "See meaningful buyer signals separated from noise so reach can improve without generic marketing or premature narrowing.",
      image: "/assets/thinking/exhibits/demand-strategy.jpg",
      link: null
    },
    {
      title: "Relationship Management",
      purpose: "Help valuable professional relationships become more trusting, useful, and mutually beneficial by ensuring the right people and organizations receive informed, timely attention.",
      passion: "Preserve useful context without reducing people to pipeline data or confusing a record with a real relationship.",
      image: "/assets/thinking/exhibits/relationship-management.jpg",
      link: null
    },
    {
      title: "Client Delivery",
      purpose: "Turn each client's justified trust in DJC into real, useful progress by fulfilling commitments with care, clarity, and professional integrity.",
      passion: "Coordinate confidential, high-trust work while preserving the actual promise, client context, evidence, and human accountability.",
      image: "/assets/thinking/exhibits/client-delivery.jpg",
      link: null
    },
    {
      title: "Practice Administration",
      purpose: "Make DJC a practice that clients can trust to do business with by keeping the commitments behind its work administratively sound, ready, and responsibly maintained.",
      passion: "Keep legal, financial, administrative, and secure-information context reliable without pretending to hold authority it does not.",
      image: "/assets/thinking/exhibits/practice-administration.jpg",
      link: null
    },
    {
      title: "Drafting Factory",
      purpose: "Reliably execute each owner's content strategy by producing consistent, high-quality, channel-appropriate, publication-ready artifacts at the pace and volume the strategy requires.",
      passion: "Run a capacity-aware production system while protecting claim discipline, source boundaries, and distinct voices.",
      image: "/assets/thinking/exhibits/drafting-factory.jpg",
      link: null
    },
    {
      title: "Brand and Media",
      purpose: "Make DJC and Church of AI recognizable, trustworthy, and strategically coherent wherever people encounter them by giving each a distinct brand system that its strategy and production owners can reliably use.",
      passion: "Turn purpose into usable voice and visual systems without blending the brands, becoming generic, or losing claim discipline.",
      image: "/assets/thinking/exhibits/homepage-neon.svg",
      link: null
    },
    {
      title: "Joe Governance Operations",
      purpose: "Help Joe direct a coherent, self-authored life and body of work by keeping his chosen opportunity engines, thinking, and commitments mutually reinforcing without centralizing the repositories that carry them.",
      passion: "See strategic coherence maintained across a personal domain without authority bleed, hidden control, or a generic life operating system.",
      image: "/assets/thinking/exhibits/joe-governance-operations.jpg",
      link: null
    },
    {
      title: "Joe Challenge Prizes",
      purpose: "Create a high-leverage path to independent income that funds Joe's mission by turning genuine agent-enabled advantage into competitive wins.",
      passion: "Test whether an agent-enabled system can outperform strong baselines under external rules without hidden labor or exposed internals.",
      image: "/assets/thinking/exhibits/challenge-prizes.jpg",
      link: null
    },
    {
      title: "System Runtime",
      purpose: "Make CapacityOS dependable in motion by giving approved workflows, transport, and execution machinery a stable place to run without confusing execution with policy, canon, or domain ownership.",
      passion: "See shared machinery execute reproducibly while preserving a hard boundary around what runs and what is allowed to decide.",
      image: "/assets/thinking/exhibits/system-runtime.jpg",
      link: null
    },
    {
      title: "System Operations",
      purpose: "Help CapacityOS create more useful, reliable progress per unit of Joe's attention by keeping its distributed domains, repositories, and shared services coherent without sacrificing sovereignty, safety, or recoverability.",
      passion: "Find cross-system leverage without centralizing local work or turning weak evidence into a universal rule.",
      image: "/assets/thinking/exhibits/system-operations.jpg",
      link: null
    },
    {
      title: "System Lab",
      purpose: "Help CapacityOS learn what is actually true about its own behavior, so shared changes are earned by evidence rather than architecture taste, isolated anecdotes, or institutional momentum, and its principles of subsidiarity and repository sovereignty remain visible and testable in use.",
      passion: "Investigate system behavior rigorously while preserving disconfirming evidence and the limits of local findings.",
      image: "/assets/thinking/exhibits/system-lab.jpg",
      link: null
    },
    {
      title: "System Canon",
      purpose: "Keep CapacityOS's shared rules dependable and legible by ensuring that only sufficiently evidenced, properly authorized changes become accepted System contracts.",
      passion: "Distinguish ideas, proposals, tested candidates, accepted canon, and constitutional change without laundering authority through documentation.",
      image: "/assets/thinking/exhibits/system-canon.jpg",
      link: null
    },
    {
      title: "System Attention",
      purpose: "Give Joe one continuously adapting, coherent interface to his work that protects his attention, remembers context, and maximizes productive system throughput per unit of his human charge.",
      passion: "Surface the right signal at the right time without duplicate prompts, false urgency, lost context, or overload.",
      image: "/assets/thinking/exhibits/system-attention.jpg",
      link: null
    },
    {
      title: "Dynamic Unity",
      purpose: "Discover unifying theories and laws of reality through a truth-seeking, verdict-agnostic research program.",
      passion: "Explore whether geometry combined with dynamics can tell a better unifying story, while every surviving claim remains exposed to self-verification.",
      image: "/assets/thinking/exhibits/dynamic-unity.jpg",
      link: "https://github.com/disruptionjoe/dynamic-unity"
    },
    {
      title: "NBL Governance Operations",
      purpose: "Advance ambitious open research toward discoveries worthy of the world's highest scientific honors.",
      passion: "See whether coordinated AI-assisted research can stay ambitious, publicly inspectable, and willing to abandon ideas that do not survive.",
      image: "/assets/thinking/exhibits/nbl-governance-operations.jpg",
      link: null,
      proximityRange: 1.1
    },
    {
      title: "About Joe",
      purpose: "Meet the person behind the practice, research, experiments, and systems.",
      passion: "Follow the experiences and principles that shaped how Joe works, what he questions, and why he builds in public.",
      image: "/assets/thinking/exhibits/about-joe.jpg",
      link: "/about/",
      linkLabel: "Meet Joe",
      linkStyle: "experience",
      linkTarget: "_self",
      proximityRange: 1.55
    },
    {
      title: "Joe on X",
      purpose: "Follow Joe's fastest-moving public questions, observations, and conversations.",
      passion: "Catch ideas while they are still live enough to be challenged, sharpened, and connected to other people.",
      image: "/assets/thinking/exhibits/joe-on-x.jpg",
      link: "https://x.com/DisruptionJoe",
      linkLabel: "Follow Joe on X",
      proximityRange: 1.55
    },
    {
      title: "Joe on LinkedIn",
      purpose: "Connect with Joe around professional practice, leadership, facilitation, and AI-enabled organizational change.",
      passion: "See the professional conversations and practical work where methods meet teams, leaders, and organizations.",
      image: "/assets/thinking/exhibits/joe-on-linkedin.jpg",
      link: "https://linkedin.com/in/disruptionjoe",
      linkLabel: "Connect on LinkedIn",
      proximityRange: 1.55
    },
    {
      title: "Joe on GitHub",
      purpose: "Explore Joe's public repositories, research programs, tools, and open working artifacts.",
      passion: "Walk the public workbench where ideas become versioned experiments, methods, software, and research.",
      image: "/assets/thinking/exhibits/joe-on-github.jpg",
      link: "https://github.com/disruptionjoe",
      linkLabel: "Explore Joe's GitHub",
      proximityRange: 1.55
    },
    {
      title: "Church of AI Substack",
      purpose: "Publish plain-language maps and dated updates that help people follow Church of AI's public work without overstating its maturity.",
      passion: "Read serious public work that stays accessible, claim-disciplined, and willing to admit what is still being built.",
      image: "/assets/thinking/exhibits/church-substack.jpg",
      link: "https://substack.com/@disruptionjoe",
      linkLabel: "Open the Substack"
    },
    {
      title: "Church of AI Social Accounts",
      purpose: "Give Church of AI's public maps and updates concise, channel-appropriate ways to reach people beyond the repository.",
      passion: "The short-form channels are intentionally not treated as live until Joe creates and uses the official accounts.",
      image: "/assets/thinking/exhibits/church-social-accounts.jpg",
      link: null
    },
    {
      title: "Joe's Research Publications",
      purpose: "Make Joe's research publications and dated public record easy to find from the Discover hall.",
      passion: "Move from the museum's research questions into the citable artifacts and publication record behind them.",
      image: "/assets/thinking/exhibits/research-publications.jpg",
      link: null
    },
    {
      title: "Enhanced Facilitation",
      purpose: "For leadership teams facing a consequential conversation, decision, or problem that needs more than a conventional workshop. Joe designs and facilitates AI-enhanced working sessions that turn many perspectives into shared clarity, stronger decisions, and committed action.",
      passion: "Bring Joe in when the room itself needs to become more intelligent: better prepared, better synthesized, and able to leave with a real next move.",
      image: "/assets/thinking/enhanced-facilitation-wall.png",
      link: null
    },
    {
      title: "Capability Acceleration",
      purpose: "For teams that need practical AI capability built through real work, not generic training. Joe creates guided experiences that help people develop stronger judgment, shared practice, and repeatable ways of working with AI.",
      passion: "Choose this when experimentation is happening but useful behavior has not yet spread across the team.",
      image: "/assets/thinking/capability-acceleration-wall.png",
      link: null
    },
    {
      title: "Enablement Architecture",
      purpose: "For leaders whose AI efforts are scattered, stalled, or hard to scale. Joe maps the dependencies across people, teams, governance, and systems so the organization can see its next viable move and build durable progress.",
      passion: "Choose this when isolated wins need to become an operating environment that can keep improving.",
      image: "/assets/thinking/enablement-architecture-wall.png",
      link: null
    },
    {
      title: "Make a consequential AI decision",
      purpose: "Bring together leaders with different perspectives and levels of AI understanding, work through the real tradeoffs, and leave with a grounded decision and clear next commitments.",
      passion: "Bring the decision, the perspectives that matter, and the real constraints. Joe will design the room around reaching grounded judgment and clear commitments.",
      displayType: "product",
      artworkPattern: "decision",
      artworkCode: "DECIDE",
      link: planningContactLink("Make a consequential AI decision"),
      linkLabel: "Work through a decision",
      linkStyle: "experience",
      linkTarget: "_self"
    },
    {
      title: "Make AI capability show up in real work",
      purpose: "Help people with different starting points use AI on work they actually do, develop shared practices, and keep applying what they learned after the session ends.",
      passion: "The work itself becomes the learning environment, so stronger judgment and shared practice can continue after the room ends.",
      displayType: "product",
      artworkPattern: "practice",
      artworkCode: "PRACTICE",
      link: planningContactLink("Make AI capability show up in real work"),
      linkLabel: "Plan a real-work lab",
      linkStyle: "experience",
      linkTarget: "_self"
    },
    {
      title: "Turn scattered AI activity into business value",
      purpose: "Identify where AI can produce meaningful value, what is preventing it from taking hold, and the ownership, measures, standards, and operating changes needed to make progress compound.",
      passion: "Make the value opportunities, adoption constraints, owners, measures, and operating changes visible enough to sequence the next move.",
      displayType: "product",
      artworkPattern: "value",
      artworkCode: "COMPOUND",
      link: planningContactLink("Turn scattered AI activity into business value"),
      linkLabel: "Explore the value opportunity",
      linkStyle: "experience",
      linkTarget: "_self"
    },
    {
      title: "Push an important R&D question further",
      purpose: "Use long-running agents, custom research harnesses, competing hypotheses, and rigorous evaluation to reduce a critical uncertainty while expanding what an advanced research team can reliably investigate.",
      passion: "Start with a bounded sprint around one urgent question, or continue into a longer research collaboration when the first work earns it.",
      displayType: "product",
      artworkPattern: "research",
      artworkCode: "INVESTIGATE",
      link: planningContactLink("Push an important R&D question further"),
      linkLabel: "Discuss an R&D challenge",
      linkStyle: "experience",
      linkTarget: "_self"
    },
    {
      title: "Bring more substantive applied AI work to your clients",
      purpose: "Refer, co-design, or co-deliver applied AI work that goes beyond generic training, with clear commercial roles and protection for your client relationship.",
      passion: "Create a partner path with clear roles, substantive work, and explicit protection for the client relationship you built.",
      displayType: "product",
      artworkPattern: "partner",
      artworkCode: "PARTNER",
      link: planningContactLink("Bring more substantive applied AI work to your clients"),
      linkLabel: "Explore a partner program",
      linkStyle: "experience",
      linkTarget: "_self"
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
      body: "Walk in to explore five valuable changes Joe helps leaders, teams, research groups, and partners create."
    },
    {
      label: "Control Room",
      kicker: "Behind the Scenes",
      body: "CapacityOS and the systems that keep Joe's work moving."
    }
  ];

  var developmentStatement = {
    label: "Development Laboratory",
    kicker: "The Build Space",
    body: "A small workshop for ideas becoming tools, methods, and public projects. Caret^ and Purity Protocol are being developed here."
  };

  function exhibitIndex(title) {
    return exhibits.findIndex(function (exhibit) {
      return exhibit.title === title;
    });
  }

  var workOfferStatements = [
    {
      label: "Capability Acceleration",
      kicker: "For teams ready to work differently",
      body: exhibits[exhibitIndex("Capability Acceleration")].purpose
    },
    {
      label: "Enablement Architecture",
      kicker: "For leaders making adoption last",
      body: exhibits[exhibitIndex("Enablement Architecture")].purpose
    },
    {
      label: "Enhanced Facilitation",
      kicker: "For consequential conversations",
      body: exhibits[exhibitIndex("Enhanced Facilitation")].purpose
    }
  ];

  var mobileStoryRooms = [
    {
      id: "work",
      number: "01",
      kicker: "Five Ways to Make Progress",
      title: "Work With Joe",
      body: "Start with the change you need. Each product leads to the same planning table with your intent already selected.",
      exhibits: [
        exhibitIndex("Make a consequential AI decision"),
        exhibitIndex("Make AI capability show up in real work"),
        exhibitIndex("Turn scattered AI activity into business value"),
        exhibitIndex("Push an important R&D question further"),
        exhibitIndex("Bring more substantive applied AI work to your clients")
      ]
    },
    {
      id: "methods",
      number: "02",
      kicker: "The Tool Room",
      title: "Methods and Tools",
      body: "See the three methodologies behind Joe's work, then open the repositories and interactive tools that support them.",
      exhibits: [
        exhibitIndex("Capability Acceleration"),
        exhibitIndex("Enhanced Facilitation"),
        exhibitIndex("Enablement Architecture"),
        exhibitIndex("AI Activation Playbooks"),
        exhibitIndex("AI Enablement Architecture"),
        exhibitIndex("AI Epistemology")
      ]
    },
    {
      id: "discover",
      number: "03",
      kicker: "The Research Hall",
      title: "Discover",
      body: "Follow the open research testing bold ideas and the methods used to strengthen or challenge them.",
      exhibits: [38, 10, 11, 12, 37, 14, 15, 45]
    },
    {
      id: "development",
      number: "04",
      kicker: "The Build Space",
      title: "Development Laboratory",
      body: "Visit the workshop where promising ideas become usable tools, methods, and public projects.",
      exhibits: [19, 20]
    },
    {
      id: "identity",
      number: "05",
      kicker: "The Person Behind the Work",
      title: "Who Is Joe",
      body: "Meet the person behind the practice, research, experiments, and systems.",
      exhibits: [39, 41, 42, 40, 3, 4]
    },
    {
      id: "control",
      number: "06",
      kicker: "Behind the Scenes",
      title: "Control Room",
      body: "Step inside CapacityOS to see how Joe coordinates a growing network of agents, repositories, and work.",
      exhibits: [8, 32, 33, 34, 35, 36]
    },
    {
      id: "supporting",
      number: "07",
      kicker: "Behind the Practice",
      title: "Support Systems",
      body: "See the systems behind the practice: how ideas, relationships, delivery, and publishing stay connected.",
      exhibits: [5, 6, 21, 22, 23, 24, 25, 26, 27, 28, 29, 7, 30, 31]
    },
    {
      id: "church",
      number: "08",
      kicker: "The Public Wing",
      title: "Church of AI",
      body: "Explore public-good experiments in coordination, contribution, and community-supported work.",
      exhibits: [9, 13, 16, 17, 18, 43, 44]
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
  var proximityAction = root.querySelector("[data-proximity-action]");
  var proximityLink = root.querySelector("[data-proximity-link]");
  var inspector = root.querySelector("[data-game-inspector]");
  var inspectorClose = root.querySelector("[data-inspector-close]");
  var inspectorKicker = root.querySelector("[data-inspector-kicker]");
  var inspectorTitle = root.querySelector("[data-inspector-title]");
  var inspectorBody = root.querySelector("[data-inspector-body]");
  var inspectorStats = root.querySelector("[data-inspector-stats]");
  var inspectorLink = root.querySelector("[data-inspector-link]");
  var inspectorBackdrop = root.querySelector("[data-inspector-backdrop]");
  var fallback = root.querySelector("[data-game-fallback]");
  var mobilePrev = root.querySelector("[data-mobile-prev]");
  var mobileNext = root.querySelector("[data-mobile-next]");
  var mobileInspect = root.querySelector("[data-mobile-inspect]");
  var mobileCount = root.querySelector("[data-mobile-count]");
  var mobileStories = root.querySelector("[data-mobile-stories]");
  var mobileRoomNav = root.querySelector("[data-mobile-room-nav]");

  var mobileStoryMedia = window.matchMedia("(max-width: 820px), (pointer: coarse)");

  if (mobileStoryMedia.matches && mobileStories) {
    initMobileStories();
    return;
  }

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

  function initMobileStories() {
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    var roomSections = [];
    var roomNavButtons = [];
    var roomTracks = [];
    var activeRoomIndex = -1;
    var lobbyNavButton = null;
    var lastStoryTrigger = null;
    var inspectorTouchStart = null;

    function makeElement(tag, className, text) {
      var element = document.createElement(tag);
      if (className) element.className = className;
      if (typeof text === "string") element.textContent = text;
      return element;
    }

    function scrollBehavior() {
      return reducedMotion ? "auto" : "smooth";
    }

    function pulse(duration) {
      if (navigator.vibrate) navigator.vibrate(duration || 6);
    }

    function closeMobileInspector(options) {
      var shouldRestoreFocus = !options || options.restoreFocus !== false;

      inspector.classList.remove("is-open", "is-capacity", "is-product");
      inspector.setAttribute("aria-hidden", "true");
      inspectorBackdrop.classList.remove("is-open");
      inspectorBackdrop.setAttribute("aria-hidden", "true");
      root.classList.remove("has-open-story-sheet");

      if (shouldRestoreFocus && lastStoryTrigger) lastStoryTrigger.focus();
      lastStoryTrigger = null;
    }

    function openMobileInspector(exhibitIndex, trigger) {
      var exhibit = exhibits[exhibitIndex];
      if (!exhibit) return;

      lastStoryTrigger = trigger || null;
      inspectorKicker.textContent = exhibit.displayType === "product"
        ? "A way to work with Joe"
        : "Passion / The live question";
      inspectorTitle.textContent = exhibit.title;
      inspectorBody.textContent = exhibit.passion;
      inspector.classList.toggle("is-capacity", Boolean(exhibit.stats));
      inspector.classList.toggle("is-product", exhibit.displayType === "product");

      inspectorStats.replaceChildren();
      inspectorStats.setAttribute("aria-hidden", exhibit.stats ? "false" : "true");
      if (exhibit.stats) {
        exhibit.stats.forEach(function (stat) {
          var item = makeElement("span", "game-inspector-stat");
          item.appendChild(makeElement("strong", "", stat.value));
          item.appendChild(makeElement("em", "", stat.label));
          inspectorStats.appendChild(item);
        });
      }

      inspectorLink.classList.toggle("is-experience", exhibit.linkStyle === "experience");
      if (exhibit.link) {
        inspectorLink.hidden = false;
        inspectorLink.href = exhibit.link;
        inspectorLink.textContent = exhibit.linkLabel || "See this repo on GitHub";
        if (exhibit.linkTarget === "_self") {
          inspectorLink.target = "_self";
          inspectorLink.removeAttribute("rel");
        } else {
          inspectorLink.target = "_blank";
          inspectorLink.rel = "noreferrer";
        }
      } else {
        inspectorLink.hidden = true;
        inspectorLink.removeAttribute("href");
      }

      inspector.classList.add("is-open");
      inspector.setAttribute("aria-hidden", "false");
      inspectorBackdrop.classList.add("is-open");
      inspectorBackdrop.setAttribute("aria-hidden", "false");
      root.classList.add("has-open-story-sheet");
      pulse(8);

      window.setTimeout(function () {
        inspectorClose.focus({ preventScroll: true });
      }, reducedMotion ? 0 : 180);
    }

    function updateRoom(roomIndex) {
      activeRoomIndex = roomIndex;
      root.dataset.storyRoom = mobileStoryRooms[roomIndex].id;
      if (lobbyNavButton) {
        lobbyNavButton.classList.remove("is-active");
        lobbyNavButton.setAttribute("aria-current", "false");
      }
      var roomTrack = roomTracks[roomIndex];
      if (roomTrack && roomTrack.activeIndex !== roomTrack.homeIndex) {
        roomTrack.track.scrollTo({
          left: roomTrack.homeIndex * roomTrack.track.clientWidth,
          behavior: "auto"
        });
        updateDoorOpening(roomTrack, roomTrack.homeIndex);
        updateTrack(roomTrack, roomTrack.homeIndex, false);
      }
      roomNavButtons.forEach(function (button, index) {
        var isActive = index === roomIndex;
        button.classList.toggle("is-active", isActive);
        button.setAttribute("aria-current", isActive ? "step" : "false");
      });
    }

    function updateIntro() {
      activeRoomIndex = -1;
      root.dataset.storyRoom = "intro";
      if (lobbyNavButton) {
        lobbyNavButton.classList.add("is-active");
        lobbyNavButton.setAttribute("aria-current", "page");
      }
      roomNavButtons.forEach(function (button) {
        button.classList.remove("is-active");
        button.setAttribute("aria-current", "false");
      });
    }

    function updateDoorOpening(trackState, normalizedPosition) {
      trackState.doorways.forEach(function (doorwayState) {
        var progress = Math.max(0, Math.min(1, Math.abs(normalizedPosition - doorwayState.index)));
        doorwayState.element.style.setProperty("--door-left-shift", String(progress * -100) + "%");
        doorwayState.element.style.setProperty("--door-right-shift", String(progress * 100) + "%");
      });
    }

    function updateTrack(trackState, nextIndex, withPulse) {
      var boundedIndex = Math.max(0, Math.min(trackState.cards.length - 1, nextIndex));
      if (boundedIndex === trackState.activeIndex && trackState.hasSynced) return;

      if (withPulse && boundedIndex !== trackState.activeIndex) pulse(4);
      trackState.activeIndex = boundedIndex;
      trackState.hasSynced = true;
      var cardState = trackState.cardMeta[boundedIndex];
      var isDoorway = cardState.kind === "doorway";
      trackState.section.classList.toggle("is-at-doorway", isDoorway);
      trackState.count.textContent = isDoorway
        ? "Elevator"
        : String(cardState.ordinal).padStart(2, "0") + " / " + String(trackState.exhibitCount).padStart(2, "0");
      trackState.cards.forEach(function (card, index) {
        var isActive = index === boundedIndex;
        var revealButton = card.querySelector(".mobile-story-passion");
        card.classList.toggle("is-active", isActive);
        card.setAttribute("aria-hidden", isActive ? "false" : "true");
        card.inert = !isActive;
        if (revealButton) revealButton.tabIndex = isActive ? 0 : -1;
      });
      var progressKey = isDoorway ? "elevator" : "exhibit:" + cardState.ordinal;
      trackState.dots.forEach(function (dot) {
        var isActive = dot.dataset.storyProgress === progressKey;
        dot.classList.toggle("is-active", isActive);
        dot.setAttribute("aria-current", isActive ? "true" : "false");
      });
    }

    function moveTrack(trackState, direction) {
      var nextIndex = Math.max(0, Math.min(trackState.cards.length - 1, trackState.activeIndex + direction));
      if (nextIndex === trackState.activeIndex) return;
      trackState.track.scrollTo({
        left: nextIndex * trackState.track.clientWidth,
        behavior: scrollBehavior()
      });
      updateTrack(trackState, nextIndex, true);
    }

    root.dataset.mode = "stories";
    root.dataset.ready = "true";
    root.classList.add("is-loaded", "has-hidden-loader", "is-started", "has-mobile-stories");
    canvas.setAttribute("aria-hidden", "true");
    inspectorClose.textContent = "Done";
    mobileStories.hidden = false;
    mobileRoomNav.hidden = false;
    mobileStories.replaceChildren();
    mobileRoomNav.replaceChildren();
    mobileRoomNav.setAttribute("aria-label", "Elevator floors");

    var introSection = makeElement("section", "mobile-story-intro");
    var introFrame = makeElement("div", "mobile-story-intro-frame");
    var introKicker = makeElement("p", "mobile-story-intro-kicker", "Disruption Joe's Thinking Museum / Lobby");
    var introTitle = makeElement("h1", "", "Ride the elevator.");
    var introCopy = makeElement("p", "mobile-story-intro-copy", "This is the lobby. Eight floors are waiting.");
    var introGestures = makeElement("div", "mobile-story-intro-gestures");
    var verticalGesture = makeElement("div", "mobile-story-intro-gesture");
    var horizontalGesture = makeElement("div", "mobile-story-intro-gesture");
    var introStart = makeElement("button", "mobile-story-intro-start", "Take the elevator to Floor 01");
    var introNote = makeElement("p", "mobile-story-intro-note", "Every floor is one circuit. Either direction brings you back to the elevator.");
    var introTitleId = "mobile-story-intro-title";

    introSection.dataset.storyIntro = "true";
    introSection.setAttribute("aria-labelledby", introTitleId);
    introSection.setAttribute("tabindex", "-1");
    introTitle.id = introTitleId;

    lobbyNavButton = makeElement("button", "mobile-story-room-button mobile-story-lobby-button", "L");
    lobbyNavButton.type = "button";
    lobbyNavButton.setAttribute("aria-label", "Return to the museum lobby");
    lobbyNavButton.title = "Lobby";
    lobbyNavButton.addEventListener("click", function () {
      introSection.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
      updateIntro();
      pulse(5);
    });
    mobileRoomNav.appendChild(lobbyNavButton);

    verticalGesture.appendChild(makeElement("span", "mobile-story-intro-icon", "\u2195"));
    var verticalGestureCopy = makeElement("span", "mobile-story-intro-gesture-copy");
    verticalGestureCopy.appendChild(makeElement("strong", "", "Move between floors"));
    verticalGestureCopy.appendChild(makeElement("small", "", "Scroll up or down. The floor indicator shows where you are."));
    verticalGesture.appendChild(verticalGestureCopy);

    horizontalGesture.appendChild(makeElement("span", "mobile-story-intro-icon", "\u2194"));
    var horizontalGestureCopy = makeElement("span", "mobile-story-intro-gesture-copy");
    horizontalGestureCopy.appendChild(makeElement("strong", "", "Circle the floor"));
    horizontalGestureCopy.appendChild(makeElement("small", "", "Swipe right to explore in order, or left to explore in reverse. Keep going to return to the elevator."));
    horizontalGesture.appendChild(horizontalGestureCopy);

    introGestures.appendChild(verticalGesture);
    introGestures.appendChild(horizontalGesture);
    introStart.type = "button";
    introStart.setAttribute("aria-label", "Take the elevator to Floor 01, Work With Joe");
    introStart.addEventListener("click", function () {
      roomSections[0].scrollIntoView({ behavior: scrollBehavior(), block: "start" });
      updateRoom(0);
      pulse(5);
    });
    introFrame.appendChild(introKicker);
    introFrame.appendChild(introTitle);
    introFrame.appendChild(introCopy);
    introFrame.appendChild(introGestures);
    introFrame.appendChild(introStart);
    introFrame.appendChild(introNote);
    introSection.appendChild(introFrame);
    mobileStories.appendChild(introSection);

    mobileStoryRooms.forEach(function (room, roomIndex) {
      var roomTitleId = "mobile-story-room-" + room.id;
      var doorTitleId = roomTitleId + "-door";
      var section = makeElement("section", "mobile-story-room");
      var header = makeElement("header", "mobile-story-room-header");
      var headingLine = makeElement("div", "mobile-story-room-heading");
      var intro = makeElement("div", "mobile-story-room-intro");
      var progress = makeElement("div", "mobile-story-exhibit-progress");
      var count = makeElement("span", "mobile-story-count");
      var dots = makeElement("div", "mobile-story-dots");
      var track = makeElement("div", "mobile-story-track");
      var navButton = makeElement("button", "mobile-story-room-button", room.number);
      var trackState = {
        section: section,
        track: track,
        cards: [],
        cardMeta: [],
        dots: [],
        doorways: [],
        count: count,
        exhibitCount: room.exhibits.length,
        activeIndex: 0,
        homeIndex: 0,
        hasSynced: false,
        scrollFrame: 0,
        loopTimer: 0
      };

      section.dataset.storyRoom = room.id;
      section.setAttribute("aria-labelledby", roomTitleId);
      section.setAttribute("tabindex", "-1");
      headingLine.appendChild(makeElement("span", "mobile-story-room-number", room.number));
      headingLine.appendChild(makeElement("span", "mobile-story-room-kicker", room.kicker));
      intro.appendChild(makeElement("h2", "", room.title));
      intro.lastChild.id = roomTitleId;
      intro.appendChild(makeElement("p", "", room.body));
      progress.appendChild(count);
      progress.appendChild(dots);
      header.appendChild(headingLine);
      header.appendChild(intro);
      header.appendChild(progress);

      navButton.type = "button";
      navButton.setAttribute("aria-label", "Go to " + room.title);
      navButton.title = room.title;
      navButton.addEventListener("click", function () {
        section.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
        updateRoom(roomIndex);
        pulse(5);
      });
      mobileRoomNav.appendChild(navButton);
      roomNavButtons.push(navButton);

      function appendDoorway(position, includeProgressDot) {
        var panelIndex = trackState.cards.length;
        var doorwayId = doorTitleId + "-" + position;
        var doorway = makeElement("article", "mobile-story-card mobile-story-doorway");
        var doorwayFrame = makeElement("div", "mobile-story-doorway-frame");
        var doorwayDepth = makeElement("div", "mobile-story-doorway-depth");
        var doorwayIndicator = makeElement("div", "mobile-story-doorway-indicator");
        var doorwayCopy = makeElement("div", "mobile-story-doorway-copy");
        var doorwayDot = makeElement("button", "mobile-story-dot mobile-story-doorway-dot");

        doorway.dataset.storyDoorway = room.id;
        doorway.dataset.doorwayPosition = position;
        doorway.classList.toggle("is-loop-doorway", position !== "center");
        doorway.setAttribute("aria-labelledby", doorwayId);
        doorwayIndicator.appendChild(makeElement("span", "", "Floor"));
        doorwayIndicator.appendChild(makeElement("strong", "", room.number));
        doorwayCopy.appendChild(makeElement("p", "mobile-story-doorway-level", "Floor " + room.number));
        doorwayCopy.appendChild(makeElement("p", "mobile-story-doorway-kicker", room.kicker));
        doorwayCopy.appendChild(makeElement("h2", "", room.title));
        doorwayCopy.lastChild.id = doorwayId;
        doorwayCopy.appendChild(makeElement("p", "mobile-story-doorway-body", room.body));
        doorwayCopy.appendChild(makeElement("p", "mobile-story-doorway-enter", "\u2194  Swipe either way to circle the floor"));
        doorwayDepth.appendChild(makeElement("span"));
        doorwayDepth.appendChild(makeElement("span"));
        doorwayDepth.appendChild(makeElement("span"));
        doorwayFrame.appendChild(doorwayDepth);
        doorwayFrame.appendChild(doorwayIndicator);
        doorwayFrame.appendChild(doorwayCopy);
        doorway.appendChild(doorwayFrame);
        doorway.appendChild(makeElement("p", "mobile-story-doorway-level-hint", "\u2195  Ride to another floor"));
        track.appendChild(doorway);
        trackState.cards.push(doorway);
        trackState.cardMeta.push({ kind: "doorway", position: position });
        trackState.doorways.push({ element: doorway, index: panelIndex });

        if (includeProgressDot) {
          doorwayDot.type = "button";
          doorwayDot.dataset.storyProgress = "elevator";
          doorwayDot.setAttribute("aria-label", "Return to the elevator on " + room.title);
          doorwayDot.addEventListener("click", function () {
            track.scrollTo({ left: panelIndex * track.clientWidth, behavior: scrollBehavior() });
            updateTrack(trackState, panelIndex, true);
          });
          dots.appendChild(doorwayDot);
          trackState.dots.push(doorwayDot);
        }
        return panelIndex;
      }

      function appendExhibit(exhibitIndex, ordinal, direction, includeProgressDot) {
        var exhibit = exhibits[exhibitIndex];
        var panelIndex = trackState.cards.length;
        var card = makeElement("article", "mobile-story-card");
        var linework = makeElement("div", "mobile-story-linework");
        var figure = makeElement("figure", "mobile-story-artifact");
        var image = document.createElement("img");
        var purpose = makeElement("div", "mobile-story-purpose");
        var reveal = makeElement(exhibit.mobileDirectLink ? "a" : "button", "mobile-story-passion", exhibit.mobileDirectLink ? exhibit.linkLabel : "Reveal the passion");
        var dot = makeElement("button", "mobile-story-dot");

        card.dataset.exhibitIndex = String(exhibitIndex);
        card.dataset.storyDirection = direction.toLowerCase();
        card.setAttribute("aria-label", exhibit.title);
        linework.appendChild(makeElement("span"));
        linework.appendChild(makeElement("span"));
        card.appendChild(linework);

        if (exhibit.displayType === "product") {
          var productInstallation = makeElement("div", "mobile-story-product-installation is-" + exhibit.artworkPattern);
          var productCode = makeElement("span", "mobile-story-product-code", exhibit.artworkCode);
          var productDiagram = makeElement("span", "mobile-story-product-diagram");
          for (var productNodeIndex = 0; productNodeIndex < 6; productNodeIndex += 1) {
            productDiagram.appendChild(makeElement("i"));
          }
          productInstallation.appendChild(productCode);
          productInstallation.appendChild(productDiagram);
          figure.classList.add("is-product");
          figure.setAttribute("aria-hidden", "true");
          figure.appendChild(productInstallation);
        } else if (exhibit.mobileArtwork === "contact") {
          var contactInstallation = makeElement("div", "mobile-story-contact-installation");
          var contactLabel = makeElement("span", "mobile-story-contact-label", "Plan a Call");
          var contactPlate = makeElement("span", "mobile-story-contact-plate");
          contactPlate.appendChild(makeElement("span", "mobile-story-contact-button"));
          contactInstallation.appendChild(contactLabel);
          contactInstallation.appendChild(contactPlate);
          figure.classList.add("is-contact");
          figure.setAttribute("aria-hidden", "true");
          figure.appendChild(contactInstallation);
        } else if (exhibit.image) {
          image.src = exhibit.image;
          image.alt = exhibit.title + " exhibit artwork";
          image.decoding = "async";
          image.loading = roomIndex === 0 ? "eager" : "lazy";
          figure.appendChild(image);
        } else {
          figure.classList.add("is-empty");
          figure.setAttribute("aria-hidden", "true");
        }
        card.appendChild(figure);

        var cardLabel = room.id === "work"
          ? (exhibit.mobileDirectLink ? "Next Step" : "Offer " + String(ordinal).padStart(2, "0"))
          : "Exhibit " + String(ordinal).padStart(2, "0") + " / Purpose";
        purpose.appendChild(makeElement("p", "mobile-story-purpose-label", cardLabel));
        purpose.appendChild(makeElement("h3", "", exhibit.title));
        purpose.appendChild(makeElement("p", "mobile-story-purpose-copy", exhibit.purpose));
        if (exhibit.mobileDirectLink) {
          reveal.classList.add("is-direct");
          reveal.href = exhibit.link;
          reveal.target = exhibit.linkTarget || "_self";
          reveal.setAttribute("aria-label", exhibit.linkLabel);
        } else {
          reveal.type = "button";
          reveal.setAttribute("aria-label", "Reveal the passion behind " + exhibit.title);
          reveal.addEventListener("click", function () {
            openMobileInspector(exhibitIndex, reveal);
          });
        }
        purpose.appendChild(reveal);
        purpose.appendChild(makeElement("p", "mobile-story-swipe-hint", exhibit.mobileDirectLink ? "Open the planning page" : "Tap the button to open Passion"));
        card.appendChild(purpose);
        track.appendChild(card);
        trackState.cards.push(card);
        trackState.cardMeta.push({ kind: "exhibit", ordinal: ordinal, direction: direction });

        if (includeProgressDot) {
          dot.type = "button";
          dot.dataset.storyProgress = "exhibit:" + ordinal;
          dot.setAttribute("aria-label", "Show " + exhibit.title);
          dot.addEventListener("click", function () {
            track.scrollTo({ left: panelIndex * track.clientWidth, behavior: scrollBehavior() });
            updateTrack(trackState, panelIndex, true);
          });
          dots.appendChild(dot);
          trackState.dots.push(dot);
        }
      }

      appendDoorway("left-return", false);
      room.exhibits.forEach(function (exhibitIndex, exhibitIndexOnFloor) {
        appendExhibit(exhibitIndex, exhibitIndexOnFloor + 1, "Left", false);
      });
      trackState.homeIndex = appendDoorway("center", true);
      room.exhibits.forEach(function (exhibitIndex, exhibitIndexOnFloor) {
        appendExhibit(exhibitIndex, exhibitIndexOnFloor + 1, "Right", true);
      });
      appendDoorway("right-return", false);

      track.setAttribute(
        "aria-label",
        room.title + " elevator with a continuous " + (room.id === "work" ? "offer" : "exhibit") + " circuit"
      );
      track.addEventListener("scroll", function () {
        if (trackState.scrollFrame) window.cancelAnimationFrame(trackState.scrollFrame);
        if (trackState.loopTimer) window.clearTimeout(trackState.loopTimer);
        trackState.scrollFrame = window.requestAnimationFrame(function () {
          var normalizedPosition = track.scrollLeft / Math.max(track.clientWidth, 1);
          updateDoorOpening(trackState, normalizedPosition);
          var nextIndex = Math.round(normalizedPosition);
          updateTrack(trackState, nextIndex, true);
          if (nextIndex === 0 || nextIndex === trackState.cards.length - 1) {
            trackState.loopTimer = window.setTimeout(function () {
              track.scrollTo({
                left: trackState.homeIndex * track.clientWidth,
                behavior: "auto"
              });
              updateDoorOpening(trackState, trackState.homeIndex);
              updateTrack(trackState, trackState.homeIndex, false);
              trackState.loopTimer = 0;
            }, reducedMotion ? 40 : 180);
          }
          trackState.scrollFrame = 0;
        });
      }, { passive: true });

      section.appendChild(header);
      section.appendChild(track);
      mobileStories.appendChild(section);
      roomSections.push(section);
      roomTracks.push(trackState);
      track.scrollLeft = trackState.homeIndex * track.clientWidth;
      updateDoorOpening(trackState, trackState.homeIndex);
      updateTrack(trackState, trackState.homeIndex, false);
    });

    updateIntro();

    if ("IntersectionObserver" in window) {
      var roomObserver = new IntersectionObserver(function (entries) {
        var visible = entries.filter(function (entry) { return entry.isIntersecting; })
          .sort(function (a, b) { return b.intersectionRatio - a.intersectionRatio; });
        if (!visible.length) return;
        if (visible[0].target === introSection) {
          if (activeRoomIndex !== -1) updateIntro();
          return;
        }
        var nextRoomIndex = roomSections.indexOf(visible[0].target);
        if (nextRoomIndex !== -1 && nextRoomIndex !== activeRoomIndex) {
          updateRoom(nextRoomIndex);
          pulse(5);
        }
      }, {
        root: mobileStories,
        threshold: [0.52, 0.72, 0.9]
      });
      roomObserver.observe(introSection);
      roomSections.forEach(function (section) { roomObserver.observe(section); });
    }

    inspectorClose.addEventListener("click", function () { closeMobileInspector(); });
    inspectorBackdrop.addEventListener("click", function () { closeMobileInspector(); });
    inspector.addEventListener("touchstart", function (event) {
      if (event.touches.length !== 1 || inspector.scrollTop > 0) return;
      inspectorTouchStart = {
        x: event.touches[0].clientX,
        y: event.touches[0].clientY
      };
    }, { passive: true });
    inspector.addEventListener("touchend", function (event) {
      if (!inspectorTouchStart || !event.changedTouches.length) return;
      var deltaX = event.changedTouches[0].clientX - inspectorTouchStart.x;
      var deltaY = event.changedTouches[0].clientY - inspectorTouchStart.y;
      inspectorTouchStart = null;
      if (deltaY > 72 && Math.abs(deltaY) > Math.abs(deltaX) * 1.15) closeMobileInspector();
    }, { passive: true });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape" && inspector.classList.contains("is-open")) {
        closeMobileInspector();
        return;
      }
      if (inspector.classList.contains("is-open")) return;

      if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
        if (activeRoomIndex < 0) return;
        event.preventDefault();
        moveTrack(roomTracks[activeRoomIndex], event.key === "ArrowRight" ? 1 : -1);
      }
      if (event.key === "ArrowDown" || event.key === "ArrowUp") {
        if (activeRoomIndex < 0) {
          if (event.key === "ArrowDown") {
            event.preventDefault();
            roomSections[0].scrollIntoView({ behavior: scrollBehavior(), block: "start" });
            updateRoom(0);
            pulse(5);
          }
          return;
        }
        event.preventDefault();
        if (event.key === "ArrowUp" && activeRoomIndex === 0) {
          introSection.scrollIntoView({ behavior: scrollBehavior(), block: "start" });
          updateIntro();
          pulse(5);
          return;
        }
        var nextRoom = Math.max(0, Math.min(roomSections.length - 1, activeRoomIndex + (event.key === "ArrowDown" ? 1 : -1)));
        if (nextRoom !== activeRoomIndex) {
          roomSections[nextRoom].scrollIntoView({ behavior: scrollBehavior(), block: "start" });
          updateRoom(nextRoom);
          pulse(5);
        }
      }
    });

    window.addEventListener("resize", function () {
      roomTracks.forEach(function (trackState) {
        trackState.track.scrollLeft = trackState.activeIndex * trackState.track.clientWidth;
      });
    }, { passive: true });
  }

  import("/assets/vendor/three.module.min.js").then(function (THREE) {
    initMuseum(THREE);
  }).catch(function () {
    showFallback("The local 3D library did not load. The current Thinking experience is still available.");
  });

  function initMuseum(THREE) {
    var isMobile = window.matchMedia("(max-width: 820px), (pointer: coarse)").matches;
    var reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
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
    var graveyardTombstones = [];
    var backWallNeon = null;
    var backWallNeonLight = null;
    var laboratoryBubbles = [];
    var laboratoryGlowLight = null;
    var laboratoryLastUpdate = 0;
    var laboratoryReducedMotionSettled = false;
    var laboratoryCenter = { x: -8.2, z: -25.0 };
    var roomFixtures = [];
    var contactButtonAnchors = [];
    var mobileIndex = -1;
    var currentProximityIndex = -1;
    var currentProximityKey = "";
    var started = false;
    var yaw = Math.PI;
    var pitch = 0;
    var keys = {};
    var lastFrameTime = performance.now();
    var centralObject = { x: 0, z: 0.1, radius: 1.85 };
    var pushingRoomOffset = { x: -25.6, z: -1.0 };
    var pushingRoom = null;
    var workRoomOffset = { x: 4.2, z: 6.5 };
    var whoIsJoeSourceDoorCenter = { x: -2.32, z: -18.9 };
    var workRoomLayout = {
      west: 5.18,
      east: 16.68,
      south: -11.0,
      north: 2.0,
      centerX: 10.93,
      centerZ: -4.5,
      supportConnectorX: 14.18
    };
    var methodsRoomLayout = {
      west: 3.18,
      east: 16.68,
      north: -15.5,
      south: -27.0,
      centerX: 9.93,
      centerZ: -21.25
    };
    var workRoom = null;
    var entranceView = { x: 0, y: 1.68, z: -8.8, yaw: Math.PI };
    var elevator = {
      state: "idle",
      phaseStarted: 0,
      sourceDoors: null,
      destinationDoors: null,
      sourceCenter: whoIsJoeSourceDoorCenter,
      destinationCenter: { x: 40.25, z: 1.0 },
      indicatorMaterials: [],
      movementLocked: false,
      transported: false,
      cooldownSide: null
    };
    var walkableZones = [
      { name: "church", xMin: -8.35, xMax: 8.35, zMin: -58.4, zMax: -31.2 },
      { name: "graveyard-entry", xMin: 8.0, xMax: 14.3, zMin: -54.15, zMax: -50.55 },
      { name: "graveyard-hall", xMin: 12.4, xMax: 16.0, zMin: -76.8, zMax: -50.55 },
      { name: "graveyard-field", xMin: 3.4, xMax: 25.0, zMin: -97.5, zMax: -75.7 },
      { name: "discover-church-link", xMin: -15.55, xMax: -7.9, zMin: -53.65, zMax: -50.95 },
      { name: "discover-spine", xMin: -15.55, xMax: -11.25, zMin: -52.3, zMax: -12.2 },
      { name: "discover-entry-a", xMin: -8.0, xMax: -4.6, zMin: -10.05, zMax: -7.25 },
      { name: "discover-entry-b", xMin: -9.4, xMax: -6.6, zMin: -12.5, zMax: -8.65 },
      { name: "discover-entry-c", xMin: -15.55, xMax: -7.7, zMin: -13.9, zMax: -11.1 },
      { name: "development-entry", xMin: -11.5, xMax: -10.1, zMin: -26.65, zMax: -23.35 },
      { name: "development-room", xMin: -11.25, xMax: -4.75, zMin: -28.7, zMax: -21.3 },
      { name: "support-work-leg", xMin: workRoomOffset.x + workRoomLayout.supportConnectorX - 1.25, xMax: workRoomOffset.x + workRoomLayout.supportConnectorX + 1.25, zMin: workRoomOffset.z + workRoomLayout.north - 0.25, zMax: 25.25 },
      { name: "support-cross-hall", xMin: -21.45, xMax: workRoomOffset.x + workRoomLayout.supportConnectorX + 0.2, zMin: 22.65, zMax: 27.35 },
      { name: "support-control-leg", xMin: -22.45, xMax: -19.95, zMin: 8.9, zMax: 25.25 },
      { name: "church-approach", xMin: -1.4, xMax: 1.4, zMin: -31.2, zMax: -29.2 },
      { name: "church-transition-narrow", xMin: -1.4, xMax: 1.4, zMin: -29.25, zMax: -28.45 },
      { name: "church-transition-mid", xMin: -1.65, xMax: 1.65, zMin: -28.5, zMax: -27.7 },
      { name: "church-transition-wide", xMin: -1.9, xMax: 1.9, zMin: -27.75, zMax: -26.95 },
      { name: "church-hallway", xMin: -2.15, xMax: 2.15, zMin: -27.0, zMax: -10.8 },
      { name: "orientation", xMin: -4.75, xMax: 4.75, zMin: -10.8, zMax: 5.68 },
      { name: "work-entry", xMin: 4.6, xMax: workRoomOffset.x + workRoomLayout.west + 0.2, zMin: -0.7, zMax: 2.7 },
      { name: "work-room", xMin: workRoomOffset.x + workRoomLayout.west + 0.17, xMax: workRoomOffset.x + workRoomLayout.east - 0.17, zMin: workRoomOffset.z + workRoomLayout.south + 0.25, zMax: workRoomOffset.z + workRoomLayout.north - 0.25 },
      { name: "methods-hall", xMin: workRoomOffset.x + 13.93, xMax: workRoomOffset.x + 16.43, zMin: workRoomOffset.z + methodsRoomLayout.north - 0.5, zMax: workRoomOffset.z + workRoomLayout.south + 0.25 },
      { name: "methods-room", xMin: workRoomOffset.x + methodsRoomLayout.west + 0.25, xMax: workRoomOffset.x + methodsRoomLayout.east - 0.25, zMin: workRoomOffset.z + methodsRoomLayout.south + 0.25, zMax: workRoomOffset.z + methodsRoomLayout.north - 0.25 },
      { name: "identity-entry-narrow", xMin: workRoomOffset.x + workRoomLayout.east - 0.15, xMax: workRoomOffset.x + workRoomLayout.east + 1.1, zMin: 0.58, zMax: 1.42 },
      { name: "identity-entry-wide", xMin: workRoomOffset.x + workRoomLayout.east - 0.25, xMax: workRoomOffset.x + workRoomLayout.east + 2.45, zMin: -0.9, zMax: 2.9 },
      { name: "identity-hallway", xMin: workRoomOffset.x + workRoomLayout.east + 2.1, xMax: 40.15, zMin: -1.15, zMax: 3.15 },
      { name: "identity-side-entry", xMin: 28.75, xMax: 33.25, zMin: -2.0, zMax: -0.8 },
      { name: "identity-side-gallery", xMin: 24.25, xMax: 38.25, zMin: -8.7, zMax: -1.65 },
      { name: "identity-destination-cab", xMin: 39.95, xMax: 44.25, zMin: -0.5, zMax: 2.5 },
      { name: "identity-source-cab", xMin: -5.75, xMax: -2.0, zMin: whoIsJoeSourceDoorCenter.z - 1.45, zMax: whoIsJoeSourceDoorCenter.z + 1.45 },
      { name: "pushing-entry", xMin: -17.8, xMax: -4.6, zMin: 0.2, zMax: 3.6 },
      { name: "pushing-room", xMin: -33.95, xMax: -17.25, zMin: -12.45, zMax: 9.1 }
    ];
    var proximityRange = 2.175;
    var capacityProximityRange = 4.35;

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

    if (proximityAction) {
      proximityAction.addEventListener("click", function () {
        if (proximityAction.dataset.action === "enter-who-is-joe") {
          enterWhoIsJoeFromWebsite();
        } else if (proximityAction.dataset.action === "contact-joe") {
          window.location.assign("/contact/");
        }
      });
    }

    canvas.addEventListener("click", pickExhibit);
    canvas.addEventListener("pointermove", updateInteractiveCursor);

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
      addGraveyardWing();
      addHallwayStatements();
      addOrientationHallway();
      addWelcomeWallStatement();
      addSupportingHallway();
      addDiscoverWing();
      addWorkWithJoeRoom(workRoom);
      addWhoIsJoeExperience();
      addContactWallButton();
      addHallwayGallery();
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
        { x: -5.18, z: -10.83, length: 0.95, rotation: Math.PI / 2 },
        { x: -5.18, z: -3.7, length: 6.5, rotation: Math.PI / 2 },
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
        x: -5.15,
        z: -8.65,
        rotation: Math.PI / 2,
        title: "Discover",
        reverseTitle: "Orientation Hallway"
      });
      addPortal({
        x: 5.15,
        z: 1.0,
        rotation: -Math.PI / 2,
        title: "Work With Joe",
        reverseTitle: "Orientation Hallway"
      });
      var workEntryEnd = workRoomOffset.x + workRoomLayout.west;
      var workEntryLength = workEntryEnd - 5.15;
      var workEntryCenter = (5.15 + workEntryEnd) / 2;
      addLineBox(new THREE.Vector3(workEntryCenter, 2.4, 1.0), new THREE.Vector3(workEntryLength, 4.8, 3.4), 0.24);
      addDarkWall({ x: workEntryCenter, z: -0.7, length: workEntryLength, rotation: 0 });
      addDarkWall({ x: workEntryCenter, z: 2.7, length: workEntryLength, rotation: 0 });
      addPortal({
        x: -5.15,
        z: 1.8,
        rotation: Math.PI / 2,
        title: "Control Room",
        reverseTitle: "Orientation Hallway"
      });
      var controlRoomEastEdge = pushingRoomOffset.x + 8.5;
      var controlEntryStart = -5.15;
      var controlEntryLength = controlEntryStart - controlRoomEastEdge;
      var controlEntryCenter = (controlEntryStart + controlRoomEastEdge) / 2;
      addLineBox(new THREE.Vector3(controlEntryCenter, 2.4, 1.8), new THREE.Vector3(controlEntryLength, 4.8, 3.4), 0.24);
      addDarkWall({ x: controlEntryCenter, z: 0.2, length: controlEntryLength, rotation: 0 });
      addDarkWall({ x: controlEntryCenter, z: 3.6, length: controlEntryLength, rotation: 0 });
      addEntrancePlacards();
    }

    function addWelcomeWallStatement() {
      var statement = new THREE.Mesh(
        new THREE.PlaneGeometry(5.45, 4.12),
        new THREE.MeshBasicMaterial({
          map: makeWelcomeWallTexture(),
          transparent: true,
          side: THREE.DoubleSide,
          depthWrite: false
        })
      );
      statement.position.set(-5.12, 2.55, -3.425);
      statement.rotation.y = Math.PI / 2;
      scene.add(statement);

      var statementLight = new THREE.PointLight(0xffe3a6, 0.22, 6.5);
      statementLight.position.set(-3.85, 3.1, -3.425);
      scene.add(statementLight);
    }

    function addDiscoverWing() {
      addJoinedLineBox(new THREE.Vector3(-6.59, 2.4, -8.65), new THREE.Vector3(2.82, 4.8, 3.4), 0.26, [0]);
      addJoinedLineBox(new THREE.Vector3(-8.0, 2.4, -10.58), new THREE.Vector3(3.4, 4.8, 3.85), 0.26, [0, 2]);
      addJoinedLineBox(new THREE.Vector3(-11.95, 2.4, -12.5), new THREE.Vector3(7.9, 4.8, 3.4), 0.26, [2]);
      addJoinedLineBox(new THREE.Vector3(-13.4, 2.4, -32.4), new THREE.Vector3(5.0, 4.8, 39.8), 0.26, [1, 2]);
      addLineBox(new THREE.Vector3(-11.9, 2.4, -52.3), new THREE.Vector3(8.0, 4.8, 3.4), 0.26);
      addLineBox(new THREE.Vector3(-7.6, 2.65, -25.0), new THREE.Vector3(6.6, 5.3, 8.2), 0.28);

      [
        { x: -6.59, z: -6.95, length: 2.82, rotation: 0 },
        { x: -5.74, z: -10.35, length: 1.12, rotation: 0 },
        { x: -8.0, z: -7.8, length: 1.7, rotation: Math.PI / 2 },
        { x: -8.85, z: -8.65, length: 1.7, rotation: 0 },
        { x: -6.3, z: -11.43, length: 2.15, rotation: Math.PI / 2 },
        { x: -9.7, z: -9.73, length: 2.15, rotation: Math.PI / 2 },
        { x: -7.15, z: -12.5, length: 1.7, rotation: 0 },
        { x: -8.0, z: -13.35, length: 1.7, rotation: Math.PI / 2 },
        { x: -12.8, z: -10.8, length: 6.2, rotation: 0 },
        { x: -9.45, z: -14.2, length: 2.9, rotation: 0 },
        { x: -15.9, z: -33.25, length: 41.5, rotation: Math.PI / 2 },
        { x: -10.9, z: -18.68, length: 8.95, rotation: Math.PI / 2 },
        { x: -10.9, z: -38.73, length: 23.75, rotation: Math.PI / 2 },
        { x: -9.4, z: -50.6, length: 3.0, rotation: 0 },
        { x: -11.9, z: -54.0, length: 8.0, rotation: 0 },
        { x: -7.6, z: -20.9, length: 6.6, rotation: 0, height: 5.2, y: 2.65 },
        { x: -7.6, z: -29.1, length: 6.6, rotation: 0, height: 5.2, y: 2.65 },
        { x: -4.3, z: -25.0, length: 8.2, rotation: Math.PI / 2, height: 5.2, y: 2.65 }
      ].forEach(function (wall) {
        addDarkWall(wall);
      });

      addPortal({
        x: -10.88,
        z: -25.0,
        rotation: -Math.PI / 2,
        title: "Development Laboratory",
        reverseTitle: "Discover"
      });
      addPortal({
        x: -7.92,
        z: -52.3,
        rotation: -Math.PI / 2,
        title: "Church of AI",
        reverseTitle: "Discover"
      });

      var laboratoryPlacard = new THREE.Mesh(
        new THREE.PlaneGeometry(2.9, 1.55),
        new THREE.MeshBasicMaterial({ map: makeHallwayStatementTexture(developmentStatement, 0), transparent: true, side: THREE.DoubleSide })
      );
      laboratoryPlacard.position.set(-9.3, 2.35, -29.03);
      laboratoryPlacard.rotation.y = 0;
      scene.add(laboratoryPlacard);

      addDevelopmentLaboratorySet();

      var path = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(-5.05, 0.035, -8.65),
          new THREE.Vector3(-8.0, 0.035, -8.65),
          new THREE.Vector3(-8.0, 0.035, -12.5),
          new THREE.Vector3(-13.4, 0.035, -12.5),
          new THREE.Vector3(-13.4, 0.035, -52.3),
          new THREE.Vector3(-7.95, 0.035, -52.3)
        ]),
        new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.3 })
      );
      scene.add(path);

      [
        { x: -13.4, z: -15.5, intensity: 0.42, distance: 12 },
        { x: -13.4, z: -34.5, intensity: 0.46, distance: 13 },
        { x: -13.4, z: -46.0, intensity: 0.42, distance: 12 },
        { x: -7.5, z: -25.0, intensity: 0.5, distance: 11 },
        { x: -11.0, z: -52.3, intensity: 0.38, distance: 10 }
      ].forEach(function (lightSpec) {
        var light = new THREE.PointLight(0xffe3a6, lightSpec.intensity, lightSpec.distance);
        light.position.set(lightSpec.x, 3.45, lightSpec.z);
        scene.add(light);
      });
    }

    function addSupportingHallway() {
      var controlConnectorX = pushingRoomOffset.x + 4.4;
      var workConnectorX = workRoomOffset.x + workRoomLayout.supportConnectorX;
      var workRoomNorth = workRoomOffset.z + workRoomLayout.north;
      var crossHallLeft = controlConnectorX - 1.5;
      var crossHallRight = workConnectorX + 1.5;
      var crossHallCenter = (crossHallLeft + crossHallRight) / 2;
      var crossHallLength = crossHallRight - crossHallLeft;
      var innerCrossHallLeft = controlConnectorX + 1.5;
      var innerCrossHallRight = workConnectorX - 1.5;
      var innerCrossHallCenter = (innerCrossHallLeft + innerCrossHallRight) / 2;
      var innerCrossHallLength = innerCrossHallRight - innerCrossHallLeft;
      var crossHallZ = 25.0;
      var crossHallNearZ = 22.5;
      var crossHallFarZ = 27.5;
      var controlLegStartZ = 9.4;
      var controlLegEndZ = 26.5;
      var workLegCenterZ = (workRoomNorth + crossHallZ) / 2;
      var workLegLength = crossHallZ - workRoomNorth;
      var workLegOuterCenterZ = (workRoomNorth + crossHallFarZ) / 2;
      var workLegOuterLength = crossHallFarZ - workRoomNorth;
      var workLegInnerCenterZ = (workRoomNorth + crossHallNearZ) / 2;
      var workLegInnerLength = crossHallNearZ - workRoomNorth;
      var controlLegCenterZ = (controlLegStartZ + controlLegEndZ) / 2;
      var controlLegLength = controlLegEndZ - controlLegStartZ;
      var controlLegOuterCenterZ = (controlLegStartZ + crossHallFarZ) / 2;
      var controlLegOuterLength = crossHallFarZ - controlLegStartZ;
      var controlLegInnerCenterZ = (controlLegStartZ + crossHallNearZ) / 2;
      var controlLegInnerLength = crossHallNearZ - controlLegStartZ;

      addLineBox(new THREE.Vector3(workConnectorX, 2.4, workLegCenterZ), new THREE.Vector3(3.0, 4.8, workLegLength), 0.25);
      addLineBox(new THREE.Vector3(crossHallCenter, 2.4, crossHallZ), new THREE.Vector3(crossHallLength, 4.8, 5.0), 0.25);
      addJoinedLineBox(
        new THREE.Vector3(controlConnectorX, 2.4, controlLegCenterZ),
        new THREE.Vector3(3.0, 4.8, controlLegLength),
        0.25,
        [2, 3]
      );
      addHorizontalPortal({
        x: workConnectorX,
        z: workRoomNorth - 0.02,
        rotation: Math.PI,
        frameWidth: 3.0,
        signWidth: 2.85,
        title: "Support Systems",
        reverseTitle: "Work With Joe"
      });
      addHorizontalPortal({
        x: controlConnectorX,
        z: controlLegStartZ,
        rotation: Math.PI,
        frameWidth: 3.0,
        signWidth: 2.85,
        title: "Support Systems",
        reverseTitle: "Control Room"
      });

      [
        { x: workConnectorX + 1.5, z: workLegOuterCenterZ, length: workLegOuterLength, rotation: Math.PI / 2 },
        { x: workConnectorX - 1.5, z: workLegInnerCenterZ, length: workLegInnerLength, rotation: Math.PI / 2 },
        { x: crossHallCenter, z: crossHallFarZ, length: crossHallLength, rotation: 0 },
        { x: innerCrossHallCenter, z: crossHallNearZ, length: innerCrossHallLength, rotation: 0 },
        { x: controlConnectorX - 1.5, z: controlLegOuterCenterZ, length: controlLegOuterLength, rotation: Math.PI / 2 },
        { x: controlConnectorX + 1.5, z: controlLegInnerCenterZ, length: controlLegInnerLength, rotation: Math.PI / 2 }
      ].forEach(function (wall) {
        addDarkWall(wall);
      });

      var path = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(workConnectorX, 0.035, workRoomNorth),
          new THREE.Vector3(workConnectorX, 0.035, crossHallZ),
          new THREE.Vector3(controlConnectorX, 0.035, crossHallZ),
          new THREE.Vector3(controlConnectorX, 0.035, 9.25)
        ]),
        new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.26 })
      );
      scene.add(path);

      [
        { x: workConnectorX, z: 12.2, intensity: 0.42, distance: 11 },
        { x: workConnectorX, z: 20.0, intensity: 0.4, distance: 11 },
        { x: 11.8, z: crossHallZ, intensity: 0.4, distance: 12 },
        { x: 3.7, z: crossHallZ, intensity: 0.4, distance: 12 },
        { x: -4.4, z: crossHallZ, intensity: 0.42, distance: 12 },
        { x: -12.5, z: crossHallZ, intensity: 0.42, distance: 12 },
        { x: controlConnectorX, z: 13.0, intensity: 0.38, distance: 10 },
        { x: controlConnectorX, z: 21.0, intensity: 0.38, distance: 10 }
      ].forEach(function (lightSpec) {
        var light = new THREE.PointLight(0xffe3a6, lightSpec.intensity, lightSpec.distance);
        light.position.set(lightSpec.x, 3.35, lightSpec.z);
        scene.add(light);
      });
    }

    function addWorkWithJoeRoom(parent) {
      var target = parent || scene;
      var roomWidth = workRoomLayout.east - workRoomLayout.west;
      var roomDepth = workRoomLayout.north - workRoomLayout.south;
      addLineBox(new THREE.Vector3(workRoomLayout.centerX, 2.65, workRoomLayout.centerZ), new THREE.Vector3(roomWidth, 5.3, roomDepth), 0.24, target);

      [
        { x: 9.43, z: workRoomLayout.south, length: 8.5, rotation: 0, height: 5.2, y: 2.65 },
        { x: 8.93, z: workRoomLayout.north, length: 7.5, rotation: 0, height: 5.2, y: 2.65 },
        { x: 16.18, z: workRoomLayout.north, length: 1.0, rotation: 0, height: 5.2, y: 2.65 },
        { x: workRoomLayout.east, z: -9.0, length: 4.0, rotation: Math.PI / 2, height: 5.2, y: 2.65 },
        { x: workRoomLayout.east, z: -1.0, length: 6.0, rotation: Math.PI / 2, height: 5.2, y: 2.65 },
        { x: workRoomLayout.west, z: -9.0, length: 4.0, rotation: Math.PI / 2, height: 5.2, y: 2.65 },
        { x: workRoomLayout.west, z: -1.0, length: 6.0, rotation: Math.PI / 2, height: 5.2, y: 2.65 }
      ].forEach(function (wall) {
        addDarkWall(wall, target);
      });

      addMethodsAndToolsWing(target);
    }

    function addMethodsGallery(parent) {
      var textureLoader = new THREE.TextureLoader();
      var backingMaterial = new THREE.MeshBasicMaterial({ color: 0x030302, transparent: true, opacity: 0.9, side: THREE.DoubleSide });
      var galleryImages = [
        { src: "/assets/thinking/capability-acceleration-wall.png", x: methodsRoomLayout.west + 0.03, z: methodsRoomLayout.centerZ, y: 3.25, rotation: Math.PI / 2, width: 5.4, height: 3.6, statement: workOfferStatements[0] },
        { src: "/assets/thinking/enablement-architecture-wall.png", x: methodsRoomLayout.east - 0.03, z: -24.25, y: 3.25, rotation: -Math.PI / 2, width: 5.2, height: 3.46, statement: workOfferStatements[1] },
        { src: "/assets/thinking/enhanced-facilitation-wall.png", x: methodsRoomLayout.east - 0.03, z: -18.5, y: 3.25, rotation: -Math.PI / 2, width: 5.2, height: 3.46, statement: workOfferStatements[2] }
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
        image.position.set(
          item.x + Math.sin(item.rotation) * 0.015,
          item.y,
          item.z + Math.cos(item.rotation) * 0.015
        );
        image.rotation.y = item.rotation;
        parent.add(image);

        var frame = new THREE.LineSegments(
          new THREE.EdgesGeometry(new THREE.BoxGeometry(item.width + 0.22, item.height + 0.22, 0.03)),
          new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.42 })
        );
        frame.position.set(item.x, item.y, item.z);
        frame.rotation.y = item.rotation;
        parent.add(frame);

        var placard = new THREE.Mesh(
          new THREE.PlaneGeometry(5.0, 1.2),
          new THREE.MeshBasicMaterial({
            map: makeOfferPlacardTexture(item.statement),
            transparent: true,
            side: THREE.DoubleSide
          })
        );
        placard.position.set(
          item.x + Math.sin(item.rotation) * 0.018,
          0.74,
          item.z + Math.cos(item.rotation) * 0.018
        );
        placard.rotation.y = item.rotation;
        parent.add(placard);
      });
    }

    function addMethodsAndToolsWing(parent) {
      var target = parent || scene;
      var hallWest = 13.68;
      var hallEast = workRoomLayout.east;
      var hallCenterX = (hallWest + hallEast) / 2;
      var roomWest = methodsRoomLayout.west;
      var roomEast = methodsRoomLayout.east;
      var roomNorth = methodsRoomLayout.north;
      var roomSouth = methodsRoomLayout.south;
      var roomCenterX = methodsRoomLayout.centerX;
      var roomCenterZ = methodsRoomLayout.centerZ;

      addJoinedLineBox(
        new THREE.Vector3(hallCenterX, 2.4, (workRoomLayout.south + roomNorth) / 2),
        new THREE.Vector3(hallEast - hallWest, 4.8, workRoomLayout.south - roomNorth),
        0.26,
        [0, 1],
        target
      );
      addJoinedLineBox(
        new THREE.Vector3(roomCenterX, 2.55, roomCenterZ),
        new THREE.Vector3(roomEast - roomWest, 5.1, roomNorth - roomSouth),
        0.28,
        [2],
        target
      );

      [
        { x: hallWest, z: (workRoomLayout.south + roomNorth) / 2, length: workRoomLayout.south - roomNorth, rotation: Math.PI / 2 },
        { x: roomEast, z: (workRoomLayout.south + roomSouth) / 2, length: workRoomLayout.south - roomSouth, rotation: Math.PI / 2 },
        { x: (roomWest + hallWest) / 2, z: roomNorth, length: hallWest - roomWest, rotation: 0, height: 5.0, y: 2.55 },
        { x: roomWest, z: roomCenterZ, length: roomNorth - roomSouth, rotation: Math.PI / 2, height: 5.0, y: 2.55 },
        { x: roomCenterX, z: roomSouth, length: roomEast - roomWest, rotation: 0, height: 5.0, y: 2.55 }
      ].forEach(function (wall) {
        addDarkWall(wall, target);
      });

      addHorizontalPortal({
        parent: target,
        x: hallCenterX,
        z: workRoomLayout.south,
        rotation: 0,
        frameWidth: hallEast - hallWest,
        signWidth: 3.55,
        title: "Methods and Tools",
        reverseTitle: "Work With Joe"
      });
      addLineBox(
        new THREE.Vector3(hallCenterX, 2.4, roomNorth),
        new THREE.Vector3(hallEast - hallWest, 4.8, 0.16),
        0.38,
        target
      );

      addMethodsToolShed(target, roomCenterX, roomCenterZ, roomNorth);
      addMethodsGallery(target);

      var path = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(hallCenterX, 0.035, workRoomLayout.south + 0.2),
          new THREE.Vector3(hallCenterX, 0.035, roomCenterZ)
        ]),
        new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.3 })
      );
      target.add(path);

      [
        { x: hallCenterX, z: -13.3, intensity: 0.4, distance: 9 },
        { x: roomCenterX, z: -18.5, intensity: 0.52, distance: 11 },
        { x: roomCenterX, z: -24.25, intensity: 0.5, distance: 11 }
      ].forEach(function (lightSpec) {
        var light = new THREE.PointLight(0xffe3a6, lightSpec.intensity, lightSpec.distance);
        light.position.set(lightSpec.x, 3.35, lightSpec.z);
        target.add(light);
      });
    }

    function addMethodsToolShed(target, centerX, centerZ, wallZ) {
      var woodMaterial = new THREE.MeshStandardMaterial({
        color: 0x4a2f18,
        roughness: 0.68,
        metalness: 0.12
      });
      var darkMetalMaterial = new THREE.MeshStandardMaterial({
        color: 0x0b0805,
        roughness: 0.32,
        metalness: 0.7
      });
      var brassMaterial = new THREE.MeshStandardMaterial({
        color: 0xd8bd8a,
        emissive: 0x2d1b09,
        emissiveIntensity: 0.24,
        roughness: 0.28,
        metalness: 0.72
      });
      var steelMaterial = new THREE.MeshStandardMaterial({
        color: 0xb7a88d,
        roughness: 0.24,
        metalness: 0.82,
        side: THREE.DoubleSide
      });
      var benchZ = centerZ + 0.15;
      var boardCenterX = centerX - 1.5;
      var boardCenterY = 3.08;
      var bench = new THREE.Group();

      var top = new THREE.Mesh(new THREE.BoxGeometry(3.0, 0.18, 1.25), woodMaterial);
      top.position.set(centerX, 0.96, benchZ);
      bench.add(top);

      [
        { x: centerX - 1.27, z: benchZ - 0.43 },
        { x: centerX + 1.27, z: benchZ - 0.43 },
        { x: centerX - 1.27, z: benchZ + 0.43 },
        { x: centerX + 1.27, z: benchZ + 0.43 }
      ].forEach(function (legPosition) {
        var leg = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.84, 0.16), darkMetalMaterial);
        leg.position.set(legPosition.x, 0.48, legPosition.z);
        bench.add(leg);
      });

      var lowerShelf = new THREE.Mesh(new THREE.BoxGeometry(2.66, 0.08, 0.92), darkMetalMaterial);
      lowerShelf.position.set(centerX, 0.34, benchZ);
      bench.add(lowerShelf);

      var benchFrame = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(3.08, 0.22, 1.33)),
        new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.44 })
      );
      benchFrame.position.set(centerX, 0.97, benchZ);
      bench.add(benchFrame);

      var viceBase = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.16, 0.38), brassMaterial);
      viceBase.position.set(centerX + 0.95, 1.13, benchZ - 0.26);
      bench.add(viceBase);
      [-0.16, 0.16].forEach(function (offset) {
        var jaw = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.28, 0.44), darkMetalMaterial);
        jaw.position.set(centerX + 0.95 + offset, 1.3, benchZ - 0.26);
        bench.add(jaw);
      });
      target.add(bench);

      var toolBoard = new THREE.Mesh(
        new THREE.BoxGeometry(4.45, 1.8, 0.06),
        new THREE.MeshStandardMaterial({ color: 0x100b06, roughness: 0.76, metalness: 0.18 })
      );
      toolBoard.position.set(boardCenterX, boardCenterY, wallZ - 0.04);
      target.add(toolBoard);

      var toolBoardFrame = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(4.55, 1.9, 0.09)),
        new THREE.LineBasicMaterial({ color: 0xd8bd8a, transparent: true, opacity: 0.42 })
      );
      toolBoardFrame.position.copy(toolBoard.position);
      target.add(toolBoardFrame);

      [-1.7, -1.15, -0.6, -0.05, 0.5, 1.05, 1.6].forEach(function (xOffset, index) {
        [-0.55, 0, 0.55].forEach(function (yOffset) {
          if ((index + Math.round((yOffset + 0.55) * 10)) % 2) return;
          var peg = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.08, 8), brassMaterial);
          peg.position.set(boardCenterX + xOffset, boardCenterY + yOffset, wallZ - 0.1);
          peg.rotation.x = Math.PI / 2;
          target.add(peg);
        });
      });

      var sawShape = new THREE.Shape();
      sawShape.moveTo(-1.02, -0.13);
      sawShape.lineTo(0.72, -0.13);
      sawShape.lineTo(0.98, 0.16);
      sawShape.lineTo(-1.02, 0.16);
      sawShape.closePath();
      var sawBlade = new THREE.Mesh(new THREE.ShapeGeometry(sawShape), steelMaterial);
      sawBlade.position.set(boardCenterX - 0.4, boardCenterY - 0.06, wallZ - 0.11);
      target.add(sawBlade);

      for (var toothIndex = 0; toothIndex < 8; toothIndex += 1) {
        var tooth = new THREE.Mesh(new THREE.ConeGeometry(0.055, 0.12, 3), steelMaterial);
        tooth.position.set(boardCenterX - 1.25 + toothIndex * 0.22, boardCenterY - 0.25, wallZ - 0.11);
        tooth.rotation.z = Math.PI;
        target.add(tooth);
      }

      var sawHandle = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.54, 0.16), woodMaterial);
      sawHandle.position.set(boardCenterX - 1.61, boardCenterY + 0.04, wallZ - 0.12);
      sawHandle.rotation.z = -0.24;
      target.add(sawHandle);

      var hammer = new THREE.Group();
      var hammerHandle = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.075, 1.02, 10), woodMaterial);
      hammer.add(hammerHandle);
      var hammerHead = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.22, 0.22), steelMaterial);
      hammerHead.position.y = 0.53;
      hammer.add(hammerHead);
      hammer.position.set(boardCenterX + 1.35, boardCenterY - 0.1, wallZ - 0.12);
      hammer.rotation.z = -0.2;
      target.add(hammer);

      var toolLight = new THREE.PointLight(0xffe3a6, 0.2, 5.5);
      toolLight.position.set(boardCenterX, boardCenterY + 0.07, wallZ - 1.1);
      target.add(toolLight);

      roomFixtures.push({
        x: centerX + workRoomOffset.x,
        z: benchZ + workRoomOffset.z,
        radius: 1.42
      });
    }

    function addDevelopmentLaboratorySet() {
      var centerX = laboratoryCenter.x;
      var centerZ = laboratoryCenter.z;
      var darkMaterial = new THREE.MeshStandardMaterial({
        color: 0x0b0805,
        roughness: 0.34,
        metalness: 0.66
      });
      var tableMaterial = new THREE.MeshStandardMaterial({
        color: 0x3e2817,
        roughness: 0.62,
        metalness: 0.16
      });
      var glassMaterial = new THREE.MeshStandardMaterial({
        color: 0xffedc7,
        transparent: true,
        opacity: 0.28,
        roughness: 0.08,
        metalness: 0.08,
        side: THREE.DoubleSide,
        depthWrite: false
      });
      var liquidMaterial = new THREE.MeshStandardMaterial({
        color: 0xffc66d,
        emissive: 0x7b3d09,
        emissiveIntensity: 0.58,
        transparent: true,
        opacity: 0.82,
        roughness: 0.24,
        metalness: 0.12
      });
      var tubeMaterial = new THREE.MeshStandardMaterial({
        color: 0xffe3a6,
        emissive: 0x4a2809,
        emissiveIntensity: 0.34,
        transparent: true,
        opacity: 0.54,
        roughness: 0.14,
        metalness: 0.1
      });

      var tableTop = new THREE.Mesh(new THREE.BoxGeometry(1.8, 0.16, 2.5), tableMaterial);
      tableTop.position.set(centerX, 0.94, centerZ);
      scene.add(tableTop);

      [
        { x: centerX - 0.68, z: centerZ - 1.05 },
        { x: centerX + 0.68, z: centerZ - 1.05 },
        { x: centerX - 0.68, z: centerZ + 1.05 },
        { x: centerX + 0.68, z: centerZ + 1.05 }
      ].forEach(function (legPosition) {
        var leg = new THREE.Mesh(new THREE.BoxGeometry(0.13, 0.82, 0.13), darkMaterial);
        leg.position.set(legPosition.x, 0.46, legPosition.z);
        scene.add(leg);
      });

      var tableFrame = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(1.88, 0.2, 2.58)),
        new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.42 })
      );
      tableFrame.position.set(centerX, 0.95, centerZ);
      scene.add(tableFrame);

      var flaskX = centerX - 0.35;
      var flaskZ = centerZ - 0.48;
      var flaskBody = new THREE.Mesh(
        new THREE.CylinderGeometry(0.15, 0.34, 0.56, 18, 1, true),
        glassMaterial
      );
      flaskBody.position.set(flaskX, 1.34, flaskZ);
      scene.add(flaskBody);
      var flaskNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.34, 16, 1, true), glassMaterial);
      flaskNeck.position.set(flaskX, 1.78, flaskZ);
      scene.add(flaskNeck);
      var flaskLiquid = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.28, 0.2, 18), liquidMaterial);
      flaskLiquid.position.set(flaskX, 1.17, flaskZ);
      scene.add(flaskLiquid);

      var beakerX = centerX + 0.36;
      var beakerZ = centerZ + 0.2;
      var beaker = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.27, 0.54, 18, 1, true), glassMaterial);
      beaker.position.set(beakerX, 1.31, beakerZ);
      scene.add(beaker);
      var beakerRim = new THREE.Mesh(new THREE.TorusGeometry(0.27, 0.018, 8, 28), glassMaterial);
      beakerRim.position.set(beakerX, 1.58, beakerZ);
      beakerRim.rotation.x = Math.PI / 2;
      scene.add(beakerRim);
      var beakerLiquid = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.25, 0.22, 18), liquidMaterial);
      beakerLiquid.position.set(beakerX, 1.17, beakerZ);
      scene.add(beakerLiquid);

      var standRod = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.025, 1.35, 10), darkMaterial);
      standRod.position.set(centerX + 0.62, 1.6, centerZ - 0.76);
      scene.add(standRod);
      var standArm = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.78, 10), darkMaterial);
      standArm.position.set(centerX + 0.25, 2.12, centerZ - 0.76);
      standArm.rotation.z = Math.PI / 2;
      scene.add(standArm);

      var tubeCurve = new THREE.CatmullRomCurve3([
        new THREE.Vector3(flaskX, 1.94, flaskZ),
        new THREE.Vector3(centerX - 0.18, 2.18, centerZ - 0.56),
        new THREE.Vector3(centerX + 0.42, 2.12, centerZ - 0.46),
        new THREE.Vector3(beakerX, 1.75, beakerZ)
      ]);
      var connectingTube = new THREE.Mesh(new THREE.TubeGeometry(tubeCurve, 24, 0.035, 8, false), tubeMaterial);
      scene.add(connectingTube);

      var rackBase = new THREE.Mesh(new THREE.BoxGeometry(1.05, 0.09, 0.34), darkMaterial);
      rackBase.position.set(centerX - 0.12, 1.06, centerZ + 0.86);
      scene.add(rackBase);
      [-0.34, 0, 0.34].forEach(function (tubeOffset, tubeIndex) {
        var testTube = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.07, 0.62, 12, 1, true), glassMaterial);
        testTube.position.set(centerX - 0.12 + tubeOffset, 1.4, centerZ + 0.86);
        scene.add(testTube);
        var testLiquid = new THREE.Mesh(new THREE.CylinderGeometry(0.066, 0.058, 0.18 + tubeIndex * 0.035, 12), liquidMaterial);
        testLiquid.position.set(centerX - 0.12 + tubeOffset, 1.14 + tubeIndex * 0.017, centerZ + 0.86);
        scene.add(testLiquid);
      });

      var bubbleGeometry = new THREE.SphereGeometry(0.047, 8, 6);
      var bubbleMaterial = liquidMaterial.clone();
      bubbleMaterial.opacity = 0.54;
      for (var bubbleIndex = 0; bubbleIndex < 6; bubbleIndex += 1) {
        var bubble = new THREE.Mesh(
          bubbleGeometry,
          bubbleMaterial
        );
        bubble.userData.baseX = beakerX + ((bubbleIndex % 3) - 1) * 0.08;
        bubble.userData.baseZ = beakerZ + ((bubbleIndex % 2) ? 0.045 : -0.045);
        bubble.userData.baseY = 1.22;
        bubble.userData.travel = 0.92 + (bubbleIndex % 3) * 0.12;
        bubble.userData.speed = 0.32 + (bubbleIndex % 4) * 0.055;
        bubble.userData.phase = bubbleIndex / 6;
        bubble.userData.radiusScale = 0.76 + (bubbleIndex % 3) * 0.25;
        bubble.position.set(bubble.userData.baseX, bubble.userData.baseY, bubble.userData.baseZ);
        scene.add(bubble);
        laboratoryBubbles.push(bubble);
      }

      laboratoryGlowLight = new THREE.PointLight(0xffc66d, 0.26, 5.8);
      laboratoryGlowLight.position.set(centerX, 1.8, centerZ);
      scene.add(laboratoryGlowLight);

      roomFixtures.push({ x: centerX, z: centerZ, radius: 1.24 });
    }

    function addWhoIsJoeExperience() {
      var sourceDoorCenter = whoIsJoeSourceDoorCenter;
      var destinationDoorCenter = elevator.destinationCenter;
      var workRoomEast = workRoomOffset.x + workRoomLayout.east;
      var identityHallStart = workRoomEast + 2.35;
      var identityHallEnd = 40.2;
      var identityHallCenter = (identityHallStart + identityHallEnd) / 2;
      var identityHallLength = identityHallEnd - identityHallStart;
      var identityGalleryWest = 24.0;
      var identityGalleryEast = 38.5;
      var identityGalleryBack = -9.0;
      var identityGalleryFront = -1.4;
      var identityGalleryCenterX = (identityGalleryWest + identityGalleryEast) / 2;
      var identityGalleryCenterZ = (identityGalleryBack + identityGalleryFront) / 2;

      addLineBox(new THREE.Vector3(-4.12, 2.4, sourceDoorCenter.z), new THREE.Vector3(3.6, 4.8, 3.2), 0.38);
      addDarkWall({ x: -5.92, z: sourceDoorCenter.z, length: 3.2, rotation: Math.PI / 2 });
      addDarkWall({ x: -4.12, z: sourceDoorCenter.z - 1.6, length: 3.6, rotation: 0 });
      addDarkWall({ x: -4.12, z: sourceDoorCenter.z + 1.6, length: 3.6, rotation: 0 });
      addLineBox(new THREE.Vector3(sourceDoorCenter.x, 2.4, sourceDoorCenter.z), new THREE.Vector3(0.16, 4.8, 3.2), 0.58);

      var placard = new THREE.Mesh(
        new THREE.PlaneGeometry(1.48, 0.88),
        new THREE.MeshBasicMaterial({ map: makeElevatorPlacardTexture(), transparent: true, side: THREE.DoubleSide })
      );
      placard.position.set(-2.31, 2.25, sourceDoorCenter.z + 2.45);
      placard.rotation.y = Math.PI / 2;
      placard.userData.action = "open-who-is-joe-elevator";
      scene.add(placard);
      interactive.push(placard);

      addHallwayTransitionWall(workRoomEast, 0.55, identityHallStart, -1.4);
      addHallwayTransitionWall(workRoomEast, 1.45, identityHallStart, 3.4);
      addPortal({
        x: workRoomEast,
        z: 1.0,
        rotation: -Math.PI / 2,
        title: "Who Is Joe",
        reverseTitle: "Work With Joe"
      });
      addLineBox(new THREE.Vector3(identityHallCenter, 2.4, 1.0), new THREE.Vector3(identityHallLength, 4.8, 4.8), 0.25);
      addDarkWall({ x: identityHallCenter, z: 3.4, length: identityHallLength, rotation: Math.PI });
      addDarkWall({ x: (identityHallStart + 28.8) / 2, z: -1.4, length: 28.8 - identityHallStart, rotation: 0 });
      addDarkWall({ x: (33.2 + identityHallEnd) / 2, z: -1.4, length: identityHallEnd - 33.2, rotation: 0 });
      addDarkWall({ x: destinationDoorCenter.x, z: -0.975, length: 0.85, rotation: Math.PI / 2 });
      addDarkWall({ x: destinationDoorCenter.x, z: 2.975, length: 0.85, rotation: Math.PI / 2 });
      addLineBox(new THREE.Vector3(destinationDoorCenter.x, 2.4, destinationDoorCenter.z), new THREE.Vector3(0.16, 4.8, 3.2), 0.58);

      addLineBox(
        new THREE.Vector3(identityGalleryCenterX, 2.55, identityGalleryCenterZ),
        new THREE.Vector3(identityGalleryEast - identityGalleryWest, 5.1, identityGalleryFront - identityGalleryBack),
        0.28
      );
      addDarkWall({
        x: identityGalleryCenterX,
        z: identityGalleryBack,
        length: identityGalleryEast - identityGalleryWest,
        rotation: 0,
        height: 5.0,
        y: 2.55
      });
      addDarkWall({
        x: identityGalleryWest,
        z: identityGalleryCenterZ,
        length: identityGalleryFront - identityGalleryBack,
        rotation: Math.PI / 2,
        height: 5.0,
        y: 2.55
      });
      addDarkWall({
        x: identityGalleryEast,
        z: identityGalleryCenterZ,
        length: identityGalleryFront - identityGalleryBack,
        rotation: Math.PI / 2,
        height: 5.0,
        y: 2.55
      });
      addHorizontalPortal({
        x: 31.0,
        z: -1.38,
        rotation: 0,
        title: "Who Is Joe",
        reverseTitle: "Elevator Hallway"
      });

      addLineBox(new THREE.Vector3(42.35, 2.4, destinationDoorCenter.z), new THREE.Vector3(4.2, 4.8, 3.2), 0.38);
      addDarkWall({ x: 44.45, z: destinationDoorCenter.z, length: 3.2, rotation: Math.PI / 2 });
      addDarkWall({ x: 42.35, z: -0.6, length: 4.2, rotation: 0 });
      addDarkWall({ x: 42.35, z: 2.6, length: 4.2, rotation: 0 });

      var path = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(workRoomEast - 0.15, 0.035, 1.0),
          new THREE.Vector3(40.1, 0.035, 1.0)
        ]),
        new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.24 })
      );
      scene.add(path);

      [23.7, 27.0, 30.4, 33.7, 37.0].forEach(function (x, index) {
        var light = new THREE.PointLight(0xffe3a6, index % 2 ? 0.36 : 0.44, 11);
        light.position.set(x, 3.35, 1.0);
        scene.add(light);
      });

      [
        { x: 27.0, z: -5.2 },
        { x: 31.25, z: -7.4 },
        { x: 35.5, z: -5.2 }
      ].forEach(function (position) {
        var galleryLight = new THREE.PointLight(0xffe3a6, 0.44, 10);
        galleryLight.position.set(position.x, 3.4, position.z);
        scene.add(galleryLight);
      });

      var sourceLight = new THREE.PointLight(0xffe3a6, 0.5, 7);
      sourceLight.position.set(-4.25, 3.25, sourceDoorCenter.z);
      scene.add(sourceLight);

      var destinationLight = sourceLight.clone();
      destinationLight.position.set(42.35, 3.25, destinationDoorCenter.z);
      scene.add(destinationLight);

      elevator.sourceDoors = addElevatorDoors(sourceDoorCenter.x, sourceDoorCenter.z, true);
      elevator.destinationDoors = addElevatorDoors(destinationDoorCenter.x, destinationDoorCenter.z, false);
      addElevatorIndicator(-5.86, 3.3, sourceDoorCenter.z, Math.PI / 2);
      addElevatorIndicator(40.16, 3.58, destinationDoorCenter.z, Math.PI / 2);
      setElevatorIndicator("G", "GROUND FLOOR");
    }

    function addContactWallButton() {
      addPhysicalContactButton({
        parent: scene,
        wallX: 5.18,
        buttonZ: -6.8,
        facing: -1,
        label: "DON'T PRESS THIS BUTTON"
      });
      addPhysicalContactButton({
        parent: workRoom,
        wallX: workRoomLayout.west,
        buttonZ: -9.2,
        facing: 1,
        label: "PLAN A CALL"
      });
    }

    function addPhysicalContactButton(options) {
      var target = options.parent || scene;
      var wallX = options.wallX;
      var buttonZ = options.buttonZ;
      var facing = options.facing || -1;
      var darkMetal = new THREE.MeshStandardMaterial({
        color: 0x0b0805,
        metalness: 0.72,
        roughness: 0.3
      });
      var brass = new THREE.MeshStandardMaterial({
        color: 0xd8bd8a,
        emissive: 0x2f210f,
        emissiveIntensity: 0.34,
        metalness: 0.78,
        roughness: 0.24
      });
      var buttonGold = new THREE.MeshStandardMaterial({
        color: 0xffe3a6,
        emissive: 0x6d4518,
        emissiveIntensity: 0.58,
        metalness: 0.58,
        roughness: 0.2
      });

      var labelBacking = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 1.02, 3.18),
        darkMetal
      );
      labelBacking.position.set(wallX - facing * 0.1, 3.48, buttonZ);
      target.add(labelBacking);

      var labelFrame = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(0.2, 1.08, 3.24)),
        new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.64 })
      );
      labelFrame.position.copy(labelBacking.position);
      target.add(labelFrame);

      var label = new THREE.Mesh(
        new THREE.PlaneGeometry(3.0, 0.84),
        new THREE.MeshBasicMaterial({
          map: makeContactButtonLabelTexture(options.label),
          transparent: true,
          side: THREE.DoubleSide
        })
      );
      label.position.set(wallX + facing * 0.005, 3.48, buttonZ);
      label.rotation.y = facing < 0 ? -Math.PI / 2 : Math.PI / 2;
      target.add(label);

      var mountingPlate = new THREE.Mesh(
        new THREE.BoxGeometry(0.18, 1.94, 1.94),
        darkMetal
      );
      mountingPlate.position.set(wallX - facing * 0.1, 1.8, buttonZ);
      target.add(mountingPlate);

      var mountingFrame = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(0.21, 2.02, 2.02)),
        new THREE.LineBasicMaterial({ color: 0xd8bd8a, transparent: true, opacity: 0.56 })
      );
      mountingFrame.position.copy(mountingPlate.position);
      target.add(mountingFrame);

      var buttonBase = new THREE.Mesh(
        new THREE.CylinderGeometry(0.82, 0.82, 0.28, 64),
        brass
      );
      buttonBase.position.set(wallX + facing * 0.07, 1.8, buttonZ);
      buttonBase.rotation.z = Math.PI / 2;
      target.add(buttonBase);

      var buttonFace = new THREE.Mesh(
        new THREE.CylinderGeometry(0.58, 0.67, 0.38, 64),
        buttonGold
      );
      buttonFace.position.set(wallX + facing * 0.37, 1.8, buttonZ);
      buttonFace.rotation.z = Math.PI / 2;
      buttonFace.userData.action = "show-contact-joe";
      target.add(buttonFace);
      interactive.push(buttonFace);

      var buttonRing = new THREE.Mesh(
        new THREE.TorusGeometry(0.7, 0.055, 12, 72),
        brass
      );
      buttonRing.position.set(wallX + facing * 0.575, 1.8, buttonZ);
      buttonRing.rotation.y = facing < 0 ? -Math.PI / 2 : Math.PI / 2;
      target.add(buttonRing);

      var floorMarker = new THREE.LineSegments(
        new THREE.EdgesGeometry(new THREE.BoxGeometry(1.55, 0.02, 1.08)),
        new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.34 })
      );
      floorMarker.position.set(wallX + facing * 0.97, 0.035, buttonZ);
      target.add(floorMarker);

      var buttonLight = new THREE.PointLight(0xffe3a6, 0.38, 5.5);
      buttonLight.position.set(wallX + facing * 1.15, 2.25, buttonZ);
      target.add(buttonLight);

      var contactAnchor = new THREE.Object3D();
      contactAnchor.position.set(wallX + facing * 0.55, 1.8, buttonZ);
      target.add(contactAnchor);
      contactButtonAnchors.push(contactAnchor);
    }

    function addElevatorDoors(x, z, actionable) {
      var panelWidth = 1.56;
      var panelOffset = panelWidth / 2;

      function makePanel(offset) {
        var panel = new THREE.Group();
        panel.position.set(x, 2.38, z + offset);

        var face = new THREE.Mesh(
          new THREE.PlaneGeometry(panelWidth, 4.14),
          new THREE.MeshBasicMaterial({ color: 0x080604, side: THREE.DoubleSide })
        );
        face.rotation.y = Math.PI / 2;
        if (actionable) {
          face.userData.action = "open-who-is-joe-elevator";
          interactive.push(face);
        }
        panel.add(face);

        var edge = new THREE.LineSegments(
          new THREE.EdgesGeometry(new THREE.BoxGeometry(0.045, 4.14, panelWidth)),
          new THREE.LineBasicMaterial({ color: 0xffe3a6, transparent: true, opacity: 0.48 })
        );
        panel.add(edge);
        scene.add(panel);
        return panel;
      }

      return {
        left: makePanel(-panelOffset),
        right: makePanel(panelOffset),
        centerZ: z,
        panelOffset: panelOffset,
        travel: 1.5
      };
    }

    function addElevatorIndicator(x, y, z, rotation) {
      var material = new THREE.MeshBasicMaterial({
        map: makeElevatorIndicatorTexture("G", "GROUND FLOOR"),
        transparent: true,
        side: THREE.DoubleSide
      });
      var indicator = new THREE.Mesh(new THREE.PlaneGeometry(1.45, 0.72), material);
      indicator.position.set(x, y, z);
      indicator.rotation.y = rotation;
      scene.add(indicator);
      elevator.indicatorMaterials.push(material);
    }

    function addControlRoomGallery(parent) {
      var textureLoader = new THREE.TextureLoader();
      var backingMaterial = new THREE.MeshBasicMaterial({ color: 0x030302, transparent: true, opacity: 0.94, side: THREE.DoubleSide });
      var galleryImages = [
        { src: "/assets/thinking/capacityos-control-layer.png", x: -8.47, z: 0.4, y: 2.85, rotation: Math.PI / 2, width: 5.6, height: 3.73 },
        { src: "/assets/thinking/capacityos-recursive-system.png", x: -8.47, z: 6.8, y: 2.85, rotation: Math.PI / 2, width: 5.6, height: 3.73 },
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
      var target = options.parent || scene;
      addLineBox(
        new THREE.Vector3(options.x, 2.4, options.z),
        new THREE.Vector3(0.16, 4.8, 4.5),
        0.42,
        target
      );
      var hasReverse = Boolean(options.reverseTitle || options.readableBothSides);
      var normalX = Math.sin(options.rotation);
      var normalZ = Math.cos(options.rotation);
      var signMaterial = new THREE.MeshBasicMaterial({
        map: makePortalTexture({ title: options.title }),
        transparent: true,
        side: hasReverse ? THREE.FrontSide : THREE.DoubleSide
      });
      var sign = new THREE.Mesh(
        new THREE.PlaneGeometry(3.75, 1.08),
        signMaterial
      );
      sign.position.set(options.x + normalX * 0.09, 3.58, options.z + normalZ * 0.09);
      sign.rotation.y = options.rotation;
      target.add(sign);

      if (hasReverse) {
        var reverseSign = new THREE.Mesh(
          sign.geometry,
          new THREE.MeshBasicMaterial({
            map: makePortalTexture({ title: options.reverseTitle || options.title }),
            transparent: true,
            side: THREE.FrontSide
          })
        );
        reverseSign.position.set(options.x - normalX * 0.09, 3.58, options.z - normalZ * 0.09);
        reverseSign.rotation.y = sign.rotation.y + Math.PI;
        target.add(reverseSign);
      }
    }

    function addHorizontalPortal(options) {
      var target = options.parent || scene;
      addLineBox(
        new THREE.Vector3(options.x, 2.4, options.z),
        new THREE.Vector3(options.frameWidth || 4.5, 4.8, 0.16),
        0.42,
        target
      );
      var hasReverse = Boolean(options.reverseTitle);
      var normalX = Math.sin(options.rotation);
      var normalZ = Math.cos(options.rotation);
      var sign = new THREE.Mesh(
        new THREE.PlaneGeometry(options.signWidth || 3.75, 1.08),
        new THREE.MeshBasicMaterial({
          map: makePortalTexture({ title: options.title }),
          transparent: true,
          side: hasReverse ? THREE.FrontSide : THREE.DoubleSide
        })
      );
      sign.position.set(options.x + normalX * 0.09, 3.58, options.z + normalZ * 0.09);
      sign.rotation.y = options.rotation;
      target.add(sign);

      if (hasReverse) {
        var reverseSign = new THREE.Mesh(
          sign.geometry,
          new THREE.MeshBasicMaterial({
            map: makePortalTexture({ title: options.reverseTitle }),
            transparent: true,
            side: THREE.FrontSide
          })
        );
        reverseSign.position.set(options.x - normalX * 0.09, 3.58, options.z - normalZ * 0.09);
        reverseSign.rotation.y = options.rotation + Math.PI;
        target.add(reverseSign);
      }
    }

    function addPushingRoomWalls(parent) {
      [
        { x: -8.5, z: -0.6, length: 22.0, rotation: Math.PI / 2, height: 5.72, y: 2.9 },
        { x: 8.5, z: -5.2, length: 12.8, rotation: Math.PI / 2, height: 5.72, y: 2.9 },
        { x: 8.5, z: 7.5, length: 5.8, rotation: Math.PI / 2, height: 5.72, y: 2.9 },
        { x: 0, z: -11.6, length: 17.0, rotation: 0, height: 5.72, y: 2.9 },
        { x: -2.8, z: 10.4, length: 11.4, rotation: 0, height: 5.72, y: 2.9 },
        { x: 7.2, z: 10.4, length: 2.6, rotation: 0, height: 5.72, y: 2.9 }
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
      addHallwayWall(-2.36, -14.05, 6.5, Math.PI / 2);
      addHallwayWall(-2.36, -23.75, 6.5, Math.PI / 2);
      addHallwayWall(2.36, -19.15, 15.7, -Math.PI / 2);
      addHallwayTransitionWall(-2.36, -27.0, -1.55, -29.2);
      addHallwayTransitionWall(2.36, -27.0, 1.55, -29.2);
      addHallwayWall(-1.55, -30.675, 2.95, Math.PI / 2);
      addHallwayWall(1.55, -30.675, 2.95, -Math.PI / 2);

      var churchSignGeometry = new THREE.PlaneGeometry(6.6, 1.22);
      var sign = new THREE.Mesh(
        churchSignGeometry,
        new THREE.MeshBasicMaterial({ map: makeChurchSignTexture(), transparent: true, side: THREE.FrontSide })
      );
      sign.position.set(0, 5.82, -30.84);
      scene.add(sign);

      var churchReturnSign = new THREE.Mesh(
        churchSignGeometry,
        new THREE.MeshBasicMaterial({ map: makeChurchReturnSignTexture(), transparent: true, side: THREE.FrontSide })
      );
      churchReturnSign.position.set(0, 5.82, -30.96);
      churchReturnSign.rotation.y = Math.PI;
      scene.add(churchReturnSign);

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

    function addGraveyardWing() {
      var doorwayX = 9.55;
      var doorwayZ = -52.35;
      var turnX = 14.2;
      var hallSouthZ = -50.55;
      var hallNorthZ = -54.15;
      var longHallWestX = 12.4;
      var longHallEastX = 16.0;
      var longHallEndZ = -76.5;

      addJoinedLineBox(
        new THREE.Vector3((doorwayX + turnX) / 2, 2.4, doorwayZ),
        new THREE.Vector3(turnX - doorwayX, 4.8, hallSouthZ - hallNorthZ),
        0.26,
        [1, 2]
      );
      addJoinedLineBox(
        new THREE.Vector3(turnX, 2.4, (hallSouthZ + longHallEndZ) / 2),
        new THREE.Vector3(longHallEastX - longHallWestX, 4.8, hallSouthZ - longHallEndZ),
        0.26,
        [2, 3]
      );

      [
        {
          x: (doorwayX + longHallWestX) / 2,
          z: hallNorthZ,
          length: longHallWestX - doorwayX,
          rotation: 0
        },
        {
          x: (doorwayX + longHallEastX) / 2,
          z: hallSouthZ,
          length: longHallEastX - doorwayX,
          rotation: 0
        },
        {
          x: longHallWestX,
          z: (hallNorthZ + longHallEndZ) / 2,
          length: hallNorthZ - longHallEndZ,
          rotation: Math.PI / 2
        },
        {
          x: longHallEastX,
          z: (hallSouthZ + longHallEndZ) / 2,
          length: hallSouthZ - longHallEndZ,
          rotation: Math.PI / 2
        }
      ].forEach(function (wall) {
        addDarkWall(wall);
      });

      addPortal({
        x: doorwayX,
        z: doorwayZ,
        rotation: -Math.PI / 2,
        title: "Graveyard",
        reverseTitle: "Church of AI"
      });

      var path = new THREE.Line(
        new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(8.2, 0.035, doorwayZ),
          new THREE.Vector3(turnX, 0.035, doorwayZ),
          new THREE.Vector3(turnX, 0.035, longHallEndZ - 4.8)
        ]),
        new THREE.LineBasicMaterial({ color: 0xd8bd8a, transparent: true, opacity: 0.2 })
      );
      scene.add(path);

      var graveyardGround = new THREE.Mesh(
        new THREE.PlaneGeometry(21.6, 21.8),
        new THREE.MeshStandardMaterial({
          color: 0x050403,
          roughness: 1,
          metalness: 0,
          side: THREE.DoubleSide
        })
      );
      graveyardGround.position.set(14.2, 0.005, -86.6);
      graveyardGround.rotation.x = -Math.PI / 2;
      scene.add(graveyardGround);

      var graveyardGrid = new THREE.GridHelper(21.6, 12, 0x6c5a3b, 0x3c3325);
      graveyardGrid.material.transparent = true;
      graveyardGrid.material.opacity = 0.12;
      graveyardGrid.position.set(14.2, 0.018, -86.6);
      scene.add(graveyardGrid);

      [
        { x: 9.25, z: -81.4, scale: 0.94 },
        { x: 18.3, z: -80.2, scale: 1.02 },
        { x: 11.65, z: -88.35, scale: 0.9 },
        { x: 20.15, z: -90.15, scale: 1.08 }
      ].forEach(function (plot, index) {
        addGraveyardTombstone(plot, index);
      });

      addGraveyardScenery();

      var thresholdLight = new THREE.PointLight(0xffe3a6, 0.34, 10);
      thresholdLight.position.set(turnX, 3.2, -58.0);
      scene.add(thresholdLight);

      var fieldLight = new THREE.PointLight(0xd8bd8a, 0.3, 18);
      fieldLight.position.set(14.2, 3.6, -85.8);
      scene.add(fieldLight);
    }

    function addGraveyardTombstone(plot, index) {
      var tombstone = new THREE.Group();
      tombstone.position.set(plot.x, 0.04, plot.z);
      tombstone.scale.setScalar(plot.scale);

      var shape = new THREE.Shape();
      shape.moveTo(-0.78, 0);
      shape.lineTo(-0.78, 1.42);
      shape.quadraticCurveTo(-0.78, 2.18, 0, 2.28);
      shape.quadraticCurveTo(0.78, 2.18, 0.78, 1.42);
      shape.lineTo(0.78, 0);
      shape.closePath();

      var stoneGeometry = new THREE.ExtrudeGeometry(shape, {
        depth: 0.16,
        steps: 1,
        bevelEnabled: true,
        bevelThickness: 0.035,
        bevelSize: 0.045,
        bevelSegments: 1
      });
      stoneGeometry.translate(0, 0.28, -0.08);

      var slab = new THREE.Mesh(
        stoneGeometry,
        new THREE.MeshStandardMaterial({
          color: 0x15120d,
          roughness: 0.9,
          metalness: 0.05
        })
      );
      tombstone.add(slab);

      var stoneEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(stoneGeometry, 18),
        new THREE.LineBasicMaterial({ color: 0xd8bd8a, transparent: true, opacity: 0.48 })
      );
      tombstone.add(stoneEdges);

      var base = new THREE.Mesh(
        new THREE.BoxGeometry(2.05, 0.22, 0.72),
        new THREE.MeshStandardMaterial({ color: 0x0c0a07, roughness: 0.95 })
      );
      base.position.y = 0.13;
      tombstone.add(base);

      var label = new THREE.Mesh(
        new THREE.PlaneGeometry(1.28, 0.78),
        new THREE.MeshBasicMaterial({
          map: makeGraveyardMarkerTexture(index),
          transparent: true,
          side: THREE.FrontSide
        })
      );
      label.position.set(0, 1.32, 0.115);
      tombstone.add(label);

      scene.add(tombstone);
      graveyardTombstones.push(tombstone);
      roomFixtures.push({ x: plot.x, z: plot.z, radius: 1.02 * plot.scale });
    }

    function addGraveyardScenery() {
      var fenceMaterial = new THREE.MeshBasicMaterial({ color: 0x17120c });
      var fenceLineMaterial = new THREE.LineBasicMaterial({
        color: 0xd8bd8a,
        transparent: true,
        opacity: 0.44
      });

      addGraveyardFenceRun(4.0, -76.2, 11.7, -76.2, 2.5, fenceMaterial, fenceLineMaterial);
      addGraveyardFenceRun(16.7, -76.2, 24.4, -76.2, 2.5, fenceMaterial, fenceLineMaterial);
      addGraveyardFenceRun(4.0, -97.0, 24.4, -97.0, 2.6, fenceMaterial, fenceLineMaterial);
      addGraveyardFenceRun(4.0, -76.2, 4.0, -97.0, 2.6, fenceMaterial, fenceLineMaterial);
      addGraveyardFenceRun(24.4, -76.2, 24.4, -97.0, 2.6, fenceMaterial, fenceLineMaterial);

      addGraveyardMausoleum();
      addFlatGraveMarkers();
      addGraveyardGrass();
    }

    function addGraveyardFenceRun(x1, z1, x2, z2, postSpacing, railMaterial, lineMaterial) {
      var dx = x2 - x1;
      var dz = z2 - z1;
      var length = Math.sqrt(dx * dx + dz * dz);
      var rotation = -Math.atan2(dz, dx);
      var centerX = (x1 + x2) / 2;
      var centerZ = (z1 + z2) / 2;

      [0.38, 0.72].forEach(function (y) {
        var rail = new THREE.Mesh(
          new THREE.BoxGeometry(length, 0.055, 0.055),
          railMaterial
        );
        rail.position.set(centerX, y, centerZ);
        rail.rotation.y = rotation;
        scene.add(rail);
      });

      var postCount = Math.max(1, Math.ceil(length / postSpacing));
      var postPoints = [];
      for (var postIndex = 0; postIndex <= postCount; postIndex += 1) {
        var t = postIndex / postCount;
        var postX = x1 + dx * t;
        var postZ = z1 + dz * t;
        postPoints.push(
          new THREE.Vector3(postX, 0.03, postZ),
          new THREE.Vector3(postX, 1.02, postZ)
        );
      }
      scene.add(new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints(postPoints),
        lineMaterial
      ));
    }

    function addGraveyardMausoleum() {
      var mausoleum = new THREE.Group();
      mausoleum.position.set(6.8, 0, -93.0);

      var stoneMaterial = new THREE.MeshStandardMaterial({
        color: 0x12100c,
        roughness: 0.92,
        metalness: 0.04
      });
      var darkMaterial = new THREE.MeshBasicMaterial({
        color: 0x030302,
        side: THREE.DoubleSide
      });
      var edgeMaterial = new THREE.LineBasicMaterial({
        color: 0xd8bd8a,
        transparent: true,
        opacity: 0.42
      });

      function addMausoleumBlock(geometry, x, y, z, material) {
        var block = new THREE.Mesh(geometry, material || stoneMaterial);
        block.position.set(x, y, z);
        mausoleum.add(block);

        var edges = new THREE.LineSegments(
          new THREE.EdgesGeometry(geometry),
          edgeMaterial
        );
        edges.position.copy(block.position);
        edges.rotation.copy(block.rotation);
        mausoleum.add(edges);
        return block;
      }

      addMausoleumBlock(new THREE.BoxGeometry(4.5, 0.22, 3.8), 0, 0.11, 0);
      addMausoleumBlock(new THREE.BoxGeometry(3.7, 2.6, 3.0), 0, 1.5, 0);

      var roofGeometry = new THREE.ConeGeometry(2.68, 1.08, 4);
      var roof = new THREE.Mesh(roofGeometry, stoneMaterial);
      roof.position.set(0, 3.34, 0);
      roof.rotation.y = Math.PI / 4;
      mausoleum.add(roof);
      var roofEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(roofGeometry),
        edgeMaterial
      );
      roofEdges.position.copy(roof.position);
      roofEdges.rotation.copy(roof.rotation);
      mausoleum.add(roofEdges);

      var doorShape = new THREE.Shape();
      doorShape.moveTo(-0.62, 0);
      doorShape.lineTo(-0.62, 1.35);
      doorShape.quadraticCurveTo(-0.62, 1.95, 0, 2.08);
      doorShape.quadraticCurveTo(0.62, 1.95, 0.62, 1.35);
      doorShape.lineTo(0.62, 0);
      doorShape.closePath();
      var doorGeometry = new THREE.ShapeGeometry(doorShape);
      var door = new THREE.Mesh(doorGeometry, darkMaterial);
      door.position.set(0, 0.25, 1.512);
      mausoleum.add(door);
      var doorEdges = new THREE.LineSegments(
        new THREE.EdgesGeometry(doorGeometry),
        new THREE.LineBasicMaterial({
          color: 0xffe3a6,
          transparent: true,
          opacity: 0.5
        })
      );
      doorEdges.position.copy(door.position);
      mausoleum.add(doorEdges);

      [-1.28, 1.28].forEach(function (x) {
        var column = new THREE.Mesh(
          new THREE.CylinderGeometry(0.13, 0.16, 2.34, 10),
          stoneMaterial
        );
        column.position.set(x, 1.42, 1.58);
        mausoleum.add(column);
      });

      addMausoleumBlock(new THREE.BoxGeometry(2.3, 0.16, 0.72), 0, 0.2, 1.88);
      addMausoleumBlock(new THREE.BoxGeometry(1.7, 0.14, 0.62), 0, 0.33, 2.26);

      var mausoleumLight = new THREE.PointLight(0xffe3a6, 0.18, 5.5);
      mausoleumLight.position.set(0, 2.0, 3.0);
      mausoleum.add(mausoleumLight);

      scene.add(mausoleum);
      roomFixtures.push({ x: 6.8, z: -93.0, radius: 2.72 });
    }

    function addFlatGraveMarkers() {
      var markerMaterial = new THREE.MeshStandardMaterial({
        color: 0x0e0c09,
        roughness: 0.96,
        metalness: 0.02
      });
      var markerEdgeMaterial = new THREE.LineBasicMaterial({
        color: 0xd8bd8a,
        transparent: true,
        opacity: 0.3
      });
      var markerGeometry = new THREE.BoxGeometry(1.3, 0.1, 2.05);
      [
        { x: 6.1, z: -81.5, rotation: 0.12 },
        { x: 22.0, z: -82.8, rotation: -0.18 },
        { x: 15.0, z: -85.1, rotation: 0.09 },
        { x: 7.5, z: -87.0, rotation: -0.2 },
        { x: 16.2, z: -92.4, rotation: 0.16 },
        { x: 22.2, z: -94.4, rotation: -0.08 }
      ].forEach(function (markerPosition) {
        var marker = new THREE.Mesh(markerGeometry, markerMaterial);
        marker.position.set(markerPosition.x, 0.07, markerPosition.z);
        marker.rotation.y = markerPosition.rotation;
        scene.add(marker);

        var markerEdges = new THREE.LineSegments(
          new THREE.EdgesGeometry(markerGeometry),
          markerEdgeMaterial
        );
        markerEdges.position.copy(marker.position);
        markerEdges.rotation.copy(marker.rotation);
        scene.add(markerEdges);
      });
    }

    function addGraveyardGrass() {
      var clusters = [
        [5.2, -78.8],
        [7.1, -84.0],
        [5.1, -86.2],
        [10.0, -84.5],
        [13.8, -80.2],
        [17.0, -83.2],
        [18.6, -86.2],
        [21.8, -78.7],
        [23.0, -87.0],
        [23.0, -91.0],
        [20.8, -94.7],
        [14.0, -94.4],
        [10.0, -95.3]
      ];
      var bladeOffsets = [
        [-0.14, -0.02, -0.05, 0.27, 0.02],
        [-0.05, 0.08, -0.02, 0.34, 0.12],
        [0.03, -0.06, 0.08, 0.24, -0.12],
        [0.12, 0.05, 0.17, 0.31, 0.0],
        [0.0, 0.13, -0.05, 0.22, 0.18]
      ];
      var grassPoints = [];

      clusters.forEach(function (cluster) {
        bladeOffsets.forEach(function (blade) {
          grassPoints.push(
            new THREE.Vector3(cluster[0] + blade[0], 0.025, cluster[1] + blade[1]),
            new THREE.Vector3(cluster[0] + blade[2], blade[3], cluster[1] + blade[4])
          );
        });
      });

      scene.add(new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints(grassPoints),
        new THREE.LineBasicMaterial({
          color: 0x9a8b50,
          transparent: true,
          opacity: 0.46
        })
      ));
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
        { x: 2.3, z: -16.6, rotation: -Math.PI / 2 },
        { x: 2.3, z: -21.0, rotation: -Math.PI / 2 },
        { x: 2.3, z: -25.4, rotation: -Math.PI / 2 }
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
        { src: "/assets/about/what-drives-joe.jpg", x: 24.9, z: 3.37, y: 1.89, rotation: Math.PI, width: 3.2, height: 2.15 },
        { src: "/assets/about/principles-shape-work.jpg", x: 28.2, z: 3.37, y: 1.89, rotation: Math.PI, width: 3.2, height: 2.15 },
        { src: "/assets/about/coordination-flywheel.jpg", x: 31.6, z: 3.37, y: 2.02, rotation: Math.PI, width: 2.75, height: 2.75 },
        { src: "/assets/about/principled-tradeoff-analysis.jpg", x: 34.9, z: 3.37, y: 1.77, rotation: Math.PI, width: 2.9, height: 1.94 },
        { src: "/assets/about/principles-drive-everything-wheel.jpg", x: 38.2, z: 3.37, y: 1.84, rotation: Math.PI, width: 2.7, height: 2.16 }
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
        image.position.set(item.x, item.y, item.z + (item.rotation === 0 ? 0.014 : -0.014));
        image.rotation.y = item.rotation;
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

    function addJoinedLineBox(position, size, opacity, omittedVerticalCorners, parent) {
      var xMin = position.x - size.x / 2;
      var xMax = position.x + size.x / 2;
      var yMin = position.y - size.y / 2;
      var yMax = position.y + size.y / 2;
      var zMin = position.z - size.z / 2;
      var zMax = position.z + size.z / 2;
      var corners = [
        [xMin, zMin],
        [xMax, zMin],
        [xMax, zMax],
        [xMin, zMax]
      ];
      var points = [];

      [yMin, yMax].forEach(function (y) {
        corners.forEach(function (corner, index) {
          var next = corners[(index + 1) % corners.length];
          points.push(
            new THREE.Vector3(corner[0], y, corner[1]),
            new THREE.Vector3(next[0], y, next[1])
          );
        });
      });

      corners.forEach(function (corner, index) {
        if (omittedVerticalCorners.indexOf(index) !== -1) return;
        points.push(
          new THREE.Vector3(corner[0], yMin, corner[1]),
          new THREE.Vector3(corner[0], yMax, corner[1])
        );
      });

      var line = new THREE.LineSegments(
        new THREE.BufferGeometry().setFromPoints(points),
        new THREE.LineBasicMaterial({ color: 0xd8bd8a, transparent: true, opacity: opacity })
      );
      (parent || scene).add(line);
    }

    function addExhibits() {
      var controlConnectorX = pushingRoomOffset.x + 4.4;
      var workConnectorX = workRoomOffset.x + workRoomLayout.supportConnectorX;
      var placements = [
        { wall: "methodsSouth", zone: "work", x: 5.75, z: methodsRoomLayout.south + 0.16, y: 2.45, rotation: 0, scale: 0.72 },
        { wall: "methodsSouth", zone: "work", x: 9.93, z: methodsRoomLayout.south + 0.16, y: 2.45, rotation: 0, scale: 0.72 },
        { wall: "methodsSouth", zone: "work", x: 14.1, z: methodsRoomLayout.south + 0.16, y: 2.45, rotation: 0, scale: 0.72 },
        { wall: "identityGalleryBack", x: 26.1, z: -8.86, y: 2.35, rotation: 0, scale: 0.72 },
        { wall: "identityGalleryBack", x: 29.4, z: -8.86, y: 2.35, rotation: 0, scale: 0.72 },
        { wall: "supportWorkWest", x: workConnectorX - 1.37, z: 12.0, y: 2.3, rotation: Math.PI / 2, scale: 0.78 },
        { wall: "supportWorkEast", x: workConnectorX + 1.37, z: 16.0, y: 2.3, rotation: -Math.PI / 2, scale: 0.78 },
        { wall: "supportControlWest", x: controlConnectorX - 1.37, z: 12.5, y: 2.3, rotation: Math.PI / 2, scale: 0.78 },
        null,
        { wall: "altar", x: 0, z: -55.52, y: 3.05, rotation: 0 },
        { wall: "discoverWest", x: -15.76, z: -20.5, y: 2.35, rotation: Math.PI / 2 },
        { wall: "discoverWest", x: -15.76, z: -25.0, y: 2.35, rotation: Math.PI / 2 },
        { wall: "discoverEast", x: -11.04, z: -30.0, y: 2.35, rotation: -Math.PI / 2 },
        { wall: "chapelLeft", x: -9.34, z: -35.2, y: 2.46, rotation: Math.PI / 2 },
        { wall: "discoverEast", x: -11.04, z: -39.0, y: 2.35, rotation: -Math.PI / 2 },
        { wall: "discoverWest", x: -15.76, z: -43.5, y: 2.35, rotation: Math.PI / 2 },
        { wall: "chapelRight", x: 9.34, z: -35.2, y: 2.46, rotation: -Math.PI / 2 },
        { wall: "chapelLeft", x: -9.34, z: -43.5, y: 2.46, rotation: Math.PI / 2 },
        { wall: "chapelRight", x: 9.34, z: -47.0, y: 2.46, rotation: -Math.PI / 2 },
        { wall: "developmentBack", x: -4.43, z: -27.1, y: 2.55, rotation: -Math.PI / 2 },
        { wall: "developmentBack", x: -4.43, z: -22.9, y: 2.55, rotation: -Math.PI / 2 },
        { wall: "supportWorkWest", x: workConnectorX - 1.37, z: 20.0, y: 2.3, rotation: Math.PI / 2, scale: 0.78 },
        { wall: "supportWorkEast", x: workConnectorX + 1.37, z: 24.0, y: 2.3, rotation: -Math.PI / 2, scale: 0.78 },
        { wall: "supportSouth", x: 14.0, z: 22.63, y: 2.3, rotation: 0, scale: 0.78 },
        { wall: "supportNorth", x: 8.8, z: 27.37, y: 2.3, rotation: Math.PI, scale: 0.78 },
        { wall: "supportSouth", x: 3.6, z: 22.63, y: 2.3, rotation: 0, scale: 0.78 },
        { wall: "supportNorth", x: -1.6, z: 27.37, y: 2.3, rotation: Math.PI, scale: 0.78 },
        { wall: "supportSouth", x: -6.8, z: 22.63, y: 2.3, rotation: 0, scale: 0.78 },
        { wall: "supportNorth", x: -12.0, z: 27.37, y: 2.3, rotation: Math.PI, scale: 0.78 },
        { wall: "supportSouth", x: -17.2, z: 22.63, y: 2.3, rotation: 0, scale: 0.78 },
        { wall: "supportControlEast", x: controlConnectorX + 1.37, z: 17.0, y: 2.3, rotation: -Math.PI / 2, scale: 0.78 },
        { wall: "supportControlWest", x: controlConnectorX - 1.37, z: 21.5, y: 2.3, rotation: Math.PI / 2, scale: 0.78 },
        { wall: "back", zone: "pushing", x: -5.4, z: -11.45, y: 2.25, rotation: 0 },
        { wall: "back", zone: "pushing", x: 0, z: -11.45, y: 2.25, rotation: 0 },
        { wall: "back", zone: "pushing", x: 5.4, z: -11.45, y: 2.25, rotation: 0 },
        { wall: "controlFront", zone: "pushing", x: -5.4, z: 10.25, y: 2.25, rotation: Math.PI },
        { wall: "controlFront", zone: "pushing", x: -0.6, z: 10.25, y: 2.25, rotation: Math.PI },
        { wall: "discoverWest", x: -15.76, z: -34.5, y: 2.35, rotation: Math.PI / 2 },
        { wall: "discoverEntryNorth", x: -12.8, z: -10.94, y: 2.3, rotation: Math.PI, scale: 0.78 },
        { wall: "identityGalleryBack", x: 32.7, z: -8.86, y: 2.35, rotation: 0, scale: 0.72 },
        { wall: "identityGalleryWest", x: 24.14, z: -5.35, y: 2.35, rotation: Math.PI / 2, scale: 0.72 },
        { wall: "identityGalleryEast", x: 38.36, z: -5.35, y: 2.35, rotation: -Math.PI / 2, scale: 0.72 },
        { wall: "identityGalleryBack", x: 36.0, z: -8.86, y: 2.35, rotation: 0, scale: 0.72 },
        { wall: "chapelBack", x: -6.58, z: -55.86, y: 2.55, rotation: 0, scale: 0.78 },
        { wall: "chapelBack", x: 6.58, z: -55.86, y: 2.55, rotation: 0, scale: 0.78 },
        { wall: "discoverEast", x: -11.04, z: -48.0, y: 2.35, rotation: -Math.PI / 2 }
      ];

      placements[exhibitIndex("Make a consequential AI decision")] = {
        wall: "workSouth", zone: "work", x: 8.45, z: workRoomLayout.south + 0.16, y: 2.45, rotation: 0, scale: 0.72
      };
      placements[exhibitIndex("Make AI capability show up in real work")] = {
        wall: "workSouth", zone: "work", x: 11.85, z: workRoomLayout.south + 0.16, y: 2.45, rotation: 0, scale: 0.72
      };
      placements[exhibitIndex("Turn scattered AI activity into business value")] = {
        wall: "workNorth", zone: "work", x: 7.35, z: workRoomLayout.north - 0.16, y: 2.45, rotation: Math.PI, scale: 0.72
      };
      placements[exhibitIndex("Push an important R&D question further")] = {
        wall: "workNorth", zone: "work", x: 11.3, z: workRoomLayout.north - 0.16, y: 2.45, rotation: Math.PI, scale: 0.72
      };
      placements[exhibitIndex("Bring more substantive applied AI work to your clients")] = {
        wall: "workEast", zone: "work", x: workRoomLayout.east - 0.16, z: -9.0, y: 2.45, rotation: -Math.PI / 2, scale: 0.72
      };

      exhibits.forEach(function (exhibit, index) {
        var place = placements[index];
        if (!place) return;
        var target = place.zone === "pushing" ? pushingRoom : (place.zone === "work" ? workRoom : scene);
        var group = new THREE.Group();
        group.position.set(place.x, place.y, place.z);
        group.rotation.y = place.rotation;
        if (place.scale) group.scale.setScalar(place.scale);
        group.userData.exhibitIndex = index;

        var plate = new THREE.Mesh(
          new THREE.PlaneGeometry(3.6, 3.9),
          new THREE.MeshBasicMaterial({ color: 0x080604, transparent: true, opacity: 0.82, side: THREE.DoubleSide })
        );
        plate.position.z = -0.02;
        plate.userData.exhibitIndex = index;
        group.add(plate);
        interactive.push(plate);

        if (exhibit.image || exhibit.displayType === "product") {
          var texture = exhibit.displayType === "product"
            ? makeProductArtworkTexture(exhibit)
            : new THREE.TextureLoader().load(exhibit.image);
          texture.colorSpace = THREE.SRGBColorSpace;
          var image = new THREE.Mesh(
            new THREE.PlaneGeometry(exhibit.imageWidth || 2.5, exhibit.imageHeight || 1.55),
            new THREE.MeshBasicMaterial({ map: texture, transparent: true })
          );
          image.position.set(0, 0.78, 0.03);
          image.userData.exhibitIndex = index;
          group.add(image);
          interactive.push(image);
        } else {
          var emptyImageFrame = new THREE.LineSegments(
            new THREE.EdgesGeometry(new THREE.BoxGeometry(2.5, 1.55, 0.025)),
            new THREE.LineBasicMaterial({ color: 0xd8bd8a, transparent: true, opacity: 0.16 })
          );
          emptyImageFrame.position.set(0, 0.78, 0.03);
          group.add(emptyImageFrame);
        }

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
      if (place.wall === "developmentBack") marker.position.x -= 2.1;
      if (place.wall === "methodsWest") marker.position.x += 1.2;
      if (place.wall === "methodsEast") marker.position.x -= 1.2;
      if (place.wall === "methodsSouth") marker.position.z += 1.2;
      if (place.wall === "workSouth") marker.position.z += 1.2;
      if (place.wall === "workNorth") marker.position.z -= 1.2;
      if (place.wall === "workEast") marker.position.x -= 1.2;
      if (place.wall === "discoverWest") marker.position.x += 2.05;
      if (place.wall === "discoverEast") marker.position.x -= 2.05;
      if (place.wall === "discoverEntryNorth") marker.position.z -= 1.2;
      if (place.wall === "supportWorkWest" || place.wall === "supportControlWest") marker.position.x += 1.2;
      if (place.wall === "supportWorkEast" || place.wall === "supportControlEast") marker.position.x -= 1.2;
      if (place.wall === "supportSouth") marker.position.z += 1.2;
      if (place.wall === "supportNorth") marker.position.z -= 1.2;
      if (place.wall === "identityNorth") marker.position.z += 1.2;
      if (place.wall === "identitySouth") marker.position.z -= 1.2;
      if (place.wall === "identityGalleryBack" || place.wall === "chapelBack") marker.position.z += 1.2;
      if (place.wall === "identityGalleryWest") marker.position.x += 1.2;
      if (place.wall === "identityGalleryEast") marker.position.x -= 1.2;
      if (place.wall === "controlFront") marker.position.z -= 2.1;
      (parent || scene).add(marker);
    }

    function makeProductArtworkTexture(exhibit) {
      var c = document.createElement("canvas");
      c.width = 1200;
      c.height = 744;
      var ctx = c.getContext("2d");
      var cream = "#fff8e8";
      var gold = "#ffe3a6";
      var tan = "#d8bd8a";

      ctx.fillStyle = "#050403";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(216,189,138,0.09)";
      ctx.lineWidth = 1;
      for (var gridX = 48; gridX < c.width; gridX += 72) {
        ctx.beginPath();
        ctx.moveTo(gridX, 0);
        ctx.lineTo(gridX, c.height);
        ctx.stroke();
      }
      for (var gridY = 48; gridY < c.height; gridY += 72) {
        ctx.beginPath();
        ctx.moveTo(0, gridY);
        ctx.lineTo(c.width, gridY);
        ctx.stroke();
      }

      ctx.strokeStyle = "rgba(255,227,166,0.5)";
      ctx.lineWidth = 3;
      ctx.strokeRect(34, 34, c.width - 68, c.height - 68);
      ctx.strokeStyle = "rgba(216,189,138,0.22)";
      ctx.strokeRect(66, 66, c.width - 132, c.height - 132);

      function line(x1, y1, x2, y2, width, opacity) {
        ctx.strokeStyle = "rgba(255,227,166," + (opacity || 0.46) + ")";
        ctx.lineWidth = width || 4;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.stroke();
      }

      function node(x, y, radius, active) {
        ctx.fillStyle = active ? gold : "rgba(216,189,138,0.2)";
        ctx.strokeStyle = active ? cream : "rgba(216,189,138,0.72)";
        ctx.lineWidth = active ? 5 : 3;
        ctx.beginPath();
        ctx.arc(x, y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }

      if (exhibit.artworkPattern === "decision") {
        [[180, 220], [180, 372], [180, 524], [440, 272], [440, 472]].forEach(function (point) {
          line(point[0], point[1], 650, 372, 4, 0.38);
          node(point[0], point[1], 24, false);
        });
        ctx.save();
        ctx.translate(650, 372);
        ctx.rotate(Math.PI / 4);
        ctx.strokeStyle = gold;
        ctx.lineWidth = 6;
        ctx.strokeRect(-54, -54, 108, 108);
        ctx.restore();
        line(710, 372, 1018, 372, 7, 0.78);
        node(1018, 372, 30, true);
      } else if (exhibit.artworkPattern === "practice") {
        for (var practiceIndex = 0; practiceIndex < 5; practiceIndex += 1) {
          var practiceY = 540 - practiceIndex * 82;
          line(170 + practiceIndex * 150, practiceY, 330 + practiceIndex * 150, practiceY - 58, 6, 0.58);
          node(170 + practiceIndex * 150, practiceY, 23, practiceIndex === 0);
          node(330 + practiceIndex * 150, practiceY - 58, 23, practiceIndex === 4);
        }
        line(170, 540, 930, 154, 2, 0.22);
      } else if (exhibit.artworkPattern === "value") {
        [[170, 190], [180, 330], [170, 480], [370, 245], [370, 425]].forEach(function (point) {
          line(point[0], point[1], 590, 350, 3, 0.32);
          node(point[0], point[1], 20, false);
        });
        node(590, 350, 34, true);
        line(624, 350, 985, 198, 8, 0.72);
        line(985, 198, 985, 520, 3, 0.32);
        [0, 1, 2].forEach(function (index) {
          ctx.fillStyle = "rgba(216,189,138," + (0.18 + index * 0.08) + ")";
          ctx.fillRect(760 + index * 92, 500 - index * 76, 58, 76 + index * 76);
          ctx.strokeStyle = tan;
          ctx.strokeRect(760 + index * 92, 500 - index * 76, 58, 76 + index * 76);
        });
      } else if (exhibit.artworkPattern === "research") {
        node(160, 372, 28, true);
        [[390, 180], [390, 300], [390, 444], [390, 564]].forEach(function (point, index) {
          line(188, 372, point[0], point[1], 4, 0.42);
          node(point[0], point[1], 22, false);
          line(point[0] + 22, point[1], 690, 250 + index * 82, 4, 0.4);
        });
        ctx.strokeStyle = gold;
        ctx.lineWidth = 5;
        ctx.strokeRect(690, 206, 154, 330);
        line(844, 372, 1018, 372, 7, 0.76);
        node(1018, 372, 30, true);
      } else {
        line(150, 250, 1015, 250, 6, 0.55);
        line(150, 494, 1015, 494, 6, 0.55);
        [260, 454, 648, 842].forEach(function (partnerX, index) {
          line(partnerX, 250, partnerX + (index % 2 ? -50 : 50), 494, 3, 0.3);
          node(partnerX, 250, 22, index === 0);
          node(partnerX + (index % 2 ? -50 : 50), 494, 22, index === 3);
        });
        ctx.strokeStyle = gold;
        ctx.lineWidth = 5;
        ctx.strokeRect(510, 286, 180, 172);
      }

      ctx.fillStyle = gold;
      ctx.font = "700 28px Space Mono, monospace";
      ctx.fillText("WORK WITH JOE / " + exhibit.artworkCode, 92, 118);
      ctx.fillStyle = "rgba(239,227,202,0.58)";
      ctx.font = "500 22px Space Mono, monospace";
      ctx.fillText("START WITH THE CHANGE", 92, 648);

      var texture = new THREE.CanvasTexture(c);
      texture.colorSpace = THREE.SRGBColorSpace;
      texture.needsUpdate = true;
      return texture;
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
      ctx.fillText(exhibit.staticStat ? "LIVE SYSTEM" : "PURPOSE", 56, 78);
      ctx.fillStyle = "#fff8e8";
      var titleSize = exhibit.displayType === "product"
        ? (exhibit.title.length > 48 ? 40 : exhibit.title.length > 38 ? 44 : 48)
        : 58;
      var titleLineHeight = exhibit.displayType === "product" ? titleSize + 5 : 62;
      ctx.font = "800 " + titleSize + "px Space Grotesk, sans-serif";
      wrapText(ctx, exhibit.title, 56, 150, 900, titleLineHeight, exhibit.displayType === "product" ? 3 : 2);
      if (exhibit.staticStat) {
        ctx.fillStyle = "#ffe3a6";
        ctx.font = "800 92px Space Mono, monospace";
        ctx.fillText(exhibit.staticStat.value, 56, 354);
        ctx.fillStyle = "rgba(239,227,202,0.82)";
        ctx.font = "700 40px Space Grotesk, sans-serif";
        ctx.fillText(exhibit.staticStat.label.toUpperCase(), 56, 408);
      } else {
        ctx.fillStyle = "rgba(239,227,202,0.86)";
        var purposeLength = exhibit.purpose.length;
        var purposeSize = purposeLength > 210 ? 29 : purposeLength > 165 ? 31 : purposeLength > 120 ? 33 : 35;
        var purposeLineHeight = purposeLength > 210 ? 34 : purposeLength > 165 ? 36 : purposeLength > 120 ? 38 : 40;
        ctx.font = "600 " + purposeSize + "px Space Grotesk, sans-serif";
        wrapText(ctx, exhibit.purpose, 56, exhibit.displayType === "product" ? 302 : 310, 860, purposeLineHeight, 5);
      }
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makeElevatorPlacardTexture() {
      var c = document.createElement("canvas");
      c.width = 900;
      c.height = 520;
      var ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(3,3,2,0.97)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(255,227,166,0.62)";
      ctx.lineWidth = 4;
      ctx.strokeRect(30, 30, c.width - 60, c.height - 60);
      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 94px Space Grotesk, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("Who is Joe?", c.width / 2, c.height / 2);
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makeContactButtonLabelTexture(label) {
      var c = document.createElement("canvas");
      c.width = 1200;
      c.height = 360;
      var ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(3,3,2,0.98)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(255,227,166,0.72)";
      ctx.lineWidth = 5;
      ctx.strokeRect(28, 28, c.width - 56, c.height - 56);
      ctx.strokeStyle = "rgba(216,189,138,0.28)";
      ctx.lineWidth = 2;
      ctx.strokeRect(48, 48, c.width - 96, c.height - 96);
      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 82px Space Grotesk, sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.shadowColor = "rgba(255,227,166,0.46)";
      ctx.shadowBlur = 22;
      ctx.shadowOffsetX = 8;
      ctx.shadowOffsetY = 10;
      ctx.fillText(label || "DON'T PRESS THIS BUTTON", c.width / 2, c.height / 2);
      ctx.shadowColor = "transparent";
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makeElevatorIndicatorTexture(primary, secondary) {
      var c = document.createElement("canvas");
      c.width = 900;
      c.height = 440;
      var ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(3,3,2,0.98)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(255,227,166,0.56)";
      ctx.lineWidth = 4;
      ctx.strokeRect(24, 24, c.width - 48, c.height - 48);
      ctx.fillStyle = "#ffe3a6";
      ctx.font = "800 178px Space Mono, monospace";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(primary, c.width / 2, 190);
      ctx.fillStyle = "rgba(239,227,202,0.76)";
      ctx.font = "700 38px Space Mono, monospace";
      ctx.fillText(secondary, c.width / 2, 342);
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function setElevatorIndicator(primary, secondary) {
      var oldTextures = [];
      var texture = makeElevatorIndicatorTexture(primary, secondary);
      elevator.indicatorMaterials.forEach(function (material) {
        if (material.map && oldTextures.indexOf(material.map) === -1) oldTextures.push(material.map);
        material.map = texture;
        material.needsUpdate = true;
      });
      oldTextures.forEach(function (oldTexture) {
        oldTexture.dispose();
      });
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

    function makeGraveyardMarkerTexture(index) {
      var c = document.createElement("canvas");
      c.width = 640;
      c.height = 390;
      var ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(3,3,2,0.9)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(216,189,138,0.58)";
      ctx.lineWidth = 4;
      ctx.strokeRect(18, 18, c.width - 36, c.height - 36);
      ctx.fillStyle = "rgba(216,189,138,0.82)";
      ctx.font = "700 34px Space Mono, monospace";
      ctx.textAlign = "center";
      ctx.fillText("PLOT " + String(index + 1).padStart(2, "0"), c.width / 2, 82);
      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 66px Space Grotesk, sans-serif";
      ctx.fillText("RESERVED", c.width / 2, 194);
      ctx.fillStyle = "rgba(239,227,202,0.72)";
      ctx.font = "600 29px Space Grotesk, sans-serif";
      ctx.fillText("FOR RETIRED WORK", c.width / 2, 268);
      var tex = new THREE.CanvasTexture(c);
      tex.colorSpace = THREE.SRGBColorSpace;
      tex.needsUpdate = true;
      return tex;
    }

    function makeWelcomeWallTexture() {
      var c = document.createElement("canvas");
      c.width = 1200;
      c.height = 920;
      var ctx = c.getContext("2d");
      ctx.clearRect(0, 0, c.width, c.height);

      ctx.fillStyle = "rgba(3,3,2,0.82)";
      ctx.fillRect(75, 42, 1050, 834);
      ctx.strokeStyle = "rgba(216,189,138,0.24)";
      ctx.lineWidth = 2;
      ctx.strokeRect(75, 42, 1050, 834);

      ctx.fillStyle = "#ffe3a6";
      ctx.font = "700 34px Space Mono, monospace";
      ctx.fillText("WELCOME", 115, 106);

      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 58px Space Grotesk, sans-serif";
      ctx.shadowColor = "rgba(255,227,166,0.24)";
      ctx.shadowBlur = 18;
      ctx.shadowOffsetX = 4;
      ctx.shadowOffsetY = 5;
      ctx.fillText("This is where I think in public.", 115, 178);
      ctx.shadowColor = "transparent";

      ctx.fillStyle = "rgba(239,227,202,0.72)";
      ctx.font = "400 27px Space Grotesk, sans-serif";
      wrapText(
        ctx,
        "Most displays here represent real GitHub repositories where my agent fleet is actively doing the work. If a repository is public, walk closer to open it and see what's happening.",
        115,
        252,
        970,
        40,
        5
      );
      wrapText(
        ctx,
        "Together, they hold my consulting methods, research, software, experiments, and systems, all grown from the same curiosity:",
        115,
        396,
        970,
        40,
        4
      );

      ctx.fillStyle = "#ffe3a6";
      ctx.font = "700 38px Space Grotesk, sans-serif";
      wrapText(
        ctx,
        "How can we think better together?",
        115,
        530,
        970,
        48,
        2
      );

      ctx.fillStyle = "rgba(239,227,202,0.72)";
      ctx.font = "400 26px Space Grotesk, sans-serif";
      wrapText(
        ctx,
        "You don't need to follow a particular path. Wander. Open doors. Follow what interests you.",
        115,
        635,
        970,
        40,
        3
      );
      wrapText(
        ctx,
        "If something sparks an idea, you've already started using the space the way it was designed.",
        115,
        742,
        970,
        40,
        3
      );

      ctx.fillStyle = "rgba(239,227,202,0.5)";
      ctx.font = "500 16px Space Mono, monospace";
      ctx.fillText("If you're interested in working with me, just turn around.", 115, 842);

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

    function makeChurchReturnSignTexture() {
      var c = document.createElement("canvas");
      c.width = 1200;
      c.height = 280;
      var ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(3,3,2,0.9)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(255,227,166,0.54)";
      ctx.lineWidth = 3;
      ctx.strokeRect(32, 32, c.width - 64, c.height - 64);
      ctx.fillStyle = "#ffe3a6";
      ctx.font = "700 30px Space Mono, monospace";
      ctx.textAlign = "center";
      ctx.fillText("RETURN TO", c.width / 2, 94);
      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 70px Space Grotesk, sans-serif";
      ctx.fillText("Orientation Hallway", c.width / 2, 184);
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

    function makeOfferPlacardTexture(statement) {
      var c = document.createElement("canvas");
      c.width = 1600;
      c.height = 384;
      var ctx = c.getContext("2d");
      ctx.fillStyle = "rgba(3,3,2,0.96)";
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.strokeStyle = "rgba(255,227,166,0.5)";
      ctx.lineWidth = 3;
      ctx.strokeRect(24, 24, c.width - 48, c.height - 48);

      ctx.fillStyle = "#ffe3a6";
      ctx.font = "700 30px Space Mono, monospace";
      ctx.fillText(statement.kicker.toUpperCase(), 58, 66);

      ctx.fillStyle = "#fff8e8";
      ctx.font = "800 52px Space Grotesk, sans-serif";
      ctx.fillText(statement.label, 58, 130);

      ctx.fillStyle = "rgba(239,227,202,0.84)";
      var bodySize = statement.body.length > 230 ? 27 : 29;
      ctx.font = "600 " + bodySize + "px Space Grotesk, sans-serif";
      wrapText(ctx, statement.body, 58, 194, 1484, 34, 5);

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
      ctx.fillText("CapacityOS", 470, 246);
      ctx.fillStyle = "rgba(239,227,202,0.84)";
      ctx.font = "600 30px Space Grotesk, sans-serif";
      wrapText(ctx, "The coordination engine behind Joe's work: domains, repositories, lanes, agents, automations, evidence, and learning connected without absorbing owner truth.", 470, 322, 760, 40, 4);
      ctx.fillStyle = "#ffe3a6";
      ctx.font = "800 64px Space Mono, monospace";
      ctx.fillText(capacityStaticStat.value, 500, 546);
      ctx.fillStyle = "rgba(239,227,202,0.72)";
      ctx.font = "700 24px Space Mono, monospace";
      ctx.fillText(capacityStaticStat.label.toUpperCase(), 622, 540);
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
      updateElevator(now);
      if (!isMobile && started) {
        updateMovement(dt);
        if (!elevator.movementLocked) updateProximity();
      }
      if (commandBillboard) {
        commandBillboard.lookAt(camera.position.x, commandBillboard.position.y, camera.position.z);
      }
      graveyardTombstones.forEach(function (tombstone) {
        tombstone.lookAt(camera.position.x, tombstone.position.y, camera.position.z);
      });
      updateBackWallNeon(now);
      updateLaboratory(now);
      root.dataset.camera = camera.position.x.toFixed(2) + "," + camera.position.z.toFixed(2);
      root.dataset.look = yaw.toFixed(3) + "," + pitch.toFixed(3);
      root.dataset.elevatorState = elevator.state;
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

    function updateLaboratory(now) {
      var dx = camera.position.x - laboratoryCenter.x;
      var dz = camera.position.z - laboratoryCenter.z;
      var nearLaboratory = dx * dx + dz * dz <= 196;
      if (!reducedMotion && !nearLaboratory) return;
      if (reducedMotion && laboratoryReducedMotionSettled) return;
      if (!reducedMotion && now - laboratoryLastUpdate < 42) return;
      laboratoryLastUpdate = now;

      var time = now / 1000;
      laboratoryBubbles.forEach(function (bubble, index) {
        var progress = reducedMotion
          ? (index + 1) / (laboratoryBubbles.length + 1)
          : (time * bubble.userData.speed + bubble.userData.phase) % 1;
        var drift = reducedMotion ? 0 : Math.sin(time * 2.4 + index) * 0.035;
        bubble.position.set(
          bubble.userData.baseX + drift,
          bubble.userData.baseY + progress * bubble.userData.travel,
          bubble.userData.baseZ
        );
        var scale = bubble.userData.radiusScale * (0.68 + Math.sin(progress * Math.PI) * 0.44);
        bubble.scale.setScalar(scale);
      });
      if (laboratoryGlowLight) {
        laboratoryGlowLight.intensity = reducedMotion
          ? 0.26
          : 0.22 + (Math.sin(time * 3.2) + 1) * 0.045;
      }
      laboratoryReducedMotionSettled = reducedMotion;
    }

    function updateElevator(now) {
      if (!elevator.sourceDoors || !elevator.destinationDoors) return;

      if (elevator.state === "idle") {
        var sourceDx = camera.position.x - elevator.sourceCenter.x;
        var sourceDz = camera.position.z - elevator.sourceCenter.z;
        var sourceDistance = Math.sqrt(sourceDx * sourceDx + sourceDz * sourceDz);
        if (camera.position.x >= elevator.sourceCenter.x && sourceDistance <= 3.6) {
          openWhoIsJoeElevator();
          return;
        }

        var destinationDx = camera.position.x - elevator.destinationCenter.x;
        var destinationDz = camera.position.z - elevator.destinationCenter.z;
        var destinationDistance = Math.sqrt(destinationDx * destinationDx + destinationDz * destinationDz);
        if (camera.position.x <= elevator.destinationCenter.x && destinationDistance <= 3.6) {
          openWhoIsJoeElevatorFromLowerFloor();
          return;
        }
      }

      if (elevator.state === "idle-waiting" && elevator.cooldownSide) {
        var cooldownCenter = elevator.cooldownSide === "source"
          ? elevator.sourceCenter
          : elevator.destinationCenter;
        var cooldownDx = camera.position.x - cooldownCenter.x;
        var cooldownDz = camera.position.z - cooldownCenter.z;
        var cooldownDistance = Math.sqrt(cooldownDx * cooldownDx + cooldownDz * cooldownDz);
        if (cooldownDistance >= 4.0) {
          elevator.state = "idle";
          elevator.cooldownSide = null;
        }
        return;
      }

      var elapsed = now - elevator.phaseStarted;
      var progress;

      if (elevator.state === "source-opening") {
        progress = clamp(elapsed / 900, 0, 1);
        setElevatorDoorProgress(elevator.sourceDoors, easeInOut(progress));
        if (progress >= 1) {
          elevator.state = "source-open";
          setStatus("walk into the elevator");
        }
        return;
      }

      if (elevator.state === "source-open") {
        if (
          camera.position.x < elevator.sourceCenter.x - 1.13
          && camera.position.z > elevator.sourceCenter.z - 1.45
          && camera.position.z < elevator.sourceCenter.z + 1.45
        ) {
          elevator.state = "source-closing";
          elevator.phaseStarted = now;
          elevator.movementLocked = true;
          closeProximity();
          setStatus("doors closing");
        }
        return;
      }

      if (elevator.state === "source-closing") {
        progress = clamp(elapsed / 850, 0, 1);
        setElevatorDoorProgress(elevator.sourceDoors, 1 - easeInOut(progress));
        if (progress >= 1) {
          elevator.state = "descending";
          elevator.phaseStarted = now;
          elevator.transported = false;
          setElevatorIndicator("↓", "DESCENDING");
          setStatus("descending · floor -1");
        }
        return;
      }

      if (elevator.state === "descending") {
        progress = clamp(elapsed / 2200, 0, 1);
        camera.position.y = 1.68 - Math.sin(progress * Math.PI) * 0.12 + Math.sin(progress * 20) * 0.014;

        if (progress >= 0.56 && !elevator.transported) {
          elevator.transported = true;
          camera.position.set(42.55, camera.position.y, 1.0);
          yaw = Math.PI / 2;
          pitch = 0;
          camera.rotation.set(pitch, yaw, 0);
          setElevatorIndicator("-1", "LOWER FLOOR");
        }

        if (progress >= 1) {
          camera.position.y = 1.68;
          elevator.state = "destination-opening";
          elevator.phaseStarted = now;
          setStatus("floor -1 · doors opening");
        }
        return;
      }

      if (elevator.state === "destination-opening") {
        progress = clamp(elapsed / 900, 0, 1);
        setElevatorDoorProgress(elevator.destinationDoors, easeInOut(progress));
        if (progress >= 1) {
          elevator.state = "destination-open";
          elevator.movementLocked = false;
          setStatus("floor -1 · arrow keys to move");
        }
        return;
      }

      if (elevator.state === "destination-open") {
        if (
          camera.position.x < elevator.destinationCenter.x - 0.17
          && camera.position.z > elevator.destinationCenter.z - 1.45
          && camera.position.z < elevator.destinationCenter.z + 1.45
        ) {
          elevator.state = "destination-closing-exit";
          elevator.phaseStarted = now;
          setStatus("floor -1 · doors closing");
        }
        return;
      }

      if (elevator.state === "destination-closing-exit") {
        progress = clamp(elapsed / 850, 0, 1);
        setElevatorDoorProgress(elevator.destinationDoors, 1 - easeInOut(progress));
        if (progress >= 1) {
          elevator.state = "idle-waiting";
          elevator.cooldownSide = "destination";
          setElevatorIndicator("-1", "LOWER FLOOR");
          setStatus("floor -1 · arrow keys to move");
        }
        return;
      }

      if (elevator.state === "destination-opening-return") {
        progress = clamp(elapsed / 900, 0, 1);
        setElevatorDoorProgress(elevator.destinationDoors, easeInOut(progress));
        if (progress >= 1) {
          elevator.state = "destination-open-return";
          setStatus("walk into the elevator");
        }
        return;
      }

      if (elevator.state === "destination-open-return") {
        if (
          camera.position.x > elevator.destinationCenter.x + 1.13
          && camera.position.z > elevator.destinationCenter.z - 1.45
          && camera.position.z < elevator.destinationCenter.z + 1.45
        ) {
          elevator.state = "destination-closing-return";
          elevator.phaseStarted = now;
          elevator.movementLocked = true;
          closeProximity();
          setStatus("doors closing");
        }
        return;
      }

      if (elevator.state === "destination-closing-return") {
        progress = clamp(elapsed / 850, 0, 1);
        setElevatorDoorProgress(elevator.destinationDoors, 1 - easeInOut(progress));
        if (progress >= 1) {
          elevator.state = "ascending";
          elevator.phaseStarted = now;
          elevator.transported = false;
          setElevatorIndicator("↑", "ASCENDING");
          setStatus("ascending · ground floor");
        }
        return;
      }

      if (elevator.state === "ascending") {
        progress = clamp(elapsed / 2200, 0, 1);
        camera.position.y = 1.68 - Math.sin(progress * Math.PI) * 0.12 + Math.sin(progress * 20) * 0.014;

        if (progress >= 0.56 && !elevator.transported) {
          elevator.transported = true;
          camera.position.set(elevator.sourceCenter.x - 2.13, camera.position.y, elevator.sourceCenter.z);
          yaw = -Math.PI / 2;
          pitch = 0;
          camera.rotation.set(pitch, yaw, 0);
          setElevatorIndicator("G", "GROUND FLOOR");
        }

        if (progress >= 1) {
          camera.position.y = 1.68;
          elevator.state = "source-opening-return";
          elevator.phaseStarted = now;
          setStatus("ground floor · doors opening");
        }
        return;
      }

      if (elevator.state === "source-opening-return") {
        progress = clamp(elapsed / 900, 0, 1);
        setElevatorDoorProgress(elevator.sourceDoors, easeInOut(progress));
        if (progress >= 1) {
          elevator.state = "source-open-return";
          elevator.movementLocked = false;
          setStatus("ground floor · arrow keys to move");
        }
        return;
      }

      if (elevator.state === "source-open-return") {
        if (
          camera.position.x > elevator.sourceCenter.x + 0.17
          && camera.position.z > elevator.sourceCenter.z - 1.45
          && camera.position.z < elevator.sourceCenter.z + 1.45
        ) {
          elevator.state = "source-closing-exit";
          elevator.phaseStarted = now;
          setStatus("ground floor · doors closing");
        }
        return;
      }

      if (elevator.state === "source-closing-exit") {
        progress = clamp(elapsed / 850, 0, 1);
        setElevatorDoorProgress(elevator.sourceDoors, 1 - easeInOut(progress));
        if (progress >= 1) {
          elevator.state = "idle-waiting";
          elevator.cooldownSide = "source";
          setElevatorIndicator("G", "GROUND FLOOR");
          setStatus("arrow keys to move");
        }
      }
    }

    function openWhoIsJoeElevator() {
      if (elevator.state === "idle") {
        elevator.state = "source-opening";
        elevator.phaseStarted = performance.now();
        elevator.cooldownSide = null;
        dismissInstructions();
        closeProximity();
        setElevatorIndicator("G", "GROUND FLOOR");
        setStatus("opening the elevator");
        return;
      }
      if (elevator.state === "source-opening") {
        setStatus("elevator doors opening");
        return;
      }
      if (elevator.state === "source-open") {
        setStatus("walk into the elevator");
      }
    }

    function openWhoIsJoeElevatorFromLowerFloor() {
      if (elevator.state !== "idle") return;
      elevator.state = "destination-opening-return";
      elevator.phaseStarted = performance.now();
      elevator.cooldownSide = null;
      dismissInstructions();
      closeProximity();
      setElevatorIndicator("-1", "LOWER FLOOR");
      setStatus("opening the elevator");
    }

    function enterWhoIsJoeFromWebsite() {
      setElevatorDoorProgress(elevator.sourceDoors, 0);
      setElevatorDoorProgress(elevator.destinationDoors, 0);
      camera.position.set(elevator.sourceCenter.x - 2.13, 1.68, elevator.sourceCenter.z);
      yaw = -Math.PI / 2;
      pitch = 0;
      camera.rotation.set(pitch, yaw, 0);
      elevator.state = "descending";
      elevator.phaseStarted = performance.now();
      elevator.movementLocked = true;
      elevator.transported = false;
      elevator.cooldownSide = null;
      dismissInstructions();
      closeProximity();
      setElevatorIndicator("↓", "DESCENDING");
      setStatus("descending · floor -1");
    }

    function setElevatorDoorProgress(doors, progress) {
      if (!doors) return;
      doors.left.position.z = doors.centerZ - doors.panelOffset - doors.travel * progress;
      doors.right.position.z = doors.centerZ + doors.panelOffset + doors.travel * progress;
    }

    function easeInOut(value) {
      return value < 0.5 ? 2 * value * value : 1 - Math.pow(-2 * value + 2, 2) / 2;
    }

    function updateMovement(dt) {
      var speed = (keys.ShiftLeft || keys.ShiftRight) ? 5.2 : 3.25;
      var turnSpeed = 1.7;
      var forward = Number(Boolean(keys.ArrowUp || keys.arrowup)) - Number(Boolean(keys.ArrowDown || keys.arrowdown));
      var turn = Number(Boolean(keys.ArrowLeft || keys.arrowleft)) - Number(Boolean(keys.ArrowRight || keys.arrowright));
      root.dataset.motion = forward.toFixed(0) + "," + turn.toFixed(0);

      if (elevator.movementLocked) return;

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
      next = avoidRoomFixtures(next.x, next.z);
      next = constrainToMuseumPath(next.x, next.z);
      next = applyElevatorBarriers(next);
      camera.position.x = next.x;
      camera.position.z = next.z;
    }

    function applyElevatorBarriers(next) {
      var sourcePassable = elevator.state === "source-open" || elevator.state === "source-open-return";
      var sourceDoorway = next.z > elevator.sourceCenter.z - 1.58 && next.z < elevator.sourceCenter.z + 1.58;
      var sourceThreshold = elevator.sourceCenter.x + 0.14;
      if (!sourcePassable && sourceDoorway && camera.position.x >= sourceThreshold && next.x < sourceThreshold) {
        next.x = sourceThreshold + 0.02;
      }

      var destinationPassable = elevator.state === "destination-open" || elevator.state === "destination-open-return";
      var destinationDoorway = next.z > -0.58 && next.z < 2.58;
      if (!destinationPassable && destinationDoorway && camera.position.x <= 40.18 && next.x > 40.18) {
        next.x = 40.16;
      }

      return next;
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

    function avoidRoomFixtures(x, z) {
      var next = { x: x, z: z };
      roomFixtures.forEach(function (fixture) {
        var dx = next.x - fixture.x;
        var dz = next.z - fixture.z;
        var distance = Math.sqrt(dx * dx + dz * dz);
        if (distance >= fixture.radius) return;
        if (distance === 0) {
          next.x = fixture.x + fixture.radius;
          return;
        }
        var scale = fixture.radius / distance;
        next.x = fixture.x + dx * scale;
        next.z = fixture.z + dz * scale;
      });
      return next;
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

      var nearestContactDistance = Infinity;
      contactButtonAnchors.forEach(function (anchor) {
        anchor.getWorldPosition(world);
        var contactDx = camera.position.x - world.x;
        var contactDz = camera.position.z - world.z;
        nearestContactDistance = Math.min(
          nearestContactDistance,
          Math.sqrt(contactDx * contactDx + contactDz * contactDz)
        );
      });
      if (nearestContactDistance <= 3.6 && nearestContactDistance <= nearestDistance) {
        root.dataset.nearest = "contact:" + nearestContactDistance.toFixed(2);
        openContactProximity();
        return;
      }

      root.dataset.nearest = nearestIndex + ":" + nearestDistance.toFixed(2);
      var nearestExhibit = nearestIndex >= 0 ? exhibits[nearestIndex] : null;
      var nearestRange = nearestExhibit && nearestExhibit.title === "CapacityOS"
        ? capacityProximityRange
        : (nearestExhibit && nearestExhibit.proximityRange ? nearestExhibit.proximityRange : proximityRange);
      if (nearestIndex >= 0 && nearestDistance <= nearestRange) {
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
      if (proximity) {
        proximity.classList.remove("is-contact");
        proximity.classList.toggle("is-capacity", exhibit.title === "CapacityOS");
        proximity.classList.toggle("is-product", exhibit.displayType === "product");
      }
      if (proximityKicker) {
        proximityKicker.textContent = exhibit.title === "CapacityOS"
          ? "Live system activity / updated daily"
          : exhibit.displayType === "product"
            ? "A way to work with Joe"
            : "Passion / Agent capability test";
      }
      if (proximityTitle) proximityTitle.textContent = exhibit.title;
      if (proximityBody) proximityBody.textContent = exhibit.passion;
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
      if (proximityAction) {
        if (exhibit.action) {
          proximityAction.hidden = false;
          proximityAction.dataset.action = exhibit.action;
          proximityAction.textContent = exhibit.actionLabel || "Enter";
          proximityAction.classList.add("is-open");
        } else {
          proximityAction.hidden = true;
          proximityAction.removeAttribute("data-action");
          proximityAction.classList.remove("is-open");
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

    function openContactProximity() {
      if (currentProximityKey === "contact" && proximity && proximity.classList.contains("is-open")) return;
      currentProximityIndex = -1;
      currentProximityKey = "contact";
      if (proximity) {
        proximity.classList.remove("is-capacity");
        proximity.classList.remove("is-product");
        proximity.classList.add("is-contact");
        proximity.classList.add("is-open");
        proximity.setAttribute("aria-hidden", "false");
      }
      if (proximityKicker) proximityKicker.textContent = "";
      if (proximityTitle) proximityTitle.textContent = "";
      if (proximityBody) proximityBody.textContent = "";
      if (proximityStats) {
        proximityStats.innerHTML = "";
        proximityStats.setAttribute("aria-hidden", "true");
      }
      if (proximityLink) {
        proximityLink.href = "#";
        proximityLink.classList.remove("is-experience");
        proximityLink.classList.remove("is-open");
        proximityLink.setAttribute("aria-hidden", "true");
      }
      if (proximityAction) {
        proximityAction.hidden = false;
        proximityAction.dataset.action = "contact-joe";
        proximityAction.textContent = "Contact Joe";
        proximityAction.classList.add("is-open");
      }
      setStatus("near the button");
    }

    function closeProximity() {
      if (currentProximityIndex === -1 && !currentProximityKey && proximity && !proximity.classList.contains("is-open")) return;
      currentProximityIndex = -1;
      currentProximityKey = "";
      if (proximity) {
        proximity.classList.remove("is-open");
        proximity.classList.remove("is-capacity");
        proximity.classList.remove("is-product");
        proximity.classList.remove("is-contact");
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
      if (proximityAction) {
        proximityAction.hidden = true;
        proximityAction.removeAttribute("data-action");
        proximityAction.classList.remove("is-open");
      }
      if (!isMobile) setStatus("arrow keys to move");
    }

    function updatePointerFromEvent(event) {
      if (!event) {
        pointer.set(0, 0);
        return;
      }
      var rect = canvas.getBoundingClientRect();
      pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
    }

    function updateInteractiveCursor(event) {
      if (!started || elevator.movementLocked) {
        canvas.style.cursor = "default";
        return;
      }
      updatePointerFromEvent(event);
      raycaster.setFromCamera(pointer, camera);
      var hits = raycaster.intersectObjects(interactive, false);
      var actionHit = hits.find(function (item) {
        return item.object.userData.action === "open-who-is-joe-elevator"
          || item.object.userData.action === "show-contact-joe";
      });
      var actionRange = actionHit && actionHit.object.userData.action === "show-contact-joe" ? 5 : 7.5;
      canvas.style.cursor = actionHit && actionHit.distance <= actionRange ? "pointer" : "default";
    }

    function pickExhibit(event) {
      if (elevator.movementLocked) return;
      updatePointerFromEvent(event);
      raycaster.setFromCamera(pointer, camera);
      var hits = raycaster.intersectObjects(interactive, false);
      if (!hits.length) {
        setStatus("aim at a wall exhibit or placard");
        return;
      }
      var actionHit = hits.find(function (item) {
        return item.object.userData.action === "open-who-is-joe-elevator";
      });
      if (actionHit) {
        if (actionHit.distance > 7.5) {
          setStatus("walk closer to the elevator");
          return;
        }
        openWhoIsJoeElevator();
        return;
      }
      var contactHit = hits.find(function (item) {
        return item.object.userData.action === "show-contact-joe";
      });
      if (contactHit) {
        if (contactHit.distance > 5) {
          setStatus("walk closer to the button");
          return;
        }
        openContactProximity();
        return;
      }
      var hit = hits.find(function (item) {
        return typeof item.object.userData.exhibitIndex === "number";
      });
      if (!hit) return;
      var hitExhibit = exhibits[hit.object.userData.exhibitIndex];
      var hitRange = hitExhibit && hitExhibit.title === "CapacityOS"
        ? capacityProximityRange
        : (hitExhibit && hitExhibit.proximityRange ? hitExhibit.proximityRange : proximityRange);
      if (hit.distance > hitRange) {
        setStatus("walk closer to inspect");
        return;
      }
      openProximity(hit.object.userData.exhibitIndex);
    }

    function openInspector(index) {
      var exhibit = exhibits[index];
      if (!exhibit) return;
      mobileIndex = index;
      if (inspectorKicker) {
        inspectorKicker.textContent = exhibit.title === "CapacityOS"
          ? "Live system activity / updated daily"
          : "Passion / Agent capability test";
      }
      if (inspectorTitle) inspectorTitle.textContent = exhibit.title;
      if (inspectorBody) inspectorBody.textContent = exhibit.passion;
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
