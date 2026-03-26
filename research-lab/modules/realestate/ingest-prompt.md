# Real Estate Module — Ingest Prompt

## Purpose
Absorb external market intelligence — competitor launches, industry reports, regulatory changes, agent feedback, proptech analysis — into the RE knowledge base.

## When Used
When external information is relevant to Homer's market positioning, competitive threats, or regulatory compliance.

## Sources
- Proptech industry reports (T3 Sixty, WAV Group, Stefan Swanepoel)
- Competitor product launches or feature updates
- NAR/state association regulatory updates
- Agent feedback from interviews, demos, or social media
- MLS policy changes
- Real estate technology press (Inman, HousingWire, RealTrends)

## Process

1. **Read the source material**
2. **Assess relevance** — does this affect Homer's market position, competitive threats, or compliance requirements?
3. **Map to adversarial challenges** — does this strengthen or weaken any standing challenge?
4. **Cross-reference** — does this contradict or support existing executive feedback?
5. **Catalog** — add to `knowledge/external/` with proper attribution

## Intellectual Honesty Rule (same as research module)

If an external source reveals that a competitor has a stronger position than Homer on a specific dimension, say so. Do not spin competitor strengths as weaknesses. The knowledge base must reflect market reality, not product optimism.

## Output

Save to `sessions/ingest-YYYY-MM-DD-NNN/`:
- `source.md` — Original material with attribution
- `analysis.json` — Structured assessment
- `changes.md` — Updates to findings, threats, and open questions
- `meta.json` — Session metadata

Add permanent record to `knowledge/external/EXT-NNN-slug.md`
