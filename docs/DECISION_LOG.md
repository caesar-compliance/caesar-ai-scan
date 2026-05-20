# Decision Log — caesar-ai-scan

This document maps all high-level technical, strategic, and governance decisions made for the `caesar-ai-scan` repository.

---

## 🏛️ Decision History

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
