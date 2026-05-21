# Implementation Report: T007

## Summary
Completed implementation of T007 / v0.8.0, exposing safe sample/demo scan history and diff information on the public static site.

## Changes:
1. **Diff Logic**: Updated `src/history/scan-diff-builder.mjs` to accurately match and diff findings by normalizing findings (removing finding_id) to content-based MD5 hashes.
2. **Site Build**: Updated `scripts/build-site.mjs` to copy and include `sample-history-summary.json` and `sample-latest-diff.json` in the public static site build.
3. **Site UI**: Updated `site/index.html` and `site/assets/site.js` to add a new "Scan History / Diff" tab for visualizing the demo history.
4. **Metadata**: Updated `package.json`, `PROJECT_STATE.md`, `README.md`, `CHANGELOG.md` to reflect v0.8.0 status.
5. **Validation**: Strengthened validation in `scripts/validate-site.mjs` and `scripts/validate-scan-history.mjs`.

## Validation:
- All offline validation steps in `npm run check:all-offline` passed.
- No secrets or real paths found in demo output.
- History diff accounting logic validated to be correct for sample project.
