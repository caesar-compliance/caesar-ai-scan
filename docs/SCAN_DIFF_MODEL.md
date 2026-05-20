# Scan Diff Model

## Purpose
Provide governance teams with a deterministic view of what changed between two Caesar AI Scan runs.

## Stable Comparison Key
Each finding is compared using a stable key: `category + detector + rule_id + matched_name + file_path`. Timestamps and random IDs are excluded so diffs are purely content-driven.

## Diff Categories
- **added_findings**: Findings present in current run but not baseline.
- **removed_findings**: Findings present in baseline but not current run.
- **changed_findings**: Findings present in both but with different content (excluding IDs).
- **unchanged_findings**: Identical findings in both runs.

## First-Run Behaviour
When no baseline exists, all findings are listed as added and the diff notes "First run recorded."

## Output Files
- `history-index.json` — index of all runs
- `latest-diff.json` — machine-readable diff
- `latest-diff.md` — human-readable diff report

## Constraints
- Scan diffs are governance review aids, not legal conclusions.
- No real scan history should be published to site/data.
