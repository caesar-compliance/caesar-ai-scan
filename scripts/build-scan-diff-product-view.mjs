import { writeFileSync, readFileSync, existsSync, mkdirSync } from 'fs';
import { resolve, join } from 'path';
import { generateScanDiffProductView, generateSampleDiffProductView } from '../src/scan-diff-product/scan-diff-product-view-report.mjs';

const rootDir = resolve('.');
const siteDataDir = join(rootDir, 'site', 'data');
const historySampleDiff = join(rootDir, 'tmp', 'sample-history', 'latest-diff.json');

if (!existsSync(siteDataDir)) {
  mkdirSync(siteDataDir, { recursive: true });
}

async function build() {
  console.log('🚀 Building Scan Diff Product View...');
  
  let productView;
  
  if (existsSync(historySampleDiff)) {
    console.log(`📖 Reading raw diff from ${historySampleDiff}`);
    try {
      const rawDiff = JSON.parse(readFileSync(historySampleDiff, 'utf8'));
      productView = generateScanDiffProductView(rawDiff);
    } catch (err) {
      console.error('❌ Failed to parse existing history diff. Falling back to sample.', err);
      productView = generateSampleDiffProductView();
      productView.diff_status = "sample_only";
    }
  } else {
    console.log('⚠️ No local history diff found. Generating sample product view.');
    productView = generateSampleDiffProductView();
    productView.diff_status = "sample_only";
  }

  const outputPath = join(siteDataDir, 'scan-diff-product-view.json');
  writeFileSync(outputPath, JSON.stringify(productView, null, 2));
  
  console.log(`✅ Scan Diff Product View generated at ${outputPath}`);
  console.log(`📊 Summary: ${productView.summary.added_count} added, ${productView.summary.removed_count} removed, ${productView.summary.changed_count} changed.`);
}

build().catch(err => {
  console.error('💥 Build failed:', err);
  process.exit(1);
});
