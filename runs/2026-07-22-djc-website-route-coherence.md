# DJC Website route coherence

Status: complete

CapacityOS Run: `RUN-20260722-djc-website-route-coherence`

Parent Run: `none`

Coordination evidence:
`repos/private/system-operations/runs/2026-07-22-instruction-route-and-activation-coherence.md`

Formal phase: `stewardship`

Workflow: `system-runtime#repo-stewardship-run`

Workflow revision:
`sha256:d03d3dd14dc3014f662249e30f18e433e9f2680e4074ccf53f1a1d361b42224d`

Mode: `execute`

Lane: `A`

Method refs: `[]`

Starting revision: `6265b90`

Write boundary: the live mailbox pointer in `AGENTS.md` and this Plan/receipt.

Resume capsule: Correct the website's current proposal mailbox pointer to
direct System Runtime transport. Preserve mailbox-only/manual posture and every
publication/deployment gate.

Collision check: clean/even at `6265b90`; writer lock absent.

Result: Replaced the retired mailbox route with the direct Runtime owner mailbox.
Scoped route checks passed. Publication is the commit containing this receipt.
