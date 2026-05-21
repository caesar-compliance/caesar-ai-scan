import { buildExportManifest } from './export-manifest-builder.mjs';
import { buildImportReadiness } from './import-readiness-builder.mjs';
import { buildHumanReviewChecklist } from './human-review-checklist-builder.mjs';

/**
 * Coordinates building the full CaesarEvidenceExportPack in-memory object.
 *
 * @param {Object} params - The inputs needed to construct the pack.
 * @param {string} params.targetProjectPath - Path of the target project directory.
 * @param {Object} params.scanResult - The raw scan result JSON.
 * @param {Array<Object>} params.evidenceCandidates - Array of evidence candidate drafts.
 * @param {Object} params.reviewWorkflow - The review workflow including readiness scoring and gaps.
 * @returns {Object} Export pack parent object compliant with schemas/evidence-export-pack.schema.json.
 */
export function buildExportPack({
  targetProjectPath,
  scanResult,
  evidenceCandidates,
  reviewWorkflow
}) {
  // 1. Assess import readiness
  const importReadiness = buildImportReadiness(reviewWorkflow);

  // 2. Build human auditor checklist
  const humanReviewChecklist = buildHumanReviewChecklist(reviewWorkflow);

  // 3. Define the payloads of individual artifacts to manifest and hash
  const artifactPayloads = {
    'scan-result.json': scanResult,
    'evidence-candidates.json': evidenceCandidates,
    'review-workflow.json': reviewWorkflow,
    'import-readiness.json': importReadiness,
    'human-review-checklist.json': humanReviewChecklist
  };

  // 4. Build manifest summarizing hashes and safety checks
  const manifest = buildExportManifest(targetProjectPath, artifactPayloads);

  // Sanitize path for safety
  const cwd = process.cwd();
  const safeTargetProjectPath = targetProjectPath.startsWith(cwd) 
    ? './' + targetProjectPath.replace(cwd, '').replace(/^\/+/, '')
    : targetProjectPath;

  // 5. Construct the parent export pack
  return {
    schema_version: '0.5.0',
    pack_id: `pack_${Math.random().toString(36).substring(2, 10)}${Math.random().toString(36).substring(2, 10)}`,
    generated_at: new Date().toISOString(),
    source_tool: 'caesar-ai-scan',
    source_tool_version: scanResult ? (scanResult.scanner ? scanResult.scanner.version : '0.9.0') : '0.9.0',
    target_project: safeTargetProjectPath,
    manifest,
    scan_result: scanResult,
    evidence_candidates: evidenceCandidates,
    review_workflow: reviewWorkflow,
    import_readiness: importReadiness,
    human_review_checklist: humanReviewChecklist,
    integration_notes: 'This bundle is an intermediate offline audit package. All evidence candidates are hard-locked to draft status and require human auditor sign-off inside the Governance OS or manual review checklist before ingestion.'
  };
}
