import fs from 'node:fs/promises';
import path from 'node:path';
import { buildMigrationRehearsalReport } from '../src/supabase-rehearsal/supabase-migration-rehearsal-report.mjs';

const outPath = path.resolve('tmp/supabase-migration-rehearsal-report.md');

async function build() {
  const report = await buildMigrationRehearsalReport();
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, report.endsWith('\n') ? report : `${report}\n`);
  console.log(`✅ Rehearsal report written to ${outPath}`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
