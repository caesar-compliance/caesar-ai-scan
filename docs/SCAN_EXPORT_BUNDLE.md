# Scan Export Bundle

This document describes the Backend-Ready Scan Export Bundle format (v0.11.0).

## Overview
The scan export bundle is an offline, deterministic artifact containing scan results, AI usage inventory, and review workflow status. It is designed to be ingested by a future backend system in a secure, manual-review-gated manner.

## Bundle Structure
- `manifest.json`: Bundle metadata, checksums, and safety flags.
- `scan-result.json`: The raw static analysis scan findings.
- `evidence-candidates.json`: (Optional) Evidence associated with findings.
- `review-summary.md`: Human-readable summary of the bundle for manual review.

## Import Contract
- Bundle status: `candidate`
- Backend ready: `true`
- Review required: `true`
- Ingestion mode: `offline_review_only`

## Safety
- Secrets redacted
- No external connectivity required
- Deterministic output
