import fs from 'fs';
import path from 'path';

const manifestPath = 'docs/backend/supabase/local-compile-harness/local-postgres-compile-harness-enable-gate.manifest.json';
const outputPath = 'site/data/rehearsal/local-postgres-compile-harness-enable-gate-report.json';

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));

// Verify manifest exists and is closed
if (manifest.status !== 'closed' || manifest.enabled !== false || manifest.execution_allowed_now !== false) {
    throw new Error('Gate is not closed or disabled as required!');
}

const report = {
    ...manifest,
    timestamp: new Date().toISOString(),
    status_verified: true,
    safety_boundary_confirmed: true
};

if (!fs.existsSync('site/data/rehearsal')) {
  fs.mkdirSync('site/data/rehearsal', { recursive: true });
}

fs.writeFileSync(outputPath, JSON.stringify(report, null, 2));
console.log('Report generated at:', outputPath);
