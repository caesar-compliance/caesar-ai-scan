# Specification — caesar-ai-scan

This document outlines the technical specification, commands, and inputs/outputs for the codebase scanning tool `caesar-ai-scan` as of version `0.3.0`.

---

## 📖 Product Specification

### 1. Purpose
`caesar-ai-scan` is a fast static-analysis CLI tool designed to detect and inventory AI dependencies, model pipelines, external API usages, prompt templates, and vector storage connections in source code repositories.

### 2. Target Users
*   **Developers & DevOps Engineers:** Setting up static checks locally or in CI pipelines.
*   **Security & Compliance Managers:** Assessing software pipelines for undocumented AI dependencies.

### 3. Problem Solved
Codebases increasingly consume third-party AI APIs and frameworks without proper logging, creating legal, security, and operational evidence gaps. `caesar-ai-scan` automates the discovery of these integrations, facilitating audit readiness.

### 4. MVP Scope (v0.3.0 Offline Prototype)
*   **Dependency Scanner:** Scan manifest files (`package.json`, `requirements.txt`) against a curated list of AI-related packages.
*   **API Credential Detector:** Scan files line-by-line for plain-text AI service keys (e.g. `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`).
*   **Prompt File Detector:** Scan file paths and folder structures for prompt-engineering files (e.g. `.prompt.md`, `system.prompt`).
*   **Vector DB Detector:** Scan source code and files for vector database imports and usage (e.g., Chroma, Pinecone, pgvector).
*   **Evidence Candidate Exporter:** Transform findings into draft evidence export candidates enriched with T002 review metadata for downstream Governance OS integration.
*   **Review Workflow Builder:** Construct a comprehensive review workflow mapping findings to assigned review lanes (Security, Legal, Privacy, etc.) and classifying missing evidence gaps.
*   **Export Readiness Scorer:** Deterministically score each candidate's readiness and enforce a strict 70% capping safety rule if blocking gaps exist.
*   **Zero External Dependencies:** Built purely using Node.js standard libraries.

### 5. Future Scope
*   **AST Analysis:** In-depth source code parsing (Python, TypeScript, Go ASTs) to trace exact LLM initialization params.
*   **GitHub Action Integration:** Pre-built Action to post pull request inline annotations.
*   **Governance OS Direct Pipeline:** Ingestion flow triggers when explicitly authorized.

### 6. Non-Goals
*   Dynamic runtime vulnerability scanning (this is not an active exploit detector).
*   Automatic patching or code modification (the tool only identifies and reports, it does not modify target code).
*   Enforcement of legal blocking rules (it acts as an auditing helper, not a gateway blocker).
*   Live integrations or deployment (remains a strictly offline prototype in this version).

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

---

## 📝 Schemas & Contracts

All outputs conform to JSON draft contracts version `0.3.0` located under `schemas/`:
1. **`schemas/scan-result.schema.json`**: Master scan run report.
2. **`schemas/evidence-export-candidate.schema.json`**: Reviewable evidence draft.
3. **`schemas/review-workflow.schema.json`**: Enriched compliance review workflow.
4. **`schemas/evidence-gap.schema.json`**: Individual classified evidence gap model.

---

## ⚖️ Important Disclaimer

> [!IMPORTANT]
> **No Compliance Guarantees:** 
> `caesar-ai-scan` is an offline static-analysis helper tool. It helps identify AI usage and codebase evidence gaps but does not guarantee legal or regulatory compliance. Findings are signals, not proof of non-compliance. All generated evidence candidates require human verification and manual approval before central Governance OS ingestion. Status remains locked in `draft` with `review_required: true`. No network calls, live deployments, or monitoring features are included.
