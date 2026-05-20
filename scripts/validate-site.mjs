import { existsSync, readFileSync, readdirSync } from 'fs';
import { resolve, join, dirname } from 'path';

const __dirname = dirname(new URL(import.meta.url).pathname);
const rootDir = resolve(__dirname, '..');

function assert(condition, message) {
  if (!condition) {
    throw new Error(`❌ Assertion Failed: ${message}`);
  }
}

function runSiteValidation() {
  console.log('🚀 Starting programmatic static site validation suite...');

  const siteDir = join(rootDir, 'site');

  // 1. Verify existence of core files
  const indexHtmlPath = join(siteDir, 'index.html');
  const cnamePath = join(siteDir, 'CNAME');
  const cssPath = join(siteDir, 'assets', 'site.css');
  const jsPath = join(siteDir, 'assets', 'site.js');

  assert(existsSync(indexHtmlPath), 'site/index.html must exist');
  assert(readFileSync(indexHtmlPath, 'utf8').trim().length > 0, 'site/index.html must be non-empty');

  // 2. Verify CNAME content
  assert(existsSync(cnamePath), 'site/CNAME must exist');
  const cnameContent = readFileSync(cnamePath, 'utf8').trim();
  assert(cnameContent === 'ai-scan.caesar.no', `site/CNAME must contain exactly "ai-scan.caesar.no", got "${cnameContent}"`);

  // 3. Verify CSS and JS assets
  assert(existsSync(cssPath), 'site/assets/site.css must exist');
  assert(existsSync(jsPath), 'site/assets/site.js must exist');

  // 4. Verify index.html does not include external CDN, analytics, or external font links
  const indexContent = readFileSync(indexHtmlPath, 'utf8');
  
  // Assert no script tags pull from external hosts
  const externalScriptRegex = /<script\s+[^>]*src=["'](https?:\/\/|\/\/)[^"']+["']/i;
  assert(!externalScriptRegex.test(indexContent), 'site/index.html must NOT reference any external CDN/JS scripts');

  // Assert no link tags pull from external hosts (except mailto/tel or external links in <a href>)
  const externalStylesheetRegex = /<link\s+[^>]*href=["'](https?:\/\/|\/\/)[^"']+["']/i;
  assert(!externalStylesheetRegex.test(indexContent), 'site/index.html must NOT reference any external stylesheets/fonts');

  // Assert no analytics scripts (Google Analytics, Mixpanel, Fathom, etc.)
  const analyticsKeywords = ['google-analytics.com', 'googletagmanager.com', 'mixpanel', 'amplitude', 'fathom'];
  for (const keyword of analyticsKeywords) {
    assert(!indexContent.includes(keyword), `site/index.html must NOT contain tracking analytics: ${keyword}`);
  }

  // 5. Verify data JSON files exist and parse
  const dataDir = join(siteDir, 'data');
  assert(existsSync(dataDir), 'site/data directory must exist');

  const requiredDataFiles = [
    'sample-scan-result.json',
    'sample-evidence-candidates.json',
    'sample-review-workflow.json',
    'sample-export-pack-manifest.json',
    'sample-import-readiness.json',
    'site-build.json'
  ];

  for (const file of requiredDataFiles) {
    const filePath = join(dataDir, file);
    assert(existsSync(filePath), `site/data/${file} must exist`);
    
    let parsed;
    try {
      parsed = JSON.parse(readFileSync(filePath, 'utf8'));
    } catch (e) {
      assert(false, `site/data/${file} must be a valid JSON file. Error: ${e.message}`);
    }

    // Safety checks against secrets in data files
    const stringified = JSON.stringify(parsed);
    const secretKeywords = ['sk-proj-', 'secret-', 'password-', 'private-key-'];
    for (const keyword of secretKeywords) {
      assert(!stringified.includes(keyword), `site/data/${file} must NOT contain potential secrets: ${keyword}`);
    }
    
    // Check for api-key- and ensure it doesn't represent a real key (excluding the harmless mock placeholder)
    if (stringified.includes('api-key-')) {
      const isPlaceholder = stringified.includes('your-openai-api-key-here') || stringified.includes('placeholder-value-for-anthropic-key');
      assert(isPlaceholder, `site/data/${file} must NOT contain potential secrets: api-key-`);
    }
  }

  // 6. Verify site-build.json properties
  const buildInfo = JSON.parse(readFileSync(join(dataDir, 'site-build.json'), 'utf8'));
  assert(buildInfo.version, 'site-build.json must contain a version string');
  assert(buildInfo.public_domain === 'ai-scan.caesar.no', `site-build.json public_domain must be "ai-scan.caesar.no", got "${buildInfo.public_domain}"`);
  assert(Array.isArray(buildInfo.included_data_files), 'site-build.json must include included_data_files list');
  assert(buildInfo.included_data_files.length === 5, 'site-build.json must record all 5 sample data files');

  console.log('✅ Programmatic static site validation suite PASSED successfully!');
}

try {
  runSiteValidation();
  process.exit(0);
} catch (error) {
  console.error(error.stack || error.message);
  process.exit(1);
}
