/**
 * Consciousness Loader — Core Engine
 *
 * Takes an EntityConfig and composes system prompts by reading
 * consciousness files from disk, applying layer rules, and caching.
 *
 * This is the shared engine that both Milo (golden sample) and
 * production units (Ava, Homer, future entities) use.
 *
 * The unconscious layer is handled by architectural absence:
 * dotfiles exist on disk but the layer config excludes them.
 * The biases in .biases manifest as structural choices in
 * how prompts compose — not as injected content.
 */

import { readFile, readDir, extractSection } from './reader.js'
import type {
  EntityConfig,
  LayerConfig,
  ComposedPrompt,
  LayerCache,
} from './types.js'

export class ConsciousnessLoader {
  private config: EntityConfig
  private cache: Map<string, LayerCache> = new Map()

  constructor(config: EntityConfig) {
    this.config = config
  }

  /** Entity name. */
  get name(): string {
    return this.config.name
  }

  /** Entity type. */
  get type(): 'golden_sample' | 'production_unit' {
    return this.config.type
  }

  /** Available contexts. */
  get contexts(): string[] {
    return this.config.contexts
  }

  /**
   * Compose a system prompt for the given context.
   * Reads consciousness files, applies layer rules, returns composed prompt.
   */
  compose(context: string = 'chat'): ComposedPrompt {
    const activeLayers: string[] = []
    const parts: string[] = []

    for (const layer of this.config.layers) {
      if (!this.shouldLoad(layer, context)) continue

      const content = this.loadLayer(layer)
      if (content) {
        activeLayers.push(layer.name)
        parts.push(content)
      }
    }

    const prompt = parts.filter(Boolean).join('\n\n')

    return {
      prompt,
      activeLayers,
      context,
      estimatedTokens: Math.ceil(prompt.length / 4),
    }
  }

  /**
   * Load a single file from the mind root.
   */
  readFile(relativePath: string): string {
    return readFile(this.config.mindRoot, relativePath)
  }

  /**
   * Load all files from a directory under the mind root.
   */
  readDir(relativePath: string, exclude?: string[]): string {
    return readDir(this.config.mindRoot, relativePath, exclude)
  }

  /**
   * Extract a section from a file by heading.
   */
  extractSection(relativePath: string, heading: string): string {
    const content = this.readFile(relativePath)
    return extractSection(content, heading)
  }

  /**
   * Clear all cached layers. Call after modifying consciousness files.
   */
  clearCache(): void {
    this.cache.clear()
  }

  /**
   * Get cache stats for debugging.
   */
  cacheStats(): { layers: number; entries: string[] } {
    return {
      layers: this.cache.size,
      entries: Array.from(this.cache.keys()),
    }
  }

  // ─── Private ───

  private shouldLoad(layer: LayerConfig, context: string): boolean {
    if (layer.loadWhen === 'always') return true
    return layer.loadWhen.includes(context)
  }

  private loadLayer(layer: LayerConfig): string {
    const cacheKey = layer.name
    const cached = this.cache.get(cacheKey)
    if (cached) return cached.content

    const parts: string[] = []

    // Read directories
    for (const dir of layer.directories) {
      const content = readDir(
        this.config.mindRoot,
        dir,
        layer.exclude ?? []
      )
      if (content) parts.push(content)
    }

    // Read individual files
    if (layer.files) {
      for (const file of layer.files) {
        const content = readFile(this.config.mindRoot, file)
        if (content) parts.push(content)
      }
    }

    // Extract sections if specified
    if (layer.sections) {
      for (const [file, heading] of Object.entries(layer.sections)) {
        const fileContent = readFile(this.config.mindRoot, file)
        const section = extractSection(fileContent, heading)
        if (section) parts.push(section)
      }
    }

    const content = parts.filter(Boolean).join('\n\n')
    this.cache.set(cacheKey, { content, timestamp: Date.now() })
    return content
  }
}
