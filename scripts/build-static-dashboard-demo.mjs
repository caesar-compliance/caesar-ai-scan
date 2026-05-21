import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'fs';
import { resolve, join } from 'path';

const rootDir = resolve('.');
const siteDataDir = join(rootDir, 'site', 'data', 'dashboard');

if (!existsSync(siteDataDir)) {
  mkdirSync(siteDataDir, { recursive: true });
}

// Reuse T014 sample API projection data (manifest.json generated in tmp/)
// In a real scenario, this would read from the api-projection dir
const sampleApiDir = join(rootDir, 'tmp', 'sample-api-projection');
if (!existsSync(sampleApiDir)) {
  console.error('❌ T014 API projection not found. Run api:sample first.');
  process.exit(1);
}

const manifest = JSON.parse(readFileSync(join(sampleApiDir, 'manifest.json'), 'utf8'));

// Generate dashboard data
const dashboardData = {
  manifest,
  health: { status: "ok", version: "0.15.0", timestamp: new Date().toISOString() },
  summary: {
    title: "Caesar AI Scan Dashboard (Demo)",
    total_findings: manifest.counts.finding_count,
    inventory_components: manifest.counts.inventory_component_count,
    review_required: manifest.counts.review_item_count
  },
  inventory_components: [
    { type: "Provider SDK", count: 3 },
    { type: "Orchestration Framework", count: 4 },
    { type: "RAG/Vector Stack", count: 5 }
  ]
};

writeFileSync(join(siteDataDir, 'manifest.json'), JSON.stringify(manifest, null, 2));
writeFileSync(join(siteDataDir, 'health.json'), JSON.stringify(dashboardData.health, null, 2));
writeFileSync(join(siteDataDir, 'dashboard-summary.json'), JSON.stringify(dashboardData.summary, null, 2));
writeFileSync(join(siteDataDir, 'inventory-components.json'), JSON.stringify(dashboardData.inventory_components, null, 2));

console.log('✅ Static dashboard demo data generated in site/data/dashboard/');
