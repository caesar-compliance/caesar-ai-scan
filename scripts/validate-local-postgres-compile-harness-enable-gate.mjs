import fs from 'fs';

const manifestPath = 'docs/backend/supabase/local-compile-harness/local-postgres-compile-harness-enable-gate.manifest.json';
const reportPath = 'site/data/rehearsal/local-postgres-compile-harness-enable-gate-report.json';

if (!fs.existsSync(manifestPath)) throw new Error('Manifest missing');
if (!fs.existsSync(reportPath)) throw new Error('Report missing');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const report = JSON.parse(fs.readFileSync(reportPath, 'utf8'));

if (manifest.status !== 'closed') throw new Error('Gate must be closed');
if (manifest.enabled !== false) throw new Error('Gate must be disabled');
if (manifest.execution_allowed_now !== false) throw new Error('Execution must be forbidden');

console.log('Validation passed: Enablement Gate is safely closed.');
