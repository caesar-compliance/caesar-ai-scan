/**
 * Calculates the export readiness score (0 to 100) based on remaining evidence gaps.
 * 
 * @param {Array<Object>} evidenceGaps - List of evidence gaps for the finding.
 * @returns {number} Integer score from 0 to 100.
 */
export function calculateExportReadiness(evidenceGaps) {
  if (!evidenceGaps || evidenceGaps.length === 0) {
    return 100;
  }

  let score = 100;
  let hasBlockingGap = false;

  for (const gap of evidenceGaps) {
    if (gap.blocks_export) {
      hasBlockingGap = true;
    }

    // Deduct based on severity
    let deduction = 0;
    const severity = (gap.severity || '').toLowerCase();

    if (severity === 'critical' || severity === 'high') {
      deduction = 25;
    } else if (severity === 'medium') {
      deduction = 15;
    } else if (severity === 'low') {
      deduction = 5;
    } else {
      deduction = 10;
    }

    score -= deduction;
  }

  // Standard safe guardrail: if there are any blocking gaps, score cannot exceed 70%
  if (hasBlockingGap && score > 70) {
    score = 70;
  }

  return Math.max(0, Math.min(100, Math.floor(score)));
}
