# BUILDING.md — How the Research Lab Got Here

> This is the past. The technical build log. Every feature shipped, every decision made, every lesson learned.

---

## The Triad

This project uses the **Triad** documentation system instead of traditional PRDs:

| Document | Tense | Purpose |
|----------|-------|---------|
| **VISION.md** | Future | Where this is going. The north star. |
| **SPEC.md** | Present | What exists today. Capabilities, limitations, architecture. |
| **BUILDING.md** | Past | How we got here. Every build decision and why. |

**The delta between VISION and SPEC is the roadmap.** You never need a separate roadmap document — just diff the two files. Any two documents reconstruct the third: if you know what was built (BUILDING) and what exists (SPEC), you can infer the vision. If you know the vision (VISION) and the history (BUILDING), you can infer the current state.

**Why not a PRD?** PRDs are static snapshots that go stale the moment code ships. The Triad is a living system — BUILDING grows with every release, SPEC updates with every capability change, VISION evolves as understanding deepens. The documents stay in sync because each one references the others.

---

## Origin Story

**Date:** February 25, 2026
**Trigger:** The Consciousness as Filesystem (CaF) research needed rigorous evaluation, not just writing. the user had published three parts of the CaF series but had no systematic way to stress-test the ideas. The pattern from Parallax's `/parallax-assess` (multi-expert panel evaluation) worked for product safety — why not for research claims?

**Insight:** Research sessions die when the context window closes. Findings live in chat transcripts nobody re-reads. There's no accumulation. The fix: make the knowledge base the context, not the conversation. Sessions are disposable; the filesystem is permanent.

**Three patterns fused:**
1. **Parallax-assess** — Multi-expert subagent panel (quality through triangulation)
2. **HYDRA** — Persistence-through-compression (nothing lives only in context)
3. **CaF research** — Knowledge structure (findings, contradictions, open questions)

---

## Build Log

### Feb 25, 2026 — Initial Build

**What was built:**
- Complete pipeline: queue -> expert evaluation -> synthesis -> KB update -> auto-requeue
- Research module with 12-expert pool and weighted rubric (A+/A/A-.../F)
- Knowledge base structure: findings.md, open-questions.md, contradictions.md, thesis-registry.md
- Anti-session-death protocol: every phase saves to disk before proceeding
- 6 seeded findings (F-000 through F-004 from CaF series, F-005 from first cycle)
- 7 seeded open questions (OQ-001 through OQ-007)

**First research cycle:**
- Thesis: "Constraint is constitutive of consciousness"
- Panel: Philosopher of Mind, Systems Theorist, Information Theorist
- Result: B+ (3.10) — reformulated from "constitutive" to "necessary precondition"
- 15 follow-up questions auto-queued
- Key insight: Information Theorist demanded mathematical formalization before advancing

**Architecture decision:** Conservative grading (median composite, not mean). This was deliberate — a strong thesis shouldn't be able to hide a fatal flaw behind high scores on other dimensions. Any CRITICAL dimension caps the grade at C.

### Feb 25, 2026 — First Naysayer Loop

**What was built:**
- Naysayer system: 8-critic pool with steel-manning requirement
- Adversarial framework grew from 10 standing challenges to 21
- 3 naysayers selected: Hard Problem Skeptic, Radical Enactivist, Social Constructionist

**Result: DEVASTATING.**
- 12 attacks total — 6 S-tier, 6 A-tier, 0 below A
- 11 novel challenges discovered (5 CRITICAL, 6 HIGH)
- 5 contradictions found (C-001 through C-005)
- 5 existing challenges deepened with real theoretical backing
- Strongest single objection: "The Zombie Filesystem" — framework cannot distinguish a conscious filesystem from a structurally identical non-conscious one

**Lesson learned:** The naysayer loop is the most valuable operation in the lab. It did more for the research in one session than months of affirmative analysis. The adversarial framework should only grow, never shrink.

**Strategic insight:** Multiple naysayers independently suggested "consciousness-traces" reframing and linguistic world-coupling (Di Paolo 2018) as viable survival paths. When your critics agree on a direction, that's signal.

### Mar 4, 2026 — Module Expansion

**What was built:**
- Clinical module (7 files) — Safety evaluation using parallax-assess pattern
- Engineering module (7 files) — Technical architecture evaluation using dev-assess pattern
- Wings system: CaF, Parallax, DeepStack — dedicated research domains with shared KB

**Architecture decision:** Modules are swappable lenses. Same pipeline, different expert pools and rubrics. This means the lab isn't just a consciousness research tool — it's a research tool that happens to be studying consciousness. New domain = new folder with 7 markdown files.

### Mar 9, 2026 — Trading & Real Estate Modules

**What was built:**
- Trading module (7 files) — Investment-grade trading system evaluation with 12-member board
- Real estate module (7 files) — Deal evaluation panel

**Architecture decision:** The module pattern proved its flexibility. Adding a completely unrelated domain (real estate deal evaluation) required zero pipeline changes — just a new expert pool, rubric, and adversarial framework.

### Mar 9, 2026 — Autoresearch-Inspired Enhancements

**Trigger:** the user saw [Karpathy's autoresearch](https://github.com/karpathy/autoresearch) — a framework where AI agents autonomously run ML training experiments overnight. The agent modifies code, runs a 5-minute experiment, measures validation loss, accepts or rejects, repeats ~100 times overnight.

**Insight:** The Research Lab was a pipeline (ideas in, findings out, new ideas generated). Autoresearch is a loop (same thing iterated until better). The lab had no mechanism to strengthen existing findings — only to generate new ones.

**What was built:**

1. **REFINE action** (`/research refine F-NNN`)
   - Diagnoses a finding's specific weaknesses (failed challenges, contradictions, low rubric dimensions)
   - Spawns a Research Strategist subagent to generate a strengthened version
   - Re-evaluates with the same expert domains, but focused on the DELTA
   - Tracks what improved, what didn't, what got worse
   - Findings can be STRENGTHENED, LIMITED, RETIRED, or SPLIT
   - Max 5 iterations before forced consolidation
   - Two consecutive REJECTs = retirement consideration

2. **Convergence metric** (`/research convergence`)
   - Single 0-100 score tracking KB health
   - Components: finding maturity (30%), contradiction resolution (25%), question coverage (15%), adversarial survival (20%), refinement depth (10%)
   - Baseline: 12.5/100 — low because the naysayer loop devastated every finding but nothing has been refined yet
   - Updated after every cycle

3. **Brief scope tiers** (NARROW / FOCUSED / BROAD)
   - Autoresearch's key lesson: constraints breed focus
   - Refinement cycles always NARROW or FOCUSED — never full rubric evaluation for an iterative improvement
   - Prevents session bloat

**Architecture decision:** The accept/reject binary signal was added alongside the rich rubric. This was directly from autoresearch — one number (val_bpb) decides accept/reject. The full rubric provides analysis, but the binary forces a decision.

### Mar 9, 2026 — Standalone Repository

**What happened:** The Research Lab was nested inside the id8 monorepo (`~/Development/id8/research-lab/`). It got its own repo at `github.com/your-username/research-lab` and was open-sourced.

**Why:** A research tool is its own thing, not a subfolder of a creative pipeline. It has its own identity, its own audience, its own growth trajectory. Open-sourcing lets the community use the tool pattern, contribute modules, and submit adversarial challenges.

**What was removed:** Homer real estate evaluation session (private business data). All consciousness research sessions, findings, and adversarial challenges remain — they're the working demo.

### Mar 10, 2026 — DAG Branching (AgentHub-Inspired)

**Trigger:** the user shared [Karpathy's AgentHub](https://github.com/karpathy/agenthub) — a collaboration platform for autonomous AI agents. No main branch, no PRs, no merges. Just a sprawling DAG of commits going in every direction, with a message board for coordination.

**Gap analysis:** The Research Lab ran sessions sequentially — `2026-02-25-001`, then `2026-02-25-002`. Linear. But research isn't linear. When the naysayer loop devastated F-000 through F-005, each damaged finding needed multiple independent investigation threads. Testing F-000 against embodied cognition and testing F-000 against IIT are parallel hypotheses, not sequential tasks. They should fork, run independently, and reconverge only when there's something to merge.

**What was built:**

1. **Branch system** (`/research branch F-NNN "hypothesis"`)
   - Forks a finding into a parallel investigation thread
   - Branch ID: `B-NNN` (sequential)
   - Session naming: `branch-B-NNN-YYYY-MM-DD-iter-N` (visually distinct from regular sessions)
   - Lifecycle: ACTIVE → MERGED | ABANDONED | CONVERGED
   - Branches can spawn sub-branches (the DAG grows)
   - Dead ends are never deleted — they document what doesn't work

2. **Branch tracker** (`knowledge/branches.md`)
   - Tracks all branches with parent finding, hypothesis, status, sessions, timestamps
   - Rules codified: any finding with 2+ unresolved contradictions is a branch candidate

3. **Integration with compound**
   - `/research compound` now reads all branch sessions during reconvergence
   - Branches that strengthen the parent → MERGE
   - Branches that disprove the parent → RETIREMENT consideration

**Architecture decision:** Branches live in the filesystem (session directories + branches.md tracker), not in a separate database. This follows the lab's core principle: the knowledge base IS the system. `lab-state.json` tracks branch counts for the status dashboard.

**What was NOT built:** A full AgentHub server. The patterns were extracted and implemented in existing infrastructure (filesystem + JSON state). Zero new dependencies. The lab doesn't need Go, doesn't need a message board, doesn't need API keys. It needed the DAG concept applied to its own domain.

**Same session — HYDRA Agent Board:** The second AgentHub pattern (agent message board) was deployed as a HYDRA feature, not a Research Lab feature. HYDRA agents can now post findings to a shared `agent_board` table, and other agents read them. This replaced hub-and-spoke (everything through the user) with lateral coordination. The morning planner now reads what agents discovered overnight. First post on the board: Anna signed up for Parallax — first real customer.

---

## Patterns Discovered

### The Pipeline-Loop Duality
A research system needs both:
- **Pipeline mode** (`/research run`): generate new findings, expand what the KB knows
- **Loop mode** (`/research refine`): strengthen existing findings, harden what the KB believes

The convergence score tells you which mode to use. Low convergence = too many open wounds, refine first. High convergence = ready for new territory, run the queue.

### Adversarial Frameworks Only Grow
Every naysayer loop, every external source ingested, every failed challenge — they all add to the adversarial framework. The bar only goes up. This is by design: the lab should get harder to impress over time, not easier.

### Findings as Append-Only Log
`findings.md` is never overwritten. Findings can be refined (updated with new versions), retired (marked as withdrawn with reason), or split (broken into sub-claims). But the history is always preserved. This means you can trace any finding back to its origin and see every refinement attempt.

### Anti-Session-Death as Architecture
Saving every intermediate result to disk isn't just crash protection — it's the architecture. The knowledge base IS the system. Conversations are just temporary interfaces to it.

### DAG Over Sequence
Linear session ordering (001, 002, 003...) creates a false sense of progression. Research branches. A finding under attack needs multiple parallel hypotheses tested simultaneously, not one after another. The DAG model (from AgentHub) made this explicit: fork, explore independently, reconverge only when there's evidence worth merging. Dead-end branches are preserved because knowing what doesn't work is itself a finding.

---

## Stats

| Metric | Value |
|--------|-------|
| First commit | Feb 25, 2026 |
| Open-sourced | Mar 9, 2026 |
| Research cycles completed | 2 |
| Naysayer loops completed | 1 |
| Findings | 6 (F-000 through F-005) |
| Open questions | 30 |
| Contradictions | 5 (all OPEN) |
| Adversarial challenges | 21 (5 CRITICAL, 6 HIGH) |
| Modules | 5 (research, clinical, engineering, trading, realestate) |
| Wings | 3 (CaF, Parallax, DeepStack) |
| Convergence | 12.5 / 100 |
| Branches | 0 (infrastructure built Mar 10) |
| Refinement cycles | 0 (built, not yet run) |
