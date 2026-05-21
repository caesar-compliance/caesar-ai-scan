# Next Actions — caesar-ai-scan

This document prioritizes upcoming development tasks and establishes execution boundaries for autonomous agents in the `caesar-ai-scan` repository.

---

## 🚦 Next Action Priorities

### 1. Prioritized Next Steps
*   **Dynamic CI Gates and PR Annotations (v0.7.0):** Implement inline code annotation reports for GitHub Pull Request screens using SARIF/GitHub Check Runs integrations.
*   **Develop AST Parser Extensions:** Integrate light AST parser trees for Javascript/TypeScript and Python codebases to track exact function calls and parameter models.
*   **Establish Governance OS Active Webhook Connector:** Create a secure authentication handoff module to upload signed evidence packs directly to the Caesar Governance OS endpoint when explicitly authorized by an auditor.

### 2. Completed Milestones
*   **v0.6.0 Public Static Site & Pages Deployment:** Built a client-side dynamic compliance dashboard in `site/` with zero external CDNs or tracker packages, verified by a strict security validator script, and deployed automatically via GitHub Pages workflow with CNAME `ai-scan.caesar.no`.
*   **v0.5.0 Scan Configuration & Scope Control:** Added `caesar-scan.config.json` filters and robust `.caesarignore` glob-matching exclusion engine to isolate analysis from test and vendor paths.
*   **v0.4.0 Evidence Export Pack:** Standardized 7 relational JSON contracts and implemented CLI `--export-pack` to write self-contained auditor packages verified by cryptographic manifests.
*   **v0.3.0 Review Workflow + Evidence Gaps:** Built the review lanes mapping, classified evidence gaps, implemented export readiness scoring with safety caps, and registered CLI flags (`--review-out`, `--review-report`).
*   **v0.2.0 Pipeline Foundation:** Implemented CLI engine, file walkers, detectors, evidence candidate exports, sample fixtures, and schema-validation testing.

---

## 🔒 Operational Boundaries & Disclaimer

> [!IMPORTANT]
> **Prototype Execution:**
> `caesar-ai-scan` is an offline static-analysis helper tool. It helps identify AI usage and codebase evidence gaps but does not guarantee legal compliance. Findings are signals, not proof of non-compliance. All generated evidence candidates require manual human verification and approval before central Governance OS ingestion. Status remains locked in `draft` with `review_required: true`. No active workspace scanning of user code or dynamic ingestion is supported. The deployed public site at `ai-scan.caesar.no` represents a static sandbox mockup using simulated mock assets only. No actual user code is ever parsed online.


- [x] T006: Offline Scan History & Diff Model
- [x] T007: Public Site Demo History + Diff Presentation (v0.8.0)
- [x] T008: AI Scan Reference Lab + Competitor Implementation Matrix (v0.8.1)
- [x] T009: Rule Pack v1 / AI Framework Detection Expansion (v0.9.0)
- [x] T010: AI-BOM / AI Usage Inventory Export (v0.10.0)
- [x] T011: Backend-ready scan export bundle (v0.11.0)
- [x] T012: Controlled offline import dry-run (v0.12.0)
- [x] T013: Backend adapter contract + local JSON store (v0.13.0)
- [x] T014: Read-only API projection + dashboard data contract (v0.14.0)
- [x] T015: Static dashboard over API projection (v0.15.0)
- [x] T016: Local read-only API server prototype (v0.16.0)
- [x] T017: Backend runtime readiness boundary (v0.17.0)
- [x] T018: Supabase storage schema draft + import mapping (v0.18.0)
- [x] T019: Cloudflare Worker API boundary + local mock (v0.19.0)
- [x] T020: Supabase local migration rehearsal pack + SQL safety validator (v0.20.0)
