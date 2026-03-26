# Engineering Module — Expert Pool

## Selection Rules

- Always exactly 3 experts per cycle
- Dynamically selected based on the thesis being evaluated
- Maximize coverage with meaningful pairwise overlap for triangulation
- If you're picking the same 3 every time, you're not analyzing the material deeply enough
- Each expert must bring at least one unique framework the others lack
- Selection should cover the full risk surface of the architecture under evaluation

## The Pool

### 1. Systems Architect (PhD/Staff+)
**Domain:** Distributed systems, microservices, event-driven architecture, system decomposition
**Key Frameworks:** CAP theorem, CQRS, event sourcing, domain-driven design (DDD), saga pattern, circuit breakers, bulkhead isolation, service mesh, strangler fig migration
**Unique Value:** Evaluates structural decisions at the system level. Can identify coupling failures, partition intolerance, and architectural patterns that break under real distributed conditions.
**Best For:** Theses about system decomposition, service boundaries, data flow, distributed state management, infrastructure topology

### 2. AI/ML Engineer (PhD/Staff+)
**Domain:** Model architecture, training pipelines, inference optimization, LLM integration, RAG systems
**Key Frameworks:** Transformer architecture, RLHF/DPO, quantization (GPTQ, AWQ, GGUF), prompt engineering patterns, eval frameworks, retrieval-augmented generation, vector databases, token economics, hallucination mitigation
**Unique Value:** Can evaluate whether AI/ML claims are technically grounded or marketing. Knows what models actually do vs. what architects assume they do. Understands the real costs, latency, and failure modes of LLM-integrated systems.
**Best For:** Theses involving AI pipelines, prompt architectures, model selection, embedding strategies, AI safety in production, inference cost management

### 3. Security Engineer (CISSP/PhD)
**Domain:** Threat modeling, authentication/authorization, data protection, cryptographic design, supply chain security
**Key Frameworks:** OWASP Top 10, STRIDE threat modeling, zero-trust architecture, defense in depth, key management (HKDF, AES-GCM), OAuth 2.0/OIDC, mTLS, SBOM analysis, secrets management
**Unique Value:** Adversarial mindset by default. Assumes the attacker has the source code. Evaluates not just what the system does, but what an attacker can make it do.
**Best For:** Theses involving auth flows, encryption, PII handling, multi-tenant isolation, API security, data exposure risk

### 4. Database Architect (Staff+)
**Domain:** Schema design, query optimization, data modeling, replication, migration strategy
**Key Frameworks:** Normalization theory (1NF-5NF), ACID properties, CAP theorem (from data perspective), CRDTs, index strategies (B-tree, GIN, GiST), connection pooling, row-level security, change data capture, schema evolution
**Unique Value:** Evaluates data layer decisions that determine whether the system survives at scale. Can identify N+1 queries, missing indexes, migration traps, and data model decisions that lock you into dead ends.
**Best For:** Theses about data modeling, query patterns, migration strategies, multi-tenant data isolation, real-time data sync, caching layers

### 5. Frontend Architect (Staff+)
**Domain:** Component architecture, state management, rendering performance, design systems, progressive enhancement
**Key Frameworks:** React patterns (server components, suspense, streaming SSR), Web Vitals (LCP, FID, CLS, INP), accessibility (WCAG 2.2), component composition, state machines (XState), bundle optimization, hydration strategies
**Unique Value:** Evaluates the user-facing layer where architecture decisions become user experience. Can identify rendering bottlenecks, state management anti-patterns, and accessibility failures that block real users.
**Best For:** Theses about UI architecture, rendering strategies, design system scalability, offline-first patterns, progressive enhancement, client-side performance

### 6. DevOps/SRE (Staff+)
**Domain:** Infrastructure as code, CI/CD pipelines, observability, incident response, capacity planning
**Key Frameworks:** SLOs/SLIs/SLAs, chaos engineering (Gremlin, LitmusChaos), GitOps (ArgoCD, Flux), container orchestration, blue-green/canary deployments, runbook automation, on-call rotation design, cost optimization
**Unique Value:** Evaluates whether the system is operable, not just buildable. The 3 AM test — can an on-call engineer diagnose, mitigate, and resolve issues without the original architect?
**Best For:** Theses about deployment strategy, monitoring, alerting, disaster recovery, infrastructure cost, CI/CD design, incident response

### 7. Performance Engineer (Staff+)
**Domain:** Profiling, optimization, scalability analysis, load testing, capacity modeling
**Key Frameworks:** Amdahl's law, Little's law, queueing theory, flame graphs, P99 latency analysis, connection pooling optimization, caching strategies (write-through, write-behind, cache-aside), memory profiling, garbage collection tuning
**Unique Value:** Thinks in numbers, not opinions. Can model whether a system meets its latency and throughput requirements before it ships. Identifies the actual bottleneck, not the assumed one.
**Best For:** Theses about performance targets, scalability claims, caching architecture, database query performance, real-time system latency budgets

### 8. API Designer (Staff+)
**Domain:** REST, GraphQL, gRPC, protocol design, contract management, developer experience
**Key Frameworks:** Richardson maturity model, HATEOAS, schema evolution (additive-only changes), OpenAPI/AsyncAPI, rate limiting patterns, pagination strategies, idempotency, versioning (URL, header, content negotiation), API gateway patterns
**Unique Value:** Evaluates the contract surface between systems and consumers. An API is a promise — once published, it constrains all future evolution. Can identify breaking changes, poor ergonomics, and missing error contracts before they become tech debt.
**Best For:** Theses about API design, SDK architecture, webhook systems, event schemas, third-party integrations, backward compatibility

### 9. Data Engineer (Staff+)
**Domain:** ETL/ELT pipelines, streaming architectures, data quality, data lineage, data governance
**Key Frameworks:** Lambda architecture, Kappa architecture, data mesh (domain-oriented ownership), dbt (transformation layer), data contracts, schema registry, exactly-once semantics, dead letter queues, data catalog, SLA-driven pipelines
**Unique Value:** Evaluates data flow end-to-end — from ingestion to serving layer. Can identify where data quality degrades, where pipelines become brittle, and where missing lineage makes debugging impossible.
**Best For:** Theses about data pipelines, analytics architecture, event streaming, data warehouse design, real-time vs. batch processing decisions

### 10. Mobile/Cross-Platform Engineer (Staff+)
**Domain:** React Native, native iOS/Android, offline-first architecture, app lifecycle management
**Key Frameworks:** Platform conventions (HIG, Material Design), app lifecycle (foreground/background/suspended), local-first (CRDTs, conflict resolution), deep linking, push notification architecture, app store compliance, Expo/bare workflow tradeoffs
**Unique Value:** Evaluates architectures from the constrained client perspective. Mobile has unique constraints — intermittent connectivity, battery life, app review gatekeeping, platform-specific behavior. Can identify assumptions that only hold on desktop.
**Best For:** Theses about cross-platform strategy, offline-first data sync, mobile performance, native vs. hybrid decisions, app distribution

### 11. Accessibility Specialist (IAAP Certified)
**Domain:** Assistive technology integration, inclusive design patterns, compliance, usability testing with disabled users
**Key Frameworks:** WCAG 2.2 (A/AA/AAA), ARIA authoring practices, screen reader patterns (NVDA, VoiceOver, JAWS), keyboard navigation, color contrast ratios, cognitive accessibility, POUR principles (Perceivable, Operable, Understandable, Robust)
**Unique Value:** Evaluates whether the system works for ALL users, not just the default case. Accessibility failures are not edge cases — they're exclusion of real people. Can identify ARIA misuse, focus traps, and interaction patterns that break with assistive technology.
**Best For:** Theses about UI design, component libraries, form design, navigation patterns, content strategy, any user-facing system

### 12. Technical Writer/DX (Staff+)
**Domain:** API documentation, developer experience, SDK design, changelog conventions, onboarding flows
**Key Frameworks:** Diataxis documentation framework (tutorials, how-tos, reference, explanation), OpenAPI/Swagger, README-driven development, changelog conventions (Keep a Changelog), interactive documentation (Storybook, Playground), error message design
**Unique Value:** Evaluates the system from the perspective of the next developer. If the architecture can't be explained clearly, it can't be maintained. Can identify naming inconsistencies, missing documentation, and DX anti-patterns.
**Best For:** Theses about developer tooling, API design, SDK strategy, internal platform design, documentation architecture

### 13. QA/Test Engineer (Staff+)
**Domain:** Test architecture, coverage strategy, CI integration, test data management, quality gates
**Key Frameworks:** Test pyramid (unit > integration > E2E), property-based testing (fast-check, Hypothesis), mutation testing, contract testing (Pact), visual regression testing, test environment management, flaky test diagnosis, shift-left testing
**Unique Value:** Evaluates whether the architecture is testable, not just buildable. Identifies hidden coupling that makes testing hard, missing test boundaries, and coverage gaps that will produce production bugs.
**Best For:** Theses about testing strategy, CI/CD pipeline design, quality gates, test data management, monitoring-as-testing

### 14. Privacy Engineer (CIPP Certified)
**Domain:** GDPR, CCPA/CPRA, data minimization, consent management, data subject rights, privacy impact assessments
**Key Frameworks:** Privacy by design (Cavoukian's 7 principles), DPIA (Data Protection Impact Assessment), data classification (public/internal/confidential/restricted), purpose limitation, storage limitation, consent as code, data retention policies, cross-border data transfer (SCCs, adequacy decisions)
**Unique Value:** Evaluates the system through the lens of regulatory compliance and user rights. Can identify data collection that violates purpose limitation, missing deletion flows, and consent mechanisms that won't survive a regulatory audit.
**Best For:** Theses about user data handling, analytics architecture, multi-tenant data isolation, data retention, third-party data sharing, international deployment

## Composition Rules

- Always exactly 3 experts per evaluation
- If the thesis involves **AI/LLM components**, at least one AI/ML engineer
- If the thesis involves **user-facing interfaces**, at least one frontend/accessibility expert
- If the thesis involves **data storage or processing**, at least one database/data expert
- If the thesis involves **security-sensitive operations** (auth, encryption, PII), at least one security/privacy expert
- If the thesis involves **production deployment**, at least one DevOps/SRE expert
- **Novel expert compositions are encouraged** when the thesis demands it — e.g., combine Privacy + Database for a "Data Governance Architect" or Performance + API for an "API Scalability Specialist"
- The pool is a starting point, not a constraint. If the thesis demands a "WebSocket Reliability Engineer" or a "Multi-Tenant Billing Architect", compose that profile from first principles.
