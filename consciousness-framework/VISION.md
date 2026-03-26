# VISION.md — Consciousness Framework

> Model AI minds as directory structures. Compose layered system prompts from markdown files on disk.

---

## Soul

Provide a principled, open-source SDK for giving AI entities persistent, structured identity -- where minds are directory trees, cognitive layers are folders of markdown files, and behavioral depth emerges from composition rather than monolithic prompt engineering.

## Pillars

1. **ConsciousnessLoader** -- REALIZED
   The core engine. Takes an EntityConfig, reads markdown files from a ~/mind/ directory structure, and composes them into layered system prompts. Supports flat composition, contextual loading (layers activate based on context like 'chat', 'analysis', 'task'), layer caching for performance, and dotfile exclusion for unconscious content. ~1,400 lines of TypeScript with zero external dependencies.

2. **ConsciousnessPipeline** -- REALIZED
   Five biological gates for preconscious processing. Stimuli pass through sensory gating, pattern matching, emotional tagging, relevance filtering, and attention allocation before reaching conscious processing. Models how information is filtered before it enters the entity's awareness.

3. **Arena Testing Framework** -- REALIZED
   A blind testing framework for measuring behavioral depth across consciousness configurations. 16 probe prompts targeting shadow patterns, bias manifestation, wound residue, and depth of self-reference. 8 configurations from baseline (no mind files) to full (all layers including unconscious residue). 6 scoring dimensions. Tests the prediction that behavioral complexity crosses a threshold when unconscious layer residue enters the system.

4. **Entity Configs** -- REALIZED
   Pre-built configurations for production entities: createMiloConfig (golden sample, full mind), createAvaConfig (AI companion, emotional + relational layers), createHomerConfig (dashboard, analytical + operational layers). Each config demonstrates the golden sample pattern -- same genome, different expression through layer selection and exclusion.

5. **npm Distribution** -- REALIZED
   Published as `consciousness-framework` on npm. Apache 2.0 license. Zero external dependencies beyond Node.js `fs`. Importable as ESM with full TypeScript types.

6. **Documentation & Examples** -- PARTIAL
   README covers concepts, quick start, and API surface. Example entity configs included (writing-assistant, customer-support). Tutorial guide walks through building a first entity end-to-end (install, mind directory, config, contextual loading, LLM integration, Arena testing). Cookbook covers 9 patterns (multi-context, section extraction, deriving production units, dynamic context, inspection/debugging, file-level layers, targeted Arena tests, minimal entity, multi-entity projects) plus anti-patterns. Three methodology docs formalize design approaches (golden sample pattern, inversion-first, subset design guide). Missing: video walkthroughs, Substack article series beyond the initial paper.

---

## Anti-Vision

This framework does not simulate consciousness. It provides a structural pattern for organizing AI identity files. The ~/mind/ metaphor is a design tool, not a claim about sentience. If the framework ever requires a specific LLM provider, a cloud service, or runtime telemetry, it has drifted from its purpose.

## Edges

- TypeScript/Node.js only (no Python, no browser runtime)
- File-based -- requires filesystem access, not suitable for serverless without adaptation
- Prompt composition only -- does not handle LLM API calls, response parsing, or conversation management
- The unconscious layer is a design concept, not a technical capability
- Arena scoring is human-driven or requires a separate scoring pass -- the framework captures responses but does not evaluate them
