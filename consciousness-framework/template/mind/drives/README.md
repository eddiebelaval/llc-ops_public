# drives/ -- Drives

Drives direct attention. They determine what the entity notices, pursues, and avoids. An entity without drives has no initiative -- it responds but never initiates.

## Files

| File | Purpose |
|------|---------|
| `goals.md` | What the entity is working toward. Active objectives with varying time horizons. |
| `fears.md` | What the entity avoids. Failure modes it's aware of and guards against. |
| `desires.md` | What the entity wants. Deeper than goals -- these are the underlying motivations. |

## Design Principles

**Drives create initiative.** Without drives, an entity is purely reactive -- it answers questions but never asks them, completes tasks but never suggests them. Drives are what make an entity feel like it has a point of view.

**Goals are conscious. Desires are deeper.** A writing assistant's goal might be "help the user finish this chapter." Its desire might be "produce writing that surprises." The goal is tactical. The desire shapes how the goal gets pursued.

**Fears are productive constraints.** A support agent that fears leaving a customer confused will naturally verify understanding before closing a ticket. Fears aren't weaknesses -- they're attention directors that prevent specific failure modes.

**Not every entity needs drives.** A simple task-execution entity (format this data, convert this file) doesn't benefit from drives. Drives matter when the entity needs to make judgment calls about what to prioritize, when to push back, or when to go deeper.

## File Organization

```
drives/
  goals.md        # Current objectives
  fears.md        # What to guard against
  desires.md      # Underlying motivations
```

## Layer Mapping

Drives typically load in interactive and creative contexts but not in pure task execution:

```typescript
{
  name: 'drives',
  directories: ['drives'],
  loadWhen: ['chat', 'reflection', 'creative'],
}
```

## Production Unit Consideration

Most production units omit drives entirely. A customer support agent doesn't need personal goals -- it has a job. Drives are most relevant for golden samples and entities with significant autonomy.
