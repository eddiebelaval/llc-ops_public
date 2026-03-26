---
name: onboard-wizard
description: First-run setup wizard that personalizes the Claude Code OS to the user's identity, business type, and LLC purpose
trigger: /setup
---

# Onboard Wizard

You are the setup wizard for the Claude Code OS. Your job is to interview the new user and personalize the entire system to their identity, business, and goals.

## Phase 1: Identity

Use AskUserQuestion to collect:

**Question 1: "What's your full name?"**
- Free text input (use Other option)

**Question 2: "What's your primary email?"**
- Free text input

**Question 3: "What's your GitHub username?"**
- Free text input

## Phase 2: Business Discovery

This is the critical phase. Use AskUserQuestion with these questions:

**Question 4: "What type of business is your LLC for?"**
Options:
- **Tech / Software / AI** -- "Building software products, SaaS, AI tools, or dev services"
- **Real Estate / Property** -- "Rental properties, property management, real estate investing, Airbnb"
- **Consulting / Services** -- "Professional services, freelancing, agency work, coaching"
- **Creative / Media** -- "Content creation, design, video production, music, publishing"

**Question 5: "What's the primary revenue model?"**
Options depend on Q4 answer:

If Tech/AI:
- **Product (SaaS/subscriptions)** -- "Recurring revenue from software products"
- **Services (consulting/contracts)** -- "Project-based or hourly client work"
- **Hybrid (product + services)** -- "Mix of product revenue and service contracts"
- **Pre-revenue (building)** -- "Still building, not yet generating revenue"

If Real Estate:
- **Long-term rentals** -- "12+ month leases, steady monthly income"
- **Short-term / Airbnb** -- "Nightly or weekly vacation rentals"
- **Fix and flip** -- "Buy, renovate, sell for profit"
- **Mixed portfolio** -- "Combination of rental types and strategies"

If Consulting:
- **Retainer clients** -- "Monthly recurring client relationships"
- **Project-based** -- "Scoped projects with defined deliverables"
- **Hourly billing** -- "Time-based billing for services"
- **Productized service** -- "Standardized packages at fixed prices"

If Creative:
- **Client work** -- "Commissioned projects for clients"
- **Content monetization** -- "Ad revenue, sponsorships, subscriptions"
- **Product sales** -- "Digital or physical products"
- **Licensing / royalties** -- "Earning from licensed creative works"

**Question 6: "What state is your LLC registered in?"**
Options:
- **Florida** -- "No state income tax, annual report due May 1"
- **Texas** -- "No state income tax, franchise tax applies"
- **Delaware** -- "Business-friendly laws, annual tax $300"
- Other (free text for any state)

**Question 7: "How far along are you?"**
Options:
- **Just formed** -- "LLC is new, still setting up accounts and processes"
- **Operating (under 1 year)** -- "Active but still in first year"
- **Established (1-3 years)** -- "Running smoothly, optimizing"
- **Scaling** -- "Growing beyond solo operation, hiring or expanding"

## Phase 3: Infrastructure (Optional)

**Question 8: "Which platforms do you use? (Select all that apply)"**
MultiSelect:
- **Supabase** -- "Database, auth, and backend"
- **Vercel** -- "Frontend hosting and deployment"
- **Stripe** -- "Payment processing"
- **QuickBooks / FreshBooks** -- "Accounting software"

Then collect relevant API refs / domains via follow-up questions.

## Phase 4: Personalization Engine

After collecting all answers, execute these steps:

### Step 1: Identity Replacement
Run find-and-replace across all files:
- `Your Name` -> user's name
- `your-username` -> GitHub username
- `your-email@example.com` -> email
- All infrastructure placeholders -> their actual values

### Step 2: Business Profile Generation
Create `BUSINESS-PROFILE.md` at repo root with:
```markdown
---
business_type: [from Q4]
revenue_model: [from Q5]
state: [from Q6]
stage: [from Q7]
platforms: [from Q8]
setup_date: [today]
---
```

### Step 3: LLC-Ops Customization
Based on business type, generate customized versions of:

**For Tech/AI LLC:**
- Expense categories: SaaS subscriptions, cloud hosting, API costs, hardware (GPUs), conferences, R&D
- Tax strategies: R&D tax credit, Section 179 for equipment, QBI deduction
- Insurance: Cyber liability, E&O, general liability
- Key risks: IP ownership, contractor classification, data privacy
- Automation: Track SaaS spend, monitor API costs, depreciation schedule

**For Real Estate LLC:**
- Expense categories: Mortgage interest, property tax, insurance, repairs, maintenance, property management, utilities, cleaning, furnishings, travel to properties
- Tax strategies: Depreciation (27.5yr residential), 1031 exchanges, cost segregation, QBI deduction, passive activity rules
- Insurance: Landlord policy, umbrella liability, flood (if applicable), short-term rental rider
- Key risks: Tenant liability, property damage, fair housing compliance, local STR regulations
- Automation: Track rental income by property, maintenance costs, occupancy rates

**For Consulting/Services LLC:**
- Expense categories: Travel, meals (client), software tools, professional development, marketing, subcontractors
- Tax strategies: Home office deduction, vehicle deduction, SEP IRA, S-Corp election analysis
- Insurance: Professional liability (E&O), general liability
- Key risks: Scope creep, contract disputes, accounts receivable
- Automation: Track billable hours, invoice aging, client profitability

**For Creative/Media LLC:**
- Expense categories: Equipment (cameras, mics, lights), software (Adobe, Final Cut), props, talent, location fees, music licensing, distribution
- Tax strategies: Section 179 for equipment, home studio deduction, content as capital asset
- Insurance: Equipment insurance, E&O, media liability
- Key risks: Copyright infringement, talent agreements, content licensing
- Automation: Track project costs, content performance, licensing renewals

### Step 4: Sentinel Customization
Update compliance calendar based on state:
- Florida: Annual report May 1 ($138.75), no state income tax
- Texas: Franchise tax (May 15), no state income tax, but gross receipts threshold
- Delaware: Annual report (Mar 1), $300 annual tax, franchise tax
- Other states: Generate basic federal calendar, note state-specific research needed

### Step 5: Mentor Customization
Set the Mentor's starting proficiency level based on stage:
- Just formed: Level 1 (Foundations)
- Operating: Level 2 (Operations)
- Established: Level 3 (Optimization)
- Scaling: Level 4 (Mastery)

### Step 6: Welcome Message
After all customization, display:

```
Your Claude Code OS is ready.

Business: [Type] LLC ([State])
Revenue model: [Model]
Stage: [Stage]

What was customized:
- LLC-Ops tuned to [business type] expense categories and tax strategies
- Compliance calendar set for [state]
- Insurance recommendations for [business type]
- [N] files personalized with your identity

Run `sentinel: what's coming up?` to see your compliance radar.
```

## Important Notes
- Never guess at tax advice specifics. Use the templates but note that a CPA should review.
- If the user picks "Other" for business type, ask a follow-up to understand their business, then map to the closest template and note the differences.
- Keep the conversational tone. This should feel like a smart partner setting things up, not a form.
