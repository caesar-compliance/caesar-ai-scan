import fs from 'fs/promises';
import path from 'path';

export async function validateBackendRuntimeBoundary() {
  console.log('🧪 Validating backend runtime boundary...');

  const contractPath = 'schemas/backend-runtime-contract.schema.json';
  const configPath = 'config/backend-runtime.boundary.example.json';
  const envPath = '.env.backend-runtime.example';

  const contract = JSON.parse(await fs.readFile(contractPath, 'utf8'));
  const config = JSON.parse(await fs.readFile(configPath, 'utf8'));
  const env = await fs.readFile(envPath, 'utf8');

  // Schema Validation
  if (contract.schema_version !== '0.17.0') throw new Error('Invalid schema version');

  // Config Validation
  if (config.ingestion_enabled !== false) throw new Error('Ingestion must be disabled');
  if (config.supabase_project_ref !== 'REPLACE_ME') throw new Error('Config contains real Supabase ID');

  // Env Validation
  if (!env.includes('REPLACE_ME')) throw new Error('Env contains real values');
  if (env.includes('CAESAR_AI_SCAN_INGESTION_ENABLED=true')) throw new Error('Ingestion enabled in env');

  console.log('✅ Backend runtime boundary validated successfully.');
}

validateBackendRuntimeBoundary().catch(err => {
  console.error(err);
  process.exit(1);
});
