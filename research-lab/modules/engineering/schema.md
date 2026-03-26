# Engineering Module — Expert Output Schema

Each expert subagent MUST return valid JSON matching this schema. No deviations.

```json
{
  "expert": "Full role name (e.g., Systems Architect)",
  "overall_grade": "A+/A/A-/B+/B/B-/C+/C/D/F",
  "confidence": 0.85,
  "summary": "2-3 sentence assessment of this architecture/design thesis",

  "rubric_scores": {
    "architecture_soundness": "A-F",
    "implementation_feasibility": "A-F",
    "scalability": "A-F",
    "security_privacy": "A-F",
    "maintainability": "A-F",
    "performance": "A-F",
    "developer_experience": "A-F",
    "weighted_composite": 3.45
  },

  "strengths": [
    {
      "title": "Short label",
      "detail": "What specifically is strong and why",
      "technical_basis": "Framework, benchmark, industry standard, or prior art that validates this strength"
    }
  ],

  "weaknesses": [
    {
      "title": "Short label",
      "detail": "What specifically is weak and why",
      "severity": "CRITICAL | HIGH | MEDIUM | LOW",
      "type": "architecture_flaw | scalability_issue | security_vulnerability | performance_bottleneck | maintainability_concern | missing_requirement | over_engineering",
      "recommendation": "Specific, actionable steps to address this weakness",
      "technical_basis": "What framework, benchmark, or evidence reveals this weakness"
    }
  ],

  "risk_matrix": [
    {
      "scenario": "A specific failure scenario (e.g., 'Database connection pool exhaustion under sustained load')",
      "likelihood": "HIGH | MEDIUM | LOW",
      "impact": "CRITICAL | HIGH | MEDIUM | LOW",
      "current_mitigation": "What the current design does to prevent or handle this (if anything)",
      "recommended_mitigation": "What should be added or changed to mitigate this risk"
    }
  ],

  "cross_references": [
    {
      "finding_id": "F-NNN or external source (RFC, paper, postmortem, benchmark)",
      "relation": "SUPPORTS | CONTRADICTS | EXTENDS | QUALIFIES | DEPENDS_ON",
      "detail": "How this thesis relates to the referenced finding or external evidence",
      "confidence": 0.8
    }
  ],

  "new_questions": [
    "Specific, answerable technical questions this thesis raises that aren't addressed"
  ],

  "overlap_observations": [
    {
      "zone": "Area of overlap with another selected expert",
      "observation": "What this expert sees in the overlap zone from their perspective",
      "confidence": 0.75
    }
  ],

  "critical_test_answer": "Direct answer to: If this shipped to production tomorrow with 10,000 users — would it hold? What holds, what breaks first, what's the blast radius, what's the recovery path.",

  "key_insight": "The single most important thing about this architecture — one sentence"
}
```

## Validation Rules

1. `weighted_composite` must be calculable from `rubric_scores` using the weights in `rubric.md`:
   ```
   composite = (architecture_soundness * 0.25) + (implementation_feasibility * 0.20) +
               (scalability * 0.15) + (security_privacy * 0.15) +
               (maintainability * 0.10) + (performance * 0.10) +
               (developer_experience * 0.05)
   ```
   Grade-to-number mapping: A+=4.0, A=3.85, A-=3.5, B+=3.3, B=3.0, B-=2.6, C+=2.3, C=2.0, D=1.0, F=0.0

2. At least 2 `strengths` and 2 `weaknesses` required — no architecture is perfect, and no architecture is worthless

3. At least 2 `risk_matrix` entries required — every production system has risk scenarios

4. `cross_references` should reference findings from `knowledge/findings.md` when applicable. External references (RFCs, papers, postmortems from FAANG, benchmark data) are strongly encouraged.

5. At least 1 `new_question` required — this feeds the autonomous queue for follow-up investigation

6. `critical_test_answer` must be present and substantive — not "yes" or "no" but a specific assessment of what survives the 10K user test and what doesn't

7. Each `weakness` must have a `type` from the enumerated list — this enables automated classification and trend analysis across evaluations

8. `severity` ratings must be consistent: CRITICAL means "this will cause a production incident or data loss", HIGH means "this will degrade service or create significant tech debt", MEDIUM means "this should be addressed but won't block launch", LOW means "nice to fix, not urgent"
