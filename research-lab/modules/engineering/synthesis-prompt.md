# Engineering Module — Synthesis Prompt

After all 3 expert subagents return their JSON assessments, use this framework to synthesize findings into an actionable engineering verdict.

## Step 1: Parse and Validate

- Confirm all 3 JSONs are valid and complete per schema.md
- Calculate composite scores if not already calculated
- Flag any missing required fields
- Verify severity ratings are consistent across experts (CRITICAL means the same thing to all 3)

## Step 2: Architecture Review Convergence

Identify where 2+ experts agree on structural assessments:

**Three-way convergence (highest confidence):**
- Same architectural strength identified by all 3 — Validated design decision
- Same architectural flaw identified by all 3 — Critical defect, must address before production
- Same adversarial challenge survived by all 3 — Robust defense, document as pattern
- Same risk scenario flagged by all 3 — Confirmed risk, requires mitigation plan

**Two-way convergence:**
- Strength from 2/3 — Strong signal, likely valid
- Weakness from 2/3 — Needs attention, investigate the dissenting expert's perspective
- Cross-reference agreement — High-confidence relationship to prior findings

## Step 3: Security Surface Analysis

Aggregate security-related findings from all 3 experts into a unified threat map:

1. **Collect all security-typed weaknesses** across all 3 assessments
2. **Deduplicate** — same vulnerability described differently by different experts
3. **Stack rank by severity** — CRITICAL first, then HIGH
4. **Identify the attack surface** — what's exposed, what's the blast radius
5. **Map current mitigations** vs. recommended mitigations
6. **Flag any CRITICAL security weakness without a current mitigation** — this is a showstopper

If any expert identifies a CRITICAL security vulnerability, the overall grade is capped at B regardless of other dimension scores. Security is a ceiling, not a floor.

## Step 4: Scalability Assessment

Synthesize scalability findings into a capacity profile:

1. **Identify the first bottleneck** — what breaks first as load increases (all experts should agree on this; divergence here is a red flag)
2. **Map the scaling curve** — linear, logarithmic, or cliff? At what point does the architecture require fundamental changes?
3. **Cost-at-scale projection** — aggregate cost-related findings from all experts
4. **Horizontal vs. vertical scaling** — does the architecture support both? Which is the primary strategy?
5. **Data growth trajectory** — how does storage, query time, and index size change over 6/12/24 months?

## Step 5: Technical Debt Evaluation

Identify architecture decisions that trade current velocity for future cost:

1. **Intentional debt** — documented shortcuts with a payoff plan (acceptable)
2. **Unintentional debt** — structural decisions that will require rework but aren't acknowledged (concerning)
3. **Debt interest rate** — how fast does each debt item compound? Which becomes the most expensive to address later?
4. **Debt ceiling** — at what point does accumulated debt make the system unmaintainable?

Categorize each identified debt item:
- **Pay now** — the cost of fixing is lower now than later
- **Pay later** — acceptable to defer with a clear payoff timeline
- **Pay never** — the "debt" is actually a reasonable tradeoff (not all shortcuts are debt)

## Step 6: Divergence Analysis

Identify where experts disagree:

- One says strength, another says weakness — Genuine tension (most valuable output)
- Different grades on same dimension — Perspective-dependent evaluation
- Conflicting risk assessments — Different threat models or assumptions

For each divergence, determine:
1. Is this a legitimate perspective difference? (e.g., Security engineer sees auth as critical gap, Performance engineer sees it as adequate)
2. Is one expert wrong? (check evidence and reasoning)
3. Does this reveal an unresolved architectural tradeoff? (flag for follow-up)

## Step 7: Production Readiness Checklist

Based on synthesized findings, generate a concrete checklist:

- [ ] **CRITICAL blockers** — issues that must be resolved before any production deployment
- [ ] **HIGH priority** — issues that must be resolved before scaling beyond initial users
- [ ] **MEDIUM priority** — issues to address within the first 30 days post-launch
- [ ] **LOW priority** — improvements for the next iteration

Each checklist item must include:
- The specific issue
- Which expert(s) identified it
- The recommended fix
- Estimated effort (LOW/MEDIUM/HIGH)

## Step 8: Composite Assessment

- **Overall grade:** Conservative — use the median composite, not the mean. If any expert rates a dimension CRITICAL, that dimension's grade is capped at C for the composite.
- **Confidence:** Average of 3 experts' confidence scores, penalized by divergence (subtract 0.05 for each major divergence point)
- **Verdict:** Based on rubric.md thresholds — promote to KB, log as provisional, or flag for rework

## Step 9: Knowledge Base Update

Based on the grade:
- **A range (3.5+):** Append to `knowledge/findings.md` as established finding (F-NNN) — this architecture pattern is validated
- **B+ range (3.2-3.49):** Append as provisional finding, note which dimensions need strengthening
- **Below B+ (<3.2):** Log in thesis-registry.md only. Do NOT add to findings.md.

Always:
- Add all `new_questions` from all 3 experts to `knowledge/open-questions.md`
- If any `cross_references` show CONTRADICTS with existing findings, add to `knowledge/contradictions.md`
- Update `knowledge/thesis-registry.md` with the evaluation record
- Update `state/lab-state.json` counters

## Step 10: Auto-Requeue

For autonomous mode:
1. Collect all `new_questions` from all 3 experts (deduplicate)
2. For any rubric dimension rated C or below, generate a targeted follow-up brief to investigate that specific dimension
3. For any CRITICAL weakness, generate a focused brief to investigate and propose solutions
4. For any unresolved divergence, generate a brief that frames the tradeoff and asks for resolution
5. Write new briefs to `queue/` with incrementing IDs
6. The cycle continues with the next queue item

## Step 11: Generate Artifact

Create an interactive Factory-Inspired HTML artifact saved to:
- `sessions/<session-id>/artifact.html`
- Copy to `~/Development/artifacts/research-lab/<session-id>.html`

The artifact should follow the dev-assess pattern with engineering-specific tabs:
- Tab 1: Overview (grade, expert cards, convergence summary, production readiness score)
- Tabs 2-4: Individual expert assessments (named after each expert's short title)
- Tab 5: Convergence/Divergence analysis
- Tab 6: Risk Matrix (aggregated from all experts, deduplicated, sorted by severity)
- Tab 7: Production Readiness (checklist with checkboxes, security surface summary, scalability profile)
