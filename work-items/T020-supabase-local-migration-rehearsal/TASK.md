# T020: Supabase Local Migration Rehearsal Pack + SQL Safety Validator

Turn the T018 Supabase/Postgres storage schema draft into a local migration rehearsal pack (forward SQL, rollback SQL, manifest, validator) without applying anything to a real project.

## Deliverables
- Rehearsal schema, SQL, manifest, report module
- `validate:supabase-rehearsal`, `supabase:migration-rehearsal-report`
- Documentation and work-item records

## Safety
Offline/local/deterministic only. No live Supabase, no applied migrations, no secrets.
