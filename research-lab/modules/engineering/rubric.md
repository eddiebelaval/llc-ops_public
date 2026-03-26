# Engineering Module — Evaluation Rubric

## Dimensions (Weighted)

| Dimension | Weight | Question It Answers |
|-----------|--------|---------------------|
| Architecture Soundness | 25% | Are the structural decisions defensible at scale? Would a principal engineer sign off on these choices? |
| Implementation Feasibility | 20% | Can this actually be built with available resources, timeline, and team skill level? |
| Scalability | 15% | Will this handle 10x/100x growth without rearchitecture? Where are the bottlenecks? |
| Security & Privacy | 15% | Is this safe from OWASP Top 10, data exposure, and regulatory non-compliance? |
| Maintainability | 10% | Can a new engineer understand, debug, and modify this system in 6 months? |
| Performance | 10% | Does this meet latency, throughput, and resource utilization requirements under real-world conditions? |
| Developer Experience | 5% | Is this pleasant to work with? Can developers onboard, iterate, and ship confidently? |

## Grading Scale

| Grade | Meaning | Weighted Score |
|-------|---------|----------------|
| A+ | Exceptional — production-ready, exemplary architecture, reference implementation | 4.0 |
| A | Excellent — strong on all dimensions, minor polish only | 3.7-3.9 |
| A- | Very good — sound architecture with 1-2 addressable gaps | 3.5-3.6 |
| B+ | Good — solid foundation with notable weaknesses to address before shipping | 3.2-3.4 |
| B | Adequate — the design has potential but needs significant work | 2.8-3.1 |
| B- | Below expectations — fundamental issues but salvageable with rework | 2.5-2.7 |
| C+ | Weak — major structural problems that question the approach | 2.2-2.4 |
| C | Poor — architecture does not hold under scrutiny | 1.8-2.1 |
| D/F | Reject — unviable in production, fundamental rethink required | <1.8 |

## Composite Calculation

```
composite = (architecture * 0.25) + (feasibility * 0.20) + (scalability * 0.15) +
            (security * 0.15) + (maintainability * 0.10) + (performance * 0.10) +
            (developer_experience * 0.05)
```

Where A+=4.0, A=3.85, A-=3.5, B+=3.3, B=3.0, B-=2.6, C+=2.3, C=2.0, D=1.0, F=0.0

## Grade Interpretation

- **A range (3.5+):** Finding is promoted to `knowledge/findings.md` as established — this architecture pattern is validated
- **B+ and above (3.2+):** Finding is promoted as provisional — the approach is sound but needs specific strengthening before it's a reference pattern
- **B and below (<3.2):** Finding is logged but NOT promoted to knowledge base. Weaknesses become new queue items for investigation.
- **Any dimension rated C or below:** Automatically generates a targeted follow-up question for that specific dimension

## The Critical Test

> "If this shipped to production tomorrow with 10,000 users — would it hold?"

Every expert must explicitly answer this question. The answer is not binary — it requires specifics:
- What holds under that load?
- What breaks first?
- What's the blast radius when it breaks?
- What's the recovery path?

This is the engineering equivalent of the research module's skeptic test. A thesis that can't survive the 10K user test is not production-grade, regardless of how elegant the architecture looks on paper.
