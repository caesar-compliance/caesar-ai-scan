
> caesar-ai-scan@0.8.0 check:all-offline
> npm run check:syntax && npm run scan:sample && npm run validate:samples && npm run review:sample && npm run validate:review && npm run pack:sample && npm run validate:pack && npm run scope:sample && npm run validate:scope && npm run validate:history && npm run build:site && npm run validate:site


> caesar-ai-scan@0.8.0 check:syntax
> node scripts/check-syntax.mjs

Checking syntax for 42 files...
✅ Syntax check passed for all files.

> caesar-ai-scan@0.8.0 scan:sample
> node src/cli.mjs fixtures/sample-ai-project --format json --out tmp/sample-scan-result.json --export-evidence-candidates tmp/sample-evidence-candidates.json

⚙️ Loaded scan configuration from: /Users/nazarkoartem/Desktop/Projects/caesar-compliance/caesar-ai-scan/fixtures/sample-ai-project/caesar-scan.config.json
🔍 Starting Caesar AI Static Scan on target: /Users/nazarkoartem/Desktop/Projects/caesar-compliance/caesar-ai-scan/fixtures/sample-ai-project...
✅ Scan completed. Found 11 AI usage signals.
📁 Scan report written to: tmp/sample-scan-result.json
📁 Evidence export candidates written to: tmp/sample-evidence-candidates.json

> caesar-ai-scan@0.8.0 validate:samples
> node scripts/validate-samples.mjs

🚀 Running programmatic scan results validation...
🔍 Total findings parsed from fixture project: 11
  - Dependency findings count: 4
  - Env var findings count: 3
  - Prompt findings count: 1
  - Vector DB findings count: 3
✅ All programmatic validation assertions PASSED successfully.

> caesar-ai-scan@0.8.0 review:sample
> node src/cli.mjs fixtures/sample-ai-project --format json --out tmp/sample-scan-result.json --export-evidence-candidates tmp/sample-evidence-candidates.json --review-out tmp/sample-review-workflow.json --review-report tmp/sample-review-workflow.md

⚙️ Loaded scan configuration from: /Users/nazarkoartem/Desktop/Projects/caesar-compliance/caesar-ai-scan/fixtures/sample-ai-project/caesar-scan.config.json
🔍 Starting Caesar AI Static Scan on target: /Users/nazarkoartem/Desktop/Projects/caesar-compliance/caesar-ai-scan/fixtures/sample-ai-project...
✅ Scan completed. Found 11 AI usage signals.
📁 Scan report written to: tmp/sample-scan-result.json
📁 Review workflow written to: tmp/sample-review-workflow.json
📁 Review report written to: tmp/sample-review-workflow.md
📁 Evidence export candidates written to: tmp/sample-evidence-candidates.json

> caesar-ai-scan@0.8.0 validate:review
> node scripts/validate-review-workflow.mjs

🧪 Starting Caesar review workflow validation suite...
✅ Review workflow validation PASSED successfully!

> caesar-ai-scan@0.8.0 pack:sample
> node src/cli.mjs fixtures/sample-ai-project --format json --out tmp/sample-scan-result.json --export-evidence-candidates tmp/sample-evidence-candidates.json --review-out tmp/sample-review-workflow.json --review-report tmp/sample-review-workflow.md --export-pack tmp/sample-evidence-export-pack

⚙️ Loaded scan configuration from: /Users/nazarkoartem/Desktop/Projects/caesar-compliance/caesar-ai-scan/fixtures/sample-ai-project/caesar-scan.config.json
🔍 Starting Caesar AI Static Scan on target: /Users/nazarkoartem/Desktop/Projects/caesar-compliance/caesar-ai-scan/fixtures/sample-ai-project...
✅ Scan completed. Found 11 AI usage signals.
📁 Scan report written to: tmp/sample-scan-result.json
📁 Review workflow written to: tmp/sample-review-workflow.json
📁 Review report written to: tmp/sample-review-workflow.md
📁 Evidence export candidates written to: tmp/sample-evidence-candidates.json
📁 Evidence export pack written to: tmp/sample-evidence-export-pack

> caesar-ai-scan@0.8.0 validate:pack
> node scripts/validate-export-pack.mjs


[34m==================================================[0m
🛡️  Caesar AI Compliance: Starting Export Pack Audit
📂 Target Directory: tmp/sample-evidence-export-pack
[34m==================================================[0m

  [✅] export-pack.json exists and is non-empty (112270 bytes).
  [✅] manifest.json exists and is non-empty (1362 bytes).
  [✅] scan-result.json exists and is non-empty (6904 bytes).
  [✅] evidence-candidates.json exists and is non-empty (39459 bytes).
  [✅] review-workflow.json exists and is non-empty (43603 bytes).
  [✅] import-readiness.json exists and is non-empty (7594 bytes).
  [✅] human-review-checklist.json exists and is non-empty (8480 bytes).
  [✅] REVIEW_SUMMARY.md exists and is non-empty (11140 bytes).

  [32mAll JSON files are valid and parseable.[0m

🔍 Checking Manifest Mappings & Cryptographic SHA-256 Hashes:
  [✅] scan-result.json hash matches manifest exactly: [32m1197ec80...[0m
  [✅] evidence-candidates.json hash matches manifest exactly: [32m5b7db2af...[0m
  [✅] review-workflow.json hash matches manifest exactly: [32m3da3578c...[0m
  [✅] import-readiness.json hash matches manifest exactly: [32mf503a790...[0m
  [✅] human-review-checklist.json hash matches manifest exactly: [32m2c5eff6f...[0m

🔍 Verifying In-Memory Alignment with Parent Export Pack:
  [✅] Nested 'manifest' matches standalone file exactly.
  [✅] Nested 'scan_result' matches standalone file exactly.
  [✅] Nested 'evidence_candidates' matches standalone file exactly.
  [✅] Nested 'review_workflow' matches standalone file exactly.
  [✅] Nested 'import_readiness' matches standalone file exactly.
  [✅] Nested 'human_review_checklist' matches standalone file exactly.

🔍 Checking Schema Versions:
  [✅] export-pack.json is compliant with schema version 0.5.0.
  [✅] scan-result.json is compliant with schema version 0.5.0.
  [✅] review-workflow.json is compliant with schema version 0.5.0.
  [✅] manifest.json is compliant with schema version 0.5.0.

🔒 Asserting Export Pack Security & Policy Enforcements:
  Checking Policy A (Draft Hardlock Boundary)...
  [✅] Policy A Enforced: All 11 evidence candidates are hard-locked to draft status with review required.
  Checking Policy B (Automated Ingestion Isolation)...
  [✅] Policy B Enforced: Automated import is disabled, manual sign-off required.
  Checking Policy C (Secret Exposure Safety Flag)...
  [✅] Policy C Enforced: Plaintext credential flags align perfectly with scan findings.

[32m==================================================[0m
🎉 Caesar AI Compliance: Export Pack Audit PASSED!
   The generated package is offline, secure, and fully compliant.
[32m==================================================[0m


> caesar-ai-scan@0.8.0 scope:sample
> node src/cli.mjs fixtures/sample-ai-project --format json --out tmp/sample-scan-result.json --scope-out tmp/sample-scope.json --scope-report tmp/sample-scope.md

⚙️ Loaded scan configuration from: /Users/nazarkoartem/Desktop/Projects/caesar-compliance/caesar-ai-scan/fixtures/sample-ai-project/caesar-scan.config.json
🔍 Starting Caesar AI Static Scan on target: /Users/nazarkoartem/Desktop/Projects/caesar-compliance/caesar-ai-scan/fixtures/sample-ai-project...
✅ Scan completed. Found 11 AI usage signals.
📁 Scope JSON report written to: tmp/sample-scope.json
📁 Scope Markdown report written to: tmp/sample-scope.md
📁 Scan report written to: tmp/sample-scan-result.json

> caesar-ai-scan@0.8.0 validate:scope
> node scripts/validate-scope-control.mjs

🚀 Running programmatic Scope Control and Configuration validation...
🧪 Testing glob-to-regex translation rules...
✅ Glob-to-regex translation tested successfully.
🧪 Testing .caesarignore parser...
✅ .caesarignore parsed successfully.
🧪 Setting up dynamic mock items to test standard directory skipping...
🧪 Resolving scan scope for target fixture directory...
📂 Included files: [
  '.caesarignore',
  '.env.example',
  'caesar-scan.config.json',
  'package.json',
  'prompts/system.prompt.md',
  'requirements.txt',
  'src/example.js'
]
🚫 Excluded files: [
  {
    relativePath: 'generated/ignored-ai-noise.js',
    reason: 'ignored_by_pattern: generated/'
  },
  {
    relativePath: 'tmp/ignored-output.json',
    reason: 'ignored_by_pattern: tmp/'
  }
]
⚙️ Skipped files & folders: [
  {
    relativePath: '.git',
    reason: 'standard_ignore',
    type: 'directory'
  },
  {
    relativePath: 'node_modules',
    reason: 'standard_ignore',
    type: 'directory'
  },
  {
    relativePath: 'venv',
    reason: 'standard_ignore',
    type: 'directory'
  }
]
✅ Scope and exclusion boundaries resolved and verified.
🧹 Cleaning up temporary standard folders...
🧪 Testing priority merged options and CLI custom excludes...
✅ CLI options and local configuration merges verified.
🧪 Executing full scan orchestration with scope filters...
✅ Full static scan correctly filtered out the ignored AI noise.
🎉 All Scope Control and Configuration validation assertions PASSED successfully!

> caesar-ai-scan@0.8.0 validate:history
> node scripts/validate-scan-history.mjs

🚀 Starting Caesar Scan History validation suite (v0.8.0)...
🧹 Cleaning tmp/sample-history...
🧪 Executing Run 1...
⚙️ Loaded scan configuration from: /Users/nazarkoartem/Desktop/Projects/caesar-compliance/caesar-ai-scan/fixtures/sample-ai-project/caesar-scan.config.json
🔍 Starting Caesar AI Static Scan on target: /Users/nazarkoartem/Desktop/Projects/caesar-compliance/caesar-ai-scan/fixtures/sample-ai-project...
✅ Scan completed. Found 11 AI usage signals.
📁 Scan report written to: tmp/sample-scan-result.json
📁 Review workflow written to: tmp/sample-review-workflow.json
📁 Evidence export candidates written to: tmp/sample-evidence-candidates.json
📁 Evidence export pack written to: tmp/sample-evidence-export-pack
📂 Scan run recorded to history: /Users/nazarkoartem/Desktop/Projects/caesar-compliance/caesar-ai-scan/tmp/sample-history/runs/run_2026-05-21T15-00-02-234Z_359a
📁 Scan diff JSON written to: /Users/nazarkoartem/Desktop/Projects/caesar-compliance/caesar-ai-scan/tmp/sample-history/latest-diff.json
📁 Scan diff report written to: /Users/nazarkoartem/Desktop/Projects/caesar-compliance/caesar-ai-scan/tmp/sample-history/latest-diff.md
🧪 Executing Run 2...
⚙️ Loaded scan configuration from: /Users/nazarkoartem/Desktop/Projects/caesar-compliance/caesar-ai-scan/fixtures/sample-ai-project/caesar-scan.config.json
🔍 Starting Caesar AI Static Scan on target: /Users/nazarkoartem/Desktop/Projects/caesar-compliance/caesar-ai-scan/fixtures/sample-ai-project...
✅ Scan completed. Found 11 AI usage signals.
📁 Scan report written to: tmp/sample-scan-result.json
📁 Review workflow written to: tmp/sample-review-workflow.json
📁 Evidence export candidates written to: tmp/sample-evidence-candidates.json
📁 Evidence export pack written to: tmp/sample-evidence-export-pack
📂 Scan run recorded to history: /Users/nazarkoartem/Desktop/Projects/caesar-compliance/caesar-ai-scan/tmp/sample-history/runs/run_2026-05-21T15-00-02-295Z_7197
📁 Scan diff JSON written to: /Users/nazarkoartem/Desktop/Projects/caesar-compliance/caesar-ai-scan/tmp/sample-history/latest-diff.json
📁 Scan diff report written to: /Users/nazarkoartem/Desktop/Projects/caesar-compliance/caesar-ai-scan/tmp/sample-history/latest-diff.md
✅ history-index.json valid (2 runs, latest: run_2026-05-21T15-00-02-295Z_7197)
✅ All 2 run directories validated.
✅ latest-diff.json valid (Diff accounting correct): +0 added, -0 removed, 11 unchanged, ~0 changed
✅ latest-diff.md exists and is non-empty.
✅ No real API secrets detected in history output.
🎉 All scan history validation assertions PASSED successfully!

> caesar-ai-scan@0.8.0 build:site
> node scripts/build-site.mjs

🚀 Starting Public static site build pipeline...
📊 Reusing existing sample outputs from tmp/ directory.
📁 Copied: site/data/sample-scan-result.json
📁 Copied: site/data/sample-evidence-candidates.json
📁 Copied: site/data/sample-review-workflow.json
📁 Copied: site/data/sample-export-pack-manifest.json
📁 Copied: site/data/sample-import-readiness.json
📁 Copied: site/data/sample-history-summary.json
📁 Copied: site/data/sample-latest-diff.json
📁 Wrote Build Metadata: site/data/site-build.json
🎉 Public static site build pipeline COMPLETED successfully!

> caesar-ai-scan@0.8.0 validate:site
> node scripts/validate-site.mjs

🚀 Starting programmatic static site validation suite...
✅ Programmatic static site validation suite PASSED successfully!
