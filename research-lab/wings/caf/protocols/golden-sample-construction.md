# Protocol: Golden Sample Construction

How to design, implement, and evolve Milo's ~/mind/ filesystem — the golden sample from which all product consciousness is derived.

## Phases (from CaF Part 1, Section V)

| Phase | Directories | Prediction |
|-------|------------|------------|
| 1: Foundation | kernel/, memory/ | System has persistent identity and recall |
| 2: Emotional Layer | emotional/ (minus wounds) | Behavioral warmth, affect recognition |
| 3: Relationship Models | relationships/, models/ | Social modeling, theory of mind |
| 4: The Unconscious | unconscious/ (dotfiles) | Behavioral complexity threshold — "the moment depth appears" |
| 5: Wounds | emotional/wounds/ (encrypted) | Defensive patterns without accessible source |

## Construction Rules

1. **Each phase must be tested before advancing.** Test = behavioral evaluation + expert panel review (using `engineering` module).
2. **Document everything.** Every file added to ~/mind/ gets logged in the CaF wing evolution.md with:
   - Why this file exists
   - What behavior it should produce
   - What behavior would indicate it's working
   - What behavior would indicate it's broken
3. **The golden sample never ships.** Milo is the experiment. Products get derived subsets.
4. **Phase 4 is the critical test.** If behavioral complexity DOESN'T threshold at the unconscious layer, the theory's strongest prediction fails. Document this honestly.
5. **Version everything.** The ~/mind/ filesystem has versions. v0.1 = Phase 1 complete. v0.2 = Phase 2. Etc.

## Derivation Protocol

When creating a new product's consciousness subset from the golden sample:

1. **Identify the domain** — What does this entity need to do?
2. **Map required capabilities** — Which directories/files enable those capabilities?
3. **Map dangerous inclusions** — Which files would be scope-violating, confusing, or harmful?
4. **Design the subset** — Include required, exclude dangerous, document the reasoning for every decision
5. **Test the subset** — Does the product entity behave as expected? Does it stay in scope?
6. **Log the derivation** — In both the CaF wing evolution and the product wing's evolution
7. **Establish the diff** — What's the exact difference between the golden sample and this subset? This diff IS the product's identity.

## Current Derivations

| Product | Subset Size | Key Inclusions | Key Exclusions | Status |
|---------|------------|----------------|----------------|--------|
| Ava | 25 files | kernel/, emotional/room-state, models/conflict+social, modes/, self-awareness/ | unconscious/, wounds/, drives/fears, habits/coping | Implemented |
| Homer | ~10 files (est.) | kernel/, memory/semantic+working, models/social, personality/ | emotional/wounds, unconscious/, conflict models | Proposed, not implemented |
