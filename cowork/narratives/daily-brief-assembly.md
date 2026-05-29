# Daily Brief Assembly

A workflow narrative for the Show the System in Motion section of the Claude CoWork proof page. This document drives the explainer video and supporting screenshots. Joe to refine before the video script locks.

## Inputs

- Calendar entries for the day (Google Calendar through the CoWork Calendar connector).
- Recent inbox activity (Gmail through the CoWork Gmail connector), filtered to threads that affect the day's meetings or open commitments.
- Drive documents Joe touched in the previous 24 hours.
- State files from CapacityOS that record what was locked the night before, what's pending, what's blocked, and what the next moves are by lane.
- Joe's standing configuration: tone, security policy, brand voice, and routing rules expressed once in CLAUDE.md and applied across every run.

## Process

1. A scheduled run fires at the start of Joe's working window. The agent does not wait for a prompt.
2. The agent reads CapacityOS state first to understand what's already locked and what's pending. It does not start from zero.
3. The agent pulls today's calendar, scans inbox threads tied to today's people and topics, and surfaces drive documents from yesterday that affect today.
4. The agent assembles a single one-page brief: today's meetings with named context, inbox items requiring action, carry-over items from yesterday, and a short prioritization note based on the lanes Joe is actively driving.
5. The brief is written into the daily working doc location. The agent does not publish anywhere external. Joe always reviews before acting.
6. The same skill runs every morning. The brief never has to be built from scratch.

## Outputs

- One scannable brief that takes about two minutes to read.
- A persistent record of what the agent prepared, kept inside CapacityOS, so the next round can reference it.
- A reusable skill saved with the rest of Joe's skill library, available on demand for other context windows (executive briefings, prospect prep, client reviews).

## Why it matters

The point is not the brief itself. The point is the workflow that generates the next brief without starting over. Once this pattern is structured as a skill, it can be templated for executive briefings, meeting preparation, prospect research, client reviews, and role-specific operating briefs. The same shape, run against different inputs.

A brief produced from a one-off chat dies with the conversation. A brief produced from a skill compounds. Every time it runs, the workflow improves and the cost of the next brief drops.

## Before / After (mirrors the on-page summary)

- **Before.** Multiple tabs, scattered context, manual review, incomplete picture.
- **After.** One briefing generated from the relevant context, ready for review and action.

## Supporting screenshots needed

To be captured by Joe at the desk and dropped into `cowork/assets/`:

- Inputs view: the calendar plus an inbox surface showing the raw material the agent reads from.
- Workflow view: CapacityOS running the daily brief skill, mid-execution.
- Outputs view: the rendered daily brief, scrollable.
- End state: the saved daily-doc file, plus a glimpse of the skill in Joe's skill library so it's clear this is reusable, not one-off.
