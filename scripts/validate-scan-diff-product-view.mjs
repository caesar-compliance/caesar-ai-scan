import { readFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';

const rootDir = resolve('.');
const reportPath = join(rootDir, 'site', 'data', 'scan-diff-product-view.json');
const schemaPath = join(rootDir, 'schemas', 'scan-diff-product-view.schema.json');

console.log('🔍 Validating Scan Diff Product View...');

if (!existsSync(reportPath)) {
  console.error(`❌ Report not found at ${reportPath}`);
  process.exit(1);
}

const report = JSON.parse(readFileSync(reportPath, 'utf8'));

// Simple manual schema check for MVP (can use ajv if available, but staying lightweight)
const requiredFields = [
  'version', 'generated_at', 'diff_status', 'summary', 'sections', 
  'backend_execution_enabled', 'live_services_enabled'
];

for (const field of requiredFields) {
  if (report[field] === undefined) {
    console.error(`❌ Missing required field: ${field}`);
    process.exit(1);
  }
}

if (report.backend_execution_enabled !== false) {
  console.error('❌ backend_execution_enabled must be false');
  process.exit(1);
}

if (report.live_services_enabled !== false) {
  console.error('❌ live_services_enabled must be false');
  process.exit(1);
}

// Check for forbidden sections
if (!report.sections.added_signals || !report.sections.affected_files) {
  console.error('❌ Missing required sections');
  process.exit(1);
}

// Verify no forbidden dependencies in the builder (manual check of the script itself)
const builderSource = readFileSync(join(rootDir, 'scripts', 'build-scan-diff-product-view.mjs'), 'utf8');
const forbiddenImports = ['child_process', 'pg', 'supabase', 'knex', 'drizzle'];
for (const imp of forbiddenImports) {
  if (builderSource.includes(imp)) {
    console.error(`❌ Forbidden import detected in builder: ${imp}`);
    process.exit(1);
  }
}

console.log('✅ Scan Diff Product View is valid.');
