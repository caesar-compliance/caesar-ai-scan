# Cloudflare Worker API Boundary (v0.19.0)

Defines the future Cloudflare Worker read-only API surface and the local route mock contract used in T019.

## Overview
- Hosted Worker (future): GET-only routes over Supabase-backed storage.
- Local mock (now): `src/cloudflare-worker/local-worker-route-mock.mjs` serves static API projection JSON from `tmp/sample-api-projection/`.
- No Wrangler deploy, Cloudflare API calls, or live Supabase connections in this repository version.

## Artifacts
- `schemas/cloudflare-worker-boundary.schema.json`
- `config/cloudflare-worker.boundary.example.json`
- `.env.cloudflare-worker.example`
- `docs/backend/cloudflare/WORKER_ROUTE_CONTRACT.md`
- `docs/backend/cloudflare/CORS_AND_SECURITY_BOUNDARY.md`

## Validation
- `npm run worker:route-sample`
- `npm run validate:worker-boundary`
