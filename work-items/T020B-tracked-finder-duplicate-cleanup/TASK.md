# T020B: Remove Tracked Finder Duplicate Files

Clean up 47 macOS Finder duplicate files that were accidentally committed before T020A added `.gitignore` protection for future `* 2.*` through `* 9.*` patterns.

## Deliverables
- Remove all tracked Finder duplicate paths from git and disk
- Work-item documentation and validation record
- Clean working tree on `main` after merge

## Scope
Repository hygiene only. No product behavior changes.

## Safety
- No Supabase or Cloudflare connections
- No deployments, migrations, or live backend actions
- No secrets or account emails in commits
- T021 not started
