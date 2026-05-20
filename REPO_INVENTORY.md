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
| ⚙️ **`caesar-scan.config.json`** | Config Template | Default template configuration file in project root. |
| 🚀 **`src/cli.mjs`** | CLI Entry Point | CLI controller coordinating scan runs and file writes. |
| ⚙️ **`src/config/default-scan-config.mjs`** | Default Settings | Standard built-in JS scanner configurations. |
| ⚙️ **`src/config/load-scan-config.mjs`** | Config Loader | Merges local settings files with defaults and overrides. |
| ⚙️ **`src/config/parse-caesarignore.mjs`** | Ignore Parser | Binds to root `.caesarignore` patterns parser. |
| 👣 **`src/scanner/file-walker.mjs`** | Filesystem Crawler | Traverses codebase files while excluding node_modules/git configurations. |
| 🔄 **`src/scanner/path-matcher.mjs`** | Glob Matcher | Performs pure glob-to-regex conversions and segments checking. |
| 🔄 **`src/scanner/scope-resolver.mjs`** | Scope Engine | Orchestrates traversals, mapping files into scan scopes. |
| 🔄 **`src/scanner/scan-runner.mjs`** | Scan Orchestrator | Coordinates parsing and matching logic across all four detectors. |
| 📖 **`src/rules/load-rules.mjs`** | Rules Loader | Helper resolving and parsing json rules databases safely. |
| 🛡️ **`src/detectors/dependency-detector.mjs`** | Dependency Parser | Parses package.json and requirements.txt for AI libraries. |
| 🔐 **`src/detectors/env-var-detector.mjs`** | Env Key Detector | Scans configurations for plain-text AI credentials with secret masking. |
| 📄 **`src/detectors/prompt-file-detector.mjs`** | Prompt Matcher | Matches prompt configuration files and paths. |
| 📊 **`src/detectors/vector-db-detector.mjs`** | Vector DB Matcher | Scans code file lines for high-dimensional DB imports and usages. |
| 📁 **`src/export/evidence-candidate-exporter.mjs`** | Evidence Exporter | Maps raw findings to CaesarEvidenceExportCandidate schemas. |
| 📝 **`src/report/markdown-report.mjs`** | Markdown Formatter | Generates formatted terminal reports with compliance guidance. |
| 📊 **`src/report/scope-report.mjs`** | Scope Report | Formats scope analysis into a premium dashboard markdown. |
| ⚙️ **`src/utils/read-json-safe.mjs`** | Safe JSON Reader | Zero-dependency file parser returning null on failure. |
| 🗃️ **`src/review/load-review-taxonomy.mjs`** | Taxonomy Loader | Safely resolves and parses taxonomy catalogs via relative ESM imports. |
| 🕵️‍♂️ **`src/review/evidence-gap-classifier.mjs`** | Gap Classifier | Assesses findings against compliance controls to log missing evidence elements. |
| 🎛️ **`src/review/review-workflow-builder.mjs`** | Review Orchestrator | Main controller orchestrating finding analysis, scoring, and workflow manifests. |
| 🧮 **`src/review/export-readiness-scorer.mjs`** | Scorer Engine | Computes candidate readiness scores, enforcing a strict 70% capping safety rule. |
| ❓ **`src/review/recommended-questions.mjs`** | Question Provider | Generates context-aware reviewer questions and actionable resolution tasks. |
| 📝 **`src/report/review-workflow-report.mjs`** | Review Formatter | Generates highly readable and premium Markdown compliance dashboards. |
| 🔐 **`src/export-pack/hash-artifact.mjs`** | SHA-256 Hasher | Pure cryptographic helper calculating deterministic hashes for package integrity. |
| 📋 **`src/export-pack/export-manifest-builder.mjs`** | Manifest Builder | Builds JSON manifest with record counts, safety checks, and secure SHA-256 hashes. |
| 📈 **`src/export-pack/import-readiness-builder.mjs`** | Readiness Assessor | Analyzes project gaps and scores readiness, locking automated ingestion. |
| 🕵️‍♂️ **`src/export-pack/human-review-checklist-builder.mjs`** | Checklist Builder | Generates lane checklists, required confirmations, and audit questions. |
| 🎛️ **`src/export-pack/export-pack-builder.mjs`** | Pack Coordinator | Master coordinating builder constructing the full index-level memory pack object. |
| 💾 **`src/export-pack/write-export-pack.mjs`** | Disk Writer | Recursively creates output folders and writes all 7 JSON files and Markdown report. |
| 📝 **`src/report/export-pack-report.mjs`** | Visual Pack Formatter | Formats visual Markdown `REVIEW_SUMMARY.md` compliance dashboard. |
| 💾 **`data/detection-rules.ai-usage.json`** | Rules Database | Clean-room regexes catalog matching AI usage components. |
| 🏷️ **`data/review-taxonomy.ai-governance.json`** | Lane Taxonomy | Defines standard governance review lanes and readiness statuses. |
| 📋 **`data/evidence-requirements.ai-usage.json`** | Requirement Maps | Maps specific AI detection signals to required compliance evidence types. |
| 💾 **`data/default-scan-config.json`** | Default Settings | JSON template containing core scanner outputs locations and options. |
| 📑 **`schemas/scan-result.schema.json`** | Ingest Schema | Draft schema for full scan result documents. |
| 📑 **`schemas/evidence-export-candidate.schema.json`** | Export Schema | Draft schema for reviewable evidence export candidates. |
| 📑 **`schemas/review-workflow.schema.json`** | Workflow Schema | Contract schema for the consolidated review workflow object. |
| 📑 **`schemas/evidence-gap.schema.json`** | Gap Schema | Contract schema for individual evidence gap payloads. |
| 📑 **`schemas/evidence-export-pack.schema.json`** | Pack Master Schema | Parent JSON schema for the entire offline compiled audit bundle. |
| 📑 **`schemas/export-manifest.schema.json`** | Manifest Schema | Verification schema tracking file hash checksums and safety flags. |
| 📑 **`schemas/import-readiness.schema.json`** | Readiness Schema | Evaluates feasibility, scoring metrics, and blockers for ingestion. |
| 📑 **`schemas/human-review-checklist.schema.json`** | Checklist Schema | Guides routing tasks, questions, and signature certifications. |
| 📑 **`schemas/scan-config.schema.json`** | Config Schema | Validates JSON scan settings files formats. |
| 📑 **`schemas/scan-scope.schema.json`** | Scope Schema | Validates scope resolutions output format properties. |
| 🛠️ **`scripts/check-syntax.mjs`** | Syntax Validator | Standalone checker running syntax validation offline. |
| 🧪 **`scripts/validate-samples.mjs`** | Validation Assertions | Automatic suite verifying scanner outcomes. |
| 🧪 **`scripts/validate-review-workflow.mjs`** | Review Validator | Suite asserting schema-compliance and mathematical rules for workflows. |
| 🧪 **`scripts/validate-export-pack.mjs`** | Pack Auditor | Verification script validating integrity, hashes, schemas, and policy boundaries. |
| 🧪 **`scripts/validate-scope-control.mjs`** | Scope Auditor | Asserts globbing translation engines and ignore directories policies. |
| 🧬 **`fixtures/sample-ai-project/`** | Fixture Directory | Harmless mock AI project used to test scanner functionalities. |
| 📊 **`docs/RESEARCH_CONTEXT.md`** | Domain Research | Ingests strategic requirements, user personas, and target scopes. |
| ⚖️ **`docs/DECISION_LOG.md`** | Decision Log | Records chronological technical, strategic, and governance decisions. |
| 📑 **`docs/EVIDENCE_EXPORT_CONTRACT.md`** | Ingestion Contract | Ingestion schemas and contract specifications. |
| 🔄 **`docs/TAXONOMY_AND_REVIEW_WORKFLOW.md`** | Review Taxonomy | Asset taxonomy structures and manual verification pipelines. |
| 🛡️ **`docs/THIRD_PARTY_CODE_AND_DATA_POLICY.md`** | License Terms | Zero-copy clean-room boundary definitions. |
| 📖 **`docs/REVIEW_WORKFLOW_AND_EVIDENCE_GAPS.md`** | Workflow Design | Explains conceptual routing architecture and workflow schemas. |
| 📚 **`docs/EVIDENCE_GAP_TAXONOMY.md`** | Gap Taxonomy | Specification cataloging all possible governance evidence gaps. |
| 📈 **`docs/EXPORT_READINESS_MODEL.md`** | Scoring Math | Details weights, penalties, and the 70% readiness capping rule. |
| 📦 **`docs/EVIDENCE_EXPORT_PACK.md`** | Export Pack Guide | Describes the design, structure, and usage of the offline Evidence Export Pack. |
| 📜 **`docs/GOVERNANCE_OS_INTEGRATION_CONTRACT.md`** | OS Contract | Specifications for importing export packages into Governance OS. |
| 🤝 **`docs/CAESAR_AI_EVIDENCE_HANDOFF.md`** | Handoff Contract | Specifies data model and mappings from scanner to caesar-ai-evidence. |
| 👣 **`docs/HUMAN_REVIEW_SIGNOFF_WORKFLOW.md`** | Sign-off Workflow | Manual sign-off procedures and verification checklist. |
| 📚 **`docs/SCAN_CONFIGURATION.md`** | Config Guide | Documents scan settings, merged priority sequence and parameters. |
| 📚 **`docs/CAESARIGNORE_REFERENCE.md`** | Ignore Guide | Explains .caesarignore syntax and glob rules. |
| 📚 **`docs/SCOPE_CONTROL_POLICY.md`** | Scope Guide | Details file categorization policies and directory tree crawlers. |
| 📚 **`docs/PUBLIC_DEPLOYMENT.md`** | Public Deployment | Architecture guide for public website. |
| 📚 **`docs/GITHUB_PAGES_DEPLOYMENT.md`** | Pages Deployment | Triggers and configurations for GitHub Pages deployment. |
| 📚 **`docs/PUBLIC_SITE_CONTENT_POLICY.md`** | Content Policy | Anonymization rules, no tracking, and static isolation constraints. |
| 🖥️ **`site/index.html`** | Public Dashboard Shell | Static SPA HTML layout presenting scan pipeline sample metrics. |
| 🎨 **`site/assets/site.css`** | Dashboard Stylesheet | Custom responsive dark Slate/Indigo theme vanilla CSS. |
| 🧠 **`site/assets/site.js`** | Dashboard Logic | Vanilla client-side JS fetching demo logs dynamically. |
| 🌐 **`site/CNAME`** | Domain Mapping | Tells GitHub Pages to route traffic from `ai-scan.caesar.no` to the site. |
| ⚙️ **`scripts/build-site.mjs`** | Site Generator | Builds public data assets and writes `site-build.json` metadata. |
| 🧪 **`scripts/validate-site.mjs`** | Site Auditor | Asserts no CDNs, tracking engines, or credentials exist in the bundle. |
| 🛠️ **`.github/workflows/deploy-pages.yml`** | Pages Pipeline | Official Actions workflow compiling and deploying the public site. |
| 📂 **`work-items/T001-evidence-export-candidate-pipeline/`** | T001 Sandbox | Sandboxed trackers containing T001 tasks, logs, and reports. |
| 📂 **`work-items/T002-review-workflow-evidence-gaps/`** | T002 Sandbox | Sandboxed trackers containing T002 tasks, logs, and reports. |
| 📂 **`work-items/T003-evidence-export-pack/`** | T003 Sandbox | Sandboxed trackers containing T003 tasks, decisions, logs, and reports. |
| 📂 **`work-items/T004-scan-configuration-scope-control/`** | T004 Sandbox | Sandboxed trackers containing T004 tasks, decisions, logs, validation logs, and implementation reports. |
| 📂 **`work-items/T005-public-pages-deployment/`** | T005 Sandbox | Sandboxed trackers containing T005 tasks, decisions, validation guidelines, and implementation reports. |

---

## 🛠️ Update Guidelines

When modifying this repository:
1. Ensure any new architectural specs or regex detectors are correctly documented inside `SPEC.md`.
2. Add any newly introduced folders or core file assets to this registry table.
3. Update `CHANGELOG.md` reflecting the appropriate semver version bump.
