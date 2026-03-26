/**
 * Arena — Golden Sample Testing Framework
 *
 * Experimental protocol + runner for testing the CaF prediction
 * that behavioral complexity crosses a threshold at Phase 4.
 */

export {
  PROBES,
  TEST_CONFIGS,
  type Probe,
  type ProbeCategory,
  type TestConfig,
  type ProbeResult,
  type ExperimentRun,
  type ExperimentSummary,
  type ScoringDimension,
} from './protocol.js'

export {
  runExperiment,
  runCategory,
  runSingleProbe,
  formatForReview,
  type AIProvider,
  type RunOptions,
} from './runner.js'
