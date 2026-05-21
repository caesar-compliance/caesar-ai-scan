# Cloudflare Worker API Boundary

This document defines the boundary for the future Cloudflare Worker implementation in Caesar AI Scan.

## Overview
The Cloudflare Worker will serve as the read-only API layer, projecting data from the backend/storage.

## Contract
- The worker operates in read-only mode.
- All routes are GET-based.
- No database writes, no live ingestion, and no external fetching are permitted.

## Boundary Security
- No secrets (API tokens, database credentials) are tracked in the repository.
- All configurations use placeholder patterns.
- CORS policy is enforced to allow only authorized origins (drafted).
