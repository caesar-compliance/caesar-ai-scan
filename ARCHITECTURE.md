# Architecture — caesar-ai-scan

This document outlines the high-level architecture, module layers, and data-flow pipelines for the `caesar-ai-scan` static-analysis tool as of version `0.3.0`.

---

## 🏗️ Structure Overview

`caesar-ai-scan` is structured into clean, decoupled layers, written in pure ESM with zero external runtime dependencies:

```
┌─────────────────────────────────────────────────────────┐
│                    CLI Controller                       │
│                   (src/cli.mjs)                         │
└──────────────────────────┬──────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Detection Engine                     │
│                (src/scanner/scan-runner.mjs)            │
│  ┌───────────────────────────┬───────────────────────┐  │
│  │    Dependency Matcher     │   API Key Detector    │  │
│  │ (dependency-detector.mjs) │ (env-var-detector.mjs)│  │
│  ├───────────────────────────┼───────────────────────┤  │
│  │    Prompt File Matcher    │   Vector DB Detector  │  │
│  │(prompt-file-detector.mjs) │(vector-db-detector.mjs)  │
│  └───────────────────────────┴───────────────────────┘  │
└──────────────────────────┬──────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────┐
│               Review Compliance Engine                  │
│                (src/review/builder.mjs)                 │
│  ┌───────────────────────────┬───────────────────────┐  │
│  │     Taxonomy Loader       │     Gap Classifier    │  │
│  │(load-review-taxonomy.mjs) │(gap-classifier.mjs)   │  │
│  ├───────────────────────────┼───────────────────────┤  │
│  │     Readiness Scorer      │  Questions Generator  │  │
│  │ (export-readiness-scorer) │(recommended-questions)│  │
│  └───────────────────────────┴───────────────────────┘  │
└──────────────────────────┬──────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────┐
│                     Output Formatter                    │
│   ┌──────────────────────────┬──────────────────────┐   │
│   │     Markdown Formatter   │  Evidence Exporter   │   │
│   │ (report/markdown-report) │ (export/evidence-ec) │   │
│   ├──────────────────────────┼──────────────────────┤   │
│   │   Review Report Formatter│                      │   │
│   │ (report/review-report)   │                      │   │
│   └──────────────────────────┴──────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 1. CLI Controller Layer (`src/cli.mjs`)
Entry point that ingests command-line arguments, validates targets, and coordinates write-streams for reports, candidates, review workflows, and reports.

### 2. Detection Engine Layer (`src/scanner/scan-runner.mjs`)
Houses the crawler and detection modules:
- **File Walker (`src/scanner/file-walker.mjs`):** Recursively traverses the directory tree, applying strict exclusion lists (e.g. `.git`, `node_modules`).
- **Rule Loader (`src/rules/load-rules.mjs`):** Resolves and imports the JSON rules list from `data/detection-rules.ai-usage.json`.
- **Detectors (`src/detectors/*`):** Specialized static-analysis matching units checking manifest definitions, credentials, prompt templates, and active code imports.

### 3. Review Compliance Engine Layer (`src/review/*`)
Processes scan findings against corporate policy specifications:
- **Taxonomy Loader (`src/review/load-review-taxonomy.mjs`):** Loads review lanes and evidence requirements from the `data/` directory.
- **Gap Classifier (`src/review/evidence-gap-classifier.mjs`):** Associates codebase signals to outstanding evidence requirements (e.g. missing owner, missing terms).
- **Questions & Actions (`src/review/recommended-questions.mjs`):** Generates targeted queries and mitigation steps for developers and reviewers.
- **Readiness Scorer (`src/review/export-readiness-scorer.mjs`):** Deterministically evaluates completeness (0-100%) and applies a strict 70% capping safety rule if blocking gaps remain.
- **Workflow Builder (`src/review/review-workflow-builder.mjs`):** Synthesizes the master compliance workflow containing all review items and executive summaries.

### 4. Output Formatter Layer
Formats findings into developer-ready layouts:
- **Markdown Report (`src/report/markdown-report.mjs`):** Compiles visual summaries, tables, and compliance recommendation blocks.
- **Review Report (`src/report/review-workflow-report.mjs`):** Compiles visual summaries of review lanes, evidence gaps, detailed reviews, and recommended actions.
- **Evidence Exporter (`src/export/evidence-candidate-exporter.mjs`):** Maps raw engine findings and compliance review items into standard `CaesarEvidenceExportCandidate` records.

---

## 🔄 Data Flow

The operational life cycle of a single scan run proceeds as follows:

```
[Target Codebase] ──> (File Walker) ──> [File Queue]
                                           │
                                           ▼
                                ┌───────────────────────┐
                                │   Detection Engine    │
                                └───────────┬───────────┘
                                            │
                                            ▼
                                     [Raw Findings]
                                            │
                                            ▼
                                ┌───────────────────────┐
                                │    Review Engine      │
                                └───────────┬───────────┘
                                            │
                                            ▼
                              [Compliance Review Items]
                                            │
               ┌────────────────────────────┼────────────────────────────┐
               ▼                            ▼                            ▼
      [Markdown Reports]            [Review JSONs]           [Candidates JSONs]
```

1. **Walking:** Filesystem crawler maps files, ignoring common package/build folders.
2. **Analysis:** The engine feeds each file through detectors matching clean-room regex arrays to yield raw findings.
3. **Compliance Reviewing:** Raw findings are passed through the review compliance engine to assign review lanes, classify evidence gaps, generate reviewer questions, and compute readiness scores.
4. **Synthesis:** Findings and review items are consolidated, generating summaries.
5. **Serialization:** Reports and candidates are printed to console or written to JSON/markdown targets.

---

## ⚖️ Disclaimer & Compliance Ingestion Boundary

> [!IMPORTANT]
> **Prototype Isolation:**
> This tool is an offline prototype scanner designed to discover codebase asset evidence.
> - **It identifies governance review needs, not final legal conclusions.**
> - **Findings are signals, not proof of non-compliance.**
> - **All exports are Candidates:** Every evidence export candidate starts as a `draft` and strictly requires developer/compliance human review and sign-off before official Governance OS ingestion. Status is locked with `review_required: true`.
> - **No live integrations:** No network calls, GitHub Actions, deployment, monitoring, or real database ingestion are included in this offline prototype.

