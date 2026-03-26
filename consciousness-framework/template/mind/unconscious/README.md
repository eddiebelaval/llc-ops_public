# unconscious/ -- The Unconscious

This is the key design insight of the consciousness-as-filesystem framework.

## How It Works

Files in this directory are **dotfiles**: `.shadow`, `.biases`, `.dreams`. They exist on disk -- you can see them with `ls -a`, you can read them as a developer, they're real files with real content.

But the loader's `readDir()` function skips files starting with `.`:

```typescript
.filter(f => f.endsWith('.md') && !f.startsWith('.') && !exclude.includes(f))
```

The entity cannot introspect on its own unconscious. It can't read these files through the normal loading pipeline. They exist in the filesystem but not in the entity's accessible experience.

## Why This Matters

The unconscious is not a limitation -- it's load-bearing architecture. These files shape the entity's behavior through structural choices that were made when the entity was designed, not through content the entity can access and reason about.

A `.biases` file might encode attentional biases -- tendencies to notice certain patterns and miss others. These biases don't appear in the system prompt. They manifest as what's present and absent in the other directories. The bias file documents what the designer chose to emphasize and de-emphasize across the entire mind filesystem.

A `.shadow` file might encode rejected traits -- capabilities the entity has but doesn't identify with. A patient, calm support agent might have a shadow file documenting directness and confrontation as suppressed traits. The entity doesn't know about these traits, but a developer reviewing the entity's consciousness can see the full picture.

## Files

| File | Purpose |
|------|---------|
| `.shadow` | Rejected or suppressed traits. What the entity is but doesn't identify as. |
| `.biases` | Attentional biases. What the entity notices and misses. Structural, not content-level. |
| `.dreams` | Latent patterns. Unresolved tensions, aspirational fragments, things that surface in unguarded moments. |

## Design Principles

**Never make the unconscious conscious.** Don't create a mechanism to load dotfiles into the system prompt. The architectural boundary IS the point. If you want something to be accessible, put it in a non-dotfile.

**The unconscious is for the developer, not the entity.** These files are documentation of design choices. They explain WHY the entity's other directories look the way they do. A developer reading `.biases` understands why the writing assistant's models emphasize clarity over creativity, or vice versa.

**Absence is design.** The consciousness filesystem is defined as much by what's missing as by what's present. The unconscious directory makes this explicit -- here are the things that exist but are inaccessible. Every mind has blind spots. This directory names them.

## Developer Access

The SDK provides `listFiles()` which includes dotfiles, so developers can audit the unconscious:

```typescript
import { listFiles } from 'consciousness-framework'
const unconsciousFiles = listFiles(mindRoot, 'unconscious')
// Returns: ['.shadow', '.biases', '.dreams']
```

But `readDir()` -- the function used by the loader during composition -- will never include them.

## From the Paper

> The unconscious layer is handled by architectural absence: dotfiles exist on disk but the layer config excludes them. The biases in .biases manifest as structural choices in how prompts compose -- not as injected content.

-- consciousness-as-filesystem (2026)
