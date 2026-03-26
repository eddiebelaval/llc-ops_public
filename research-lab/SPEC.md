---
last-reconciled: 2026-03-10
status: CURRENT
Build stage: Stage 8
Drift status: CURRENT
vision-alignment: 30%
---

# SPEC

## Identity

The Research Lab is a Claude Code-native research platform that operates as a slash command (`/research`) orchestrating subagents to evaluate theses through multi-expert panels, adversarial stress-testing, and iterative refinement. All state persists to the filesystem. The knowledge base accumulates across sessions. No database, no server. Runtime is Claude Code CLI (Opus-tier model for subagent orchestration).

## Current Capabilities

### 1. Core Pipeline

- **Thesis submission:** `/research "thesis"` queues a brief for evaluation.
- **Queue processing:** `/research run` processes the next queued brief. `/research run --all` processes all.
- **Naysayer loop:** `/research naysayer` runs adversarial stress-testing with 8-critic pool and steel-manning requirement. 1 loop completed.
- **Self-intake:** `/research intake <file>` ingests the lab's own work as research input.
- **External ingestion:** `/research ingest <source>` ingests external sources into the knowledge base.
- **Session review:** `/research review <id>` reviews a completed research cycle.
- **Status dashboard:** `/research status` shows current lab state, convergence, queue depth.

### 2. Refinement and Branching

- **Finding refinement:** `/research refine F-NNN` targets a specific finding for iterative improvement. Built Mar 9, untested.
- **Auto-refinement:** `/research refine --auto` selects the weakest finding and refines it. Built Mar 9, untested.
- **DAG branching:** `/research branch F-NNN "hypothesis"` forks a finding into parallel hypotheses. Built Mar 10, untested.
- **Branch viewer:** `/research branches` shows the branch graph. Built Mar 10.
- **Convergence score:** `/research convergence` calculates and displays the 0-100 convergence metric. Baseline: 12.5.
- **Compounding:** `/research compound` synthesizes findings across the knowledge base.

### 3. Expert Modules (5)

- **Research module** (10 files): 12 experts + 8 naysayers. Complete, battle-tested with CaF domain.
- **Clinical module** (7 files): Clinical safety panel. Complete.
- **Engineering module** (7 files): Technical architecture panel. Complete.
- **Trading module** (7 files): 12-member investment board. Complete, 1 round run.
- **Real estate module** (7 files): Deal evaluation panel. Complete, 1 round run.

### 4. Research Wings (3)

- **CaF wing** (research module): 6 queued experiments (EXP-CAF-001 through 006). Active.
- **Parallax wing** (clinical module): 5 queued experiments (EXP-PAR-001 through 005). Active.
- **DeepStack wing** (trading module): 11 queued trading briefs. Active.

### 5. Knowledge Base

- **Findings:** 6 (F-000 through F-005). Most damaged by naysayer loop.
- **Open questions:** 30 (OQ-001 through OQ-030). 0 answered.
- **Contradictions:** 5 (C-001 through C-005). All OPEN.
- **Adversarial challenges:** 21 (10 original + 11 from naysayer). 5 CRITICAL, 6 HIGH.
- **External sources:** 0 ingested.
- **Branches:** 0 (infrastructure built, none spawned).
- **Convergence score:** 12.5 / 100 (baseline).

### 6. Anti-Session-Death Protocol

- Every phase saves to disk before proceeding.
- Crash during expert evaluation: re-spawn only missing experts from saved JSONs.
- Crash during synthesis: re-run from saved expert JSONs.
- Crash during KB update: re-run from saved synthesis.
- Crash during artifact generation: re-generate from saved synthesis.

## Architecture Contract

### Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Runtime | Claude Code CLI | Requires Opus-tier model for subagent orchestration |
| State | Markdown + JSON on disk | No database, no server |
| Orchestration | `/research` slash command | `~/.claude/commands/research.md` |
| Version control | Git | KB history preserved |

### System Role

The Research Lab is a standalone research instrument that runs inside Claude Code. It connects to HYDRA for future scheduling and to product repos for self-intake. Nothing depends on it. It depends on Claude Code's subagent capability.

### Primary Actors

- `the user` -- submits theses, reviews findings, directs research priorities
- `Expert subagents` -- evaluate theses against module-specific rubrics (3 per cycle)
- `Naysayer subagents` -- adversarial critics selected from 8-member pool
- `HYDRA` -- future scheduling integration for overnight autonomy

### Data Flow

```
/research command
    |
    v
Route by argument --> SUBMIT | RUN | REFINE | NAYSAYER | INTAKE | INGEST | ...
    |
    v
Phase pipeline (each phase saves to disk before next):
    Setup --> Gather Context --> Select Experts --> Spawn 3 Subagents (parallel)
    --> Save JSONs --> Synthesize --> Update KB --> Generate Artifact --> Auto-Requeue
    |
    v
Knowledge Base (persistent filesystem):
    findings.md | open-questions.md | contradictions.md | convergence.md
    |
    v
Convergence metric (0-100, recalculated after every cycle)
```

### Core Entities

| Entity | Purpose | Key Fields |
|--------|---------|------------|
| Finding | A research conclusion that survived expert evaluation | ID (F-NNN), thesis, grade, status (emerging/developing/established/retired), iteration count |
| Open Question | An unresolved research question generated by expert panels | ID (OQ-NNN), question text, source finding, status |
| Contradiction | A conflict between two findings or a finding and external evidence | ID (C-NNN), finding refs, status (OPEN/RESOLVED) |
| Adversarial Challenge | An attack on a finding from the naysayer pool | Severity (CRITICAL/HIGH/MEDIUM), source critic, target finding |
| Brief | A queued thesis with key questions and adversarial priorities | Thesis text, scope tier (NARROW/FOCUSED/BROAD), module |
| Session | A completed research cycle with expert JSONs and synthesis | ID, brief ref, expert outputs, synthesis, timestamp |

### Integrations

| Service | Purpose | Status |
|---------|---------|--------|
| Claude Code subagents | Expert and naysayer evaluation | Active |
| Git | KB version history | Active |
| HYDRA | Overnight scheduling | Planned |
| Semantic Scholar / arXiv | Automated literature review | Planned |

## Current Boundaries

- Does NOT run code experiments. Evaluates arguments only.
- Does NOT operate autonomously. Requires active Claude Code session.
- Does NOT search academic databases. External sources must be manually provided.
- Does NOT support multiple users. Single-operator, no access control.
- Does NOT visualize the finding relationship graph. Data exists but no rendering layer.
- Does NOT track finding trajectories over time. Iteration count exists but no time-series analysis.
- Does NOT have a tested refinement loop. Built Mar 9, baseline convergence calculated, but no finding has been through it.

## Verification Surface

### Core Pipeline
- [ ] `/research "thesis"` creates a brief in `queue/`
- [ ] `/research run` processes next brief, saves expert JSONs, updates KB
- [ ] `/research naysayer` runs adversarial loop with steel-manning
- [ ] `/research status` shows convergence, queue depth, finding count

### Knowledge Base
- [ ] `knowledge/findings.md` contains 6 findings (F-000 through F-005)
- [ ] `knowledge/open-questions.md` contains 30 open questions
- [ ] `knowledge/contradictions.md` contains 5 contradictions (all OPEN)
- [ ] `knowledge/convergence.md` shows baseline score of 12.5

### Modules
- [ ] 5 modules exist with correct file counts (research: 10, others: 7 each)
- [ ] Each module has a valid `schema.md` that expert JSONs validate against

### Infrastructure
- [ ] Anti-session-death: each pipeline phase persists before proceeding
- [ ] State file `state/lab-state.json` tracks counters and convergence history

## Design Decisions

| Decision | Choice | Why |
|----------|--------|-----|
| Grading | Median composite, not mean | Prevents strong dimensions from hiding fatal flaws |
| Promotion threshold | A-range (>= 3.5) = Established | High bar for knowledge base entry |
| CRITICAL cap | Any CRITICAL dimension caps grade at C | One fatal flaw fails the whole thesis |
| Expert count | Always 3 | Triangulation minimum; more adds noise without signal |
| Findings persistence | Append-only, never delete | History is evidence; retirement is a finding, not deletion |
| Refinement depth | Max 5 iterations per finding | Prevents diminishing-returns grinding |
| Scope tiers | NARROW / FOCUSED / BROAD | Constraints breed focus (autoresearch lesson) |
| Accept/reject signal | Binary alongside full rubric | Forces clarity; rich data for analysis, simple signal for decisions |
| Branch exploration | DAG over linear | Findings fork into parallel hypotheses; reconverge at compound |
| Dead-end preservation | Never delete abandoned branches | Knowing what does not work is itself a finding |

## Drift Log

| Date | Section | What Changed | Why | VISION Impact |
|------|---------|-------------|-----|---------------|
| 2026-02-25 | All | Initial spec written | First build day, pipeline operational | Aligned |
| 2026-02-25 | KB, Capabilities | Naysayer loop completed, 21 adversarial challenges | First adversarial cycle devastated existing findings | Validated: adversarial framework is the primary value driver |
| 2026-03-04 | Modules | Clinical + Engineering modules added | Module pattern proven extensible | Aligned: multi-domain intelligence pillar progressed |
| 2026-03-09 | Capabilities | Trading + Real Estate modules, refine + convergence commands | Autoresearch inspiration, iteration loop needed | Aligned: refinement vision now has infrastructure |
| 2026-03-10 | Capabilities | DAG branching, branch viewer | Linear refinement insufficient for branching theories | Aligned: source graph pillar partially addressed |
