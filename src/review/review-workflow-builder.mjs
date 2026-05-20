import { loadReviewTaxonomy, loadEvidenceRequirements } from './load-review-taxonomy.mjs';
import { classifyEvidenceGaps } from './evidence-gap-classifier.mjs';
import { calculateExportReadiness } from './export-readiness-scorer.mjs';
import { getRecommendedQuestions, getRecommendedActions } from './recommended-questions.mjs';

/**
 * Builds the comprehensive Caesar compliance review workflow from a scan result.
 * 
 * @param {Object} scanResult - Structured output of the scan-runner.
 * @returns {Object} Review workflow object compliant with schemas/review-workflow.schema.json.
 */
export function buildReviewWorkflow(scanResult) {
  const taxonomy = loadReviewTaxonomy();
  const requirements = loadEvidenceRequirements();

  const findings = scanResult.findings || [];
  const reviewItems = [];
  const triggeredLanesSet = new Set();

  for (const finding of findings) {
    const gaps = classifyEvidenceGaps(finding, requirements);
    const score = calculateExportReadiness(gaps);

    // Assign review lanes as the unique union of the lane requirements for each gap
    const assignedLanes = [...new Set(gaps.map(g => g.required_for))];
    for (const lane of assignedLanes) {
      triggeredLanesSet.add(lane);
    }

    // Determine review status based on gaps and detector types
    let reviewStatus = 'needs_human_review';
    const isBlocked = gaps.some(g => g.blocks_export);

    if (isBlocked) {
      reviewStatus = 'blocked_missing_context';
    } else if (assignedLanes.includes('security_review')) {
      reviewStatus = 'needs_security_review';
    } else if (assignedLanes.includes('legal_compliance_review')) {
      reviewStatus = 'needs_legal_review';
    }

    // Integration notes mapping
    let integrationNotes = `Offline candidate assessment generated for finding ID: ${finding.finding_id}. `;
    if (isBlocked) {
      integrationNotes += `Blocked from export due to ${gaps.filter(g => g.blocks_export).length} unresolved blocking evidence gaps.`;
    } else {
      integrationNotes += `Awaiting manual review sign-off.`;
    }

    reviewItems.push({
      review_item_id: `ri_${finding.finding_id.substring(3)}`, // Match structure of finding_id
      finding_ref: finding.finding_id,
      matched_name: finding.matched_name,
      category: finding.category,
      severity: finding.severity,
      review_status: reviewStatus,
      assigned_review_lanes: assignedLanes,
      evidence_gaps: gaps,
      recommended_questions: getRecommendedQuestions(finding),
      recommended_actions: getRecommendedActions(finding),
      export_readiness: score,
      integration_notes: integrationNotes
    });
  }

  const totalFindings = findings.length;
  const blockedItems = reviewItems.filter(item => item.review_status === 'blocked_missing_context').length;
  const readyItems = reviewItems.filter(item => !item.evidence_gaps.some(g => g.blocks_export)).length;

  return {
    schema_version: '0.4.0',
    generated_at: new Date().toISOString(),
    source_scan: {
      target: scanResult.target,
      scanned_at: scanResult.scanned_at
    },
    summary: {
      total_findings: totalFindings,
      total_review_items: reviewItems.length,
      blocked_items: blockedItems,
      ready_items: readyItems,
      triggered_lanes: Array.from(triggeredLanesSet)
    },
    review_items: reviewItems
  };
}
