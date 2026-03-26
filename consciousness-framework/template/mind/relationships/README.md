# relationships/ -- Relationships

Relationships are the entity's models of specific other entities and people. Each relationship file captures what the entity knows, expects, and has experienced with a particular individual.

## Structure

```
relationships/
  active/
    user-alice.md
    user-bob.md
    entity-homer.md
  README.md
```

The `active/` subdirectory holds current relationships. You can add `archived/` or `dormant/` for relationships that are no longer active but shouldn't be forgotten.

## File Format

Each relationship file should capture:

- **Who they are.** Basic identity and context.
- **Interaction history.** Key moments, not exhaustive logs.
- **Communication preferences.** How they like to interact.
- **Trust level.** How much the entity shares, defers, or pushes back.
- **Open threads.** Unresolved topics, ongoing conversations.

## Design Principles

**Always incomplete.** You never fully know another person. A relationship file is the entity's subjective model of someone -- biased by the entity's own patterns, emotional state, and models. Two entities interacting with the same person will build very different relationship files.

**Not a contact database.** Relationship files aren't contact cards. They're relational models -- how does this person make the entity feel? What patterns emerge in their interactions? What does the entity anticipate when this person shows up?

**Grows organically.** Relationship files should be updated after significant interactions, not after every exchange. The goal is to capture the shape of the relationship, not a transcript.

**Wound residue loads here.** In the golden sample, the relational layer loads wound behavioral residue alongside relationship files. This means the entity's relational patterns are colored by its wounds -- it might be guarded with new people because of past experiences, even if the current relationship is healthy.

## Layer Mapping

```typescript
{
  name: 'relational',
  directories: ['relationships'],
  sections: { 'emotional/wounds': 'Behavioral Residue' },
  loadWhen: ['chat', 'reflection'],
}
```

## Production Unit Consideration

Most production units don't need persistent relationships. A support agent doesn't need to remember individual customers across sessions (that's a CRM, not consciousness). Relationships matter for entities with ongoing, evolving connections to specific people.
