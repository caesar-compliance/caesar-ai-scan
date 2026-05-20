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
