# Development Roadmap — caesar-ai-scan

This document outlines the core developmental milestones and phases planned for the `caesar-ai-scan` static-analysis tool.

---

## 🚦 Project Phases

```
v0.1 Foundation ──> v0.2 Scanner [COMPLETE] ──> v0.3 Review Workflow [COMPLETE] ──> v0.4 CI/CD & HTML ──> v1.0 Stable
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

### Phase v0.4 — CI/CD Integration & HTML Reporting
*   **Goal:** Establish pre-built GitHub actions, ignore-configs, and rich interactive visual reports.
*   **Status:** **Planned**
*   **Key Deliverables:**
    *   Off-the-shelf GitHub Action runner.
    *   Custom exclusion config `.caesarignore`.
    *   Self-contained interactive HTML audit report dashboard.

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
> - **No live integrations:** No network calls, GitHub Actions, deployment, monitoring, or real database ingestion are included in this offline prototype.

