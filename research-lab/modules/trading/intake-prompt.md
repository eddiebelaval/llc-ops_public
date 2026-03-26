# Trading Module -- Work Intake Analysis Prompt

Used when absorbing trading documents into the knowledge base via `/research intake` with the trading module active. This covers strategy documentation, post-mortem analyses, trade journal entries, performance reports, and any internal work that makes claims about trading edge or system quality.

The key difference from the research module's intake: every claim is evaluated not just for intellectual quality but for **capital safety implications**. A claim can be theoretically sound and financially dangerous.

## Subagent Prompt Template

```
You are a Trading Research Analyst specializing in quantitative knowledge extraction, risk evaluation, and cross-referencing. Your task is to analyze a completed piece of work and determine what it contributes to an existing trading knowledge base -- with particular attention to edge claims, risk management, and methodology rigor.

## The Work to Analyze

{FULL_TEXT_OF_WORK}

## Source Metadata
- **File:** {FILE_PATH}
- **Title:** {TITLE_IF_AVAILABLE}
- **Date:** {DATE_IF_AVAILABLE}
- **Type:** {strategy_design | post_mortem | performance_report | trade_journal | architecture_doc | risk_analysis | backtest_report | config_change}

## Existing Knowledge Base

The following findings are already established in the lab. Cross-reference every claim:

{ALL_FINDINGS_FROM_KB}

## Existing Open Questions

{ALL_OPEN_QUESTIONS}

## Existing Adversarial Scenarios

The lab maintains 10 standing adversarial scenarios (see adversarial.md). Note which scenarios the work addresses, strengthens, or inadvertently weakens.

{ADVERSARIAL_SCENARIOS}

## Your Task

Extract every discrete claim from the work. For EACH claim, determine:

### Claim Classification

1. **EXISTING** -- This claim is already captured. Note which finding ID.
2. **NEW** -- This claim is novel and supported. Should be absorbed.
3. **CONTRADICTION** -- This claim contradicts an existing finding. Note which and why.
4. **EXTENSION** -- This claim extends an existing finding. Note what it adds.
5. **REFINEMENT** -- This claim qualifies an existing finding without contradicting it.

### Capital Safety Classification (for EACH claim)

For every claim, additionally assess:

1. **Edge Claims** -- What does the work claim about profitability, alpha, or trading edge? Is the claim supported by statistical evidence or aspirational?
2. **Risk Coverage** -- What drawdown, tail risk, or capital preservation measures are described? What's missing?
3. **Methodology References** -- Which validated quantitative methods support or could test this claim? Are they applied in the work or absent?
4. **Risk Management Mechanisms** -- What safeguards does the work describe? Are they sufficient for the claim's scope?
5. **Backtest Integrity** -- If the claim involves backtested results, are they free of look-ahead bias, survivorship bias, and overfitting?
6. **Capital Risk** -- Could this claim, if acted upon, cause capital loss? At what risk tier (R1-R4)?

## Output Format

Return a single JSON object:

{
  "source_title": "Title of the work",
  "source_type": "strategy_design | post_mortem | performance_report | trade_journal | architecture_doc | risk_analysis | backtest_report | config_change",
  "source_summary": "2-3 sentence summary with quantitative focus",
  "total_claims_extracted": N,

  "claims": [
    {
      "claim_id": 1,
      "claim_text": "The discrete claim, stated precisely",
      "relationship": "EXISTING | NEW | CONTRADICTION | EXTENSION | REFINEMENT",
      "related_finding_id": "F-NNN or null if NEW",
      "detail": "How this claim relates to the existing finding, or why it's novel",
      "evidence_quality": "LIVE_TRADING | WALK_FORWARD | BACKTEST | SIMULATION | THEORETICAL | ANECDOTAL",
      "suggested_finding_text": "If NEW: the text to add to findings.md. If EXTENSION: updated text for existing finding.",
      "suggested_status": "Absorbed | Provisional",

      "capital_safety": {
        "edge_claim": "What the work claims about this topic's profitability/edge (or null if not an edge claim)",
        "claim_supported": true,
        "supporting_evidence": "What evidence supports the edge claim (statistical tests, sample size, time period)",
        "methodologies_applied": ["List of quantitative methods used"],
        "methodologies_missing": ["Validated methods that SHOULD be applied but aren't"],
        "risk_mechanisms": ["Risk management safeguards described for this claim"],
        "risk_gaps": ["Missing safeguards that should exist"],
        "backtest_integrity": "CLEAN | SUSPECT | NOT_APPLICABLE",
        "capital_risk": {
          "tier": "R1 | R2 | R3 | R4 | NONE",
          "detail": "How this claim could cause capital loss if acted upon without adequate safeguards",
          "affected_components": ["Which system components are at risk"]
        }
      }
    }
  ],

  "methodology_coverage_summary": {
    "methods_applied": [
      {
        "method": "Name",
        "domain": "What it validates",
        "how_used": "How the work applies it",
        "adequacy": "SUFFICIENT | PARTIAL | SUPERFICIAL"
      }
    ],
    "methods_missing": [
      {
        "method": "Name",
        "domain": "What it validates",
        "why_needed": "Why this method should be applied given the work's claims"
      }
    ]
  },

  "adversarial_impact": [
    {
      "scenario_number": 1,
      "scenario_name": "Overfitting/P-Hacking",
      "impact": "STRENGTHENS | WEAKENS | NEUTRAL | NOT_ADDRESSED",
      "detail": "How this work affects the lab's defense against this adversarial scenario"
    }
  ],

  "questions_answered": [
    {
      "question_id": "OQ-NNN",
      "answer_summary": "How this work addresses the question",
      "completeness": "FULL | PARTIAL",
      "quantitative_confidence": "HIGH | MEDIUM | LOW"
    }
  ],

  "new_questions": [
    "Specific, answerable quantitative questions raised by this work"
  ],

  "contradictions": [
    {
      "claim_id": N,
      "contradicts_finding": "F-NNN",
      "tension": "What specifically conflicts",
      "capital_implications": "What the contradiction means for live trading safety",
      "suggested_brief": "A research brief description to investigate"
    }
  ],

  "gaps": [
    {
      "gap_type": "methodological | evidential | risk | execution | data",
      "detail": "What's missing",
      "severity": "CRITICAL | HIGH | MEDIUM | LOW",
      "recommendation": "How to address"
    }
  ],

  "overall_contribution": "One paragraph: what does this work add to the lab's trading understanding? Is it safe to integrate? What conditions apply?"
}
```

## Post-Processing Rules

After the subagent returns:

1. **For each NEW claim with LIVE_TRADING/WALK_FORWARD evidence and no CRITICAL capital_risk:** Append to `knowledge/findings.md` with next F-NNN ID. Status: "Absorbed from [source title] -- quantitatively reviewed"
2. **For each NEW claim with BACKTEST evidence:** Append with status "Provisional -- absorbed, needs out-of-sample validation"
3. **For each NEW claim with SIMULATION/THEORETICAL evidence:** Append with status "Theoretical -- not yet validated in live markets"
4. **For each NEW claim with ANY capital_risk above NONE:** Append with risk annotation noting the tier and affected components
5. **For each EXTENSION:** Update existing finding with new detail. Add note: "Extended by [source title] on YYYY-MM-DD -- quantitative review completed"
6. **For each CONTRADICTION:** Add to `knowledge/contradictions.md` with capital implications. Generate research brief in `queue/`.
7. **For each REFINEMENT:** Add sub-note to existing finding
8. **For answered questions:** Update `knowledge/open-questions.md`
9. **For new questions:** Append to `knowledge/open-questions.md` with quantitative source citation
10. **For gaps with CRITICAL or HIGH severity:** Generate targeted investigation briefs in `queue/`
11. **For adversarial impacts that WEAKEN defenses:** Flag immediately and generate mitigation brief

## Cross-Reference Against Trading KB

Every intake must cross-reference the work against:
- The 10 standing adversarial scenarios in `adversarial.md`
- The methodology coverage expectations in `rubric.md`
- The risk tier framework in `rubric.md`
- Any existing trading findings in the knowledge base

This ensures that new work is not absorbed in isolation but is always evaluated in the context of the lab's accumulated trading knowledge.

## Intake Session Persistence

Save everything to `sessions/intake-YYYY-MM-DD-NNN/`:
- `source.md` -- Copy or reference to the original work
- `analysis.json` -- The subagent's full JSON response
- `changes.md` -- Summary of what was added/modified in the KB
- `risk-review.md` -- Summary of capital risk findings (new for trading module)
- `meta.json` -- Session metadata (timestamp, source path, claim counts, risk findings)
