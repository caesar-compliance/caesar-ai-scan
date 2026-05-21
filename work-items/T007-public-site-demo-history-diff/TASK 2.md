# Task: T007 / v0.8.0 — Public Site Demo History + Diff Presentation

**Goal:** Expose safe sample/demo scan history and latest diff information on the public static site, without implementing real monitoring, external fetching, live scanning, PR annotations, database ingestion, or Governance OS ingestion.

## Key Requirements:
1. **Fix scan diff accounting:** Ensure findings are correctly compared and tracked (additions/removals/unchanged).
2. **Build public demo history/diff data:** Generate sanitized `sample-history-summary.json` and `sample-latest-diff.json` files for the static site.
3. **Data Contract Compliance:** Ensure UI matches current JSON structure and add clear demo disclaimers.
4. **Validation:** Extend site validator to check history data presence and safety.
5. **Metadata Update:** Bump project version to 0.8.0.
