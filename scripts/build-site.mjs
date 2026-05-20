import { existsSync, mkdirSync, readFileSync, writeFileSync, copyFileSync } from 'fs';
import { resolve, join, dirname } from 'path';
import { execSync } from 'child_process';

const __dirname = dirname(new URL(import.meta.url).pathname);
const rootDir = resolve(__dirname, '..');

function getSourceCommit() {
  try {
    return execSync('git rev-parse HEAD', { cwd: rootDir, encoding: 'utf8' }).trim();
  } catch (e) {
    return 'unknown_or_no_git';
  }
}

async function buildSite() {
  console.log('🚀 Starting Public static site build pipeline...');

  const packageJsonPath = join(rootDir, 'package.json');
  const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
  const version = pkg.version || '0.6.0';

  const tmpDir = join(rootDir, 'tmp');
  const siteDataDir = join(rootDir, 'site', 'data');

  // Ensure directories exist
  if (!existsSync(siteDataDir)) {
    mkdirSync(siteDataDir, { recursive: true });
  }

  // Ensure sample outputs are generated in tmp
  const requiredTmpFiles = [
    'sample-scan-result.json',
    'sample-evidence-candidates.json',
    'sample-review-workflow.json',
    join('sample-evidence-export-pack', 'manifest.json'),
    join('sample-evidence-export-pack', 'import-readiness.json')
  ];

  let missingFiles = requiredTmpFiles.some(f => !existsSync(join(tmpDir, f)));

  if (missingFiles) {
    console.log('⚠️ Some sample output artifacts are missing. Running sample scans & exports to generate them...');
    try {
      execSync('npm run pack:sample', { cwd: rootDir, stdio: 'inherit' });
      execSync('npm run scope:sample', { cwd: rootDir, stdio: 'inherit' });
      console.log('✅ Temporary sample outputs generated successfully.');
    } catch (err) {
      console.error('❌ Failed to automatically generate missing sample outputs:', err.message);
      process.exit(1);
    }
  } else {
    console.log('📊 Reusing existing sample outputs from tmp/ directory.');
  }

  // Mappings to copy
  const copyMappings = [
    { src: join(tmpDir, 'sample-scan-result.json'), dest: join(siteDataDir, 'sample-scan-result.json') },
    { src: join(tmpDir, 'sample-evidence-candidates.json'), dest: join(siteDataDir, 'sample-evidence-candidates.json') },
    { src: join(tmpDir, 'sample-review-workflow.json'), dest: join(siteDataDir, 'sample-review-workflow.json') },
    { src: join(tmpDir, 'sample-evidence-export-pack', 'manifest.json'), dest: join(siteDataDir, 'sample-export-pack-manifest.json') },
    { src: join(tmpDir, 'sample-evidence-export-pack', 'import-readiness.json'), dest: join(siteDataDir, 'sample-import-readiness.json') }
  ];

  // Perform copying
  for (const mapping of copyMappings) {
    if (existsSync(mapping.src)) {
      copyFileSync(mapping.src, mapping.dest);
      console.log(`📁 Copied: ${mapping.dest.replace(rootDir + '/', '')}`);
    } else {
      console.error(`❌ Critical File Missing: ${mapping.src}`);
      process.exit(1);
    }
  }

  // Generate site-build.json metadata
  const buildInfo = {
    version: version,
    generated_at: new Date().toISOString(),
    source_commit: getSourceCommit(),
    source_tool: 'caesar-ai-site-builder',
    public_domain: 'ai-scan.caesar.no',
    included_data_files: copyMappings.map(m => m.dest.split('/').pop()),
    safety_notes: [
      'This data represents synthetically generated compliance static test results.',
      'No real production secrets, API credentials, or customer code details were published.',
      'All evidence candidates are static drafts requiring active human auditor certifications.'
    ]
  };

  const buildInfoPath = join(siteDataDir, 'site-build.json');
  writeFileSync(buildInfoPath, JSON.stringify(buildInfo, null, 2), 'utf8');
  console.log(`📁 Wrote Build Metadata: ${buildInfoPath.replace(rootDir + '/', '')}`);

  console.log('🎉 Public static site build pipeline COMPLETED successfully!');
}

buildSite().catch(err => {
  console.error('❌ Critical Error during site build:', err.stack || err.message);
  process.exit(1);
});
