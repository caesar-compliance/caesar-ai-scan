# Validation Log — T004 Scan Configuration & Scope Control

This document records the programmatic validation, fixture structures, and execution plans for the T004 milestone.

---

## 🚦 Fixture Project Folder Structure

The test fixture is located at `fixtures/sample-ai-project/`.

```text
fixtures/sample-ai-project/
├── .caesarignore
├── caesar-scan.config.json
├── .env.example
├── package.json
├── requirements.txt
├── prompts/
│   └── system.prompt.md
├── src/
│   └── example.js
├── generated/
│   └── ignored-ai-noise.js (Excluded)
└── tmp/
    └── ignored-output.json (Excluded)
```

---

## 🧪 Validation Script Strategy (`scripts/validate-scope-control.mjs`)

The programmatic validation script executes six distinct testing blocks:

1. **Glob Translation Matchers:**
   - Translates `*.js` and asserts match success on `foo.js` and failure on `foo.py`.
   - Translates `dist/` and asserts match success on `dist` and subpaths, and failure on `src/dist`.
   - Translates `**/*.py` and asserts match success on nested `.py` files.
2. **Caesarignore Parser:**
   - Asserts that patterns `generated/` and `tmp/` are loaded and parsed successfully.
3. **Dynamic Standard Directory Skip Simulation:**
   - Programmatically creates dummy `.git`, `node_modules`, and `venv` folders containing mock files.
   - Runs `resolveScanScope()` and asserts they are successfully classified as `skipped` with the `standard_ignore` rationale.
   - Restores the clean state by deleting all temporary mock folders.
4. **Scope Resolution Assertions:**
   - Runs `resolveScanScope()` on the target fixture project.
   - Asserts that `package.json`, `src/example.js`, `.env.example`, `requirements.txt`, and `prompts/system.prompt.md` are inside the `included` array.
   - Asserts that `generated/ignored-ai-noise.js` and `tmp/ignored-output.json` are inside the `excluded` array.
5. **Options Merging Strategy:**
   - Runs `resolveScanScope()` with runtime command overrides (e.g. adding custom `exclude` for `src/example.js`).
   - Asserts that `src/example.js` is correctly moved from `included` to `excluded` state.
6. **Scan Isolation Bounds:**
   - Runs `runScan()` on the fixture.
   - Asserts that the total scan findings count is exactly **11**.
   - Asserts that zero findings originate from the ignored directories or files.
