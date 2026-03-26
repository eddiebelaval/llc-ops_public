# Research Module — Synthesis Prompt

After all 3 expert subagents return their JSON assessments, use this framework to synthesize findings.

## Step 1: Parse and Validate

- Confirm all 3 JSONs are valid and complete per schema.md
- Calculate composite scores if not already calculated
- Flag any missing required fields

## Step 2: Convergence Analysis

Identify where 2+ experts agree:

**Three-way convergence (highest confidence):**
- Same strength identified by all 3 → Established strength
- Same weakness identified by all 3 → Critical weakness, must address
- Same adversarial challenge survived by all 3 → Robust defense

**Two-way convergence:**
- Strength from 2/3 → Strong signal
- Weakness from 2/3 → Needs attention
- Cross-reference agreement → High-confidence relationship

## Step 3: Divergence Analysis

Identify where experts disagree:
- One says strength, another says weakness → Genuine tension (most valuable output)
- Different grades on same dimension → Perspective-dependent evaluation
- Conflicting cross-references → Needs resolution

For each divergence, determine:
1. Is this a legitimate disciplinary difference? (e.g., phenomenologist vs. computationalist)
2. Is one expert wrong? (check evidence)
3. Is this an unresolved question in the field? (flag for follow-up)

## Step 4: Composite Assessment

- **Overall grade:** Conservative — use the median composite, not the mean. If any expert rates a dimension CRITICAL, that dimension's grade is capped at C for the composite.
- **Confidence:** Average of 3 experts' confidence scores, penalized by divergence (subtract 0.05 for each major divergence point)
- **Verdict:** Based on rubric.md thresholds — promote to KB, log as provisional, or flag for rework

## Step 5: Knowledge Base Update

Based on the grade:
- **A range (3.5+):** Append to `knowledge/findings.md` as established finding (F-NNN)
- **B+ range (3.2-3.49):** Append as provisional finding, note which dimensions need strengthening
- **Below B+ (<3.2):** Log in thesis-registry.md only. Do NOT add to findings.md.

Always:
- Add all `new_questions` from all 3 experts to `knowledge/open-questions.md`
- If any `cross_references` show CONTRADICTS with existing findings, add to `knowledge/contradictions.md`
- Update `knowledge/thesis-registry.md` with the evaluation record
- Update `state/lab-state.json` counters

## Step 6: Auto-Requeue

For autonomous mode:
1. Collect all `new_questions` from all 3 experts (deduplicate)
2. For any rubric dimension rated C or below, generate a targeted follow-up question
3. For any CRITICAL weakness, generate a focused brief to investigate that specific gap
4. Write new briefs to `queue/` with incrementing IDs
5. The cycle continues with the next queue item

## Step 7: Generate Artifact

Create an interactive Factory-Inspired HTML artifact saved to:
- `sessions/<session-id>/artifact.html`
- Copy to `~/Development/artifacts/research-lab/<session-id>.html`

The artifact should follow the parallax-assess pattern:
- Tab 1: Overview (grade, expert cards, convergence summary)
- Tabs 2-4: Individual expert assessments (named after each expert)
- Tab 5: Convergence/Divergence analysis
- Tab 6: Adversarial challenges (survived vs. failed)
- Tab 7: Knowledge Base impact (what was added, what questions were generated)
