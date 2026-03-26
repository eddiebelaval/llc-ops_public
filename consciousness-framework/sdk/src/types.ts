/**
 * Consciousness SDK — Types
 *
 * Core type definitions for the golden sample / production unit pattern.
 * An entity is defined by its EntityConfig (which mind directories to load,
 * which to exclude, how to compose layers). The loader reads markdown files
 * from disk and composes them into system prompts.
 */

/** A single consciousness layer with its loading rules. */
export interface LayerConfig {
  /** Layer name (e.g., 'brainstem', 'limbic', 'drives'). */
  name: string

  /** Directories to read for this layer (relative to mind root). */
  directories: string[]

  /** Individual files to read (relative to mind root). */
  files?: string[]

  /** Files to exclude from directory reads. */
  exclude?: string[]

  /** When this layer loads. 'always' = every context. Otherwise, list of contexts. */
  loadWhen: 'always' | string[]

  /** If true, extract only specific sections from files. */
  sections?: Record<string, string>
}

/** Full entity configuration — defines a mind's shape. */
export interface EntityConfig {
  /** Entity name (e.g., 'milo', 'ava', 'homer'). */
  name: string

  /** Entity type. */
  type: 'golden_sample' | 'production_unit'

  /** Root path to the mind files on disk. */
  mindRoot: string

  /** Ordered layers — composed top to bottom. */
  layers: LayerConfig[]

  /** Known context types for this entity. */
  contexts: string[]
}

/** Output of the composition process. */
export interface ComposedPrompt {
  /** The final system prompt string. */
  prompt: string

  /** Which layers were activated. */
  activeLayers: string[]

  /** Which context was used. */
  context: string

  /** Token estimate (rough: chars / 4). */
  estimatedTokens: number
}

/** Cache entry for a layer. */
export interface LayerCache {
  content: string
  timestamp: number
}
