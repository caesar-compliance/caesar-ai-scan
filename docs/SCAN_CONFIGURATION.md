# Caesar AI Static Scan: Scan Configuration Guide

This document describes the JSON configuration schemas, default properties, and options merging hierarchy in `caesar-ai-scan` version `0.5.0`.

---

## 🚦 Configuration Loading Hierarchy

When the static scanner runs, options are resolved using a strict, predictable hierarchical cascade (highest priority to lowest):

1. **Command Line (CLI) Overrides:** Direct options passed during runtime (e.g. `--exclude`, `--out`, `--config`).
2. **Local Configuration File (`caesar-scan.config.json`):** Explicitly passed via `--config` or auto-discovered in the target/CWD root.
3. **System Default Configurations (`data/default-scan-config.json`):** Fallback baseline options.

If custom `--exclude <patterns>` are supplied at the CLI, they are **concatenated** with any `exclude` items defined in the loaded configuration file, ensuring complete ignore coverage.

---

## 📝 Configuration File Schema

All local configurations follow the canonical schema defined in [scan-config.schema.json](file:///Users/nazarkoartem/Desktop/Projects/caesar-compliance/caesar-ai-scan/schemas/scan-config.schema.json).

### Example `caesar-scan.config.json`
```json
{
  "target": ".",
  "exclude": [
    "generated/",
    "tmp/"
  ],
  "rulesPath": null,
  "outputs": {
    "scan_result": "tmp/sample-scan-result.json",
    "evidence_candidates": "tmp/sample-evidence-candidates.json",
    "review_out": "tmp/sample-review-workflow.json",
    "review_report": "tmp/sample-review-workflow.md",
    "export_pack": "tmp/sample-evidence-export-pack",
    "scope_out": "tmp/sample-scope.json",
    "scope_report": "tmp/sample-scope.md"
  }
}
```

---

## ⚙️ Configuration Properties

| Parameter | Type | Default | Description |
| :--- | :---: | :---: | :--- |
| `target` | `string` | `"."` | Path to the target repository directory to scan. |
| `exclude` | `array` | `[]` | Glob patterns to bypass during scanner traversal. |
| `rulesPath` | `string` | `null` | Optional path to custom static-analysis compliance rules. |
| `outputs.scan_result` | `string` | `null` | Export path for the raw static analysis JSON report. |
| `outputs.evidence_candidates` | `string` | `null` | Export path for the evidence candidate draft files. |
| `outputs.review_out` | `string` | `null` | Export path for the automated review workflow state JSON. |
| `outputs.review_report` | `string` | `null` | Export path for the human-review Markdown dashboard. |
| `outputs.export_pack` | `string` | `null` | Directory path where the compiled Evidence Export Pack will be packed. |
| `outputs.scope_out` | `string` | `null` | Export path for the resolved scope tracking JSON. |
| `outputs.scope_report` | `string` | `null` | Export path for the premium scope Markdown report. |
