# Decision Log — caesar-ai-scan

This document maps all high-level technical, strategic, and governance decisions made for the `caesar-ai-scan` repository.

---

## 🏛️ Decision History

### [DEC-005] — 20 May 2026 — Public Static Site & GitHub Pages Deployment

*   **Status:** Approved
*   **Decisions:**
    1. **Zero Dynamic CDNs, External Fonts, or Analytics**: Decided to build the presentation dashboard in `site/` as a pure client-side SPA loaded with simulated mock scan datasets, using local assets only. This upholds high privacy standards and works under offline/air-gapped bounds.
    2. **Anti-Leak Security Validation**: Added a security script (`scripts/validate-site.mjs`) to verify CNAME values, validate linked files, and programmatically prevent any secrets, tracking scripts, or dynamic external API references from leaking into the deployed static bundle.
    3. **Official GitHub Actions Pages Deployment**: Configured `.github/workflows/deploy-pages.yml` with official Pages actions to automatically execute the full offline validation pipeline and deploy verified build targets on commits to `main`.
*   **Rationale:** Establishes a highly secure, reliable, and professional public demonstration layer for Caesar AI Scan without introducing dynamic ingestion risks, analytics trackers, or third-party dependency leaks.

### [DEC-004] — 20 May 2026 — Scope Control & Scan Configuration

*   **Status:** Approved
*   **Decisions:**
    1. **Custom Target Rule Configurations**: Implemented `caesar-scan.config.json` file parsing to support customizable target patterns and custom rule scopes.
    2. **Glob-based .caesarignore Exclusions**: Designed a robust `.caesarignore` parser supporting standard gitignore-style glob and directory pattern exclusions to isolate scanning pipelines from test fixtures, vendor modules, and development logs.
*   **Rationale:** Provides precise traversal controls for scanning pipelines, reducing false positives and improving scan quality on real-world repositories.

### [DEC-003] — 20 May 2026 — Review Workflow & Evidence Gap Classification

*   **Status:** Approved
*   **Decisions:**
    1. **Taxonomy Separation:** Established separate static catalogs for review taxonomy configurations (`data/review-taxonomy.ai-governance.json`) and specific codebase governance requirements (`data/evidence-requirements.ai-usage.json`).
    2. **Multi-lane Review Assignment:** Designed a system to map findings to one or more review lanes (Technical Owner, Security, Legal, Privacy, etc.) dynamically based on matched signature context.
    3. **Deterministic Readiness Math & Strict 70% Capping Safety Rule:** Formulated a transparent export readiness scorer subtracting penalties for missing evidence, with an iron-clad capping rule at 70% if any "blocking" evidence requirements remain unresolved.
    4. **Enriched Candidate Schema Compatibility:** Designed candidate exporter updates to dynamically inject review lanes, gap IDs, and readiness scores while strictly retaining backwards compatibility and keeping all candidate statuses hard-locked to `draft` and `review_required: true`.
*   **Rationale:** Establishes a highly granular, context-aware auditing workflow offline that ensures developers and security reviewers have an actionable checklist of governance gaps before candidates are pushed upstream.

### [DEC-002] — 20 May 2026 — Zero-Dependency ESM Architecture & Candidate Pipeline

*   **Status:** Approved
*   **Decisions:**
    1. **Runtime Isolation:** Decided to write the scanning CLI in pure ESM Javascript using exclusively Node.js core libraries (e.g. `fs`, `path`, `crypto`).
    2. **Strict Matching rules:** Defined clean-room regular expressions targeting 17 core package names, 6 secret environments, and prompt files, avoiding external dependencies or commercial API scanners.
    3. **Evidence Isolation:** Enforced that all automated findings must emit as "Candidates" requiring manual human developer and security expert review, preserving human oversight and blocking blind automated ingestion.
*   **Rationale:** Guarantees absolute offline safety, avoids external registry dependencies, preserves performance, and conforms perfectly to the licensing and governance principles of the Caesar compliance ecosystem.

### [DEC-001] — 19 May 2026 — Repository Standardization & Governance

*   **Status:** Approved
*   **Decisions:**
    1. **Ecosystem Standards Alignment:** Resolved that this repository will strictly follow the standards, layouts, and style guides defined in the central [Caesar AI Governance Hub](https://github.com/caesar-compliance/caesar-ai-governance-hub).
    2. **Execution Framework:** Established that Artem and ChatGPT act as the planning/review Control Tower (high-level design and approval), while AI coding agents serve as the executors (implementation and validation).
    3. **Competitor Code Policy:** Adopted a strict policy that no restricted competitor code or proprietary structures may be copied into this codebase. All designs must be built from original specifications or open-source community standards.
*   **Rationale:** Maintains structural coherence across all Caesar AI tools, preserves legal safety, and establishes a highly disciplined workflow for agent-driven development.

## DECISION-T006A: Offline Scan History Planning
**Date:** 2026-05-20
**Context:** Need a way to track deltas between static scan runs without requiring a database.
**Decision:** Store historical scan results locally in `.caesar/history/` and build diffing tools in T006.

## DECISION-T006: Stable Diff Key Strategy
**Date:** 2026-05-20
**Context:** Finding IDs are random per scan run, making naive ID comparison useless for diffing.
**Decision:** Derive a stable MD5 hash key from category + detector + rule_id + matched_name + file_path.

## DECISION-T007: Safe Public Demo History and Diff
**Date:** 2026-05-21
**Context:** Need to demonstrate history/diff features on public site without exposing real data.
**Decision:** Export anonymized sample history summary and latest diff to static JSON files in `site/data/` for public presentation.

## DECISION-T008: AI Scan Reference Lab Establishment
**Date:** 2026-05-21
**Context:** Need a structured way to study existing scanners and governance tools.
**Decision:** Establish a local Reference Lab at `../_reference-lab/scan` containing shallow clones of approved open-source repositories. Define strict usage policies to prevent code leakage into production.

## DECISION-T009: Rule Pack v1 Implementation
**Date:** 2026-05-21
**Context:** Need to expand scanner coverage for the modern AI framework and ML stack.
**Decision:** Implemented **Rule Pack v1** covering 6 major AI detection categories (Provider SDKs, Orchestration Frameworks, RAG/Vector Stack, ML Artifacts, Prompt Assets, Config Signals). Mandated Rule Pack v1 metadata for all findings. Implemented local path sanitization in all generated outputs to prevent leaking host system information.

## DECISION-T019: Cloudflare Worker API Boundary
**Date:** 2026-05-21
**Context:** Prepare hosted read-only API delivery without deploying Workers or connecting to live backends.
**Decision:** T019 defines a Cloudflare Worker API boundary and local Worker route mock contract for future hosted read-only API delivery while intentionally avoiding Worker deployment, Wrangler publish, Cloudflare API calls, live Supabase connections, database writes, deployment, scheduler, GitHub Actions scanner mode, PR annotations, SARIF, real customer ingestion, external fetching, secrets, account emails, account IDs, real Worker URLs, and real project refs in tracked files.

## DECISION-T020: Supabase Migration Rehearsal Pack
**Date:** 2026-05-21
**Context:** Rehearse future Supabase/Postgres setup safely after T018 schema draft.
**Decision:** T020 introduces a local-only Supabase/Postgres migration rehearsal pack and SQL safety validator to prepare future backend setup while intentionally avoiding live Supabase connections, applied migrations, database writes, deployment, scheduler, GitHub Actions scanner mode, PR annotations, SARIF, real customer ingestion, external fetching, secrets, account emails, real project refs, active Supabase config, and Cloudflare deployment config in tracked files.
