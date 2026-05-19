# Caesar AI Scan (`caesar-ai-scan`)

> AI usage static analysis scanner for codebases and CI/CD pipelines, part of the [Caesar AI Governance Hub](https://github.com/caesar-compliance/caesar-ai-governance-hub) ecosystem.

---

## 📖 Overview

**`caesar-ai-scan`** is a fast static-analysis CLI and CI/CD tool designed to scan local codebases and GitHub Action configurations. It identifies dependencies on external AI APIs, LLM software packages, model checkpoints, and vector databases, helping teams map and validate active AI integrations against corporate policies.

This tool acts as a scanner within the Caesar AI Governance Hub ecosystem at [caesar.no](https://caesar.no), feeding code audit findings directly into structured governance pipelines.

### 🚦 Project Status
> [!NOTE]
> This repository is in the **repository foundation** stage. Active scanning engine implementation, detection rule development, and CLI builders are scheduled for subsequent development phases.

---

## 👥 Who It Is For

*   **Developers & DevOps Engineers:** To identify active AI software dependencies and run static compliance checks locally or during CI/CD steps.
*   **CTOs & Security Teams:** To maintain a continuous, automated inventory of AI tools, API integrations, and vector stores without manual auditing.
*   **Compliance & Audit Leads:** To discover evidence gaps and map source code usage directly to documented controls.

---

## 🛠️ How It Connects

### 1. Caesar AI Governance Hub Connection
`caesar-ai-scan` is a core utility of the parent ecosystem. It translates raw source code states into verified evidence layers to validate that systems comply with global governance guidelines.

### 2. Connection to `caesar-ai-evidence`
Scan results are compiled and exported strictly matching the standardized schemas defined in [caesar-ai-evidence](https://github.com/caesar-compliance/caesar-ai-evidence). This ensures that codebase scan logs are perfectly interoperable with the rest of the ecosystem.

---

## ⚖️ Important Disclaimer

> [!IMPORTANT]
> **No Compliance Guarantees:** `caesar-ai-scan` is a technical scanning utility that helps identify, map, and document AI dependencies and potential API exposures in codebases. It **does not guarantee regulatory compliance**, legal clearance, or audit approvals. Regulatory compliance remains a holistic legal, operational, and organizational state determined by accredited auditors, legal experts, and competent authorities.

---

## 📂 Repository Directory

*   **[SPEC.md](SPEC.md)** — Core scan specifications, CLI command flags, and detection models.
*   **[ARCHITECTURE.md](ARCHITECTURE.md)** — Scan engine flow, dependency matching rules, and modules layout.
*   **[ROADMAP.md](ROADMAP.md)** — Multi-phase project development roadmap.
*   **[CHANGELOG.md](CHANGELOG.md)** — Chronological release history.
*   **[REPO_INVENTORY.md](REPO_INVENTORY.md)** — Structural file index of this codebase.
*   **[PROJECT_STATE.md](PROJECT_STATE.md)** — Project phase, metadata tracker, and boundaries.
*   **[NEXT_ACTIONS.md](NEXT_ACTIONS.md)** — Task execution lists and autonomous boundaries.
*   **[docs/RESEARCH_CONTEXT.md](docs/RESEARCH_CONTEXT.md)** — Functional domain research and strategic context.
*   **[docs/DECISION_LOG.md](docs/DECISION_LOG.md)** — Architectural decision log history.
