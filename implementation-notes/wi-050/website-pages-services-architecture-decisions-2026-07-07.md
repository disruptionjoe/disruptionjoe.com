# Services Page Architecture Decisions

Status: architectural decisions and insights for WI-050 fresh website build
Date: 2026-07-07
Page: Services
Work Card: WI-050
Owning implementation repo: `djc-website`

## Site Spine

- Home
- Services
- Method
- AI Activation Playbook
- AI Enablement Architecture
- AI Accelerated Thinking
- About

## Page-Level Purpose

The Services page answers one primary question:

> How can Joe help our organization become more capable?

It should not answer:

> Which service should I buy?

The page should help buyers understand the ways they can begin working with Joe without making the business feel like a catalog of disconnected consulting offers.

## Page-Level Job

The Services page creates commercial clarity.

The homepage creates recognition.

Services should translate that recognition into:

- what working together can look like
- where different organizations might begin
- how AI Activation works as a capability journey
- what changes when the work succeeds
- why the first step is a planning conversation

## Core Page Decision

Services should not be organized as a traditional service menu.

The business is not:

- workshops
- facilitation
- advisory
- enablement
- leadership support

as separate products.

Those are different entry points into one capability journey.

## Core Services Message

Different organizations start in different places.

The destination is the same:

> More capable teams, better execution, clearer standards, measurable progress, and compounding business leverage.

## Services Page Posture

The page should feel like:

> Here is how organizations begin moving toward greater capability.

Not:

> Here are the services Joe sells.

It should be practical, commercial, and easy to understand, but still connected to the deeper operating model.

## What Services Should Not Become

The page should not become:

- a product catalog
- a pricing page
- a workshop menu
- a list of consulting packages
- a generic AI training offer
- a service taxonomy
- a page that forces buyers to self-diagnose perfectly before reaching out

## Relationship to AI Activation

AI Activation is the core commercial operating concept inside Services.

It is not only a workshop.

It is not only a training session.

It is the process of helping individuals, teams, and organizations move from AI access to confidence, capability, consistency, and compounding leverage.

## Relationship to Method

Services explains how clients engage Joe.

Method explains why the approach works.

Services should not over-teach the method.

It should explain enough for buyers to trust the commercial path, then route deeper visitors to Method where appropriate.

## Buyer Clusters The Services Page Must Serve

### Operators / Executives

CEO, COO, GM, Enterprise Sponsor, Managing Partner.

They care about:

- business leverage
- operating progress
- execution
- quality
- measurable outcomes
- not wasting money on generic training

### People / Learning / Community

People leaders, L&D leaders, Association / Community leaders.

They care about:

- readiness
- confidence
- behavior change
- learning transfer
- mixed-readiness audiences
- experiences that help people move

### Innovation / Depth Buyers

AI Enablement leaders, Research / Innovation leaders, sophisticated founders and executives.

They care about:

- coherent systems
- scalable enablement
- frontier-informed methods
- practical architecture
- not buying stale AI advice

## Section 1 - The Destination

### Section Question

> What are we trying to achieve?

### Section Purpose

Start with the outcome rather than the offer.

This section should immediately tell the buyer that the point is not to buy AI Activation as a service.

The point is to become a more capable organization.

### Core Message

Organizations are not ultimately buying workshops, facilitation, or advisory.

They are buying:

- more capable teams
- better execution
- clearer standards
- more leverage from existing people and tools
- measurable business impact
- a way to turn AI access into shared capability

### Architectural Decision

The destination comes before the service.

The visitor should understand the desired end state before being asked to consider specific ways of working together.

### Design / Experience Direction

This section should feel outcome-first.

It should be direct and commercially clear.

It should not feel like a service intro yet.

It should establish the business destination and make the visitor want to know how Joe helps them get there.

### What It Should Make Buyers Feel

Operators / Executives:

> Finally, this is about performance, leverage, and execution instead of training.

People / Learning / Community:

> This is about building real capability, not running another awareness session.

Innovation / Depth Buyers:

> This is positioning AI work as organizational capability, not tool adoption.

### Supporting Insight

The buyer does not wake up wanting "AI Activation."

They wake up wanting the business to work better.

This section should honor that.

### Avoid

- Opening with a menu of offers
- Leading with workshops
- Leading with facilitation
- Leading with "services we offer"
- Making the buyer choose a category before they understand the journey
- Selling AI adoption as the destination

## Section 2 - What AI Activation Means

### Section Question

> What is AI Activation?

### Section Purpose

Explain AI Activation as the operating concept behind the services.

This is where AI Activation becomes more concrete than it was on the homepage.

### Core Message

AI Activation begins with individuals but only matters commercially when it becomes team and organizational capability.

The work moves from:

> Individual confidence -> team capability -> organizational consistency -> compounding company leverage

### Architectural Decision

This section should explain the Four Cs through practical outcomes.

Unlike the homepage, where the Four Cs appear as momentum, this page should explain what each stage means.

### Four Cs Logic

The correct causal order is:

1. Confidence
2. Capability
3. Consistency
4. Compounding

The order matters.

Confidence enables capability.

Capability enables consistency.

Consistency enables compounding leverage.

### Individual / Team / Organization Model

This section should make the progression tangible across levels.

Possible structure:

- Individuals gain confidence.
- Teams develop capability and shared practice.
- Organizations create consistency.
- Companies gain compounding leverage.

The spatial logic can be:

> Left = individuals
> Middle = teams
> Right = company / organization

### Design / Experience Direction

This section should show movement across levels.

It should not just list the Four Cs.

It should show how human confidence becomes company leverage.

Possible visual:

```text
Individual            Team                    Organization
Confidence     ->     Capability       ->     Consistency + Compounding leverage
```

Or:

```text
Individual confidence
-> Team capability
-> Organizational consistency
-> Compounding company leverage
```

### What It Should Make Buyers Feel

Operators / Executives:

> This is not a workshop. It is a capability-building model.

People / Learning / Community:

> This starts with confidence and practice, which is how people actually change.

Innovation / Depth Buyers:

> There is a coherent theory underneath the commercial offer.

### Supporting Insight

The most important distinction:

AI Activation is not a product.

AI Activation is the path by which AI access becomes business capability.

### Avoid

- Making AI Activation sound like a single session
- Presenting the Four Cs as a gimmicky branded framework
- Losing Capability as a distinct stage
- Losing Consistency as a distinct stage
- Jumping from confidence directly to business value
- Making this feel like training terminology

## Section 3 - Where We Begin

### Section Question

> Where should we begin?

### Section Purpose

Show that different organizations enter the journey from different starting points.

This section should reduce the pressure on buyers to know what they need before reaching out.

### Core Message

Different organizations need different starting points.

The work may begin with:

- leadership planning
- team activation
- facilitated working sessions
- enablement architecture
- advisory support

But these are not separate products.

They are doors into the same capability journey.

### Architectural Decision

This section should frame entry points as starting situations, not service categories.

The buyer should think:

> That sounds like our situation.

Not:

> Which product should I buy?

### Possible Entry Situations

Instead of only service labels, the page may frame entries around buyer states:

#### Leadership planning

For organizations where leaders need to decide what AI capability should mean, where to start, or what to prioritize.

#### Team activation

For teams that need confidence, shared practice, and practical experience using AI on real work.

#### Facilitated working sessions

For groups that need to solve a real problem, align around a workflow, or move from discussion into action.

#### Enablement architecture

For organizations that need repeatability, measurement, standards, and scalable adoption.

#### Advisory support

For leaders who need an outside thinking partner as AI capability, governance, and business priorities evolve.

### Design / Experience Direction

This section can use cards, but the card labels should not feel like a product menu.

Each card should feel like:

> Start here if this is your situation.

The cards should make the buyer feel oriented, not sorted.

### What It Should Make Buyers Feel

Operators / Executives:

> I do not need to know the exact solution before talking to Joe.

People / Learning / Community:

> This can start as the right kind of learning or group experience.

Innovation / Depth Buyers:

> This can begin as a strategic or system-design conversation, not just training.

### Supporting Insight

One of the biggest decisions from Phase 1:

Joe has one journey with multiple entry angles.

Different buyers may enter through different excitement, pain, or urgency, like different genres inside the same movie.

The site should not split those entry angles into separate service silos.

### Avoid

- Making entry points look like disconnected products
- Treating Facilitation and Advisory as separate service businesses
- Making AI Activation both the umbrella and one equal card without clarifying the relationship
- Forcing buyers to choose before they understand the journey
- Pricing or packaging too early

## Section 4 - How Capability Grows

### Section Question

> What happens after we start?

### Section Purpose

Show progression instead of deliverables.

This section should explain where the work leads over time.

### Core Message

Organizations are not buying isolated activities.

They are entering a capability journey.

The journey may look like:

> Planning -> Activation -> Capability -> Enablement -> Compounding

### Architectural Decision

This is not a sales funnel.

It is an organizational maturity journey.

The hero of this section is not Joe.

The hero is the organization becoming more capable.

### Capability Growth Logic

The page should show that the work can progress from:

- understanding the current situation
- activating people
- building practical capability
- creating shared standards and repeatable practices
- enabling the organization to measure and scale what works
- turning capability into compounding business value

### Design / Experience Direction

Use a progression visual.

It should feel like the organization is moving through stages of increasing capability.

Possible visual:

```text
Planning
-> Activation
-> Capability
-> Enablement
-> Compounding
```

The visual should not feel like a consulting funnel.

It should feel like capability maturity.

### What It Should Make Buyers Feel

Operators / Executives:

> Good. There is a path beyond the first session.

People / Learning / Community:

> Capability grows over time and can be reinforced.

Innovation / Depth Buyers:

> This is a maturity model, not a product catalog.

### Supporting Insight

This section exists because many buyers fear one-off workshops.

It should prove that activation is the beginning of a path, not the whole path.

### Avoid

- Making this about Joe's delivery sequence
- Making it look like a sales funnel
- Focusing on deliverables before growth
- Suggesting every client must follow the exact same path
- Treating the first session as the full product

## Section 5 - What Changes

### Section Question

> What changes if this works?

### Section Purpose

Name outcomes rather than deliverables.

This section should make the business and behavior impact tangible.

### Core Message

The output is not a workshop.

The output is a more capable organization.

### Practical Outcomes

This section should name practical changes such as:

- teams use AI with more confidence
- people apply AI to real work
- workflows improve
- standards become clearer
- leaders can see what is working
- good practices spread
- decision-making gets faster
- execution becomes less scattered
- duplication decreases
- AI usage connects to business priorities
- learning stays in the organization
- capability becomes easier to measure and reinforce

### Architectural Decision

This section should focus on changed behavior and operating improvement.

It should avoid generic transformation promises.

### Design / Experience Direction

This section can use concrete outcome cards, before/after comparisons, or practical proof moments.

It should feel grounded.

It should make the visitor think:

> I can imagine what would be different here after working with Joe.

### What It Should Make Buyers Feel

Operators / Executives:

> This can improve performance and execution.

People / Learning / Community:

> This creates real behavior change, not just enthusiasm.

Innovation / Depth Buyers:

> This turns experimentation into reusable capability.

### Supporting Insight

The buyer does not need a long list of deliverables.

They need to understand what will be different in the organization.

The strongest line to preserve conceptually:

> The output is a more capable organization, not a workshop.

### Evidence Opportunity

If public-safe proof is available, this section is a good place for:

- anonymized session output
- a sample artifact
- a small before/after example
- a practical use-case map
- an enablement signal example
- a facilitation artifact
- a short real-world pattern from client work

### Avoid

- Generic "transformation" language
- Big claims without evidence
- Listing deliverables as the main value
- Making outcomes too abstract
- Saying "innovation," "future-ready," or "AI-powered" without concrete meaning
- Letting this section be all assertion and no proof

## Section 6 - How We Start

### Section Question

> How do we start?

### Section Purpose

Reduce uncertainty around beginning the relationship.

This section should help the buyer feel comfortable reaching out even if they do not know which entry point is right.

### Core Message

You do not need to arrive with a finished plan.

The first step is an AI Activation Planning Call.

The purpose of the call is to understand:

- the organization
- current AI usage
- readiness
- business priorities
- team context
- where capability is stuck
- which starting point makes sense

### Architectural Decision

Services should end with a planning conversation, not a hard sell.

The page should make the first step feel useful in itself.

### Primary CTA

Book an AI Activation Planning Call.

### Secondary CTA

Optional secondary links may route to:

- Method
- AI Activation Playbook
- AI Enablement Architecture
- Contact Joe

But the primary action remains the planning call.

### Design / Experience Direction

The closing should feel calm, practical, and confident.

It should not introduce new content or another framework.

It should make action easy.

### What It Should Make Buyers Feel

Operators / Executives:

> I can talk to Joe before I have the whole solution figured out.

People / Learning / Community:

> We can design the right experience for our audience.

Innovation / Depth Buyers:

> This can become a serious design conversation, not a canned offering.

### Supporting Insight

The planning call matters because the Services page intentionally does not force buyers into predefined products.

The page says:

> We will determine the right place to begin together.

### Avoid

- Generic "contact us" language
- Pressure CTA
- Making the call feel like a sales trap
- Making buyers self-diagnose before reaching out
- Adding pricing too early
- Introducing new method content at the end

## Services-Level Supporting Insights

### Services Is a Journey, Not a Catalog

The most important page-level decision:

> Services should describe one organizational capability journey with multiple entry points.

This protects the site from becoming a list of consulting services.

### Different Buyers Enter Through Different Doors

A CEO may enter through leverage.

A COO may enter through consistency.

A People leader may enter through confidence and readiness.

An L&D leader may enter through behavior change.

An AI Enablement leader may enter through standards and measurement.

A Research / Innovation buyer may enter through systems and frontier practice.

They should all eventually recognize the same journey.

### The Services Page Should Not Over-Explain Method

Services should create commercial clarity.

Method creates deeper trust.

If Services over-explains the theory, it starts doing Method's job.

### AI Activation Should Feel Larger Than a Workshop

The page must repeatedly avoid making AI Activation sound like:

- a workshop
- a session
- a training
- a keynote
- a prompt class

It should feel like:

> the commercial path for building measurable organizational capability with AI.

### Entry Points Should Be Buyer Situations

Whenever possible, the page should frame entry points around what the buyer is experiencing.

Better:

> If your leaders need alignment...

Than:

> Leadership Planning

Better:

> If your team needs to get moving...

Than:

> Team Activation

Better:

> If scattered use needs to become repeatable...

Than:

> Enablement

### The Page Should Preserve Commercial Simplicity

Even though the underlying method is deep, Services should feel easy to understand.

The buyer should leave with:

- what the destination is
- what AI Activation means
- where they might begin
- how the work can grow
- what changes if it works
- how to start

### Services Should Avoid

- product catalog structure
- excessive methodology
- internal terminology
- too many service labels
- fixed package thinking
- pricing-first framing
- making the buyer feel underqualified to reach out
- turning Facilitation, Advisory, or Enablement into separate business silos

