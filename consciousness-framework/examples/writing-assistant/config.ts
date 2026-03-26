/**
 * Writing Assistant -- Example Entity Configuration
 *
 * A precise, well-read writing assistant named Alex.
 * Loads kernel (identity/voice), creative models, and writing habits.
 * No emotional layer, no drives, no relationships -- a writing
 * assistant doesn't need empathy or personal goals. It needs
 * craft knowledge and discipline.
 *
 * Usage:
 *   import { ConsciousnessLoader } from 'consciousness-framework'
 *   import { config } from './config'
 *   const alex = new ConsciousnessLoader(config)
 *   const { prompt } = alex.compose('draft')
 */

import { createWritingAssistant } from 'consciousness-framework'
import path from 'path'

const mindRoot = path.join(import.meta.dirname, 'mind')

export const config = createWritingAssistant(mindRoot)
