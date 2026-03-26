# Triad

A three-document system that replaces your dead PRD. Three source-of-truth documents produce six computed outputs. Nothing goes stale because nothing is stored separately.

```
        VISION.md
        (FUTURE)
         /    \
        /      \
       / THE    \
      / WORK     \
     /            \
SPEC.md -------- BUILDING.md
(PRESENT)          (PAST)
```

**VISION.md** -- Where the product is going. Soul, pillars, anti-vision, edges.
**SPEC.md** -- What the product is right now. Testable contract with drift detection.
**BUILDING.md** -- How it got here. The build journal.

The gap between VISION and SPEC is the roadmap. You don't maintain a roadmap. You don't maintain a changelog. You don't maintain an onboarding guide. The triangle produces them.

---

## The Derivation Engine

The three documents are a normalized data store. Six commands compute views over them:

| Command | What It Produces | Inputs |
|---------|-----------------|--------|
| `/roadmap` | Prioritized build order | VISION + SPEC + BUILDING |
| `/drift` | Are we building toward the vision or wandering? | VISION + BUILDING |
| `/changelog` | What shipped recently, classified by type | BUILDING + SPEC |
| `/pitch` | Investor/user-facing narrative | VISION + SPEC |
| `/debt` | Technical and product debt | SPEC + VISION + BUILDING |
| `/onboard` | New contributor orientation | BUILDING + SPEC |

Every output is computed fresh. When the source documents change, every derived view updates automatically. This is the same principle as database views vs. tables -- store facts once, derive everything else.

### How `/roadmap` prioritizes

The three documents dictate priority order, not a human maintaining a list:

1. **Dependency depth** (from VISION) -- Does this pillar unblock others? Foundational items first.
2. **Momentum** (from BUILDING) -- Recent entries pointing at this item? Active energy = higher priority.
3. **Distance from done** (from SPEC) -- Partial items closer to completion are cheaper to finish.
4. **Recency** (from BUILDING) -- Stale items with no mention in 30+ days deprioritize.

### How `/drift` catches problems

Maps every recent BUILDING entry to VISION pillars:
- Entries that don't map to any pillar = **scope creep candidates**
- Pillars with zero BUILDING momentum = **neglected priorities**
- Entries that contradict the Anti-Vision = **drift warnings**

---

## Reconciliation

`/reconcile` maintains the triangle through conversation. Five modes:

| Mode | When | What Happens |
|------|------|-------------|
| `/reconcile init` | New project | Soul interview + codebase scan |
| `/reconcile spec` | Something shipped | Scan code, update contract |
| `/reconcile vision` | Learned something new | Conversational interview, update north star |
| `/reconcile scan` | Things feel off | Drift report, no edits |
| `/reconcile` | Full checkup | All of the above |

The reconcile skill is conversational. It asks questions, listens, and writes the docs. No brackets to fill in.

---

## Automation

The Triad maintains itself through integration with your existing workflow:

| Trigger | What Happens |
|---------|-------------|
| **Session start** (`/morning`) | Lightweight drift check -- flags stale SPEC, asks one question |
| **Pre-ship** (`/ship`) | Scans diff for new capabilities not in SPEC, asks to add them |
| **Post-gate** (pipeline) | Checks if pillar status should change after gate pass |
| **Significant commit** | Silently notes new routes/pages/migrations, prompts at next breakpoint |

All automation uses structured questions (AskUserQuestion) with a skip option. The system never interrupts flow -- it prompts at natural breakpoints.

Staleness escalation: skip twice, the system notes it. Skip three times, it escalates tone. After that, it stops asking until drift crosses 30 days or 20+ commits.

Full spec: [`skills/triad-derive/AUTOMATION.md`](skills/triad-derive/AUTOMATION.md)

---

## Installation

### Option 1: Full install (recommended)

```bash
git clone https://github.com/your-username/triad.git
cd triad
chmod +x install.sh
./install.sh
```

This copies templates, commands, and skills to your `~/.claude/` directory.

### Option 2: Cherry-pick

```bash
# Just the templates
cp triad/templates/*.md your-project-root/

# Just the slash commands
cp triad/commands/*.md ~/.claude/commands/

# Just the skills
cp -r triad/skills/* ~/.claude/skills/
```

### Option 3: Start from scratch

Create two files at your project root:

**VISION.md** -- Answer: "Why does this exist?" List 3-7 commitments (pillars). Mark each REALIZED, PARTIAL, or UNREALIZED. Add what it must never become.

**SPEC.md** -- Answer: "What can this product do TODAY?" List every capability in present tense. Write a testable assertion for each.

The gap between those two documents is your roadmap. The triangle is alive.

---

## File Structure

```
triad/
  templates/
    vision.md          # VISION.md document template
    spec.md            # SPEC.md document template
  commands/
    reconcile.md       # /reconcile -- maintain the triangle
    roadmap.md         # /roadmap -- prioritized build order
    drift.md           # /drift -- trajectory analysis
    changelog.md       # /changelog -- what shipped recently
    pitch.md           # /pitch -- narrative from vision + proof
    debt.md            # /debt -- tech + product debt scan
    onboard.md         # /onboard -- new contributor guide
    morning.md         # /morning -- daily brief with triangle health
  skills/
    reconcile/
      SKILL.md         # Full reconciliation skill (5 modes)
    triad-derive/
      SKILL.md         # Derivation engine (6 computed views)
      AUTOMATION.md    # Proactive maintenance + trigger points
  install.sh           # Installer script
```

---

## The Idea

Every product team has the same dirty secret: the PRD died on day three. You wrote it before you started building. Then you started building and learned things. The PRD describes a product that doesn't exist.

The Triad fixes this structurally. Three documents, three temporal perspectives. Each stays in its lane. The power is in the gaps between them:

- **VISION - SPEC** = what to build next (the roadmap)
- **SPEC - BUILDING** = what shipped but wasn't documented
- **BUILDING -> VISION** = are we converging on the vision or drifting?

Two documents give you a line. Three give you a plane. You can triangulate your position. If SPEC goes stale, diff VISION against BUILDING to figure out what's true. Any two documents reconstruct the third.

Full article: [Your PRD Is Dead. Here's What Replaces It.](https://your-domain.app/articles/triangulated-documentation)

---

## Origin

Built by [Your Name](https://x.com/your-usere) at [id8Labs](https://your-domain.app) while shipping AI-augmented products with Claude Code. The three-document system was developed on [Parallax](https://tryparallax.space), an AI companion for conflict resolution. The derivation engine was added after realizing the three documents could produce every planning artifact a team needs -- without maintaining any of them separately.

Part of the [Squire](https://github.com/your-username/id8-toolkit) ecosystem.

---

## License

MIT
