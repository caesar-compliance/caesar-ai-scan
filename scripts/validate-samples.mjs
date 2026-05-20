import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';
import { runScan } from '../src/scanner/scan-runner.mjs';
import { exportEvidenceCandidates } from '../src/export/evidence-candidate-exporter.mjs';

function assert(condition, message) {
  if (!condition) {
    throw new Error(`❌ Assertion Failed: ${message}`);
  }
}

function runValidation() {
  console.log('🚀 Running programmatic scan results validation...');

  const targetDir = resolve('./fixtures/sample-ai-project');
  
  // 1. Execute Scan runner
  const result = runScan(targetDir);
  
  // Assertions on scan result schema
  assert(result.schema_version === '0.4.0', 'Schema version should be 0.4.0');
  assert(result.scanner && result.scanner.name === 'caesar-ai-scan', 'Scanner name matches');
  assert(result.scanner.version === '0.4.0', 'Scanner version matches');
  assert(result.scanned_at, 'scanned_at timestamp exists');
  assert(result.target === targetDir, 'target matches scanned path');
  assert(result.summary, 'summary object exists');
  assert(Array.isArray(result.findings), 'findings should be an array');

  const findings = result.findings;
  console.log(`🔍 Total findings parsed from fixture project: ${findings.length}`);

  // Confirm specific detector findings exist
  const dependencyFindings = findings.filter(f => f.detector === 'dependency-detector');
  const envVarFindings = findings.filter(f => f.detector === 'env-var-detector');
  const promptFindings = findings.filter(f => f.detector === 'prompt-file-detector');
  const vectorFindings = findings.filter(f => f.detector === 'vector-db-detector');

  console.log(`  - Dependency findings count: ${dependencyFindings.length}`);
  console.log(`  - Env var findings count: ${envVarFindings.length}`);
  console.log(`  - Prompt findings count: ${promptFindings.length}`);
  console.log(`  - Vector DB findings count: ${vectorFindings.length}`);

  assert(dependencyFindings.length >= 1, 'Should find at least one dependency finding');
  assert(envVarFindings.length >= 1, 'Should find at least one env-var finding');
  assert(promptFindings.length >= 1, 'Should find at least one prompt file finding');
  assert(vectorFindings.length >= 1, 'Should find at least one vector DB finding');

  // Verify all fields exist on findings
  for (const f of findings) {
    assert(f.finding_id, 'finding_id exists');
    assert(f.category, 'category exists');
    assert(f.severity, 'severity exists');
    assert(f.detector, 'detector exists');
    assert(f.rule_id, 'rule_id exists');
    assert(f.matched_name, 'matched_name exists');
    assert(f.file_path, 'file_path exists');
    assert(f.evidence_hint, 'evidence_hint exists');
    assert(f.recommended_review, 'recommended_review exists');
  }

  // 2. Execute Exporter
  const candidates = exportEvidenceCandidates(findings);
  assert(Array.isArray(candidates), 'Candidates must be an array');
  assert(candidates.length === findings.length, 'Candidate count must match findings count');

  const findingIds = new Set(findings.map(f => f.finding_id));

  // Assertions on candidates schema and references
  for (const c of candidates) {
    assert(c.candidate_id.startsWith('ec_'), 'candidate_id has prefix ec_');
    assert(c.source_tool && c.source_tool.name === 'caesar-ai-scan', 'candidate source tool matches');
    assert(c.generated_at, 'candidate generated_at exists');
    assert(c.evidence_type, 'candidate evidence_type exists');
    assert(c.status === 'draft', 'candidate status starts as draft');
    assert(c.proposed_payload, 'candidate proposed_payload exists');
    assert(c.review_required === true, 'candidate review_required is true');
    assert(c.integration_notes, 'candidate integration_notes exist');

    // Confirm reference integrity
    assert(findingIds.has(c.finding_ref), `candidate finding_ref '${c.finding_ref}' must match a real finding`);
  }

  console.log('✅ All programmatic validation assertions PASSED successfully.');
}

try {
  runValidation();
  process.exit(0);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
