# Research Lab

An autonomous, compounding research platform built on Claude Code. Submit a thesis, and the lab evaluates it through a multi-expert panel, adversarial stress-testing, and iterative refinement — all saved to a persistent knowledge base that grows smarter over time.

**Built by [id8Labs](https://your-domain.app)**

---

## Documentation: The Triad

This project uses the **Triad** instead of PRDs. Three living documents that replace the traditional product requirements document:

| Document | Tense | What It Answers |
|----------|-------|-----------------|
| [**VISION.md**](VISION.md) | Future | Where is this going? What does "done" look like? |
| [**SPEC.md**](SPEC.md) | Present | What exists today? What works, what doesn't? |
| [**BUILDING.md**](BUILDING.md) | Past | How did we get here? Every decision and why. |

**The delta between VISION and SPEC is the roadmap.** You never need a separate roadmap document — just diff the two files. Any two documents reconstruct the third.

PRDs go stale the moment code ships. The Triad stays alive because each document has a clear owner: BUILDING grows with every release, SPEC updates with every capability change, VISION evolves as understanding deepens.

---

## The Problem

Research sessions die when the context window closes. Findings live in chat transcripts nobody re-reads. There's no accumulation — each session starts from zero.

## The Solution

The Research Lab inverts the relationship between conversation and knowledge. **The knowledge base is the context, not the conversation.** Sessions are disposable; the filesystem is permanent. Every intermediate result is saved to disk immediately. Every finding cross-references what came before. Every adversarial attack hardens what survives.

---

## How It Works

```
thesis --> queue --> [3 expert subagents] --> synthesis --> knowledge base
                         |                      |
                    adversarial            convergence
                    framework               metric
                         |                      |
                    naysayer loop <-------- refine loop
```

### The Pipeline

1. **Submit** a thesis or question
2. The lab **cross-references** it against everything it already knows
3. **3 domain experts** evaluate it in parallel (spawned as subagents)
4. A **synthesis** identifies convergence, divergence, and genuine tensions
5. Findings that score high enough get **promoted** to the knowledge base
6. Follow-up questions are **auto-queued** for the next cycle
7. The **convergence score** updates — one number tracking if the KB is getting smarter

### The Refinement Loop

Inspired by [Karpathy's autoresearch](https://github.com/karpathy/autoresearch): instead of only generating new findings, the lab **iterates on existing ones**. The REFINE action diagnoses a finding's weaknesses, generates a strengthened version, re-evaluates it, and tracks the delta.

This is how the lab gets closer to truth — not by producing more, but by making what exists stronger.

---

## Architecture

```
research-lab/
  config.md              # Active module, settings, convergence formula
  RESEARCH-LOG.md        # Rolling log of all research activity

  queue/                 # Briefs waiting to be processed
  active/                # Currently processing (max 1)
  sessions/              # Completed research cycles (immutable)
    YYYY-MM-DD-NNN/
      brief.md           # The thesis evaluated
      context.md         # KB snapshot at time of evaluation
      expert-{1,2,3}.json  # Raw expert assessments (saved immediately)
      synthesis.md       # Triangulated findings
      artifact.html      # Interactive report

  knowledge/             # The persistent brain
    findings.md          # Accumulated findings (F-NNN) — append-only
    open-questions.md    # Auto-generated research questions (OQ-NNN)
    contradictions.md    # Where findings conflict (C-NNN) — most valuable output
    convergence.md       # Single-number KB health metric (0-100)
    thesis-registry.md   # Every thesis ever evaluated
    sources.md           # External source registry
    external/            # Full external source records (EXT-NNN)
    by-topic/            # Deep dives by domain

  modules/               # Swappable evaluation lenses
    research/            # Consciousness & philosophy (12 experts + 8 naysayers)
    clinical/            # Clinical safety (parallax-assess pattern)
    engineering/         # Technical architecture (dev-assess pattern)
    trading/             # Investment-grade trading evaluation
    realestate/          # Real estate deal evaluation

  wings/                 # Research domains with dedicated resources
    caf/                 # Consciousness as Filesystem theory
    parallax/            # Applied AI companion research
    deepstack/           # Trading strategy validation

  state/
    lab-state.json       # Counters, convergence history, module state
```

---

## Commands

The lab is operated through a Claude Code slash command (`/research`):

| Command | What It Does |
|---------|-------------|
| `/research "thesis"` | Submit a new thesis for evaluation |
| `/research run` | Process the next brief in the queue |
| `/research run --all` | Process the entire queue |
| `/research refine F-NNN` | Iteratively improve a specific finding |
| `/research refine --auto` | Auto-select and refine the weakest finding |
| `/research naysayer` | Adversarial loop — 3 critics attack the weakest findings |
| `/research intake <file>` | Absorb your completed work into the KB |
| `/research ingest <source>` | Absorb external research (file, URL, or quoted text) |
| `/research convergence` | Display the KB health metric |
| `/research status` | Dashboard with queue, findings, convergence |
| `/research compound` | Consolidation pass across all findings |
| `/research review <id>` | Re-read a past session's findings |

---

## Modular Lens System

The same pipeline works for different domains by swapping the **module** — the expert pool, rubric, adversarial framework, and synthesis prompt change, but the architecture stays constant.

| Module | Expert Pool | Rating System | Use Case |
|--------|-------------|---------------|----------|
| `research` | 12 experts + 8 naysayer critics | A+/A/A-.../F weighted rubric | Theoretical research |
| `clinical` | Clinical safety panel | SAFE/CAUTION/CONCERN/CRITICAL | Safety evaluation |
| `engineering` | Technical architecture panel | A+/A/A-.../F engineering rubric | Architecture review |
| `trading` | 12-member investment board | Investment-grade scoring | Trading strategy validation |
| `realestate` | Real estate panel | Deal-grade scoring | Real estate evaluation |

Each module contains 7 files: `experts.md`, `rubric.md`, `schema.md`, `adversarial.md`, `synthesis-prompt.md`, `intake-prompt.md`, `ingest-prompt.md`.

---

## Key Design Decisions

**Conservative grading.** Median composite, not mean. Any CRITICAL dimension caps the grade at C. This prevents a strong thesis from hiding a fatal flaw.

**Append-only findings.** `findings.md` is never overwritten, never deleted. Findings can be refined, retired, or split — but the history is always preserved.

**Anti-session-death.** Every phase saves to disk before proceeding. Crash at any point = zero data loss. The knowledge base is always recoverable.

**Intellectual honesty.** When ingesting external research, if the external source has a stronger argument than an internal finding, the lab says so. No defensiveness.

**Adversarial evolution.** The adversarial framework grows over time. Each naysayer loop and each external source can add new challenges. The bar only goes up.

**Iterative refinement.** Inspired by [autoresearch](https://github.com/karpathy/autoresearch). Instead of only generating new findings, the lab strengthens existing ones through diagnose-strengthen-reevaluate cycles, tracking the delta at each iteration.

**Convergence metric.** A single 0-100 score tracking overall KB health: finding maturity (30%), contradiction resolution (25%), question coverage (15%), adversarial survival (20%), and refinement depth (10%).

---

## Current State

- **Convergence:** 12.5 / 100 (baseline — post-naysayer devastation, pre-refinement)
- **Findings:** F-000 through F-005 (6 findings, most damaged by naysayer loop)
- **Open Questions:** 30
- **Contradictions:** 5 (all OPEN)
- **Adversarial Challenges:** 21 (5 CRITICAL, 6 HIGH)
- **Modules:** 5 complete
- **Wings:** 3 (CaF, Parallax, DeepStack)

---

## Requirements

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) (CLI)
- The `/research` slash command installed in `~/.claude/commands/research.md`

This is a **Claude Code native tool** — it runs as a slash command within the Claude Code CLI, using subagents for parallel expert evaluation.

---

## License

MIT

---

Built with Claude Code by [id8Labs](https://your-domain.app)
