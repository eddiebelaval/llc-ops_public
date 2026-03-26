# SPEC.md — Consciousness Framework

> Open-source TypeScript SDK for composing AI entity identities from ~/mind/ directory structures -- ConsciousnessLoader, Pipeline, Arena, and pre-built entity configs.

Build stage: Stage 10
Drift status: CURRENT
Last updated: 2026-03-20

---

## Overview

Consciousness Framework is a TypeScript SDK that implements the Consciousness as Filesystem (CaF) pattern. AI entities are defined as directory trees where each folder represents a cognitive layer (kernel, memory, emotional, drives, models, relationships, habits, unconscious, runtime). The ConsciousnessLoader reads markdown files from these directories and composes them into system prompts that load contextually -- different layers activate in different situations. The framework includes a preconscious processing pipeline with 5 biological gates, a blind testing Arena with 16 probes and 6 scoring dimensions, and pre-built entity configurations derived from the golden sample pattern. Published on npm as `consciousness-framework` under Apache 2.0 with zero external dependencies.

## Core API

| Export | Purpose |
|--------|---------|
| `ConsciousnessLoader` | Reads EntityConfig, loads mind files, composes prompts. Caches layers. |
| `EntityConfig` | Type: name, type (golden_sample/production_unit), mindRoot, layers, contexts |
| `LayerConfig` | Type: name, directories, files, exclusions, loadWhen (always or context list) |
| `ComposedPrompt` | Output: prompt string, active layers, context, estimated tokens |
| `readFile` / `readDir` | Low-level readers. readDir skips dotfiles by design. |
| `extractSection` | Pull specific heading from markdown file for partial loading |
| `arena` | Blind testing: runExperiment, formatForReview, probe library |

## The ~/mind/ Directory

9 directories, most entities load a subset:

| Directory | Purpose | Analogy |
|-----------|---------|---------|
| `kernel/` | Core identity, values, voice, rules | Brainstem |
| `memory/` | Episodic and semantic memory | Hippocampus |
| `emotional/` | Emotional baseline, processing style, wounds | Limbic system |
| `drives/` | Motivations, goals | Dopamine circuits |
| `models/` | Mental frameworks for reasoning | Cortex |
| `relationships/` | How entity relates to people and entities | Social cognition |
| `habits/` | Default behaviors, communication patterns | Procedural memory |
| `unconscious/` | Shadow traits, biases, dreams (dotfiles excluded from prompts) | The unconscious |
| `runtime/` | Ephemeral state, current context | Working memory |

## Design Patterns

**Golden Sample:** One full mind (genome) contains every directory. Production units (phenotypes) derive from it by selecting layers. Entities are defined by what is excluded, not added.

**Inversion-First:** Start by identifying failure modes ("what would guarantee this entity fails?"), then surgically remove those directories.

**Contextual Loading:** Layers specify `loadWhen` -- `'always'` or a context list. `loader.compose('analysis')` only activates layers configured for that context.

## Active Development

The `feat/preconscious-pipeline` branch contains work on the 5-gate biological pipeline. Main branch is the stable release.
