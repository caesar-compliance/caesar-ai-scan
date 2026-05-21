# Migration Rehearsal Guide

## Purpose
Rehearse the future Supabase/Postgres setup for Caesar AI Scan using offline SQL and validators before any live project is created.

## Workflow (local only)
1. Review T018 draft: `001_ai_scan_storage_schema.draft.sql`
2. Compare forward rehearsal SQL under `rehearsal/`
3. Run `npm run validate:supabase-rehearsal`
4. Generate `tmp/supabase-migration-rehearsal-report.md` via `npm run supabase:migration-rehearsal-report`

## Table dependency order (forward)
1. `ai_scan_projects`
2. `ai_scan_runs`
3. `ai_scan_findings`, `ai_inventory_components`, `ai_import_ledger`
4. `ai_review_items`

## Rollback order
Reverse dependency: review items → findings/ledger/inventory → runs → projects.

## Explicitly out of scope
- `supabase link`, `supabase db push`, applied migrations
- Service role keys, real project refs, production deployment
- External fetching or scheduler automation
