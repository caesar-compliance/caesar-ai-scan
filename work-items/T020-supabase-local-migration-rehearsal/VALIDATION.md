# T020 Validation

## Commands
- `npm run supabase:migration-rehearsal-report`
- `npm run validate:supabase-rehearsal`
- `npm run check:all-offline`

## Checks
- Forward and rollback SQL marked DRAFT / LOCAL REHEARSAL ONLY / NOT APPLIED
- All six target tables present in forward and rollback SQL
- No `supabase/config.toml`, no active migration directories, no `wrangler.toml`
- Manifest deterministic; no secrets, emails, or live URLs in rehearsal corpus
