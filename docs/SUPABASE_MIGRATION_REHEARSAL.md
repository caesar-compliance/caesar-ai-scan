# Supabase Migration Rehearsal (v0.20.0)

T020 introduces a **local-only** migration rehearsal pack derived from the T018 Supabase storage schema draft. Nothing in this pack connects to Supabase or applies migrations.

## Contents
| Artifact | Purpose |
| :--- | :--- |
| `schemas/supabase-migration-rehearsal.schema.json` | Rehearsal contract schema |
| `docs/backend/supabase/rehearsal/001_ai_scan_storage_schema.rehearsal.sql` | Forward rehearsal SQL (not applied) |
| `docs/backend/supabase/rehearsal/001_ai_scan_storage_schema.rollback.rehearsal.sql` | Rollback rehearsal SQL (not applied) |
| `docs/backend/supabase/rehearsal/migration-rehearsal.manifest.json` | Deterministic manifest |
| `src/supabase-rehearsal/supabase-migration-rehearsal-report.mjs` | Markdown report builder |

## Commands
```bash
npm run supabase:migration-rehearsal-report
npm run validate:supabase-rehearsal
```

## Safety
- No `supabase/config.toml`, no `supabase/migrations/`, no `wrangler.toml`.
- No database client dependencies, no live connections, no secrets or project refs in tracked files.

See also: [docs/backend/supabase/MIGRATION_REHEARSAL_GUIDE.md](backend/supabase/MIGRATION_REHEARSAL_GUIDE.md).
