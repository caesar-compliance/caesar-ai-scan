/**
 * Builds the human review checklist.
 *
 * @param {Object} reviewWorkflow - Structured review workflow context.
 * @returns {Object} Human review checklist object compliant with schemas/human-review-checklist.schema.json.
 */
export function buildHumanReviewChecklist(reviewWorkflow) {
  const reviewLanes = new Set();
  const requiredQuestions = new Set();
  const blockingItems = [];

  const reviewItems = reviewWorkflow ? (reviewWorkflow.review_items || []) : [];

  for (const item of reviewItems) {
    if (item.assigned_review_lanes) {
      for (const lane of item.assigned_review_lanes) {
        reviewLanes.add(lane);
      }
    }

    if (item.recommended_questions) {
      for (const q of item.recommended_questions) {
        requiredQuestions.add(q);
      }
    }

    if (item.evidence_gaps) {
      for (const gap of item.evidence_gaps) {
        if (gap.blocks_export) {
          blockingItems.push(`[BLOCKER - ${item.matched_name}] ${gap.reason}`);
        }
      }
    }
  }

  const requiredConfirmations = [
    "I confirm that all detected AI dependencies have designated technical and business owners.",
    "I confirm that no plain-text credentials are saved in configuration templates or local source code.",
    "I confirm that vector database storage operations comply with data processing assessments.",
    "I confirm that system prompts have been verified to prevent instruction leakage or security jailbreaks."
  ];

  return {
    checklist_id: `chkl_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
    generated_at: new Date().toISOString(),
    review_lanes: Array.from(reviewLanes),
    required_questions: Array.from(requiredQuestions),
    required_confirmations: requiredConfirmations,
    blocking_items: blockingItems,
    signoff_required: true
  };
}
