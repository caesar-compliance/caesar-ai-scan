# T006 — Offline Scan History & Diff Model

**Version:** 0.7.0
**Branch:** feat/T006-offline-scan-history-diff
**Status:** Completed ✅

## Goal
Add offline local scan history support so Caesar AI Scan can record repeated local runs, maintain a history index, and compute a stable finding diff between runs.

## Deliverables
- [x] schemas/scan-run.schema.json
- [x] schemas/scan-history-index.schema.json
- [x] schemas/scan-diff.schema.json
- [x] src/history/scan-history-writer.mjs
- [x] src/history/scan-history-reader.mjs
- [x] src/history/scan-diff-builder.mjs
- [x] src/report/scan-diff-report.mjs
- [x] scripts/validate-scan-history.mjs
- [x] CLI flags: --history-dir, --record-history, --diff-previous, --history-report
- [x] package.json scripts: history:sample, validate:history
- [x] check:all-offline includes validate:history
