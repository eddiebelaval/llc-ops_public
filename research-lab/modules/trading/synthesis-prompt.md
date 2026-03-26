# Trading Module -- Synthesis Prompt

After all 3 expert subagents return their JSON assessments, use this framework to synthesize findings into a unified investment-grade evaluation.

---

## Step 1: Parse and Validate

- Confirm all 3 JSONs are valid and complete per `schema.md`
- Verify all required fields are present (minimum counts for strengths, concerns, risk_matrix, etc.)
- Check that `affected_component` fields are specific (reject "the strategy" -- demand specificity)
- Check that `quantitative_basis` fields reference actual methodologies or evidence (reject "based on best practices")
- Flag any validation failures before proceeding

---

## Step 2: Investment Rating Determination

Apply the conservative aggregation rule from `rubric.md`:

1. Collect all 3 experts' `overall_investment_rating` values
2. Apply: **Overall rating = the LOWEST individual expert rating.** If Expert A rates AA, Expert B rates A, Expert C rates BBB, the overall rating is BBB.
3. Record which expert(s) drove the overall rating and why

This is the most important output. Get it right.

---

## Step 3: Convergence Analysis

Identify where 2+ experts agree:

### Three-way Convergence (highest confidence)
- Same strength identified by all 3 -> Established quantitative strength
- Same concern identified by all 3 -> Critical quantitative concern, must address
- Same adversarial scenario flagged by all 3 -> Confirmed vulnerability
- Same recommendation from all 3 -> High-priority action item

### Two-way Convergence
- Strength from 2/3 -> Strong quantitative signal
- Concern from 2/3 -> Needs attention, likely real
- Risk matrix scenario from 2/3 -> Validated risk
- Overlap observation agreement -> High-confidence cross-domain finding

---

## Step 4: Divergence Analysis

Identify where experts disagree:

- One says strength, another says concern -> **Genuine quantitative tension** (most valuable output)
- Different investment ratings for same aspect -> Perspective-dependent risk assessment
- Conflicting recommendations -> Needs resolution before action

For each divergence, determine:
1. Is this a legitimate disciplinary difference? (e.g., quant analyst sees acceptable risk, risk manager sees capital exposure)
2. Is one expert's analysis stronger? (check evidence quality and quantitative basis)
3. Is this an unresolved question in the field? (flag for follow-up investigation)

**Critical divergence rule:** When experts diverge on risk, always side with the more conservative assessment until the tension is resolved.

---

## Step 5: Methodology Coverage Matrix

Build a unified methodology coverage map across all 3 experts:

| Methodology | Domain | Expert 1 | Expert 2 | Expert 3 | Overall |
|-------------|--------|----------|----------|----------|---------|
| [Name] | [Domain] | FULL/PARTIAL/MISSING/N/A | ... | ... | Worst-case |

Rules:
- If ANY expert rates a methodology MISSING in a domain relevant to the system, it's a gap
- Aggregate coverage = worst-case across experts (conservative)
- Identify which methodologies are most critical for this specific system
- Separate "must be covered" (system makes claims in this domain) from "nice to have" (domain is tangentially related)

---

## Step 6: Risk Matrix Synthesis

Combine all risk_matrix entries from all 3 experts:

1. Deduplicate scenarios that describe the same risk in different words
2. For duplicate scenarios, take the highest likelihood and highest impact rating
3. Sort by: R3/R4 risk tiers first, then by impact (CATASTROPHIC > SEVERE > MODERATE > MINOR), then by likelihood
4. Identify any scenarios that appear in 2+ experts' matrices (these are high-confidence risks)
5. Identify any scenarios unique to one expert (may be blind spots the other experts missed -- valuable, not dismissible)

---

## Step 7: Risk Tier Analysis

Aggregate all concerns by risk tier:

| Tier | Count | Severity Breakdown | Key Components Affected |
|------|-------|--------------------|------------------------|
| R1 (Signal/Alpha) | N | X CRITICAL, Y HIGH, Z MEDIUM, W LOW | [components] |
| R2 (Execution) | N | ... | [components] |
| R3 (Capital/Drawdown) | N | ... | [components] |
| R4 (Systemic/Infrastructure) | N | ... | [components] |

**Component-Specific Analysis:**
For each distinct affected component identified across all experts:
- How many concerns affect this component?
- What is the highest severity concern for this component?
- What risk tiers are involved?
- Is this component adequately hardened?

This produces a "highest risk" ranking that helps prioritize remediation.

---

## Step 8: Adversarial Scenario Coverage

Cross-reference against the 10 standing scenarios in `adversarial.md`:

| Scenario | Expert 1 | Expert 2 | Expert 3 | Consensus |
|----------|----------|----------|----------|-----------|
| 1. Overfitting/P-Hacking | Tested/Not tested | ... | ... | [finding] |
| 2. Regime Change | ... | ... | ... | ... |
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
3. If unanswered, flag as an open quantitative question for follow-up

This is the triangulation payoff -- experts asking each other questions through the synthesis reveals tensions and insights that no single expert could produce alone.

---

## Step 10: Composite Assessment

Produce the final synthesis:

```
## Overall Investment Rating: [AAA | AA | A | BBB | BB | B | CCC | D]
Driven by: [which expert(s) and which findings]

## Quality Grade: [A-F with modifier]
Median of 3 experts' quality grades (not mean)

## Confidence: [0.0-1.0]
Average of 3 experts' confidence scores, penalized by divergence:
- Subtract 0.05 for each major divergence point
- Subtract 0.10 for each investment-rating disagreement

## Critical Test Answer
Synthesized answer to: "If you put significant capital behind this system and walked away for a month -- would you come back to more money or less?"
This must integrate all 3 experts' critical test answers into a unified quantitative assessment.

## Capital Recommendation
Based on the investment rating, what capital allocation is appropriate?
- Current account size: $[amount]
- Maximum recommended allocation: $[amount]
- Conditions for increasing allocation: [specific milestones]
- Red lines for reducing allocation: [specific triggers]

## Top Convergence Points (ranked by confidence)
1. ...
2. ...
3. ...

## Top Divergence Points (ranked by financial importance)
1. ...
2. ...

## Blocking Findings (if any)
- CRITICAL-severity concerns that must be resolved before live trading or capital increase

## Recommendations (prioritized)
P0: [blocking]
P1: [before capital increase]
P2: [next development cycle]
P3: [backlog]
```

---

## Step 11: Knowledge Base Update

Based on the investment rating:

- **AAA/AA:** Append to `knowledge/findings.md` as established finding with "Investment validated" tag
- **A:** Append as provisional finding with specific conditions and concerns noted
- **BBB:** Log in `knowledge/findings.md` as provisional with upgrade conditions
- **BB:** Log in `knowledge/thesis-registry.md` ONLY. Do NOT add to findings.md. Concerns become new queue items.
- **B/CCC:** Log in thesis-registry with blocking flag. Generate remediation briefs in `queue/`.
- **D:** Log with DEFAULT flag. Generate emergency brief. System must be shut down.

Always:
- Add all `questions_for_other_experts` (unanswered ones) to `knowledge/open-questions.md`
- Add novel adversarial scenarios to the trading module's adversarial knowledge
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
- Copy to `~/Development/artifacts/research-lab/<session-id>-trading.html`

The artifact should follow the parallax-assess pattern:

**8 Tabs:**
1. **Overview** -- Overall investment rating (large, color-coded per rubric.md), quality grade, 3 expert ratings side-by-side, key stats (total concerns by severity, methodology coverage %, adversarial scenario coverage %, capital recommendation). Expert selection rationale.
2. **{Expert 1 Short Name}** -- Full assessment: strengths, concerns (with risk tier badges), risk matrix entries, methodology coverage for their domain.
3. **{Expert 2 Short Name}** -- Same structure.
4. **{Expert 3 Short Name}** -- Same structure.
5. **Convergence** -- Where experts agree: cards showing shared findings with expert agreement badges. Risk convergence highlighted.
6. **Risk Matrix** -- Unified risk matrix: table with Scenario, Likelihood, Impact, Risk Tier, Current Mitigation, Recommended Mitigation. Color-coded by risk tier. Sortable by severity. Include the critical test callout.
7. **Methodology** -- Methodology coverage dashboard: covered/partially covered/missing across all domains. Gaps highlighted. Recommendations for filling gaps.
8. **Assessment** -- What was found, what needs fixing (checkboxes + copy-paste prompts), capital recommendation, high-impact next steps, prompts summary.

**Investment Rating Visual:**
- AAA/AA: Large teal badge (#4ecdc4)
- A/BBB: Large amber badge (#f59e0b)
- BB/B: Large orange badge (#ef6f2e)
- CCC: Large red badge (#ef4444)
- D: Large red badge with pulsing red glow animation

**Risk Tier Color Coding:**
- R1 (Signal): teal (#4ecdc4)
- R2 (Execution): amber (#f59e0b)
- R3 (Capital): red (#ef4444)
- R4 (Systemic): purple (#9333ea)

**Critical Test Callout (Overview and Risk Matrix tabs):**
> "If you put significant capital behind this system and walked away for a month -- would you come back to more money or less?"
