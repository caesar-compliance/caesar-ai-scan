# VALIDATION: T008 AI Scan Reference Lab

## Core Repo Validation
- [x] `npm run check:syntax`
- [x] `npm run check:all-offline` (All samples and site build pass)

## Reference Lab Validation
- [x] `../_reference-lab/scan/README.md` exists.
- [x] `../_reference-lab/scan/REFERENCE_INDEX.json` exists and is valid.
- [x] All 20 approved repos successfully cloned.
- [x] `npm run reference:scan:setup` runs correctly (idempotent).

## Documentation Validation
- [x] `docs/REFERENCE_LAB_POLICY.md` exists.
- [x] `docs/OPEN_SOURCE_REFERENCE_AUDIT.md` contains all 20 repos.
- [x] `docs/SCANNER_FEATURE_MATRIX.md` highlights next tasks.
- [x] `docs/BIG_PLAYER_PRODUCT_BENCHMARKS.md` covers major platforms.
- [x] `.gitignore` includes defensive ignores for the lab.
