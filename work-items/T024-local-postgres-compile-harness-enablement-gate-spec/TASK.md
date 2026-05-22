# Task: T024 / v0.24.0 — Local Postgres Compile Harness Enablement Gate Spec

## Goal
Define the explicit enablement gate for the local Postgres compile harness to ensure it remains safe and gated.

## Objectives
- Create enablement gate schema, manifest, and report builder.
- Define clearly what conditions allow future enablement.
- Default gate to CLOSED.
- Remain spec/report/validator only: no execution.

## Requirements
- schemas/local-postgres-compile-harness-enable-gate.schema.json
- docs/backend/supabase/local-compile-harness/local-postgres-compile-harness-enable-gate.manifest.json
- src/local-postgres-compile-harness/local-postgres-compile-harness-enable-gate-report.mjs
- scripts/build-local-postgres-compile-harness-enable-gate-report.mjs
- scripts/validate-local-postgres-compile-harness-enable-gate.mjs
- site/data/rehearsal/local-postgres-compile-harness-enable-gate-report.json
- docs/LOCAL_POSTGRES_COMPILE_HARNESS_ENABLEMENT_GATE.md
- docs/backend/supabase/LOCAL_POSTGRES_COMPILE_HARNESS_ENABLEMENT_GATE_GUIDE.md

## Safety
- No live DB connections.
- No shell execution (psql, docker, etc.).
- No network access.
