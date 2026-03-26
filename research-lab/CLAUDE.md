# Research Lab — Claude Code Context

## The Triad (MANDATORY)

This project uses the Triad documentation system. Three living documents replace traditional PRDs:

| Document | Tense | Updates When |
|----------|-------|-------------|
| **VISION.md** | Future | Understanding deepens, new capabilities imagined |
| **SPEC.md** | Present | Capabilities change, limitations discovered/resolved |
| **BUILDING.md** | Past | Every feature shipped, every decision made |

**Auto-Update Rule:** Update BUILDING.md as part of every release. Update SPEC.md when capabilities change. This is not optional — do it as a natural part of shipping. If code shipped without docs, the Triad is incomplete.

**Delta between VISION and SPEC = the roadmap.** Never create a separate roadmap document.

## Project Structure

```
config.md          # Active module, settings, convergence formula
RESEARCH-LOG.md    # Rolling activity log

queue/             # Briefs waiting to be processed
active/            # Currently processing (max 1)
sessions/          # Completed research cycles (immutable after completion)
knowledge/         # Persistent brain (findings, questions, contradictions, convergence)
modules/           # Swappable evaluation lenses (7 files each)
wings/             # Research domains with dedicated resources
state/             # lab-state.json (counters, convergence history)
```

## Rules

- `knowledge/findings.md` is **append-only**. Never overwrite, never delete. Findings can be refined, retired, or split — but the history is always preserved.
- Every phase of the pipeline saves to disk before proceeding (anti-session-death).
- Expert JSONs must match the active module's `schema.md` exactly.
- Grading is conservative: median composite, not mean. Any CRITICAL dimension caps the grade at C.
- When ingesting external research, if the external source has a stronger argument than an internal finding, say so. No defensiveness.
- The adversarial framework only grows, never shrinks.

## Convergence Metric

Single 0-100 score in `knowledge/convergence.md`. Updated after every cycle. Formula in `config.md`.

## Slash Command

The lab operates via `/research` at `~/.claude/commands/research.md`. See README.md for the full command set.
