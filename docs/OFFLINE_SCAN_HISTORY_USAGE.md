# Offline Scan History Usage

## Overview
Caesar AI Scan supports local offline scan history via filesystem-only storage.

> **This is offline local history only.** No scheduler, live monitor, or CI integration is included.

## Usage

```bash
node src/cli.mjs <target> \
  --format json \
  --out tmp/scan-result.json \
  --export-evidence-candidates tmp/evidence-candidates.json \
  --review-out tmp/review-workflow.json \
  --history-dir .caesar/history \
  --record-history \
  --diff-previous \
  --history-report .caesar/history/latest-diff.md
```

## Output Structure
```
.caesar/history/
  ├── history-index.json
  ├── latest-diff.json
  ├── latest-diff.md
  └── runs/
      └── run_<id>/
          ├── scan-run.json
          ├── scan-result.json
          ├── evidence-candidates.json
          └── review-workflow.json
```

## Constraints
- No scheduler is included.
- No live monitoring service is included.
- No GitHub Action workspace scanning is included.
- Do not publish history to site/data.
- Scan diffs are governance review aids, not legal conclusions.
