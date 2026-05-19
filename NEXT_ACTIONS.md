# Next Actions — caesar-ai-scan

This document prioritizes upcoming development tasks and establishes execution boundaries for autonomous agents in the `caesar-ai-scan` repository.

---

## 🚦 Execution Boundaries

### 1. Prioritized Next Steps
*   **Define Scanner Detection Rules:** Define the specific catalog of regexes and packages that match AI dependencies in source code.
*   **Define Repository Scan Output Model:** Define the JSON outputs format that maps cleanly to the `evidence-item` schema.

### 2. Safe Autonomous Tasks
*   Adding comments and documentation files inside the planned codebase.
*   Improving code formatting and compliance with the `standards/` style guides.
*   Preparing test repositories or mock directories for scanner verification tests.

### 3. Tasks Requiring Control Tower (Artem / ChatGPT) Approval
*   Implementing active scanning parser logic or third-party dependencies.
*   Modifying public command interfaces, flags, or configuration YAML fields.
*   Refactoring code execution boundaries or database catalogs.

### 4. Blocked Tasks
*   None.

### 5. Cross-Repository Coordination Notes
*   Ensure that any generated scanner output models map perfectly to the Draft 2020-12 schemas in `caesar-ai-evidence` and resolve any schema drift immediately.
