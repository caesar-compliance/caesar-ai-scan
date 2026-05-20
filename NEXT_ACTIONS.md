# Next Actions — caesar-ai-scan

This document prioritizes upcoming development tasks and establishes execution boundaries for autonomous agents in the `caesar-ai-scan` repository.

---

## 🚦 Next Action Priorities

### 1. Prioritized Next Steps
*   **Implement `.caesarignore` Custom Configuration Parser:** Support user-defined glob and file ignore lists via local YAML or `.caesarignore` files.
*   **Develop AST Parser Extensions:** Integrate light AST parser trees for Javascript/TypeScript and Python codebases to track exact function calls and parameter models.
*   **Build Interactive HTML Reporter:** Export structured compliance analytics as single self-contained HTML dashboards.
*   **Create GitHub Action Integration:** Design a reusable GitHub Action workspace to automate scan pipeline execution during pull request gates.

### 2. Completed Milestones
*   **v0.2.0 Pipeline Foundation:** Implemented CLI engine, file walkers, detectors, evidence candidate exports, sample fixtures, and schema-validation testing.

---

## 🔒 Operational Boundaries & Disclaimer

> [!IMPORTANT]
> **Prototype Execution:**
> `caesar-ai-scan` is an offline static-analysis helper tool. It helps identify AI usage and codebase evidence gaps but does not guarantee legal compliance. All generated evidence candidates require human verification and manual approval before central Governance OS ingestion.
