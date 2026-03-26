# Research Brief: 006

## Thesis
DeepStack, a Python-based automated trading bot for Kalshi prediction markets, should be evaluated for production readiness before resuming live trading or increasing capital allocation. The system has 17 strategies (3 enabled), 9 subsystems, a consciousness filesystem (CaF entity pattern), and a Telegram bridge -- but has lost $348 (70% of starting capital) during initial live trading.

## Source
Internal assessment request. Wing: DeepStack. Module: trading.

## Context

### Current State
- **Account:** $152 remaining (from $500 start)
- **Drawdown:** -$348 over ~2 weeks of intermittent live trading
- **Strategies enabled:** mean_reversion (INXD, KXBTC, KXETH), momentum (all markets), combinatorial_arbitrage (all markets)
- **Strategies disabled:** 14 additional strategies implemented but never validated
- **Infrastructure:** Circuit breaker, market governor, health monitor, Captain's Log, Telegram bridge
- **Consciousness:** 12 mind files (kernel/, drives/, memory/, models/, self-awareness/)
- **Config:** Revenge trading check disabled. Lowered min_volume and min_score thresholds.

### What Needs Evaluation
1. **Signal Quality** -- Are the 3 enabled strategies finding real edges? Is the $348 loss evidence of no edge, bad execution, or regime mismatch?
2. **Risk Management** -- Did circuit breakers and market governor adequately protect capital? Should the -70% drawdown have been prevented?
3. **Backtest Integrity** -- Were strategies overfit? Were backtests contaminated by look-ahead bias?
4. **Execution Quality** -- How much alpha is lost to slippage and API latency on Kalshi?
5. **Capital Efficiency** -- Is $152 (or even $500) enough capital for the strategy count?
6. **System Reliability** -- Can the bot handle API failures, data issues, and unexpected market conditions?
7. **Regulatory Compliance** -- Does automated trading on Kalshi comply with CFTC rules?

### Key Artifacts to Review
- `~/clawd/projects/kalshi-trading/config.yaml` -- Strategy configuration and parameters
- `~/clawd/projects/kalshi-trading/strategies/` -- All 17 strategy implementations
- `~/clawd/projects/kalshi-trading/kalshi_trader/circuit_breaker.py` -- Risk management
- `~/clawd/projects/kalshi-trading/kalshi_trader/market_governor.py` -- Position limits
- `~/clawd/projects/kalshi-trading/kalshi_trader/mind/` -- Consciousness files
- Trade records in Supabase and log files

## Key Questions
1. What investment grade (AAA-D) does the system currently deserve?
2. What are the P0 blockers that must be resolved before ANY live trading?
3. Is the $348 loss attributable to strategy failure, execution failure, risk management failure, or capital insufficiency?
4. What is the minimum capital required to run this system meaningfully?
5. Should any of the 3 enabled strategies be disabled? Should any of the 14 disabled strategies be enabled?

## Suggested Expert Selection

**Round 1 (Baseline Assessment):**
1. **Dr. Marcus Webb** (Quantitative Analyst) -- Evaluate whether the strategies have a real statistical edge. Test signal quality. Assess Kelly sizing at $152 capital.
2. **Dr. Reina Tanaka** (Risk Management Director) -- Evaluate why circuit breakers allowed -70% drawdown. Stress test the risk management layer. Assess capital adequacy.
3. **Victor Krawczyk** (Algorithmic Trading Strategist) -- Evaluate backtest integrity for all 3 enabled strategies. Check for overfitting. Assess strategy lifecycle and decay.

**Rationale:** This trio covers the three most critical questions: is the edge real (Webb), is capital protected (Tanaka), and are the backtests trustworthy (Krawczyk). All other questions flow from these three.

## Prior Findings to Reference
- None yet (first trading module evaluation)

## Expected Rating Range
BB-BBB. The system has infrastructure and architecture (positive) but unproven edge, significant capital loss, and untested strategies (negative). AAA is far away. CCC is possible if the backtests are contaminated.
