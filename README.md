# Claude Code OS

A complete development operating system built on Claude Code. Automates your daily workflow, manages your LLC finances, monitors your projects, and adapts to your specific business.

## Quick Start

```bash
git clone https://github.com/eddiebelaval/claude-code-os.git
cd claude-code-os
```

Then open in Claude Code and run:

```
/setup
```

The setup wizard interviews you and personalizes the entire OS to your identity, business type, state, and infrastructure. No brackets to fill in, no manual find-and-replace.

**Not using Claude Code?** Run `./setup.sh` instead.

## What's Inside

### Automation Layer (`scripts/`)
34 scripts that run your development workflow on autopilot.

| Script | What It Does |
|--------|-------------|
| `morning-briefing.sh` | Daily status report across all projects |
| `overnight` | Overnight organization and cleanup |
| `git-hygiene.sh` | Branch cleanup, stale PR detection |
| `collect-product-health.sh` | Gather metrics across your portfolio |
| `analyze-report.sh` | Claude AI analyzes and prioritizes issues |
| `generate-morning-report.sh` | Beautiful HTML morning reports |
| `dependency-guardian.sh` | Watch for outdated or vulnerable deps |
| `context-switch-tracker.sh` | Track context switches, protect focus |
| `seventy-percent-detector.sh` | Catch 70%-done stalls before they rot |
| `weekly-retrospective.sh` | Automated retro with pattern detection |
| `setup-automation.sh` | One-command setup for macOS launchd scheduling |

### LLC Operations (`skills/llc-ops/`)
9 specialized agents for running your LLC with expert-level precision. **Adapts to your business type during setup.**

| Agent | Role |
|-------|------|
| Sentinel | Compliance radar (deadlines, penalties, audit windows) |
| Ledger | Expense categorization and tax optimization |
| Filer | Step-by-step filing walkthroughs |
| Advisor | Legal and tax counsel with confidence levels |
| Strategist | Proactive tax optimization planning |
| Guardian | Risk management and asset protection |
| Comptroller | Cash flow, runway, financial health |
| Monitor | Regulatory change tracking |
| Mentor | Teaching partner that builds your business literacy |

**Business templates included:**
- Tech / AI (R&D credits, SaaS deductions, GPU depreciation)
- Real Estate (27.5yr depreciation, 1031 exchanges, landlord insurance)
- Consulting (S-Corp analysis, billable tracking, client concentration risk)
- Creative / Media (Section 179 equipment, content as capital asset, licensing)

**State compliance calendars:** Florida, Texas, Delaware, and a generic starter template.

### Monitoring and Continuity
| Tool | Purpose |
|------|---------|
| `cortex/` | Cross-session continuity protocol |
| `sentinel/` | Project monitoring system |
| `claude-monitor/` | Claude Code usage and performance tracking |
| `codebase-map/` | Interactive codebase visualization |

### Multi-Agent Architecture
| Tool | Purpose |
|------|---------|
| `squire/` | Task management and skill library (300+ skills) |
| `triad/` | Living document system (VISION / SPEC / BUILDING) |
| `consciousness-framework/` | Research framework for AI systems |
| `research-lab/` | Structured research with wings and resources |

### Configuration (`config/`)
- `automation.json` -- Global automation settings
- `quality-gates.json` -- Quality requirements per project
- `launchd/` -- macOS scheduling (plist files for cron-like automation)

### Documentation (`docs/`)
- Architecture guides and system maps
- Interactive HTML dashboards
- Setup walkthroughs

## The Setup Wizard

When you run `/setup`, the wizard asks 8 questions:

1. **Identity** -- Name, email, GitHub handle
2. **Business type** -- Tech, Real Estate, Consulting, or Creative
3. **Revenue model** -- Tailored options per business type
4. **State** -- LLC jurisdiction for compliance calendar
5. **Stage** -- Just formed, operating, established, or scaling
6. **Platforms** -- Supabase, Vercel, Stripe, accounting tools

Then it:
- Replaces all placeholders with your actual identity and infrastructure
- Generates a business profile tuned to your LLC type
- Customizes expense categories, tax strategies, and insurance recommendations
- Sets your compliance calendar to your state
- Calibrates the Mentor agent to your experience level

## Requirements

- macOS (uses launchd for automation scheduling)
- Claude Code CLI
- `gh` CLI (GitHub)
- `jq` (JSON processing)

## License

MIT

---

Built with Claude Code.
