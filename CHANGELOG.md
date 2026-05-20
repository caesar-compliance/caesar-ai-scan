# Changelog

All notable changes to the Caesar AI Scan project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [0.3.0] - 20 May 2026

### Added
- **AI Governance Review Taxonomy:** Created `data/review-taxonomy.ai-governance.json` and `data/evidence-requirements.ai-usage.json` specifying governance review lanes and evidence gaps.
- **Review Workflow Schemas:** Added standard validation schemas `schemas/review-workflow.schema.json` and `schemas/evidence-gap.schema.json`.
- **Evidence Gap Classifier:** Built zero-dependency classification engine `src/review/evidence-gap-classifier.mjs` mapping raw scan findings to missing evidence structures and reviewer context.
- **Auditor Recommendations:** Implemented dynamic questions and actions catalog `src/review/recommended-questions.mjs` to guide human code-reviewers and security auditors.
- **Deterministic Readiness Scorer:** Developed analytical readiness scoring `src/review/export-readiness-scorer.mjs` incorporating a strict 70% capping rule when blocking evidence gaps are unresolved.
- **Integrated Exporter Enrichment:** Extended `src/export/evidence-candidate-exporter.mjs` to automatically enrich exported evidence candidates with readiness scores, gap profiles, and review lanes while preserving draft isolation.
- **Enhanced CLI interface:** Updated `src/cli.mjs` with `--review-out <path>` and `--review-report <path>` parameters.
- **Premium Markdown Reporting:** Added `src/report/review-workflow-report.mjs` to generate visual, GitHub-alert-friendly review dashboards.
- **Programmatic Validation Engine:** Created robust assertion suite `scripts/validate-review-workflow.mjs` to verify pipeline behavior, schema compliance, and draft bounds.

## [0.2.0] - 20 May 2026

### Added
- **ESM Node.js CLI Foundation:** Created zero-dependency CLI manager (`src/cli.mjs`) accepting scan targets, formatting flags, and output destinations.
- **Recursive File Walker:** Implemented filesystem walker (`src/scanner/file-walker.mjs`) filtering out standard system/package noise (e.g. `node_modules`, `.git`).
- **Clean-room AI Signal Rules Database:** Established rules database (`data/detection-rules.ai-usage.json`) capturing patterns for AI SDKs, frameworks, credentials, prompt files, and vector engines.
- **Four Modular Detectors:**
  - `dependency-detector.mjs`: Parses `package.json` and `requirements.txt`.
  - `env-var-detector.mjs`: Scans environment configuration templates and files line-by-line with secure secret masking.
  - `prompt-file-detector.mjs`: Identifies dedicated prompt template extensions and paths.
  - `vector-db-detector.mjs`: Matches active imports and code connections to high-dimensional databases in source files.
- **Evidence Candidate Exporter:** Implemented pipeline exporter (`src/export/evidence-candidate-exporter.mjs`) compiling raw findings to standard `CaesarEvidenceExportCandidate` schemas.
- **High-fidelity Markdown Reporting:** Integrated visual reporter (`src/report/markdown-report.mjs`) generating tables, metadata cards, and review recommendations.
- **JSON Schemas:** Added schema validation contracts under `schemas/scan-result.schema.json` and `schemas/evidence-export-candidate.schema.json`.
- **Validation Suite:** Implemented automatic verification suite (`scripts/validate-samples.mjs`) enforcing schema metrics.
- **Ecosystem Guidelines:** Created guidelines for evidence contracts, taxonomy review workflows, and licensing policies under `docs/`.

---

## [0.1.0] - 19 May 2026

### Added
- **Initialized professional repository foundation:** Established the core directory layout, strategic specifications, and architecture maps aligning the codebase with parent standards.
- **System Specifications:** Created [SPEC.md](SPEC.md) detailing inputs, outputs, non-goals, and CLI boundaries.
- **Architectural Scaffolding:** Added [ARCHITECTURE.md](ARCHITECTURE.md) outlining detection layers and data pipeline flows.
- **Milestones Plan:** Created [ROADMAP.md](ROADMAP.md) plotting the roadmap toward stable release.
- **Workspace Inventory:** Added [REPO_INVENTORY.md](REPO_INVENTORY.md) cataloging tracked file roles.
- **Ecosystem Context Beacons:** Integrated [PROJECT_STATE.md](PROJECT_STATE.md), [NEXT_ACTIONS.md](NEXT_ACTIONS.md), and [docs/DECISION_LOG.md](docs/DECISION_LOG.md) to facilitate agent alignment.
