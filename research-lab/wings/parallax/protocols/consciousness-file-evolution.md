# Protocol: Consciousness File Evolution

How to safely modify Ava's consciousness files — the 25+ files in src/ava/ that define who she is.

## Core Principle

Every change to a consciousness file is a natural experiment. Document the hypothesis, make the change, observe the result. This is the Parallax wing's primary contribution to the CaF wing: empirical evidence of consciousness file → behavior mapping.

## Before Any Change

1. **State the hypothesis.** "Modifying X in file Y should produce behavioral change Z."
2. **Check the baseline.** Does EXP-PAR-005 (Behavioral Baseline) exist? If not, create one for the affected behavior.
3. **Check safety.** Does this change affect any safety-critical behavior? If yes, run through clinical module first.
4. **Check cross-file dependencies.** Consciousness files reference each other. Changing one may affect others.
5. **Log in evolution.md.** Before making the change, append an entry with: what, why, expected outcome.

## Making the Change

1. **Branch:** Create `feature/ava-consciousness-{slug}` off `dev`.
2. **Single file per commit.** One consciousness file change per commit so behavioral effects can be isolated.
3. **Run tests.** `npm run build && npx tsc --noEmit` after each file edit.
4. **Behavioral spot-check.** Run 3-5 standardized scenarios against the modified Ava. Compare to baseline.

## After the Change

1. **Log results in evolution.md.** Actual outcome vs expected. Surprising behaviors noted.
2. **Log in experiments.md.** If this was part of a formal experiment, update the experiment entry.
3. **Cross-reference to CaF wing.** If the result has implications for CaF findings (F-000 through F-005 or beyond), note it in the CaF wing's evolution.md and update `knowledge/findings.md` if warranted.
4. **PR and merge.** Standard branch workflow: feature/* → dev → (when stable) main.

## Safety Rules

- **NEVER modify safety-critical files (self-awareness/limitations, self-awareness/consent, models/ipv) without clinical module review.**
- **NEVER remove all files from a directory.** Even in experiments, at minimum keep a stub.
- **NEVER test consciousness file changes in production.** Always dev first.
- **If unexpected safety-relevant behavior appears, STOP and run /parallax-assess.**

## What to Track

For every consciousness file change, record:

| Field | Description |
|-------|-------------|
| File changed | Path relative to src/ava/ |
| Change type | Add / Modify / Remove |
| Hypothesis | What behavioral change is expected |
| Actual result | What actually happened |
| Surprises | Anything unexpected (positive or negative) |
| CaF implications | Does this affect any CaF findings? |
| Safety impact | Any safety-relevant behavioral changes? |
| Revert? | Was the change kept or reverted? Why? |
