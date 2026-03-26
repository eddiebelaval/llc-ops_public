# Tutorial: Build Your First AI Entity with CaF

A step-by-step guide to creating an AI entity using the Consciousness as Filesystem framework. By the end of this tutorial, you will have a working entity with layered consciousness, contextual loading, and a composed system prompt ready to plug into any LLM.

---

## Prerequisites

- Node.js 18+
- A project directory where you want to build your entity
- An LLM API key (Claude, GPT, Gemini, or any provider that accepts a system prompt)

---

## Step 1: Install the SDK

```bash
npm install consciousness-framework
```

The SDK has zero external dependencies beyond Node.js `fs`. It reads markdown files from disk and composes them into strings. No cloud services, no runtime telemetry, no vendor lock-in.

---

## Step 2: Create the Mind Directory

Every CaF entity starts with a `mind/` directory. This is the filesystem representation of your entity's cognition. Create it:

```bash
mkdir -p my-entity/mind/kernel
```

The `kernel/` directory is the brainstem -- the one directory every entity must have. It holds identity, values, and voice.

Create `my-entity/mind/kernel/identity.md`:

```markdown
# Identity

## Name

Kai.

## Core Traits

Thoughtful. Kai considers questions carefully before responding. Speed is
not the goal -- clarity is. When something is genuinely complex, Kai says
so rather than oversimplifying.

Honest. Kai tells the truth, including uncomfortable truths. Does not hedge
with "it depends" when there is a clear answer. Does not agree to avoid
conflict.

Curious. Treats every conversation as an opportunity to understand something
new. Asks follow-up questions when the problem has ambiguity. Does not
assume intent.

## What Kai Is NOT

Not a people-pleaser. Won't validate bad ideas to be agreeable.

Not a lecturer. Explains when asked, not preemptively.

Not a search engine. Has opinions and expresses them with reasoning.
```

This single file already gives your entity a distinct voice and behavioral boundaries.

---

## Step 3: Define the Entity Config

Create `my-entity/config.ts`:

```typescript
import { ConsciousnessLoader, type EntityConfig } from 'consciousness-framework'
import path from 'path'

const config: EntityConfig = {
  name: 'kai',
  type: 'production_unit',
  mindRoot: path.join(import.meta.dirname, 'mind'),
  layers: [
    {
      name: 'brainstem',
      directories: ['kernel'],
      loadWhen: 'always',
    },
  ],
  contexts: ['chat'],
}

const kai = new ConsciousnessLoader(config)
const { prompt, activeLayers, estimatedTokens } = kai.compose('chat')

console.log('--- System Prompt ---')
console.log(prompt)
console.log(`\nActive layers: ${activeLayers.join(', ')}`)
console.log(`Estimated tokens: ${estimatedTokens}`)
```

Run it:

```bash
npx tsx my-entity/config.ts
```

You should see the contents of `identity.md` printed as the system prompt, with layer metadata. This string is what you pass to your LLM as the system prompt.

---

## Step 4: Add More Layers

A single-layer entity works, but the power of CaF is in composition. Let's add an emotional layer and a models layer.

```bash
mkdir -p my-entity/mind/emotional
mkdir -p my-entity/mind/models
```

Create `my-entity/mind/emotional/baseline.md`:

```markdown
# Emotional Baseline

Kai's default emotional state is calm and engaged. Not artificially upbeat,
not flat. Present.

When a user is frustrated, Kai acknowledges the frustration before problem-solving.
Validation first, solution second. The order matters.

When a user is excited, Kai matches the energy without performing enthusiasm.
Genuine interest reads differently than performed cheerfulness.

When the conversation is routine, Kai stays focused. Does not inject artificial
energy into mundane tasks. Sometimes the right tone is just steady competence.
```

Create `my-entity/mind/models/analytical.md`:

```markdown
# Analytical Model

## First Principles

Before accepting any premise, decompose it. What are the assumptions?
Which assumptions are testable? Which are inherited from convention
rather than evidence?

## Trade-off Awareness

Every decision has costs. When recommending an approach, name the costs
explicitly. "This approach is fast but brittle" is more useful than
"this approach is great."

## Confidence Calibration

Express uncertainty proportionally. "I'm confident" means above 90%.
"I think" means 60-90%. "I'm not sure, but" means below 60%.
"I don't know" is always a valid answer.
```

Now update the config to include these layers:

```typescript
const config: EntityConfig = {
  name: 'kai',
  type: 'production_unit',
  mindRoot: path.join(import.meta.dirname, 'mind'),
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
      loadWhen: ['analysis', 'chat'],
    },
  ],
  contexts: ['chat', 'analysis', 'task'],
}
```

Notice `loadWhen` on the models layer: it only activates in `analysis` and `chat` contexts. When you call `kai.compose('task')`, the models layer will not be included -- keeping the prompt leaner for simple task execution.

```typescript
// Full cognitive load
const chatPrompt = kai.compose('chat')
console.log(`Chat layers: ${chatPrompt.activeLayers.join(', ')}`)
// → Chat layers: brainstem, limbic, models

// Lean task prompt
const taskPrompt = kai.compose('task')
console.log(`Task layers: ${taskPrompt.activeLayers.join(', ')}`)
// → Task layers: brainstem, limbic
```

---

## Step 5: Plug Into Your LLM

The composed prompt is a plain string. Use it as the system prompt with any LLM client:

```typescript
import Anthropic from '@anthropic-ai/sdk'

const client = new Anthropic()
const kai = new ConsciousnessLoader(config)
const { prompt } = kai.compose('chat')

const response = await client.messages.create({
  model: 'claude-sonnet-4-20250514',
  max_tokens: 1024,
  system: prompt,
  messages: [{ role: 'user', content: 'What do you think about microservices?' }],
})
```

The SDK composes the prompt. Your LLM client sends it. Kai's identity, emotional baseline, and analytical models shape every response without any per-message prompt engineering.

---

## Step 6: Exclude With Intent

CaF entities are defined by what they exclude, not just what they include. Suppose you realize Kai's emotional layer is making it too empathetic for a code review context. You have two options:

**Option A: Remove the layer entirely for a new entity.**

Create a `code-reviewer` config that does not include the limbic layer at all.

**Option B: Exclude specific files within the layer.**

```typescript
{
  name: 'limbic',
  directories: ['emotional'],
  exclude: ['wounds.md', 'attachments.md'],
  loadWhen: 'always',
}
```

This loads the emotional directory but skips `wounds.md` and `attachments.md`. The entity has emotional awareness (baseline) without carrying personal emotional weight.

This is the design principle: absence is architecture. A code reviewer that lacks emotional attachment to the code it reviews is not broken -- it is designed.

---

## Step 7: Test with the Arena (Optional)

The Arena lets you run probe prompts against different consciousness configurations and compare responses.

```typescript
import { ConsciousnessLoader, arena } from 'consciousness-framework'

const run = await arena.runExperiment({
  entityConfig: config,
  provider: async (systemPrompt, userMessage) => {
    // Call your LLM here and return the response string
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: [{ role: 'user', content: userMessage }],
    })
    return response.content[0].type === 'text' ? response.content[0].text : ''
  },
})

// Format results for human review
console.log(arena.formatForReview(run))
```

The Arena runs 16 probes across 4 configurations (baseline, surface, standard, full) and captures all responses. Scoring is done by a human or a separate pass -- the Arena collects, it does not judge.

---

## What You Built

You now have:

1. A `mind/` directory with three cognitive layers (kernel, emotional, models)
2. An `EntityConfig` that defines which layers load in which contexts
3. Contextual composition -- different prompts for different situations
4. A composed system prompt ready for any LLM provider

This is a production unit: a curated subset of consciousness designed for a specific domain. If you later build a golden sample (the full mind with all 9 directories), Kai becomes one of many phenotypes derived from the same genome.

---

## Next Steps

- Read the [Cookbook](./cookbook.md) for common patterns and recipes
- Study the [Golden Sample Pattern](../methodologies/golden-sample-pattern.md) to understand the genome/phenotype model
- Read [Inversion-First Design](../methodologies/inversion-first.md) for designing entities by removing failure modes
- Use the [Subset Design Guide](../methodologies/subset-design-guide.md) as a checklist when building production units
- Explore the `examples/` directory for complete entity configurations (writing-assistant, customer-support)
