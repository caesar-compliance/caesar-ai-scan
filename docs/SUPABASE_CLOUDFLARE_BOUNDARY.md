# Supabase/Cloudflare Boundary (T017)

This document describes the planned boundary between the Caesar AI Scan backend readiness phase and external hosting providers like Supabase and Cloudflare.

## Architecture Decisions
- Caesar AI Scan will use Supabase for persistent data storage of scan runs, findings, and inventory.
- Cloudflare Workers will serve the read-only API surface.
- All backend communication will be strictly read-only or authorized via service roles.
- No live ingestion or external API fetching is performed from within the scanner CLI.

## Safety
- All environment variables are handled via local `.env` files which are not tracked by Git.
- Configurations use strictly placeholders.
