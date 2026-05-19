# Development Roadmap — caesar-ai-scan

This document outlines the core developmental milestones and phases planned for the `caesar-ai-scan` static-analysis tool.

---

## 🚦 Project Phases

```
v0.1 Foundation ──> v0.2 CLI Draft ──> v0.3 Detection Rules ──> v0.4 Reporting ──> v1.0 Stable
```

### Phase v0.1 — Repository Foundation
*   **Goal:** Establish clean repository layout, standards documentation, license parameters, and workspace registries.
*   **Status:** **Active / Complete** (19 May 2026)
*   **Key Deliverables:**
    *   Shared Caesar ecosystem scaffolding (`PROJECT_STATE.md`, `NEXT_ACTIONS.md`, `docs/DECISION_LOG.md`).
    *   System specifications and module data-flow maps (`SPEC.md`, `ARCHITECTURE.md`).

### Phase v0.2 — First Functional CLI Draft
*   **Goal:** Construct the CLI wrapper, basic filesystem scanner framework, and configuration parser.
*   **Status:** Planned
*   **Key Deliverables:**
    *   CLI entry point supporting target directory inputs.
    *   Configuration reader for custom exclusions list (`.caesarignore`).
    *   Basic stdout table output.

### Phase v0.3 — Detection Rules & Validation
*   **Goal:** Build dependency database, regex credential checkers, and sample code validations.
*   **Status:** Planned
*   **Key Deliverables:**
    *   Dependency parser matching `package.json` and `requirements.txt` against 50+ known AI libraries.
    *   Plaintext API key entropy checker rules.
    *   Output exporter mapped to `caesar-ai-evidence` formats.

### Phase v0.4 — CI/CD Integration & Reporting
*   **Goal:** Establish pre-built actions and deep reporting formats.
*   **Status:** Planned
*   **Key Deliverables:**
    *   Off-the-shelf GitHub Action runner.
    *   Self-contained HTML interactive audit report.

### Phase v1.0 — Stable Initial Release
*   **Goal:** Stable production-ready command line interface.
*   **Status:** Planned
*   **Key Deliverables:**
    *   Production binary compiler chains (Rust/Go execution).
    *   Central secure Webhook uploads to `caesar-ai-governance-os`.
