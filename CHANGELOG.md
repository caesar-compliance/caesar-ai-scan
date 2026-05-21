# Changelog

All notable changes to the Caesar AI Scan project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [Unreleased] - Repository presentation polish (20 May 2026)

### Changed

- README: concise product-facing layout, v0.7.0 status, offline/history/diff boundaries.
- `PROJECT_STATE.md`: version and phase aligned to v0.7.0 / T006.
- GitHub repository About: description, homepage `https://ai-scan.caesar.no`, topics.

### Added

- `docs/REPOSITORY_PRESENTATION_POLISH.md`
- `work-items/repository-presentation-polish/TASK.md`

---

## [0.9.0] - 21 May 2026
- **T009 — Rule Pack v1 / AI Framework Detection Expansion.**
- Expanded detection rules to cover 40+ AI framework, provider SDK, RAG/Vector stack, and ML signals.
- Added Rule Pack v1 metadata (category, confidence, governance relevance, etc.) to all findings.
- Implemented `ml-artifact-detector` for AI model file identification.
- Implemented local path sanitization in all generated outputs to prevent leaking host system information (e.g., `/Users/` paths).
- Added `fixtures/sample-ai-frameworks-project/` representing a modern agentic AI stack.
- Added `scripts/validate-rule-pack-v1.mjs`.

## [0.8.1] - 21 May 2026
- **T008 — AI Scan Reference Lab + Competitor Implementation Matrix.**
- Established local Reference Lab at `../_reference-lab/scan` with shallow clones of 20 approved open-source repositories.
- Added AI Scan reference lab policy, open-source audit, scanner feature matrix, and roadmap mapping.
- Added Big Player Product Benchmarks documentation for major proprietary platforms.

## [0.8.0] - 21 May 2026
- **T007 — Public Site Demo History + Diff Presentation.** Expose safe sample/demo scan history and diff information on public static site.
- Fix scan diff accounting correctness.
- Added safe public demo history and diff presentation files.
- Improved site validation for data safety.

## [0.7.0] - 20 May 2026
### Added
- Offline local scan history model (T006).
- schemas/scan-run.schema.json, scan-history-index.schema.json, scan-diff.schema.json.
- src/history/scan-history-writer.mjs, scan-history-reader.mjs, scan-diff-builder.mjs.
- src/report/scan-diff-report.mjs.
- scripts/validate-scan-history.mjs.
- CLI flags: --history-dir, --record-history, --diff-previous, --history-report.
- npm scripts: history:sample, validate:history.
- docs/OFFLINE_SCAN_HISTORY_USAGE.md, docs/SCAN_DIFF_MODEL.md.

## [0.6.1] - T006-A Monitoring Run Model Planning Pack
### Added
- Created offline scan history models and planning docs (T006-A).

## [0.6.0] - 20 May 2026

### Added
- **Public Static Site + GitHub Pages Deployment (T005 / v0.6.0):** Created a public static site in `site/` with full architectural deployment configs for GitHub Pages at `https://ai-scan.caesar.no/`, built-in site builders, programmatic site validators, and deployed artifact CNAME mapping.

## [0.5.0] - 20 May 2026

### Added
- **Scan Configuration & Scope Control (T004 / v0.5.0):** Zero-dependency `.caesarignore` custom glob ignore matching engine, ancestor segment path validation, local scanner parameters overrides, config JSON schemas, and programmatic scope validations.

## [0.4.0] - 20 May 2026

### Added
- **Evidence Export Pack (T003 / v0.4.0):** Compiles and packages scan results, evidence candidate drafts, review workflows, import readiness, checklist, and manifest into a self-contained offline evidence export pack directory.
- **Export Pack Parent Schema (`schemas/evidence-export-pack.schema.json`):** Master parent index document governing the offline bundle structure.
- **Manifest Integrity Schema (`schemas/export-manifest.schema.json`):** Cryptographic verification schema tracking individual file SHA-256 hashes and safety statuses.
- **Import Readiness Schema (`schemas/import-readiness.schema.json`):** Feasibility schema evaluating scores, blockers, triggered lanes, and next steps.
- **Human Review Checklist Schema (`schemas/human-review-checklist.schema.json`):** Explicit routing schema compiling lanes, required confirmations, questions, and signature flags.
- **Pure Cryptographic Hash Builder (`src/export-pack/hash-artifact.mjs`):** Built-in SHA-256 helper ensuring hash determinism by standardizing indentation on disk JSON files.
- **Sub-builders and Coordinated Pack Builder (`src/export-pack/export-pack-builder.mjs`):** Modular code framework constructing parent and nested objects.
- **Recursive Folder & File Writer (`src/export-pack/write-export-pack.mjs`):** Disk manager writing all 7 JSON files and the Markdown reviewer report.
- **Visual Auditor Report Generator (`src/report/export-pack-report.mjs`):** Produces premium compliance dashboard `REVIEW_SUMMARY.md` showing metadata, blockers list, and auditor sign-off checklist.
- **Extended CLI parser:** Updated `src/cli.mjs` to support `--export-pack <directory>` argument.
- **End-to-End Pack Audit Script (`scripts/validate-export-pack.mjs`):** Comprehensive validation asserting schema versioning, file presence, hash consistency, draft isolation bounds, automated import block, and credential exposures.

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
