# DeepStack Empirical Assessment Brief

**Trigger:** n=25
**Mode:** PAPER TRADING
**Period:** 2026-02-08 to 2026-03-04
**Generated:** 2026-03-04 18:22

## Assessment Request

Evaluate DeepStack's empirical trading performance based on 46 closed trades. Previous code-only assessments reached B+ (empirical wall). This brief provides the first empirical data for expert evaluation.

## Aggregate Statistics

| Metric | Value |
|--------|-------|
| Total Trades | 46 |
| Win Rate | 19.6% |
| Total P&L | +1499c ($+14.99) |
| Avg P&L/Trade | +32.6c |
| Profit Factor | 1.13 |
| Largest Win | +4230c |
| Largest Loss | -1176c |
| Avg Winner | +1492.1c |
| Avg Loser | -322.4c |

## By Strategy

### market_making

- Trades: 39 (W: 6, L: 33)
- Win Rate: 15.4%
- P&L: +1641c ($+16.41)
- Avg: +42.1c/trade

### momentum

- Trades: 2 (W: 2, L: 0)
- Win Rate: 100.0%
- P&L: +124c ($+1.24)
- Avg: +62.0c/trade

### mean_reversion

- Trades: 3 (W: 1, L: 2)
- Win Rate: 33.3%
- P&L: -223c ($-2.23)
- Avg: -74.3c/trade

### calibration_edge

- Trades: 2 (W: 0, L: 2)
- Win Rate: 0.0%
- P&L: -43c ($-0.43)
- Avg: -21.5c/trade

## Trade Log

| # | Ticker | Strategy | Side | Contracts | Entry | Exit | P&L | Reason |
|---|--------|----------|------|-----------|-------|------|-----|--------|
| 1 | KXBTC-26FEB0821-B70875 | market_making | yes | 24 | 19c | 0c | -456c | settlement:no |
| 2 | KXBTC-26FEB0821-B70875 | market_making | yes | 24 | 21c | 0c | -504c | settlement:no |
| 3 | KXBTC-26FEB0821-B70375 | market_making | yes | 24 | 13c | 100c | +2088c | settlement:yes |
| 4 | KXBTC-26FEB0821-B70875 | market_making | yes | 24 | 23c | 0c | -552c | settlement:no |
| 5 | KXBTC-26FEB0821-B70875 | market_making | yes | 24 | 23c | 0c | -552c | settlement:no |
| 6 | KXBTC-26FEB0821-B70875 | market_making | yes | 24 | 24c | 0c | -576c | settlement:no |
| 7 | KXBTC-26FEB0821-B70875 | market_making | yes | 24 | 24c | 0c | -576c | settlement:no |
| 8 | KXBTC-26FEB0821-B70875 | market_making | yes | 23 | 8c | 0c | -184c | settlement:no |
| 9 | KXBTC-26FEB0821-B70875 | market_making | yes | 23 | 8c | 0c | -184c | settlement:no |
| 10 | KXBTC-26FEB0821-B70625 | market_making | yes | 23 | 22c | 0c | -506c | settlement:no |
| 11 | KXBTC-26FEB0821-B70625 | market_making | yes | 23 | 22c | 0c | -506c | settlement:no |
| 12 | KXBTC-26FEB0917-B73250 | momentum | no | 31 | 98c | 100c | +62c | settlement:no |
| 13 | KXBTC-26FEB0917-B73250 | momentum | no | 31 | 98c | 100c | +62c | settlement:no |
| 14 | KXBTC-26FEB0821-B70625 | market_making | yes | 22 | 6c | 0c | -132c | settlement:no |
| 15 | KXBTC-26FEB0821-B70625 | market_making | yes | 22 | 6c | 0c | -132c | settlement:no |
| 16 | KXBTC-26FEB0821-B70625 | market_making | yes | 22 | 8c | 0c | -176c | settlement:no |
| 17 | KXBTC-26FEB0821-B70625 | market_making | yes | 22 | 8c | 11c | +66c | take_profit |
| 18 | KXBTC-26FEB0821-B70375 | market_making | yes | 43 | 26c | 100c | +3182c | settlement:yes |
| 19 | KXBTC-26FEB0821-B70375 | market_making | yes | 33 | 26c | 100c | +2442c | settlement:yes |
| 20 | KXGDP-26APR30-T2.0 | momentum | no | 9 | 77c | Nonec | open | None |
| 21 | KXETH-26FEB0900-B2110 | market_making | yes | 49 | 22c | 0c | -1078c | settlement:no |
| 22 | KXETH-26FEB0900-B2110 | market_making | yes | 49 | 24c | 0c | -1176c | settlement:no |
| 23 | KXETH-26FEB0900-B2110 | market_making | yes | 49 | 21c | 0c | -1029c | settlement:no |
| 24 | KXETH-26FEB0917-B2080 | market_making | yes | 49 | 17c | 0c | -833c | settlement:no |
| 25 | KXBTC-26FEB0917-B72250 | market_making | yes | 5 | 7c | 0c | -35c | settlement:no |
| 26 | KXBTC-26FEB0917-B70250 | market_making | yes | 45 | 6c | 100c | +4230c | settlement:yes |
| 27 | KXBTC-26FEB0917-B68750 | market_making | yes | 45 | 12c | 0c | -540c | settlement:no |
| 28 | KXBTC-26FEB0917-B68750 | market_making | yes | 46 | 12c | 0c | -552c | settlement:no |
| 29 | KXBTC-26FEB0917-B68250 | market_making | yes | 5 | 10c | 0c | -50c | settlement:no |
| 30 | KXBTC-26FEB0917-B72250 | market_making | yes | 39 | 4c | 0c | -156c | settlement:no |
| 31 | KXBTC-26FEB0917-B72750 | market_making | yes | 9 | 2c | 0c | -18c | settlement:no |
| 32 | KXBTC-26FEB0917-B72750 | market_making | yes | 23 | 2c | 0c | -46c | settlement:no |
| 33 | KXBTC-26FEB0917-B72750 | market_making | yes | 23 | 2c | 0c | -46c | settlement:no |
| 34 | KXBTC-26FEB0917-B72750 | market_making | yes | 23 | 2c | 0c | -46c | settlement:no |
| 35 | KXBTC-26FEB0917-B72750 | market_making | yes | 23 | 2c | 0c | -46c | settlement:no |
| 36 | KXBTC-26FEB0917-B72750 | market_making | yes | 25 | 2c | 0c | -50c | settlement:no |
| 37 | KXBTC-26FEB0917-B71250 | market_making | yes | 38 | 6c | 0c | -228c | settlement:no |
| 38 | KXBTC-26FEB0917-B70250 | market_making | yes | 14 | 8c | 100c | +1288c | settlement:yes |
| 39 | KXBTC-26FEB0911-B68875 | market_making | yes | 30 | 6c | 0c | -180c | settlement:no |
| 40 | KXBTC-26FEB0911-B69625 | market_making | yes | 38 | 20c | 11c | -342c | stop_loss |
| 41 | KXBTC-26FEB0917-B71750 | market_making | yes | 37 | 4c | 0c | -148c | settlement:no |
| 42 | KXBTC-26FEB0911-B68875 | market_making | yes | 4 | 5c | 0c | -20c | settlement:no |
| 43 | KXETH-26FEB1417-B2050 | mean_reversion | yes | 28 | 44c | 36c | -224c | stop_loss |
| 44 | KXBTC-26MAR0409-B71375 | mean_reversion | yes | 1 | 45c | 54c | +9c | take_profit |
| 45 | KXBTC-26MAR0409-B71375 | mean_reversion | no | 1 | 46c | 38c | -8c | stop_loss |
| 46 | KXBTC-26MAR0617-B72500 | calibration_edge | no | 1 | 93c | Nonec | open | None |
| 47 | KXCPI-26FEB-T0.3 | calibration_edge | no | 1 | 87c | Nonec | open | None |
| 48 | KXCPI-26FEB-T0.4 | calibration_edge | no | 1 | 95c | Nonec | open | None |
| 49 | KXBTC-26MAR0617-B73500 | calibration_edge | no | 1 | 92c | Nonec | open | None |
| 50 | KXBTC-26MAR0617-B74500 | calibration_edge | no | 1 | 92c | Nonec | open | None |
| 51 | KXBTC-26MAR0617-B73000 | calibration_edge | no | 1 | 92c | Nonec | open | None |
| 52 | KXBTC-26MAR0418-B72875 | calibration_edge | no | 1 | 93c | 74c | -23c | stop_loss |
| 53 | KXBTC-26MAR0617-B72000 | calibration_edge | no | 1 | 92c | Nonec | open | None |
| 54 | KXBTC-26MAR0617-B71000 | calibration_edge | no | 1 | 94c | Nonec | open | None |
| 55 | KXBTC-26MAR0418-B73625 | calibration_edge | no | 1 | 87c | Nonec | open | None |
| 56 | KXCPI-26FEB-T0.0 | calibration_edge | yes | 1 | 95c | Nonec | open | None |
| 57 | KXBTC-26MAR0617-B74000 | calibration_edge | no | 1 | 91c | Nonec | open | None |
| 58 | KXCPI-26FEB-T0.1 | calibration_edge | yes | 1 | 88c | Nonec | open | None |
| 59 | KXBTC-26MAR0617-B70500 | calibration_edge | no | 1 | 95c | Nonec | open | None |
| 60 | KXBTC-26MAR0617-B71500 | calibration_edge | no | 1 | 94c | Nonec | open | None |
| 61 | KXBTC-26MAR0418-B72625 | calibration_edge | yes | 1 | 95c | Nonec | open | None |
| 62 | KXBTC-26MAR0617-B75000 | calibration_edge | no | 1 | 94c | Nonec | open | None |
| 63 | KXFED-26APR-T3.75 | calibration_edge | no | 1 | 94c | Nonec | open | None |
| 64 | KXBTC-26MAR0419-B73375 | calibration_edge | no | 1 | 94c | Nonec | open | None |
| 65 | KXBTC-26MAR0517-B73250 | calibration_edge | no | 1 | 87c | Nonec | open | None |
| 66 | KXETH-26MAR0617-B2020 | calibration_edge | no | 1 | 90c | Nonec | open | None |
| 67 | KXETH-26MAR0617-B2060 | calibration_edge | no | 1 | 86c | Nonec | open | None |
| 68 | KXGDP-26APR30-T4.0 | calibration_edge | no | 1 | 82c | Nonec | open | None |
| 69 | KXGDP-26APR30-T1.0 | calibration_edge | yes | 1 | 83c | Nonec | open | None |
| 70 | KXBTC-26MAR0517-B71750 | calibration_edge | no | 1 | 91c | Nonec | open | None |
| 71 | KXFED-26APR-T3.50 | calibration_edge | yes | 1 | 85c | Nonec | open | None |
| 72 | KXGDP-26APR30-T1.5 | calibration_edge | yes | 1 | 73c | Nonec | open | None |
| 73 | KXBTC-26MAR0419-B72375 | calibration_edge | no | 1 | 87c | 71c | -20c | stop_loss |

## Open Positions (27)

- KXGDP-26APR30-T2.0: no 9 @ 77c (momentum)
- KXBTC-26MAR0617-B72500: no 1 @ 93c (calibration_edge)
- KXCPI-26FEB-T0.3: no 1 @ 87c (calibration_edge)
- KXCPI-26FEB-T0.4: no 1 @ 95c (calibration_edge)
- KXBTC-26MAR0617-B73500: no 1 @ 92c (calibration_edge)
- KXBTC-26MAR0617-B74500: no 1 @ 92c (calibration_edge)
- KXBTC-26MAR0617-B73000: no 1 @ 92c (calibration_edge)
- KXBTC-26MAR0617-B72000: no 1 @ 92c (calibration_edge)
- KXBTC-26MAR0617-B71000: no 1 @ 94c (calibration_edge)
- KXBTC-26MAR0418-B73625: no 1 @ 87c (calibration_edge)
- KXCPI-26FEB-T0.0: yes 1 @ 95c (calibration_edge)
- KXBTC-26MAR0617-B74000: no 1 @ 91c (calibration_edge)
- KXCPI-26FEB-T0.1: yes 1 @ 88c (calibration_edge)
- KXBTC-26MAR0617-B70500: no 1 @ 95c (calibration_edge)
- KXBTC-26MAR0617-B71500: no 1 @ 94c (calibration_edge)
- KXBTC-26MAR0418-B72625: yes 1 @ 95c (calibration_edge)
- KXBTC-26MAR0617-B75000: no 1 @ 94c (calibration_edge)
- KXFED-26APR-T3.75: no 1 @ 94c (calibration_edge)
- KXBTC-26MAR0419-B73375: no 1 @ 94c (calibration_edge)
- KXBTC-26MAR0517-B73250: no 1 @ 87c (calibration_edge)
- KXETH-26MAR0617-B2020: no 1 @ 90c (calibration_edge)
- KXETH-26MAR0617-B2060: no 1 @ 86c (calibration_edge)
- KXGDP-26APR30-T4.0: no 1 @ 82c (calibration_edge)
- KXGDP-26APR30-T1.0: yes 1 @ 83c (calibration_edge)
- KXBTC-26MAR0517-B71750: no 1 @ 91c (calibration_edge)
- KXFED-26APR-T3.50: yes 1 @ 85c (calibration_edge)
- KXGDP-26APR30-T1.5: yes 1 @ 73c (calibration_edge)

## Expert Panel Guidance

This is paper trading data. Experts should evaluate:
1. Is the observed win rate statistically significant (vs break-even)?
2. Is the profit factor sustainable or likely to revert?
3. Are there strategy-specific concerns in the per-strategy breakdown?
4. What is the appropriate investment-grade rating given this evidence?
5. What additional data/trades are needed before advancing the rating?