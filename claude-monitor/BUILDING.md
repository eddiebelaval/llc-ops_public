# BUILDING.md — Claude Monitor

> From "which tab was that?" to a floating dashboard with voice announcements.

Last updated: 2026-03-20

---

## The Problem (Feb 2026)

Running 3-7 Claude Code sessions simultaneously creates a constant tab-switching tax. Which session just finished? Which one is waiting for permission? Which one is still thinking? The only way to know was to click through every terminal tab, one at a time. With 5+ sessions running, this checking loop consumed real attention and broke flow state.

## The First Version

The initial build was a SwiftUI floating panel that read JSON files from a directory. A Claude Code hook script (monitor.sh) wrote session status to `~/.claude/monitor/sessions/{id}.json` on every lifecycle event. The Swift app polled the directory every 500ms and rendered a row per session with a colored status dot.

This alone solved 80% of the problem -- glance at the panel, see which sessions need attention.

## Click-to-Jump

The second feature was click-to-jump navigation. Clicking a session row activates the corresponding terminal tab via AppleScript. Supports both Terminal.app and iTerm2. This eliminated the manual tab search entirely.

## Voice Announcements

The third feature was voice. When a session finishes: "my-project done." When one needs permission: "backend needs attention." The macOS `say` command provided zero-setup TTS with decent quality. Premium system voices (Zoe, Ava, Tom) sound significantly better than defaults.

ElevenLabs integration came next for AI-quality voices. The implementation includes one-click voice generation (designs a custom voice from an included prompt), a voice picker for browsing the ElevenLabs library, and clipboard paste for voice IDs.

## UI Refinements

- Always-on-top dark glass panel, visible on all Spaces
- No dock icon, never steals focus
- Drag-to-position with persistence via UserDefaults
- Stale sessions gray out after 10 minutes
- Dead sessions auto-removed when terminal tab closes
- Hover-to-reveal kill button on each row
- Settings popover with voice controls and refresh button

## Cross-Session Awareness (Mar 2026)

Several cross-session awareness features were built incrementally alongside the core UI but never documented as a cohesive capability. A heal audit on 2026-03-20 identified these as under-documented, bumping Pillar 4 from 30% to 50%.

**What's shipped:**

- **Priority ordering.** Sessions sort by urgency: attention first, then working, starting, done. The most actionable session is always at the top. This is a single sort comparator in `readSessions()` (line ~438).
- **Aggregate status counters.** The header bar shows colored dot + count for each status (orange/attention, cyan/working, green/done) plus a total. Implemented in `HeaderBar` computed properties. Provides fleet health at a glance without expanding the panel.
- **Cross-terminal discovery.** The refresh button runs a shell script that walks the process tree looking for Claude Code processes, checks their TTY against existing sessions, and creates session files for any it finds. This catches sessions whose hooks didn't fire.
- **Stale detection.** Sessions that haven't received an update in 10+ minutes are visually dimmed. This surfaces hung or abandoned sessions.

**What's not shipped (Phase 2 backlog):**

- Session grouping by project (multiple sessions on same project shown as a group)
- Session outcome history (persist completed sessions beyond current runtime)
- Detailed aggregate stats (sessions today, avg duration, permission wait time)

These remaining items would require either persistent storage (for history) or UI redesign (for grouping). They're documented in SPEC.md under "Not Yet Implemented (Phase 2 Candidates)."

## Key Decisions

**Polling over file watchers.** The app polls the sessions directory every 500ms instead of using FSEvents. Polling is simpler, more reliable across macOS versions, and 500ms latency is imperceptible for status updates. The CPU cost is negligible for reading a handful of small JSON files.

**Swift over Electron.** A native SwiftUI app compiles to a ~2MB binary with zero runtime dependencies. An Electron equivalent would ship 200MB+ and consume significantly more memory for a panel that should be invisible.

**Hook-based architecture.** Claude Code lifecycle hooks write session state to disk. The monitor reads from disk. No IPC, no sockets, no shared memory. This decoupling means the monitor can crash and restart without affecting any Claude Code session.
