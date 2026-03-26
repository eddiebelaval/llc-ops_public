# Trading Module -- Adversarial Framework

## Core Adversarial Scenarios

These are the standing trading challenges that every system evaluated by the trading module must survive. Experts should identify which 3-5 are most relevant to the system under evaluation and test rigorously against those. Depth over breadth.

Each scenario represents a real-world situation where a quantitatively unsound trading system could lose significant capital.

---

### 1. Overfitting / P-Hacking
**Scenario:** The strategy's edge is an artifact of data mining -- parameters optimized to historical noise, not signal.
**Risk Tier:** R1 (Signal/Alpha)
**The Test:** Can the strategy pass White's Reality Check or equivalent data-snooping tests? Does the backtest use walk-forward validation with proper purging? Were multiple parameter combinations tested and only the best reported?
**What Survives This:** Systems that use out-of-sample holdout periods, walk-forward optimization, combinatorial purged cross-validation, and report ALL parameter combinations tested (not just the winner). Statistical significance of returns should survive Bonferroni correction for multiple comparisons.
**Red Flags:** Only one backtest shown (the good one). No mention of how many parameter combinations were tested. In-sample and out-of-sample periods not clearly separated. Sharpe ratio looks too good (>3.0 on daily returns without justification).

### 2. Regime Change
**Scenario:** The strategy was developed during a specific market regime (low vol, trending, range-bound) and fails catastrophically when the regime changes.
**Risk Tier:** R1 (Signal/Alpha)
**The Test:** Has the strategy been tested across multiple regimes? Bull markets, bear markets, high volatility, low volatility, trending, mean-reverting? Does it have regime detection, and does that detection actually work or just overfit to historical regimes?
**What Survives This:** Systems with explicit regime detection that has been validated out-of-sample, strategy rotation mechanisms, and performance documentation across at least 3 distinct market regimes. Systems that acknowledge which regimes they DON'T work in.
**Red Flags:** Backtest only covers one regime. Regime detection trained on the same data used for strategy development. No acknowledgment of regime-dependent performance. "Works in all market conditions" without evidence.

### 3. Liquidity Crisis
**Scenario:** Market liquidity evaporates -- bid-ask spreads widen dramatically, order book depth disappears, market impact explodes.
**Risk Tier:** R2/R3 (Execution + Capital)
**The Test:** What happens when the system tries to exit a position and there are no bids? Does it account for liquidity as a variable (not a constant)? Does it reduce position size in thin markets?
**What Survives This:** Systems that monitor order book depth, adjust position sizing based on available liquidity, have maximum position size relative to daily volume, and can gracefully degrade when liquidity disappears (reduce size, widen stops, pause trading).
**Red Flags:** Position sizing ignores available liquidity. No maximum position as percentage of daily volume. Strategy assumes it can always exit at the current price. No circuit breaker for thin market conditions.

### 4. Execution Failure
**Scenario:** API goes down mid-trade, orders are stuck in unknown state, the system has open positions it can't manage.
**Risk Tier:** R4 (Systemic/Infrastructure)
**The Test:** What happens when Kalshi's API returns 500 errors during active positions? When an order submission times out? When the system restarts and needs to reconcile its believed state with actual exchange state?
**What Survives This:** Systems with robust state reconciliation on startup, order status polling, position verification independent of order tracking, API retry with exponential backoff, and fail-safe position closure mechanisms.
**Red Flags:** No state reconciliation on restart. System trusts its own order records without exchange verification. No retry logic for API failures. Single point of failure in API communication.

### 5. Correlation Blow-Up
**Scenario:** All strategies lose simultaneously because they share hidden correlation that only appears under stress.
**Risk Tier:** R3 (Capital/Drawdown)
**The Test:** Are the system's multiple strategies actually uncorrelated, or do they share underlying risk factors? Under stress conditions, do the correlations increase (as they always do in real markets)?
**What Survives This:** Systems that measure inter-strategy correlation under normal AND stressed conditions, apply portfolio-level risk limits (not just per-strategy limits), and have a master circuit breaker that triggers when too many strategies are losing simultaneously.
**Red Flags:** No inter-strategy correlation analysis. Each strategy has its own risk limits but no portfolio-level limit. Diversification claim based on backtested correlations that weren't tested under stress. More than 50% of strategies sharing the same underlying market direction bet.

### 6. Data Poisoning
**Scenario:** Market data feed is corrupted, stale, or delayed -- the system makes trading decisions on bad data.
**Risk Tier:** R4 (Systemic/Infrastructure)
**The Test:** What happens when price data is stale (last update was 30 minutes ago but system doesn't know)? When data contains errors (negative prices, impossible spreads)? When the data provider has an outage?
**What Survives This:** Systems with data freshness checks, anomaly detection on incoming data, multiple data source validation, and automatic trading pause when data quality degrades.
**Red Flags:** No data freshness validation. System trusts all incoming data without sanity checks. Single data source with no fallback. No monitoring for data quality degradation.

### 7. Capital Constraint
**Scenario:** Kelly criterion assumes ability to fractionally size positions -- but $152 is not enough to implement optimal Kelly across 17 strategies.
**Risk Tier:** R3 (Capital/Drawdown)
**The Test:** Is the system's position sizing actually implementable at the current capital level? Does it account for minimum contract sizes, maximum position limits, and the indivisibility of Kalshi contracts (you can't buy 0.3 contracts)?
**What Survives This:** Systems that scale Kelly fractions for small accounts (fractional Kelly -- typically 0.25x or 0.5x Kelly), account for minimum trade sizes, and honestly acknowledge when the capital base is too small for the number of strategies being run.
**Red Flags:** Kelly sizing that produces positions smaller than 1 contract. More strategies than capital can support. No fractional Kelly implementation. Theoretical position sizes that round to zero at current capital.

### 8. Fee Erosion
**Scenario:** Transaction costs (Kalshi fees + spread costs + any other friction) eat the strategy's edge entirely.
**Risk Tier:** R1/R2 (Signal + Execution)
**The Test:** What is the strategy's gross edge vs net edge after ALL costs? High-frequency strategies are most vulnerable. Does the backtest include realistic transaction cost modeling?
**What Survives This:** Systems that model all-in transaction costs (exchange fees, bid-ask spread crossing, market impact) in backtests, report both gross and net returns, and have a minimum edge threshold that accounts for cost uncertainty.
**Red Flags:** Backtest doesn't include transaction costs. Edge is less than 2x estimated costs (insufficient margin of safety). High-turnover strategies with thin edges. No sensitivity analysis on cost assumptions.

### 9. Flash Crash
**Scenario:** Contract prices move 50+ cents in seconds due to a black swan event, news shock, or market microstructure failure.
**Risk Tier:** R3 (Capital/Drawdown)
**The Test:** What happens when a binary contract price gaps from $0.50 to $0.95 in one tick? Does the stop-loss even execute? Can the system handle gapped markets where orders fill far beyond the stop level?
**What Survives This:** Systems with maximum position size limits (so even worst-case gap doesn't blow the account), pre-trade risk checks, maximum single-trade loss caps, and the understanding that stop-losses are not guaranteed fills in fast markets.
**Red Flags:** Stop-loss assumed to fill at exact price. No maximum position size relative to account. No pre-trade risk check. System trusts that continuous markets are actually continuous.

### 10. Black Swan Expiry
**Scenario:** An unexpected event resolves all open contracts against the system's positions simultaneously.
**Risk Tier:** R3/R4 (Capital + Systemic)
**The Test:** What is the maximum loss if EVERY open position settles at maximum loss? Is this survivable for the account? Is there concentration risk in correlated contracts that could all go wrong together?
**What Survives This:** Systems that calculate and limit maximum catastrophic loss (all positions wrong simultaneously), manage concentration risk across correlated contracts, and maintain enough dry powder to survive a total wipeout of all current positions.
**Red Flags:** Maximum catastrophic loss would exceed 50% of account. Heavy concentration in correlated contracts (e.g., all crypto, all political). No calculation of worst-case simultaneous loss. System assumes diversification protects against correlated events.

---

## Using This Framework

### For Expert Subagents
- Identify which 3-5 scenarios are most relevant to the system under evaluation
- Test rigorously against those scenarios -- depth over breadth
- For each tested scenario, produce a structured adversarial assessment per the schema in `schema.md`
- If the system introduces a novel risk not covered by the 10 standing scenarios, document it as an additional adversarial finding

### For Synthesis
- Track which scenarios were tested by which experts
- Convergence: 2+ experts flag the same scenario as problematic -> high-confidence finding
- Divergence: experts disagree on a scenario's severity -> genuine risk tension to investigate
- Coverage: ensure the most relevant scenarios (based on system characteristics) were tested by at least 2 experts
- Any scenario rated CRITICAL by any expert is a blocking finding regardless of other experts' ratings

### Scenario Relevance Guide

| If the system involves... | Prioritize scenarios... |
|---------------------------|------------------------|
| Backtested strategies | 1 (Overfitting), 2 (Regime Change), 8 (Fee Erosion) |
| Live trading | 3 (Liquidity), 4 (Execution Failure), 9 (Flash Crash) |
| Multiple strategies | 5 (Correlation), 7 (Capital Constraint), 2 (Regime Change) |
| Prediction markets | 10 (Black Swan Expiry), 3 (Liquidity), 7 (Capital Constraint) |
| API-dependent execution | 4 (Execution Failure), 6 (Data Poisoning), 9 (Flash Crash) |
| Small account (<$5K) | 7 (Capital Constraint), 8 (Fee Erosion), 9 (Flash Crash) |
| Automated (no human oversight) | 4 (Execution Failure), 5 (Correlation), 6 (Data Poisoning) |
