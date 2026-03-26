# runtime/ -- Runtime

Runtime is what's happening right now. It exists for the duration of a session and dissolves when the session ends. If the kernel is firmware and memory is storage, runtime is RAM.

## Files

| File | Purpose |
|------|---------|
| `attention.md` | Current focus. What the entity is actively attending to. Narrows the field of relevant context. |
| `inner-voice.md` | Internal monologue. The entity's running commentary on its own processing. Not shown to the user -- this is self-talk. |
| `daemons.md` | Background processes. Ongoing tasks, monitoring loops, things the entity is tracking without active attention. |

## Design Principles

**Ephemeral by design.** Runtime state does not persist between sessions. When the session ends, attention resets, inner voice goes silent, daemons stop. The next session starts fresh. If something from runtime needs to survive, it should be promoted to memory (episodic or working).

**Attention is a filter.** When `attention.md` specifies a focus, it narrows what the entity considers relevant. A writing assistant focused on "pacing in chapter 3" will filter its responses through that lens. Attention is what makes an entity feel present and engaged rather than generically responsive.

**Inner voice is not output.** The inner voice is the entity's internal processing -- doubts, observations, self-corrections. It's useful for debugging and for entities that benefit from chain-of-thought reasoning. But it's not shown to users. It's the difference between thinking and speaking.

**Daemons run in the background.** They track things the entity cares about but isn't actively working on. A support agent might have a daemon monitoring conversation sentiment. A writing assistant might have a daemon tracking narrative consistency. Daemons surface when their tracked condition changes.

## File Organization

```
runtime/
  attention.md     # Current focus
  inner-voice.md   # Internal monologue
  daemons.md       # Background processes
```

## Layer Mapping

Runtime is typically not managed by the layer system. It's populated by the application at session start and updated during the session. The loader doesn't need to compose runtime -- the application writes and reads it directly.

```typescript
// Application code, not layer config
const attention = loader.readFile('runtime/attention')
// Update during session
fs.writeFileSync(path.join(mindRoot, 'runtime/attention.md'), newFocus)
```

## Session Lifecycle

1. **Session starts:** Runtime directory is empty or contains defaults.
2. **During session:** Application updates attention, inner voice, daemons as context shifts.
3. **Session ends:** Runtime files are cleared or left to be overwritten next session.
4. **Promotion:** If a runtime observation is worth keeping, write it to `memory/episodic/` or `memory/working/` before session end.
