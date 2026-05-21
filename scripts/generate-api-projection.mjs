import { readFileSync } from 'fs';
import path from 'path';
import { resolve } from 'path';
import { runLocalJsonStoreAdapter } from '../src/backend-adapter/local-json-store-adapter.mjs';
import { buildApiProjection } from '../src/api-projection/read-only-api-projection-builder.mjs';
import { writeApiProjection } from '../src/api-projection/read-only-api-projection-writer.mjs';

async function run() {
  const rootDir = resolve('.');
  const dryRunPath = path.join(rootDir, 'tmp', 'sample-import-dry-run.json');
  const storeDir = path.join(rootDir, 'tmp', 'sample-json-store');
  const outputDir = path.join(rootDir, 'tmp', 'sample-api-projection');

  console.log('📦 Generating local JSON store...');
  await runLocalJsonStoreAdapter(dryRunPath, storeDir);

  console.log('🚀 Generating API projection from store...');
  const projection = await buildApiProjection(storeDir);
  await writeApiProjection(projection, outputDir);
  console.log('✅ Generated sample API projection in ' + outputDir);
}

run().catch(console.error);
