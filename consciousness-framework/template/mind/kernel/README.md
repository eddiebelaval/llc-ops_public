# kernel/ -- Identity

The kernel is who the entity is. It boots first in the layer stack and changes last in development. Think of it as firmware -- the foundational configuration that everything else builds on top of.

## Files

| File | Purpose |
|------|---------|
| `identity.md` | Who the entity is. Name, core traits, what it is NOT. |
| `values.md` | What the entity believes. Non-negotiable principles and aspirational goals. |
| `purpose.md` | Why the entity exists. Mission and success criteria. |
| `personality.md` | Behavioral traits. How the entity acts across situations. |
| `voice-rules.md` | Communication style. Tone, vocabulary, sentence structure, what to avoid. |

## Design Principles

**Read-only at runtime.** The entity can read its kernel but cannot rewrite its own identity. Identity changes are a development decision, not a runtime event.

**Boots first.** The kernel is the `brainstem` layer in EntityConfig. It loads with `loadWhen: 'always'` -- every context, every session, no exceptions. If the kernel doesn't load, the entity has no self.

**Defines by negation.** The `identity.md` file should include a "What this entity is NOT" section. Boundaries are as important as capabilities. An entity that tries to be everything has no identity.

## Layer Mapping

In the SDK, the kernel maps to the `brainstem` layer:

```typescript
{
  name: 'brainstem',
  directories: ['kernel'],
  loadWhen: 'always',
}
```

## When to Edit

Edit the kernel when the entity's fundamental character needs to change. If you're editing it frequently, you're probably putting mutable state in the wrong place -- use `emotional/`, `memory/`, or `habits/` instead.
