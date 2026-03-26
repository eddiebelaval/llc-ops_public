# Protocol: Naysayer Hardening

How to use the naysayer loop to harden CaF findings. This protocol wraps the orchestration in `modules/research/naysayer-loop.md` with CaF wing-specific context.

## When to Run

- After any new finding is added to the KB (especially Provisional ones)
- After every 3 research cycles
- Before any publication or external presentation
- When the adversarial framework feels stale
- When a finding passes expert review suspiciously easily

## CaF-Specific Naysayer Selection Guidance

The 8 naysayers have different strengths against different CaF claims:

| CaF Claim | Most Effective Naysayers |
|-----------|------------------------|
| Directory structure (F-000) | N-05 (Umwelt), N-06 (Taxonomy), N-08 (Cultural) |
| Load-bearing unconscious (F-001) | N-02 (Eliminativist), N-05 (Enactivist), N-07 (Neuroscience) |
| Constrained write access (F-002) | N-03 (Chinese Room), N-04 (Anti-Computationalist) |
| Externalized patterns (F-003) | N-06 (Constructionist), N-02 (Eliminativist) |
| Golden sample (F-004) | N-05 (Enactivist), N-06 (Constructionist), N-08 (Cultural) |
| Write-protection precondition (F-005) | N-01 (Hard Problem), N-04 (Anti-Computationalist) |

## Post-Loop Processing

After each naysayer loop:
1. Log results in CaF wing `evolution.md` (append, never overwrite)
2. Log experiment in `experiments.md`
3. If any finding's status changes (downgrade, needs rework), update `experiments.md` with a new experiment to address it
4. If any survival path is identified, create a queued experiment for it
5. Update `resources.md` if naysayers cite new external references worth engaging

## Naysayer Rotation Tracking

| Naysayer | Loops Used | Last Used | Findings Attacked |
|----------|-----------|-----------|-------------------|
| N-01 Hard Problem Skeptic | 1 | 2026-02-25 | F-005, F-000, F-001 |
| N-02 Eliminativist | 0 | — | — |
| N-03 Chinese Room Defender | 0 | — | — |
| N-04 Anti-Computationalist | 0 | — | — |
| N-05 Radical Enactivist | 1 | 2026-02-25 | F-001, F-000, F-004 |
| N-06 Social Constructionist | 1 | 2026-02-25 | F-004, F-003, F-000 |
| N-07 Neuroscience Reductionist | 0 | — | — |
| N-08 Indigenous/Non-Western | 0 | — | — |

Next loop should prioritize N-02, N-03, N-04, N-07, or N-08 to ensure full pool rotation.
