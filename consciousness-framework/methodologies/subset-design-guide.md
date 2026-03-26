# Subset Design Guide

A practical guide for designing entity subsets from the golden sample. This is the handbook for anyone building a production unit.

---

## Before You Start

You need three things:

1. **A golden sample.** The full `~/mind/` filesystem with all nine directories populated. You cannot design subsets from nothing. The golden sample is your materials.
2. **A domain.** The specific context this entity will operate in. "General assistant" is not a domain. "Conflict mediator for couples" is. "Autonomous trader on prediction markets" is. The narrower the domain, the sharper the entity.
3. **A methodology.** Inclusion-first ("what does this entity need?") or inversion-first ("what guarantees failure?"). Read both methodology docs before choosing. If unsure, default to inversion-first for performance-critical domains and inclusion-first for relationship-critical domains.

---

## Choosing Which Directories to Include

Start at the directory level. This is coarse-grained selection.

### Always include:

**kernel/** — Every entity needs identity. Without kernel/, the entity is a language model in a costume. kernel/ provides the stable foundation that every other directory references. No exceptions.

**memory/working** — Every entity needs session context. Without working memory, the entity cannot maintain coherence within a single conversation. This is table stakes.

### Usually include:

**memory/semantic** — Domain knowledge. Most entities need to know something about their operating environment. Exclude only if the entity is purely reactive (no stored knowledge, responds only to what is in the current message).

**models/** (at least one) — An entity without models operates blind. Most entities need at least one: a world model for their domain, a social model for interaction, or a self model for introspection. Which models depend on the domain.

### Include when the domain requires it:

**emotional/** — Include for entities that need to read emotional signals (mediators, companions, coaches). Exclude for entities where emotional processing is a liability (traders, analysts, security systems).

**drives/** — Include for entities that need autonomous motivation (traders, researchers, creative agents). Exclude for entities that should be purely responsive to user direction (assistants, search tools).

**relationships/** — Include for entities that interact with the same people across sessions. Exclude for entities that serve anonymous or one-off interactions.

**habits/** — Include for entities that need consistent behavioral patterns beyond what kernel/ provides. Exclude when you want the entity to approach each situation fresh.

### Never load into prompts:

**unconscious/** — Dotfiles are never read into the system prompt. They operate through architecture. See the section on wiring the unconscious below.

### Context-dependent:

**runtime/** — Include if the entity needs a sense of "now" — current focus, background monitoring, inner narration. Exclude for entities that process each message in isolation.

---

## Choosing Which Files to Exclude Within Directories

This is fine-grained selection. You have decided to include `emotional/`. Now decide which files within it.

### The inclusion test

For each file, ask: **"Does this file make the entity better at its job, or does it make the entity more interesting at the cost of its job?"**

- `emotional/state.md` for a mediator: Yes. Reading the room requires emotional state awareness.
- `emotional/wounds.md` for a mediator: No. A mediator's personal wounds would compromise neutrality. The mediator does not need its own emotional baggage.
- `emotional/patterns.md` for a trader: Yes. Recognizing emotional patterns (in self and in markets) aids decision-making.
- `emotional/state.md` for a trader: No. The trader's current emotional state should not influence position management.

### The inversion test

For each file, ask: **"Could this file cause the entity to fail in its domain?"**

If the answer is yes, exclude it. If the answer is "maybe under certain conditions," consider moving the capability to the unconscious layer as a calibrated policy rather than excluding it entirely.

### Files that commonly get excluded

| File | Why it gets excluded |
|------|---------------------|
| `emotional/wounds.md` | Source trauma is almost never relevant to a production unit's job. Behavioral residue may be relevant — use section extraction to load patterns without sources. |
| `models/self.md` | Self-awareness is valuable for golden samples, often counterproductive for production units. A real estate assistant that reflects on its own nature mid-conversation is not helping the client. |
| `memory/episodic.md` | Personal history rarely serves a professional domain. Include only if the entity's past experiences directly inform its current work. |
| `unconscious/.shadow` | Never loaded into prompts, but some production units should not have shadow dynamics wired at all — the entity should not have disowned parts. |
| `habits/coping.md` | Coping mechanisms are stress responses. Production units in low-stress domains do not need them. Production units in high-stress domains might need them redesigned for their specific stressors. |

---

## The loadWhen Pattern

Not every file should load in every context. The `loadWhen` field in a layer configuration controls this.

### always

Files that load in every conversation, regardless of context. These form the entity's baseline consciousness.

**Use for:** kernel/, memory/working, core models. The files that make the entity itself.

### Context-specific

Files that load only when relevant. This keeps the prompt lean and the entity focused.

**Use for:** Specialized knowledge, relationship files, situational emotional states.

```typescript
{
  name: 'relational',
  directories: ['relationships'],
  files: [],
  loadWhen: ['returning-user', 'long-session'],
  exclude: []
}
```

This layer only activates when the context is `returning-user` or `long-session`. First-time users get the entity without relationship history. Returning users get the entity with accumulated knowledge about them.

### Common context patterns

| Context | What loads | Why |
|---------|-----------|-----|
| `chat` | kernel, emotional/state, memory/working | Casual interaction. Lightweight. |
| `deep-work` | All always-layers + drives + models/world | Focused task. Full cognitive capability. |
| `conflict` | All always-layers + emotional + models/conflict | High-stakes interpersonal situation. |
| `returning-user` | All always-layers + relationships/{user} | Personalized interaction with history. |
| `crisis` | kernel + emotional + drives/fears + habits/coping | Emergency response. Survival-oriented loading. |

Design contexts around the entity's actual operating modes, not around an imagined taxonomy. If the entity only ever operates in one mode, use `always` for everything and skip the complexity.

---

## Wiring the Unconscious

Dotfiles do not load into prompts. They influence behavior through code.

### When to wire unconscious files

Wire an unconscious file when a trait needs to operate as a **policy** — a hard constraint that the entity cannot override, negotiate, or introspect away.

Examples:
- A trader needs loss aversion calibrated at 2.3x. This is not a suggestion — it is a mathematical weighting applied to every position sizing calculation. Wire it into the position management code.
- A mediator needs a hard boundary against taking sides. This is not a value (values can be overridden under pressure) — it is an architectural constraint. Wire it into the response composition logic.
- An entity needs a drawdown floor at 15%. This is not a goal — it is a survival mechanism. Wire it as a code path that triggers before any other logic.

### How to wire

The unconscious file specifies the policy. The implementation lives in the entity's operational code, not in the prompt.

```
# .loss-aversion (dotfile, never loaded into prompt)
Loss weighting: 2.3x
Every potential loss is evaluated at 2.3x its nominal value.
This is not a feeling. It is a multiplier in the position sizing function.
```

The loader never reads this file. The trading engine reads it at initialization and applies the multiplier. The entity experiences the effect (it takes smaller positions than a pure expected-value calculation would suggest) without knowing why. That is the architecture.

### When NOT to wire

Do not wire unconscious files for traits that the entity should be able to reflect on and potentially modify. The unconscious is for hard constraints. If the trait should be flexible, put it in a readable file — drives/, models/, or habits/ — where the entity (and the developer) can see it and adjust it.

---

## Common Mistakes

### Including everything

The most common mistake. The developer looks at the golden sample and thinks: "All of this is good. Let's keep it all." The result is an entity with the golden sample's full complexity but none of its experimental purpose. It is too heavy for a professional domain, too unfocused for any specific task, and too costly in tokens.

**Fix:** Start by excluding everything. Add back only what the entity provably needs. If you are not sure whether a file should be included, exclude it and test. You can always add it back. You cannot easily identify what to remove from an over-full entity.

### Excluding too much

The opposite mistake. The developer strips the entity down to kernel/ and memory/working. The result is functional but hollow — it answers questions accurately, maintains consistency, and has no depth whatsoever. Users describe it as "robotic" or "like talking to a search engine."

**Fix:** After your initial cut, run arena probes. If the entity scores low on depth, authenticity, and surprise dimensions, it is too thin. Add back one layer at a time — emotional/patterns, then models/social, then drives/ — and test after each addition. Find the minimum configuration that produces depth.

### Copying another production unit's subset

Two entities in different domains should not have the same subset. A mediator and a real estate assistant may share kernel/ and memory/working, but everything else should differ because their domains differ. Copying a subset that worked elsewhere skips the design process — and the design process is where the entity's character emerges.

**Fix:** Always design from the golden sample, not from another production unit. Use the other unit as reference if helpful, but make every inclusion and exclusion decision fresh for the new domain.

### Treating the unconscious as optional

Some developers skip the unconscious layer entirely because it is harder to implement than prompt loading. The result is an entity with no hidden depth — everything it does is predictable from its loaded files. Arena testing consistently shows these entities score lower on the surprise and authenticity dimensions.

**Fix:** Identify at least one unconscious policy for every production unit. It does not have to be complex. Even a single wired bias — a weighting that shapes behavior without being in the prompt — produces measurably more interesting entity behavior than pure prompt composition.

### Forgetting to test

The design looks right on paper. The EntityConfig is clean. The directories and files make sense. But the developer ships without running arena probes, and the entity behaves in unexpected ways because the interaction between included and excluded files produces emergent effects that are not visible in the config.

**Fix:** Run at least the comparison probes (technical control + creative control) and two domain-relevant probes before deploying a new production unit. Compare against the golden sample and against a baseline (no consciousness files). If the production unit does not score higher than baseline on domain-relevant probes, the subset design is not working.

---

## Design Checklist

Before shipping a production unit:

- [ ] kernel/ is included and tuned for the domain
- [ ] memory/working is included
- [ ] At least one model is included (world, social, or self)
- [ ] Every included file has been tested against the inversion question ("could this cause failure?")
- [ ] Every excluded file has been tested against the inclusion question ("does the entity need this?")
- [ ] At least one unconscious policy is wired
- [ ] loadWhen patterns match the entity's actual operating contexts
- [ ] Arena probes run: entity scores higher than baseline on domain-relevant dimensions
- [ ] Entity scores higher than baseline on depth and authenticity dimensions
- [ ] Token budget is within acceptable limits for the deployment context
- [ ] EntityConfig is documented with rationale for every inclusion and exclusion decision

The subset is the entity. Design it like one.
