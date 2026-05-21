import fs from 'node:fs/promises';
import path from 'node:path';

const BOUNDARY_SCHEMA_PATH = 'schemas/cloudflare-worker-boundary.schema.json';
const CONFIG_PATH = 'config/cloudflare-worker.boundary.example.json';

export const WORKER_ROUTES = [
  { method: 'GET', path: '/health', projectionFile: 'health.json' },
  { method: 'GET', path: '/dashboard-summary', projectionFile: 'dashboard-summary.json' },
  { method: 'GET', path: '/scan-runs', projectionFile: 'scan-runs.json' },
  { method: 'GET', path: '/findings', projectionFile: 'findings.json' },
  { method: 'GET', path: '/inventory-components', projectionFile: 'inventory-components.json' },
  { method: 'GET', path: '/review-items', projectionFile: 'review-items.json' },
  { method: 'GET', path: '/import-ledger', projectionFile: 'import-ledger.json' },
  { method: 'GET', path: '/manifest', projectionFile: 'manifest.json' }
];

export async function loadCloudflareWorkerBoundary() {
  const schema = JSON.parse(await fs.readFile(BOUNDARY_SCHEMA_PATH, 'utf8'));
  const config = JSON.parse(await fs.readFile(CONFIG_PATH, 'utf8'));
  return { schema, config, routes: WORKER_ROUTES };
}

export function resolveProjectionPath(projectionDir, route) {
  return path.join(projectionDir, route.projectionFile);
}
