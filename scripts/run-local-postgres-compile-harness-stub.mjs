import { readFileSync, writeFileSync } from 'fs';
import { join } from 'path';

const stubManifestPath = join(process.cwd(), 'docs/backend/supabase/local-compile-harness/local-postgres-compile-harness-stub.manifest.json');
const reportOutputPath = join(process.cwd(), 'site/data/rehearsal/local-postgres-compile-harness-stub-report.json');

const stubManifest = JSON.parse(readFileSync(stubManifestPath, 'utf8'));

const report = {
  timestamp: new Date().toISOString(),
  stub_id: stubManifest.stub_id,
  status: "disabled",
  executed_sql: false,
  invoked_docker: false,
  invoked_psql: false,
  invoked_supabase_cli: false,
  connected_to_database: false,
  applied_migrations: false,
  requires_future_gate: true,
  notes: "Stub enabled in safe mode. No execution attempted."
};

writeFileSync(reportOutputPath, JSON.stringify(report, null, 2));
console.log('Stub report generated successfully.');
