# RLS and Access Boundary (Draft)

This document outlines the planned security model for Caesar AI Scan's future Supabase implementation.

## Security Model
- **Isolation:** Multi-tenant architecture via `tenant_id` on all primary tables.
- **Access Control:** Row-level security (RLS) enabled on all tables, restricted by `auth.uid()`.
- **Infrastructure:**
  - Supabase/Postgres.
  - No secrets stored in repository.
  - Server-side generated IDs only.

## Status in T018
- **Draft Only:** This is a design-only document.
- **No Implementation:** No RLS policies or migrations have been applied.
