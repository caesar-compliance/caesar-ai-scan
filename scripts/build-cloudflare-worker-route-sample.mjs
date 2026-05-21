import fs from 'node:fs/promises';
import path from 'node:path';
import { buildWorkerRouteManifest } from '../src/cloudflare-worker/local-worker-route-mock.mjs';

const projectionDir = path.resolve('tmp/sample-api-projection');
const outPath = path.resolve('tmp/sample-cloudflare-worker-route-manifest.json');

async function build() {
  const manifest = await buildWorkerRouteManifest(projectionDir);
  await fs.mkdir(path.dirname(outPath), { recursive: true });
  await fs.writeFile(outPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`✅ Worker route manifest written to ${outPath}`);
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
