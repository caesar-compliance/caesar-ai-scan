# Evidence Export Contract

This document outlines the schema design and contract rules for exporting compliance evidence from `caesar-ai-scan` for downstream ingestion in `caesar-ai-evidence` and Caesar Governance OS.

> [!NOTE]
> **Prototype Status:**
> This contract defines an offline candidate pipeline foundation. It helps identify AI usage and codebase evidence gaps but does not guarantee legal compliance. All candidates require human review before ingestion.

## Schema Version
Current Active Contract Version: `0.2.0`

## Structure Rules

### 1. Scan Result Payload (`schemas/scan-result.schema.json`)
The complete static analysis run output, tracking all analyzed codebase assets.
- `schema_version`: Must be `"0.2.0"`.
- `scanner`: Emitting application identification.
- `scanned_at`: ISO 8601 UTC timestamp.
- `target`: Target absolute or relative workspace folder.
- `summary`: High-level category metrics.
- `findings`: Array of granular matched signals.

### 2. Evidence Export Candidate Payload (`schemas/evidence-export-candidate.schema.json`)
A structured draft record mapping a specific codebase finding to the Caesar AI Evidence ecosystem formats.
- **`candidate_id`**: Prefixed ID (`ec_<random>`) for relational tracking.
- **`source_tool`**: Object describing scanner version.
- **`generated_at`**: Timestamp.
- **`evidence_type`**: Maps findings to Caesar categories:
  - `codebase_dependency`
  - `environment_credential`
  - `prompt_configuration`
  - `vector_storage`
- **`status`**: Starts as `"draft"`.
- **`review_required`**: Always `true` for automated scans.
- **`proposed_payload`**: Extracted data containing files, matches, and suggested reviews.
- **`integration_notes`**: Ingestion-ready developer context.
