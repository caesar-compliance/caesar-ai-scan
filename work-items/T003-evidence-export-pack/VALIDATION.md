# Validation Report: T003 — Evidence Export Pack

This document details the automated verification assertions, validation commands, and test outcomes for the Evidence Export Pack.

---

## 🧪 Verification Assertions

The verification script `scripts/validate-export-pack.mjs` executes the following 6 validation blocks:

1. **Physical File Verification:** Asserts that all 8 required files (`export-pack.json`, `manifest.json`, `scan-result.json`, `evidence-candidates.json`, `review-workflow.json`, `import-readiness.json`, `human-review-checklist.json`, `REVIEW_SUMMARY.md`) exist, are parseable as valid JSON (where applicable), and are non-empty.
2. **Cryptographic Checksum Verification:** Asserts that calculated SHA-256 hashes of all disk files match the values recorded in `manifest.hash_summary` exactly.
3. **In-Memory Parent Pack Consistency:** Asserts that nested structures inside the unified `export-pack.json` match their standalone counterparts exactly.
4. **Schema Versioning Constraints:** Enforces that `schema_version` is locked to `"0.4.0"` across all files.
5. **Security Isolation Policies Enforcements:**
   - **Policy A:** Verifies all 11 candidates in `evidence-candidates.json` are strictly status `"draft"` with `review_required: true`.
   - **Policy B:** Verifies `import_readiness.can_import_automatically` is `false`, and `human_review_checklist.signoff_required` is `true`.
   - **Policy C:** Verifies that the credential exposure flag aligns perfectly with the 3 environment var findings in the scan results.

---

## 📈 Test Execution Log

The validation suite is invoked via:
```bash
npm run check:all-offline
```

All 7 pipeline stages run successfully:
```
1. check:syntax         - Passed
2. scan:sample         - Passed (11 AI usage signals parsed)
3. validate:samples    - Passed
4. review:sample       - Passed (Review JSON & markdown report written)
5. validate:review     - Passed
6. pack:sample         - Passed (Self-contained export pack created)
7. validate:pack       - Passed (Checksums, alignment, and policies verified)
```

---

*Verified locally. Zero runtime dependency requirements. Fully offline compliance staging.*
