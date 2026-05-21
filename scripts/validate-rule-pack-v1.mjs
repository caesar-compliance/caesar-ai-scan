import { resolve } from 'path';
import { runScan } from '../src/scanner/scan-runner.mjs';

function assert(condition, message) {
  if (!condition) {
    throw new Error(`❌ Assertion Failed: ${message}`);
  }
}

function runRulePackValidation() {
  console.log('🚀 Validating Rule Pack v1 with expanded AI framework detection...');

  const targetDir = resolve('./fixtures/sample-ai-frameworks-project');
  const result = runScan(targetDir);

  const findings = result.findings;
  console.log(`🔍 Total findings in Rule Pack v1 fixture: ${findings.length}`);

  const categories = findings.map(f => f.detection_category);
  const uniqueCategories = new Set(categories);

  console.log('📊 Detection Categories found:', Array.from(uniqueCategories));

  // Assert all requested categories are present
  const expectedCategories = [
    'provider_sdk',
    'orchestration_framework',
    'rag_vector',
    'prompt_asset',
    'model_artifact',
    'config_signal'
  ];

  for (const cat of expectedCategories) {
    assert(uniqueCategories.has(cat), `Missing expected detection category: ${cat}`);
    const count = findings.filter(f => f.detection_category === cat).length;
    console.log(`  [✅] ${cat}: ${count} findings`);
  }

  // Safety check: no actual secret values should be leaked
  const envFindings = findings.filter(f => f.detection_category === 'config_signal');
  for (const f of envFindings) {
    // We expect masking for 'my-secret-key-12345'
    if (f.matched_name === 'OPENAI_API_KEY') {
       assert(f.evidence_hint.includes('[REDACTED]'), `OPENAI_API_KEY should be masked in evidence hint: ${f.evidence_hint}`);
       assert(!f.evidence_hint.includes('my-secret-key-12345'), `OPENAI_API_KEY should not leak value: ${f.evidence_hint}`);
    }
    
    // We expect NO masking for 'placeholder' or 'your-' values as per detector logic
    if (f.matched_name === 'ANTHROPIC_API_KEY') {
       assert(f.evidence_hint.includes('placeholder-value'), `ANTHROPIC_API_KEY (placeholder) should be visible: ${f.evidence_hint}`);
    }
  }

  // Validate detector IDs and other Rule Pack v1 fields
  for (const f of findings) {
    assert(f.rule_pack_version === 'v1', 'rule_pack_version must be v1');
    assert(f.detector_id, 'detector_id must exist');
    assert(f.confidence, 'confidence must exist');
    assert(f.evidence_kind, 'evidence_kind must exist');
    assert(f.governance_relevance, 'governance_relevance must exist');
  }

  console.log('✅ Rule Pack v1 validation PASSED successfully.');
}

try {
  runRulePackValidation();
  process.exit(0);
} catch (error) {
  console.error(error.message);
  process.exit(1);
}
