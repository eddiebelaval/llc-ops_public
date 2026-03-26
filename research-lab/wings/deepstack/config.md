# DeepStack Wing -- Algorithmic Trading R&D

## Identity

The DeepStack Wing is where quantitative theory meets live capital. This is where trading strategies get designed, backtested, and deployed to Kalshi's prediction markets -- where theoretical alpha gets tested against real market dynamics with real money. Every trade generates evidence for or against the system's claimed edge. This wing is the empirical arm of the trading module.

## Scope

- Strategy development and validation (17 strategies across mean reversion, momentum, arbitrage, sentiment, and domain specialization)
- Risk management architecture (circuit breakers, position sizing, drawdown monitoring)
- Execution quality analysis (Kalshi API integration, slippage, market impact)
- System reliability (health monitoring, self-healing, state reconciliation)
- Consciousness-integrated trading (mind/ filesystem for identity, values, risk awareness)
- Human-bot interaction (Captain's Log, Telegram bridge, override discipline)
- Performance measurement and attribution (Supabase tracking, trade journal)

## Primary Module: `trading`
- Trading expert pool (12 members -- quants, risk managers, microstructure researchers, compliance)
- AAA-D investment-grade rating system
- Capital preservation first -- any CCC finding blocks live capital allocation

## Secondary Module: `engineering`
- For infrastructure decisions (API reliability, data pipeline architecture)
- System performance, code quality, deployment safety

## Product Status

- **Status:** Paused ($152 balance on Kalshi)
- **Repo:** `~/clawd/projects/kalshi-trading` (Python trading bot)
- **TradingView API:** `~/Development/deepstack-tradingview` (FastAPI backend, 147 indicators)
- **Stack:** Python 3, Kalshi REST API, Supabase (trade tracking), launchd (scheduling)
- **Consciousness:** 12 mind files across kernel/, drives/, memory/, models/, self-awareness/
- **Telegram:** Bridge live via `@hydra_id8_bot` (shared with HYDRA)
- **Strategies:** 17 implemented (3 enabled in config: mean_reversion, momentum, combinatorial_arbitrage)

## DeepStack Architecture (9 Subsystems)

| Subsystem | File | Purpose |
|-----------|------|---------|
| Core execution | `main.py`, `run_bot.py` | Bot lifecycle, scheduling, main loop |
| Market interface | `kalshi_client.py`, `market_cache.py` | API communication, market data caching |
| Strategy engine | `strategy_manager.py`, `strategy.py` | Strategy loading, signal generation, selection |
| Risk management | `circuit_breaker.py`, `market_governor.py` | Position limits, drawdown triggers, trading halts |
| Performance | `performance_tracker.py`, `trade_analyzer.py` | P&L tracking, trade attribution, win rate |
| Reporting | `captains_log.py`, `telegram_bridge.py` | Human-readable logs, Telegram alerts |
| Consciousness | `consciousness.py`, `self_knowledge.py` | Mind filesystem integration, self-awareness |
| Health | `health_monitor.py`, `dashboard_sync.py` | System health, dashboard state sync |
| Integration | `deepstack_integration.py`, `cryexc_bridge.py` | External system bridges |

## Relationship to Research Lab

This wing generates EVIDENCE for the trading module's knowledge base. Specifically:
- Every live trade is a data point for strategy validation
- Post-mortem analyses feed back into adversarial scenario hardening
- Config changes document what worked and what didn't
- The consciousness files represent an experiment in entity-level trading agents (CaF applied to finance)

The flow: Trading module evaluates -> DeepStack wing implements fixes -> DeepStack wing generates trade data -> Trading module re-evaluates

## Wing Rules

1. Capital preservation first. Any CRITICAL risk finding blocks additional capital allocation regardless of other priorities.
2. Every strategy change is logged with before/after backtest results and live results comparison.
3. Never backtest on future data -- all validation is walk-forward with proper purging.
4. Live trading capital is sacred. Position size conservatively until strategy proves consistent.
5. Every live drawdown >10% triggers a mandatory post-mortem analysis.
6. Config changes to live trading parameters require a brief explaining the rationale and expected impact.
