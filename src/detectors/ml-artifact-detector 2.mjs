/**
 * Scans a file to detect machine learning model artifacts by filename pattern.
 *
 * @param {Object} file - File object returned by walkFiles.
 * @param {Array<Object>} rules - ML artifact rules from detection-rules.ai-usage.json.
 * @returns {Array<Object>} List of findings.
 */
export function detectMLArtifacts(file, rules) {
  const findings = [];
  const { relativePath, name } = file;

  if (!rules) return findings;

  for (const rule of rules) {
    const regex = new RegExp(rule.pattern, 'i');
    
    if (regex.test(name)) {
      findings.push({
        finding_id: `find_ml_${Math.random().toString(36).substring(2, 10)}`,
        rule_pack_version: 'v1',
        category: rule.category,
        detection_category: rule.detection_category,
        severity: rule.severity,
        confidence: rule.confidence || 'high',
        detector: 'ml-artifact-detector',
        detector_id: 'ml_artifact_filename',
        signal_type: 'model_artifact',
        evidence_kind: 'filename',
        rule_id: rule.id,
        matched_name: name,
        file_path: relativePath,
        evidence_hint: `ML artifact matched pattern: '${rule.pattern}' (File name: '${name}')`,
        governance_relevance: rule.governance_relevance,
        recommended_review: rule.recommended_review
      });
    }
  }

  return findings;
}
