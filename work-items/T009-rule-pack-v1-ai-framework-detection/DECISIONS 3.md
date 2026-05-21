# Decisions: T009 Rule Pack v1

## [DEC-T009-001] Rule Pack v1 Schema Expansion
- **Decision:** Add `rule_pack_version`, `detection_category`, `detector_id`, `signal_type`, `confidence`, `evidence_kind`, and `governance_relevance` to the finding model.
- **Rationale:** Standardizes detection metadata for ingestion into downstream governance systems and improves auditor visibility.

## [DEC-T009-002] Path Sanitization for Privacy
- **Decision:** Automatically convert absolute target and history paths to relative paths if they are within the current working directory.
- **Rationale:** Prevents leaking sensitive local system information (like macOS usernames in `/Users/`) when sharing scan reports or deploying the public demo site.

## [DEC-T009-003] ML Artifact Detection
- **Decision:** Implement a dedicated `ml-artifact-detector` based on file extensions (.pkl, .onnx, etc.).
- **Rationale:** High-value signal for identifying machine learning workloads that might not be visible in package managers.

## [DEC-T009-004] Masking Placeholders
- **Decision:** Retain `your-` and `placeholder` values in evidence hints while masking unknown values.
- **Rationale:** Allows templates and example files to be clearly identified as non-leaks while protecting real potential secrets.
