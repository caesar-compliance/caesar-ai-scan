# Static Dashboard Prototype

This feature generates a local, static HTML dashboard to visualize scan results and API projections.

- **Status:** Experimental / Prototype
- **Nature:** Local, Static, Offline-only
- **Scope:** Reads generated static data files from the project repository.
- **Constraints:** This does not use a live backend server or dynamic database connections. The dashboard is rendered purely from static JSON files in the `site/data/` or `tmp/` directories.
