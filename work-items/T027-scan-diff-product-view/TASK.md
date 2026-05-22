# Task T027: Scan Diff Product View

## Goal
Add a local/static Scan Diff Product View so the dashboard can clearly show what changed between scan runs.

## Requirements
- Scan diff summary cards.
- Added/removed/changed signals section.
- Affected files/providers/frameworks.
- Review implications.
- Sample/local-only disclaimer.
- No live services/backend.

## Deliverables
- `schemas/scan-diff-product-view.schema.json`
- `src/scan-diff-product/scan-diff-product-view-report.mjs`
- `scripts/build-scan-diff-product-view.mjs`
- `scripts/validate-scan-diff-product-view.mjs`
- `site/data/scan-diff-product-view.json`
- `docs/SCAN_DIFF_PRODUCT_VIEW.md`
