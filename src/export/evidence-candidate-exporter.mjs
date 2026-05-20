import { buildReviewWorkflow } from '../review/review-workflow-builder.mjs';

/**
 * Converts a list of raw scan findings into standardized evidence export candidates.
 *
 * @param {Array<Object>} findings - List of findings from runScan output.
 * @param {Object} [reviewWorkflow=null] - Optional pre-built review workflow context.
 * @returns {Array<Object>} Array of objects compliant with schemas/evidence-export-candidate.schema.json.
 */
export function exportEvidenceCandidates(findings, reviewWorkflow = null) {
  const candidates = [];

  let workflow = reviewWorkflow;
  if (!workflow && findings && findings.length > 0) {
    try {
      workflow = buildReviewWorkflow({
        target: '.',
        scanned_at: new Date().toISOString(),
        findings: findings
      });
    } catch (e) {
      // Fail-safe: fallback without crashing the pipeline
    }
  }

  for (const finding of findings) {
    let evidenceType = 'general_telemetry';
    
    if (finding.detector === 'dependency-detector') {
      evidenceType = 'codebase_dependency';
    } else if (finding.detector === 'env-var-detector') {
      evidenceType = 'environment_credential';
    } else if (finding.detector === 'prompt-file-detector') {
      evidenceType = 'prompt_configuration';
    } else if (finding.detector === 'vector-db-detector') {
      evidenceType = 'vector_storage';
    }

    const reviewItem = workflow?.review_items?.find(item => item.finding_ref === finding.finding_id);

    // Map rule severity to initial integration assessment notes
    let notes = reviewItem ? reviewItem.integration_notes : 'Automated offline code scan identified potential AI asset usage. ';
    if (!reviewItem) {
      if (finding.severity === 'high' || finding.severity === 'critical') {
        notes += 'ACTION REQUIRED: Review immediately. plain-text credentials or high-risk SDKs require secure isolation.';
      } else {
        notes += 'Verify standard repository usage logs are enabled and active.';
      }
    }

    candidates.push({
      candidate_id: `ec_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
      source_tool: {
        name: 'caesar-ai-scan',
        version: '0.3.0'
      },
      generated_at: new Date().toISOString(),
      evidence_type: evidenceType,
      status: 'draft', // By default, all candidates start as reviewable drafts
      finding_ref: finding.finding_id,
      proposed_payload: {
        matched_name: finding.matched_name,
        file_path: finding.file_path,
        evidence_hint: finding.evidence_hint,
        category: finding.category,
        severity: finding.severity,
        remediation_suggestion: finding.recommended_review
      },
      review_required: true,
      integration_notes: notes,
      
      // Optional T002 review metadata:
      review_status: reviewItem ? reviewItem.review_status : 'draft_detected',
      evidence_gaps: reviewItem ? reviewItem.evidence_gaps : [],
      export_readiness: reviewItem ? reviewItem.export_readiness : 0,
      required_review_lanes: reviewItem ? reviewItem.assigned_review_lanes : []
    });
  }

  return candidates;
}

