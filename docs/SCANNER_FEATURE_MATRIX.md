# Scanner Feature Matrix — Caesar AI Scan

This matrix compares Caesar AI Scan features against best-in-class open-source references found in the Reference Lab.

| Feature Area | Caesar Status | Best Reference Examples | Recommended Next Task | Priority |
| :--- | :--- | :--- | :--- | :--- |
| **CLI UX** | Basic | `gitleaks`, `trivy` | Progress indicators & color output | Medium |
| **Local/Offline Scanning** | Core | `gitleaks`, `semgrep` | Parallel file processing | Low |
| **Config File Model** | JSON | `semgrep`, `trivy` | YAML support & config nesting | Medium |
| **Ignore File Model** | `.caesarignore` | `gitleaks`, `semgrep` | Advanced globbing & inline ignores | Low |
| **Rule Format** | JSON (v1) | `semgrep`, `gitleaks` | Rule Pack v2 (EU AI Act mapping) | High |
| **Finding Schema** | Rule Pack v1 | `trivy`, `semgrep` | SARIF 2.1.0 alignment | High |
| **Severity Model** | Rule Pack v1 | `trivy`, `scorecard` | CVSS-like scoring for AI risks | Medium |
| **Risk Taxonomy** | Rule Pack v1 | `owasp-llm-top-10`, `getregula` | Alignment with EU AI Act categories | High |
| **Evidence Candidate Model** | Relational JSON | `credoai-lens` | Evidence cryptographic signing | Medium |
| **Review Workflow** | Lane-based | `credoai-lens` | Interactive CLI review mode | Low |
| **History/Diff Model** | Run-based | `gitleaks` (baseline) | Time-series risk tracking | Low |
| **Export Pack** | 7-schema bundle | `syft`, `cdxgen` | AI-BOM (CycloneDX) compatibility | High |
| **JSON Schema Validation** | Programmatic | `cyclonedx-specification` | Automated schema doc generation | Low |
| **GitHub Action Mode** | Basic Deploy | `trivy-action`, `gitleaks-action` | PR Annotation mode (SARIF) | High |
| **PR Annotation Mode** | Planned | `trivy`, `semgrep` | T012 planning pack | High |
| **SARIF Output** | Planned | `semgrep`, `gitleaks` | T012 planning pack | High |
| **AI-BOM / Inventory** | In-Progress | `syft`, `cdxgen` | T010 export implementation | High |
| **Public Demo Site** | Static SPA | N/A | Interactive data filtering | Medium |
| **Audit Report** | Markdown | `scorecard`, `getregula` | PDF/HTML premium exports | Medium |
| **Enterprise Dashboard** | Planned | `verifywise` | Governance OS Webhook connector | Medium |
