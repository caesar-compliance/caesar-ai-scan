# Task Tracking: T004 Scan Configuration & Scope Control

Tracks the progress of implementing scope controls, ignore files parser, and JSON configs for `caesar-ai-scan v0.5.0`.

---

## 📋 Task Checklist

- [x] Create feature branch `feat/T004-scan-configuration-scope-control`
- [x] Design and write Scope Control Parser and Resolver (`src/scanner/scope-resolver.mjs`)
- [x] Integrate scope resolving into the Scan Orchestrator (`src/scanner/scan-runner.mjs`)
- [x] Support default JSON configuration `caesar-scan.config.json` loading and CLI merges (`src/cli.mjs`)
- [x] Create Markdown reporter for scope resolution (`src/report/scope-report.mjs`)
- [x] Bump scanner version and schema version locks to `0.5.0`
- [x] Add sample fixture proving ignored AI-looking noise is excluded
- [x] Create validation script `scripts/validate-scope.mjs`
- [x] Update and run offline validation suite (`npm run check:all-offline`)
- [x] Merge `feat/T004-scan-configuration-scope-control` into `main` after all validation tests pass
