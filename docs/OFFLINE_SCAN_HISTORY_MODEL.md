# Offline Scan History Model

## Concept
The offline scan history model enables stateful comparison of Caesar AI Scans over time entirely within the local filesystem.

## Directory Structure
```
.caesar/history/
  ├── index.json
  ├── run-<timestamp-1>.json
  └── run-<timestamp-2>.json
```

## Diffing Strategy
When a new scan is executed, it is compared against the most recent run in the history index to produce a delta (new findings, resolved findings).

## Status
Implemented in T006 / v0.7.0.
