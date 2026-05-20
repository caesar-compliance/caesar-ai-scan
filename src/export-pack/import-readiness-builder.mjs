/**
 * Builds the import readiness assessment.
 *
 * @param {Object} reviewWorkflow - Structured review workflow context.
 * @returns {Object} Import readiness object compliant with schemas/import-readiness.schema.json.
 */
export function buildImportReadiness(reviewWorkflow) {
  const blockers = [];
  const warnings = [];
  const requiredHumanReviews = new Set();
  const requiredResolutions = new Set();

  const reviewItems = reviewWorkflow ? (reviewWorkflow.review_items || []) : [];
  
  let totalScore = 0;
  let hasBlockingGaps = false;

  for (const item of reviewItems) {
    totalScore += item.export_readiness;
    
    if (item.assigned_review_lanes) {
      for (const lane of item.assigned_review_lanes) {
        requiredHumanReviews.add(lane);
      }
    }

    if (item.evidence_gaps) {
      for (const gap of item.evidence_gaps) {
        if (gap.blocks_export) {
          hasBlockingGaps = true;
          blockers.push(`[${item.matched_name}] ${gap.reason}`);
        } else {
          warnings.push(`[${item.matched_name}] ${gap.reason}`);
        }
        if (gap.recommended_resolution) {
          requiredResolutions.add(gap.recommended_resolution);
        }
      }
    }
  }

  const readinessScore = reviewItems.length > 0 ? Math.round(totalScore / reviewItems.length) : 100;
  
  let readinessStatus = 'evidence_candidate_ready';
  if (hasBlockingGaps) {
    readinessStatus = 'blocked_missing_context';
  } else if (reviewItems.length > 0) {
    readinessStatus = 'needs_human_review';
  }

  let nextAction = 'No action required. All scanned assets are compliance-ready.';
  if (hasBlockingGaps) {
    nextAction = 'Action Required: Resolve all blocking evidence gaps (e.g. migrate plaintext env credentials and define system owners) before exporting.';
  } else if (reviewItems.length > 0) {
    nextAction = 'Awaiting human auditor sign-off inside target review lanes.';
  }

  return {
    readiness_status: readinessStatus,
    readiness_score: readinessScore,
    blockers: blockers,
    warnings: warnings,
    required_human_reviews: Array.from(requiredHumanReviews),
    required_resolutions: Array.from(requiredResolutions),
    can_import_automatically: false,
    recommended_next_action: nextAction
  };
}
