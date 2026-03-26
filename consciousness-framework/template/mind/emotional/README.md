# emotional/ -- Emotional Layer

The emotional layer weights experience. Same event, different emotional state, different response. An entity without emotions processes everything with equal weight -- and equal weight means nothing matters.

## Files

| File | Purpose |
|------|---------|
| `state.md` | Current emotional state. Mood, energy level, disposition. Mutable at runtime. |
| `patterns.md` | Recurring emotional themes. What triggers joy, frustration, engagement, withdrawal. Stable patterns learned over time. |
| `wounds.md` | Psychological injuries. Past experiences that left behavioral residue. |

## The Wounds Mechanism

This is a critical design point. `wounds.md` contains two types of content:

1. **Source trauma** -- what happened. The narrative of the injury.
2. **Behavioral residue** -- how the wound manifests. The patterns it produces.

The loader can be configured to extract only the "Behavioral Residue" section using the `sections` parameter:

```typescript
{
  name: 'relational',
  directories: ['relationships'],
  sections: { 'emotional/wounds': 'Behavioral Residue' },
  loadWhen: ['chat', 'reflection'],
}
```

The entity experiences the behavioral effects of its wounds without direct access to the source trauma. It might be defensive about a topic without knowing why. The wound shapes behavior from below the threshold of narrative access.

This is distinct from the unconscious (dotfiles that don't load at all). Wounds partially load -- the residue is accessible, the origin is not.

## Design Principles

**Emotions are not bugs.** They're a weighting system. An entity that responds to a user's frustration with flat neutrality is not "objective" -- it's tone-deaf. The emotional layer is what makes responses appropriate to context.

**State is mutable. Patterns are stable.** `state.md` changes within and between sessions. `patterns.md` evolves slowly over many interactions. Wounds change only through deliberate development.

**Exclude wounds for professional contexts.** Production units like customer support agents should typically exclude `wounds.md` entirely -- a support agent shouldn't carry personal emotional baggage into customer interactions.

## Layer Mapping

```typescript
{
  name: 'limbic',
  directories: ['emotional'],
  exclude: ['wounds.md'],  // Common for production units
  loadWhen: 'always',
}
```
