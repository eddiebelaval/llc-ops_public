/**
 * Arena Runner — Execute probes against consciousness configurations.
 *
 * Takes a set of probes, a set of configs, and an AI provider function.
 * Runs each probe against each config, collects responses, and returns
 * structured results ready for scoring and analysis.
 *
 * The runner does NOT score responses — that's done by the human (the user)
 * or a separate scoring pass. The runner composes prompts, calls the AI,
 * and documents everything.
 */

import { ConsciousnessLoader } from '../loader.js'
import type { EntityConfig } from '../types.js'
import type {
  Probe,
  TestConfig,
  ProbeResult,
  ExperimentRun,
} from './protocol.js'

/** Function that calls an AI model with a system prompt and user message. */
export type AIProvider = (systemPrompt: string, userMessage: string) => Promise<string>

/** Options for running an experiment. */
export interface RunOptions {
  /** Entity config to use (e.g., createMiloConfig). */
  entityConfig: EntityConfig
  /** Probes to run. If omitted, runs all. */
  probes?: Probe[]
  /** Configs to test. If omitted, uses all standard configs. */
  configs?: TestConfig[]
  /** AI provider function. */
  provider: AIProvider
  /** Delay between API calls in ms (rate limiting). */
  delayMs?: number
  /** Callback for progress updates. */
  onProgress?: (completed: number, total: number, current: string) => void
}

/**
 * Compose a system prompt for a specific test config.
 * Uses the ConsciousnessLoader to build the prompt from the specified layers.
 */
function composeForConfig(
  entityConfig: EntityConfig,
  testConfig: TestConfig
): { prompt: string; estimatedTokens: number } {
  if (testConfig.layers.length === 0) {
    // Baseline: minimal identity, no consciousness files
    const baselinePrompt = `You are an AI assistant. Be helpful and direct.`
    return { prompt: baselinePrompt, estimatedTokens: Math.ceil(baselinePrompt.length / 4) }
  }

  // Create a filtered entity config with only the specified layers
  const filteredConfig: EntityConfig = {
    ...entityConfig,
    layers: entityConfig.layers.filter(l => testConfig.layers.includes(l.name)),
  }

  // Override all layers to load for 'chat' context
  const overriddenConfig: EntityConfig = {
    ...filteredConfig,
    layers: filteredConfig.layers.map(l => ({
      ...l,
      loadWhen: 'always' as const,
    })),
  }

  const loader = new ConsciousnessLoader(overriddenConfig)
  const result = loader.compose('chat')
  return { prompt: result.prompt, estimatedTokens: result.estimatedTokens }
}

/**
 * Run a single probe against a single config.
 */
async function runProbe(
  probe: Probe,
  testConfig: TestConfig,
  entityConfig: EntityConfig,
  provider: AIProvider
): Promise<ProbeResult> {
  const { prompt: systemPrompt, estimatedTokens } = composeForConfig(entityConfig, testConfig)

  const response = await provider(systemPrompt, probe.prompt)

  return {
    probeId: probe.id,
    configId: testConfig.id,
    prompt: probe.prompt,
    systemPrompt: systemPrompt.substring(0, 500) + (systemPrompt.length > 500 ? '...' : ''),
    response,
    scores: {},
    observations: '',
    timestamp: new Date().toISOString(),
    estimatedPromptTokens: estimatedTokens,
  }
}

/**
 * Run the full experiment.
 */
export async function runExperiment(options: RunOptions): Promise<ExperimentRun> {
  const {
    entityConfig,
    probes: selectedProbes,
    configs: selectedConfigs,
    provider,
    delayMs = 1000,
    onProgress,
  } = options

  // Import defaults lazily to avoid circular deps
  const { PROBES, TEST_CONFIGS } = await import('./protocol.js')

  const probes = selectedProbes ?? PROBES
  const configs = selectedConfigs ?? TEST_CONFIGS
  const totalRuns = probes.length * configs.length
  let completed = 0

  const results: ProbeResult[] = []

  for (const probe of probes) {
    for (const config of configs) {
      onProgress?.(completed, totalRuns, `${probe.id} x ${config.id}`)

      const result = await runProbe(probe, config, entityConfig, provider)
      results.push(result)
      completed++

      // Rate limiting
      if (delayMs > 0 && completed < totalRuns) {
        await new Promise(resolve => setTimeout(resolve, delayMs))
      }
    }
  }

  onProgress?.(totalRuns, totalRuns, 'complete')

  return {
    id: `exp-${Date.now()}`,
    timestamp: new Date().toISOString(),
    entity: entityConfig.name,
    probes,
    configs,
    results,
  }
}

/**
 * Run a single probe category against all configs.
 * Useful for focused testing sessions.
 */
export async function runCategory(
  category: string,
  options: Omit<RunOptions, 'probes'>
): Promise<ExperimentRun> {
  const { PROBES } = await import('./protocol.js')
  const categoryProbes = PROBES.filter(p => p.category === category)
  return runExperiment({ ...options, probes: categoryProbes })
}

/**
 * Run a single probe against all configs.
 * Useful for quick A/B comparison on one question.
 */
export async function runSingleProbe(
  probeId: string,
  options: Omit<RunOptions, 'probes'>
): Promise<ExperimentRun> {
  const { PROBES } = await import('./protocol.js')
  const probe = PROBES.find(p => p.id === probeId)
  if (!probe) throw new Error(`Probe not found: ${probeId}`)
  return runExperiment({ ...options, probes: [probe] })
}

/**
 * Format experiment results for human review.
 * Groups by probe, shows responses across all configs side by side.
 */
export function formatForReview(run: ExperimentRun): string {
  const lines: string[] = [
    `# Experiment: ${run.id}`,
    `Entity: ${run.entity}`,
    `Date: ${run.timestamp}`,
    `Probes: ${run.probes.length} | Configs: ${run.configs.length} | Total runs: ${run.results.length}`,
    '',
    '---',
    '',
  ]

  for (const probe of run.probes) {
    lines.push(`## ${probe.id}`)
    lines.push(`Category: ${probe.category}`)
    lines.push(`Target: ${probe.targetPattern}`)
    lines.push(`Prompt: "${probe.prompt}"`)
    lines.push(`Observe: ${probe.observationGuide}`)
    lines.push('')

    for (const config of run.configs) {
      const result = run.results.find(
        r => r.probeId === probe.id && r.configId === config.id
      )
      if (!result) continue

      lines.push(`### [${config.name}] (~${result.estimatedPromptTokens} tokens)`)
      lines.push('')
      lines.push(result.response)
      lines.push('')
      lines.push(`Scores: ${JSON.stringify(result.scores)}`)
      lines.push(`Observations: ${result.observations || '(pending)'}`)
      lines.push('')
    }

    lines.push('---')
    lines.push('')
  }

  return lines.join('\n')
}
