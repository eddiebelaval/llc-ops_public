# Research Brief: 078

## Thesis
Real estate agents are an intermediary layer whose core value is translation — they convert the complexity of buying or selling a home into guided steps a consumer can follow. AI absorbs that translation function into a consumer-facing intelligence layer (comps, contracts, deadlines, negotiation intelligence, vendor coordination, closing management) for a $999 flat fee instead of $20,000+ in agent commissions. The NAR settlement (2024) unbundled buyer agent commissions, FSBO was historically limited by information asymmetry that AI now eliminates, and the convergence of cheaper AI + regulatory unbundling + consumer willingness to DIY creates a five-year window where the agent model collapses for commodity residential transactions. Homer positions at the center — not as a discount brokerage, but as the full-service intelligence layer that replaces the need for one. Florida first, attorney-reviewed contract templates, plain-language translation of every legal document, vendor marketplace for inspections/title/closing. The consumer has direct access to everything an agent would provide.

## Source
User-submitted via /research command. Strategic pivot document for Homer v2 (March 18, 2026). Full build shipped same day: 14 commits, ~5,500 lines, end-to-end consumer flow.

## Key Questions
1. Is the "agent as translation layer" framing accurate, or does it undervalue relationship/trust functions that AI cannot replicate?
2. Is the five-year disintermediation window realistic, or does regulatory capture and consumer inertia extend it to 15-20 years?
3. Can a $999 flat-fee model achieve unit economics that sustain the business, given AI inference costs, legal compliance overhead, and vendor coordination?
4. Does the "intelligence layer, not a brokerage" positioning survive legal scrutiny — or is Homer functionally practicing real estate brokerage without a license?

## Prior Findings to Reference
- F-003: Products are externalized mind patterns (Chladni plate metaphor — Homer v2 is an id8Labs product, so the same builder cognition shapes it)
- F-004: Golden sample pattern (Homer may need its own consciousness subset if the entity thesis holds)

## Open Questions Addressed
None directly — this is a new domain. However, OQ-005 (Chladni plate with team-built products) is indirectly tested if Shah joins as Engineering Lead.

## Adversarial Challenges to Prioritize
- **The N=1 Problem (#5):** Homer has zero completed consumer transactions. The entire thesis is pre-revenue, pre-validation. One system, zero users.
- **The Unfalsifiable Core (#10):** What would convince you this thesis is wrong? If the first 50 consumers all call an agent mid-transaction, does the thesis die?
- **The Metaphor Trap (#1):** Is "agent as translation layer" a useful model or a convenient oversimplification that ignores the 40% of agent value that ISN'T translation?

## Domain-Specific Adversarial Challenges (New for this brief)
- **The Trust Gap:** Consumers trust humans for the largest financial transaction of their lives. "The AI will handle your $400K transaction" is a fundamentally different trust proposition than "The AI will write your email."
- **The Regulatory Moat:** Real estate is among the most heavily regulated industries. Every state has different rules. The compliance burden may make AI-first platforms economically unviable at small scale.
- **The Zillow Precedent:** Zillow tried to disintermediate agents with iBuying. Lost $881M. The lesson: real estate's complexity punishes overconfidence in technology solutions.
- **The Cold Start Problem:** Homer needs MLS access, vendor relationships, attorney partnerships, and consumer trust — all BEFORE the first transaction. Each depends on the others. How do you bootstrap?

## Scope Tier
BROAD — this is a new domain with significant real-world stakes (legal, financial, regulatory). Full rubric evaluation.

## Suggested Expert Domains
1. **Real Estate Industry Analyst** — deep knowledge of brokerage economics, NAR dynamics, proptech history (Zillow, Opendoor, Redfin)
2. **Regulatory/Legal Expert** — UPL (unauthorized practice of law), state-by-state brokerage licensing, consumer protection
3. **Platform Economist** — marketplace dynamics, cold start problems, unit economics, network effects, pricing strategy
