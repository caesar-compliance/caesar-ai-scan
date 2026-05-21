# T020 Decisions

- T020 introduces a local-only Supabase/Postgres migration rehearsal pack and SQL safety validator to prepare future backend setup while intentionally avoiding live Supabase connections, applied migrations, database writes, deployment, scheduler, GitHub Actions scanner mode, PR annotations, SARIF, real customer ingestion, external fetching, secrets, account emails, real project refs, active Supabase config, and Cloudflare deployment config in tracked files.
