# Real Estate Module — Executive Output Schema

Each executive subagent MUST return valid JSON matching this schema. No deviations.

```json
{
  "executive": "Full role name (e.g., Managing Broker — Top-10 Brokerage)",
  "overall_grade": "AAA/AA/A/BBB/BB/B/CCC/CC/D",
  "confidence": 0.85,
  "summary": "2-3 sentence executive assessment — would you buy this, recommend it, or reject it?",

  "rubric_scores": {
    "market_fit": "AAA-D",
    "workflow_integration": "AAA-D",
    "liability_compliance": "AAA-D",
    "competitive_moat": "AAA-D",
    "agent_adoption": "AAA-D",
    "revenue_model": "AAA-D",
    "technical_execution": "AAA-D",
    "consumer_value": "AAA-D",
    "weighted_composite": 3.45
  },

  "strengths": [
    {
      "title": "Short label",
      "detail": "What specifically is strong and why — from real market experience",
      "market_evidence": "Comparable product, market data, or agent behavior that validates this"
    }
  ],

  "weaknesses": [
    {
      "title": "Short label",
      "detail": "What specifically is weak and why — from real market experience",
      "severity": "CRITICAL | HIGH | MEDIUM | LOW",
      "type": "market_fit_gap | workflow_friction | liability_risk | competitive_vulnerability | adoption_barrier | revenue_risk | technical_debt | consumer_harm",
      "recommendation": "Specific, actionable fix — not 'do better' but 'build X by Y date'",
      "market_evidence": "What happens in the real market when this weakness exists"
    }
  ],

  "competitive_threats": [
    {
      "competitor": "Specific competitor or category",
      "threat_level": "EXISTENTIAL | SERIOUS | MODERATE | LOW",
      "attack_vector": "How they could neutralize Homer's advantage",
      "time_to_copy": "Estimated months to replicate if they decided to",
      "defense_recommendation": "How to make this advantage durable"
    }
  ],

  "adoption_barriers": [
    {
      "barrier": "Specific friction point in agent/broker adoption",
      "affected_persona": "Which user type hits this barrier",
      "severity": "BLOCKER | FRICTION | MINOR",
      "fix": "What would remove or reduce this barrier"
    }
  ],

  "liability_flags": [
    {
      "issue": "Specific legal or compliance risk",
      "severity": "LAWSUIT_RISK | REGULATORY_RISK | REPUTATIONAL_RISK | MINOR",
      "scenario": "Concrete scenario where this becomes a problem",
      "mitigation": "How to address before it becomes an incident"
    }
  ],

  "revenue_assessment": {
    "willingness_to_pay": "STRONG | MODERATE | WEAK | NONE",
    "price_sensitivity": "Detail on whether the pricing model works",
    "switching_cost_from_current": "What agents give up to adopt Homer",
    "path_to_scale": "How this gets from 1 agent to 1,000"
  },

  "killer_features": [
    "Features that would make this a MUST-HAVE — not nice-to-have"
  ],

  "deal_breakers": [
    "Issues that would make this an instant NO — regardless of other strengths"
  ],

  "critical_test_answer": "Direct answer to: Would the most successful, most skeptical broker in my market write a check for this?",

  "key_insight": "The single most important thing about this platform — one sentence"
}
```

## Validation Rules

1. `weighted_composite` must be calculable from `rubric_scores` using the weights in `rubric.md`
2. At least 2 `strengths` and 3 `weaknesses` required (pessimistic bias — this is a tear-apart, not a cheerleading session)
3. At least 1 `competitive_threat` required
4. At least 1 `adoption_barrier` required
5. `liability_flags` required if evaluating anything touching disclosures, AI-generated content, or consumer-facing features
6. `revenue_assessment` must be present with all 4 fields
7. `critical_test_answer` must be present and substantive
8. `deal_breakers` may be empty array ONLY if overall grade is A or above
