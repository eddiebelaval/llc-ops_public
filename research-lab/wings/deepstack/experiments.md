# DeepStack Wing -- Experiments

Active, queued, and completed experiments.

---

## Active Experiments

### EXP-DEEP-001: Production Readiness Assessment
**Question:** Is DeepStack ready for live trading with meaningful capital?
**Method:** `/research run --module trading` -- 3 quantitative experts (Dr. Marcus Webb, Dr. Reina Tanaka, Victor Krawczyk)
**Status:** Initiated Mar 4, 2026. Brief created in queue.
**Expected outcome:** Investment-grade rating (AAA-D) with specific P0/P1/P2/P3 recommendations. Expected baseline: BB-BBB range given $152 balance, untested strategies, -$348 drawdown, thin track record.
**Dependencies:** None. This is the foundation assessment.
**Priority:** URGENT (blocks all live trading decisions)

## Queued Experiments

### EXP-DEEP-002: Drawdown Root Cause Analysis
**Question:** Why did DeepStack lose $348 (70% of capital) in ~2 weeks?
**Why important:** Cannot fix what you don't understand. Was it strategy failure (bad signals), execution failure (slippage, timing), risk management failure (inadequate circuit breakers), or regime mismatch (strategies designed for one market condition traded in another)?
**Method:** Pull all trade records from Supabase. Categorize each losing trade by failure mode. Identify if losses were concentrated in specific strategies, time periods, or market conditions.
**Expected outcome:** Attribution of drawdown to specific failure modes with actionable fixes.
**Dependencies:** EXP-DEEP-001 (assessment identifies where to look)
**Priority:** HIGH

### EXP-DEEP-003: Strategy Backtest Integrity Audit
**Question:** Are the 17 strategies' backtests free of overfitting, look-ahead bias, and survivorship bias?
**Why important:** If the backtests are contaminated, everything built on them is unreliable. This is the single most important question for the trading system's credibility.
**Method:** Walk-forward testing with proper purging (train on pre-2024 data, test on 2024-2026 holdout). Apply White's Reality Check for data-snooping correction. Report results for ALL strategies, not just the ones that "work."
**Expected outcome:** For each strategy: clean/suspect/contaminated classification with specific issues identified.
**Dependencies:** None. Can run independently.
**Priority:** HIGH (prerequisite for trusting any strategy)

### EXP-DEEP-004: Live vs. Backtest Discrepancy Analysis
**Question:** How much alpha is lost between backtest and live execution?
**Why important:** The $348 loss suggests live performance is significantly worse than backtest expectations. Quantifying this gap tells us whether the problem is strategy quality or execution quality.
**Method:** For each trade that executed live, compare entry/exit prices to what the backtest would have predicted. Decompose the gap into: slippage, timing lag, market impact, data quality difference.
**Expected outcome:** Basis-point-level attribution of live vs backtest gap.
**Dependencies:** EXP-DEEP-002 (needs trade records analysis)
**Priority:** HIGH

### EXP-DEEP-005: Capital Constraint Viability
**Question:** Can 17 strategies (or even 3 enabled strategies) generate meaningful returns on $152?
**Why important:** Kelly criterion assumes you can fractionally size positions. At $152, most Kelly-optimal positions round to 0 or 1 contract. The system may be fundamentally under-capitalized for its strategy count.
**Method:** Calculate Kelly-optimal position sizes for all enabled strategies at current capital. Determine minimum viable capital for 1, 3, 5, and 17 strategies. Model expected returns at each capital level.
**Expected outcome:** Minimum capital requirements and strategy count recommendations.
**Dependencies:** EXP-DEEP-003 (need clean backtest data)
**Priority:** MEDIUM

### EXP-DEEP-006: Circuit Breaker Stress Test
**Question:** Do the circuit breakers actually protect capital in realistic adverse scenarios?
**Why important:** The -$348 loss occurred despite circuit breakers being in place. Either they're not strict enough, not fast enough, or not monitoring the right signals.
**Method:** Replay historical adverse market conditions through the circuit breaker logic. Test: does it trigger before 10% drawdown? Before 20%? Before total ruin? Test with real Kalshi market data from volatile periods.
**Expected outcome:** Circuit breaker effectiveness rating and specific parameter recommendations.
**Dependencies:** EXP-DEEP-001 (assessment may reveal breaker-specific issues)
**Priority:** MEDIUM

### EXP-DEEP-007: Correlation Analysis Across Strategies
**Question:** Are the 17 strategies actually uncorrelated, or do they share hidden risk factors?
**Why important:** If all strategies lose together under stress, the portfolio is not diversified. The -$348 loss may have been a correlation blow-up.
**Method:** Calculate inter-strategy return correlations under normal and stressed conditions. Run PCA to identify hidden common factors. Test correlation stability across market regimes.
**Expected outcome:** Correlation matrix, PCA results, and diversification ratio for the strategy portfolio.
**Dependencies:** EXP-DEEP-003 (need clean backtest data for all strategies)
**Priority:** MEDIUM

### EXP-DEEP-008: Regulatory Compliance Audit
**Question:** Does DeepStack comply with all CFTC DCM rules and Kalshi-specific position limits?
**Why important:** Automated trading on a regulated exchange carries legal obligations. Non-compliance can result in account closure or regulatory action.
**Method:** Review Kalshi rulebook. Check position limit compliance. Evaluate whether any strategy behavior could be construed as market manipulation (spoofing, layering, wash trading). Review AML/KYC status.
**Expected outcome:** Compliance checklist with pass/fail for each regulatory requirement.
**Dependencies:** None. Can run independently.
**Priority:** MEDIUM

## Completed Experiments

*None yet -- wing just established.*
