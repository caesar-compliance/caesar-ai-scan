# Specification — caesar-ai-scan

This document outlines the technical specification, commands, and inputs/outputs for the codebase scanning tool `caesar-ai-scan`.

---

## 📖 Product Specification

### 1. Purpose
`caesar-ai-scan` is a fast static-analysis CLI and CI/CD tool designed to detect and inventory AI dependencies, model pipelines, external API usages, and vector storage connections in source code repositories.

### 2. Target Users
*   **Developers & DevOps Engineers:** Setting up static checks locally or in GitHub Actions.
*   **Security & Compliance Managers:** Assessing software pipelines for undocumented AI dependencies.

### 3. Problem Solved
Codebases increasingly consume third-party AI APIs and frameworks without proper logging, creating legal, security, and operational evidence gaps. `caesar-ai-scan` automates the discovery of these integrations, facilitating audit readiness.

### 4. MVP Scope
*   **Dependency Scanner:** Scan lockfiles and configuration files (`package.json`, `requirements.txt`, `Cargo.toml`) against a catalog of 50+ known AI packages.
*   **API Key Detector:** Detect un-hashed or raw credentials (e.g., `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`) embedded in codebase variables or text files.
*   **CLI Output:** Produce an stdout report and a JSON audit file.

### 5. Future Scope
*   **AST Analysis:** In-depth source code parsing (Python, TypeScript, Go) to trace exact LLM initialization params.
*   **GitHub Action Integration:** Complete pre-built action to post PR warnings.
*   **Registry Feeds:** Secure upload to central enterprise feeds on `caesar-ai-governance-os`.

### 6. Non-Goals
*   Dynamic runtime vulnerability scanning (not an active runtime exploit detector).
*   Automatic patching or code modification (the tool only identifies and reports, it does not write or fix code).
*   Enforcement of legal blocking rules (it acts as an auditing helper, not a gateway blocker).

---

## ⚙️ Expected Inputs & Outputs

### Expected Inputs
*   **Target Directory:** Local absolute or relative path to a repository.
*   **Custom Configurations (Optional):** Exclusions list or custom package catalog defined in a `.caesar-scan.yaml` config file.

### Expected Outputs
*   **Visual Console Report:** Markdown-compatible stdout summarization.
*   **Ecosystem Export:** A JSON schema-compliant evidence block matching the `evidence-item` schema of `caesar-ai-evidence`.

---

## 🔗 Relation to Caesar AI Governance Hub
`caesar-ai-scan` serves as the primary code-level auditing utility of the ecosystem. It compiles codebase compliance telemetry, allowing security leaders to map raw developer activities directly back to the high-level policy guidelines tracked in the central Caesar AI Governance Hub.
