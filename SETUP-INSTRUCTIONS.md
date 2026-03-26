# Claude Code OS -- Setup

Welcome. This is a development operating system built on Claude Code. It includes automation scripts, monitoring tools, multi-agent patterns, and workflow infrastructure.

## Quick Start

### Option A: Claude Code Setup Wizard (Recommended)

If you have Claude Code installed, open this directory and say:

```
/start setup
```

Claude will interview you and personalize every file with your identity, domains, and infrastructure. This is the smoothest path.

### Option B: Shell Script

```bash
./setup.sh
```

Prompts you for your details and runs find-and-replace across all files.

### Option C: Manual

Search for these placeholders and replace them with your own values:

| Placeholder | Replace with |
|-------------|-------------|
| `Your Name` | Your full name |
| `your-username` | Your GitHub username |
| `your-email@example.com` | Your primary email |
| `your-domain.app` | Your primary domain |
| `@your-handle` | Your X/Twitter handle |
| `your-supabase-ref` | Your Supabase project ref |
| `your-supabase-anon-key` | Your Supabase anon key |

## What's Included

```
scripts/          -- Automation scripts (morning briefing, overnight, hygiene)
config/           -- Automation config and launchd plists
.dmux-hooks/      -- Git hook examples
docs/             -- Architecture docs, guides, dashboards
skills/           -- Claude Code skill definitions
cortex/           -- Cross-session continuity protocol
sentinel/         -- Monitoring system
claude-monitor/   -- Claude Code monitoring
codebase-map/     -- Codebase visualization
research-lab/     -- Research framework
squire/           -- Task management system
triad/            -- Living document system (VISION/SPEC/BUILDING)
```

## After Setup

1. Copy `.claude/CLAUDE.md` patterns you like into your own config
2. Explore `scripts/` for automation ideas
3. Check `docs/AUTOMATION_PIPELINE.md` for the full architecture
4. Customize `config/quality-gates.json` to your standards

## License

MIT. Use it, adapt it, make it yours.
