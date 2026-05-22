import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const reportPath = join(process.cwd(), 'site/data/rehearsal/local-postgres-compile-harness-stub-report.json');
const manifestPath = join(process.cwd(), 'docs/backend/supabase/local-compile-harness/local-postgres-compile-harness-stub.manifest.json');

if (!existsSync(reportPath)) {
  console.error('Report file does not exist.');
  process.exit(1);
}

const report = JSON.parse(readFileSync(reportPath, 'utf8'));

if (report.status !== 'disabled' || report.executed_sql || report.invoked_docker || report.invoked_psql || report.invoked_supabase_cli || report.connected_to_database || report.applied_migrations || !report.requires_future_gate) {
  console.error('Report indicates forbidden activity.');
  process.exit(1);
}

if (!existsSync(manifestPath)) {
    console.error('Manifest file missing.');
    process.exit(1);
}

console.log('Validation passed.');
