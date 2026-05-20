# Specification — caesar-ai-scan

This document outlines the technical specification, commands, and inputs/outputs for the codebase scanning tool `caesar-ai-scan` as of version `0.6.0`.

---

## 📖 Product Specification

### 1. Purpose
`caesar-ai-scan` is a fast static-analysis CLI tool designed to detect and inventory AI dependencies, model pipelines, external API usages, prompt templates, and vector storage connections in source code repositories.

### 2. Target Users
*   **Developers & DevOps Engineers:** Setting up static checks locally or in CI pipelines.
*   **Security & Compliance Managers:** Assessing software pipelines for undocumented AI dependencies.

### 3. Problem Solved
Codebases increasingly consume third-party AI APIs and frameworks without proper logging, creating legal, security, and operational evidence gaps. `caesar-ai-scan` automates the discovery of these integrations, facilitating audit readiness.

### 4. MVP Scope (v0.6.0 Public Deployment)
*   **Dependency Scanner:** Scan manifest files (`package.json`, `requirements.txt`) against a curated list of AI-related packages.
*   **API Credential Detector:** Scan files line-by-line for plain-text AI service keys (e.g. `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`).
*   **Prompt File Detector:** Scan file paths and folder structures for prompt-engineering files (e.g. `.prompt.md`, `system.prompt`).
*   **Vector DB Detector:** Scan source code and files for vector database imports and usage (e.g., Chroma, Pinecone, pgvector).
*   **Evidence Candidate Exporter:** Transform findings into draft evidence export candidates enriched with T002 review metadata for downstream Governance OS integration.
*   **Review Workflow Builder:** Construct a comprehensive review workflow mapping findings to assigned review lanes (Security, Legal, Privacy, etc.) and classifying missing evidence gaps.
*   **Export Readiness Scorer:** Deterministically score each candidate's readiness and enforce a strict 70% capping safety rule if blocking gaps exist.
*   **Evidence Export Pack Builder & Disk Writer (T003 / v0.4.0):** Compiles and packages scan results, evidence candidate drafts, review workflows, import readiness, checklist, and manifest into a self-contained local package directory.
*   **Scan Configuration & Scope Control (T004 / v0.5.0):** Supports customizable `caesar-scan.config.json` filters and robust `.caesarignore` patterns to exclude testing files, vendor modules, and development paths from static evaluations.
*   **Public Static Presentation Site & Deployment (T005 / v0.6.0):** Deploys a responsive client-side presentation dashboard (`site/`) to `https://ai-scan.caesar.no/` loaded with static scan samples. Enforces zero external CDNs, tracker scripts, or external fonts to preserve air-gapped security boundaries. Includes a CNAME mapping to `ai-scan.caesar.no`.
*   **GitHub Pages Action Pipeline (T005 / v0.6.0):** Configures `.github/workflows/deploy-pages.yml` with official GitHub Actions to automatically run full offline validation and deploy the static website bundle on every push to `main`.
*   **Zero External Dependencies:** Built purely using Node.js standard libraries.

### 5. Future Scope
*   **AST Analysis:** In-depth source code parsing (Python, TypeScript, Go ASTs) to trace exact LLM initialization params.
*   **GitHub Action Integration:** Pre-built Action to post pull request inline annotations.
*   **Governance OS Direct Pipeline:** Ingestion flow triggers when explicitly authorized.

### 6. Non-Goals
*   Dynamic runtime vulnerability scanning (this is not an active exploit detector).
*   Automatic patching or code modification (the tool only identifies and reports, it does not modify target code).
*   Enforcement of legal blocking rules (it acts as an auditing helper, not a gateway blocker).
*   Live integrations, monitoring schedulers, dynamic user workspace scanning, or dynamic ingestion pipelines (remains a strictly simulated static presentation sandbox in this version).

---

## ⚙️ CLI Specification

The tool is invoked via Node.js:
```bash
node src/cli.mjs <target> [flags]
```

### Supported Flags:
- `<target>`: Positional argument specifying directory to scan (defaults to `.`).
- `--format <json|markdown>`: Specifies reports serialization format (defaults to `markdown`).
- `--out <path>`: Output destination for the formatted scan report.
- `--export-evidence-candidates <path>`: Exports standard `CaesarEvidenceExportCandidate` records as JSON, enriched with review metadata.
- `--review-out <path>`: Output destination for the structured JSON Review Workflow containing assigned lanes, gaps, and scores.
- `--review-report <path>`: Output destination for the premium Markdown compliance summary review report.
- `--export-pack <directory>`: Packages the full offline audit package, exporting 7 JSON schemas and the `REVIEW_SUMMARY.md` auditor report to the designated folder.

---

## 📝 Schemas & Contracts

All outputs conform to JSON draft contracts version `0.6.0` located under `schemas/`:
1. **`schemas/scan-result.schema.json`**: Master scan run report.
2. **`schemas/evidence-export-candidate.schema.json`**: Reviewable evidence draft.
3. **`schemas/review-workflow.schema.json`**: Enriched compliance review workflow.
4. **`schemas/evidence-gap.schema.json`**: Individual classified evidence gap model.
5. **`schemas/evidence-export-pack.schema.json`**: Parent export pack index schema compiling all artifacts.
6. **`schemas/export-manifest.schema.json`**: Package checksum manifest validating SHA-256 hashes and safety statuses.
7. **`schemas/import-readiness.schema.json`**: Assessment of import compatibility, score, and unresolved gaps.
8. **`schemas/human-review-checklist.schema.json`**: Auditor routing checklist compiling review lanes, questions, and signature flags.

---

## ⚖️ Important Disclaimer

> [!IMPORTANT]
> **No Compliance Guarantees:** 
> `caesar-ai-scan` is an offline static-analysis helper tool. It helps identify AI usage and codebase evidence gaps but does not guarantee legal or regulatory compliance. Findings are signals, not proof of non-compliance. All generated evidence candidates require human verification and manual approval before central Governance OS ingestion. Status remains locked in `draft` with `review_required: true`. No network calls, live deployments, or monitoring features are included. The public deployed website at `ai-scan.caesar.no` represents a static simulated mockup using synthetically generated mock assets only. No actual client workspace data is scanned or ingested online.
