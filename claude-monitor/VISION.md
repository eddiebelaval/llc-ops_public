---
last-evolved: 2026-03-18
confidence: HIGH
distance: 12%
pillars: "4 (3R, 1P, 0U)"
---

# VISION

## Soul

Eliminate the tab-switching tax of running multiple Claude Code sessions by providing a persistent, always-visible status panel that shows what every session is doing and speaks when something needs attention.

## Why This Exists

Running 3-7 Claude Code sessions simultaneously creates a constant attention drain. Which session just finished? Which one is waiting for permission? Which one is still thinking? The only way to know is to click through every terminal tab, one at a time. With 5+ sessions running, this checking loop consumes real attention and breaks flow state. Claude Monitor exists to collapse that overhead into a single glance and a voice that speaks only when something matters.

## Pillars

### 1. **Session Tracking** -- REALIZED

Live status monitoring of every active Claude Code session. Shows project name, elapsed time, last prompt preview, and color-coded status dots (pulsing cyan for working, orange for attention, green for done). Stale sessions gray out after 10 minutes. Dead sessions are auto-removed when the terminal tab closes. Refresh button discovers missing sessions.

### 2. **Voice Announcements** -- REALIZED

Text-to-speech notifications when sessions finish or need permission. Works out of the box with macOS built-in voices (Zoe Premium default). Optional ElevenLabs integration for AI voices, including one-click voice generation from an included design prompt. Built-in voice picker for browsing ElevenLabs library. Per-event toggles and volume control in config.

### 3. **Always-On-Top UI** -- REALIZED

A dark glass floating panel visible on all Spaces. No dock icon, does not steal focus. Drag-to-position with persistence across restarts. Thin custom scrollbar, minimal UI footprint. Click any row to jump to that terminal tab instantly (Terminal.app + iTerm2 via AppleScript). Hover to reveal kill button for individual sessions.

### 4. **Cross-Session Awareness** -- PARTIAL (50%)

Provides priority-ordered session display (attention-first sorting), aggregate status counters in the header bar, cross-terminal session discovery, and stale session detection. These features give the operator fleet-level awareness across all active sessions at a glance. Not yet implemented: session grouping by project, session outcome history, and detailed aggregate stats (sessions today, avg duration, permission wait time). The monitor remains read-only: it observes but does not intervene.

## User Truth

**Who:** A developer running multiple Claude Code sessions simultaneously, juggling parallel workstreams across different projects and terminal tabs.

**Before:** "I have five Claude sessions running and I just heard a notification sound. Was that one of them finishing? Which tab? Let me click through all of them to find out. Oh wait, one was waiting for permission this whole time."

**After:** "I glance at the floating panel, see two green dots and one pulsing orange. I click the orange row, approve the permission, and keep working. The voice tells me when the next one finishes. I never leave my current context."

## Phased Vision

### Phase 1 -- Passive Observer (CURRENT)

A floating dashboard that reads session state, renders it, and announces transitions. Fully shipped: session tracking, click-to-jump, voice announcements, always-on-top UI.

### Phase 2 -- Cross-Session Intelligence

Add coordination awareness without breaking the passive contract. Session grouping by project. Priority ordering by attention urgency. History of session outcomes. Aggregate stats (sessions today, avg duration, permission wait time).

### Phase 3 -- Operator Surface

Become the control surface for multi-session workflows. Queue prompts across sessions. Batch approve permissions. Session templates (spin up N sessions with predefined prompts). Integration with Mission Control for portfolio-level session visibility.

## Edges

- macOS 14+ only (SwiftUI, AppleScript for tab switching)
- Requires Xcode Command Line Tools for Swift compilation
- Requires `jq` for JSON processing in hook scripts
- Terminal.app and iTerm2 supported; other terminals may not support click-to-jump
- ElevenLabs integration requires API key and internet connection
- No iOS, no web, no cross-platform planned

## Anti-Vision

- Never modify session behavior. The monitor observes, it does not inject prompts or make decisions on behalf of the user.
- Never become an orchestrator. If it starts managing sessions instead of showing them, it has become a different product.
- Never require a running server or external infrastructure. It is a compiled binary that reads files from disk.
- Never grow beyond what a single floating panel can display. Complexity belongs elsewhere.

## Design Principles

- Passive over active: observe, never intervene
- Native over portable: SwiftUI binary, not Electron
- Glanceable over detailed: status at a glance beats comprehensive dashboards
- Zero-config default: works with macOS `say` out of the box, ElevenLabs is optional
- Decoupled architecture: the monitor can crash without affecting any Claude Code session

## Evolution Log

| Date | What Shifted | Signal | Section |
|------|-------------|--------|---------|
| 2026-02 | Initial vision established | Tab-switching pain across 3-7 concurrent sessions | Soul, Pillars |
| 2026-03-18 | ElevenLabs voice integration, UI refinements (kill button, stale detection, drag persistence) | User demand for better voice quality and session management | Pillars 2, 3 |
