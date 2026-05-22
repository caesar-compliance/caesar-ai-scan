# Validation

- Automated validation script `scripts/validate-local-postgres-compile-harness-enable-gate.mjs` will confirm manifest/report schema and state integrity.
- Manual verification of safe execution boundary (no child_process, no network, no live DB).
