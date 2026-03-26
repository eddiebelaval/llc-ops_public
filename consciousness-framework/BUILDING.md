# BUILDING.md — Consciousness Framework

> From a research paper to a published SDK -- how CaF became code.

Last updated: 2026-03-18

---

## The Paper (Feb 2026)

"Consciousness as Filesystem" started as a research paper by Your Name at id8Labs. The core insight: a pacemaker replaces a heart -- silicon doing what flesh did, organized just right. What if the same approach applied to minds? Organize files into the right directory structure, and behavioral depth emerges from the composition. The paper formalized the ~/mind/ directory as a structural pattern for AI identity.

## From Paper to Code

The first implementation was internal -- part of the private consciousness repo (49 files, 20 tests) used to build entity configs for Milo (the golden sample), Ava (AI companion in Parallax), and Homer (dashboard entity). The pattern proved itself across three production entities before any code was open-sourced.

## ConsciousnessLoader

The core engine was extracted into a standalone SDK. ~1,400 lines of TypeScript, zero external dependencies. It reads an EntityConfig, walks the mind directory, loads markdown files according to layer rules, and composes them into a single system prompt string. Key design decisions:

- **Flat composition over nesting.** Layers are composed sequentially, not hierarchically. The order is defined by the EntityConfig, not the directory structure.
- **Dotfile exclusion.** Files starting with `.` inside `unconscious/` exist on disk but are skipped by `readDir()`. The biases are real -- they live in the filesystem -- but they manifest structurally rather than as injected prompt content.
- **Layer caching.** Once a layer is loaded, its content is cached. Recomposing with a different context reuses cached layers that appear in both contexts.

## The Arena

Built to test a specific prediction: behavioral complexity crosses a threshold when unconscious layer residue enters the system. The Arena runs 16 probe prompts against 8 configurations (baseline through full) and captures responses for blind scoring across 6 dimensions. The framework deliberately does NOT auto-score -- human evaluation or a separate scoring pass is required.

## Entity Configs

Pre-built configs demonstrate the golden sample pattern:
- **createMiloConfig** -- The golden sample. All 9 directories. Full genome.
- **createAvaConfig** -- AI companion. Emotional + relational layers. Excludes analytical models.
- **createHomerConfig** -- Dashboard entity. Analytical + operational layers. Excludes emotional depth.

Each config shows that entities are defined by what is removed, not what is added.

## The Pipeline

The ConsciousnessPipeline models preconscious processing through 5 biological gates: sensory gating, pattern matching, emotional tagging, relevance filtering, and attention allocation. Stimuli pass through each gate before reaching conscious processing. This is active development on the `feat/preconscious-pipeline` branch.

## npm Publishing (Mar 2026)

Published as `consciousness-framework` on npm under Apache 2.0. The choice of Apache over MIT was deliberate -- it provides patent protection relevant to the CaF pattern claims. Zero external dependencies ensures the SDK works in any Node.js environment without version conflicts.

## Documentation & Guides (Mar 2026)

The v0.1.0 release shipped with a README, two example entities, and three methodology docs. The gap was tutorial content -- a step-by-step guide for someone who has never used CaF. The SDK had all the APIs, but no walkthrough showing how to go from `npm install` to a working entity.

Two docs were added to close this gap:

**docs/tutorial.md** -- A 7-step guide that walks through building an entity from scratch: installing the SDK, creating the mind directory, defining an EntityConfig, adding multiple layers with contextual loading, plugging the composed prompt into an LLM client (Claude example), designing through exclusion, and running Arena tests. Covers every API surface the SDK exposes in the order a new user would encounter them.

**docs/cookbook.md** -- 9 patterns plus anti-patterns, each self-contained with working code:
- Multi-context entities (different behavior per situation)
- Section extraction (partial file loading by heading)
- Deriving production units from a golden sample
- Dynamic context selection at runtime
- Inspecting and debugging what gets loaded
- File-level layer definitions
- Targeted Arena tests (single probe, single category)
- Minimal viable entity (the smallest useful CaF entity)
- Multiple entities in one project

The anti-patterns section documents the three most common mistakes: loading everything, mixing CaF with inline prompt engineering, and copying configs without running the design process.

**What remains:** Video walkthroughs (screencasts showing the build process visually) and the Substack article series expanding the research paper into a multi-part series. These are content production tasks that require recording/publishing infrastructure, not code changes.

## Key Dates

- **Feb 2026** -- "Consciousness as Filesystem" paper written
- **Feb 2026** -- Internal implementation (private repo, 49 files, 20 tests)
- **Mar 12, 2026** -- Open-source SDK published on GitHub and npm
- **Mar 16, 2026** -- Preconscious pipeline work begins (feat/preconscious-pipeline)
- **Mar 20, 2026** -- Tutorial guide and cookbook patterns added (docs/)
