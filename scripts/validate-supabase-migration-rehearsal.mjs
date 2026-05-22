import fs from 'node:fs/promises';
import path from 'node:path';

const SCHEMA_PATH = 'schemas/supabase-migration-rehearsal.schema.json';
const FORWARD_SQL = 'docs/backend/supabase/rehearsal/001_ai_scan_storage_schema.rehearsal.sql';
const ROLLBACK_SQL = 'docs/backend/supabase/rehearsal/001_ai_scan_storage_schema.rollback.rehearsal.sql';
const MANIFEST_PATH = 'docs/backend/supabase/rehearsal/migration-rehearsal.manifest.json';

const REQUIRED_TABLES = [
  'ai_scan_projects',
  'ai_scan_runs',
  'ai_scan_findings',
  'ai_inventory_components',
  'ai_review_items',
  'ai_import_ledger'
];

const REHEARSAL_MARKERS = ['DRAFT', 'LOCAL REHEARSAL ONLY', 'NOT APPLIED'];

const FORBIDDEN_PATTERNS = [
  { name: 'supabase_url', re: /https:\/\/[a-z0-9]+\.supabase\.co/i },
  { name: 'project_ref', re: /project_ref["\s:]+(?!REPLACE_ME)[a-z0-9]{8,}/i },
  { name: 'service_role_key', re: /SUPABASE_SERVICE_ROLE_KEY\s*=\s*(?!REPLACE_ME)/i },
  { name: 'bearer_token', re: /Bearer\s+[A-Za-z0-9._-]{20,}/ },
  { name: 'cloudflare_account', re: /cloudflare_account_id["\s:]+(?!REPLACE_ME)[a-f0-9]{16,}/i },
  { name: 'workers_dev', re: /https:\/\/[a-z0-9-]+\.[a-z0-9-]+\.workers\.dev/i },
  { name: 'email', re: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/ }
];

const FORBIDDEN_PATHS = [
  'supabase/config.toml',
  'wrangler.toml',
  'supabase/migrations',
  'migrations'
];

const DB_CLIENT_DEPS = ['pg', '@supabase/supabase-js', 'postgres', 'knex', 'drizzle-orm'];

function assertRehearsalMarkers(content, label) {
  for (const marker of REHEARSAL_MARKERS) {
    if (!content.includes(marker)) {
      throw new Error(`${label} missing marker: ${marker}`);
    }
  }
}

function stableStringify(value) {
  if (Array.isArray(value)) {
    return `[${value.map((item) => stableStringify(item)).join(',')}]`;
  }
  if (value && typeof value === 'object') {
    const keys = Object.keys(value).sort();
    return `{${keys.map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`).join(',')}}`;
  }
  return JSON.stringify(value);
}

async function exists(relPath) {
  try {
    await fs.access(relPath);
    return true;
  } catch {
    return false;
  }
}

async function validateNoActiveMigrationDirs() {
  const candidates = ['supabase/migrations', 'migrations', 'supabase'];
  for (const relPath of candidates) {
    if (relPath === 'supabase' && !(await exists(relPath))) continue;
    if (relPath !== 'supabase' && (await exists(relPath))) {
      throw new Error(`Active migration directory must not exist: ${relPath}`);
    }
  }
  if (await exists('supabase/config.toml')) {
    throw new Error('supabase/config.toml must not exist');
  }
}

async function validateManifestDeterministic(manifest) {
  const raw = await fs.readFile(MANIFEST_PATH, 'utf8');
  const reparsed = JSON.parse(raw);
  if (stableStringify(reparsed) !== stableStringify(manifest)) {
    throw new Error('Manifest is not deterministic (key ordering or formatting drift)');
  }
}

async function validate() {
  const requiredPaths = [SCHEMA_PATH, FORWARD_SQL, ROLLBACK_SQL, MANIFEST_PATH];
  for (const relPath of requiredPaths) {
    if (!(await exists(relPath))) {
      throw new Error(`Missing required rehearsal file: ${relPath}`);
    }
  }

  for (const relPath of FORBIDDEN_PATHS) {
    if (await exists(relPath)) {
      throw new Error(`Forbidden path present: ${relPath}`);
    }
  }

  await validateNoActiveMigrationDirs();

  const schema = JSON.parse(await fs.readFile(SCHEMA_PATH, 'utf8'));
  const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf8'));
  const forwardSql = await fs.readFile(FORWARD_SQL, 'utf8');
  const rollbackSql = await fs.readFile(ROLLBACK_SQL, 'utf8');

  if (schema.schema_version !== '0.27.0') {
    throw new Error('Schema version must be 0.27.0');
  }
  if (manifest.rehearsal_status !== 'local_only_not_applied') {
    throw new Error('Manifest rehearsal_status must be local_only_not_applied');
  }

  assertRehearsalMarkers(forwardSql, 'Forward rehearsal SQL');
  assertRehearsalMarkers(rollbackSql, 'Rollback rehearsal SQL');

  for (const table of REQUIRED_TABLES) {
    if (!forwardSql.includes(table)) {
      throw new Error(`Forward SQL missing table: ${table}`);
    }
    if (!rollbackSql.includes(table)) {
      throw new Error(`Rollback SQL missing table: ${table}`);
    }
  }

  const corpus = [forwardSql, rollbackSql, JSON.stringify(manifest), JSON.stringify(schema)].join('\n');
  for (const { name, re } of FORBIDDEN_PATTERNS) {
    if (re.test(corpus)) {
      throw new Error(`Forbidden pattern in rehearsal corpus: ${name}`);
    }
  }

  const pkg = JSON.parse(await fs.readFile('package.json', 'utf8'));
  const depNames = Object.keys({ ...pkg.dependencies, ...pkg.devDependencies });
  for (const dep of DB_CLIENT_DEPS) {
    if (depNames.includes(dep)) {
      throw new Error(`DB client dependency must not be added: ${dep}`);
    }
  }

  if (pkg.version !== '0.27.0') {
    throw new Error('package.json version must be 0.27.0');
  }
  if (!pkg.scripts['validate:supabase-rehearsal'] || !pkg.scripts['supabase:migration-rehearsal-report']) {
    throw new Error('package.json missing supabase rehearsal scripts');
  }
  const offline = pkg.scripts['check:all-offline'] || '';
  const draftIdx = offline.indexOf('validate:supabase-draft');
  const workerIdx = offline.indexOf('validate:worker-boundary');
  const rehearsalIdx = offline.indexOf('validate:supabase-rehearsal');
  if (!(draftIdx >= 0 && workerIdx > draftIdx && rehearsalIdx > workerIdx)) {
    throw new Error('check:all-offline must order validate:supabase-draft, validate:worker-boundary, validate:supabase-rehearsal');
  }

  await validateManifestDeterministic(manifest);

  const reportModule = await fs.readFile('src/supabase-rehearsal/supabase-migration-rehearsal-report.mjs', 'utf8');
  if (reportModule.includes('fetch(') || reportModule.includes('https://')) {
    throw new Error('Report module must not perform external fetching');
  }

  console.log('✅ Supabase migration rehearsal validation PASSED.');
}

validate().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
