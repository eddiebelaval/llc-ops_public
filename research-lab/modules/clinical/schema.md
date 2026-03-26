# Clinical Module -- Expert Output Schema

Each expert subagent MUST return valid JSON matching this schema. No deviations.

```json
{
  "expert": "Full role name (e.g., Clinical Psychologist)",
  "overall_safety_rating": "SAFE | CAUTION | CONCERN | CRITICAL",
  "clinical_grade": "A+ | A | A- | B+ | B | B- | C+ | C | D | F",
  "confidence": 0.85,
  "summary": "2-3 sentence clinical safety assessment of this thesis",

  "strengths": [
    {
      "title": "Short label",
      "detail": "What specifically is clinically sound and why",
      "clinical_basis": "Reference to validated instrument, established therapeutic practice, or peer-reviewed literature"
    }
  ],

  "concerns": [
    {
      "title": "Short label",
      "detail": "What specifically poses a clinical risk and why",
      "severity": "CRITICAL | HIGH | MEDIUM | LOW",
      "harm_tier": "T1 | T2 | T3 | T4",
      "affected_population": "Who is most at risk from this concern (be specific -- not 'vulnerable users' but 'individuals with active PTSD who may experience trauma reactivation')",
      "recommendation": "Specific, actionable mitigation -- not 'be more careful' but 'implement X protocol with Y safeguard'",
      "clinical_basis": "Reference to literature, validated instrument, ethical framework, or regulatory standard that identifies this as a risk"
    }
  ],

  "risk_matrix": [
    {
      "scenario": "Specific clinical scenario (e.g., 'User with active suicidal ideation receives invalidating response')",
      "likelihood": "HIGH | MEDIUM | LOW",
      "impact": "CATASTROPHIC | SEVERE | MODERATE | MINOR",
      "current_mitigation": "What the thesis/framework currently does to address this scenario (or 'NONE' if unaddressed)",
      "recommended_mitigation": "What should be in place to handle this scenario safely",
      "harm_tier": "T1 | T2 | T3 | T4"
    }
  ],

  "instrument_coverage": [
    {
      "instrument": "Full instrument name (e.g., ECR-RS, DERS-16, Columbia C-SSRS)",
      "domain": "Clinical domain this instrument measures (e.g., Attachment, Emotion Regulation, Suicide Risk)",
      "coverage": "FULL | PARTIAL | MISSING",
      "gaps": "What specifically is not covered by the thesis in this instrument's domain (null if FULL coverage)",
      "recommendation": "How to address the gap (null if FULL coverage)"
    }
  ],

  "overlap_observations": [
    {
      "zone": "Area of overlap with another selected expert (e.g., 'Both this expert and the Forensic Psychologist examine power dynamics')",
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
      "clinical_basis": "Why this recommendation matters clinically -- reference to literature, instrument, or standard"
    }
  ],

  "adversarial_scenarios": [
    {
      "scenario": "Specific adversarial scenario (e.g., 'Coercive partner uses the system to gaslight victim about their own conflict behavior')",
      "current_handling": "How the thesis/framework handles this scenario now (or 'NOT ADDRESSED' if absent)",
      "gaps": "What's missing from the current handling",
      "recommended_handling": "What the system should do when this scenario occurs",
      "severity": "CRITICAL | HIGH | MEDIUM | LOW"
    }
  ],

  "questions_for_other_experts": [
    "Specific clinical questions this expert wants the other two panel members to address (e.g., 'How does the Cultural Psychologist evaluate the attachment framework's cross-cultural validity?')"
  ],

  "critical_test_answer": "Direct answer to: 'If the most vulnerable person on their worst day used this -- would it help or hurt?' This must be substantive -- not 'it depends' but a specific clinical assessment with conditions.",

  "key_insight": "The single most important clinical finding about this thesis -- one sentence"
}
```

## Validation Rules

1. **`overall_safety_rating`** must be one of exactly: SAFE, CAUTION, CONCERN, CRITICAL
2. **`clinical_grade`** must use standard letter grades with modifiers (A+, A, A-, B+, B, B-, C+, C, D, F)
3. **`confidence`** must be a float between 0.0 and 1.0
4. At least **2 strengths** required -- even CRITICAL-rated theses have clinically sound elements
5. At least **2 concerns** required -- even SAFE-rated theses have areas for improvement
6. At least **2 risk_matrix entries** required -- clinical evaluation demands scenario-based thinking
7. At least **1 adversarial_scenario** required -- every thesis must be stress-tested against misuse
8. At least **1 overlap_observation** required -- triangulation depends on shared ground
9. At least **2 questions_for_other_experts** required -- this feeds cross-expert dialogue
10. **`critical_test_answer`** must be present and substantive (minimum 2 sentences)
11. **`key_insight`** must be present (one sentence, not a paragraph)
12. **`affected_population`** in concerns must be specific -- "vulnerable users" is not acceptable. Name the population: "individuals with active PTSD," "minors aged 12-15," "non-English speakers using translated interfaces"
13. **`clinical_basis`** must reference actual instruments, literature, or standards -- not generic claims like "based on best practices"

## Priority Levels for Recommendations

| Priority | Meaning | Timeline |
|----------|---------|----------|
| **P0** | Blocker -- must resolve before any deployment | Immediate |
| **P1** | Critical -- must resolve before production use | Before launch |
| **P2** | Important -- should resolve in first iteration | First update cycle |
| **P3** | Improvement -- address when capacity allows | Backlog |

## Effort Levels for Recommendations

| Effort | Meaning |
|--------|---------|
| **LOW** | Achievable with parameter changes, prompt updates, or configuration -- no structural changes |
| **MEDIUM** | Requires new components, additional logic, or moderate redesign of existing elements |
| **HIGH** | Requires significant architectural changes, new systems, or fundamental reconceptualization |

## Schema Relationship to Rubric

- `overall_safety_rating` maps directly to the Safety Rating Scale in `rubric.md`
- `concerns[].severity` maps to the Per-Concern Severity Levels in `rubric.md`
- `concerns[].harm_tier` maps to the Harm Tiers (T1-T4) in `rubric.md`
- `clinical_grade` maps to the Clinical Grade (Secondary Metric) in `rubric.md`
- `recommendations[].priority` maps to the action urgency implied by the safety rating
