---
title: "SPEC.md"
date: 2026-03-26
author: Open Source
product: LLC-Ops Public
stage: Stage 5 (Shipped)
drift-status: CURRENT
last-reconciled: 2026-03-26
---

# SPEC.md -- Living Specification
## LLC-Ops Public

> Last reconciled: 2026-03-26 | Build stage: Stage 5
> Drift status: CURRENT
> VISION alignment: 60% (3 of 5 pillars realized)

---

## Identity

A shareable, business-adaptive development operating system built on Claude Code. It combines workflow automation (34 scripts), LLC operations (9 expert agents), monitoring tools, and a multi-agent architecture into a single cloneable repo that personalizes itself via an interactive setup wizard.

## Capabilities

- **Setup Wizard:** User runs `/setup`, answers 8 questions, entire OS personalizes to their identity, business type, state, and infrastructure
- **Shell Fallback:** `setup.sh` provides the same personalization for non-Claude-Code users
- **LLC-Ops Agents:** 9 specialized agents (Sentinel, Ledger, Filer, Advisor, Strategist, Guardian, Comptroller, Monitor, Mentor) provide business operations guidance
- **Business Templates:** 4 industry profiles (Tech/AI, Real Estate, Consulting, Creative) with expense categories, tax strategies, insurance recommendations, and risk profiles
- **State Compliance:** 4 state calendars (Florida, Texas, Delaware, Generic) with deadlines, costs, and consequences
- **Automation Scripts:** 34 shell scripts for morning briefings, overnight cleanup, git hygiene, dependency monitoring, health collection, and retrospectives
- **macOS Scheduling:** launchd plist files for automated daily/weekly script execution
- **Project Monitoring:** Sentinel, Cortex continuity, Claude Monitor for usage tracking
- **Multi-Agent Tools:** Squire (task management, 300+ skills), Triad (living documents), Codebase Map (visualization)

## Architecture Contract

| Layer | Technology | Notes |
|-------|-----------|-------|
| Runtime | Claude Code CLI | Required for `/setup` wizard and agent interactions |
| Shell | Bash / Zsh | Scripts are Bash-compatible, macOS-optimized |
| Scheduling | macOS launchd | Plist files for automated execution |
| Skills | Markdown (SKILL.md) | Claude Code skill format |
| Templates | Markdown | Plain text, no proprietary formats |
| Config | JSON | automation.json, quality-gates.json |

### Key File Structure

| Path | Purpose |
|------|---------|
| `skills/onboard-wizard/SKILL.md` | Setup wizard skill definition |
| `skills/llc-ops/` | LLC operations agents and business templates |
| `skills/llc-ops/templates/` | Business-type profiles (tech-ai, real-estate, consulting, creative) |
| `skills/llc-ops/templates/states/` | State compliance calendars |
| `scripts/` | 34 automation scripts |
| `config/` | Automation and quality gate configuration |
| `setup.sh` | Shell-based setup fallback |

## Boundaries

- Does NOT connect to any external APIs (no Supabase, no Stripe, no accounting software)
- Does NOT file taxes or government forms
- Does NOT store financial data or transactions
- Does NOT support Windows or Linux launchd scheduling (scripts work, scheduling does not)
- Does NOT support multi-member LLCs or partnerships
- Does NOT auto-update state compliance calendars (manual maintenance)

## Verification Surface

- [ ] `setup.sh` runs without errors on clean clone
- [ ] All placeholder strings (`your-username`, `your-email@example.com`, etc.) are present before setup
- [ ] After setup, zero placeholders remain in text files
- [ ] 4 business templates exist in `skills/llc-ops/templates/`
- [ ] 4 state templates exist in `skills/llc-ops/templates/states/`
- [ ] 9 LLC-Ops agents are defined in skill files
- [ ] All 34 scripts in `scripts/` are executable
- [ ] README clone URL matches actual repo URL
- [ ] No personal identifiable information (PII) exists in any tracked file
- [ ] Triad files (VISION.md, SPEC.md, BUILDING.md) exist at repo root

## Drift Log

| Date | Section | What Changed | Why | VISION Impact |
|------|---------|-------------|-----|---------------|
| 2026-03-26 | All | Initial specification | First public release | N/A |

---

**Companion documents:** `VISION.md` (what it is BECOMING), `BUILDING.md` (how we got here).
**This document is the contract. Test against it. Audit against it.**
