# Evidence Export Contract

This document outlines the schema design and contract rules for exporting compliance evidence from `caesar-ai-scan` for downstream ingestion in `caesar-ai-evidence` and Caesar Governance OS.

> [!NOTE]
> **Prototype Status:**
> This contract defines an offline candidate pipeline foundation. It helps identify AI usage and codebase evidence gaps but does not guarantee legal compliance. All candidates require human review before ingestion.

## Schema Version
Current Active Contract Version: `0.4.0`

## Structure Rules

### 1. Scan Result Payload (`schemas/scan-result.schema.json`)
The complete static analysis run output, tracking all analyzed codebase assets.
- `schema_version`: Must be `"0.4.0"`.
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
- **`review_status`**: Enriched candidate review phase indicator (e.g. `draft_detected`, `blocked_missing_context`, etc.).
- **`evidence_gaps`**: Array of identified compliance requirements that are missing for the specific finding.
- **`export_readiness`**: Deterministic readiness percentage (0-100%) incorporating strict penalties and a 70% capping safety rule for unresolved blocking gaps.
- **`required_review_lanes`**: Array of corporate departments triggered for auditing the candidate.

---

### 3. Evidence Export Pack Parent (`schemas/evidence-export-pack.schema.json`)
The master package index compiling the full offline scan context:
- `schema_version`: Must be `"0.4.0"`.
- `pack_id`: Prefixed unique ID (`pack_<random>`).
- `generated_at`: ISO 8601 UTC timestamp.
- `source_tool_version`: `"0.4.0"`.
- `target_project`: Path of the analyzed codebase directory.
- `manifest`: Nested `CaesarExportManifest` structure.
- `scan_result`: Master scan result payload.
- `evidence_candidates`: Array of the 11 candidate drafts.
- `review_workflow`: The compiled review workflows.
- `import_readiness`: Import feasibility assessor object.
- `human_review_checklist`: Auditor confirmation register mapping next steps and verification items.

---

### 4. Export Manifest (`schemas/export-manifest.schema.json`)
Integrity verification and secure hash tracker:
- `manifest_id`: Prefixed ID (`man_<random>`).
- `included_artifacts`: List of JSON files written.
- `safety_flags`:
  - `no_plaintext_credentials_exposed`: Flag indicating if env findings exist.
  - `all_candidates_are_drafts`: Locked to `true` to assert staging boundary safety.
  - `no_competitor_licenses_flagged`: Enforces clean licensing posture.
- `hash_summary`: A dictionary mapping filenames to SHA-256 secure hexadecimal hashes calculated deterministically.

---

### 5. Import Readiness (`schemas/import-readiness.schema.json`)
Assessment of automated vs manual workflows:
- `readiness_status`: One of `evidence_candidate_ready`, `needs_human_review`, `blocked_missing_context`.
- `readiness_score`: The global average export readiness score.
- `can_import_automatically`: Hard-locked to `false` for absolute safety.
- `blockers`: Descriptive items that prevent automated execution.

---

### 6. Human Review Checklist (`schemas/human-review-checklist.schema.json`)
Explicit routing guide for corporate compliance officers:
- `review_lanes`: Triggered reviewer categories.
- `required_questions`: Contextual prompts the human auditor must investigate.
- `required_confirmations`: Declarations regarding ownership and secrets that the auditor must sign off.
- `signoff_required`: Locked to `true` to ensure human-in-the-loop oversight.

