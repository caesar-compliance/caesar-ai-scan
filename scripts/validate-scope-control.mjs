import { existsSync, mkdirSync, writeFileSync, rmSync } from 'fs';
import { resolve, join } from 'path';
import { globToRegex, parseCaesarIgnore, isPathIgnored, resolveScanScope } from '../src/scanner/scope-resolver.mjs';
import { runScan } from '../src/scanner/scan-runner.mjs';

function assert(condition, message) {
  if (!condition) {
    throw new Error(`❌ Assertion Failed: ${message}`);
  }
}

function runScopeValidation() {
  console.log('🚀 Running programmatic Scope Control and Configuration validation...');

  const targetDir = resolve('./fixtures/sample-ai-project');

  // ==========================================
  // 1. Glob-to-Regex Translation Tests
  // ==========================================
  console.log('🧪 Testing glob-to-regex translation rules...');
  
  const regexFile = globToRegex('*.js');
  assert(regexFile.test('foo.js'), '*.js should match foo.js');
  assert(regexFile.test('src/foo.js'), '*.js should match src/foo.js');
  assert(!regexFile.test('foo.py'), '*.js should not match foo.py');

  const regexDir = globToRegex('dist/');
  assert(regexDir.test('dist'), 'dist/ should match dist');
  assert(regexDir.test('dist/sub/file.js'), 'dist/ should match dist/sub/file.js');
  assert(!regexDir.test('src/dist'), 'dist/ should not match src/dist (starts from root segment)');

  const regexWildcard = globToRegex('**/*.py');
  assert(regexWildcard.test('foo.py'), '**/*.py should match foo.py');
  assert(regexWildcard.test('src/sub/foo.py'), '**/*.py should match src/sub/foo.py');
  assert(!regexWildcard.test('foo.js'), '**/*.py should not match foo.js');

  console.log('✅ Glob-to-regex translation tested successfully.');

  // ==========================================
  // 2. Parse .caesarignore Tests
  // ==========================================
  console.log('🧪 Testing .caesarignore parser...');
  const ignoreFilePath = join(targetDir, '.caesarignore');
  const compiledPatterns = parseCaesarIgnore(ignoreFilePath);
  
  assert(compiledPatterns.length > 0, '.caesarignore should have compiled ignore patterns');
  
  const rawPatterns = compiledPatterns.map(p => p.raw);
  assert(rawPatterns.includes('generated/'), '.caesarignore should contain generated/');
  assert(rawPatterns.includes('tmp/'), '.caesarignore should contain tmp/');

  console.log('✅ .caesarignore parsed successfully.');

  // ==========================================
  // 3. Setup Temporary Standard Folders & Files
  // ==========================================
  console.log('🧪 Setting up dynamic mock items to test standard directory skipping...');
  const gitDir = join(targetDir, '.git');
  const nodeModulesDir = join(targetDir, 'node_modules');
  const dummyTmpDir = join(targetDir, 'venv'); // use venv since it is standard ignore

  if (!existsSync(gitDir)) mkdirSync(gitDir, { recursive: true });
  if (!existsSync(nodeModulesDir)) mkdirSync(nodeModulesDir, { recursive: true });
  if (!existsSync(dummyTmpDir)) mkdirSync(dummyTmpDir, { recursive: true });

  writeFileSync(join(gitDir, 'HEAD'), 'ref: refs/heads/main', 'utf8');
  writeFileSync(join(nodeModulesDir, 'dummy.js'), '// dummy package file', 'utf8');
  writeFileSync(join(dummyTmpDir, 'dummy.json'), '{}', 'utf8');

  // ==========================================
  // 4. Resolve Scope & Exclusions Assertions
  // ==========================================
  let scopeResult;
  try {
    console.log('🧪 Resolving scan scope for target fixture directory...');
    scopeResult = resolveScanScope(targetDir);

    assert(scopeResult.schema_version === '0.5.0', 'Scope schema version should be 0.5.0');
    assert(scopeResult.summary, 'Scope output has a summary block');
    
    // Validate included files
    const included = scopeResult.files.included;
    console.log('📂 Included files:', included);
    assert(included.includes('package.json'), 'package.json should be included');
    assert(included.includes('src/example.js'), 'src/example.js should be included');
    assert(included.includes('.env.example'), '.env.example should be included');
    assert(included.includes('requirements.txt'), 'requirements.txt should be included');
    assert(included.includes('prompts/system.prompt.md'), 'prompts/system.prompt.md should be included');
    
    // Validate excluded files
    const excluded = scopeResult.files.excluded;
    console.log('🚫 Excluded files:', excluded);
    const ignoredNoiseFile = excluded.find(e => e.relativePath === 'generated/ignored-ai-noise.js');
    const ignoredOutputFile = excluded.find(e => e.relativePath === 'tmp/ignored-output.json');

    assert(ignoredNoiseFile, 'generated/ignored-ai-noise.js must be in the excluded list');
    assert(ignoredNoiseFile.reason.includes('generated/'), 'Exclusion reason should specify the matching pattern');

    assert(ignoredOutputFile, 'tmp/ignored-output.json must be in the excluded list');
    assert(ignoredOutputFile.reason.includes('tmp/'), 'Exclusion reason should specify the matching pattern');

    // Validate skipped files/folders
    const skipped = scopeResult.files.skipped;
    console.log('⚙️ Skipped files & folders:', skipped);
    
    const gitSkipped = skipped.find(s => s.relativePath === '.git');
    const nodeModulesSkipped = skipped.find(s => s.relativePath === 'node_modules');
    const venvSkipped = skipped.find(s => s.relativePath === 'venv');

    assert(gitSkipped, '.git folder should be in the skipped list');
    assert(gitSkipped.reason === 'standard_ignore', '.git skipped reason is standard_ignore');
    assert(gitSkipped.type === 'directory', '.git skipped type is directory');

    assert(nodeModulesSkipped, 'node_modules folder should be in the skipped list');
    assert(nodeModulesSkipped.reason === 'standard_ignore', 'node_modules skipped reason is standard_ignore');

    assert(venvSkipped, 'venv folder should be in the skipped list');
    assert(venvSkipped.reason === 'standard_ignore', 'venv skipped reason is standard_ignore');

    console.log('✅ Scope and exclusion boundaries resolved and verified.');
  } finally {
    // Clean up temporary items
    console.log('🧹 Cleaning up temporary standard folders...');
    rmSync(gitDir, { recursive: true, force: true });
    rmSync(nodeModulesDir, { recursive: true, force: true });
    rmSync(dummyTmpDir, { recursive: true, force: true });
  }

  // ==========================================
  // 5. Options Merging & CLI Excludes
  // ==========================================
  console.log('🧪 Testing priority merged options and CLI custom excludes...');
  // Pass dynamic cli override options
  const customExcludeScope = resolveScanScope(targetDir, {
    exclude: ['src/example.js']
  });

  assert(
    !customExcludeScope.files.included.includes('src/example.js'),
    'src/example.js should NOT be in the included list if passed to CLI options.exclude'
  );
  const customExcludedEntry = customExcludeScope.files.excluded.find(e => e.relativePath === 'src/example.js');
  assert(customExcludedEntry, 'src/example.js must be categorized as excluded when merged with CLI overrides');

  console.log('✅ CLI options and local configuration merges verified.');

  // ==========================================
  // 6. Complete Static Scan Assertions
  // ==========================================
  console.log('🧪 Executing full scan orchestration with scope filters...');
  const scanResult = runScan(targetDir);

  assert(scanResult.schema_version === '0.5.0', 'Scan results schema version matches 0.5.0');
  assert(scanResult.summary.total_findings === 11, `Expected exactly 11 findings under scope control, got ${scanResult.summary.total_findings}`);

  // Confirm no finding was registered from ignored files
  const noiseFindings = scanResult.findings.filter(f => f.file_path.includes('ignored-ai-noise.js') || f.file_path.includes('ignored-output.json'));
  assert(noiseFindings.length === 0, 'No findings should be captured from ignored files!');

  console.log('✅ Full static scan correctly filtered out the ignored AI noise.');
  console.log('🎉 All Scope Control and Configuration validation assertions PASSED successfully!');
}

try {
  runScopeValidation();
  process.exit(0);
} catch (error) {
  console.error(error.stack || error.message);
  process.exit(1);
}
