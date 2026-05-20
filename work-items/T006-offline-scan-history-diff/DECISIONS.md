# Decisions — T006

## Decision 1: Stable Finding Keys
Use category + detector + rule_id + matched_name + file_path as the stable comparison key for diff. Timestamps and random IDs (finding_id) are excluded from diff comparison.

## Decision 2: Local Filesystem Only
History stored under `.caesar/history/` for production use and `tmp/sample-history/` for samples. No database or external service involved.

## Decision 3: First-Run Handling
When no baseline exists, all current findings are listed as added and diff notes it as "First run recorded."

## Decision 4: No Site Publication
History data must never be copied into site/data. The validate:history script confirms this.
