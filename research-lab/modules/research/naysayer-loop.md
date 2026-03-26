# Research Module -- Naysayer Loop Orchestration

## Trigger

`/research naysayer`

This command runs the full naysayer loop: vulnerability analysis, naysayer selection, parallel attack spawning, response processing, and knowledge base update. It is the lab's active stress-test -- run it whenever:

- A new finding is added to findings.md (especially provisional ones)
- The adversarial framework feels stale (same challenges, no growth)
- Before any publication or external presentation of CaF claims
- When you suspect a finding passed expert review too easily
- On a regular cadence (every 3-5 research cycles minimum)

---

## The Full Loop

### Step 1: Read Knowledge Base

Read the current state of:
- `knowledge/findings.md` -- all findings (F-NNN) with grades, weaknesses, adversarial survival records
- `modules/research/adversarial.md` -- all standing challenges
- `knowledge/contradictions.md` -- existing contradictions
- `knowledge/open-questions.md` -- existing open questions
- `sessions/naysayer-*/` -- prior naysayer loop results (to avoid re-running stale matchups)

### Step 2: Vulnerability Analysis

Rank all findings by vulnerability. Vulnerability score is a composite of:

| Factor | Weight | Scoring |
|--------|--------|---------|
| Grade | 30% | Provisional=high, Established=low. Lower composite score=higher vulnerability |
| Unresolved weaknesses | 25% | Count of CRITICAL and HIGH severity weaknesses that haven't been addressed |
| Failed adversarial challenges | 20% | Count of standing challenges the finding has failed or only partially survived |
| Dependency exposure | 15% | Findings that other findings DEPEND_ON are higher priority targets -- if they fall, others fall |
| Recency | 10% | Newer findings haven't been stress-tested as much |

Select the **3-5 most vulnerable findings** as targets.

**Output of this step:** A ranked list of vulnerable findings with their vulnerability scores and the specific weaknesses that make them vulnerable.

### Step 3: Select 3 Naysayers

Using the naysayer pool (`naysayer-pool.md`) and the selection algorithm:

1. For each vulnerable finding, identify which naysayer traditions target it most effectively (using the "Targets most effectively" field in the pool).
2. Build a coverage matrix: naysayer x finding, scored by how effectively that tradition attacks that finding.
3. Select the 3 naysayers that maximize total coverage of vulnerable findings.
4. **Dedup check:** Review `sessions/naysayer-*/` for prior matchups. If naysayer N-0X already attacked finding F-NNN and the finding survived, remove that cell from the coverage matrix. Don't re-run survived matchups.
5. **Diversity check:** If the same 3 naysayers were selected in the last loop, force-rotate at least 1. The full pool of 8 should cycle over time.

**Output of this step:** 3 selected naysayers, each with their assigned target findings and the rationale for selection.

### Step 4: Spawn 3 Naysayers in Parallel

For each selected naysayer, create a subagent task:

1. **Build the prompt** using the template in `naysayer-prompt.md`:
   - Inject the naysayer's identity, description, tradition, and weapons from `naysayer-pool.md`
   - Inject all findings from `knowledge/findings.md`
   - Inject the specific target findings for this naysayer
   - Inject all standing challenges from `modules/research/adversarial.md`

2. **Spawn via Task tool** (TaskCreate):
   - Task name: `naysayer-{N-0X}-{YYYY-MM-DD}-{NNN}`
   - Type: `general-purpose` subagent
   - The subagent should be instructed to return valid JSON per the output format in `naysayer-prompt.md`

3. **All 3 run in parallel.** Do not wait for one to finish before starting the next.

### Step 5: Save Responses

As each naysayer returns, immediately save to a session directory:

```
sessions/naysayer-YYYY-MM-DD-NNN/
  meta.json          -- Session metadata (timestamp, naysayers selected, targets, rationale)
  vulnerability.md   -- The vulnerability analysis from Step 2
  N-0X-response.json -- Raw JSON response from each naysayer (3 files)
  processing.md      -- Notes from Step 6 processing
  report.md          -- Final synthesized report from Step 8
```

**meta.json structure:**
```json
{
  "session_id": "naysayer-YYYY-MM-DD-NNN",
  "timestamp": "ISO 8601",
  "naysayers_selected": [
    {
      "id": "N-0X",
      "role": "Role name",
      "target_findings": ["F-NNN", ...],
      "selection_rationale": "Why this naysayer was chosen"
    }
  ],
  "vulnerable_findings": ["F-NNN", ...],
  "total_attacks": 0,
  "novel_challenges_found": 0,
  "threat_levels": {"N-0X": "LEVEL", ...},
  "prior_loops_checked": ["session-ids..."]
}
```

### Step 6: Process Attacks

For each naysayer response, process the attacks as if they were external research ingests. This is the critical integration step.

#### 6a: Process Individual Attacks

For each attack in the `attacks` array:

1. **Evaluate attack quality** using the Quality Tiers in naysayer-prompt.md (S/A/B/C/Reject).
2. **If S-tier or A-tier:**
   - Create an external source entry in `knowledge/external/NAY-NNN-{slug}.md`:
     ```
     ### NAY-NNN: Naysayer Attack — {attack_title}
     - **Source:** Naysayer loop session {session-id}, {naysayer role}
     - **Tradition:** {tradition}
     - **Date:** YYYY-MM-DD
     - **Target:** F-NNN
     - **Threat level:** {strength}
     - **Attack:** {full attack text}
     - **Steel-man of target:** {steel_man}
     - **What survives:** {what_would_survive}
     - **Suggested defense:** {suggested_defense}
     - **Cascading damage:** {cascading_damage}
     ```
   - If the attack is a CONTRADICTS relationship to an existing finding:
     - Add to `knowledge/contradictions.md` using the C-NNN format
     - Generate a research brief in `queue/` that investigates the tension FAIRLY (not defensively)
   - If the attack reveals a gap in the finding:
     - Add to the finding's weakness list in `knowledge/findings.md`

3. **If B-tier:**
   - Log in the session's processing.md but do NOT create external source entries
   - Add a note to the relevant finding's adversarial survival record

4. **If C-tier or Reject:**
   - Log in processing.md with reason for low rating
   - No KB updates

#### 6b: Process Novel Challenges

For each entry in the `novel_challenges` array:

1. **If CRITICAL or HIGH severity:**
   - **Append to `modules/research/adversarial.md`** as a new standing challenge (next number in sequence)
   - Format:
     ```
     ### N+1. {title} (from Naysayer Loop {session-id})
     **Attack:** "{attack text}"
     **Source tradition:** {tradition}
     **What survives this:** {what_survives}
     **Severity when discovered:** {severity}
     **Findings affected:** {affected_findings}
     ```
   - Generate a research brief in `queue/` specifically targeting this challenge

2. **If MEDIUM or LOW severity:**
   - Add as a sub-note to the most relevant existing challenge in adversarial.md
   - Do not create a standalone standing challenge

#### 6c: Process Existing Challenge Deepenings

For each entry in `existing_challenge_deepening`:

1. Find the corresponding challenge in adversarial.md
2. Append the new angle as a sub-section:
   ```
   #### Deepened by {naysayer role} ({session-id})
   {new_angle}
   ```

#### 6d: Process Inter-Finding Tensions

For each entry in `inter_finding_tensions`:

1. If the tension is genuinely new (not already in contradictions.md):
   - Add to `knowledge/contradictions.md`
   - Generate a research brief to investigate the internal tension
2. If it's a known tension with a new angle:
   - Update the existing contradiction entry with the new perspective

### Step 7: Update Knowledge Base

After processing all 3 naysayer responses:

1. **contradictions.md** -- All new contradictions added (both external attacks and inter-finding tensions)
2. **sources.md** -- Register any NAY-NNN external source entries created
3. **open-questions.md** -- Add any new questions that emerged from attacks (each naysayer's attacks often imply questions the lab should investigate)
4. **adversarial.md** -- Append novel challenges and deepen existing ones
5. **findings.md** -- Update adversarial survival records for targeted findings:
   ```
   - **Naysayer survival ({session-id}):** Survived N-0X ({tradition}) — {summary}. Failed N-0Y ({tradition}) — {summary}.
   ```
6. **state/lab-state.json** -- Update counters (naysayer loops run, total attacks, novel challenges found)

### Step 8: Generate Report

Create `sessions/naysayer-{session-id}/report.md` with the following structure:

```markdown
# Naysayer Loop Report -- {session-id}

## Vulnerability Analysis

{Which findings were identified as most vulnerable and why}

## Naysayers Selected

| Naysayer | Tradition | Targets | Rationale |
|----------|-----------|---------|-----------|
| ... | ... | ... | ... |

## Attack Summary

### {Naysayer 1 Role}
- **Overall threat level:** {LEVEL}
- **Attacks launched:** {count}
- **Quality tier breakdown:** {S: N, A: N, B: N, C: N}
- **Strongest attack:** {title} against {F-NNN} -- {one sentence}
- **Novel challenges:** {count} ({severity levels})

### {Naysayer 2 Role}
{same structure}

### {Naysayer 3 Role}
{same structure}

## Findings Under Attack

### F-NNN: {finding title}
- **Attacked by:** {naysayer roles}
- **Survived:** {which attacks and why}
- **Damaged by:** {which attacks and how}
- **New weaknesses identified:** {list}
- **Status change:** {unchanged / downgraded / needs rework}

{repeat for each targeted finding}

## Adversarial Framework Growth

- **New standing challenges added:** {count}
  {list with titles and severity}
- **Existing challenges deepened:** {count}
  {list with challenge numbers and what was added}
- **Total standing challenges now:** {count}

## Research Briefs Generated

| Brief ID | Title | Source | Priority |
|-----------|-------|--------|----------|
| ... | ... | ... | ... |

## Contradictions Found

| C-NNN | Tension | Findings | Source |
|-------|---------|----------|--------|
| ... | ... | ... | ... |

## Overall Assessment

{One substantial paragraph: how did the knowledge base fare? What are the biggest threats? What needs immediate attention? What held up well?}

## Strongest Single Objection (across all 3 naysayers)

{The one attack from the entire loop that most threatens the framework. This is what should keep the authors up at night.}
```

Also generate a copy of the report for quick reference at:
- `~/Development/artifacts/research-lab/naysayer-{session-id}.html` (Factory-Inspired interactive HTML if time permits; otherwise markdown copy is sufficient)

---

## Session Numbering

Naysayer sessions use the same date-based incrementing scheme as other sessions:
- `naysayer-2026-02-25-001` (first naysayer loop on Feb 25)
- `naysayer-2026-02-25-002` (second naysayer loop on Feb 25)
- Check existing `sessions/naysayer-*` directories to determine the next sequence number.

---

## Integration with Other Lab Operations

### Naysayer Loop + Research Cycles

The naysayer loop is SEPARATE from the standard research cycle (intake/evaluate/synthesize). They serve different functions:

| Operation | Purpose | When |
|-----------|---------|------|
| `/research` | Evaluate a new thesis via 3 experts | New thesis to evaluate |
| `/research ingest` | Absorb external research into KB | External source to analyze |
| `/research naysayer` | Stress-test existing findings via 3 critics | Findings need hardening |

They feed each other:
- Research cycles produce findings -> naysayer loop stress-tests them
- Naysayer loop generates research briefs -> research cycles investigate them
- Naysayer loop grows adversarial.md -> research cycles use the stronger adversarial framework

### Naysayer Loop + External Ingest

Naysayer attacks are processed AS IF they were external ingests. This is intentional -- it means the same machinery that handles real external criticism also handles simulated adversarial criticism. The knowledge base doesn't distinguish between "a real philosopher objected to this" and "a naysayer subagent objected to this." Both get the same treatment.

The difference: external ingests cite real published work. Naysayer attacks cite the theoretical tradition's arguments. Both are valid sources of challenge.

### Autonomous Mode

When autonomous mode is enabled (config.md), the naysayer loop can be auto-triggered:
- After every N research cycles (configurable, default: every 3 cycles)
- When a finding is promoted to findings.md with a grade below A-
- When a new standing challenge is added to adversarial.md from ANY source (including external ingests)

This creates a continuous immune response: new findings are automatically stress-tested, and the adversarial framework continuously grows.

---

## Failure Modes and Mitigations

| Failure | Detection | Mitigation |
|---------|-----------|------------|
| Naysayer is too gentle (no real attacks) | All attacks rated C-tier or below | Re-run with a different naysayer or a stronger prompt emphasizing adversarial stance |
| Naysayer is too generic (retreads known ground) | Zero novel challenges, all attacks map to existing adversarial.md entries | Check if the naysayer was well-matched to the target. Rotate to a different naysayer. |
| Same 3 naysayers selected every time | Check session history | Force-rotate per selection algorithm |
| Attack quality varies wildly across naysayers | Compare quality tier distributions | Adjust prompts for underperforming naysayer archetypes |
| Knowledge base update conflicts | Two attacks identify the same contradiction differently | Merge into a single contradiction entry, note both perspectives |
| Cascading damage not tracked | Naysayer identifies cascading damage but orchestrator doesn't follow up | After processing, trace all "cascading_damage" chains and verify each linked finding is flagged |

---

## Example Walkthrough

Suppose the current KB has these findings:
- F-000: Consciousness has directory structure (Established, survived #2 and #8)
- F-001: Unconscious is load-bearing (Established, survived #4, partial on #7)
- F-005: Write-protection is precondition (Provisional, B+, failed #9, unresolved CRITICAL weakness: no demarcation criterion)

**Step 2 (Vulnerability):** F-005 is most vulnerable (Provisional, failed #9, CRITICAL weakness). F-001 is second (partial on #7). F-000 is third (Established but hasn't faced enactivist or constructionist attack).

**Step 3 (Selection):**
- F-005 failed Panpsychism Slope (#9) -> N-06 Social Constructionist and N-08 Indigenous/Non-Western Critic both target the "consciousness as property" assumption that underlies the panpsychism problem
- F-001 partial on Anthropomorphism (#7) -> N-02 Eliminativist targets "load-bearing" as marketing for subpersonal processing
- F-000 hasn't faced embodiment critique -> N-05 Radical Enactivist targets disembodied cognitivism

Selected: **N-02 (Eliminativist)**, **N-05 (Radical Enactivist)**, **N-06 (Social Constructionist)**

Rationale: Maximum destructive coverage. Eliminativist attacks the ontology (consciousness doesn't exist as described). Enactivist attacks the embodiment gap (no body, no mind). Constructionist attacks the reification (consciousness is attribution, not property). Three completely different angles.

**Steps 4-8:** Spawn, save, process, update, report.

After the loop, adversarial.md might have 2 new standing challenges, contradictions.md might have 1 new entry, and F-005 might have 2 new weaknesses logged. The lab is now harder to fool.
