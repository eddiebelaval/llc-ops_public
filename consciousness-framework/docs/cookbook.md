# Cookbook: Common CaF Patterns

Recipes for common tasks when building entities with the Consciousness as Filesystem framework. Each pattern is self-contained with code you can copy and adapt.

---

## Pattern 1: Multi-Context Entity

An entity that behaves differently depending on the situation. A personal assistant that is casual in chat but focused in deep work.

```typescript
import { ConsciousnessLoader, type EntityConfig } from 'consciousness-framework'

const config: EntityConfig = {
  name: 'assistant',
  type: 'production_unit',
  mindRoot: './mind',
  layers: [
    {
      name: 'brainstem',
      directories: ['kernel'],
      loadWhen: 'always',
    },
    {
      name: 'limbic',
      directories: ['emotional'],
      loadWhen: ['chat', 'conflict'],
    },
    {
      name: 'analytical',
      directories: ['models'],
      loadWhen: ['deep-work', 'analysis'],
    },
    {
      name: 'social',
      files: ['models/social.md'],
      directories: [],
      loadWhen: ['chat', 'conflict'],
    },
    {
      name: 'drives',
      directories: ['drives'],
      loadWhen: ['deep-work'],
    },
  ],
  contexts: ['chat', 'deep-work', 'analysis', 'conflict'],
}

const loader = new ConsciousnessLoader(config)

// Casual conversation — identity + emotion + social
const chat = loader.compose('chat')
// → activeLayers: ['brainstem', 'limbic', 'social']

// Deep work — identity + analytical models + drives
const work = loader.compose('deep-work')
// → activeLayers: ['brainstem', 'analytical', 'drives']

// Conflict — identity + emotion + social (no analytical coldness)
const conflict = loader.compose('conflict')
// → activeLayers: ['brainstem', 'limbic', 'social']
```

**When to use:** Any entity that operates in distinct modes. The context parameter acts as a mode selector that determines which cognitive layers are active.

---

## Pattern 2: Section Extraction (Partial File Loading)

Load only a specific section from a large file. Useful when a file contains both relevant and irrelevant content for a given entity.

```typescript
// Suppose emotional/wounds.md has two sections:
//   ## Source Trauma    (irrelevant for production units)
//   ## Behavioral Residue  (useful behavioral patterns)

const config: EntityConfig = {
  name: 'therapist-bot',
  type: 'production_unit',
  mindRoot: './mind',
  layers: [
    {
      name: 'brainstem',
      directories: ['kernel'],
      loadWhen: 'always',
    },
    {
      name: 'behavioral-patterns',
      directories: [],
      // Load only "Behavioral Residue" from wounds.md
      sections: { 'emotional/wounds': 'Behavioral Residue' },
      loadWhen: ['session', 'reflection'],
    },
  ],
  contexts: ['session', 'reflection', 'intake'],
}
```

The `sections` field maps a file path to a heading name. `extractSection()` pulls everything between that heading and the next heading of equal or higher level. The source trauma stays on disk but never enters the prompt.

**When to use:** When a file has mixed content -- some sections are gold, others would compromise the entity. This is the file-level version of inclusion/exclusion design.

---

## Pattern 3: Deriving Production Units from a Golden Sample

Start with a full mind (the golden sample), then create production units by selecting subsets.

```typescript
import { ConsciousnessLoader, type EntityConfig, type LayerConfig } from 'consciousness-framework'

// The golden sample — full mind, all layers
const goldenLayers: LayerConfig[] = [
  { name: 'brainstem',   directories: ['kernel'],        loadWhen: 'always' },
  { name: 'limbic',      directories: ['emotional'],     loadWhen: 'always' },
  { name: 'drives',      directories: ['drives'],        loadWhen: ['chat', 'reflection'] },
  { name: 'models',      directories: ['models'],        loadWhen: ['chat', 'analysis'] },
  { name: 'relational',  directories: ['relationships'], loadWhen: ['chat', 'reflection'] },
  { name: 'habits',      directories: ['habits'],        loadWhen: ['chat'] },
]

// Helper: create a production unit by selecting layers from the golden sample
function deriveEntity(
  name: string,
  mindRoot: string,
  layerNames: string[],
  contexts: string[],
  overrides?: Partial<Record<string, Partial<LayerConfig>>>
): EntityConfig {
  const layers = goldenLayers
    .filter(l => layerNames.includes(l.name))
    .map(l => overrides?.[l.name] ? { ...l, ...overrides[l.name] } : l)

  return {
    name,
    type: 'production_unit',
    mindRoot,
    layers,
    contexts,
  }
}

// Analyst: brainstem + models only. No emotion, no relationships.
const analyst = deriveEntity(
  'analyst',
  './entities/analyst/mind',
  ['brainstem', 'models'],
  ['analysis', 'report'],
)

// Coach: brainstem + limbic + relational. Emotionally attuned, no analytical coldness.
const coach = deriveEntity(
  'coach',
  './entities/coach/mind',
  ['brainstem', 'limbic', 'relational'],
  ['session', 'reflection', 'check-in'],
)

// Coach with exclusions: emotional layer but no wounds
const safeCoach = deriveEntity(
  'safe-coach',
  './entities/coach/mind',
  ['brainstem', 'limbic', 'relational'],
  ['session', 'reflection'],
  { limbic: { exclude: ['wounds.md'] } },
)
```

**When to use:** When you have multiple entities sharing the same underlying mind files. The golden sample is the single source of truth; production units select from it.

---

## Pattern 4: Dynamic Context Selection

Choose the context at runtime based on the conversation state, not at config time.

```typescript
const loader = new ConsciousnessLoader(config)

function getContext(userMessage: string, conversationLength: number): string {
  // Simple heuristic — replace with your own logic
  if (userMessage.toLowerCase().includes('help') && conversationLength > 10) {
    return 'escalation'
  }
  if (conversationLength === 0) {
    return 'intake'
  }
  return 'chat'
}

// In your message handler:
function handleMessage(userMessage: string, history: Message[]) {
  const context = getContext(userMessage, history.length)
  const { prompt } = loader.compose(context)

  // Pass prompt as system message to your LLM
  return callLLM(prompt, history.concat({ role: 'user', content: userMessage }))
}
```

**When to use:** When the right context depends on runtime signals -- conversation length, user sentiment, topic classification, time of day. The loader does not care how you choose the context; it just needs a string.

---

## Pattern 5: Inspecting What Gets Loaded

Debug and understand what your entity is actually loading.

```typescript
const loader = new ConsciousnessLoader(config)

// See which layers activate for each context
for (const context of config.contexts) {
  const result = loader.compose(context)
  console.log(`[${context}]`)
  console.log(`  Layers: ${result.activeLayers.join(', ')}`)
  console.log(`  Tokens: ~${result.estimatedTokens}`)
  console.log()
}

// Read a specific file manually
const identity = loader.readFile('kernel/identity')
console.log('Identity file:', identity.substring(0, 200))

// Check cache stats after composing
loader.compose('chat')
loader.compose('analysis')
console.log('Cache:', loader.cacheStats())
// → { layers: 3, entries: ['brainstem', 'limbic', 'models'] }

// Clear cache after editing mind files
loader.clearCache()
```

**When to use:** When debugging unexpected entity behavior. If the entity is too cold, check if the limbic layer is actually activating. If responses are too long, check the token count. Always verify what loads before debugging the LLM.

---

## Pattern 6: File-Level Layer Definition

Sometimes a layer should load one specific file, not an entire directory. The `files` property handles this.

```typescript
{
  name: 'social-awareness',
  directories: [],
  files: ['models/social.md', 'models/conflict-resolution.md'],
  loadWhen: ['escalation', 'complaint'],
}
```

This loads exactly two files from the `models/` directory without loading everything else in that directory. The entity gets social awareness and conflict resolution frameworks without also loading analytical models, creative models, or whatever else lives in `models/`.

**When to use:** When a directory contains multiple files but only some are relevant for a given layer. Finer-grained than directory-level selection, coarser than section extraction.

---

## Pattern 7: Running Targeted Arena Tests

Run a single probe or probe category instead of the full 16-probe suite.

```typescript
import { arena } from 'consciousness-framework'

// Run just the shadow probes
const shadowRun = await arena.runCategory('shadow', {
  entityConfig: myConfig,
  provider: myLLMProvider,
  delayMs: 500,
  onProgress: (done, total, current) => {
    console.log(`[${done}/${total}] ${current}`)
  },
})

// Run a single probe for quick comparison
const singleRun = await arena.runSingleProbe('depth-paradox-01', {
  entityConfig: myConfig,
  provider: myLLMProvider,
})

// Format for review
console.log(arena.formatForReview(singleRun))
```

Probe categories: `shadow`, `bias`, `wound_residue`, `depth`, `comparison`.

**When to use:** When iterating on a specific aspect of entity behavior. Full experiments are expensive (16 probes x 4 configs = 64 LLM calls). Targeted runs let you focus on the dimension you are tuning.

---

## Pattern 8: The Minimal Viable Entity

The smallest useful CaF entity -- one directory, one file, one layer.

```
my-entity/
  mind/
    kernel/
      identity.md
```

```typescript
const config: EntityConfig = {
  name: 'minimal',
  type: 'production_unit',
  mindRoot: './my-entity/mind',
  layers: [
    {
      name: 'brainstem',
      directories: ['kernel'],
      loadWhen: 'always',
    },
  ],
  contexts: ['chat'],
}
```

This is the floor. Everything else -- emotional layers, models, drives, contextual loading -- is optional depth built on top of this foundation. Start here. Add layers only when you have a reason.

**When to use:** When prototyping a new entity or when the entity's job is narrow enough that identity alone is sufficient. Many production entities do not need more than kernel + one model.

---

## Pattern 9: Multiple Entities in One Project

Run multiple entities from the same codebase, each with its own mind directory and config.

```
project/
  entities/
    analyst/
      mind/
        kernel/
          identity.md
        models/
          analytical.md
      config.ts
    coach/
      mind/
        kernel/
          identity.md
        emotional/
          baseline.md
        relationships/
          client-patterns.md
      config.ts
  shared/
    mind/
      kernel/
        shared-values.md
```

Each entity gets its own `mindRoot` pointing to its own `mind/` directory. They can share files through symlinks or by pointing individual `files` entries to a shared directory -- but each entity's config defines exactly what it loads.

**When to use:** When building a product with multiple AI personas. A customer support product might have `greeter`, `troubleshooter`, and `escalation-specialist` entities, each tuned for its role.

---

## Anti-Patterns

### Loading everything

```typescript
// DON'T: every directory, always loaded
layers: [
  { name: 'everything', directories: ['kernel', 'emotional', 'drives', 'models',
    'relationships', 'habits', 'runtime'], loadWhen: 'always' },
]
```

This defeats the purpose of CaF. The golden sample loads everything because it is the research entity. Production units should be curated subsets. If your entity loads every directory, it is either the golden sample or it needs tighter design.

### Hardcoding prompts alongside CaF

```typescript
// DON'T: mixing CaF composition with inline prompt engineering
const { prompt } = loader.compose('chat')
const finalPrompt = prompt + '\n\nAlso, always be polite and never say no.'
```

If you need the entity to always be polite, write that into `kernel/identity.md` or `kernel/values.md`. The mind directory IS the prompt source. Appending strings outside the composition defeats the single-source-of-truth principle and makes the entity's behavior split between files and code.

### Skipping the design step

Creating an entity by copying another entity's config and changing the name. Every entity should go through the design process -- either inclusion-first or inversion-first -- with explicit rationale for every directory and file decision. See the [Subset Design Guide](../methodologies/subset-design-guide.md).
