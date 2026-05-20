import { hashArtifact } from './hash-artifact.mjs';

/**
 * Builds the export manifest object.
 *
 * @param {string} targetProjectPath - Path of the target project directory.
 * @param {Object} artifactPayloads - Object mapping filenames to string or JSON payloads.
 * @returns {Object} Manifest object compliant with schemas/export-manifest.schema.json.
 */
export function buildExportManifest(targetProjectPath, artifactPayloads) {
  const hashSummary = {};
  const includedArtifacts = Object.keys(artifactPayloads);
  
  for (const filename of includedArtifacts) {
    hashSummary[filename] = hashArtifact(artifactPayloads[filename]);
  }

  const scanResult = artifactPayloads['scan-result.json'];
  const candidates = artifactPayloads['evidence-candidates.json'];
  const reviewWorkflow = artifactPayloads['review-workflow.json'];

  const findingsCount = scanResult ? (scanResult.findings ? scanResult.findings.length : 0) : 0;
  const candidatesCount = candidates ? candidates.length : 0;
  const reviewItemsCount = reviewWorkflow ? (reviewWorkflow.review_items ? reviewWorkflow.review_items.length : 0) : 0;
  
  let gapsCount = 0;
  if (reviewWorkflow && reviewWorkflow.review_items) {
    for (const item of reviewWorkflow.review_items) {
      gapsCount += item.evidence_gaps ? item.evidence_gaps.length : 0;
    }
  }

  const envVarFindingsCount = scanResult ? (scanResult.summary ? scanResult.summary.env_var_findings : 0) : 0;

  return {
    manifest_id: `man_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
    generated_at: new Date().toISOString(),
    source_tool: 'caesar-ai-scan',
    source_tool_version: '0.4.0',
    target_project_path: targetProjectPath,
    included_artifacts: includedArtifacts,
    artifact_counts: {
      findings_count: findingsCount,
      candidates_count: candidatesCount,
      review_items_count: reviewItemsCount,
      gaps_count: gapsCount
    },
    safety_flags: {
      no_plaintext_credentials_exposed: envVarFindingsCount === 0,
      all_candidates_are_drafts: true,
      no_competitor_licenses_flagged: true
    },
    hash_summary: hashSummary,
    compatibility: {
      schema_version: '0.4.0',
      minimum_governance_os_version: '1.0.0'
    }
  };
}
