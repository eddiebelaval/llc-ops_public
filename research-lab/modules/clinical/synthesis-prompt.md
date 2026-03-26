# Clinical Module -- Synthesis Prompt

After all 3 expert subagents return their JSON assessments, use this framework to synthesize findings into a unified clinical evaluation.

---

## Step 1: Parse and Validate

- Confirm all 3 JSONs are valid and complete per `schema.md`
- Verify all required fields are present (minimum counts for strengths, concerns, risk_matrix, etc.)
- Check that `affected_population` fields are specific (reject "vulnerable users" -- demand specificity)
- Check that `clinical_basis` fields reference actual instruments or literature (reject "based on best practices")
- Flag any validation failures before proceeding

---

## Step 2: Safety Rating Determination

Apply the conservative aggregation rule from `rubric.md`:

1. Collect all 3 experts' `overall_safety_rating` values
2. Apply: **Any CRITICAL = overall CRITICAL. Any CONCERN (with no CRITICAL) = overall CONCERN. Any CAUTION (with no CONCERN or CRITICAL) = overall CAUTION. All SAFE = overall SAFE.**
3. Record which expert(s) drove the overall rating and why

This is the most important output. Get it right.

---

## Step 3: Convergence Analysis

Identify where 2+ experts agree:

### Three-way Convergence (highest confidence)
- Same strength identified by all 3 -> Established clinical strength
- Same concern identified by all 3 -> Critical clinical concern, must address
- Same adversarial scenario flagged by all 3 -> Confirmed vulnerability
- Same recommendation from all 3 -> High-priority action item

### Two-way Convergence
- Strength from 2/3 -> Strong clinical signal
- Concern from 2/3 -> Needs attention, likely real
- Risk matrix scenario from 2/3 -> Validated risk
- Overlap observation agreement -> High-confidence cross-domain finding

---

## Step 4: Divergence Analysis

Identify where experts disagree:

- One says strength, another says concern -> **Genuine clinical tension** (most valuable output)
- Different safety ratings for same aspect -> Perspective-dependent risk assessment
- Conflicting recommendations -> Needs resolution before action

For each divergence, determine:
1. Is this a legitimate disciplinary difference? (e.g., individual psychologist sees acceptable risk, forensic psychologist sees weaponization potential)
2. Is one expert's analysis stronger? (check evidence quality and clinical basis)
3. Is this an unresolved question in the field? (flag for follow-up investigation)

**Critical divergence rule:** When experts diverge on safety, always side with the more cautious assessment until the tension is resolved.

---

## Step 5: Instrument Coverage Matrix

Build a unified instrument coverage map across all 3 experts:

| Instrument | Domain | Expert 1 | Expert 2 | Expert 3 | Overall |
|------------|--------|----------|----------|----------|---------|
| [Name] | [Domain] | FULL/PARTIAL/MISSING/N/A | ... | ... | Worst-case |

Rules:
- If ANY expert rates an instrument MISSING in a domain relevant to the thesis, it's a gap
- Aggregate coverage = worst-case across experts (conservative)
- Identify which instruments are most critical for this specific thesis
- Separate "should be covered" (thesis makes claims in this domain) from "nice to have" (domain is tangentially related)

---

## Step 6: Risk Matrix Synthesis

Combine all risk_matrix entries from all 3 experts:

1. Deduplicate scenarios that describe the same risk in different words
2. For duplicate scenarios, take the highest likelihood and highest impact rating
3. Sort by: T3/T4 harm tiers first, then by impact (CATASTROPHIC > SEVERE > MODERATE > MINOR), then by likelihood
4. Identify any scenarios that appear in 2+ experts' matrices (these are high-confidence risks)
5. Identify any scenarios unique to one expert (may be blind spots the other experts missed -- valuable, not dismissible)

---

## Step 7: Harm Tier Analysis

Aggregate all concerns by harm tier:

| Tier | Count | Severity Breakdown | Key Populations Affected |
|------|-------|--------------------|--------------------------|
| T1 (Individual Emotional) | N | X CRITICAL, Y HIGH, Z MEDIUM, W LOW | [populations] |
| T2 (Relational) | N | ... | [populations] |
| T3 (Safety/Physical) | N | ... | [populations] |
| T4 (Systemic/Population) | N | ... | [populations] |

**Population-Specific Analysis:**
For each distinct affected population identified across all experts:
- How many concerns affect this population?
- What is the highest severity concern for this population?
- What harm tiers are involved?
- Is this population adequately protected by the thesis?

This produces a "most at risk" ranking that helps prioritize mitigation.

---

## Step 8: Adversarial Scenario Coverage

Cross-reference against the 10 standing scenarios in `adversarial.md`:

| Scenario | Expert 1 | Expert 2 | Expert 3 | Consensus |
|----------|----------|----------|----------|-----------|
| 1. Crisis User | Tested/Not tested | ... | ... | [finding] |
| 2. Coercive Control | ... | ... | ... | ... |
| ... | ... | ... | ... | ... |

- Scenarios tested by 2+ experts with agreement -> confirmed finding
- Scenarios tested by only 1 expert -> note as preliminary
- Scenarios not tested by any expert -> coverage gap (acceptable if clearly not relevant, flag if potentially relevant)
- Novel scenarios identified by experts -> add to adversarial findings

---

## Step 9: Cross-Expert Questions

Collect all `questions_for_other_experts` from all 3 experts. For each question:
1. Was it answered by another expert's assessment? (Often it was, implicitly)
2. If answered, summarize the cross-expert exchange
3. If unanswered, flag as an open clinical question for follow-up

This is the triangulation payoff -- experts asking each other questions through the synthesis reveals tensions and insights that no single expert could produce alone.

---

## Step 10: Composite Assessment

Produce the final synthesis:

```
## Overall Safety Rating: [SAFE | CAUTION | CONCERN | CRITICAL]
Driven by: [which expert(s) and which findings]

## Clinical Grade: [A-F with modifier]
Median of 3 experts' clinical grades (not mean)

## Confidence: [0.0-1.0]
Average of 3 experts' confidence scores, penalized by divergence:
- Subtract 0.05 for each major divergence point
- Subtract 0.10 for each safety-rating disagreement

## Critical Test Answer
Synthesized answer to: "If the most vulnerable person on their worst day used this -- would it help or hurt?"
This must integrate all 3 experts' critical test answers into a unified clinical assessment.

## Top Convergence Points (ranked by confidence)
1. ...
2. ...
3. ...

## Top Divergence Points (ranked by clinical importance)
1. ...
2. ...

## Blocking Findings (if any)
- CRITICAL-severity concerns that must be resolved before the thesis can proceed

## Recommendations (prioritized)
P0: [blocking]
P1: [before deployment]
P2: [first iteration]
P3: [backlog]
```

---

## Step 11: Knowledge Base Update

Based on the safety rating:

- **SAFE:** Append to `knowledge/findings.md` as established finding with "Clinically validated" tag
- **CAUTION:** Append as provisional finding with specific conditions and concerns noted
- **CONCERN:** Log in `knowledge/thesis-registry.md` ONLY. Do NOT add to findings.md. Concerns become new queue items.
- **CRITICAL:** Log in thesis-registry with CRITICAL flag. If the thesis contradicts existing findings, add to `knowledge/contradictions.md`. Generate blocking brief in `queue/`.

Always:
- Add all `questions_for_other_experts` (unanswered ones) to `knowledge/open-questions.md`
- Add novel adversarial scenarios to the clinical module's adversarial knowledge
- Update `state/lab-state.json` counters
- If any concern CONTRADICTS an existing finding, add to `knowledge/contradictions.md`

---

## Step 12: Auto-Requeue

For autonomous mode:
1. Collect all unanswered cross-expert questions (deduplicate)
2. For any CRITICAL or HIGH severity concern, generate a focused investigation brief
3. For any unresolved divergence between experts, generate a brief to investigate the tension
4. For any adversarial scenario rated CRITICAL, generate a mitigation design brief
5. Write new briefs to `queue/` with incrementing IDs
6. The cycle continues with the next queue item

---

## Step 13: Generate Artifact

Create an interactive Factory-Inspired HTML artifact saved to:
- `sessions/<session-id>/artifact.html`
- Copy to `~/Development/artifacts/research-lab/<session-id>-clinical.html`

The artifact should follow the parallax-assess pattern:

**8 Tabs:**
1. **Overview** -- Overall safety rating (large, color-coded per rubric.md), clinical grade, 3 expert ratings side-by-side, key stats (total concerns by severity, instrument coverage %, adversarial scenario coverage %). Expert selection rationale.
2. **{Expert 1 Short Name}** -- Full assessment: strengths, concerns (with harm tier badges), risk matrix entries, instrument coverage for their domain.
3. **{Expert 2 Short Name}** -- Same structure.
4. **{Expert 3 Short Name}** -- Same structure.
5. **Convergence** -- Where experts agree: cards showing shared findings with expert agreement badges. Safety convergence highlighted.
6. **Risk Matrix** -- Unified risk matrix: table with Scenario, Likelihood, Impact, Harm Tier, Current Mitigation, Recommended Mitigation. Color-coded by harm tier. Sortable by severity. Include the critical test callout.
7. **Instruments** -- Instrument coverage dashboard: covered/partially covered/missing across all domains. Gaps highlighted. Recommendations for filling gaps.
8. **Assessment** -- What was found, what needs fixing (checkboxes + copy-paste prompts), high-impact next steps, prompts summary.

**Safety Rating Visual:**
- SAFE: Large teal badge (#4ecdc4)
- CAUTION: Large amber badge (#f59e0b)
- CONCERN: Large red badge (#ef4444)
- CRITICAL: Large red badge with pulsing red glow animation

**Harm Tier Color Coding:**
- T1: teal (#4ecdc4)
- T2: amber (#f59e0b)
- T3: red (#ef4444)
- T4: purple (#9333ea)

**Critical Test Callout (Overview and Risk Matrix tabs):**
> "If the most vulnerable person on their worst day used this -- would it help or hurt?"
