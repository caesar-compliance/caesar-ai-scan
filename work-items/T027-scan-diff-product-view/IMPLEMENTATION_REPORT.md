# Implementation Report - T027 Scan Diff Product View

## Overview
T027 adds a "Scan Diff Product View" to the Caesar AI Scan dashboard. This view allows users to compare results between scan runs and identify new AI signals, removed dependencies, and changes in the risk profile.

## Key Deliverables
- **Schema**: `schemas/scan-diff-product-view.schema.json` defines the contract for the product view.
- **Generator**: `src/scan-diff-product/scan-diff-product-view-report.mjs` contains the logic for enriching raw diff data with product-centric insights.
- **Builder**: `scripts/build-scan-diff-product-view.mjs` orchestrates the generation of `site/data/scan-diff-product-view.json`.
- **Validator**: `scripts/validate-scan-diff-product-view.mjs` ensures the generated data is safe and compliant.
- **Dashboard**: `site/index.html`, `site/assets/site.js`, and `site/assets/site.css` updated to render the new view.
- **Documentation**: `docs/SCAN_DIFF_PRODUCT_VIEW.md` provides an overview and usage instructions.

## Metadata
- **Version**: 0.27.0
- **Scan Diff Status**: available (utilizes local history/diff if present, otherwise sample data).
- **Backend Execution Enabled**: false
- **Live Services Enabled**: false

## Summary of Changes
- **Total Changes**: 0 (in real-history demo) / 2 (in sample fallback).
- **Added Signals**: 0 (real) / 2 (sample).
- **Removed Signals**: 0 (real) / 1 (sample).
- **Dashboard Section**: Dedicated "Scan Diff Product View" section with summary cards and signals impact list.
