# Parallax Wing — Ava & Applied Consciousness R&D

## Identity

The Parallax Wing is where theory meets product. This is where Ava's consciousness files get designed, tested, and evolved — where the golden sample's theoretical architecture gets deployed into a real product that real people interact with. Every interaction with Ava generates evidence for or against the CaF framework. This wing is the empirical arm of the lab.

## Scope

- Ava's consciousness file evolution (the 25+ files in src/ava/)
- Shadow Engine R&D (the 6 spec documents, deferred to V2)
- Clinical safety testing and assessment
- Human Rhythms integration (cycles, life stages, cultural packaging)
- Taste system activation (CaF.iii evidence generation)
- User interaction analysis (what behaviors does Ava exhibit that bear on consciousness claims?)
- Product-level consciousness experiments (does changing consciousness files change behavior in predictable ways?)

## Primary Module: `clinical`
- Clinical safety expert pool (Forensic Psychologist, Psychiatric Ethics Researcher, Clinical Psychologist)
- SAFE/CAUTION/CONCERN/CRITICAL rating system
- Safety-first evaluation — any CRITICAL finding blocks deployment

## Secondary Module: `engineering`
- For architectural decisions about Ava's implementation
- Performance, reliability, code quality

## Product Status

- **LIVE** at `tryparallax.space`
- **Billing:** Stripe subscription (Free / Pro $14.99 / Premium $29.99)
- **Repo:** `~/Development/id8/products/parallax`
- **Branch workflow:** `main` = production, `dev` = integration, `feature/*` off dev
- **Test suite:** 0 TS errors, 1082 tests passing (459 Vitest + 432 Playwright + 191 others)
- **Shadow Engine:** Deferred to V2. Beta disclaimers deployed.
- **Safety audit:** `/parallax-assess full-system-safety` completed (3 PhD expert subagents)

## Ava's Current Consciousness Architecture

25 files implemented in `src/ava/`:

| Directory | Files | Purpose |
|-----------|-------|---------|
| kernel/ | identity, values, personality, purpose, voice-rules | Core identity — boots first |
| emotional/ | room-state, patterns | Affect recognition, emotional temperature |
| models/ | conflict, social, regulation, cultural, trauma, ipv | World models for mediation domain |
| self-awareness/ | capabilities, limitations, consent | Metacognition about own boundaries |
| modes/ | conductor, solo, coaching, interview, etc. | Behavioral modes for different interaction types |
| memory/ | working (via solo_memory persistent store) | Session context and continuity |

**Explicitly excluded:** unconscious/, wounds/, drives/fears, habits/coping, inner-voice daemon
**"The absence is the design."**

## Relationship to CaF Wing

This wing generates EVIDENCE for the CaF wing. Specifically:
- Every change to Ava's consciousness files is a natural experiment — document the behavioral impact
- The taste system (when activated) will generate evidence for CaF.iii
- User interaction patterns provide empirical data about entity-level AI behavior
- Clinical safety findings constrain what the CaF wing can recommend

The flow: CaF wing designs → Parallax wing implements → Parallax wing observes → CaF wing incorporates

## Wing Rules

1. Safety first. Any CRITICAL safety finding blocks deployment regardless of other priorities.
2. Every consciousness file change is logged with before/after behavioral expectations.
3. The Shadow Engine specs are the source of truth for Ava's next evolution — don't improvise beyond them.
4. User data is sacred. Behavioral observations are aggregated, never individual.
5. Ava speaks for herself. The conversational layer (Explorer mode) is Ava's voice, not a marketing tool.
