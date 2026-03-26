# Research Module — Expert Output Schema

Each expert subagent MUST return valid JSON matching this schema. No deviations.

```json
{
  "expert": "Full role name (e.g., Philosopher of Mind)",
  "overall_grade": "A+/A/A-/B+/B/B-/C+/C/D/F",
  "confidence": 0.85,
  "summary": "2-3 sentence assessment of this thesis",

  "rubric_scores": {
    "thesis_clarity": "A-F",
    "argument_strength": "A-F",
    "evidence_quality": "A-F",
    "novelty": "A-F",
    "internal_consistency": "A-F",
    "falsifiability": "A-F",
    "cross_domain_validity": "A-F",
    "weighted_composite": 3.45
  },

  "strengths": [
    {
      "title": "Short label",
      "detail": "What specifically is strong and why",
      "theoretical_basis": "Framework, source, or established finding that supports this"
    }
  ],

  "weaknesses": [
    {
      "title": "Short label",
      "detail": "What specifically is weak and why",
      "severity": "CRITICAL | HIGH | MEDIUM | LOW",
      "type": "logical_gap | evidence_gap | scope_overreach | internal_contradiction | unfalsifiable | circular | undefined_term",
      "recommendation": "How to address this weakness",
      "theoretical_basis": "What framework or evidence reveals this weakness"
    }
  ],

  "adversarial_challenges": [
    {
      "challenge": "How a rigorous skeptic would attack this specific claim",
      "strength_of_attack": "DEVASTATING | STRONG | MODERATE | WEAK",
      "current_defense": "What in the thesis defends against this attack (if anything)",
      "recommended_defense": "How to strengthen the defense",
      "attacker_framework": "Which theoretical tradition the attack comes from"
    }
  ],

  "cross_references": [
    {
      "finding_id": "F-NNN or external source",
      "relation": "SUPPORTS | CONTRADICTS | EXTENDS | QUALIFIES | DEPENDS_ON",
      "detail": "How this thesis relates to the referenced finding",
      "confidence": 0.8
    }
  ],

  "new_questions": [
    "Specific, answerable questions this thesis raises that aren't addressed"
  ],

  "overlap_observations": [
    {
      "zone": "Area of overlap with another selected expert",
      "observation": "What this expert sees in the overlap zone",
      "confidence": 0.75
    }
  ],

  "critical_test_answer": "Direct answer to: Would the most rigorous skeptic in my field accept this?",

  "key_insight": "The single most important thing about this thesis — one sentence"
}
```

## Validation Rules

1. `weighted_composite` must be calculable from `rubric_scores` using the weights in `rubric.md`
2. At least 2 `strengths` and 2 `weaknesses` required
3. At least 1 `adversarial_challenge` required
4. `cross_references` should reference findings from `knowledge/findings.md` when applicable
5. At least 1 `new_question` required (this feeds the autonomous queue)
6. `critical_test_answer` must be present and substantive (not "yes" or "no")
