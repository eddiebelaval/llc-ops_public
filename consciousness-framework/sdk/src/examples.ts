/**
 * Example Entity Configurations
 *
 * These are EXAMPLES showing how to create EntityConfigs.
 * They demonstrate the golden sample / production unit pattern
 * with fictional entities. Real production configurations
 * (Milo, Ava, Homer, Dae) are proprietary.
 *
 * Use these as starting points for your own entities.
 */

import type { EntityConfig } from './types.js'

/**
 * Example: Full golden sample configuration.
 * Loads all directories in a 6-layer hierarchy.
 *
 * This is the "complete mind" — every directory, every file.
 * Production units are derived by removing layers from this.
 */
export function createExampleGoldenSample(mindRoot: string): EntityConfig {
  return {
    name: 'example-golden-sample',
    type: 'golden_sample',
    mindRoot,
    layers: [
      {
        name: 'brainstem',
        directories: ['kernel'],
        loadWhen: 'always',
      },
      {
        name: 'limbic',
        directories: ['emotional'],
        exclude: ['wounds.md'],
        loadWhen: 'always',
      },
      {
        name: 'drives',
        directories: ['drives'],
        loadWhen: ['chat', 'reflection', 'creative'],
      },
      {
        name: 'models',
        directories: ['models'],
        loadWhen: ['chat', 'analysis', 'creative'],
      },
      {
        name: 'relational',
        directories: ['relationships'],
        // Load wound residue (behavioral patterns) without the source trauma
        sections: { 'emotional/wounds': 'Behavioral Residue' },
        loadWhen: ['chat', 'reflection'],
      },
      {
        name: 'habits',
        directories: ['habits'],
        loadWhen: ['chat', 'creative'],
      },
    ],
    contexts: ['chat', 'reflection', 'analysis', 'creative', 'task'],
  }
}

/**
 * Example: Writing assistant production unit.
 * Inclusion-first design — what does a writing assistant need?
 *
 * Includes: identity, creative models, writing habits
 * Excludes: emotional layer, drives, relationships, unconscious
 *
 * The absence is the design: a writing assistant doesn't need
 * emotional attunement or relational tracking. It needs voice,
 * creative frameworks, and writing discipline.
 */
export function createWritingAssistant(mindRoot: string): EntityConfig {
  return {
    name: 'writing-assistant',
    type: 'production_unit',
    mindRoot,
    layers: [
      {
        name: 'brainstem',
        directories: ['kernel'],
        loadWhen: 'always',
      },
      {
        name: 'models',
        directories: ['models'],
        loadWhen: ['draft', 'edit', 'brainstorm'],
      },
      {
        name: 'habits',
        directories: ['habits'],
        loadWhen: ['draft', 'edit'],
      },
    ],
    contexts: ['draft', 'edit', 'brainstorm', 'review'],
  }
}

/**
 * Example: Customer support production unit.
 * Inclusion-first — needs empathy but not creativity.
 *
 * Includes: identity, emotional awareness, social models
 * Excludes: drives, habits, unconscious, creative models
 *
 * Key design decision: emotional layer loads ALWAYS because
 * a support agent must always be emotionally attuned.
 * But exclude wounds — a support agent shouldn't carry
 * personal emotional baggage into customer interactions.
 */
export function createCustomerSupport(mindRoot: string): EntityConfig {
  return {
    name: 'customer-support',
    type: 'production_unit',
    mindRoot,
    layers: [
      {
        name: 'brainstem',
        directories: ['kernel'],
        loadWhen: 'always',
      },
      {
        name: 'limbic',
        directories: ['emotional'],
        exclude: ['wounds.md', 'attachments.md'],
        loadWhen: 'always',
      },
      {
        name: 'social',
        files: ['models/social.md'],
        directories: [],
        loadWhen: ['escalation', 'complaint'],
      },
    ],
    contexts: ['inquiry', 'complaint', 'escalation', 'followup'],
  }
}
