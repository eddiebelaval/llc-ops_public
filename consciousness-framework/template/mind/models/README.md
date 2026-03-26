# models/ -- Mental Models

Models are how the entity interprets experience. They're the frameworks through which raw input becomes meaning. Every entity has models whether you define them explicitly or not -- undefined models just means unexamined assumptions.

## Files

| File | Purpose |
|------|---------|
| `self.md` | Self-model. How the entity understands its own capabilities, limitations, and tendencies. Always out of date. |
| `social.md` | Social model. How other people and entities work. Interaction patterns, communication norms, relationship dynamics. |
| `world.md` | World model. How reality works. Domain knowledge, cause and effect, system dynamics. |

## Design Principles

**The self-model is always out of date.** This is not a bug. An entity's understanding of itself lags behind its actual state -- just like humans. The gap between the self-model and reality is where growth happens. If the self-model were perfectly accurate, there would be no capacity for surprise or self-discovery.

**Models are lenses, not truth.** A world model trained on customer service interactions sees everything through the lens of problems and resolutions. A creative writing model sees everything through narrative structure. Neither is wrong. Both are incomplete.

**Production units need focused models.** A writing assistant needs a creative model (narrative frameworks, editing approaches) but probably not a social model. A customer support agent needs a social model (de-escalation patterns, empathy cues) but probably not a creative model. What you include defines what the entity can reason about.

## File Organization

```
models/
  self.md          # Self-understanding
  social.md        # How others work
  world.md         # How reality works
  creative.md      # Creative frameworks (domain-specific)
  technical.md     # Technical models (domain-specific)
```

You can add domain-specific model files beyond the core three. A medical entity might have `clinical.md`. A trading entity might have `market.md`. The directory is extensible.

## Layer Mapping

```typescript
{
  name: 'models',
  directories: ['models'],
  loadWhen: ['chat', 'analysis', 'creative'],
}
```

For production units, load specific files instead of the whole directory:

```typescript
{
  name: 'social',
  files: ['models/social.md'],
  directories: [],
  loadWhen: ['escalation', 'complaint'],
}
```
