# Validation: T017

## Automated
- `npm run validate:backend-boundary` validates contract, config, and env templates.

## Manual
- Check that no real values are present in tracked files.
- Verify that `ingestion_enabled` is false in all configurations.
