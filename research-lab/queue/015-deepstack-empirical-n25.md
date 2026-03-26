# Dae Empirical Assessment Brief

**Trigger:** n=25
**Mode:** PAPER TRADING
**Period:** 2026-02-08 to 2026-03-06
**Generated:** 2026-03-06 20:27

## Assessment Request

Evaluate Dae's empirical trading performance based on 52 closed trades. Previous code-only assessments reached B+ (empirical wall). This brief provides the first empirical data for expert evaluation.

## Aggregate Statistics

| Metric | Value |
|--------|-------|
| Total Trades | 52 |
| Win Rate | 28.8% |
| Total P&L | +857c ($+8.57) |
| Avg P&L/Trade | +16.5c |
| Profit Factor | 1.07 |
| Largest Win | +4230c |
| Largest Loss | -1176c |
| Avg Winner | +904.9c |
| Avg Loser | -343.7c |

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

- Trades: 8 (W: 6, L: 2)
- Win Rate: 75.0%
- P&L: -685c ($-6.85)
- Avg: -85.6c/trade

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
| 46 | KXCPI-26FEB-T0.3 | calibration_edge | no | 1 | 88c | Nonec | open | None |
| 47 | KXBTC-26MAR0617-B69500 | calibration_edge | no | 1 | 87c | 100c | +13c | settlement:no |
| 48 | KXBTC-26MAR0611-B68375 | calibration_edge | no | 1 | 92c | 76c | -20c | stop_loss |
| 49 | KXBTC-26MAR0617-B70500 | calibration_edge | no | 1 | 92c | Nonec | open | None |
| 50 | KXBTC-26MAR0617-B71500 | calibration_edge | no | 1 | 95c | Nonec | open | None |
| 51 | KXETH-26MAR0617-B2060 | calibration_edge | no | 1 | 88c | Nonec | open | None |
| 52 | KXBTC-26MAR0617-B68000 | calibration_edge | no | 3 | 88c | Nonec | open | None |
| 53 | KXBTC-26MAR0617-B67500 | calibration_edge | no | 3 | 91c | Nonec | open | None |
| 54 | KXBTC-26MAR0617-B70000 | calibration_edge | no | 3 | 89c | Nonec | open | None |
| 55 | KXBTC-26MAR0611-B69375 | calibration_edge | no | 4 | 87c | 100c | +52c | settlement:no |
| 56 | KXBTC-26MAR0617-B68500 | calibration_edge | no | 4 | 85c | Nonec | open | None |
| 57 | KXETH-26MAR0611-B2010 | calibration_edge | no | 4 | 92c | 100c | +32c | settlement:no |
| 58 | KXBTC-26MAR0617-B67000 | calibration_edge | no | 4 | 93c | Nonec | open | None |
| 59 | KXBTC-26MAR0611-B69125 | calibration_edge | no | 4 | 93c | 100c | +28c | settlement:no |
| 60 | KXGDP-26APR30-T4.0 | calibration_edge | no | 1 | 85c | Nonec | open | None |
| 61 | KXBTC-26MAR0611-B68875 | calibration_edge | no | 1 | 92c | 100c | +8c | settlement:no |
| 62 | KXETH-26MAR0611-B1950 | calibration_edge | no | 1 | 88c | 100c | +12c | settlement:no |
| 63 | KXCPI-26FEB-T0.1 | calibration_edge | yes | 15 | 89c | Nonec | open | None |
| 64 | KXETH-26MAR0617-B1900 | calibration_edge | no | 15 | 91c | Nonec | open | None |
| 65 | KXBTC-26MAR0612-B68375 | calibration_edge | no | 15 | 83c | 33c | -810c | stop_loss |
| 66 | KXBTC-26MAR0612-B69125 | calibration_edge | no | 62 | 87c | Nonec | open | None |
| 67 | KXBTC-26MAR0617-B66500 | calibration_edge | no | 62 | 95c | Nonec | open | None |
| 68 | KXBTC-26MAR0612-B68875 | calibration_edge | no | 62 | 91c | Nonec | open | None |
| 69 | KXFED-26APR-T3.75 | calibration_edge | no | 62 | 95c | Nonec | open | None |
| 70 | KXBTC-26MAR0617-B69000 | calibration_edge | no | 62 | 83c | Nonec | open | None |
| 71 | KXETH-26MAR0612-B1950 | calibration_edge | no | 62 | 83c | Nonec | open | None |
| 72 | KXBTC-26MAR0612-B67875 | calibration_edge | no | 62 | 86c | Nonec | open | None |
| 73 | KXCPI-26FEB-T0.4 | calibration_edge | no | 62 | 95c | Nonec | open | None |
| 74 | KXBTC-26MAR0612-B68125 | calibration_edge | no | 62 | 80c | Nonec | open | None |
| 75 | KXFED-26APR-T3.50 | calibration_edge | yes | 62 | 77c | Nonec | open | None |
| 76 | KXETH-26MAR0617-B2020 | calibration_edge | no | 62 | 78c | Nonec | open | None |
| 77 | KXETH-26MAR0612-B1990 | calibration_edge | no | 62 | 83c | Nonec | open | None |
| 78 | KXGDP-26APR30-T3.5 | calibration_edge | no | 62 | 74c | Nonec | open | None |
| 79 | KXETH-26MAR0617-B1940 | calibration_edge | no | 62 | 73c | Nonec | open | None |
| 80 | KXGDP-26APR30-T4.5 | calibration_edge | no | 62 | 94c | Nonec | open | None |
| 81 | KXCPI-26MAR-T0.2 | calibration_edge | yes | 62 | 83c | Nonec | open | None |
| 82 | KXETH-26MAR0612-B1970 | calibration_edge | yes | 62 | 75c | Nonec | open | None |
| 83 | KXGDP-26APR30-T3.0 | calibration_edge | no | 62 | 69c | Nonec | open | None |

## Open Positions (31)

- KXGDP-26APR30-T2.0: no 9 @ 77c (momentum)
- KXCPI-26FEB-T0.3: no 1 @ 88c (calibration_edge)
- KXBTC-26MAR0617-B70500: no 1 @ 92c (calibration_edge)
- KXBTC-26MAR0617-B71500: no 1 @ 95c (calibration_edge)
- KXETH-26MAR0617-B2060: no 1 @ 88c (calibration_edge)
- KXBTC-26MAR0617-B68000: no 3 @ 88c (calibration_edge)
- KXBTC-26MAR0617-B67500: no 3 @ 91c (calibration_edge)
- KXBTC-26MAR0617-B70000: no 3 @ 89c (calibration_edge)
- KXBTC-26MAR0617-B68500: no 4 @ 85c (calibration_edge)
- KXBTC-26MAR0617-B67000: no 4 @ 93c (calibration_edge)
- KXGDP-26APR30-T4.0: no 1 @ 85c (calibration_edge)
- KXCPI-26FEB-T0.1: yes 15 @ 89c (calibration_edge)
- KXETH-26MAR0617-B1900: no 15 @ 91c (calibration_edge)
- KXBTC-26MAR0612-B69125: no 62 @ 87c (calibration_edge)
- KXBTC-26MAR0617-B66500: no 62 @ 95c (calibration_edge)
- KXBTC-26MAR0612-B68875: no 62 @ 91c (calibration_edge)
- KXFED-26APR-T3.75: no 62 @ 95c (calibration_edge)
- KXBTC-26MAR0617-B69000: no 62 @ 83c (calibration_edge)
- KXETH-26MAR0612-B1950: no 62 @ 83c (calibration_edge)
- KXBTC-26MAR0612-B67875: no 62 @ 86c (calibration_edge)
- KXCPI-26FEB-T0.4: no 62 @ 95c (calibration_edge)
- KXBTC-26MAR0612-B68125: no 62 @ 80c (calibration_edge)
- KXFED-26APR-T3.50: yes 62 @ 77c (calibration_edge)
- KXETH-26MAR0617-B2020: no 62 @ 78c (calibration_edge)
- KXETH-26MAR0612-B1990: no 62 @ 83c (calibration_edge)
- KXGDP-26APR30-T3.5: no 62 @ 74c (calibration_edge)
- KXETH-26MAR0617-B1940: no 62 @ 73c (calibration_edge)
- KXGDP-26APR30-T4.5: no 62 @ 94c (calibration_edge)
- KXCPI-26MAR-T0.2: yes 62 @ 83c (calibration_edge)
- KXETH-26MAR0612-B1970: yes 62 @ 75c (calibration_edge)
- KXGDP-26APR30-T3.0: no 62 @ 69c (calibration_edge)

## Expert Panel Guidance

This is paper trading data. Experts should evaluate:
1. Is the observed win rate statistically significant (vs break-even)?
2. Is the profit factor sustainable or likely to revert?
3. Are there strategy-specific concerns in the per-strategy breakdown?
4. What is the appropriate investment-grade rating given this evidence?
5. What additional data/trades are needed before advancing the rating?