# Real Estate Module — Intake Prompt

## Purpose
Absorb completed work on Homer (features shipped, architecture decisions, market tests) into the RE knowledge base.

## When Used
After implementing improvements identified by the executive panel. The intake captures what was built, why, and how it addresses specific executive feedback.

## Process

1. **Read the source material** (feature PR, architecture doc, test results, user feedback)
2. **Map to executive feedback** — which weaknesses, deal breakers, or action items does this address?
3. **Extract claims** — what does this implementation claim to solve?
4. **Cross-reference knowledge base** — does this contradict or extend existing findings?
5. **Score impact** — estimate how much this moves the needle on the relevant rubric dimensions

## Output

Save to `sessions/intake-YYYY-MM-DD-NNN/`:
- `source.md` — What was built
- `analysis.json` — Structured assessment of impact on executive feedback
- `changes.md` — Updates to findings, action items, and open questions
- `meta.json` — Session metadata

## Key Rule

Intake is optimistic but honest. If a feature partially addresses a weakness, say "partially addresses" — don't claim it's fully resolved. The next evaluation round will verify.
