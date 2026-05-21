import crypto from 'node:crypto';
import path from 'node:path';

export function buildExportBundleMetadata(scanResult, aiUsageInventory, options = {}) {
  const generatedAt = new Date().toISOString();
  const bundleId = `bundle_${crypto.randomBytes(4).toString('hex')}`;
  
  const findingCount = scanResult.findings?.length || 0;
  const evidenceCandidateCount = options.evidenceCandidatesCount || 0;
  const inventoryComponentCount = aiUsageInventory ? Object.values(aiUsageInventory).flat().length : 0;

  return {
    schema_version: "0.11.0",
    bundle_type: "caesar-ai-scan-export-bundle",
    bundle_id: bundleId,
    generated_at: generatedAt,
    tool: {
      name: "caesar-ai-scan",
      version: "0.11.0"
    },
    source: {
      target_path: options.targetPath || "unknown",
      scan_mode: "static",
      generated_from_fixture: options.isFixture || false
    },
    artifacts: {
      scan_result: "scan-result.json",
      evidence_candidates: "evidence-candidates.json",
      review_summary: "review-summary.md",
      ai_usage_inventory: "ai-usage-inventory.json"
    },
    artifact_checksums: options.checksums || {},
    summary: {
      finding_count: findingCount,
      evidence_candidate_count: evidenceCandidateCount,
      inventory_component_count: inventoryComponentCount,
      review_required: true,
      export_status: "complete"
    },
    import_contract: {
      import_status: "candidate",
      backend_ready: true,
      requires_human_review: true,
      allowed_ingestion_mode: "offline_review_only"
    },
    safety: {
      secrets_redacted: true,
      no_external_fetching: true,
      no_live_ingestion: true,
      no_customer_data_required: true
    },
    warnings: []
  };
}
