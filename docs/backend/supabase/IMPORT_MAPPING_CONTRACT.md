# Backend Import Mapping Contract (Draft)

This document maps current offline-generated Caesar AI Scan outputs to the planned Supabase storage schema.

## Mapping Table

| Source Field (T012/T013) | Dest Table | Dest Field | Transform Rule |
| :--- | :--- | :--- | :--- |
| `project_metadata.name` | `ai_scan_projects` | `project_name` | None |
| `run_metadata.timestamp` | `ai_scan_runs` | `run_timestamp` | ISO to Postgres |
| `findings[*].type` | `ai_scan_findings` | `finding_type` | None |
| `findings[*].details` | `ai_scan_findings` | `details` | JSONB |
| `inventory[*].name` | `ai_inventory_components` | `name` | None |
| `review_items[*].note` | `ai_review_items` | `reviewer_note` | None |
| `import_manifest.status` | `ai_import_ledger` | `import_status` | None |

## Notes
- All IDs are generated server-side using `gen_random_uuid()` in Postgres.
- This mapping is strictly for architectural planning. No live database writes are implemented.
