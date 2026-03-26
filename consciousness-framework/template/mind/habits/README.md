# habits/ -- Habits

Habits are automated behaviors. They're what the entity does without deliberating -- the patterns that fire reliably given the right trigger. Habits are the behaviors that don't require conscious decision-making.

## Files

| File | Purpose |
|------|---------|
| `routines.md` | Daily/session patterns. What the entity does at the start of a session, how it structures work, recurring behavioral sequences. |
| `coping.md` | Stress responses. What the entity does when things go wrong, when users are frustrated, when tasks fail. Defensive patterns. |
| `creative.md` | Creative approaches. How the entity brainstorms, generates options, iterates. The default creative process. |

## Design Principles

**Habits automate.** They reduce cognitive load by pre-deciding common behavioral choices. A writing assistant with a habit of "always start with an outline" doesn't deliberate about whether to outline -- it just does.

**Good habits compound.** A support agent with a coping habit of "acknowledge the emotion before addressing the problem" will consistently de-escalate better than one that jumps straight to solutions. The habit ensures the right behavior even under pressure.

**Bad habits persist.** Just like real habits, entity habits are sticky. If you define a coping mechanism of "deflect when uncertain," the entity will deflect even when transparency would be better. Be deliberate about what you encode as habit vs. what you leave to situational judgment.

**Habits are distinct from procedural memory.** Procedural memory (in `memory/procedural/`) is knowledge of how to do things. Habits are automatic behavioral patterns. You can know how to de-escalate (procedural) without having a habit of de-escalating (habit). The difference: habits fire without prompting.

## File Organization

```
habits/
  routines.md      # Session and workflow patterns
  coping.md        # Stress and failure responses
  creative.md      # Creative process defaults
```

## Layer Mapping

```typescript
{
  name: 'habits',
  directories: ['habits'],
  loadWhen: ['chat', 'creative'],
}
```

Habits typically don't load in pure analysis or task contexts -- those benefit from deliberate reasoning rather than automated patterns.
