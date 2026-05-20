import { execSync } from 'child_process';
import { existsSync, readFileSync, rmSync, mkdirSync } from 'fs';
import { resolve } from 'path';

function assert(condition, message) {
  if (!condition) throw new Error(`❌ Assertion Failed: ${message}`);
}

async function runHistoryValidation() {
  console.log('🚀 Starting Caesar Scan History validation suite...');

  const historyDir = resolve('tmp/sample-history');

  // 1. Clean and recreate the history directory so tests are deterministic
  console.log('🧹 Cleaning tmp/sample-history...');
  if (existsSync(historyDir)) rmSync(historyDir, { recursive: true, force: true });
  mkdirSync(historyDir, { recursive: true });

  const baseCmd = `node src/cli.mjs fixtures/sample-ai-project --format json --out tmp/sample-scan-result.json --export-evidence-candidates tmp/sample-evidence-candidates.json --review-out tmp/sample-review-workflow.json --export-pack tmp/sample-evidence-export-pack --history-dir tmp/sample-history --record-history --diff-previous --history-report tmp/sample-history/latest-diff.md`;

  // 2. Run first history scan
  console.log('🧪 Executing Run 1...');
  execSync(baseCmd, { stdio: 'inherit' });

  // 3. Run second history scan for diff comparison
  console.log('🧪 Executing Run 2...');
  execSync(baseCmd, { stdio: 'inherit' });

  // 4. Validate history-index.json
  const indexPath = resolve(historyDir, 'history-index.json');
  assert(existsSync(indexPath), 'history-index.json must exist');
  const index = JSON.parse(readFileSync(indexPath, 'utf8'));
  assert(index.schema_version === '0.7.0', 'history-index schema_version must be 0.7.0');
  assert(Array.isArray(index.runs), 'history-index.runs must be an array');
  assert(index.run_count >= 2, `Expected at least 2 runs, got ${index.run_count}`);
  assert(index.latest_run_id, 'latest_run_id must be set');
  assert(index.latest_run_id === index.runs[index.runs.length - 1].run_id, 'latest_run_id must match the last run entry');
  console.log(`✅ history-index.json valid (${index.run_count} runs, latest: ${index.latest_run_id})`);

  // 5. Validate each run directory
  for (const run of index.runs) {
    const runDir = resolve(historyDir, 'runs', run.run_id);
    assert(existsSync(resolve(runDir, 'scan-run.json')), `scan-run.json must exist in run ${run.run_id}`);
    assert(existsSync(resolve(runDir, 'scan-result.json')), `scan-result.json must exist in run ${run.run_id}`);
    const scanRun = JSON.parse(readFileSync(resolve(runDir, 'scan-run.json'), 'utf8'));
    assert(scanRun.run_id === run.run_id, `run_id mismatch in ${run.run_id}/scan-run.json`);
    assert(scanRun.schema_version === '0.7.0', `schema_version must be 0.7.0 in run ${run.run_id}`);
  }
  console.log(`✅ All ${index.runs.length} run directories validated.`);

  // 6. Validate latest-diff.json
  const diffJsonPath = resolve(historyDir, 'latest-diff.json');
  assert(existsSync(diffJsonPath), 'latest-diff.json must exist');
  const diff = JSON.parse(readFileSync(diffJsonPath, 'utf8'));
  assert(diff.schema_version === '0.7.0', 'diff schema_version must be 0.7.0');
  assert(diff.diff_id, 'diff_id must be set');
  assert(diff.current_run_id === index.latest_run_id, 'diff current_run_id must match latest_run_id');
  assert(Array.isArray(diff.added_findings), 'added_findings must be an array');
  assert(Array.isArray(diff.removed_findings), 'removed_findings must be an array');
  assert(Array.isArray(diff.unchanged_findings), 'unchanged_findings must be an array');
  assert(Array.isArray(diff.changed_findings), 'changed_findings must be an array');
  assert(typeof diff.summary === 'object', 'summary must be an object');
  console.log(`✅ latest-diff.json valid: +${diff.summary.added_count} added, -${diff.summary.removed_count} removed, ${diff.summary.unchanged_count} unchanged, ~${diff.summary.changed_count} changed`);

  // 7. Validate latest-diff.md
  const diffMdPath = resolve(historyDir, 'latest-diff.md');
  assert(existsSync(diffMdPath), 'latest-diff.md must exist');
  const diffMdContent = readFileSync(diffMdPath, 'utf8');
  assert(diffMdContent.length > 0, 'latest-diff.md must be non-empty');
  assert(diffMdContent.includes('Caesar AI Scan History Diff'), 'latest-diff.md must have correct heading');
  console.log(`✅ latest-diff.md exists and is non-empty.`);

  // 8. Confirm no real secrets in history output (no real api key patterns)
  const indexContent = readFileSync(indexPath, 'utf8');
  const knownFalsePositives = ['your-openai-api-key-here', 'api-key-placeholder', 'caesar-ai-scan'];
  const secretPattern = /sk-[a-zA-Z0-9]{20,}/;
  assert(!secretPattern.test(indexContent), 'No real API keys should appear in history-index.json');
  console.log('✅ No real API secrets detected in history output.');

  // 9. Confirm no history files landed in site/data
  const siteDataHistory = resolve('site/data/sample-history');
  assert(!existsSync(siteDataHistory), 'No scan history should be placed in site/data/');
  console.log('✅ Confirmed: No history data published to site/data/.');

  console.log('🎉 All scan history validation assertions PASSED successfully!');
}

try {
  await runHistoryValidation();
  process.exit(0);
} catch (err) {
  console.error(err.stack || err.message);
  process.exit(1);
}
