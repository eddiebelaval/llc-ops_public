# Engineering Module — Adversarial Framework

## Core Adversarial Challenges

These are the standing challenges that every engineering thesis must survive. They represent the real-world conditions that separate architectures that look good on a whiteboard from architectures that hold in production.

### 1. The Scale Test
**Attack:** "What happens at 100x current load? Show me the math — connection pool sizes, queue depths, database IOPS, memory footprint, network bandwidth. Not 'it should scale' but 'here's the specific bottleneck that hits first at 100x and here's the mitigation.'"
**What survives this:** Theses that include capacity modeling with actual numbers, identify the first bottleneck, and have a scaling strategy that doesn't require rearchitecture.

### 2. The Bus Factor
**Attack:** "The person who built this leaves tomorrow. No handoff, no documentation beyond what exists. Can the next engineer understand the system, diagnose issues, and make changes without reverse-engineering the entire thing?"
**What survives this:** Theses where the architecture is self-documenting — clear naming, conventional patterns, explicit decision records, tests that serve as specifications. Not theses that rely on tribal knowledge or clever abstractions only the author understands.

### 3. The Midnight Page
**Attack:** "It's 3 AM. PagerDuty fires. A user reports data loss. Can the on-call engineer — who didn't build this system — diagnose the issue, identify the blast radius, mitigate user impact, and resolve the root cause? What observability exists? What runbooks? What circuit breakers prevent cascading failure?"
**What survives this:** Theses with explicit observability design — structured logging, distributed tracing, alerting with context, health checks, runbooks. Not theses where debugging requires reading source code.

### 4. The Migration Trap
**Attack:** "You have 50,000 existing users with data in the current schema. How do you migrate them to this new system without downtime, data loss, or breaking their workflows? What's the rollback plan when the migration hits an edge case at row 37,422?"
**What survives this:** Theses that include a migration strategy — phased rollout, dual-write period, backward-compatible schema changes, rollback procedures, and validation that the migration is complete and correct.

### 5. The Security Audit
**Attack:** "An attacker has your source code, your .env.example, and your API documentation. They have 1 hour. What do they exploit first? What data can they access? What operations can they perform that they shouldn't be able to?"
**What survives this:** Theses that assume breach, implement defense in depth, follow least-privilege principles, and have explicit threat models for their most sensitive operations. Not theses where security is a TODO item.

### 6. The Cost Bomb
**Attack:** "What's the infrastructure bill at 10x, 100x, 1000x users? Did you account for LLM API costs per request, database IOPS scaling, bandwidth costs for real-time features, storage growth over time? Show me the unit economics."
**What survives this:** Theses that include cost modeling — per-user cost, per-request cost, storage growth curves, and breakeven analysis. Theses where cost was a design constraint, not an afterthought.

### 7. The Edge Case Cascade
**Attack:** "Three unlikely things happen simultaneously: a database failover during a peak traffic spike while a third-party API is rate-limiting your requests. How does the system behave? Does it degrade gracefully or cascade into total failure?"
**What survives this:** Theses that design for partial failure — circuit breakers, graceful degradation, fallback behavior, queue-based decoupling, and explicit failure mode documentation.

### 8. The Backward Compatibility
**Attack:** "You ship v2 of the API. Can existing v1 clients continue operating without changes? For how long? What's the deprecation timeline? How do you communicate breaking changes? What happens to clients that miss the memo?"
**What survives this:** Theses with explicit versioning strategy — additive-only changes by default, deprecation windows, migration guides, backward-compatible schema evolution, and client notification mechanisms.

### 9. The Vendor Lock-In
**Attack:** "Your key dependency — Supabase, Vercel, OpenAI, Stripe — doubles its price, changes its terms of service, or disappears. How tightly coupled are you? What's the migration path? How long does it take and what breaks during the transition?"
**What survives this:** Theses that use abstractions at integration boundaries — repository patterns over direct ORM calls, provider interfaces over vendor SDKs, feature flags that can swap implementations. Not theses where vendor APIs are called directly from business logic.

### 10. The Regulatory Hammer
**Attack:** "A user exercises their GDPR Article 17 right to erasure. Can you delete all their data — including backups, logs, analytics events, and third-party integrations — within the required timeframe? Can you prove you did? Does this architecture even know where all the user's data lives?"
**What survives this:** Theses with a data map — every location where user data is stored, a deletion cascade that covers all of them, audit logging for compliance proof, and data classification that distinguishes PII from anonymous aggregates.

## Using This Framework

Experts are NOT required to test against all 10 challenges. They should identify which 2-3 are most relevant to the thesis under evaluation and test rigorously against those. Depth over breadth — a shallow pass through all 10 is less valuable than a deep investigation of the 3 most applicable challenges.

**Selection guidance:**
- Infrastructure/deployment theses: prioritize 1 (Scale), 3 (Midnight Page), 6 (Cost Bomb)
- Data architecture theses: prioritize 4 (Migration), 7 (Edge Cascade), 10 (Regulatory)
- API/integration theses: prioritize 5 (Security), 8 (Backward Compat), 9 (Vendor Lock-In)
- Full system theses: prioritize based on the highest-risk surface identified during expert selection
