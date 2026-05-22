# Controlled Offline Import Dry Run

This feature enables an offline, local-only dry run of an import process using bundled scan evidence.

- **Status:** Experimental / Prototype
- **Nature:** Local, Static, Offline-only
- **Scope:** Processes data from locally created scan export bundles.
- **Constraints:** This does not interact with any production backend systems, remote Supabase instances, or external APIs. All data processing and ledger generation happens in the local `tmp/` directory.
