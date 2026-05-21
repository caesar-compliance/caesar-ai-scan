# T012 - Controlled Offline Import Dry-Run + Import Ledger

This implementation adds the ability to perform a controlled, offline dry-run import of a Caesar AI Scan bundle. It validates the bundle's integrity and produces a machine-readable import ledger and human-readable dry-run report.

## Decisions

- **Dry-Run Only:** The import process is strictly a dry-run and performs no live ingestion, database writes, or external calls.
- **Ledger Format:** Uses JSONL for the import ledger to allow appending entries without full file rewrites.
- **Safety:** Hardcoded safety flags ensure no unintended actions are taken.
- **Schema:** Follows a strict `0.12.0` schema version.
- **No Backend:** No database or backend was added, maintaining the offline-first architecture.

## Implementation Details

- **Schema:** Added `schemas/import-dry-run.schema.json`.
- **Builder:** Added `src/import-dry-run/import-dry-run-builder.mjs`.
- **Ledger Writer:** Added `src/import-dry-run/import-ledger-writer.mjs`.
- **Report:** Added `src/report/import-dry-run-report.mjs`.
- **CLI:** Extended `src/cli.mjs` with `--import-from-bundle`, `--import-dry-run-out`, `--import-ledger-out`, and `--import-report`.
- **Validation:** Added `scripts/validate-import-dry-run.mjs` and updated `check:all-offline`.

## Validation Report

All automated tests passed successfully, confirming integrity of the bundle import dry-run process.
