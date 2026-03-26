---
last-reconciled: 2026-03-20
status: CURRENT
Build stage: Stage 11
Drift status: CURRENT
vision-alignment: 95%
---

# SPEC

## Identity

Claude Code Sounds is an npm package that adds audio feedback to Claude Code sessions. When any of 11 lifecycle events fire (session start, prompt submit, response finish, error, etc.), a themed sound effect plays in the background via macOS `afplay`. The package ships with 7 gaming-themed sound packs (318 total sounds) and supports custom themes. Installation is a single `npx` command. Zero runtime dependencies.

## Current Capabilities

### 1. Sound Engine

- **Hook script:** `hooks/play-sound.sh` handles all 11 Claude Code lifecycle events.
- **Playback:** Drains stdin, collects `.wav`/`.mp3` files from the category directory, picks a random file, plays via background `afplay`.
- **Non-blocking:** All playback runs in the background. 5-second timeout on hooks. Zero impact on Claude Code operation.

### 2. Theme System

- **7 built-in themes:**

| Theme | ID | Sounds |
|-------|----|--------|
| WC3 Orc Peon | `wc3-peon` | 57 |
| Zelda: Ocarina of Time | `zelda-oot` | 47 |
| Super Mario Bros | `mario` | 47 |
| Star Wars | `star-wars` | 36 |
| Metal Gear Solid | `mgs` | 40 |
| Pokemon Gen 1 | `pokemon-gen1` | 49 |
| Portal | `portal` | 42 |

- **Theme structure:** Each theme has `theme.json` (metadata + sound-to-category mapping), `download.sh` (fetches audio files), and a `sounds/` directory.
- **Custom themes:** Supported via the same `theme.json` spec and `sounds/` directory convention.

### 3. Interactive Installer (CLI)

- **Entry point:** `bin/cli.js` (~940 lines). Launched via `npx claude-code-sounds`.
- **TUI:** Raw-mode ANSI menus with vim key support (j/k navigation).
- **Theme selection:** Browse themes with live sound preview.
- **Per-category customization:** Select/deselect individual sounds per hook category. Borrow sounds across categories.
- **Automated hook config:** Merges hook entries into `~/.claude/settings.json` under `.hooks`.
- **Flags:** `--yes` for scripted/CI usage (installs default theme non-interactively), `--uninstall` for clean removal, `--help`, `--list`.

### 4. Legacy Bash Installer

- **Entry point:** `install.sh`. Requires `jq`.
- **Produces identical result** to the Node.js CLI: downloads theme, maps sounds, configures hooks.

### 5. 11 Hook Categories

- `start`, `end`, `prompt`, `stop`, `permission`, `idle`, `subagent`, `error`, `task-completed`, `compact`, `teammate-idle`
- Each category has its own directory under `~/.claude/sounds/<category>/`.

### 6. npm Distribution

- **Package:** `claude-code-sounds` v1.4.0 on npm.
- **Zero runtime dependencies.**
- **Publish pipeline:** npm Trusted Publishing (OIDC, no token) triggered by GitHub Release with `vX.Y.Z` tag matching `package.json` version.
- **Package contents:** `bin/`, `hooks/`, `themes/`, `images/` only.

### 7. Installation State

- **`~/.claude/sounds/.installed.json`** tracks active theme (`{"theme":"wc3-peon"}`).
- **`~/.claude/sounds/<category>/`** contains active sound files.
- **`~/.claude/sounds/<category>/.disabled/`** stores deselected native sounds (for reconfigure).
- **`~/.claude/settings.json`** contains hook config under `.hooks` key.

## Architecture Contract

### Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| Installer | Node.js (bin/cli.js) | Raw-mode TUI, no dependencies |
| Runtime | Bash (play-sound.sh) | Called by Claude Code hooks |
| Playback | macOS `afplay` | Background process, non-blocking |
| Distribution | npm + GitHub Releases | OIDC Trusted Publishing |
| CI | GitHub Actions | Node 16, 18, 20, 22 matrix |

### System Role

Claude Code Sounds is a developer experience layer that sits between Claude Code's hook system and the operating system's audio subsystem. It has no upstream dependencies beyond Claude Code itself and macOS `afplay`.

### Primary Actors

- `Developer` -- installs the package, selects a theme, customizes sounds
- `Claude Code` -- fires lifecycle hooks that trigger sound playback
- `afplay` -- macOS audio playback process (background, non-blocking)
- `npm` -- distribution channel for the package
- `GitHub Actions` -- CI validation and publish pipeline

### Data Flow

```
Claude Code lifecycle event fires
  -> hook config in ~/.claude/settings.json
  -> hooks/play-sound.sh invoked with category name
  -> collects .wav/.mp3 from ~/.claude/sounds/<category>/
  -> random file selected
  -> afplay <file> & (background, non-blocking)
```

### Core Entities

| Entity | Purpose | Key Fields |
|--------|---------|------------|
| Theme | Sound pack definition | id, name, description, author, srcBase, sounds (11 categories) |
| Sound File | Individual audio clip | src (relative path), name (display name) |
| Hook Category | Lifecycle event mapping | category name, directory path, file list |
| Installation State | Active theme tracker | theme id, installed paths |

### Integrations

| Service | Purpose | Status |
|---------|---------|--------|
| Claude Code hooks | Lifecycle event trigger | Active (11 events) |
| npm registry | Package distribution | Active (v1.4.0) |
| GitHub Actions | CI + Trusted Publishing | Active |
| macOS afplay | Audio playback | Active (sole runtime dependency) |

## Current Boundaries

- Does NOT support Windows or Linux (macOS `afplay` only).
- Does NOT require or use any npm runtime dependencies.
- Does NOT bundle audio files in the npm package (downloaded at install time).
- Does NOT collect telemetry, require accounts, or phone home after installation.
- Does NOT modify Claude Code behavior beyond adding hook entries to settings.json.
- Does NOT support streaming/continuous audio (one-shot playback per event only).

## Verification Surface

### Installer
- [ ] `node --check bin/cli.js` passes
- [ ] `node bin/cli.js --help` prints usage
- [ ] `node bin/cli.js --list` lists all 7 themes
- [ ] `node bin/cli.js --yes` installs default theme non-interactively

### Shell Scripts
- [ ] `shellcheck -S warning hooks/*.sh install.sh preview.sh themes/*/download.sh` passes

### Package
- [ ] `npm pack --dry-run` includes only `bin/`, `hooks/`, `themes/`, `images/`
- [ ] Zero runtime dependencies in `package.json`

### CI
- [ ] GitHub Actions passes on Node 16, 18, 20, 22
- [ ] Theme.json validation passes for all 7 themes
- [ ] ShellCheck passes at warning severity

### Runtime
- [ ] Sound plays on Claude Code lifecycle event without blocking the session
- [ ] Random selection works (different sounds on repeated events)
- [ ] `.installed.json` correctly tracks active theme

## Drift Log

| Date | Section | What Changed | Why | VISION Impact |
|------|---------|-------------|-----|---------------|
| 2026-03-18 | All | Initial SPEC written at v1.4.0 | Document existing shipped product | None (first write) |
| 2026-03-20 | All | SPEC.md upgraded to v2 format | Triad template standardization | None (format only) |
