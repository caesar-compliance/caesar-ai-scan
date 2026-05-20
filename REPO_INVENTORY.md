# Repository Inventory — caesar-ai-scan

This is a living registry of all files currently tracked in the `caesar-ai-scan` repository. It provides developers and automated agents with a reference mapping each file to its exact role in the codebase structure.

---

## 📂 File Directory

| File Path | Primary Role | Description |
| :--- | :--- | :--- |
| 🛡️ **`README.md`** | Main Introduction | Summarizes the project vision, functional workflows, target audience, ecosystem alignment, and legal disclaimers. |
| 📋 **`SPEC.md`** | Technical Specification | Defines core MVP scope, inputs, outputs, non-goals, and CLI boundaries. |
| 🏗️ **`ARCHITECTURE.md`** | System Architecture | Visualizes codebase modular layers, data-flow pipelines, and integration structures. |
| 🚦 **`ROADMAP.md`** | Project Roadmap | Lists development phases transitioning the scanning CLI from planning stages through stable release. |
| 📝 **`CHANGELOG.md`** | Historical Log | Contains a semver-compliant, chronological history of all updates and releases. |
| 🗃️ **`REPO_INVENTORY.md`** | Workspace Registry | This file; provides a continuous, machine-readable index mapping files to functional roles. |
| 🚦 **`PROJECT_STATE.md`** | Project State | Tracks active developmental phase, metadata, boundaries, active tasks, and milestones. |
| 🤖 **`NEXT_ACTIONS.md`** | Next Actions | Prioritizes upcoming tasks and establishes boundaries for autonomous agent executions. |
| 📦 **`package.json`** | Dependencies & Scripts | Node.js ESM configuration with pipeline scan scripts. |
| 🚀 **`src/cli.mjs`** | CLI Entry Point | CLI controller coordinating scan runs and file writes. |
| 👣 **`src/scanner/file-walker.mjs`** | Filesystem Crawler | Traverses codebase files while excluding node_modules/git configurations. |
| 🔄 **`src/scanner/scan-runner.mjs`** | Scan Orchestrator | Coordinates parsing and matching logic across all four detectors. |
| 📖 **`src/rules/load-rules.mjs`** | Rules Loader | Helper resolving and parsing json rules databases safely. |
| 🛡️ **`src/detectors/dependency-detector.mjs`** | Dependency Parser | Parses package.json and requirements.txt for AI libraries. |
| 🔐 **`src/detectors/env-var-detector.mjs`** | Env Key Detector | Scans configurations for plain-text AI credentials with secret masking. |
| 📄 **`src/detectors/prompt-file-detector.mjs`** | Prompt Matcher | Matches prompt configuration files and paths. |
| 📊 **`src/detectors/vector-db-detector.mjs`** | Vector DB Matcher | Scans code file lines for high-dimensional DB imports and usages. |
| 📁 **`src/export/evidence-candidate-exporter.mjs`** | Evidence Exporter | Maps raw findings to CaesarEvidenceExportCandidate schemas. |
| 📝 **`src/report/markdown-report.mjs`** | Markdown Formatter | Generates formatted terminal reports with compliance guidance. |
| ⚙️ **`src/utils/read-json-safe.mjs`** | Safe JSON Reader | Zero-dependency file parser returning null on failure. |
| 🗃️ **`src/review/load-review-taxonomy.mjs`** | Taxonomy Loader | Safely resolves and parses taxonomy catalogs via relative ESM imports. |
| 🕵️‍♂️ **`src/review/evidence-gap-classifier.mjs`** | Gap Classifier | Assesses findings against compliance controls to log missing evidence elements. |
| 🎛️ **`src/review/review-workflow-builder.mjs`** | Review Orchestrator | Main controller orchestrating finding analysis, scoring, and workflow manifests. |
| 🧮 **`src/review/export-readiness-scorer.mjs`** | Scorer Engine | Computes candidate readiness scores, enforcing a strict 70% capping safety rule. |
| ❓ **`src/review/recommended-questions.mjs`** | Question Provider | Generates context-aware reviewer questions and actionable resolution tasks. |
| 📝 **`src/report/review-workflow-report.mjs`** | Review Formatter | Generates highly readable and premium Markdown compliance dashboards. |
| 💾 **`data/detection-rules.ai-usage.json`** | Rules Database | Clean-room regexes catalog matching AI usage components. |
| 🏷️ **`data/review-taxonomy.ai-governance.json`** | Lane Taxonomy | Defines standard governance review lanes and readiness statuses. |
| 📋 **`data/evidence-requirements.ai-usage.json`** | Requirement Maps | Maps specific AI detection signals to required compliance evidence types. |
| 📑 **`schemas/scan-result.schema.json`** | Ingest Schema | Draft schema for full scan result documents. |
| 📑 **`schemas/evidence-export-candidate.schema.json`** | Export Schema | Draft schema for reviewable evidence export candidates. |
| 📑 **`schemas/review-workflow.schema.json`** | Workflow Schema | Contract schema for the consolidated review workflow object. |
| 📑 **`schemas/evidence-gap.schema.json`** | Gap Schema | Contract schema for individual evidence gap payloads. |
| 🛠️ **`scripts/check-syntax.mjs`** | Syntax Validator | Standalone checker running syntax validation offline. |
| 🧪 **`scripts/validate-samples.mjs`** | Validation Assertions | Automatic suite verifying scanner outcomes. |
| 🧪 **`scripts/validate-review-workflow.mjs`** | Review Validator | Suite asserting schema-compliance and mathematical rules for workflows. |
| 🧬 **`fixtures/sample-ai-project/`** | Fixture Directory | Harmless mock AI project used to test scanner functionalities. |
| 📊 **`docs/RESEARCH_CONTEXT.md`** | Domain Research | Ingests strategic requirements, user personas, and target scopes. |
| ⚖️ **`docs/DECISION_LOG.md`** | Decision Log | Records chronological technical, strategic, and governance decisions. |
| 📑 **`docs/EVIDENCE_EXPORT_CONTRACT.md`** | Ingestion Contract | Ingestion schemas and contract specifications. |
| 🔄 **`docs/TAXONOMY_AND_REVIEW_WORKFLOW.md`** | Review Taxonomy | Asset taxonomy structures and manual verification pipelines. |
| 🛡️ **`docs/THIRD_PARTY_CODE_AND_DATA_POLICY.md`** | License Terms | Zero-copy clean-room boundary definitions. |
| 📖 **`docs/REVIEW_WORKFLOW_AND_EVIDENCE_GAPS.md`** | Workflow Design | Explains conceptual routing architecture and workflow schemas. |
| 📚 **`docs/EVIDENCE_GAP_TAXONOMY.md`** | Gap Taxonomy | Specification cataloging all possible governance evidence gaps. |
| 📈 **`docs/EXPORT_READINESS_MODEL.md`** | Scoring Math | Details weights, penalties, and the 70% readiness capping rule. |
| 📂 **`work-items/T001-evidence-export-candidate-pipeline/`** | T001 Sandbox | Sandboxed trackers containing T001 tasks, logs, and reports. |
| 📂 **`work-items/T002-review-workflow-evidence-gaps/`** | T002 Sandbox | Sandboxed trackers containing T002 tasks, logs, and reports. |

---

## 🛠️ Update Guidelines

When modifying this repository:
1. Ensure any new architectural specs or regex detectors are correctly documented inside `SPEC.md`.
2. Add any newly introduced folders or core file assets to this registry table.
3. Update `CHANGELOG.md` reflecting the appropriate semver version bump.
