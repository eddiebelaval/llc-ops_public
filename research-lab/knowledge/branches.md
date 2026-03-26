# Research Branches (DAG Tracker)

Tracks divergent investigation threads from existing findings. Inspired by AgentHub's DAG-first model: instead of linear session sequences, findings can branch into multiple parallel hypotheses that explore independently and reconverge at `/research compound`.

## Schema

Each branch entry:
- **Branch ID:** `B-NNN`
- **Parent Finding:** `F-NNN` (the finding being explored)
- **Hypothesis:** What this branch is testing
- **Status:** ACTIVE | CONVERGED | ABANDONED | MERGED
- **Sessions:** List of session IDs in this branch
- **Spawned:** Timestamp
- **Converged:** Timestamp (if merged back)

## Active Branches

(none yet)

## Completed Branches

(none yet)

## Branch Rules

1. Any finding with 2+ unresolved contradictions or naysayer attacks is a branch candidate.
2. Branches run independent `/research refine` cycles — they don't block each other.
3. `/research compound` is the reconvergence point — it reads all branch sessions and synthesizes.
4. A branch can spawn sub-branches (the DAG grows).
5. Abandoned branches are never deleted — they document dead ends (valuable signal).
6. When a branch produces a finding that strengthens the parent, it MERGES back.
7. When a branch reveals the parent finding was wrong, it triggers a RETIREMENT consideration.
