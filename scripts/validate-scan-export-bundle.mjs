import fs from 'node:fs/promises';
import { resolve } from 'node:path';
import { execSync } from 'node:child_process';

async function validateBundle(bundleDir) {
  const manifestPath = resolve(bundleDir, 'manifest.json');
  const scanResultPath = resolve(bundleDir, 'scan-result.json');
  const summaryPath = resolve(bundleDir, 'review-summary.md');
  
  console.log('🚀 Validating Scan Export Bundle...');

  // Check existence
  await fs.access(manifestPath);
  await fs.access(scanResultPath);
  await fs.access(summaryPath);

  const manifest = JSON.parse(await fs.readFile(manifestPath, 'utf8'));
  
  // Basic Schema Validation
  if (manifest.schema_version !== '0.11.0') throw new Error('Invalid schema version');
  if (manifest.import_contract.import_status !== 'candidate') throw new Error('Invalid import status');
  if (manifest.safety.secrets_redacted !== true) throw new Error('Safety check failed');

  console.log('✅ Bundle validation PASSED successfully.');
}

async function main() {
  const bundleDir = resolve('tmp/sample-scan-export-bundle');
  
  console.log('📦 Generating Sample Bundle...');
  execSync(`node src/cli.mjs fixtures/sample-ai-frameworks-project --format json --out tmp/sample-scan-result.json --bundle-dir ${bundleDir}`, { stdio: 'inherit' });
  
  await validateBundle(bundleDir);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
