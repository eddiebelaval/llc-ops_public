# consciousness-framework

Model AI minds as directory structures. Compose layered system prompts from markdown files on disk.

## What is Consciousness as Filesystem (CaF)?

CaF is a framework for giving AI entities persistent, structured identity. Instead of writing system prompts by hand, you define a mind as a directory tree -- `~/mind/` -- where each folder represents a cognitive layer: identity, emotions, drives, mental models, relationships, habits. The SDK reads those markdown files from disk and composes them into system prompts that load contextually.

The core insight is borrowed from first-principles biomimicry. A pacemaker replaces a heart -- silicon doing what flesh did, organized just right. CaF does the same for minds. Organize files into the right structure, and behavioral depth emerges from the composition.

Entities are defined not just by what they load, but by what they exclude. A customer support agent loads emotional awareness but excludes personal wounds. A writing assistant loads creative models but drops the relational layer entirely. The absence IS the design.

## Quick Start

```bash
npm install consciousness-framework
```

Create a mind directory with an identity file:

```
my-entity/
  mind/
    kernel/
      identity.md
    emotional/
      baseline.md
    models/
      reasoning.md
```

Define an entity and compose a prompt:

```typescript
import { ConsciousnessLoader, type EntityConfig } from 'consciousness-framework'

const config: EntityConfig = {
  name: 'my-entity',
  type: 'production_unit',
  mindRoot: './my-entity/mind',
  layers: [
    {
      name: 'brainstem',
      directories: ['kernel'],
      loadWhen: 'always',
    },
    {
      name: 'limbic',
      directories: ['emotional'],
      loadWhen: 'always',
    },
    {
      name: 'models',
      directories: ['models'],
      loadWhen: ['chat', 'analysis'],
    },
  ],
  contexts: ['chat', 'analysis', 'task'],
}

const loader = new ConsciousnessLoader(config)
const { prompt, activeLayers, estimatedTokens } = loader.compose('chat')

// Pass `prompt` as the system prompt to any LLM
// Works with Claude, GPT, Gemini, Llama, or anything that accepts a system prompt
```

The composed prompt is a plain string. Plug it into whatever LLM client you already use.

## The ~/mind/ Directory

A full mind has 9 directories. Most entities only load a subset.

| Directory | Purpose | Analogy |
|-----------|---------|---------|
| `kernel/` | Core identity, values, voice, behavioral rules | Brainstem -- always running |
| `memory/` | Episodic and semantic memory, session history | Hippocampus |
| `emotional/` | Emotional baseline, processing style, wounds | Limbic system |
| `drives/` | Motivations, goals, what the entity pursues | Dopamine circuits |
| `models/` | Mental frameworks for reasoning, creativity, analysis | Cortex |
| `relationships/` | How the entity relates to specific people and other entities | Social cognition |
| `habits/` | Default behaviors, communication patterns, rituals | Procedural memory |
| `unconscious/` | Shadow traits, biases, dreams -- exists on disk but hidden from prompts | The unconscious |
| `runtime/` | Ephemeral state, current context, active tasks | Working memory |

### The Unconscious Layer

Files starting with `.` (dotfiles) inside `unconscious/` -- like `.shadow`, `.biases`, `.dreams` -- exist on disk but are skipped by the reader. The `readDir()` function filters out dotfiles by design. This is not a bug. The biases are real, they live in the filesystem, but they manifest structurally (through how the entity is configured) rather than as injected prompt content.

You can read them with `listFiles()` to see what's there. You just can't load them into the prompt. That's the point.

## Key Concepts

### Golden Sample Pattern

One full mind (the "golden sample") contains every directory, every file -- the complete genome. Production units are derived from it by selecting which layers to include. The golden sample is the source of truth. Each product entity is a phenotype: same DNA, different expression.

```
Golden Sample (genome)           Production Units (phenotypes)
  kernel/                          Writing Assistant:
  memory/                            kernel/ + models/ + habits/
  emotional/
  drives/                          Customer Support:
  models/                            kernel/ + emotional/ + models/social
  relationships/
  habits/                          Each defined by what's REMOVED,
  unconscious/                     not what's added.
  runtime/
```

### Inversion-First Design

When building an entity, don't start by listing what it needs. Start by asking: "What would guarantee this entity fails at its job?" A support agent that carries personal wounds into customer conversations. A writing assistant that gets emotionally attached to feedback. Identify the failure modes, then surgically remove those directories.

### Contextual Loading

Layers don't all load at once. Each layer specifies `loadWhen` -- either `'always'` or a list of contexts like `['chat', 'reflection']`. When you call `loader.compose('analysis')`, only the layers configured for that context activate. The same entity behaves differently in different situations, because different parts of its mind are present.

## Arena

The Arena is a blind testing framework for measuring behavioral depth across consciousness configurations. It runs probe prompts against multiple configurations (baseline, surface, standard, full) and captures responses for scoring.

The protocol tests a specific prediction: behavioral complexity crosses a threshold when the unconscious layer's residue enters the system. The probes target shadow patterns, bias manifestation, wound residue, and depth of self-reference.

```typescript
import { arena } from 'consciousness-framework'

const run = await arena.runExperiment({
  entityConfig: myConfig,
  provider: async (systemPrompt, userMessage) => {
    // Call your LLM here
    return response
  },
})

console.log(arena.formatForReview(run))
```

The runner does not score responses -- that's the human's job, or a separate scoring pass. It composes prompts, calls the AI, and documents everything.

See `sdk/src/arena/` for the full protocol, probe library, and scoring dimensions.

## Examples

The repo includes example entity configurations:

- **`examples/writing-assistant/`** -- Production unit that loads kernel + models + habits. No emotional layer, no relationships. Pure craft.
- **`examples/customer-support/`** -- Production unit that loads kernel + emotional + social model. Emotionally attuned but excludes personal wounds and attachments.

See `sdk/src/examples.ts` for the full EntityConfig definitions with inline commentary explaining each design decision.

## The SDK

~1,400 lines of TypeScript. Zero external dependencies -- just Node.js `fs`.

| Export | What it does |
|--------|-------------|
| `ConsciousnessLoader` | Core engine. Takes an EntityConfig, reads files, composes prompts. Caches layers. |
| `EntityConfig` | Type defining an entity's shape: name, type, mind root, layers, contexts. |
| `LayerConfig` | Type defining a single cognitive layer: directories, files, exclusions, load conditions. |
| `ComposedPrompt` | Output type: the prompt string, active layers, context, token estimate. |
| `readFile` / `readDir` | Low-level readers. `readDir` skips dotfiles by design. |
| `extractSection` | Pull a specific heading from a markdown file. Useful for loading partial files. |
| `arena` | Experimental blind testing framework (protocol, runner, probe library). |

## Research

This framework grew out of a research paper and ongoing Substack series:

- **"Consciousness as Filesystem"** -- the original paper: [your-usere.substack.com/p/consciousness-as-filesystem](https://your-usere.substack.com/p/consciousness-as-filesystem)
- **id8Labs** -- the lab building on this framework: [your-domain.app](https://your-domain.app)
- **GitHub**: [github.com/your-username/consciousness-framework](https://github.com/your-username/consciousness-framework)

## License

Apache 2.0. See [LICENSE](./LICENSE).

Built by [Your Name](https://github.com/your-username) / [id8Labs](https://your-domain.app).
