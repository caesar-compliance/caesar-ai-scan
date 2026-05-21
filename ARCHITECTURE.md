# Architecture — caesar-ai-scan

This document outlines the high-level architecture, module layers, and data-flow pipelines for the `caesar-ai-scan` static-analysis tool as of version `0.20.0`.

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
│              Output Formatter & Packaging               │
│  ┌───────────────────────────┬───────────────────────┐  │
│  │    Markdown Formatter     │   Evidence Exporter   │  │
│  │ (report/markdown-report)  │ (export/evidence-ec)  │  │
│  ├───────────────────────────┼───────────────────────┤  │
│  │    Review Formatter       │   Export Pack Writer  │  │
│  │ (report/review-report)    │ (export/pack-writer)  │  │
│  └───────────────────────────┴───────────────────────┘  │
└──────────────────────────┬──────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────┐
│             Presentation & Deployment Layer             │
│  ┌───────────────────────────┬───────────────────────┐  │
│  │     Site Generator        │   Anti-Leak Validator │  │
│  │ (scripts/build-site.mjs)  │(scripts/validate-site)│  │
│  ├───────────────────────────┼───────────────────────┤  │
│  │    Static Dashboard       │  CI/CD Actions Deploy │  │
│  │      (site/index.html)    │(deploy-pages.yml)     │  │
│  └───────────────────────────┴───────────────────────┘  │
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

### 5. Presentation and Deployment Layer
Builds, verifies, and hosts the visual representation of the tool:
- **Site Builder (`scripts/build-site.mjs`):** Sources generated mock scan outputs and copies them to the public static directory (`site/data/`), while generating `site-build.json` metadata.
- **Site Validator (`scripts/validate-site.mjs`):** Programmatically asserts file presence, CNAME constraints, and audits files to verify that zero external CDNs, tracking services, Google Fonts, or secret credentials exist.
- **GitHub Actions Workflows (`.github/workflows/deploy-pages.yml`):** Runs the comprehensive syntax and mock scan pipeline in an isolated runner on push to `main`, and deploys the static dashboard to the public hosting domain.

---

## 🔄 Data Flow

The operational life cycle of a single scan run and site build proceeds as follows:

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
               │                            │                            │
               └────────────────────────────┼────────────────────────────┘
                                            │ (Compilation into export pack)
                                            ▼
                                   [Export Pack JSONs]
                                            │
                                            ▼
                               ┌────────────────────────┐
                               │  scripts/build-site    │
                               └────────────┬───────────┘
                                            │ (Programmatic site copying)
                                            ▼
                               [Public Static Site Bundle]
                                            │
                                            ▼
                               ┌────────────────────────┐
                               │ scripts/validate-site  │
                               └────────────┬───────────┘
                                            │ (Checks zero external CDNs & secrets)
                                            ▼
                                  [Deployment Artifact]
```

1. **Walking:** Filesystem crawler maps files, ignoring common package/build folders.
2. **Analysis:** The engine feeds each file through detectors matching clean-room regex arrays to yield raw findings.
3. **Compliance Reviewing:** Raw findings are passed through the review compliance engine to assign review lanes, classify evidence gaps, generate reviewer questions, and compute readiness scores.
4. **Synthesis:** Findings and review items are consolidated, generating summaries.
5. **Serialization:** Reports and candidates are printed to console or written to JSON/markdown targets.
6. **Presentation Packaging**: The site builder copies selected anonymized mock outputs into the site data bundle, generating build logs.
7. **Anti-Leak Validation**: The programmatic validator parses indices, checking domains, validating asset mappings, and asserting absolute exclusion of analytics or tracker connections.

---

## Backend Rehearsal Layer (v0.20.0)

Offline backend preparation without live services:

```
T018 storage draft SQL
        │
        ▼
T020 rehearsal forward/rollback SQL + manifest
        │
        ▼
validate:supabase-rehearsal (no DB connection)
```

T019 Cloudflare Worker boundary remains a separate local mock contract (`validate:worker-boundary`). No `supabase/config.toml`, no applied migrations, no Worker deployment.

---

## ⚖️ Disclaimer & Compliance Ingestion Boundary

> [!IMPORTANT]
> **Prototype Isolation:**
> This tool is an offline prototype scanner designed to discover codebase asset evidence.
> - **It identifies governance review needs, not final legal conclusions.**
> - **Findings are signals, not proof of non-compliance.**
> - **All exports are Candidates:** Every evidence export candidate starts as a `draft` and strictly requires developer/compliance human review and sign-off before official Governance OS ingestion. Status is locked with `review_required: true`.
> - **Simulated Presentation Site**: The public site deployed at `ai-scan.caesar.no` presents static mock data only. It does not perform live repo scanning or network integration.
> - **No live integrations:** No workspace scanning, pull request scanning, active monitoring, or live database ingestion are supported by this prototype.

