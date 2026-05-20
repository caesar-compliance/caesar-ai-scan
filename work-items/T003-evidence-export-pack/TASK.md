# Task List: T003 — Evidence Export Pack

This document tracks the completed development tasks for implementing the self-contained evidence export pack.

---

## 📋 Task Status

- [x] **Task 1: Version Bumps to `0.4.0`**
  - [x] Bump `package.json` version.
  - [x] Update existing master schemas (`scan-result`, `review-workflow`) to `0.4.0` constraints.
- [x] **Task 2: Schema Contracts Design**
  - [x] Create parent index schema `schemas/evidence-export-pack.schema.json`.
  - [x] Create manifest schema `schemas/export-manifest.schema.json`.
  - [x] Create feasibility schema `schemas/import-readiness.schema.json`.
  - [x] Create checklist schema `schemas/human-review-checklist.schema.json`.
- [x] **Task 3: Hashing & Cryptographic Verification**
  - [x] Implement deterministic standard SHA-256 hash helper in `src/export-pack/hash-artifact.mjs`.
- [x] **Task 4: Export Pack Builders**
  - [x] Implement `src/export-pack/export-manifest-builder.mjs`.
  - [x] Implement `src/export-pack/import-readiness-builder.mjs`.
  - [x] Implement `src/export-pack/human-review-checklist-builder.mjs`.
  - [x] Implement parent coordinator `src/export-pack/export-pack-builder.mjs`.
- [x] **Task 5: Report & Disk Operations**
  - [x] Create auditor report template engine `src/report/export-pack-report.mjs` generating `REVIEW_SUMMARY.md`.
  - [x] Implement recursive disk file writer `src/export-pack/write-export-pack.mjs`.
- [x] **Task 6: CLI & Script Integration**
  - [x] Support `--export-pack <directory>` parameter in `src/cli.mjs`.
  - [x] Register npm scripts (`pack:sample`, `validate:pack`, `check:all-offline`) in `package.json`.
- [x] **Task 7: Automated Validation**
  - [x] Implement programmatic assertion checks in `scripts/validate-export-pack.mjs`.
  - [x] Enforce Policy A (Draft Hardlock), Policy B (Ingestion Isolation), and Policy C (Credential Exposed).
- [x] **Task 8: Documentation & Merge Closeout**
  - [x] Update conceptual guides and integration contracts.
  - [x] Perform clean branch merge onto `main` branch.
