# Architecture — caesar-ai-scan

This document outlines the high-level architecture, module layers, and data-flow pipelines for the `caesar-ai-scan` static-analysis tool as of version `0.2.0`.

---

## 🏗️ Structure Overview

`caesar-ai-scan` is structured into three clean, decoupled layers, written in pure ESM with zero external runtime dependencies:

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
│                     Output Formatter                    │
│   ┌──────────────────────────┬──────────────────────┐   │
│   │     Markdown Formatter   │  Evidence Exporter   │   │
│   │ (report/markdown-report) │ (export/evidence-ec) │   │
│   └──────────────────────────┴──────────────────────┘   │
└─────────────────────────────────────────────────────────┘
```

### 1. CLI Controller Layer (`src/cli.mjs`)
Entry point that ingests command-line arguments, validates targets, and coordinates write-streams for reports and candidates.

### 2. Detection Engine Layer (`src/scanner/scan-runner.mjs`)
Houses the crawler and detection modules:
- **File Walker (`src/scanner/file-walker.mjs`):** Recursively traverses the directory tree, applying strict exclusion lists (e.g. `.git`, `node_modules`).
- **Rule Loader (`src/rules/load-rules.mjs`):** Resolves and imports the JSON rules list from `data/detection-rules.ai-usage.json`.
- **Detectors (`src/detectors/*`):** Specialized static-analysis matching units checking manifest definitions, credentials, prompt templates, and active code imports.

### 3. Output Formatter Layer
Formats findings into developer-ready layouts:
- **Markdown Report (`src/report/markdown-report.mjs`):** Compiles visual summaries, tables, and compliance recommendation blocks.
- **Evidence Exporter (`src/export/evidence-candidate-exporter.mjs`):** Maps raw engine findings into standard `CaesarEvidenceExportCandidate` records.

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
[Markdown Report] <── (Formatters) <── [Raw Findings]
                                │
                                ▼
                   [Evidence Export Candidates JSON]
```

1. **Walking:** Filesystem crawler maps files, ignoring common package/build folders.
2. **Analysis:** The engine feeds each file through the four detectors, matching content against clean-room regex arrays.
3. **Synthesis:** Findings are consolidated and counts are summarized.
4. **Serialization:** Reports and candidates are printed to console or written to JSON targets.

---

## ⚖️ Disclaimer & Compliance Ingestion Boundary

> [!IMPORTANT]
> **Prototype Isolation:**
> This tool is an offline prototype scanner designed to discover codebase asset evidence.
> - **It does not guarantee legal compliance.**
> - **All exports are Candidates:** Every evidence export candidate starts as a `draft` and strictly requires developer/compliance human review and sign-off before official Governance OS ingestion.
