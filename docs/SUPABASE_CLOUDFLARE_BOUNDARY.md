# Supabase/Cloudflare Boundary (v0.20.0)

Planned split between Supabase/Postgres storage (T018 draft) and Cloudflare Worker read-only API delivery (T019 boundary).

## Layers
| Layer | Status | Artifact |
| :--- | :--- | :--- |
| Storage draft | T018 / local draft SQL | `docs/backend/supabase/001_ai_scan_storage_schema.draft.sql` |
| Worker API boundary | T019 / local mock only | `schemas/cloudflare-worker-boundary.schema.json` |
| Migration rehearsal | T020 / local only, not applied | `docs/backend/supabase/rehearsal/` |

## Safety
- Placeholders only (`REPLACE_ME`) in tracked config and env examples.
- No `supabase/config.toml`, no `wrangler.toml`, no applied migrations.
- Scanner CLI remains offline; no live ingestion or external fetching.
