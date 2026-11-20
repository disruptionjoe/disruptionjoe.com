import { execFileSync } from "node:child_process";
import { writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";

const args = new Map();
for (let index = 2; index < process.argv.length; index += 2) {
  args.set(process.argv[index], process.argv[index + 1]);
}

const repo = args.get("--repo");
const revision = args.get("--revision");
const output = args.get("--output");
if (!repo || !revision || !output) {
  throw new Error("usage: node scripts/generate-facilitation-playbook.mjs --repo PATH --revision SHA --output PATH");
}

const resolvedRevision = git(["rev-parse", revision]).trim();
if (resolvedRevision !== revision) {
  throw new Error(`revision must be a full SHA; received ${revision}, resolved ${resolvedRevision}`);
}

function git(command) {
  return execFileSync("git", ["-C", repo, ...command], { encoding: "utf8" });
}

function source(file) {
  return git(["show", `${revision}:${file}`]);
}

function filesUnder(folder) {
  return git(["ls-tree", "-r", "--name-only", revision, folder])
    .split("\n")
    .filter((file) => file.endsWith(".md"))
    .filter((file) => path.basename(file) !== "index.md")
    .filter((file) => !path.basename(file).startsWith("_"));
}

function parseValue(value) {
  const trimmed = value.trim();
  if (trimmed.startsWith("[") && trimmed.endsWith("]")) {
    const inner = trimmed.slice(1, -1).trim();
    return inner ? inner.split(",").map((item) => parseValue(item)) : [];
  }
  if ((trimmed.startsWith('"') && trimmed.endsWith('"')) || (trimmed.startsWith("'") && trimmed.endsWith("'"))) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseDocument(raw) {
  const match = raw.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (!match) throw new Error("missing front matter");
  const frontMatter = {};
  for (const line of match[1].split("\n")) {
    const separator = line.indexOf(":");
    if (separator < 0) continue;
    frontMatter[line.slice(0, separator).trim()] = parseValue(line.slice(separator + 1));
  }
  return { frontMatter, body: match[2] };
}

function sections(body) {
  const result = new Map();
  const headings = [...body.matchAll(/^##\s+(.+)$/gm)];
  headings.forEach((heading, index) => {
    const start = heading.index + heading[0].length;
    const end = headings[index + 1]?.index ?? body.length;
    result.set(heading[1].trim(), body.slice(start, end).trim());
  });
  return result;
}

function publicText(value) {
  return value
    .replace(/\[([^\]]+)\]\([^)]+\)/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\s*[—]\s*/g, ": ")
    .replace(/\s+/g, " ")
    .trim();
}

function firstHeading(body) {
  const heading = body.match(/^#\s+(.+)$/m)?.[1] ?? "";
  const parts = heading.split(/\s+[—]\s+/);
  return { heading: publicText(parts.shift() ?? ""), purpose: publicText(parts.join(" ")) };
}

function boldField(body, label) {
  const escaped = label.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  return publicText(body.match(new RegExp(`^\\*\\*${escaped}:\\*\\*\\s*(.*)$`, "m"))?.[1] ?? "");
}

function variants(body) {
  const marker = body.match(/^\*\*Variants:\*\*\s*(.*)$/m);
  if (!marker) return [];
  const values = [];
  if (marker[1].trim()) values.push(publicText(marker[1]));
  const tail = body.slice(marker.index + marker[0].length);
  for (const line of tail.split("\n")) {
    if (/^\*\*/.test(line)) break;
    if (/^-\s+/.test(line)) values.push(publicText(line.replace(/^-\s+/, "")));
  }
  return values;
}

function idsFromLinks(value, slugToId) {
  return [...value.matchAll(/\[[^\]]+\]\(([^)]+\.md)\)/g)]
    .map((match) => path.basename(match[1], ".md"))
    .map((slug) => slugToId.get(slug))
    .filter(Boolean);
}

function sessionSequence(section) {
  return section.split("\n").flatMap((line) => {
    const match = line.match(/^\d+\.\s+\[((?:PL|TQ)-\d{3})\]\([^)]+\)\s+[—-]\s+(.+)$/);
    return match ? [{ id: match[1], setting: publicText(match[2]) }] : [];
  });
}

function optionalSequence(section = "") {
  return section.split("\n").flatMap((line) => {
    const match = line.match(/^-\s+\[((?:PL|TQ)-\d{3})\]\([^)]+\)\s+[—-]\s+(.+)$/);
    return match ? [{ id: match[1], setting: publicText(match[2]) }] : [];
  });
}

const categoryLabels = {
  "figure-it-out": "Figure It Out",
  "get-organized": "Get Organized",
  "make-the-move": "Make the Move",
  "learn-and-absorb": "Learn and Absorb",
};

const situationRules = [
  ["The problem isn't clear", /real problem|root cause|important obstruction is unclear|see the issue differently|different versions|nobody knows why|can't name|cannot name|what is happening|shared picture|understand/i],
  ["Direction or goals aren't settled", /goal|okr|direction|strategy|vision|mission|values|roadmap|where to play/i],
  ["There are too many priorities", /priorit|backlog|too many|not enough capacity|scarce|bets/i],
  ["A decision is stuck", /choice is stuck|decision is stuck|preventing commitment|bounded set of options/i],
  ["People aren't aligned", /alignment|misalignment|differences|friction|buy-in|different stories|role owns/i],
  ["A project needs structure", /project|new initiative|roadmap|offsite|board|raid|launch/i],
  ["Change isn't landing", /change|reorg|layoff|leadership change|announcement|reset|adoption/i],
  ["Risk or uncertainty is blocking progress", /uncertainty|unknown|risk|assumption|scenario|could go wrong|depends on/i],
  ["Customer needs aren't clear", /customer|jobs|pains/i],
  ["The team needs a health check", /team feels off|team health|health rating/i],
  ["AI work needs direction", /\bAI\b/i],
  ["Opportunities need comparing", /areas of opportunity|opportunity map/i],
  ["A known problem needs action", /known problem needs responses|agreed course of action/i],
];

const outcomeRules = [
  ["Clarity about the problem", /problem statement|problem definition|better question|friction map|intervention point|shared view|shared picture|evidence|unknowns|contributing factors|health ratings/i],
  ["Goals and strategic direction", /goal|objective|key result|vision|mission|values|strategic|where to play|guiding metrics/i],
  ["Priorities and a roadmap", /ranked|priorit|roadmap|cut line|ambition tiers/i],
  ["A decision or recommendation", /decision|recommendation|trade-offs|tradeoffs|dissent/i],
  ["Alignment and buy-in", /alignment|buy-in|shared picture|commitment|narrative|messages/i],
  ["Solutions and experiments", /concept|solution|critical assumption|smallest honest test|test steps|experiment/i],
  ["A project plan with owners", /project poster|raid log|offsite brief|role purpose|role owns|scope/i],
  ["Learning and improvement", /lesson|owned changes|retro|improvement|health rating/i],
  ["AI strategy and capability", /\bAI\b|use-case|capabilit/i],
  ["Communication and readiness", /board|message|story|open questions|what changed|what stays/i],
];

const buyerRules = [
  ["Leadership teams", /leadership|strategic|vision|mission|values|board|offsite|tough decision|uncertainty/i],
  ["Product and engineering", /backlog|roadmap|customer|solution|assumption|project|raid|retrospective|ai:/i],
  ["HR and People", /team health|role|alignment|reset after change|vision, mission and values|offsite|increasing capability/i],
  ["Operations and delivery", /real problem|backlog|roadmap|project|raid|retrospective|uncertainty|define the role/i],
  ["Sales and marketing", /customer|story|opportunity|board/i],
  ["AI enablement", /\bAI\b/i],
  ["Project and program leads", /project|roadmap|backlog|raid|retrospective|offsite|alignment/i],
];

function matchingTags(text, rules, fallback) {
  const tags = rules.filter(([, pattern]) => pattern.test(text)).map(([tag]) => tag);
  return tags.length ? tags : [fallback];
}

const sessionDocs = filesUnder("sessions").map((file) => {
  const { frontMatter, body } = parseDocument(source(file));
  const section = sections(body);
  const situation = publicText(section.get("Situation") ?? "");
  const outputText = publicText(section.get("Output") ?? "");
  const sequence = sessionSequence(section.get("Default play sequence") ?? "");
  const optional = optionalSequence(section.get("Optional or alternative plays"));
  const situationTagText = `${frontMatter.title} ${situation}`;
  const buyerTagText = `${frontMatter.title} ${situation} ${outputText}`;
  return {
    id: frontMatter.id,
    kind: "session",
    title: frontMatter.title,
    slug: frontMatter.slug,
    category: frontMatter.category,
    categoryLabel: categoryLabels[frontMatter.category],
    situation,
    output: outputText,
    sequence,
    optional,
    follows: frontMatter.follows ?? [],
    leadsTo: frontMatter["leads-to"] ?? [],
    pairsWith: frontMatter["pairs-with"] ?? [],
    situationTags: matchingTags(situationTagText, situationRules, "A focused working session is needed"),
    outcomeTags: matchingTags(outputText, outcomeRules, "A concrete shared output"),
    buyerTags: matchingTags(buyerTagText, buyerRules, "Cross-functional teams"),
    sourceFile: file,
  };
});

const rawPlays = filesUnder("plays").map((file) => {
  const raw = source(file);
  const { frontMatter, body } = parseDocument(raw);
  const title = firstHeading(body);
  return {
    id: frontMatter.id,
    kind: "play",
    name: frontMatter.name,
    slug: path.basename(file, ".md"),
    purpose: title.purpose,
    books: frontMatter.books ?? [],
    production: frontMatter.production,
    anonymity: frontMatter.anonymity,
    ai: frontMatter.ai,
    aiInvolvement: frontMatter.ai === "none" ? "none" : String(frontMatter.ai).startsWith("during") ? "ai-heavy" : "light",
    categories: frontMatter["used-in"] ?? [],
    default: boldField(body, "Default"),
    say: boldField(body, "Say"),
    dial: boldField(body, "Dial it"),
    variants: variants(body),
    alternatives: boldField(body, "Alternatives"),
    aiText: boldField(body, "AI"),
    oftenAfterRaw: body.match(/^\*\*Often after:\*\*\s*(.*)$/m)?.[1] ?? "",
    oftenBeforeRaw: body.match(/^\*\*Often before:\*\*\s*(.*)$/m)?.[1] ?? "",
    sourceFile: file,
  };
});

const playSlugToId = new Map(rawPlays.map((play) => [play.slug, play.id]));
const plays = rawPlays.map(({ oftenAfterRaw, oftenBeforeRaw, ...play }) => ({
  ...play,
  oftenAfter: idsFromLinks(oftenAfterRaw, playSlugToId),
  oftenBefore: idsFromLinks(oftenBeforeRaw, playSlugToId),
}));

const techniques = filesUnder("techniques").map((file) => {
  const { frontMatter, body } = parseDocument(source(file));
  const title = firstHeading(body);
  return {
    id: frontMatter.id,
    kind: "technique",
    name: frontMatter.name,
    slug: path.basename(file, ".md"),
    purpose: title.purpose,
    categories: frontMatter["used-in"] ?? [],
    do: boldField(body, "Do"),
    say: boldField(body, "Say"),
    sourceFile: file,
  };
});

const allMechanics = new Map([...plays, ...techniques].map((item) => [item.id, item]));
const sessionById = new Map(sessionDocs.map((session) => [session.id, session]));

for (const session of sessionDocs) {
  const defaultPlays = session.sequence
    .map((step) => allMechanics.get(step.id))
    .filter((item) => item?.kind === "play");
  const playAi = defaultPlays.map((play) => play.aiInvolvement);
  session.books = union(defaultPlays.map((play) => play.books));
  session.aiInvolvement = /^AI:/.test(session.title) ? "ai-heavy" : playAi.some((value) => value !== "none") ? "light" : "none";
  session.decisionMode = session.sequence.some((step) => step.id === "PL-030") ? "decides" : "informs";
}

function referencedSessions(itemId) {
  return sessionDocs.filter((session) => [...session.sequence, ...session.optional].some((step) => step.id === itemId));
}

function union(values) {
  return [...new Set(values.flat())].sort((a, b) => a.localeCompare(b));
}

function adjacency(itemId, direction) {
  const counts = new Map();
  for (const session of sessionDocs) {
    session.sequence.forEach((step, index) => {
      if (step.id !== itemId) return;
      const related = session.sequence[index + direction]?.id;
      if (related) counts.set(related, (counts.get(related) ?? 0) + 1);
    });
  }
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 3)
    .map(([id]) => id);
}

for (const item of [...plays, ...techniques]) {
  const usedIn = referencedSessions(item.id);
  item.usedInSessions = usedIn.map((session) => session.id);
  item.situationTags = union(usedIn.map((session) => session.situationTags));
  item.outcomeTags = union(usedIn.map((session) => session.outcomeTags));
  item.buyerTags = union(usedIn.map((session) => session.buyerTags));
  item.decisionModes = union(usedIn.map((session) => [session.decisionMode]));
  if (item.kind === "technique") {
    item.oftenAfter = adjacency(item.id, -1);
    item.oftenBefore = adjacency(item.id, 1);
  }
}

for (const session of sessionDocs) {
  session.related = union([session.follows, session.leadsTo, session.pairsWith]);
  for (const relation of session.related) {
    if (!sessionById.has(relation)) throw new Error(`${session.id} has unresolved relation ${relation}`);
  }
  for (const step of [...session.sequence, ...session.optional]) {
    if (!allMechanics.has(step.id)) throw new Error(`${session.id} has unresolved step ${step.id}`);
  }
}

if (sessionDocs.length !== 29 || plays.length !== 40 || techniques.length !== 11) {
  throw new Error(`unexpected counts: ${sessionDocs.length} sessions, ${plays.length} plays, ${techniques.length} techniques`);
}

const tags = {
  situation: union(sessionDocs.map((session) => session.situationTags)),
  outcome: union(sessionDocs.map((session) => session.outcomeTags)),
  category: Object.entries(categoryLabels).map(([value, label]) => ({ value, label })),
  book: ["diverge", "converge", "decide", "frame", "check", "practice"],
  buyer: union(sessionDocs.map((session) => session.buyerTags)),
  ai: ["ai-heavy", "light", "none"],
  decision: ["decides", "informs"],
};

const publicSessions = sessionDocs.map(({ slug, optional, related, sourceFile, ...session }) => session);
const publicPlays = plays.map(({ slug, production, anonymity, ai, alternatives, usedInSessions, sourceFile, ...play }) => play);
const publicTechniques = techniques.map(({ slug, usedInSessions, sourceFile, ...technique }) => technique);

const payload = {
  meta: {
    sourceRepository: "disruptionjoe/facilitator-playbook",
    sourceRevision: revision,
    generatedAt: "2026-11-20",
    counts: { sessions: sessionDocs.length, plays: plays.length, techniques: techniques.length },
    derivedTagMethod: {
      situation: "Keyword-derived from each session title and Situation.",
      outcome: "Keyword-derived from each session Output.",
      buyer: "Keyword-derived from each session title, Situation, and Output.",
      ai: "Plays use their ai front-matter field. AI-named sessions are AI-heavy; other sessions with an AI-enabled default play are light; the remainder are none.",
      decision: "A session decides when its default sequence uses Decider Call; otherwise its output informs later action or a later decision.",
    },
  },
  tags,
  sessions: publicSessions.sort((a, b) => Number(a.id.slice(3)) - Number(b.id.slice(3))),
  plays: publicPlays.sort((a, b) => Number(a.id.slice(3)) - Number(b.id.slice(3))),
  techniques: publicTechniques.sort((a, b) => Number(a.id.slice(3)) - Number(b.id.slice(3))),
};

await writeFile(output, `${JSON.stringify(payload, null, 2)}\n`, "utf8");
console.log(`generated ${output} from ${revision}: ${sessionDocs.length} sessions, ${plays.length} plays, ${techniques.length} techniques`);
