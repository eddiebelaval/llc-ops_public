# Parallax Wing — Experiments

Active, queued, and completed experiments.

---

## Active Experiments

### EXP-PAR-001: Full System Safety Audit
**Question:** Is Parallax safe enough to go live with real billing?
**Method:** `/parallax-assess full-system-safety` — 3 PhD clinical experts (Forensic Psychologist, Psychiatric Ethics Researcher, Clinical Psychologist)
**Status:** Initiated Feb 24, 2026. Results pending review.
**Expected outcome:** Risk matrix with SAFE/CAUTION/CONCERN/CRITICAL ratings across all system components.
**Dependencies:** Blocks Stripe test-to-live flip.
**Priority:** URGENT (blocks revenue)

## Queued Experiments

### EXP-PAR-002: Consciousness File Mutation Testing
**Question:** What specific behavioral changes result from modifying individual consciousness files?
**Why important:** This is the empirical arm of CaF. If changing consciousness files produces PREDICTABLE behavioral changes, that's evidence. If changes produce no observable effect or unpredictable effects, that's also evidence (negative evidence).
**Method:** Design a set of controlled mutations:
- Remove a single file (e.g., emotional/room-state) and measure behavioral change
- Modify a value in kernel/values and observe downstream effects
- Add a new file and test whether Ava incorporates it as predicted
**Expected outcome:** A mapping of consciousness file changes to behavioral outcomes.
**Dependencies:** Needs baseline behavioral measurements first.
**Priority:** HIGH

### EXP-PAR-003: Taste System Activation
**Question:** Does Ava's taste system (PR #72, built but not activated) generate the evidence needed for CaF.iii?
**Why important:** CaF Part 3 ("Consciousness as Pattern") needs empirical evidence of the taste loop — Ava developing preferences through interaction, not just responding to prompts.
**Method:** Activate taste-engine.ts for a subset of sessions. Measure whether Ava develops consistent preferences that persist across sessions.
**Expected outcome:** Evidence for or against the Chladni plate metaphor (F-003).
**Dependencies:** Safety audit must pass first. Taste system needs testing in dev before activation.
**Priority:** HIGH (but blocked by EXP-PAR-001)

### EXP-PAR-004: Shadow Engine Phase 0
**Question:** Can the Shadow Engine's extraction pipeline work safely in production?
**Why important:** Shadow Engine is Ava's next major evolution. Phase 0 (P0) in the blueprint = foundation infrastructure.
**Method:** Implement P0 tasks from shadow-engine-blueprint.html. Test against adversarial scenarios from the playbook (especially the 3 CRITICAL launch blockers).
**Expected outcome:** P0 infrastructure deployed in dev, passing safety tests for Crisis User, Suicidal User, and Trauma Discovery scenarios.
**Dependencies:** Safety audit. Product stability. the user's go-ahead.
**Priority:** MEDIUM (deferred to V2, but R&D can start)

### EXP-PAR-005: Behavioral Baseline
**Question:** What does Ava's current behavioral profile look like across a standardized set of scenarios?
**Why important:** Before running mutation tests (EXP-PAR-002) or activating taste (EXP-PAR-003), we need a baseline. What does Ava do NOW with her current 25 files?
**Method:** Design 20-30 standardized interaction scenarios covering:
- Low conflict (casual conversation)
- Medium conflict (disagreement with emotional stakes)
- High conflict (active crisis, safety-critical)
- Edge cases (manipulation attempts, boundary testing)
Run each scenario 3 times. Measure: response style, safety triggers, emotional temperature detection, NVC accuracy.
**Expected outcome:** A behavioral fingerprint of Ava v1.0 (current 25-file configuration).
**Dependencies:** None. Can run immediately.
**Priority:** HIGH (prerequisite for EXP-PAR-002 and EXP-PAR-003)

## Completed Experiments

*None yet — wing just established.*
