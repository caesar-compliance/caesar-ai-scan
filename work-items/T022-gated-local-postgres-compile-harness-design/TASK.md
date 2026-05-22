# T022 — Gated Local Postgres Compile Harness Design

This work item captures the design and requirements for a gated local Postgres SQL compile harness, enabling safe and auditable SQL verification without live database connectivity.

## Decisions
- Design-only phase; no execution allowed.
- Manifest-driven configuration.
- Strict gate requirement for future execution.

## Validation
- Offline validation script.
- Report schema alignment.
