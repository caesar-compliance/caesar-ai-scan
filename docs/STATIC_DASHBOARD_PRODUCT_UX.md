# Static Dashboard Product UX

This document describes the upgraded product-centric dashboard for Caesar AI Scan.

## Overview
The Caesar AI Scan dashboard has been upgraded to provide a product-like experience for local demos. It visualizes the entire local governance pipeline, from initial scanning to safety gate validation.

## Key Features
- **Product Status & Readiness**: High-level badges showing local demo and product loop status.
- **Backend Safety Indicators**: Explicit visual confirmation that backend execution and live services are disabled.
- **Product Loop Timeline**: A detailed view of each pipeline stage (Scanner, Review, Pack, etc.) with status, outputs, and safety notes.
- **AI Usage Inventory**: Interactive browser for scan findings, history, evidence candidates, and review workflows.
- **Safety Gates**: Visualization of local rehearsals for SQL and Postgres, ensuring the tool remains safe and air-gapped.

## How to Run Locally

### 1. Generate Local Data
The dashboard reads static JSON files. Ensure they are generated:
```bash
npm run build:site
```

### 2. Open the Dashboard
Open `site/index.html` in your browser.

## Data Sources
The dashboard reads from the following local paths:
- `site/data/site-build.json`: Build metadata.
- `site/data/sample-scan-result.json`: Core scan findings.
- `site/data/product-loop-readiness-report.json`: Product loop status.
- `site/data/rehearsal/local-postgres-compile-harness-enable-gate-report.json`: T024 safety gate.
- `site/data/rehearsal/sql-compile-rehearsal-report.json`: SQL rehearsal status.

## Safety & Air-Gap
- **No External Fetching**: The dashboard only uses the local `fetch` API to read relative JSON files.
- **No Live DB**: All database-related sections are rehearsals or stubs.
- **No Remote Assets**: No external fonts, scripts, or analytics are used.

## Next Product Step
The recommended next step is **T027 / v0.27.0 — Scan Diff Product View**, focusing on improving the visualization of changes between scan runs.
