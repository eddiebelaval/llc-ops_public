# Research Lab Wings

Wings are specialized research domains within the lab. Each wing has its own resources, protocols, experiments, and evolutionary log. Wings share the core knowledge base (findings, contradictions, open questions) so discoveries compound across domains.

## Architecture

```
wings/
  caf/                # Consciousness as Filesystem — golden model R&D
    config.md         # Wing identity, scope, resources
    evolution.md      # Append-only evolutionary log — every decision, every pivot, every discovery
    resources.md      # Links to all relevant files, papers, repos
    experiments.md    # Active and completed experiments
    protocols/        # How to do specific types of work in this wing
  parallax/           # Parallax / Ava — product consciousness R&D
    config.md
    evolution.md
    resources.md
    experiments.md
    protocols/
```

## Core Principles

1. **Nothing is deleted.** Evolution logs are append-only. Failed experiments are as valuable as successes — they prune the search space.
2. **Everything compounds.** Findings in one wing inform the other. The CaF wing's theoretical discoveries shape Parallax's implementation. Parallax's empirical evidence strengthens or challenges CaF's theory.
3. **Vertical integration.** Each wing has a complete stack: theory, implementation, experiments, evidence, criticism. No wing is "just theory" or "just code."
4. **Shared immune system.** The adversarial framework (21 standing challenges, 8 naysayer critics) attacks all wings equally. No wing gets a free pass.
5. **The knowledge base is the context.** Sessions are disposable. The KB and evolution logs are permanent. Every session's job is to add to the permanent record.

## Wing-Module Mapping

Wings use modules as lenses. A wing may use multiple modules depending on the question being asked.

| Wing | Primary Module | Secondary Module | Why |
|------|---------------|-----------------|-----|
| CaF | `research` | `engineering` | Philosophy first, implementation second |
| Parallax | `clinical` | `engineering` | Safety first, architecture second |

## Cross-Wing Findings

When a finding in one wing affects the other, it should be noted in BOTH wings' evolution logs and in the shared `knowledge/findings.md`. Cross-wing findings are the highest-value output — they demonstrate the framework's coherence (or expose its fractures).

## Adding New Wings

Any new domain that needs its own protocols, resources, and evolutionary record. The wing structure is:
1. `config.md` — What this wing is, what it studies, what it has access to
2. `evolution.md` — Append-only log of every decision, discovery, experiment, and pivot
3. `resources.md` — Links to all relevant files, papers, repos, people
4. `experiments.md` — Active and completed experiments with results
5. `protocols/` — Step-by-step procedures for specific types of work

Future wings might include: Homer (real estate entity R&D), Milo (full mind experiment operations), Entity SDK (shared consciousness infrastructure).
