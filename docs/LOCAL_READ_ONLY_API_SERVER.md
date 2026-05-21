# Local Read-Only API Server Prototype

T016 introduces a localhost-only read-only API server prototype. 
It serves generated sample API projection JSON files to demonstrate 
the product's API-first architectural goal while remaining fully 
offline and secure.

## Features
- Read-only HTTP GET support.
- Serves endpoints: /health, /dashboard-summary, /manifest, etc.
- No database connections, no external dependencies, no real ingestion.

## Usage
```bash
npm run api:serve-local
```

## Security
- Runs locally (127.0.0.1) only.
- No production backend or migrations.
