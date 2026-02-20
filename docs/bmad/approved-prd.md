# Approved PRD

- Cycle ID: 77324a5d-2cb3-441f-b4a6-1f0a81d9be76
- Published at: 2026-02-20T08:37:19.378Z
- BMAD cycle version: 0.4.0
- Goal: Approved: Prioritize Chromedriver-based testing device over simulation for Step-shot
- Project: Step-shot
- Product: Step-shot
- PRD title: Setup already the chromedriver to be used as a device for testing. It will be prioritize and not the simulation
- PRD version: 0.3.0

## BMADC Agent Prompt Versions

| Agent | Prompt version |
| --- | --- |
| B | 0.2.10 |
| M | 0.2.0 |
| A | 0.2.0 |
| D | 0.2.0 |
| C | 0.2.0 |

## Peter Prompt Version

- P: Unversioned

## PRD Content

## 1. Understanding
- Restate the product idea or request
  Prioritize and solidify the use of Chromedriver (Chrome/WebDriver) as the primary execution device for StepShot’s Selenium-based testing flow, while maintaining the existing dual-path MVP (real WebDriver path + deterministic simulation) as a fallback. The MVP UI should remain focused on loading JSON-formatted Selenium command scripts and executing them against a target web app, but with real browser automation as the default path and improved observability around mode, readiness, and artifacts.

- Identify what problem we are solving
  - Replace the current in-memory, simulated runner with a real WebDriver-backed path to improve test fidelity, reliability, and debuggability.
  - Increase transparency around whether tests are running in driver mode or simulation mode, and surface per-step evidence (screenshots, timing, errors) throughout execution.
  - Provide durable test artifacts (per-step and final reports) that are easily exportable and auditable for releases and compliance.

- Identify who we are solving it for
  - QA Automation Engineers who author and maintain Selenium-based tests (Alex).
  - Frontend/Full-stack Developers validating UI changes and integration points (Priya).
  - Release/DevOps Engineers ensuring reproducible, auditable test runs in CI/CD and production-like environments (Lee).

## 2. Clarifying Questions
Before finalizing the PRD, please provide answers to the critical uncertainties that will shape the PRD details.

- What is the exact, published JSON schema for Selenium commands? Which actions, waits, assertions, and selectors are supported, and how are selectors expressed (CSS, XPath, etc.)? [HIGH]
- How many browsers and run modes are required? Is Chrome/Chromium the sole driver, and should Firefox (and perhaps headless vs headed) be supported as options? [HIGH]
- How should credentials and secrets be handled in tests? Embedded in scripts, or retrieved from a secrets manager with rotation policies? [MEDIUM]
- How will local Next.js apps be prepared for testing? Auto-launch, port mapping, or manual URL entry with readiness checks? [MEDIUM]
- Are there intended CI/CD integrations, scheduling, or webhooks for run orchestration? [LOW]
- What reporting customization or branding is required for HTML/JSON reports (logo, theme, metadata, export formats)? [LOW]
- How should flaky steps be handled (retry policies, timeouts, halt-on-first-failure vs continue per config)? [MEDIUM]
- How should RBAC be modeled (roles, per-run access, audit logs)? [MEDIUM]
- Data retention policies for artifacts (storage location, retention period, backups)? [LOW]

## 3. PRD Draft

### 1. Product Overview
- Vision: StepShot becomes a cohesive UI-driven platform (Next.js + TypeScript + Tailwind) that loads JSON-formatted Selenium command scripts and executes them using real browser automation (Chromedriver/Chrome by default), with a deterministic simulation fallback. It provides per-step evidence, live run visibility, and exportable HTML/JSON reports, while preserving a dual-path MVP for environments where the WebDriver path is temporarily unavailable.
- Objective: Enable production-like, end-to-end UI testing for Next.js apps with real browser automation as the default path, complemented by a robust editor, live monitoring, and artifacts that support release validation and compliance.

### 2. Problem Statement
- User Pain Points:
  - Tests run against an in-memory simulation rather than real browsers, reducing fidelity and debuggability.
  - Limited per-step visibility (screenshots, timings, errors) during runs.
  - Friction in authoring, running, and exporting test artifacts and reports.
  - Fragmented tooling for scripting, execution, and artifact delivery.
- Business Motivation: Improve test fidelity and observability, accelerate feedback to developers, increase reproducibility of test runs, and provide auditable artifacts for releases and compliance.

### 3. Target Users & Personas
- Persona 1
  - Name: Alex the QA Engineer
  - Description: Automation engineer responsible for UI test coverage of Next.js apps.
  - Characteristics: Proficient with Selenium; expects an integrated UI for authoring, running, and reporting.
  - Goals: Author tests quickly, run against deployed or local apps, obtain per-step evidence, export reports.
  - Pain Points: Fragmented tooling, opaque failures, manual reporting steps.
- Persona 2
  - Name: Priya the Frontend Developer
  - Description: Developer validating UI changes via automated checks.
  - Characteristics: Comfortable with JSON-like configurations; seeks fast feedback.
  - Goals: Integrate automated checks into local dev workflow; understand failures with artifacts.
  - Pain Points: Test maintenance burden; unclear failure context.
- Persona 3
  - Name: Lee the Release Engineer
  - Description: Ensures consistency of test runs in CI/CD and artifact delivery.
  - Characteristics: Focused on reliability, access control, and auditability.
  - Goals: Run scripts reproducibly in controlled environments; access per-run artifacts for reviews.
  - Pain Points: Inconsistent test environments; slow access to artifacts.

### 4. Goals & Success Metrics
- Business Goals:
  - Increase automated UI test coverage within defined release cycles.
  - Reduce time to execute and triage UI test runs; provide actionable artifacts quickly.
  - Provide auditable, per-step evidence for compliance and QA traceability.
- User Outcomes:
  - Users can author/edit/run JSON-formatted Selenium scripts in a single UI.
  - Users can monitor live run progress with per-step status, duration, and errors.
  - Users can generate and download per-step and final HTML/JSON reports and artifacts.
- KPIs:
  - Time to author a new script: TBD
  - Average per-run duration: TBD
  - Per-step pass/fail rates: TBD
  - Artifact download frequency per run: TBD
  - User satisfaction with UI and reporting: TBD

### 5. Features & Requirements

| Priority | User Story | Acceptance Criteria | Dependencies |
|----------|-----------|---------------------|--------------|
| MUST | As a QA Engineer, I want to create/edit JSON-formatted Selenium scripts in a dedicated editor so that I can author tests reliably. | - Editor validates JSON against the defined schema on save<br>- Editor provides syntax highlighting and basic validation hints<br>- Saving creates or updates a script with versioning support | None |
| MUST | As a user, I want to run a script against a target app (URL or locally running Next.js app) via Selenium WebDriver so that steps execute in sequence. | - Runner connects to target via WebDriver with configured capabilities<br>- Each step executes in order; subsequent steps wait for prior success unless configured otherwise<br>- If a step fails, the run records the error and halts or continues per config | WebDriver environment; target accessible URL or local app setup |
| MUST | As a user, I want per-step screenshots, status, duration, and errors captured and visible during the run. | - Each step captures a screenshot after execution or on failure<br>- Step row shows status (pass/fail/skipped), duration, and error details if any<br>- Live progress pane updates in real-time | Runner UI front-end; backend run progress stream |
| MUST | As a user, I want per-step and final HTML/JSON reports with artifacts (screenshots, logs) downloadable after a run. | - Reports include per-step data: actions, selectors, duration, status, and errors<br>- Screenshots and logs are included as downloadable artifacts<br>- HTML and JSON report formats are available for both per-step and final results | Report generation service; artifact storage |
| MUST | As a user, I want a clean UI to manage scripts (CRUD), with search, filters, and versioning. | - Create, edit, delete, duplicate scripts; search and filter by name, status, tags<br>- Version history and rollback options<br>- Import/Export of scripts | Script storage backend |
| SHOULD | As a user, I want to run scripts against both external web apps and locally running Next.js apps via configurable targets. | - Configuration supports target URL or local app flag and local port if required<br>- Runner uses appropriate WebDriver configuration for the target | WebDriver environment; local app readiness |
| SHOULD | As an admin, I want basic user management and access control for script runs and artifacts. | - Roles (e.g., Admin, Editor, Viewer) enforced in UI<br>- Run access and artifact access controlled per user | Authentication/Authorization layer |
| NICE-TO-HAVE | As a user, I want scheduling and/or queueing of runs in CI-like fashion and API access for automation. | - Queue or schedule runs; API endpoints to start runs and fetch results | API surface; job queue system |

### 6. Constraints & Assumptions

| Type | Category | Description | Risk |
|------|----------|-------------|------|
| Constraint | Technical | WebDriver-backed execution; supports JSON-formatted Selenium commands; Chrome/Firefox | Dependency on stable WebDriver capabilities and browser drivers; cross-browser considerations |
| Constraint | Operational | Runs may target external apps or locally running Next.js apps; environments must provide accessible endpoints or local app readiness | Network/firewall issues; local environment setup complexity |
| Constraint | Security | Tests may include credentials/secrets; need secure handling, storage, and access control | Secret leakage risk if not properly managed |
| Assumption | Business | Script repository supports multi-user collaboration with versioning | Data consistency and merge conflicts management |
| Assumption | Data | JSON command scripts conform to a defined schema and can be extended in the future | Schema drift risk; need deprecation plan |

### 7. Out of Scope
- Deep integration with non-Selenium-based testing tools unless expressed via StepShot JSON schema.
- Non-UI functional tests not expressible via Selenium commands.
- Native desktop app testing (web-focused scope).
- Advanced AI-assisted test generation or self-healing capabilities (initial MVP remains explicit-Selenium-based).
- Full end-to-end CI pipeline orchestration beyond exposing run APIs and artifacts.

### 8. Open Questions
Items requiring future clarification:
- [HIGH] What is the exact, published JSON schema for Selenium commands? Which actions and waits must be supported, and how are selectors expressed (CSS, XPath, etc.)?
- [HIGH] How many browsers and run modes are required (e.g., Chrome/Chromium, Firefox; headless vs headed)?
- [MEDIUM] How should credentials be handled in tests (embedded vs linked to a secrets manager; scope/rotation)?
- [MEDIUM] How will local Next.js apps be prepared for testing (auto-launch, port mapping, or manual URL entry)?
- [LOW] Are there CI/CD integrations or webhooks required for run events?
- [LOW] What reporting customization/branding requirements exist for HTML/JSON reports (logo, theme, metadata)?
- [MEDIUM] How to handle flaky steps (retry, timeouts, and failure modes)?
- [MEDIUM] How should RBAC be modeled (roles, per-run access, audit logs)?
- [LOW] Data retention policies for artifacts (storage location, retention period, backups)?

### 9. Version & Approval History
The table is system-managed from authoritative \`prd_versions\` records.
Do not manually write or append table rows in PRD content.

### 10. Version Impact
- Recommended bump: minor
- Rationale: This update shifts the MVP toward a real WebDriver-backed Chrome-driven path with enhanced observability and artifact capabilities while preserving the dual-path approach, signifying a meaningful expansion of scope without redefining the product category.

## 4. Next Steps
- [ ] Review PRD with stakeholders
- [ ] Resolve open questions
- [ ] Obtain approval
- [ ] Hand off to Builder Ben for BMAD cycle

---

Versioning context
Current PRD version: v0.2.0

Note: This PRD continues the baseline and introduces the Chrome WebDriver-backed path as the prioritized execution device, while retaining the dual-path MVP for fallback scenarios. All implementation details remain to be decided in follow-ups during the BMAD cycle.