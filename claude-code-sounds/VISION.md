---
last-evolved: 2026-03-18
confidence: HIGH
distance: 15%
pillars: "4 (4R, 0P, 0U)"
---

# VISION

## Soul

Make AI-assisted development sessions feel alive by adding audio feedback to every Claude Code lifecycle event through themed sound packs that turn the terminal into an immersive workspace. Sound is the missing sense in the command line. This product restores it.

## Why This Exists

Developers using Claude Code spend long sessions waiting for responses, watching for permission prompts, and checking whether the agent has finished. There is no auditory signal layer. Every other creative tool (DAWs, game engines, IDEs with build chimes) uses sound to communicate state. Claude Code Sounds brings that pattern to AI-assisted development: a session start sounds like entering a space, a finished response sounds like completion, an error sounds like something broke. The result is a workflow where you can look away from the terminal and still know what is happening.

## Pillars

### 1. **Sound Engine** -- REALIZED

An `afplay`-based sound playback system for macOS. A single hook script (`play-sound.sh`) handles all 11 Claude Code lifecycle events. It picks a random audio file from the appropriate category directory and plays it in the background, ensuring zero blocking of the development workflow.

### 2. **Theme System** -- REALIZED

7 built-in themes spanning gaming nostalgia: WC3 Orc Peon (57 sounds), Zelda OOT (47), Super Mario Bros (47), Star Wars (36), Metal Gear Solid (40), Pokemon Gen 1 (49), and Portal (42). Each theme maps sounds across all 11 hook events. Custom themes are supported via `theme.json` definitions and a `sounds/` directory.

### 3. **Interactive Installer** -- REALIZED

`npx claude-code-sounds` launches a terminal-based interactive installer with raw-mode ANSI menus (vim key support), theme selection with live preview, per-category sound customization with borrowing across categories, and automated hook configuration. Supports `--yes` for scripted/CI usage and `--uninstall` for clean removal.

### 4. **npm Distribution** -- REALIZED

Published as v1.4.0 on npm. Zero runtime dependencies. Uses npm Trusted Publishing (OIDC, no token) triggered by GitHub Release with `vX.Y.Z` tag matching `package.json` version. Package includes only `bin/`, `hooks/`, `themes/`, and `images/`.

## User Truth

**Who:** Developers who spend hours in Claude Code sessions and lose track of agent state because the terminal gives no audio feedback.

**Before:** "I keep switching tabs to check if Claude is done. I miss permission prompts and waste minutes. Long sessions feel like staring at a wall."

**After:** "I hear a sound and I know exactly what happened. Session start, response done, error. I can look away and still stay in the loop. The nostalgia themes make it fun instead of clinical."

## Phased Vision

### Phase 1 -- Sound Engine + Themes (COMPLETE)

Prove the concept: a single shell script that plays sounds on lifecycle events, multiple themes to choose from, and an installer that wires everything up. Ship to npm.

### Phase 2 -- Community Themes (CURRENT)

Make it trivial for others to create and share their own theme packs. The `theme.json` spec and `download.sh` pattern are already in place. This phase is about documentation, community visibility, and a theme gallery.

### Phase 3 -- Cross-Platform

Extend beyond macOS `afplay` to support Linux (`paplay`/`aplay`) and potentially WSL. This is intentionally deferred because the core audience (Claude Code early adopters) skews heavily macOS.

## Edges

- macOS only (depends on `afplay`). No Windows or Linux support planned near-term.
- Node.js 20+ required for the interactive installer.
- Audio files are copyrighted game sounds. Fair use for personal developer tools, not redistributable commercially.
- This is a developer experience enhancement, not a product with accounts or analytics.

## Anti-Vision

- Never require an account, telemetry, or internet connection after initial theme download.
- Never interfere with Claude Code's actual functionality. All sound playback is non-blocking and background.
- Never become a generic sound/notification framework. This exists for Claude Code lifecycle hooks, nothing else.
- Never bundle audio files in the npm package directly. Themes download at install time to keep the package small and avoid distributing copyrighted audio through npm.

## Design Principles

- Zero blocking: sound playback must never delay Claude Code's operation.
- Zero dependencies: the npm package has no runtime dependencies.
- Nostalgia as UX: themed sounds create emotional attachment to the workflow, not just utility.
- Convention over configuration: works out of the box with `--yes`, customizable for those who want it.
- Filesystem is state: installed sounds live in `~/.claude/sounds/`, tracked by `.installed.json`. No databases, no services.

## Evolution Log

| Date | What Shifted | Signal | Section |
|------|-------------|--------|---------|
| 2026-02-xx | Initial vision: sound feedback for Claude Code lifecycle events | Single afplay experiment proved the concept immediately | Soul |
| 2026-03-18 | v1.4.0: teammate-idle hook, all 7 themes shipped, npm Trusted Publishing | All 4 pillars REALIZED | Pillars |
| 2026-03-20 | VISION.md upgraded to v2 format | Triad template standardization across all projects | All sections |
