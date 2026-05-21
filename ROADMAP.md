# Development Roadmap — caesar-ai-scan

This document outlines the core developmental milestones and phases planned for the `caesar-ai-scan` static-analysis tool.

---

## 🚦 Project Phases

```
v0.1 Foundation ──> v0.2 Scanner [COMPLETE] ──> v0.3 Review [COMPLETE] ──> v0.4 Export Pack [COMPLETE] ──> v0.5 Scope Control [COMPLETE] ──> v0.6 Pages Deploy [COMPLETE] ──> v1.0 Stable
```

### Phase v0.1 — Repository Foundation
*   **Goal:** Establish clean repository layout, standards documentation, license parameters, and workspace registries.
*   **Status:** **Completed** (19 May 2026)
*   **Key Deliverables:**
    *   Shared Caesar ecosystem scaffolding (`PROJECT_STATE.md`, `NEXT_ACTIONS.md`, `docs/DECISION_LOG.md`).
    *   System specifications and module data-flow maps (`SPEC.md`, `ARCHITECTURE.md`).

### Phase v0.2 — Offline Scanner Prototype (v0.2.0)
*   **Goal:** Implement zero-dependency ESM CLI foundation, filesystem file-walker, clean-room AI rules database, four modular detectors, and evidence candidate exporter.
*   **Status:** **Completed** (20 May 2026)
*   **Key Deliverables:**
    *   CLI entry point supporting target input, formats (JSON/Markdown), and file exports.
    *   Walkers and rules-loader for clean-room catalogs.
    *   Dependency, Env Var, Prompt File, and Vector DB detectors.
    *   Verification assertions script (`validate-samples.mjs`).

### Phase v0.3 — Review Workflow & Evidence Gaps (v0.3.0)
*   **Goal:** Build corporate governance taxonomy rules, map codebase signals to cross-functional review lanes, classify missing evidence gaps, score export readiness, and output beautiful review reports.
*   **Status:** **Completed** (20 May 2026)
*   **Key Deliverables:**
    *   Taxonomy rules mapping codebase targets to domains (Security, Legal, Privacy, etc.).
    *   Categorized missing evidence requirements (blocking and non-blocking gaps).
    *   Deterministic Export Readiness Scorer (0-100%) with a strict 70% capping safety rule for blocking gaps.
    *   CLI integration supporting `--review-out <path>` and `--review-report <path>`.
    *   Programmatic validation script (`validate-review-workflow.mjs`).

### Phase v0.4 — Evidence Export Pack (v0.4.0)
*   **Goal:** Establish unified, standardized, relational export package containing full scanner run summaries, review workflows, checklists, checksums, and readiness metrics.
*   **Status:** **Completed** (20 May 2026)
*   **Key Deliverables:**
    *   Standardized draft contracts version `0.4.0` in `schemas/`.
    *   Unified `--export-pack <directory>` generator compiling 7 relational JSON logs.
    *   Programmatic validator `validate-export-pack.mjs` verifying schemas and checksum lists.

### Phase v0.5 — Scan Configuration & Scope Control (v0.5.0)
*   **Goal:** Add scan target configurations and clean scope controls through `.caesarignore` rules.
*   **Status:** **Completed** (20 May 2026)
*   **Key Deliverables:**
    *   Configurable JSON scanner criteria mappings (`caesar-scan.config.json`).
    *   Exclusion matching rules via `.caesarignore` ignoring vendor folders and test assets.
    *   Programmatic validator `validate-scope-control.mjs`.

### Phase v0.6 — Public Static Site & Pages Deployment (v0.6.0)
*   **Goal:** Build a clean self-contained public dashboard presentation showing off scanner sample metrics and deploy automatically via GitHub Pages.
*   **Status:** **Completed** (20 May 2026)
*   **Key Deliverables:**
    *   Client-side interactive demonstration website shell in `site/` with zero dynamic CDNs or tracker frameworks.
    *   Metadata build logs compiler `build-site.mjs` and anti-leak validator `validate-site.mjs`.
    *   Automated official GitHub Pages workflow `.github/workflows/deploy-pages.yml` deploying on push to `main` with CNAME `ai-scan.caesar.no`.

### Phase v1.0 — Stable Initial Release
*   **Goal:** Stable production-ready command line interface.
*   **Status:** **Planned**
*   **Key Deliverables:**
    *   Production binary compiler chains (Go or Rust execution).
    *   Central secure Webhook uploads to `caesar-ai-governance-os`.

---

## ⚖️ Disclaimer & Ingestion Boundary

> [!IMPORTANT]
> **Prototype Isolation:**
> This tool is an offline prototype scanner designed to discover codebase asset evidence.
> - **It identifies governance review needs, not final legal conclusions.**
> - **Findings are signals, not proof of non-compliance.**
> - **All exports are Candidates:** Every evidence export candidate starts as a `draft` and strictly requires developer/compliance human review and sign-off before official Governance OS ingestion. Status remains locked in `draft` with `review_required: true`.
> - **Simulated Presentation Site**: The public site deployed at `ai-scan.caesar.no` presents static mock data only. It does not perform live repo scanning or network integration.
> - **No live integrations:** No network calls, workspace scanning, pull request scanning, monitoring, or real database ingestion are included in this version.

- T006-A (v0.6.1): Monitoring Run Model Planning Pack (Completed)

- T006 (v0.7.0): Offline Scan History & Diff Model (Completed)

- T007 (v0.8.0): Public Site Demo History + Diff Presentation (Completed)

- T008 (v0.8.1): AI Scan Reference Lab + Competitor Implementation Matrix (Completed)

