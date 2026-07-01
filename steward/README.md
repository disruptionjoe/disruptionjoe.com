# Disruptionjoe.com Steward Context

Status: active, public-site guarded. Canonical steward load file adopted 2026-07-01 from the CapacityOS Repo Steward reference architecture.

Load this file when stewardship context is needed for the public website. Do not load `steward/memory-log.md` by default unless doing stewardship or memory work, or this summary appears incomplete.

## North Star

Make disruptionjoe.com a clear, credible public surface for Disruption Joe's work without leaking private methodology, client material, or unfinished internal operating system machinery.

Change rule: do not change this North Star without very explicit conversation with Joe.

## Long-Term Objectives

- Keep the site accurate, inspectable, and aligned with Joe's current public positioning.
- Preserve a clean separation between public copy and private consulting methodology.
- Keep deployment/publishing actions explicit and governed.

## Measures And Countermeasures

Measures:

- Public pages load correctly and communicate the intended offer.
- Assets, routing, metadata, and analytics stay coherent.
- Site changes can be verified locally before any public push/deploy.

Countermeasures / risks:

- Do not publish private methodology or client-derived material.
- Do not push/deploy accidentally.
- Do not let generated marketing copy overclaim.
- Do not treat website work as CapacityOS architecture.

## What This Repo Owns

This repo owns public website source, static assets, routing, page copy, metadata, scripts, and deployment configuration for disruptionjoe.com.

## What This Repo Must Not Absorb

- Private AI Activations Playbook methodology.
- Client work or raw client data.
- JoeOps coordination state.
- CapacityOS implementation truth.

## Operating Guardrails

- Pushing this repo may deploy publicly; deployment/publishing requires explicit Joe authorization.
- Public copy changes should be inspectable and verifiable.
- Secrets do not belong here.
- Client-derived material must be sanitized and explicitly approved before becoming public site content.
- External integrations, analytics, contact forms, and deploy settings pause for Joe.

## Routing

- Private methodology routes to `C:\Users\joe\JB\consulting\AI-Activations-Playbook`.
- CapacityOS architecture routes to `C:\Users\joe\JB\CapacityOS`.
- JoeOps coordination routes to `C:\Users\joe\JB\Github Repos\joeops`.
- Durable site artifacts belong in `C:\Users\joe\JB\library\repos\public\disruptionjoe.com\` when mirrored.
- Scratch belongs in `_local/` or existing ignored temp folders.

## Candidate Decisions

- Site steward package is local-only until Joe explicitly authorizes any push that might deploy.

## Durable Decisions

- The site is public.
- Push/deploy is an external-consequence action.
- Private methodology and client material stay out of the public site unless explicitly approved.

## Principles

- Public credibility beats hype.
- Verify locally before publishing.
- Keep public, private, and operating-system surfaces separate.

## Memory Log

Chronological memory lives at `steward/memory-log.md`. Append useful memory after sessions where this README is loaded.

Lightweight upward-learning pointer: method/workflow-module learnings go to `CapacityOS/system/rccm-learnings/`; kernel-primitive learnings go to `CapacityOS/system/kernel-learnings/`.

## Automation Hooks

Local verification automation is allowed when scoped to local checks. Pushing, deployment, posting, analytics changes, form submissions, or third-party writes require explicit Joe authorization.

## Local Source References

- `README.md` if added later
- `package.json`
- `vercel.json`
- `index.html`
- `services.html`
- `about.html`
