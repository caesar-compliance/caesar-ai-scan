# T020B Validation

## Pre-cleanup
- `main` at `ed0b066` with `.gitignore` Finder duplicate patterns from T020A
- Dirty `site/data/*` artifacts restored via `git checkout -- site/data`
- 47 tracked duplicate paths inventoried; no package/script/source references

## Commands
- `npm run check:syntax`
- `npm run validate:samples` through `npm run check:all-offline` (full offline validation suite per task spec)
- `find scripts src -name "*.mjs" -o -name "*.js" | xargs -I{} node --check {}`
- `git diff --check`

## Checks
- All validation commands pass
- Active paths unchanged; duplicates not referenced by `package.json`, `scripts`, `src`, or fixtures
- Root pollution check empty before commit
- Generated `site/data/*` restored before commit unless required for consistency

## Post-cleanup
- Commit: `chore(T020B): remove tracked Finder duplicate files`
- Branch merged to `main` if validation passed
