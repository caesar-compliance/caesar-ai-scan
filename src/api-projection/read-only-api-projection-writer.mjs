import fs from 'fs/promises';
import path from 'path';

export async function writeApiProjection(projection, outputDir) {
  await fs.mkdir(outputDir, { recursive: true });
  
  await fs.writeFile(path.join(outputDir, 'manifest.json'), JSON.stringify(projection, null, 2));
  
  // Create minimal endpoint placeholders based on manifest, real impl would copy actual data
  const health = { status: "ok", version: "0.14.0" };
  await fs.writeFile(path.join(outputDir, 'health.json'), JSON.stringify(health, null, 2));
  
  // Dummy data for remaining files
  await fs.writeFile(path.join(outputDir, 'dashboard-summary.json'), JSON.stringify({}, null, 2));
  await fs.writeFile(path.join(outputDir, 'scan-runs.json'), JSON.stringify([], null, 2));
  await fs.writeFile(path.join(outputDir, 'findings.json'), JSON.stringify([], null, 2));
  await fs.writeFile(path.join(outputDir, 'inventory-components.json'), JSON.stringify([], null, 2));
  await fs.writeFile(path.join(outputDir, 'review-items.json'), JSON.stringify([], null, 2));
  await fs.writeFile(path.join(outputDir, 'import-ledger.json'), JSON.stringify([], null, 2));
}
