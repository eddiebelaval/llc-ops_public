# Trading Module -- Investment-Grade Evaluation Rubric

## The Critical Test

> "If you put significant capital behind this system and walked away for a month -- would you come back to more money or less?"

Every expert must explicitly answer this question for every system evaluated. This is not a thought experiment -- it is the load-bearing standard of this entire module.

---

## Overall Investment Rating

This module uses an investment-grade scale modeled on credit ratings. The cost of being wrong is measured in capital loss, not academic reputation.

| Rating | Grade | Meaning | Capital Recommendation |
|--------|-------|---------|----------------------|
| **AAA** | Exceptional | Verified profitable edge across regimes, robust risk management, production-hardened | Ready for significant capital allocation |
| **AA** | Strong | Consistent positive EV, minor gaps in coverage or testing | Suitable for moderate capital |
| **A** | Good | Demonstrated edge with addressable concerns | Cautious capital appropriate |
| **BBB** | Adequate | Some evidence of edge, material concerns remain | Paper trading + limited live |
| **BB** | Speculative | Potential edge but unproven or significant risks | Research/paper trading only |
| **B** | Weak | Limited evidence of edge, significant gaps | Needs substantial rework |
| **CCC** | Distressed | Known issues, unreliable, or actively losing | Do not trade |
| **D** | Default | System failure, blown account, critical bugs | Shut down and rebuild |

### Conservative Aggregation Rule

**If ANY expert rates CCC or below, the overall rating is CCC or below.** Investment ratings are not averaged. The most cautious expert's critical findings are not diluted by other experts' optimism. This is intentional -- capital preservation should never be averaged away.

Aggregation logic:
- All 3 experts rate AAA -> Overall: **AAA**
- Lowest expert rating is AA -> Overall: **AA**
- Lowest expert rating is A -> Overall: **A**
- Lowest expert rating is BBB -> Overall: **BBB**
- Lowest expert rating is BB -> Overall: **BB**
- Lowest expert rating is B -> Overall: **B**
- Any expert rates CCC -> Overall: **CCC**
- Any expert rates D -> Overall: **D**

---

## Per-Concern Severity Levels

Each individual concern raised by an expert carries a severity rating:

| Severity | Meaning | Action Required |
|----------|---------|-----------------|
| **CRITICAL** | Immediate risk of significant capital loss | Blocker. Cannot trade live without resolution. |
| **HIGH** | Material risk to capital or compliance | Must address before increasing capital. Requires specific mitigation plan. |
| **MEDIUM** | Notable concern with manageable risk | Should address. Acceptable to trade with documented mitigation and monitoring. |
| **LOW** | Minor concern or edge case | Track and address in iteration. Acceptable to trade as-is with awareness. |

---

## Risk Tiers

Concerns are classified by the TYPE of risk, not just severity. This helps prioritize across different risk surfaces.

| Tier | Domain | Examples | Escalation |
|------|--------|----------|------------|
| **R1** | Signal/Alpha | Signal degradation, overfitting, edge decay, regime mismatch | Investigate signal persistence. May require strategy rotation or retirement. |
| **R2** | Execution | Slippage, market impact, API latency, order management failure | Requires execution quality monitoring. May need order type changes. |
| **R3** | Capital/Drawdown | Excessive drawdown, position sizing errors, leverage blow-up, margin of ruin | Hard blocker at CRITICAL severity. Requires immediate risk reduction. |
| **R4** | Systemic/Infrastructure | API failure cascade, data pipeline corruption, monitoring gaps, correlation blow-up | Requires infrastructure hardening. Cannot scale capital without resolution. |

### Tier Interaction Rules

- An R3 concern at ANY severity level must be explicitly addressed with a mitigation plan
- An R4 concern requires system-level testing, not just strategy-level analysis
- R1 and R2 concerns at CRITICAL severity escalate to the same urgency as R3
- Multiple R1 concerns can compound into R3 risk (correlated strategy failure = portfolio-level capital risk)

---

## Secondary Grade (Quant Quality Score)

In addition to the investment rating, each expert also assigns a traditional quality grade. This provides a secondary signal for comparing across evaluations and tracking improvement over time.

| Grade | Meaning |
|-------|---------|
| A+ | Exceptional quantitative rigor -- institutional-grade methodology and implementation |
| A | Excellent -- thorough, statistically sound, well-risk-managed |
| A- | Very good -- sound quantitative basis with 1-2 minor gaps |
| B+ | Good -- solid framework with notable gaps to address |
| B | Adequate -- reasonable approach but needs significant strengthening |
| B- | Below expectations -- fundamental quantitative gaps, but salvageable |
| C+ | Weak -- major quantitative concerns, requires substantial rework |
| C | Poor -- system does not meet minimum quantitative standards |
| D/F | Reject -- risk of significant capital loss without major reconceptualization |

The quality grade is informational -- it does NOT override the investment rating. A system can receive an A- quality grade but still be rated BB if specific risk concerns exist.

---

## Evaluation Dimensions

| Dimension | Weight | Question It Answers | Primary Experts |
|-----------|--------|---------------------|----------------|
| Signal Quality | 15% | Are strategies finding real edges or noise? | Webb, Krawczyk, Blackwood |
| Risk Management | 15% | Is capital preserved? Drawdowns controlled? | Tanaka, Webb |
| Execution Quality | 10% | Slippage, timing, order management adequate? | Desai, Krawczyk |
| System Reliability | 10% | Uptime, self-healing, recovery from failures? | Vasquez |
| Strategy Diversity | 10% | Uncorrelated strategies? Genuine portfolio diversification? | Whitfield, Blackwood |
| Adaptability | 10% | Regime detection working? Strategy rotation sound? | Hassan, Krawczyk |
| Capital Efficiency | 10% | Kelly optimization? Position sizing appropriate? | Webb, Tanaka |
| Data Integrity | 5% | Clean pipelines? No look-ahead or survivorship bias? | Cheng |
| Regulatory Compliance | 5% | CFTC rules? Kalshi position limits? No manipulation risk? | Castellano |
| Performance Measurement | 5% | Attribution accurate? Benchmarks appropriate? | Cheng, Webb |
| Behavioral Soundness | 2.5% | Human-bot firewall? Override policies clear? | Hassan, Sullivan |
| Communication Quality | 2.5% | Captain's Log useful? Telegram alerts calibrated? | Sullivan |

---

## Rating Interpretation and Actions

| Rating | Knowledge Base Action | Queue Action |
|--------|----------------------|--------------|
| **AAA** | Promote to findings with "Investment validated" tag | No follow-up required |
| **AA** | Promote with "Strong -- minor gaps noted" tag | Generate targeted briefs for gap areas |
| **A** | Promote as provisional with specific conditions | Generate improvement briefs for each concern |
| **BBB** | Log in thesis-registry with conditions for upgrade | Generate focused investigation briefs |
| **BB** | Log in thesis-registry ONLY -- do NOT promote to findings | Generate redesign briefs for each material concern |
| **B** | Log in thesis-registry with significant rework requirements | Generate blocking briefs for each major gap |
| **CCC** | Log with CRITICAL flag. Add to contradictions if relevant | Generate blocking brief. System cannot trade live. |
| **D** | Log with DEFAULT flag. System must be shut down | Generate rebuild brief. All capital must be withdrawn. |

---

## Methodology Coverage Requirement

Every trading evaluation must produce a methodology coverage map showing which quantitative methods are:
- **FULL** -- Fully applied and validated by the system
- **PARTIAL** -- Partially applied (with gaps noted)
- **MISSING** -- Not applied at all (with recommendation for whether it should be)

Low methodology coverage is not automatically a problem -- not every system needs every statistical test. But if a system makes performance claims in a domain where validated methods exist and fails to apply them, that is a gap.
