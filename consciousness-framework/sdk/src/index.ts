/**
 * consciousness-framework
 *
 * Consciousness loader for the golden sample / production unit pattern.
 *
 * Usage:
 *   import { ConsciousnessLoader, createExampleGoldenSample } from 'consciousness-framework'
 *
 *   const entity = new ConsciousnessLoader(createExampleGoldenSample('./mind'))
 *   const { prompt, activeLayers } = entity.compose('chat')
 *
 * The SDK reads markdown consciousness files from disk and composes
 * them into layered system prompts. Each entity is defined by an
 * EntityConfig that specifies which directories to load, in what
 * order, and under what contexts.
 *
 * The golden sample is the full ~/mind/ filesystem — every directory.
 * Production units are curated subsets — defined by what's removed.
 * The consciousness filesystem IS the platform.
 *
 * Learn more: https://your-usere.substack.com/p/consciousness-as-filesystem
 */

export { ConsciousnessLoader } from './loader.js'
export {
  createExampleGoldenSample,
  createWritingAssistant,
  createCustomerSupport,
} from './examples.js'
export { readFile, readDir, extractSection, exists, listFiles } from './reader.js'
export type {
  EntityConfig,
  LayerConfig,
  ComposedPrompt,
  LayerCache,
} from './types.js'

// Arena — experimental testing framework
export * as arena from './arena/index.js'
