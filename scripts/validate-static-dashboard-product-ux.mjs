import fs from 'node:fs';
import path from 'node:path';

const DASHBOARD_PATH = 'site/index.html';
const FORBIDDEN_FILES = [
  'supabase/config.toml',
  'supabase/migrations/',
  'docker-compose.yml',
  'Dockerfile',
  'wrangler.toml'
];
const FORBIDDEN_DEPS = [
  'pg',
  'postgres',
  '@supabase/supabase-js',
  'knex',
  'drizzle-orm'
];

async function validateDashboard() {
  console.log('--- Validating Static Dashboard Product UX ---');

  if (!fs.existsSync(DASHBOARD_PATH)) {
    console.error(`❌ Dashboard entry file not found: ${DASHBOARD_PATH}`);
    process.exit(1);
  }

  const content = fs.readFileSync(DASHBOARD_PATH, 'utf8');

  const requiredSections = [
    'Product Status',
    'Local Demo Readiness',
    'Backend Execution Disabled',
    'Live Services Disabled',
    'Product Loop Readiness',
    'AI Usage Inventory',
    'Export Bundle Readiness',
    'Scan Diff Product View',
    'Safety Gates'
  ];

  for (const section of requiredSections) {
    if (!content.includes(section)) {
      console.error(`❌ Missing required section: ${section}`);
      process.exit(1);
    }
  }

  if (!content.includes('LOCAL-ONLY') && !content.includes('Local-Only')) {
    console.error('❌ Missing Local-Only/Safety banner');
    process.exit(1);
  }

  // Check for T024 gate closed status (Postgres harness gate)
  if (!content.includes('T024') || !content.includes('Gate Closed')) {
    console.warn('⚠️ Warning: T024 Gate Closed status not found in dashboard content. Ensure it appears in the output.');
  }

  // Check for external URLs
  const externalUrlMatch = content.match(/https?:\/\/(?!ai-scan\.caesar\.no|github\.com\/caesar-compliance)[^\s"']+/g);
  if (externalUrlMatch) {
    const forbiddenUrls = externalUrlMatch.filter(url => 
      !url.includes('fonts.googleapis.com') && 
      !url.includes('fonts.gstatic.com') &&
      !url.includes('cdn.jsdelivr.net') &&
      !url.includes('cdnjs.cloudflare.com')
    );
    // Actually, the prompt says "no external CDN/script/font URLs"
    if (externalUrlMatch.some(url => url.includes('cdn') || url.includes('font') || url.includes('analytics'))) {
       console.error('❌ Forbidden external CDN/script/font URLs found');
       process.exit(1);
    }
  }

  // Check forbidden files
  for (const file of FORBIDDEN_FILES) {
    if (fs.existsSync(file)) {
      console.error(`❌ Forbidden file exists: ${file}`);
      process.exit(1);
    }
  }

  // Check forbidden dependencies in package.json
  const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  const deps = { ...pkg.dependencies, ...pkg.devDependencies };
  for (const dep of FORBIDDEN_DEPS) {
    if (deps[dep]) {
      console.error(`❌ Forbidden dependency found: ${dep}`);
      process.exit(1);
    }
  }

  console.log('✅ Static Dashboard Product UX validation PASSED');
}

validateDashboard().catch(err => {
  console.error(err);
  process.exit(1);
});
