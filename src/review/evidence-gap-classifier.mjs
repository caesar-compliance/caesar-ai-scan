import { loadEvidenceRequirements } from './load-review-taxonomy.mjs';

/**
 * Classifies a scan finding and returns the matching list of evidence gaps.
 * 
 * @param {Object} finding - A scan finding from the runner.
 * @param {Object} [requirements] - Parsed requirements config (optional, loaded automatically if not provided).
 * @returns {Array<Object>} List of evidence gaps for this finding.
 */
export function classifyEvidenceGaps(finding, requirements) {
  const reqs = requirements || loadEvidenceRequirements();
  const gapTypes = reqs.gap_types || {};

  const gaps = [];
  const detector = finding.detector || '';

  // Determine gap types based on detector/finding parameters
  const gapKeys = [];

  if (detector === 'dependency-detector') {
    gapKeys.push(
      'missing_system_owner',
      'missing_processing_purpose',
      'missing_ai_use_case_description',
      'missing_model_or_provider_identification',
      'missing_vendor_terms_review',
      'missing_risk_classification',
      'missing_export_authorization'
    );
  } else if (detector === 'env-var-detector') {
    gapKeys.push(
      'missing_system_owner',
      'missing_security_review',
      'missing_model_or_provider_identification',
      'missing_export_authorization'
    );
  } else if (detector === 'prompt-file-detector') {
    gapKeys.push(
      'missing_processing_purpose',
      'missing_human_oversight_description',
      'missing_logging_or_retention_policy',
      'missing_user_disclosure_assessment',
      'missing_export_authorization'
    );
  } else if (detector === 'vector-db-detector') {
    gapKeys.push(
      'missing_data_processing_assessment',
      'missing_logging_or_retention_policy',
      'missing_processing_purpose',
      'missing_export_authorization'
    );
  } else {
    // Fallback for general telemetry
    gapKeys.push(
      'missing_system_owner',
      'missing_export_authorization'
    );
  }

  for (const key of gapKeys) {
    if (gapTypes[key]) {
      // Deep clone/copy to avoid reference issues
      gaps.push({ ...gapTypes[key] });
    }
  }

  return gaps;
}
