# Decisions: T026 Static Dashboard Product UX Upgrade

## Dashboard Layout
We chose a modern, card-based layout with a sidebar-like navigation header. This makes the tool feel like a professional product rather than a simple JSON viewer.

## Data Population
The dashboard remains strictly static. We use the `fetch` API in `site.js` to load relative JSON files from `site/data/`. This preserves the air-gapped nature of the tool while allowing for a dynamic-feeling UI.

## Safety & UX Validator
A new validator `validate-static-dashboard-product-ux.mjs` was created to enforce:
- Presence of required product sections.
- Presence of safety banners.
- Absence of external URLs (CDNs, fonts, analytics).
- Absence of forbidden files (Supabase config, Dockerfiles, etc.).
- Correct versioning.

## Version Bump
Bumped to 0.26.0 to reflect the significant UX and documentation improvements.
