# T020B Decisions

## Remove duplicates from git history index only
Tracked Finder duplicates (`* 2.*` … `* 9.*`) are accidental copies of real files. Delete from git and disk; canonical paths remain.

## Do not change `.gitignore`
T020A already ignores future Finder duplicates. This task only removes files that were committed before that protection.

## Restore generated artifacts before commit
Validation may regenerate timestamps/IDs in `site/data/*`. Those are non-deterministic sample outputs; restore to HEAD before commit unless the repo requires otherwise.

## No functional changes
No scanner rules, API behavior, Supabase draft, Worker boundary, or site product changes in this task.
