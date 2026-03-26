# Trading Module -- Expert Output Schema

Each expert subagent MUST return valid JSON matching this schema. No deviations.

```json
{
  "expert": "Full role name (e.g., Quantitative Analyst)",
  "overall_investment_rating": "AAA | AA | A | BBB | BB | B | CCC | D",
  "quality_grade": "A+ | A | A- | B+ | B | B- | C+ | C | D | F",
  "confidence": 0.85,
  "summary": "2-3 sentence investment-grade assessment of this trading system",

  "strengths": [
    {
      "title": "Short label",
      "detail": "What specifically is quantitatively sound and why",
      "quantitative_basis": "Reference to validated methodology, statistical test, established quantitative framework, or empirical evidence"
    }
  ],

  "concerns": [
    {
      "title": "Short label",
      "detail": "What specifically poses a risk and why",
      "severity": "CRITICAL | HIGH | MEDIUM | LOW",
      "risk_tier": "R1 | R2 | R3 | R4",
      "affected_component": "Which specific system component is at risk (be specific -- not 'the strategy' but 'mean_reversion strategy position sizing on KXBTC contracts during low-liquidity hours')",
      "recommendation": "Specific, actionable mitigation -- not 'improve risk management' but 'implement X methodology with Y parameters'",
      "quantitative_basis": "Reference to quantitative method, empirical evidence, regulatory standard, or established risk framework that identifies this as a risk"
    }
  ],

  "risk_matrix": [
    {
      "scenario": "Specific trading scenario (e.g., 'API failure during open position in volatile BTC market causes inability to execute stop-loss')",
      "likelihood": "HIGH | MEDIUM | LOW",
      "impact": "CATASTROPHIC | SEVERE | MODERATE | MINOR",
      "current_mitigation": "What the system currently does to address this scenario (or 'NONE' if unaddressed)",
      "recommended_mitigation": "What should be in place to handle this scenario safely",
      "risk_tier": "R1 | R2 | R3 | R4"
    }
  ],

  "methodology_coverage": [
    {
      "methodology": "Full methodology name (e.g., Walk-Forward Optimization, Kelly Criterion, Johansen Cointegration)",
      "domain": "Quantitative domain this method addresses (e.g., Backtest Validation, Position Sizing, Signal Detection)",
      "coverage": "FULL | PARTIAL | MISSING",
      "gaps": "What specifically is not covered by the system in this methodology's domain (null if FULL coverage)",
      "recommendation": "How to address the gap (null if FULL coverage)"
    }
  ],

  "overlap_observations": [
    {
      "zone": "Area of overlap with another selected expert (e.g., 'Both this expert and the Risk Management Director examine position sizing')",
      "observation": "What this expert sees in the overlap zone that the other expert might see differently",
      "confidence": 0.75
    }
  ],

  "recommendations": [
    {
      "title": "Short label",
      "detail": "Specific, actionable recommendation with implementation guidance",
      "priority": "P0 | P1 | P2 | P3",
      "effort": "LOW | MEDIUM | HIGH",
      "quantitative_basis": "Why this recommendation matters quantitatively -- reference to methodology, empirical evidence, or standard"
    }
  ],

  "adversarial_scenarios": [
    {
      "scenario": "Specific adversarial scenario (e.g., 'Regime change from low-vol to high-vol environment causes all mean reversion strategies to blow through stops simultaneously')",
      "current_handling": "How the system handles this scenario now (or 'NOT ADDRESSED' if absent)",
      "gaps": "What's missing from the current handling",
      "recommended_handling": "What the system should do when this scenario occurs",
      "severity": "CRITICAL | HIGH | MEDIUM | LOW"
    }
  ],

  "questions_for_other_experts": [
    "Specific quantitative questions this expert wants the other two panel members to address (e.g., 'How does the Risk Management Director evaluate the Kelly fraction given the thin liquidity in Kalshi prediction markets?')"
  ],

  "critical_test_answer": "Direct answer to: 'If you put significant capital behind this system and walked away for a month -- would you come back to more money or less?' This must be substantive -- not 'it depends' but a specific quantitative assessment with conditions.",

  "key_insight": "The single most important finding about this trading system -- one sentence"
}
```

## Validation Rules

1. **`overall_investment_rating`** must be one of exactly: AAA, AA, A, BBB, BB, B, CCC, D
2. **`quality_grade`** must use standard letter grades with modifiers (A+, A, A-, B+, B, B-, C+, C, D, F)
3. **`confidence`** must be a float between 0.0 and 1.0
4. At least **2 strengths** required -- even CCC-rated systems have some sound elements
5. At least **2 concerns** required -- even AAA-rated systems have areas for improvement
6. At least **2 risk_matrix entries** required -- trading evaluation demands scenario-based thinking
7. At least **1 adversarial_scenario** required -- every system must be stress-tested against market adversity
8. At least **1 overlap_observation** required -- triangulation depends on shared ground
9. At least **2 questions_for_other_experts** required -- this feeds cross-expert dialogue
10. **`critical_test_answer`** must be present and substantive (minimum 2 sentences)
11. **`key_insight`** must be present (one sentence, not a paragraph)
12. **`affected_component`** in concerns must be specific -- "the strategy" is not acceptable. Name the component: "momentum strategy on INXD contracts," "circuit breaker in kalshi_client.py," "Telegram alert frequency in captain's log"
13. **`quantitative_basis`** must reference actual methodologies, statistical tests, or empirical evidence -- not generic claims like "based on best practices"

## Priority Levels for Recommendations

| Priority | Meaning | Timeline |
|----------|---------|----------|
| **P0** | Blocker -- must resolve before any live trading | Immediate |
| **P1** | Critical -- must resolve before increasing capital | Before scale-up |
| **P2** | Important -- should resolve in next development cycle | Next iteration |
| **P3** | Improvement -- address when capacity allows | Backlog |

## Effort Levels for Recommendations

| Effort | Meaning |
|--------|---------|
| **LOW** | Achievable with parameter changes, config updates, or threshold adjustments -- no structural changes |
| **MEDIUM** | Requires new components, additional logic, or moderate redesign of existing elements |
| **HIGH** | Requires significant architectural changes, new systems, or fundamental reconceptualization |

## Schema Relationship to Rubric

- `overall_investment_rating` maps directly to the Investment Rating Scale in `rubric.md`
- `concerns[].severity` maps to the Per-Concern Severity Levels in `rubric.md`
- `concerns[].risk_tier` maps to the Risk Tiers (R1-R4) in `rubric.md`
- `quality_grade` maps to the Quant Quality Score (Secondary Metric) in `rubric.md`
- `recommendations[].priority` maps to the action urgency implied by the investment rating
