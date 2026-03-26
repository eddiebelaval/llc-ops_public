# Protocol: Multi-Round Assessment Loop

How to run the iterative improvement cycle that takes DeepStack from its current rating to AAA. This is the Parallax pattern (C -> B- -> B -> B+ -> A- -> A across 6 rounds) adapted for trading systems.

## Core Principle

Every round has exactly 3 phases: **Assess -> Fix -> Reassess.** The assessment identifies the weakest points. The fix addresses the highest-priority issues. The reassessment verifies the fix worked and didn't introduce new problems. Repeat until every expert rates AAA.

## The Loop

### Phase 1: Select Experts (3 per round)

1. Review the current assessment's findings and the lowest-rated dimensions
2. Select 3 experts from the pool of 12 that maximize coverage for the CURRENT weaknesses
3. At least one expert must cover risk/capital preservation (Tanaka, Webb, or Whitfield)
4. If evaluating strategy fixes: include Webb or Krawczyk or Blackwood
5. If evaluating infrastructure fixes: include Vasquez
6. If evaluating regulatory concerns: include Castellano
7. DO NOT use the same 3 experts in consecutive rounds unless the concerns haven't changed

Selection priority for each round:
- **Round 1:** Broad coverage (quant, risk, strategy) -- establish the baseline
- **Round 2:** Focused on P0/P1 issues from Round 1 -- experts who can best evaluate the fixes
- **Round 3+:** Rotate in fresh experts to avoid blind spots -- the same 3 experts can converge on a local optimum

### Phase 2: Run Assessment

1. Feed the experts the FULL DeepStack context:
   - `config.yaml` -- current strategy configuration
   - Strategy code for all enabled strategies
   - Risk management code (circuit_breaker.py, market_governor.py)
   - Recent trade data (Supabase export or log files)
   - Performance metrics (win rate, Sharpe, drawdown, P&L)
   - Consciousness files (mind/ directory -- relevant for behavioral assessment)
   - Previous assessment results (so experts can see improvement trajectory)
   - Specific changes made since last assessment

2. Each expert evaluates independently per `schema.md`
3. Synthesize per `synthesis-prompt.md`
4. Generate artifact per synthesis Step 13

### Phase 3: Triage and Fix

After each assessment:

1. **Sort all P0 recommendations.** These are blockers -- nothing else matters until P0s are resolved.
2. **For each P0:** Implement the fix, run tests, verify the fix doesn't break existing functionality.
3. **Then sort P1 recommendations.** Address as many as capacity allows before the next assessment round.
4. **Log every fix** in `evolution.md` with: what changed, why, which expert recommendation it addresses, expected impact.

### Phase 4: Verify Fix Quality

Before reassessment:
- Run all existing tests
- Run a dry-run trading simulation with the fixes applied
- Compare key metrics (win rate, Sharpe, drawdown) to previous baseline
- Document the metrics comparison in `evolution.md`

### Phase 5: Reassess

Return to Phase 1. Select experts, run assessment, repeat.

## Rating Trajectory Tracking

Maintain a rating trajectory in `evolution.md`:

| Round | Date | Rating | Grade | Experts | Key Changes | P0 Remaining |
|-------|------|--------|-------|---------|-------------|-------------|
| 1 | 2026-03-04 | BB | B- | Webb, Tanaka, Krawczyk | Baseline | 5 |
| 2 | ... | BBB | B+ | ... | Fixed position sizing, added walk-forward | 2 |
| 3 | ... | A | A- | ... | Circuit breaker hardened, correlation analysis | 0 |
| ... | ... | ... | ... | ... | ... | ... |

## Convergence Criteria

**The loop ends when:**
1. All 3 experts in a round independently rate AAA, AND
2. Zero P0 or P1 recommendations remain, AND
3. All 10 adversarial scenarios have been tested (across all rounds, not necessarily in one round), AND
4. At least 2 rounds have been run with different expert combinations (prevents convergence on one trio's blind spots)

## Anti-Patterns

- **Rating shopping:** Don't keep switching experts until you find 3 that rate AAA. The conservative aggregation rule exists for a reason.
- **Fix-one-break-one:** Every fix must be verified against existing functionality. New issues introduced by fixes count AGAINST the rating.
- **P0 avoidance:** Don't skip hard P0 fixes by addressing easy P2s instead. P0s are blockers for a reason.
- **Premature capital deployment:** Don't increase capital between rounds. Capital allocation should only increase AFTER achieving a stable rating of A or above across multiple rounds.
- **Over-optimization:** The goal is AAA (production-ready), not perfection. Don't spend 5 rounds chasing marginal improvements in already-strong dimensions.

## Expected Timeline

Based on the Parallax pattern (6 rounds over ~2 weeks):
- **Round 1 (baseline):** Expected BB-BBB. Identifies major gaps.
- **Round 2 (first fixes):** Expected BBB-A. P0s addressed.
- **Round 3 (hardening):** Expected A-AA. Infrastructure and risk management solidified.
- **Round 4+ (refinement):** Expected AA-AAA. Edge cases, adversarial scenarios, regulatory compliance.

The actual timeline depends on the severity of Round 1 findings. If the system is CCC, more rounds are needed.

## Observation Bridge (Paper Trade → Lab Pipeline)

The bot generates assessment briefs automatically at milestone trade counts:

| Milestone | Trades | Statistical Significance | Expected Action |
|-----------|--------|--------------------------|-----------------|
| n=25 | 25 closed | Initial sample — directional signal only | First empirical assessment (BB- ceiling) |
| n=76 | 76 closed | 80% power to distinguish WR=0.80 from WR=0.50 | Full statistical assessment |
| n=125 | 125 closed | 95% power — strong empirical evidence | BBB+ ceiling unlocked |
| n=200 | 200 closed | Robust — multi-regime coverage possible | A-level assessment possible |

**How it works:**
1. Bot runs in `--paper-trade` mode (simulated fills, real journal entries)
2. After each trade close, `_check_lab_milestones()` checks the total closed trade count
3. At each milestone, `journal.generate_assessment_brief()` produces a markdown brief
4. Brief is written to `research-lab/queue/NNN-deepstack-empirical-nNN.md`
5. Run `/research run --module trading` to trigger the expert panel on that brief
6. Experts now have empirical data (win rate, profit factor, P&L, per-strategy breakdown)

**Paper trade briefs are tagged `Mode: PAPER TRADING`** so experts can weight their assessments accordingly (simulated fills assume instant execution at signal price — real markets have slippage, partial fills, and timing risk).

## What to Track

For every round, record:

| Field | Description |
|-------|-------------|
| Round number | Sequential |
| Date | When the assessment ran |
| Experts selected | Which 3 and why |
| Previous fixes | What was changed since last round |
| Investment rating | Overall + per-expert |
| Quality grade | Overall + per-expert |
| P0 count | How many blockers remain |
| Key findings | Top 3 findings (convergence and divergence) |
| Next actions | What to fix before the next round |
| Artifact | Path to the HTML report |
