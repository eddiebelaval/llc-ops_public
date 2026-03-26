# Real Estate Module — Synthesis Prompt

After all 3 executive subagents return their JSON assessments, use this framework to synthesize findings.

## Step 1: Parse and Validate

- Confirm all 3 JSONs are valid and complete per schema.md
- Calculate composite scores if not already calculated
- Flag any missing required fields

## Step 2: Convergence Analysis

Identify where 2+ executives agree:

**Three-way convergence (highest confidence):**
- Same strength identified by all 3 = Validated market strength
- Same weakness identified by all 3 = Critical gap, MUST address before next round
- Same deal breaker from all 3 = Ship-stopper

**Two-way convergence:**
- Strength from 2/3 = Strong signal
- Weakness from 2/3 = Priority fix
- Same competitor flagged by 2/3 = Real threat

## Step 3: Divergence Analysis

Identify where executives disagree:
- One says strength, another says weakness = Market segment difference (dig into which segment is right for Homer's GTM)
- Different grades on same dimension = Role-dependent evaluation (e.g., broker sees compliance risk, agent sees workflow value)
- Conflicting adoption predictions = Test both hypotheses with real agents

For each divergence, determine:
1. Is this a legitimate perspective difference between roles? (e.g., broker vs. agent priorities)
2. Is one executive wrong about the market? (check against real data)
3. Is this an unresolved product decision? (flag for the user)

## Step 4: Composite Assessment

- **Overall grade:** Conservative — use the median composite, not the mean. If any executive rates a dimension CCC or below, that dimension's grade is capped at BB for the composite.
- **Confidence:** Average of 3 executives' confidence scores, penalized by divergence (subtract 0.05 for each major divergence point)
- **Verdict:** Based on rubric.md thresholds — validated, provisional, or needs rework

## Step 5: Action Items (Ranked)

Unlike the research module, every weakness generates an ACTION ITEM, not just a finding.

**Priority ranking:**
1. **Deal breakers** (any executive) = P0 — must fix before next evaluation round
2. **CRITICAL weaknesses** (convergent) = P1 — fix this sprint
3. **CRITICAL weaknesses** (single executive) = P2 — investigate and decide
4. **HIGH weaknesses** (convergent) = P3 — fix next sprint
5. **Competitive threats** (EXISTENTIAL/SERIOUS) = P4 — strategic response needed
6. **Adoption barriers** (BLOCKER) = P5 — fix before agent onboarding
7. Everything else = backlog

Each action item must include:
- What to build/change (specific)
- Why it matters (which executives flagged it)
- Definition of done (how to verify the fix)
- Estimated effort (S/M/L/XL)

## Step 6: Knowledge Base Update

Based on the grade:
- **A range (3.5+):** Append to `knowledge/findings.md` as validated market signal
- **BBB range (3.2-3.49):** Append as provisional, with specific conditions for promotion
- **Below BBB (<3.2):** Log in thesis-registry.md only. Generate targeted improvement briefs.

Always:
- Add all `killer_features` suggestions to `knowledge/open-questions.md` as feature evaluation candidates
- If any `liability_flags` with LAWSUIT_RISK severity, add to `knowledge/contradictions.md` (product thesis vs. legal reality)
- Update `knowledge/thesis-registry.md` with the evaluation record
- Update `state/lab-state.json` counters

## Step 7: Auto-Requeue (Improvement Loop)

For each dimension rated BB or below:
1. Generate a focused improvement brief: "How to move [dimension] from [current grade] to [target grade]"
2. The brief includes the specific executive feedback that drove the grade
3. Queue the brief for the next cycle
4. After improvements are implemented, re-run the same panel to score the delta

This is the Chladni plate loop — each cycle tightens the pattern until convergence at AAA (or until the panel agrees the ceiling has been reached and further improvement requires market validation, not more building).

## Step 8: Generate Artifact

Create an interactive Factory-Inspired HTML artifact saved to:
- `sessions/<session-id>/artifact.html`
- Copy to `~/Development/artifacts/research-lab/<session-id>.html`

The artifact should follow the parallax-assess pattern:
- Tab 1: Executive Summary (grade, exec cards, convergence, action items ranked)
- Tabs 2-4: Individual executive assessments (named after each role)
- Tab 5: Convergence/Divergence analysis
- Tab 6: Competitive landscape (threats + moat analysis)
- Tab 7: Liability & Compliance findings
- Tab 8: Action Items (prioritized, with effort estimates)
- Tab 9: Delta from previous round (if not Round 1)

## Round Tracking

Each evaluation round is numbered. The artifact title bar shows:
`Homer Executive Review — Round N | Grade: [GRADE] | Delta: [+/-] from Round N-1`

The loop continues until:
1. AAA achieved, OR
2. Panel consensus that remaining gaps require market validation (real agents, real transactions) rather than more building
3. Maximum 5 rounds before mandatory market test
