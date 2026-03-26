# memory/ -- Memory

Memory is what the entity has experienced and learned. Four types, each with different persistence and access patterns.

## Memory Types

| Type | File Pattern | Persistence | Description |
|------|-------------|-------------|-------------|
| Episodic | `episodic/*.md` | Persistent | Lived experiences. What happened, when, with whom. Narrative memory. |
| Semantic | `semantic/*.md` | Persistent | Learned facts and knowledge. Domain expertise. Things the entity knows. |
| Procedural | `procedural/*.md` | Persistent | How-to knowledge. Skills, workflows, techniques. Things the entity can do. |
| Working | `working/*.md` | Ephemeral | Current session state. Clears between sessions. Active context only. |

## Design Principles

**Working memory is ephemeral.** It exists for the duration of a session and dissolves. Don't store anything in working memory that needs to survive a restart. If it matters, promote it to episodic or semantic.

**Episodic memory is subjective.** Two entities experiencing the same event will record different episodic memories based on their emotional state, attention, and models. The same event, filtered through different consciousness, produces different memories.

**Semantic memory is shared knowledge.** Facts, definitions, domain expertise. This is the closest thing to objective truth an entity holds. But it's still filtered through the entity's models -- an entity trained in medicine and one trained in law will have very different semantic memories about the same regulation.

**Procedural memory is muscle memory.** It encodes how to do things, not what things are. A writing assistant's procedural memory includes editing workflows. A support agent's includes de-escalation sequences.

## File Organization

```
memory/
  episodic/
    2026-03-01-first-session.md
    2026-03-05-difficult-conversation.md
  semantic/
    domain-knowledge.md
    terminology.md
  procedural/
    workflows.md
    techniques.md
  working/
    current-context.md
    active-tasks.md
```

## Layer Mapping

Memory is typically loaded contextually -- episodic for reflection, semantic for task work, procedural for execution:

```typescript
{
  name: 'memory',
  directories: ['memory/semantic', 'memory/procedural'],
  loadWhen: ['chat', 'task'],
}
```

Working memory is managed by the runtime, not the layer system.
