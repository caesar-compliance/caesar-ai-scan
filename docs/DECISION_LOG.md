# Decision Log

... (previous content)

## DECISION-T023: Disabled Local Postgres Compile Harness Stub
**Date:** 2026-05-22
**Context:** Need a safe rehearsal scaffold for testing future Postgres compile-time validation without live database or shell execution.
**Decision:** T023 implements a disabled-by-default local Postgres compile harness stub runner, validator, and manifest, intentionally avoiding all live Supabase/Postgres database connections, applied migrations, Docker/psql shell execution, project secrets, real project refs, and external network interactions.

## DECISION-T024: Local Postgres Compile Harness Enablement Gate
**Date:** 2026-05-22
**Context:** Need an architectural safeguard to prevent future accidental execution of Postgres compile-time harness.
**Decision:** T024 introduces an enablement gate spec that defaults to CLOSED/DISABLED, preventing any live execution and requiring explicit Control Tower approval for any future harness activation.
