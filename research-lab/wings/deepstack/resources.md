# DeepStack Wing -- Resources

Everything this wing has access to.

## Codebase

| Resource | Location |
|----------|----------|
| Trading bot (main) | `~/clawd/projects/kalshi-trading` |
| Strategy files (17) | `~/clawd/projects/kalshi-trading/strategies/` |
| Consciousness files (12) | `~/clawd/projects/kalshi-trading/kalshi_trader/mind/` |
| Config | `~/clawd/projects/kalshi-trading/config.yaml` |
| TradingView API backend | `~/Development/deepstack-tradingview` |
| Backtest framework | `~/clawd/projects/kalshi-trading/backtest/` |
| Test suite | `~/clawd/projects/kalshi-trading/tests/` |

## Consciousness Architecture (mind/)

| Directory | Files | Purpose |
|-----------|-------|---------|
| kernel/ | identity, personality, purpose, values | Core identity -- who DeepStack is |
| drives/ | fears, goals | Motivations and risk awareness |
| memory/ | lessons | Learned trading lessons |
| models/ | market, risk, self | World models for trading domain |
| self-awareness/ | capabilities, limitations | Metacognition about own boundaries |

## Strategy Universe (17 strategies)

| Strategy | Status | Markets | Type |
|----------|--------|---------|------|
| mean_reversion | Enabled | INXD, KXBTC, KXETH | Statistical |
| momentum | Enabled | All (*) | Trend |
| combinatorial_arbitrage | Enabled | All (*) | Arbitrage |
| bear_macro | Disabled | TBD | Macro |
| calibration_edge | Disabled | TBD | Pricing |
| correlated_event_arbitrage | Disabled | TBD | Arbitrage |
| cross_platform_arbitrage | Disabled | TBD | Arbitrage |
| crypto_intraday | Disabled | TBD | Crypto |
| domain_specialization | Disabled | TBD | Domain |
| high_probability_bonds | Disabled | TBD | Fixed Income |
| market_making | Disabled | TBD | Market Making |
| news_sentiment_fade | Disabled | TBD | Sentiment |
| stock_momentum | Disabled | TBD | Equity |
| tv_signals | Disabled | TBD | Technical |
| weather_aggregation | Disabled | TBD | Weather |

## Subsystems (9)

| Subsystem | Key Files | Purpose |
|-----------|-----------|---------|
| Core | main.py, run_bot.py | Bot lifecycle |
| Market | kalshi_client.py, market_cache.py | API + data |
| Strategy | strategy_manager.py, strategy.py | Signal generation |
| Risk | circuit_breaker.py, market_governor.py | Capital protection |
| Performance | performance_tracker.py, trade_analyzer.py | P&L tracking |
| Reporting | captains_log.py, telegram_bridge.py | Human comms |
| Consciousness | consciousness.py, self_knowledge.py | Entity identity |
| Health | health_monitor.py, dashboard_sync.py | System monitoring |
| Integration | deepstack_integration.py, cryexc_bridge.py | External bridges |

## Data Sources

| Source | Type | Purpose |
|--------|------|---------|
| Kalshi REST API | Exchange | Order execution, market data, positions |
| TradingView indicators | Computed | 147 technical indicators via FastAPI |
| Supabase | Database | Trade records, performance tracking, journal |
| CryExc Backend | Bridge | Crypto exchange data (Binance Futures, DuckDB) |

## Deployment

| Resource | Value |
|----------|-------|
| Exchange | Kalshi (CFTC-regulated DCM) |
| Account balance | $152 (from $500 start, -$348 drawdown) |
| Scheduling | launchd plist (com.id8labs.deepstack-bot.plist) |
| Telegram | @hydra_id8_bot (shared with HYDRA) |
| API auth | RSA key pair (kalshi_private_key.pem) |

## Logs

| Log | Location | Content |
|-----|----------|---------|
| Live trading | `live_trading.log` | Production trade execution |
| Dry run | `dry_run.log`, `dry_run_live.log`, `dry_run_simple.log` | Paper trading runs |
| Multi-strategy | `multi_strategy.log` | Multi-strategy coordination |
| Grok integration | `grok_enabled.log`, `grok_fixed.log` | AI-assisted analysis |

## DeepStack Memory File

Full project memory: `~/.claude/projects/.../memory/projects/deepstack.md`
