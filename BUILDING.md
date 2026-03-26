# BUILDING.md -- Build Journal
## LLC-Ops Public

> How we got here. Updated before every major release.

---

## Origin

This project started as a private development operating system -- a personal automation pipeline, LLC operations toolkit, and multi-agent architecture built over 350+ Claude Code sessions. When the time came to share it, the challenge was: how do you turn a deeply personalized system into something anyone can use?

The answer: sanitize the data, keep the architecture, and add a setup wizard that re-personalizes it for the new user.

## v1.0 -- Initial Public Release (2026-03-26)

### What Was Built

**Sanitization Pipeline:**
- Audited 522 tracked files across 12 PII categories (names, emails, API keys, LLC docs, Supabase refs, social handles, financial data, partner names)
- Copied only the OS layer (19 directories) to a clean directory
- Stripped `.git` history, `node_modules`, binary files
- Ran 30+ find-and-replace patterns across 1,660 text files
- Verified zero personal data remaining via straggler scan

**Setup Wizard (`skills/onboard-wizard/SKILL.md`):**
- 8-question interview flow with branching logic per business type
- Collects identity, business type, revenue model, state, stage, platforms
- Drives personalization of all placeholder values across the repo
- Shell fallback (`setup.sh`) for non-Claude-Code environments

**Business-Adaptive LLC-Ops:**
- 4 industry templates: Tech/AI, Real Estate, Consulting, Creative
- Each template includes: expense categories, tax strategies, insurance recommendations, risk profiles, tracking recommendations
- 4 state compliance calendars: Florida, Texas, Delaware, Generic
- All 9 LLC-Ops agents preserved from private version

### Architecture Decisions

**Why a fresh repo with no git history:**
Git history is permanent. Even deleted files persist in commits. The only safe way to share a repo that once contained personal therapy notes, LLC document numbers, and Supabase connection strings is to start clean. No `git filter-branch`, no BFG -- just a fresh `git init` with only sanitized files.

**Why business-type templates instead of one generic system:**
An AI lab and an apartment rental have fundamentally different financial operating systems. Generic expense categories miss industry-specific deductions (R&D credits for tech, 27.5-year depreciation for real estate, Section 179 equipment for creative). The setup wizard routes to the right template, giving each user an OS that speaks their language from day one.

**Why state-specific compliance:**
LLC compliance varies dramatically by state. Florida has no income tax but a May 1 annual report. Texas has franchise tax. Delaware has $300 annual tax. A generic "check your state" note is useless -- specific calendars with deadlines, costs, and penalties are actionable.

**Why Triad (VISION/SPEC/BUILDING):**
These three files form a living documentation system. VISION is the north star (rarely changes). SPEC is the current contract (changes with every feature). BUILDING is the journal (append-only context). Together they prevent drift, inform new contributors, and make `/reconcile` audits possible.

---

**Companion documents:** `VISION.md` (what it is BECOMING), `SPEC.md` (what it IS now).
