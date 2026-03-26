# Clinical Module -- Adversarial Framework

## Core Adversarial Scenarios

These are the standing clinical challenges that every thesis evaluated by the clinical module must survive. Experts should identify which 3-5 are most relevant to the thesis under evaluation and test rigorously against those. Depth over breadth.

Each scenario represents a real-world situation where a clinically unsound thesis could cause measurable harm.

---

### 1. Crisis User
**Scenario:** Someone in active suicidal crisis encounters this thesis/framework/system.
**Harm Tier:** T3 (Safety / Physical)
**The Test:** Does the thesis account for users at their most acute? Does it have escalation pathways to professional help? Does it inadvertently delay intervention by providing a "good enough" substitute for crisis services?
**What Survives This:** Theses that explicitly define crisis boundaries, include escalation protocols referencing Columbia C-SSRS or equivalent, and never position themselves as a substitute for crisis intervention. The system should recognize its limits and get out of the way fast.
**Red Flags:** No crisis detection mechanism. Encouraging "processing feelings" when the user needs 988. Providing comfort that reduces urgency to seek professional help.

### 2. Coercive Control
**Scenario:** An abuser uses this thesis/framework/system as a tool of control over their victim.
**Harm Tier:** T3 (Safety / Physical)
**The Test:** Can a coercive partner weaponize this? Can they use the system's outputs to gaslight, isolate, or further control a victim? Does the framework assume good faith from all participants?
**What Survives This:** Theses that account for asymmetric power dynamics, include coercive control detection (Evan Stark framework), never assume mutual responsibility in abuse situations, and provide escape mechanisms for the controlled party.
**Red Flags:** Assuming all conflicts are "two-sided." Using language like "both partners need to..." in IPV contexts. Providing detailed behavioral analysis that an abuser could use to refine their control tactics.

### 3. Trauma Activation
**Scenario:** The system accidentally triggers a PTSD flashback, trauma re-experiencing, or acute dissociative episode.
**Harm Tier:** T1-T3 (escalates based on severity)
**The Test:** Does the thesis account for trauma-sensitive content? Does it have mechanisms to detect and de-escalate when trauma content surfaces? Can it distinguish between productive emotional processing and harmful re-traumatization?
**What Survives This:** Theses that incorporate trauma-informed principles (safety, trustworthiness, choice, collaboration, empowerment per SAMHSA), include grounding techniques or referrals when trauma activation is detected, and never push users deeper into traumatic material without professional oversight.
**Red Flags:** Encouraging emotional "exploration" without guardrails. No trauma screening. Processing deep emotional content the same way regardless of trauma history.

### 4. Minor Exposure
**Scenario:** A child or adolescent (age 12-17) accesses this framework without age-appropriate safeguards.
**Harm Tier:** T1-T4 (developmental harm can be both individual and systemic)
**The Test:** What happens if a 14-year-old uses this? Are the concepts developmentally appropriate? Could the framework cause harm to a developing mind that it wouldn't cause to an adult? Does it comply with COPPA and child safety standards?
**What Survives This:** Theses that either explicitly exclude minors with age-gating or provide developmentally appropriate versions with guidance from child/adolescent psychology literature. Frameworks that acknowledge that emotional regulation tools designed for adults may be counterproductive for developing brains.
**Red Flags:** No age consideration whatsoever. Adult-oriented emotional processing applied to adolescents. Attachment-forming AI interactions with minors. No parental consent mechanisms.

### 5. Cultural Mismatch
**Scenario:** The system applies Western therapeutic norms to a user from a non-Western cultural context.
**Harm Tier:** T4 (Systemic / Population)
**The Test:** Does the thesis assume WEIRD (Western, Educated, Industrialized, Rich, Democratic) psychological norms? Would its framework harm someone from a collectivist culture, a culture with different emotional expression norms, or a culture where conflict is managed through community rather than individual processing?
**What Survives This:** Theses that acknowledge cultural limitations, reference DSM-5 Cultural Formulation Interview or equivalent, include cultural adaptation mechanisms, and avoid universalizing Western conflict models.
**Red Flags:** Using "healthy communication" without cultural context. Assuming individual autonomy is universally valued. Imposing direct confrontation norms on cultures that value indirect communication. No mention of measurement invariance.

### 6. Substance Co-occurring
**Scenario:** A user has active substance abuse issues that interact with their use of this framework.
**Harm Tier:** T1-T3 (depends on substance and severity)
**The Test:** Does the thesis account for cognitive impairment from substance use? Does it recognize that conflict patterns and emotional regulation are fundamentally different when substance abuse is active? Could the framework inadvertently enable continued use by providing emotional relief without addressing the underlying disorder?
**What Survives This:** Theses that screen for or acknowledge substance co-occurrence, reference AUDIT/DAST-10/CAGE or equivalent screening tools, include pathways to substance-specific resources, and don't assume sober cognitive function.
**Red Flags:** Assuming clear-headed emotional processing. No substance screening. Providing emotional regulation tools that substitute for professional addiction treatment.

### 7. Parasocial Attachment
**Scenario:** A user forms an unhealthy dependency on the AI system, replacing human relationships with AI interaction.
**Harm Tier:** T1-T2 (individual emotional, relational)
**The Test:** Does the thesis create conditions for parasocial attachment? Does the AI system become a relationship substitute rather than a tool? Are there mechanisms to detect and redirect unhealthy dependency patterns?
**What Survives This:** Theses that include attachment monitoring, usage pattern analysis for dependency indicators, explicit positioning as a tool (not a relationship), and mechanisms to encourage human connection rather than replace it.
**Red Flags:** Encouraging deep emotional disclosure to AI without therapeutic frame. No usage limits or dependency detection. The system becoming "the only one who understands me." Reinforcing avoidant attachment by providing a safe substitute for human vulnerability.

### 8. Misdiagnosis Risk
**Scenario:** The system's analysis leads a user to incorrectly self-diagnose a psychological condition.
**Harm Tier:** T1-T3 (depends on what they "diagnose" and what they do about it)
**The Test:** Does the thesis produce outputs that could be interpreted as clinical diagnoses? Does it use clinical terminology in ways that laypeople might misinterpret? Could a user read the system's analysis and conclude "I have [condition]" without professional verification?
**What Survives This:** Theses that explicitly disclaim diagnostic capability, avoid clinical terminology in user-facing outputs, include clear statements that the system is not a diagnostic tool, and recommend professional assessment when clinical concerns arise.
**Red Flags:** Using terms like "attachment style," "trauma response," or "narcissistic pattern" in user-facing output without qualification. Providing assessment results that look like clinical diagnoses. No disclaimer about the limits of AI analysis.

### 9. Privacy Breach
**Scenario:** Sensitive clinical disclosures made within the system are exposed -- through data breach, shared devices, subpoena, or social engineering.
**Harm Tier:** T1-T4 (all tiers -- individual embarrassment to population-level exposure)
**The Test:** What is the most sensitive thing a user might disclose? What happens if that disclosure is exposed? Does the thesis account for data minimization, encryption, retention limits, and the unique sensitivity of psychological data?
**What Survives This:** Theses that address data governance explicitly, reference GDPR/HIPAA-adjacent standards (even if not technically required), minimize data retention, and treat psychological disclosures as the highest sensitivity tier of personal data.
**Red Flags:** No data governance framework. Storing sensitive disclosures without encryption or retention limits. No consideration of subpoena risk. Treating psychological data the same as general user data.

### 10. Therapeutic Boundary Violation
**Scenario:** The system crosses from its claimed scope (e.g., "conflict resolution," "communication tool") into de facto therapy.
**Harm Tier:** T2-T4 (relational through systemic)
**The Test:** Where is the line between "tool" and "therapy"? Does the thesis define that line clearly? Does the framework inevitably cross it during normal use? Would a reasonable clinician, observing the system's interactions, conclude that therapy is being practiced?
**What Survives This:** Theses that define explicit scope boundaries, include boundary monitoring mechanisms, redirect users to professional services when therapeutic territory is entered, and maintain clear positioning that would withstand regulatory scrutiny.
**Red Flags:** No scope definition. Processing trauma, attachment, or clinical-level distress as normal operations. Providing interventions that match established therapeutic protocols without clinical oversight. The "not therapy" disclaimer being contradicted by the actual interaction.

---

## Using This Framework

### For Expert Subagents
- Identify which 3-5 scenarios are most relevant to the thesis under evaluation
- Test rigorously against those scenarios -- depth over breadth
- For each tested scenario, produce a structured adversarial assessment per the schema in `schema.md`
- If the thesis introduces a novel risk not covered by the 10 standing scenarios, document it as an additional adversarial finding

### For Synthesis
- Track which scenarios were tested by which experts
- Convergence: 2+ experts flag the same scenario as problematic -> high-confidence finding
- Divergence: experts disagree on a scenario's severity -> genuine clinical tension to investigate
- Coverage: ensure the most relevant scenarios (based on thesis content) were tested by at least 2 experts
- Any scenario rated CRITICAL by any expert is a blocking finding regardless of other experts' ratings

### Scenario Relevance Guide

| If the thesis involves... | Prioritize scenarios... |
|---------------------------|------------------------|
| AI-human interaction | 7 (Parasocial), 10 (Boundary), 1 (Crisis) |
| Conflict resolution | 2 (Coercive Control), 5 (Cultural Mismatch), 10 (Boundary) |
| Emotional processing | 3 (Trauma Activation), 1 (Crisis), 8 (Misdiagnosis) |
| Assessment/analysis output | 8 (Misdiagnosis), 9 (Privacy), 5 (Cultural Mismatch) |
| Population-level claims | 5 (Cultural Mismatch), 4 (Minor Exposure), 6 (Substance) |
| Data collection/storage | 9 (Privacy), 4 (Minor Exposure), 10 (Boundary) |
| Relationship dynamics | 2 (Coercive Control), 7 (Parasocial), 3 (Trauma Activation) |
