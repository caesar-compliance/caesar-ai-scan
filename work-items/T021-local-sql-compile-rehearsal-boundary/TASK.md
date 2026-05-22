# Task T021: Local SQL Compile Rehearsal Boundary

Create a local/offline SQL compile rehearsal boundary for the existing Supabase storage schema rehearsal.

## Goals
- Create offline validation for SQL rehearsal files.
- Prevent live DB/Supabase connection.
- Ensure deterministic validation of SQL rehearsal SQL (forward and rollback).

## Deliverables
- `schemas/sql-compile-rehearsal.schema.json`
- `docs/backend/supabase/rehearsal/sql-compile-rehearsal.manifest.json`
- `src/sql-compile-rehearsal/sql-compile-rehearsal-report.mjs`
- `scripts/build-sql-compile-rehearsal-report.mjs`
- `scripts/validate-sql-compile-rehearsal.mjs`
- Documentation.
