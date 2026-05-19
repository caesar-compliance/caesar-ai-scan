# Architecture — caesar-ai-scan

This document outlines the high-level architecture, module layers, and data-flow pipelines for the `caesar-ai-scan` static-analysis tool.

---

## 🏗️ Planned Structure

`caesar-ai-scan` is structured into three clean, decoupled layers to ensure speed, modularity, and ease of extending detection rules:

```
┌─────────────────────────────────────────────────────────┐
│                    CLI Controller                       │
│  (Ingests arguments, targets, and config exclusions)   │
└──────────────────────────┬──────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────┐
│                    Detection Engine                     │
│  ┌──────────────────────┐     ┌──────────────────────┐  │
│  │  Dependency Matcher  │     │   API Key Detector   │  │
│  └──────────────────────┘     └──────────────────────┘  │
│  ┌──────────────────────┐                               │
│  │   AST Code Parser    │                               │
│  └──────────────────────┘                               │
└──────────────────────────┬──────────────────────────────┘
                           ▼
┌─────────────────────────────────────────────────────────┐
│                     Output Formatter                    │
│  (Compiles visual Markdown and formats JSON evidence)   │
└─────────────────────────────────────────────────────────┘
```

1.  **CLI Controller Layer:** Entry point that handles filesystem targets, loads optional ignore patterns (`.caesarignore`), and configurations.
2.  **Detection Engine Layer:** Houses the core analysis modules:
    *   **Dependency Matcher:** Parses lockfiles (`package-lock.json`, `poetry.lock`, `Cargo.lock`) and setup configs to match package names against known AI vendor libraries.
    *   **API Key Detector:** Uses lightweight regex and entropy matches to identify plaintext AI credentials.
    *   **AST Code Parser (Future):** Scans file extensions (`.py`, `.ts`, `.js`, etc.) to locate client initializations.
3.  **Output Formatter Layer:** Formats findings into high-readability visual tables for developers, and outputs schema-validated files.

---

## 🔄 Data Flow

The operational life cycle of a single scan run proceeds as follows:

```
[Target Codebase] ──> (Exclusions Filter) ──> [File Queue]
                                                 │
                                                 ▼
                                     ┌───────────────────────┐
                                     │   Detection Engine    │
                                     └───────────┬───────────┘
                                                 │
                                                 ▼
[Console Markdown] <── (Output Formatter) <── [Raw Findings]
                                 │
                                 ▼
                     [caesar-ai-evidence JSON]
```

1.  **Queueing:** Filesystem crawler maps files in the target directory, applying standard exclusions.
2.  **Scanning:** The engine runs file paths through matching and credential scanning rules.
3.  **Synthesis:** Raw findings are combined into a master summary block.
4.  **Serialization:** The visual report is printed to console, while the machine-readable payload is formatted as a standardized evidence packet.

---

## 🔗 Integration with `caesar-ai-evidence`

`caesar-ai-scan` natively supports the shared evidence telemetry standard. The scanner maps codebase findings directly to the `evidence-item` schema. The output packet structure ensures that:
- Codebase AI usage is recorded under the `generator` metadata matching the scanner version.
- Gaps and detected risks map cleanly to the relational schema blocks consumed by the parent ecosystem.

---

## 📊 Future UI, Reporting & API Expectations

*   **HTML Reports:** The tool will eventually support generating self-contained static HTML pages showing interactive scan graphs.
*   **Central OS Ingestion:** A planned API webhook integration will allow CI pipelines to upload scan payloads directly to `caesar-ai-governance-os` for centralized monitoring and compliance aggregation.
