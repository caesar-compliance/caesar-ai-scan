# Architectural Decisions Log — T004

This log details key architectural decisions made during the implementation of the Scan Configuration & Scope Control system.

---

## 🏛️ ADR 4: Zero-Dependency Glob-to-Regex Ignore Matching

### Context
`caesar-ai-scan` is committed to being an air-gapped, zero-dependency static scanner. Adding standard packages like `minimatch` or `glob` would violate our clean-room core boundaries and introduce unverified code supply chains.

### Decision
Implement a pure, self-contained glob-to-regex translator within `src/scanner/scope-resolver.mjs`.
* Converts standard gitignore patterns like `*.js`, `dist/`, and recursive wildcards `**/*.py` into robust native JavaScript `RegExp` objects.
* Evaluates directory exclusions progressively by checking all path prefixes (e.g. `src`, `src/ignored-folder` for a file at `src/ignored-folder/main.js`). This ensures that if a parent folder is ignored, its contents are skipped immediately, preventing redundant filesystem calls.

---

## 🏛️ ADR 5: Progressive Option Merging Hierarchy

### Context
Users must be able to specify scanner parameters both via code/file parameters and command line overrides during shell runtimes. We require a robust, predictable priority sequence.

### Decision
Define a clear merge priority sequence in `src/cli.mjs`:
1. **Runtime CLI Override Options** (Highest priority)
2. **Local `caesar-scan.config.json`** (Specified via `--config` or discovered in target/cwd)
3. **Scanner Default Behaviors** (Lowest priority)

If custom `--exclude <patterns>` CLI flags are passed, they are merged (concatenated) with any `exclude` items parsed from the loaded config file to ensure comprehensive coverage.
