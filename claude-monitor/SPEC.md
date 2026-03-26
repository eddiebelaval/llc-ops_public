---
last-reconciled: 2026-03-20
status: CURRENT
Build stage: Stage 11
Drift status: CURRENT
vision-alignment: 88%
---

# SPEC

## Identity

Claude Monitor is a native macOS floating panel (~900 lines of Swift) that tracks all active Claude Code sessions with live status, click-to-jump navigation, and voice announcements. It connects to Claude Code through lifecycle hooks: a shell script writes session JSON files to a directory, and the SwiftUI app polls that directory every 500ms. No server, no database, no runtime dependencies beyond the compiled binary.

## Current Capabilities

### 1. Session Lifecycle Tracking

- **Hook integration:** Claude Code lifecycle hooks fire `monitor.sh`, which writes session state to `~/.claude/monitor/sessions/{id}.json`.
- **Directory polling:** Swift app polls the sessions directory every 500ms for changes.
- **Status rendering:** Each session appears as a row showing project name, status dot (color-coded and animated), last prompt preview, and elapsed time.
- **Stale detection:** Sessions gray out after 10 minutes of inactivity.
- **Dead session cleanup:** Sessions are auto-removed when the terminal tab closes.
- **Session discovery:** Refresh button re-scans for sessions that may have been missed.
- **Cross-terminal discovery:** Discovers sessions across Terminal.app and iTerm2 instances by walking the process tree.

| Event | Status | Voice |
|-------|--------|-------|
| Session starts | `starting` | Optional (off by default) |
| Prompt submitted | `working` | No |
| Claude finishes | `done` | Yes |
| Permission needed | `attention` | Yes |
| Session exits | Removed after 5s | No |
| Terminal tab closed | Auto-removed | No |

### 2. Click-to-Jump Navigation

- **Terminal.app support:** AppleScript activates the corresponding terminal tab on click.
- **iTerm2 support:** AppleScript activates the corresponding iTerm2 tab on click.
- **Focus preservation:** Clicking a row jumps to the tab without stealing focus from the monitor panel.

### 3. Voice Announcements

- **macOS TTS:** Zero-setup voice using the `say` command. Default voice: Zoe (Premium). Configurable rate and voice name.
- **ElevenLabs AI voices:** Optional integration via API. Model: `eleven_multilingual_v2`.
- **One-click voice generation:** Designs a custom ElevenLabs voice from an included design prompt.
- **Voice picker:** Browse the ElevenLabs voice library and select a voice.
- **Voice ID paste:** Paste an ElevenLabs voice ID directly from clipboard.
- **Per-event toggles:** Independent on/off for done, attention, and start events.
- **Volume control:** Configurable from 0.0 to 1.0.

### 4. Always-On-Top Floating Panel

- **Dark glass UI:** Floating panel rendered with SwiftUI, visible on all Spaces.
- **No dock icon:** Does not appear in the dock or steal focus.
- **Drag-to-position:** Panel position persists across restarts via UserDefaults.
- **Thin scrollbar:** Custom minimal scrollbar for sessions list.
- **Kill button:** Hover-to-reveal kill button on each session row.
- **Settings popover:** In-panel voice controls and refresh button.

### 5. Cross-Session Awareness

- **Priority ordering:** Sessions are automatically sorted by urgency: attention first, then working, then starting, then done. The most actionable sessions always appear at the top.
- **Aggregate status counters:** The header bar shows real-time counts of sessions in each state (orange dot + count for attention, cyan for working, green for done) plus a total session count. This provides at-a-glance fleet health without expanding the panel.
- **Cross-terminal session discovery:** The refresh button walks the process tree to find Claude Code sessions across terminal instances, even if hooks didn't fire. Creates session files for discovered sessions so they appear in the panel.
- **Stale detection:** Sessions that haven't updated in 10+ minutes are visually dimmed, making it easy to identify hung or abandoned sessions across the fleet.

#### Not Yet Implemented (Phase 2 Candidates)

- Session grouping by project (multiple sessions on the same project shown as a group)
- Session outcome history (track completed sessions beyond current runtime)
- Detailed aggregate stats (sessions today, average duration, permission wait time)

### 6. Configuration

| Setting | Default | Description |
|---------|---------|-------------|
| `announce.enabled` | `true` | Master on/off |
| `announce.volume` | `0.5` | 0.0 to 1.0 |
| `announce.on_done` | `true` | Speak on session finish |
| `announce.on_attention` | `true` | Speak on permission needed |
| `announce.on_start` | `false` | Speak on session start |

## Architecture Contract

### Stack

| Layer | Technology | Notes |
|-------|-----------|-------|
| UI | SwiftUI | macOS 14+ (Sonoma), floating panel, dark glass theme |
| Language | Swift | ~900 lines, single-file application |
| Hook Script | Shell + jq | `monitor.sh` writes session JSON on lifecycle events |
| TTS (default) | macOS `say` | Zero-config, Zoe Premium default |
| TTS (optional) | ElevenLabs API | `eleven_multilingual_v2`, requires API key |
| Build | `swiftc` via `build.sh` | Compiles to ~2MB binary |

### System Role

Claude Monitor is a passive read-only observer that sits alongside Claude Code sessions. It reads session state from disk, renders it, and announces transitions. It does not modify, control, or coordinate sessions.

### Primary Actors

- `Developer` -- the operator running multiple Claude Code sessions
- `Claude Code hooks` -- lifecycle events that trigger `monitor.sh` to write session JSON
- `macOS TTS / ElevenLabs` -- voice providers for announcements

### Data Flow

```
Claude Code hook fires
  -> monitor.sh writes JSON to ~/.claude/monitor/sessions/{id}.json
  -> Swift app polls directory every 500ms
  -> UI updates: status dot, project name, prompt preview, elapsed time
  -> Click row -> AppleScript activates Terminal/iTerm2 tab
  -> TTS -> announces "project done" or "project needs attention"
```

### Core Entities

| Entity | Purpose | Key Fields |
|--------|---------|------------|
| Session | One active Claude Code instance | id, project, status, lastPrompt, elapsed, terminalTab |
| Config | TTS and announcement preferences | provider, voice, volume, event toggles |

### Integrations

| Service | Purpose | Status |
|---------|---------|--------|
| Claude Code hooks | Session lifecycle events | Active |
| Terminal.app | Click-to-jump tab activation | Active |
| iTerm2 | Click-to-jump tab activation | Active |
| macOS `say` | Default voice announcements | Active |
| ElevenLabs | AI voice announcements | Active (optional) |

## Current Boundaries

- Does NOT coordinate between sessions (read-only observer)
- Does NOT inject prompts or modify session behavior
- Does NOT persist session history beyond the current runtime
- Does NOT support terminals other than Terminal.app and iTerm2 for click-to-jump
- Does NOT run on anything other than macOS 14+
- Does NOT require a database, server, or network connection (ElevenLabs is optional)

## Verification Surface

### Core Functionality
- [ ] `build.sh` compiles successfully to `claude_monitor` binary
- [ ] Monitor launches as a floating panel on all Spaces
- [ ] Panel has no dock icon and does not steal focus
- [ ] Session JSON files written by `monitor.sh` appear as rows within 500ms

### Session Tracking
- [ ] Working sessions show pulsing cyan dot
- [ ] Attention sessions show orange dot
- [ ] Done sessions show green dot
- [ ] Stale sessions (10+ minutes) gray out
- [ ] Dead sessions auto-remove when terminal tab closes

### Navigation
- [ ] Clicking a session row activates the correct Terminal.app tab
- [ ] Clicking a session row activates the correct iTerm2 tab

### Voice
- [ ] macOS `say` announces "project done" on session completion
- [ ] macOS `say` announces "project needs attention" on permission needed
- [ ] ElevenLabs voice plays when configured with valid API key
- [ ] Volume control adjusts announcement loudness

### Cross-Session Awareness
- [ ] Sessions are sorted by urgency (attention > working > starting > done)
- [ ] Header bar shows aggregate status counts (attention, working, done, total)
- [ ] Refresh button discovers sessions across terminal instances
- [ ] Stale sessions (10+ minutes) are visually dimmed

### UI
- [ ] Panel position persists across restarts
- [ ] Kill button appears on hover and removes the session
- [ ] Settings popover opens with voice controls

## Drift Log

| Date | Section | What Changed | Why | VISION Impact |
|------|---------|-------------|-----|---------------|
| 2026-02 | Initial | Spec created with core session tracking and click-to-jump | First build | Pillars 1, 3 realized |
| 2026-03-18 | Capabilities 3, 4, 5 | ElevenLabs integration, kill button, stale detection, drag persistence, settings popover | UI and voice refinements | Pillar 2 fully realized |
| 2026-03-20 | Capability 5 (new) | Documented cross-session awareness: priority ordering, aggregate counters, cross-terminal discovery, stale detection. Clarified Phase 2 backlog. | Pillar 4 was under-documented at 30%; actual implementation is 50% | Pillar 4 updated to PARTIAL (50%) |
