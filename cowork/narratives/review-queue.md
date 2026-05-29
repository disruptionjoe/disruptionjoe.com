# Human-in-the-Loop Review Queue

A workflow narrative for the Show the System in Motion section of the Claude CoWork proof page. This document drives the explainer video and supporting screenshots. Joe to refine before the video script locks.

## Queue formation

The queue is not a static list. It forms continuously as work moves through CapacityOS. Several sources feed it:

- New intake distilled from inbox captures, voice notes, and ad-hoc additions.
- Work cards whose state has changed since the last review (something landed, something unblocked, something needs a decision).
- Cards the agent could not advance autonomously because a Joe decision is required.
- Cards whose review reason is now satisfied and ready for closure.

The system filters and ranks the queue before Joe sees it. Closed items do not resurface. Items Joe rejected in a prior session are suppressed. The queue Joe walks is the queue that genuinely owes a human decision now.

## Recommendation generation

For each card in the surfaced queue, the agent prepares a decision packet in about 120 plain-English characters:

- A short framing of what the card is and what changed.
- A directional recommendation (Run, Nudge, Skip, Close, Keep) with reasoning grounded in the card's history.
- A small set of lettered options. A is always agree-with-the-recommendation. B and C are clean alternatives.

The packet is built from card history, recent activity, and the lane's current operating pressure. Joe does not have to remember what the card is about.

## Human decision points

Joe walks the queue one card at a time, voice or keyboard. For each card he picks a letter. The system applies the resulting action and routes the card forward.

The decisions Joe owns are always the consequential ones: what gets opened, what gets closed, what gets dispatched, what gets parked, when a card is ready to ship. The agent never makes those decisions. It only makes them faster to make.

## Resulting workflow movement

After Joe's decision, the system:

- Updates the card's stage, sub-stage, next-actor, and any review-reason fields.
- Cascades the change to runtime indexes (state summary, dashboard, session handoff) so the next round starts from accurate truth.
- Logs an advancement receipt so the move is auditable later.
- Surfaces the next card in the queue.

A 30-minute manual triage compresses into about three minutes of Joe-time. Nothing about the decision quality changes. Only the friction around making the decision drops.

## Outputs

- A queue that drops in real time as Joe walks it.
- Persistent state updates across the system that hold until the next review.
- An audit trail (advancement receipts) that lets later passes reconstruct what was decided and why.

## Why it matters

The point is not automation. The point is reducing friction around decision making. Joe stays the only person who can make the consequential calls. The system removes the cost of context-loading, framing, and routing so the call itself takes less of Joe's attention.

The pattern generalizes. The same surface-rank-recommend-decide shape applies to any operational queue: inbox triage, pool admissions, dispatch decisions, weekly content reviews, prospect follow-up calls.

## Before / After (mirrors the on-page summary)

- **Before.** Work accumulates in lists, inboxes, and notes.
- **After.** The system prepares recommendations and Joe decides what moves forward.

## Supporting screenshots needed

To be captured by Joe at the desk and dropped into `cowork/assets/`:

- Queue formation view: a snapshot of the surfaced queue at start of a session.
- Recommendation view: a per-card decision packet with the recommendation and lettered options visible.
- Decision moment: Joe's voice or keyboard input picking an option.
- End state: the same queue 3 minutes later with most items moved, plus the advancement-receipts log showing what happened.
