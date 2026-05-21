# Supabase Storage Schema Draft (v0.18.0)

This directory contains the planned storage schema for Caesar AI Scan.

## Contents
- `schemas/supabase-storage-contract.schema.json`: Contract definition.
- `docs/backend/supabase/001_ai_scan_storage_schema.draft.sql`: SQL schema draft.
- `docs/backend/supabase/IMPORT_MAPPING_CONTRACT.md`: Import mapping documentation.
- `docs/backend/supabase/RLS_AND_ACCESS_BOUNDARY.md`: Security and RLS boundary.
- `docs/backend/supabase/rehearsal/`: T020 migration rehearsal SQL (forward + rollback), manifest — **LOCAL REHEARSAL ONLY / NOT APPLIED**.

## Status
- DRAFT / NOT APPLIED.
- T020 rehearsal pack available; see [SUPABASE_MIGRATION_REHEARSAL.md](../SUPABASE_MIGRATION_REHEARSAL.md).
- No live connections.
- Offline-only validation (`validate:supabase-draft`, `validate:supabase-rehearsal`).
