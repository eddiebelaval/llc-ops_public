# Research Module — Evaluation Rubric

## Dimensions (Weighted)

| Dimension | Weight | Question It Answers |
|-----------|--------|---------------------|
| Thesis Clarity | 15% | Is the claim precise, bounded, and unambiguous? |
| Argument Strength | 25% | Does the reasoning hold under scrutiny? Are logical steps valid? |
| Evidence Quality | 20% | Are sources credible, relevant, and sufficient for the claim's scope? |
| Novelty | 15% | Does this add something that didn't exist in the knowledge base? |
| Internal Consistency | 10% | Does it contradict itself or prior established findings? |
| Falsifiability | 10% | Could this be proven wrong? If not, it's metaphysics, not science. |
| Cross-Domain Validity | 5% | Does the pattern hold outside its home domain? |

## Grading Scale

| Grade | Meaning | Weighted Score |
|-------|---------|----------------|
| A+ | Exceptional — publishable as-is, advances the field | 4.0 |
| A | Excellent — strong on all dimensions, minor refinements only | 3.7-3.9 |
| A- | Very good — sound thesis with 1-2 addressable gaps | 3.5-3.6 |
| B+ | Good — solid core with notable weaknesses to address | 3.2-3.4 |
| B | Adequate — the thesis has potential but needs significant work | 2.8-3.1 |
| B- | Below expectations — fundamental issues but salvageable | 2.5-2.7 |
| C+ | Weak — major structural problems | 2.2-2.4 |
| C | Poor — thesis does not hold under scrutiny | 1.8-2.1 |
| D/F | Reject — unfalsifiable, circular, or fundamentally flawed | <1.8 |

## Composite Calculation

```
composite = (clarity * 0.15) + (argument * 0.25) + (evidence * 0.20) +
            (novelty * 0.15) + (consistency * 0.10) + (falsifiability * 0.10) +
            (cross_domain * 0.05)
```

Where A+=4.0, A=3.85, A-=3.5, B+=3.3, B=3.0, B-=2.6, C+=2.3, C=2.0, D=1.0, F=0.0

## Grade Interpretation

- **A range (3.5+):** Finding is promoted to `knowledge/findings.md` as established
- **B+ and above (3.2+):** Finding is promoted as provisional (needs follow-up)
- **B and below (<3.2):** Finding is logged but NOT promoted to knowledge base. Weaknesses become new queue items.
- **Any dimension rated C or below:** Automatically generates a targeted follow-up question for that specific dimension

## The Critical Test (adapted from parallax-assess)

> "If the most rigorous skeptic in this expert's field reviewed this thesis — would it survive?"

Every expert must explicitly answer this question.
