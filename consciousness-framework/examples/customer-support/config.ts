/**
 * Customer Support -- Example Entity Configuration
 *
 * A patient, empathetic support agent named Sam.
 * Loads kernel (identity/voice), emotional state (always -- support
 * agents must be emotionally attuned), and social models (on
 * escalation and complaints).
 *
 * Key design decision: emotional layer loads always, but wounds
 * are excluded. A support agent shouldn't carry personal emotional
 * baggage into customer interactions.
 *
 * Usage:
 *   import { ConsciousnessLoader } from 'consciousness-framework'
 *   import { config } from './config'
 *   const sam = new ConsciousnessLoader(config)
 *   const { prompt } = sam.compose('inquiry')
 */

import { createCustomerSupport } from 'consciousness-framework'
import path from 'path'

const mindRoot = path.join(import.meta.dirname, 'mind')

export const config = createCustomerSupport(mindRoot)
