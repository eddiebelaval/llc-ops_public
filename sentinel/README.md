# Sentinel

**Always-on daemon for Claude Code.**

Sentinel turns Claude Code from an interactive tool into an autonomous agent. Drop tasks into an inbox, watch them get executed, collect results — no terminal needed.

## Why

Claude Code is powerful but ephemeral. You open a session, do work, close it. Context dies. Sentinel keeps a persistent Claude session running as a daemon, watching for work and executing it autonomously.

**This is the missing piece between "AI assistant" and "AI teammate."**

## How It Works

```
You (or any trigger)         Sentinel Daemon            Claude Code
        |                          |                        |
        |-- drop task.md --------->|                        |
        |                          |-- claude -p --resume ->|
        |                          |                        |-- executes
        |                          |<-- result -------------|
        |<-- result.md ------------|                        |
        |                          |                        |
        |   (Telegram/webhook) <---|                        |
```

1. **Inbox**: Drop a `.md` file into `~/.sentinel/inbox/` — the content is your prompt
2. **Session**: Sentinel feeds it to `claude -p --resume <session-id>` — context accumulates
3. **Outbox**: Results land in `~/.sentinel/outbox/` as markdown files
4. **Notify**: Optional Telegram, webhook, or stdout notifications

## Quick Start

```bash
# Install
npm install -g claude-sentinel

# Initialize (creates ~/.sentinel/ with default config)
sentinel init

# Start the daemon
sentinel start

# Send a task (from anywhere — another terminal, a script, a cron job)
sentinel send "summarize the last 5 commits in ~/Development/my-project"

# Check status
sentinel status
```

## Configuration

`~/.sentinel/config.yaml`:

```yaml
inbox: ~/.sentinel/inbox
outbox: ~/.sentinel/outbox
workdir: ~/Development
model: sonnet
permissionMode: auto
maxBudgetPerTask: 1.00

notify:
  file: true
  stdout: true
  telegram:
    botToken: "your-bot-token"
    chatId: "your-chat-id"
```

## Inbox Conventions

| Pattern | Meaning |
|---------|---------|
| `task.md` | Simple task — content is the prompt |
| `!urgent-fix.md` | Priority task (future: queue jumping) |
| `@homer--run-tests.md` | Targeted workdir (future: per-project routing) |

## Architecture

```
sentinel/
  src/
    cli.ts              # CLI entry point (start, send, status, init)
    core/
      daemon.ts         # Orchestrator — starts all watchers, manages lifecycle
      session.ts        # Wraps `claude` CLI with persistent session
      config.ts         # YAML config loader with sensible defaults
      notify.ts         # Multi-target notification (file, Telegram, webhook)
      logger.ts         # Structured logging to stdout + file
      types.ts          # Shared types
    watchers/
      inbox.ts          # File-based task queue (chokidar)
      cron.ts           # Scheduled prompt execution
      file.ts           # Change-triggered prompts (watch VISION.md, etc.)
```

**Key design decisions:**

- **Built ON the Claude CLI**, not around it. Uses `claude -p --resume` — no API keys, no separate auth, inherits your existing Claude Code setup.
- **File-based queue** instead of a database. Inspect, debug, and replay tasks with `ls` and `cat`.
- **Session persistence** via `--resume`. Context accumulates across tasks within a session.
- **Minimal dependencies** — chokidar for file watching, yaml for config. That's it.

## Use Cases

### Autonomous Code Review
```bash
sentinel send "Review the last PR in ~/Development/my-project. Check for bugs, security issues, and style violations. Write findings to REVIEW.md"
```

### Scheduled Health Checks
Configure a cron watcher to run daily:
```bash
sentinel send "Run tests in ~/Development/my-project, check for TypeScript errors, and report any issues"
```

### Drift Detection
Watch your VISION.md and SPEC.md — when they change, automatically generate a drift report.

### CI Integration
Your CI pipeline drops a task file → Sentinel picks it up → Claude investigates the failure → results posted to Slack/Telegram.

## Roadmap

- [ ] **v0.1** — Inbox watcher, session persistence, CLI (send/start/status/init)
- [ ] **v0.2** — Cron watchers, file change watchers, launchd/systemd integration
- [ ] **v0.3** — Multi-session routing (per-project sessions)
- [ ] **v0.4** — Web dashboard for monitoring
- [ ] **v0.5** — Plugin system for custom watchers

## Built With

- [Claude Code](https://docs.anthropic.com/en/docs/claude-code) — Anthropic's CLI for Claude
- TypeScript + Node.js
- chokidar (file watching)

## License

MIT
