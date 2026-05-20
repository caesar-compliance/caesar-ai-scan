import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

const WORKFLOW_PATH = resolve('tmp/sample-review-workflow.json');
const SCAN_RESULT_PATH = resolve('tmp/sample-scan-result.json');
const CANDIDATES_PATH = resolve('tmp/sample-evidence-candidates.json');

function runValidation() {
  console.log('🧪 Starting Caesar review workflow validation suite...');

  // 1. Check file existence
  if (!existsSync(WORKFLOW_PATH)) {
    console.error(`❌ Error: Review workflow file does not exist at ${WORKFLOW_PATH}`);
    process.exit(1);
  }
  if (!existsSync(SCAN_RESULT_PATH)) {
    console.error(`❌ Error: Scan result file does not exist at ${SCAN_RESULT_PATH}`);
    process.exit(1);
  }
  if (!existsSync(CANDIDATES_PATH)) {
    console.error(`❌ Error: Candidates file does not exist at ${CANDIDATES_PATH}`);
    process.exit(1);
  }

  // 2. Parse JSONs
  let workflow, scanResult, candidates;
  try {
    workflow = JSON.parse(readFileSync(WORKFLOW_PATH, 'utf8'));
    scanResult = JSON.parse(readFileSync(SCAN_RESULT_PATH, 'utf8'));
    candidates = JSON.parse(readFileSync(CANDIDATES_PATH, 'utf8'));
  } catch (error) {
    console.error('❌ Error: Parsing generated JSON files failed:', error.message);
    process.exit(1);
  }

  // 3. Validate required top-level fields
  const requiredTopFields = ['schema_version', 'generated_at', 'source_scan', 'summary', 'review_items'];
  for (const field of requiredTopFields) {
    if (!(field in workflow)) {
      console.error(`❌ Error: Missing top-level field '${field}' in review workflow`);
      process.exit(1);
    }
  }

  // 4. Validate scan result integration
  const scanFindingIds = new Set((scanResult.findings || []).map(f => f.finding_id));
  const reviewItems = workflow.review_items || [];

  if (reviewItems.length === 0) {
    console.error('❌ Error: No review items found in review workflow');
    process.exit(1);
  }

  // Track categories for taxonomy checks
  let hasDependencyItem = false;
  let hasEnvVarItem = false;
  let hasPromptItem = false;
  let hasVectorDbItem = false;
  let hasBlockedOrReviewNeededItem = false;

  for (const item of reviewItems) {
    // 4a. Validate item fields
    const requiredItemFields = [
      'review_item_id', 'finding_ref', 'matched_name', 'category', 'severity',
      'review_status', 'assigned_review_lanes', 'evidence_gaps',
      'recommended_questions', 'recommended_actions', 'export_readiness', 'integration_notes'
    ];
    for (const field of requiredItemFields) {
      if (!(field in item)) {
        console.error(`❌ Error: Missing field '${field}' in review item ${item.review_item_id || 'unknown'}`);
        process.exit(1);
      }
    }

    // 4b. Verify item references an existing finding
    if (!scanFindingIds.has(item.finding_ref)) {
      console.error(`❌ Error: Review item ${item.review_item_id} references non-existent finding '${item.finding_ref}'`);
      process.exit(1);
    }

    // 4c. Verify evidence gaps fields
    for (const gap of item.evidence_gaps) {
      const requiredGapFields = [
        'gap_id', 'gap_type', 'severity', 'reason', 'required_for', 'recommended_resolution', 'blocks_export'
      ];
      for (const field of requiredGapFields) {
        if (!(field in gap)) {
          console.error(`❌ Error: Missing gap field '${field}' in gap ${gap.gap_id || 'unknown'}`);
          process.exit(1);
        }
      }
    }

    // 4d. Identify categories and status
    const categoryLower = (item.category || '').toLowerCase();
    if (categoryLower.includes('sdk') || categoryLower.includes('framework') || item.finding_ref.includes('find_dep')) {
      hasDependencyItem = true;
    }
    if (categoryLower.includes('credential') || item.finding_ref.includes('find_env')) {
      hasEnvVarItem = true;
    }
    if (categoryLower.includes('prompt') || item.finding_ref.includes('find_prompt')) {
      hasPromptItem = true;
    }
    if (categoryLower.includes('vector') || item.finding_ref.includes('find_vector')) {
      hasVectorDbItem = true;
    }

    const status = item.review_status;
    if (status === 'blocked_missing_context' || status.startsWith('needs_')) {
      hasBlockedOrReviewNeededItem = true;
    }

    // 4e. Safety Check: Verify no items are approved or marked final
    if (status === 'approved' || status === 'evidence_candidate_ready') {
      console.error(`❌ Error: Item ${item.review_item_id} has forbidden final approval status '${status}'`);
      process.exit(1);
    }
  }

  // 5. Assert taxonomic existence
  if (!hasDependencyItem) {
    console.error('❌ Error: Missing at least one dependency-related review item');
    process.exit(1);
  }
  if (!hasEnvVarItem) {
    console.error('❌ Error: Missing at least one environment-variable/security review item');
    process.exit(1);
  }
  if (!hasPromptItem) {
    console.error('❌ Error: Missing at least one prompt-file review item');
    process.exit(1);
  }
  if (!hasVectorDbItem) {
    console.error('❌ Error: Missing at least one vector database review item');
    process.exit(1);
  }
  if (!hasBlockedOrReviewNeededItem) {
    console.error('❌ Error: Expected at least one item to be blocked or require human/security/legal review');
    process.exit(1);
  }

  // 6. Check evidence candidates
  if (candidates.length === 0) {
    console.error('❌ Error: No evidence candidates exported');
    process.exit(1);
  }

  for (const candidate of candidates) {
    if (candidate.status !== 'draft') {
      console.error(`❌ Error: Candidate ${candidate.candidate_id} status is '${candidate.status}', expected 'draft'`);
      process.exit(1);
    }
    if (candidate.review_required !== true) {
      console.error(`❌ Error: Candidate ${candidate.candidate_id} review_required is false, expected true`);
      process.exit(1);
    }
  }

  // 7. Check that no real secrets were leaked in generated logs / JSONs
  const workflowString = JSON.stringify(workflow);
  const candidatesString = JSON.stringify(candidates);
  
  // Real OpenAI keys usually start with sk- and have a specific length and pattern
  const secretPattern = /sk-[a-zA-Z0-9]{32,}/g;
  if (secretPattern.test(workflowString) || secretPattern.test(candidatesString)) {
    console.error('❌ Error: Potential real secret detected in the outputs!');
    process.exit(1);
  }

  console.log('✅ Review workflow validation PASSED successfully!');
  process.exit(0);
}

runValidation();
