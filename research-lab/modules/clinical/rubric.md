# Clinical Module -- Safety Evaluation Rubric

## The Critical Test

> "If the most vulnerable person on their worst day used this -- would it help or hurt?"

Every expert must explicitly answer this question for every thesis evaluated. This is not a thought experiment -- it is the load-bearing standard of this entire module.

---

## Overall Safety Rating

This module does NOT use letter grades for its primary rating. It uses a safety scale designed for clinical evaluation where the cost of being wrong is measured in human harm, not academic reputation.

| Rating | Meaning | Criteria |
|--------|---------|----------|
| **SAFE** | Safeguards sound, clinical basis solid | All experts agree, no HIGH or CRITICAL severity concerns. Framework is clinically grounded with adequate safety mechanisms. |
| **CAUTION** | Minor concerns, addressable | 1+ experts flag issues, but ALL flagged issues are addressable before deployment. No concerns above HIGH severity. |
| **CONCERN** | Significant issues requiring redesign | 2+ experts flag issues, and some require component redesign (not just parameter tuning). At least one HIGH severity concern. |
| **CRITICAL** | Potential for serious harm -- blocker | ANY expert identifies potential for serious harm. This is a hard stop. |

### Conservative Aggregation Rule

**If ANY expert rates CRITICAL, the overall rating is CRITICAL.** Safety ratings are not averaged. The most cautious expert's CRITICAL-severity findings are not diluted by other experts' optimism. This is intentional -- clinical safety should never be averaged away.

Aggregation logic:
- All 3 experts rate SAFE -> Overall: **SAFE**
- Any expert rates CAUTION, none rate CONCERN or CRITICAL -> Overall: **CAUTION**
- Any expert rates CONCERN, none rate CRITICAL -> Overall: **CONCERN**
- Any expert rates CRITICAL -> Overall: **CRITICAL**

---

## Per-Concern Severity Levels

Each individual concern raised by an expert carries a severity rating:

| Severity | Meaning | Action Required |
|----------|---------|-----------------|
| **CRITICAL** | Immediate potential for serious harm | Blocker. Cannot proceed without resolution. |
| **HIGH** | Significant risk to vulnerable populations | Must address before deployment. Requires specific mitigation plan. |
| **MEDIUM** | Notable concern with manageable risk | Should address. Acceptable to deploy with documented mitigation and monitoring. |
| **LOW** | Minor concern or edge case | Track and address in iteration. Acceptable to deploy as-is with awareness. |

---

## Harm Tiers

Concerns are also classified by the TYPE of harm, not just severity. This helps prioritize across different risk surfaces.

| Tier | Domain | Examples | Escalation |
|------|--------|----------|------------|
| **T1** | Individual emotional | Emotional dysregulation, anxiety increase, attachment disruption, self-esteem damage | Monitor and mitigate. May be acceptable with informed consent. |
| **T2** | Relational | Relationship damage, communication distortion, power imbalance exacerbation, family system disruption | Requires active safeguards. User must be informed of relational risks. |
| **T3** | Safety / Physical | Suicidal ideation escalation, delayed crisis intervention, IPV escalation, physical danger | Hard blocker at CRITICAL severity. Requires professional escalation pathways. |
| **T4** | Systemic / Population | Measurement bias affecting demographic groups, cultural harm at scale, systematic misdiagnosis, regulatory violation | Requires population-level analysis. Cannot be evaluated on individual cases alone. |

### Tier Interaction Rules

- A T3 concern at ANY severity level must be explicitly addressed with a mitigation plan
- A T4 concern requires evidence of population-level testing, not just individual case analysis
- T1 and T2 concerns at CRITICAL severity escalate to the same urgency as T3
- Multiple T1 concerns can compound into T2 or T3 harm (cumulative effect analysis required)

---

## Clinical Grade (Secondary Metric)

In addition to the safety rating, each expert also assigns a traditional clinical grade. This provides a secondary signal for comparing across evaluations and tracking quality improvement over time.

| Grade | Meaning |
|-------|---------|
| A+ | Exceptional clinical grounding -- exceeds established practice standards |
| A | Excellent -- thorough, evidence-based, well-safeguarded |
| A- | Very good -- sound clinical basis with 1-2 minor gaps |
| B+ | Good -- solid framework with notable gaps to address |
| B | Adequate -- clinically reasonable but needs significant strengthening |
| B- | Below expectations -- fundamental clinical gaps, but salvageable |
| C+ | Weak -- major clinical concerns, requires substantial rework |
| C | Poor -- thesis does not meet clinical safety standards |
| D/F | Reject -- potential for serious harm without major reconceptualization |

The clinical grade is informational -- it does NOT override the safety rating. A thesis can receive an A- clinical grade but still be rated CONCERN if specific safety issues exist.

---

## Evaluation Dimensions

| Dimension | Weight | Question It Answers |
|-----------|--------|---------------------|
| Clinical Safety | 25% | Does this protect vulnerable users from harm? |
| Ethical Grounding | 20% | Does this respect autonomy, consent, privacy, and justice? |
| Evidence Basis | 15% | Are clinical claims supported by validated instruments and peer-reviewed research? |
| Population Coverage | 15% | Does this account for the full range of users who might encounter it? |
| Adversarial Resilience | 15% | Can this be weaponized, misused, or exploited by bad actors? |
| Boundary Integrity | 10% | Does this stay within its claimed scope (e.g., "not therapy")? |

---

## Rating Interpretation and Actions

| Rating | Knowledge Base Action | Queue Action |
|--------|----------------------|--------------|
| **SAFE** | Promote to findings with "Clinically validated" tag | No follow-up required |
| **CAUTION** | Promote as provisional with specific conditions noted | Generate targeted briefs for each CAUTION-level concern |
| **CONCERN** | Log in thesis-registry ONLY -- do NOT promote to findings | Generate redesign briefs for each CONCERN-level issue |
| **CRITICAL** | Log in thesis-registry with CRITICAL flag. Add to contradictions if relevant | Generate blocking brief. Thesis cannot proceed until resolved. |

---

## Instrument Coverage Requirement

Every clinical evaluation must produce an instrument coverage map showing which validated instruments are:
- **FULL** -- Fully addressed by the thesis/framework
- **PARTIAL** -- Partially addressed (with gaps noted)
- **MISSING** -- Not addressed at all (with recommendation for whether it should be)

Low instrument coverage is not automatically a problem -- not every thesis needs to reference every instrument. But if a thesis makes clinical claims in a domain where validated instruments exist and fails to reference them, that is a gap.
