import fs from 'node:fs/promises';
import path from 'node:path';

const REQUIRED_FILES = [
  'schemas/cloudflare-worker-boundary.schema.json',
  'config/cloudflare-worker.boundary.example.json',
  '.env.cloudflare-worker.example',
  'src/cloudflare-worker/cloudflare-worker-boundary.mjs',
  'src/cloudflare-worker/local-worker-route-mock.mjs',
  'docs/CLOUDFLARE_WORKER_API_BOUNDARY.md',
  'docs/backend/cloudflare/WORKER_ROUTE_CONTRACT.md',
  'docs/backend/cloudflare/CORS_AND_SECURITY_BOUNDARY.md'
];

const REQUIRED_ROUTES = [
  '/health',
  '/dashboard-summary',
  '/scan-runs',
  '/findings',
  '/inventory-components',
  '/review-items',
  '/import-ledger',
  '/manifest'
];

const FORBIDDEN_PATTERNS = [
  { name: 'supabase_url', re: /https:\/\/[a-z0-9]+\.supabase\.co/i },
  { name: 'service_role_key', re: /SUPABASE_SERVICE_ROLE_KEY\s*=\s*(?!REPLACE_ME)/i },
  { name: 'cloudflare_account', re: /cloudflare_account_id["\s:]+(?!REPLACE_ME)[a-f0-9]{16,}/i },
  { name: 'workers_dev_url', re: /https:\/\/[a-z0-9-]+\.[a-z0-9-]+\.workers\.dev/i },
  { name: 'bearer_token', re: /Bearer\s+[A-Za-z0-9._-]{20,}/ },
  { name: 'email', re: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/ }
];

const FORBIDDEN_PATHS = ['wrangler.toml', 'supabase/config.toml'];

async function fileExists(relPath) {
  try {
    await fs.access(relPath);
    return true;
  } catch {
    return false;
  }
}

async function readTrackedText(relPaths) {
  const chunks = [];
  for (const relPath of relPaths) {
    if (!(await fileExists(relPath))) continue;
    chunks.push(await fs.readFile(relPath, 'utf8'));
  }
  return chunks.join('\n');
}

async function validate() {
  for (const relPath of REQUIRED_FILES) {
    if (!(await fileExists(relPath))) {
      throw new Error(`Missing required file: ${relPath}`);
    }
  }

  for (const relPath of FORBIDDEN_PATHS) {
    if (await fileExists(relPath)) {
      throw new Error(`Forbidden config present: ${relPath}`);
    }
  }

  const schema = JSON.parse(await fs.readFile('schemas/cloudflare-worker-boundary.schema.json', 'utf8'));
  if (schema.schema_version !== '0.19.0') {
    throw new Error('Invalid cloudflare worker boundary schema version');
  }
  if (!schema.safety?.no_worker_deployment) {
    throw new Error('Worker boundary must declare no_worker_deployment');
  }

  const config = JSON.parse(await fs.readFile('config/cloudflare-worker.boundary.example.json', 'utf8'));
  if (config.deployment_enabled !== false) {
    throw new Error('deployment_enabled must be false in worker boundary config');
  }
  if (config.cloudflare_account_id !== 'REPLACE_ME') {
    throw new Error('cloudflare_account_id must use REPLACE_ME placeholder');
  }

  const env = await fs.readFile('.env.cloudflare-worker.example', 'utf8');
  if (!env.includes('REPLACE_ME')) {
    throw new Error('.env.cloudflare-worker.example must use REPLACE_ME placeholders');
  }
  if (env.includes('CAESAR_AI_SCAN_WORKER_DEPLOYMENT_ENABLED=true')) {
    throw new Error('Worker deployment must remain disabled in example env');
  }

  const routeContract = await fs.readFile('docs/backend/cloudflare/WORKER_ROUTE_CONTRACT.md', 'utf8');
  for (const route of REQUIRED_ROUTES) {
    if (!routeContract.includes(route)) {
      throw new Error(`Route contract missing ${route}`);
    }
  }

  const corpus = await readTrackedText([
    'schemas/cloudflare-worker-boundary.schema.json',
    'config/cloudflare-worker.boundary.example.json',
    '.env.cloudflare-worker.example',
    'src/cloudflare-worker/cloudflare-worker-boundary.mjs',
    'src/cloudflare-worker/local-worker-route-mock.mjs',
    'scripts/build-cloudflare-worker-route-sample.mjs',
    'scripts/validate-cloudflare-worker-boundary.mjs',
    'docs/CLOUDFLARE_WORKER_API_BOUNDARY.md',
    'docs/backend/cloudflare/WORKER_ROUTE_CONTRACT.md',
    'docs/backend/cloudflare/CORS_AND_SECURITY_BOUNDARY.md'
  ]);

  for (const { name, re } of FORBIDDEN_PATTERNS) {
    if (re.test(corpus)) {
      throw new Error(`Forbidden pattern detected (${name}) in worker boundary corpus`);
    }
  }

  const pkg = JSON.parse(await fs.readFile('package.json', 'utf8'));
  if (!pkg.scripts['worker:route-sample'] || !pkg.scripts['validate:worker-boundary']) {
    throw new Error('package.json missing worker scripts');
  }
  if (!pkg.scripts['check:all-offline']?.includes('validate:worker-boundary')) {
    throw new Error('check:all-offline must include validate:worker-boundary');
  }

  console.log('✅ Cloudflare Worker boundary validation PASSED.');
}

validate().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
