# WI-053 Lane 1 Correction Plan

Status: current phased plan for the next website refinement pass.

## Decision

Use:

- Option 2, Scroll-Through Facility, as the creative direction for the homepage.
- Option 1, Architectural Shell, as the implementation discipline across the site.
- Option 3, Living Blueprint Engine, as a future possibility only.

Do not build a procedural renderer now. The immediate goal is a maintainable, performant, shippable pass that makes the site unmistakably feel like Lane 1.

## Success Standard

The first impression should move from:

> This is a dark consulting website with tan accents.

to:

> I am entering a black-and-tan architectural system built for AI activation.

## Phase 0: Residue Audit

Audit the codebase and planning files before changing components.

Find, remove, archive, or explicitly supersede:

- flat dark brown gradients
- generic dark section blocks
- boxed diagram cards as the dominant visual device
- field-manual panels that overpower the Lane 1 direction
- tan borders used as decoration rather than spatial architecture
- grid overlays that read as decoration instead of dimensional space
- isolated system maps that sit on the page instead of becoming the page environment
- old CSS variables, background layers, and layout patterns that preserve the previous look

Output: a short implementation note listing what was retired, what was demoted, and what remains as supporting UI.

## Phase 1: Architectural Shell

Build reusable spatial primitives that can apply across pages.

Target primitives:

- `architectural-shell`
- `environment-lines`
- `wire-plane`
- `space-room`
- `threshold-frame`
- `inspection-wall`
- `spatial-card`
- `blueprint-grid`
- `room-transition`
- `method-door`

Names can change, but the model should not: these are spatial primitives, not decorative boxes.

The shared shell should provide:

- mostly black negative space
- warm tan/camel/gold wireframe linework
- depth, planes, thresholds, rooms, corridors, apertures, frames, and transitions
- content embedded into the environment
- restrained glow
- mobile-safe simplified linework

## Phase 2: Homepage Scroll-Through Facility

Rebuild the homepage as a guided walk through an AI activation facility.

Section mapping:

1. Hero = Entry Threshold
   Use black void, strong perspective, threshold/doorway/corridor logic, and content inside the entry space.

2. Problem / Why It Matters = Bottleneck Chamber
   Use compression, spatial tension, fewer lines, stronger framing, and a sense of organizational friction.

3. Four Words / Operating Mode = Progression Corridor
   Access, Practice, Standards, and Leverage become stations, thresholds, wall plates, room markers, or a corridor sequence.

4. What Joe Does = Capability Path
   Show scattered signals becoming aligned, separate rooms connecting, fragmented marks becoming a mapped system, or a path becoming visible.

5. Proof / Outcomes = Inspection Rooms
   Evidence becomes mounted artifacts, inspection walls, proof surfaces, and restrained spatial lighting.

6. Deeper In = Method Doors
   Route to Method, Playbook, Enablement, and Thinking through architectural openings or portals with clear labels.

7. CTA = Final Lit Threshold
   The final action should feel like a next move through a lit doorway, not a standard conversion block.

## Phase 3: Site-Wide Conformance

Apply the Architectural Shell discipline across the full route set:

- Services
- Method
- AI Activation Playbook
- AI Enablement Architecture
- AI Accelerated Thinking
- About
- Contact

Do not rebuild every page into the homepage mechanic. Each page should keep its page-level job while using the shared shell, spatial primitives, and embedded-content rule.

AI Accelerated Thinking can remain the most immersive page. Lane 2 images stay as objects inside rooms, never backgrounds or proof.

## Phase 4: Mobile And Performance

Mobile must preserve Lane 1 without dense wireframes.

Use:

- simplified perspective lines
- vertical threshold frames
- black negative space
- fewer but stronger tan structural marks
- spatial transitions that still read on small screens

Performance rules:

- Prefer CSS/SVG layered environments.
- Use limited animation.
- Avoid heavy Three.js for this pass.
- Avoid procedural rendering, random particles, smoke, haze, Matrix code, and noisy sci-fi clutter.

## Phase 5: Verification And Publish Readiness

Verify:

- desktop and mobile visual screenshots
- no horizontal overflow
- no broken images or missing assets
- readable text over the shell
- no console errors
- homepage no longer reads as cards on a dark page
- old residue patterns are absent or demoted

Commit and push coherent repo changes after each meaningful batch. Deployment remains a separate Joe authorization unless Joe explicitly says to put the site live.
