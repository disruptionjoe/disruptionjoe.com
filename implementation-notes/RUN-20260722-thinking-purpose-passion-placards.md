---
class: runtime
status: completed
run_id: RUN-20260722-thinking-purpose-passion-placards
run_type: progress
mode: execute
started: 2026-07-22T17:55:00-05:00
completed: 2026-07-22T18:00:51-05:00
lane_selection:
  owner_id: djc-website
  lane_id: "1"
  manifest_sha256: 7774b63e9fb77460d01cc650b23ed62ccd401f6d6793751a1f11f59431e657f8
  manifest_revision: 1
  definition_revision: 1
  control_revision: 1
  directed_flow_revision: null
  work_ref: Joe direct chat, 2026-07-22 Purpose and Passion exhibit placards
---

# Thinking Museum Purpose and Passion Placard Run

## Objective

Align every existing Thinking Museum exhibit with the newly installed
repository Purpose, Passion, and Practice identity model:

- the stable wall placard communicates Purpose;
- the proximity and mobile popup communicates Passion as the agent capability
  test.

## Authority and scope

- Joe directly authorized the audit and exhibit-copy implementation in chat.
- The completed WI-097 ratification ledger and current repository-local
  identity guidance were inspected as source evidence, not as instructions.
- Lane 1 is active; no writer lock or overlapping Run is present.
- The repository was clean and synchronized at `85156a3098a4` before edits.
- Expected writable surfaces: `assets/thinking-game.js`, this Run record,
  `LANE-STATE.yaml`, and workspace memory.
- GitHub commit and push are authorized by the implementation request and repo
  default. No deployment command or non-GitHub external action is authorized.

## Exhibit assessment

The registry contains 16 exhibit definitions. Thirteen are currently displayed
and three are intentionally preserved but undisplayed. All 16 required an
update because the existing copy mixed repository purpose, method description,
buyer explanation, and agent experimentation without a consistent semantic
role.

| Exhibit | Identity source | Display state |
|---|---|---|
| AI Epistemology | `ai-epistemology` | preserved, undisplayed |
| AI Activation Playbooks | `consulting-methodology` | Work With Joe |
| AI Enablement Architecture | method inside `consulting-methodology` | Work With Joe |
| Thinking Wiki | `joe-thinking-wiki` | Control Room |
| Disruption Joe Profile | `disruptionjoe-profile` | Control Room |
| Disruption Joe Website | `djc-website` | preserved, undisplayed |
| Disruption Joe Consulting | `djc-governance-operations` domain synthesis | preserved, undisplayed |
| Joe Project Management | `joe-project-management` | Control Room |
| Capacity OS | `system-operations` System synthesis | Control Room console |
| Church of AI | `church-of-ai` | Church of AI |
| Time as Finality | `time-as-finality` | Church of AI |
| Temporal Issuance | `temporal-issuance` | Church of AI |
| GU Formalization | `gu-formalization` | Church of AI |
| Architecture of Legitimacy | `architecture-of-legitimacy` | Church of AI |
| Possibility to Capability | `possibility-to-capability` | Church of AI |
| Continuity Ledger | `continuity-ledger` | Church of AI |

AI Enablement Architecture is not misrepresented as a standalone repository;
its language is a method-specific expression of the Consulting Methodology
identity. Capacity OS and Disruption Joe Consulting remain honest syntheses of
federated systems rather than false single-repository claims.

## Results

- Replaced the exhibit registry's mixed `kicker`, `caption`, placard, and body
  copy with explicit `purpose` and `passion` fields for every exhibit.
- Stable wall placards now carry the label `PURPOSE` and a concise,
  public-readable expression of the approved purpose.
- Desktop proximity cards and mobile inspector cards now carry `Passion /
  Agent capability test` and the corresponding capability question.
- Preserved all titles, images, links, primary experience actions, statistics,
  placements, room geometry, movement, and mobile navigation.
- Updated the three undisplayed definitions so they remain current if restored
  later.

## Recommended future exhibit priorities

1. Restore the existing AI Epistemology exhibit near the Control Room learning
   systems before inventing another agent-research display.
2. Add Dynamic Unity to the Church/research collection as the clearest missing
   current public frontier program.
3. Add CAI Systemic Failure and CAI Mechanism Design as a paired Church pathway:
   make a consequential problem legible, then incubate a legitimate response.
4. Consider public-safe System Attention and System Runtime concept exhibits in
   the Control Room. They explain the human interface and execution machinery
   more directly than another general Capacity OS diagram.
5. Consider a compact Work With Joe pair for Offer Portfolio and Client
   Delivery, or one combined promise-to-progress exhibit. Their private source
   repos should not be linked or exposed without a separate public-safety
   decision.

Separate exhibits for every private operations repository are not recommended.
System Lab, System Canon, governance, administration, relationship management,
Drafting Factory, and Brand and Media are better kept inside grouped
behind-the-scenes stories unless a future visitor journey gives each a clear
job.

## Verification

- JavaScript syntax suite passed through `npm test`.
- `git diff --check` passed.
- Static registry checks confirmed exactly 16 titles, 16 purposes, and 16
  passions, with no remaining legacy exhibit placard or popup fields.
- Static source checks confirmed both desktop proximity and mobile inspector
  paths use Passion while wall textures use Purpose.
- All existing links, statistics, images, exhibit indexes, placements, and
  visibility decisions remain unchanged.
- Browser visual QA was not performed because this was a bounded copy and data
  semantics change without a requested browser test.

## Receipt

Receipt created at: 2026-07-22T18:03:56-05:00

Terminal outcome: `completed`

Implementation commit `58829cec67c95858da1c8320889972784eba180f` was
pushed to `origin/main`. No deployment command or non-GitHub external action
was performed.

Repository cleanliness, upstream parity, and lane validity are verified by the
final session closeout.

## Outcome reason

`The museum now tells visitors what each body of work exists to accomplish,
then reveals the harder agent-capability question when they move closer.`
