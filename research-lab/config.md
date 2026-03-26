# Research Lab Configuration

## Active Module
`research`

Modules are swappable lenses. The pipeline stays the same — queue, gather, analyze, synthesize, compound — but the experts, rubric, schema, and adversarial framework change depending on the module.

## Available Modules

| Module | Path | Purpose |
|--------|------|---------|
| `research` | `modules/research/` | Consciousness & philosophy research (default) |
| `clinical` | `modules/clinical/` | Clinical safety evaluation (parallax-assess pattern) |
| `engineering` | `modules/engineering/` | Technical architecture evaluation (dev-assess pattern) |
| `trading` | `modules/trading/` | Investment-grade trading system evaluation (12-member board) |
| `realestate` | `modules/realestate/` | Real estate deal evaluation |

## Paths
- **Queue:** `queue/`
- **Active:** `active/`
- **Sessions:** `sessions/`
- **Knowledge Base:** `knowledge/`
- **Artifacts:** `artifacts/` (HTML reports)
- **State:** `state/lab-state.json`

## Wings

Research domains with their own resources, protocols, experiments, and evolution logs. Shared KB.

| Wing | Path | Scope | Primary Module |
|------|------|-------|---------------|
| **CaF** | `wings/caf/` | Golden model (Milo), consciousness theory, adversarial hardening, formalization | `research` |
| **Parallax** | `wings/parallax/` | Ava consciousness files, Shadow Engine, clinical safety, applied experiments | `clinical` |
| **DeepStack** | `wings/deepstack/` | Kalshi trading bot, strategy validation, risk management, performance attribution | `trading` |

Wing docs: `wings/README.md`

## Settings
- **Experts per cycle:** 3 (always)
- **Max queue depth:** No limit
- **Auto-requeue follow-ups:** Yes
- **Autonomous mode:** Enabled (processes queue + generates follow-up questions)
- **Artifact format:** Factory-Inspired interactive HTML

## Iteration Settings (inspired by autoresearch)
- **Max refinement depth:** 5 iterations per finding before forced consolidation
- **Brief scope budget:** Each brief must declare a scope tier (NARROW / FOCUSED / BROAD)
  - NARROW: 1 dimension, 1 adversarial challenge, tightest possible evaluation
  - FOCUSED: 2-3 dimensions, 2-3 challenges (default)
  - BROAD: Full rubric, all relevant challenges (only for initial evaluations or consolidation)
- **Accept/reject signal:** Every evaluation produces a binary ACCEPT (>= 3.2) or REJECT (< 3.2) alongside the full rubric. This forces clarity.
- **Delta tracking:** Refinement sessions track what changed between iterations — the diff is as important as the grade.

## Convergence Metric

A single composite score (0-100) tracking KB health. Updated after every cycle.

```
convergence = (
  (established_findings / total_findings) * 30 +     # Finding maturity
  (resolved_contradictions / total_contradictions) * 25 +  # Tension resolution
  (answered_questions / total_questions) * 15 +       # Question coverage
  (adversarial_survival_rate) * 20 +                  # Hardness of findings
  (avg_finding_iteration_depth / max_iteration_depth) * 10  # Refinement depth
)
```

This is the lab's val_bpb equivalent. Lower convergence = more work needed. The number should go UP over time as findings get established, contradictions get resolved, and adversarial challenges get survived.

## Design Tokens (Factory-Inspired)
```
--bg: #020202
--text: #eeeeee
--orange: #ef6f2e
--amber: #f59e0b
--teal: #4ecdc4
--font: Geist, system-ui, sans-serif
--mono: Geist Mono, monospace
```
