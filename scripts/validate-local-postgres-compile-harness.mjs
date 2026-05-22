import fs from 'node:fs/promises';

const MANIFEST_PATH = 'docs/backend/supabase/local-compile-harness/local-postgres-compile-harness.manifest.json';
const REPORT_PATH = 'site/data/rehearsal/local-postgres-compile-harness-report.json';

async function validate() {
  const manifest = JSON.parse(await fs.readFile(MANIFEST_PATH, 'utf8'));
  const report = JSON.parse(await fs.readFile(REPORT_PATH, 'utf8'));

  if (manifest.status !== 'design_only') throw new Error('Status must be design_only');
  if (manifest.no_execution_now !== true) throw new Error('no_execution_now must be true');
  if (manifest.future_gate_required !== true) throw new Error('future_gate_required must be true');

  console.log('Validation successful');
}

await validate();
