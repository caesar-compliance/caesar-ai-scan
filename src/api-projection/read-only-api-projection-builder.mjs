import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

export async function buildApiProjection(storeDir) {
  const storeManifest = JSON.parse(await fs.readFile(path.join(storeDir, 'manifest.json'), 'utf8'));
  
  const projectionId = randomUUID();
  const generatedAt = new Date().toISOString();
  
  const projection = {
    schema_version: "0.14.0",
    projection_type: "caesar-ai-scan-read-only-api-projection",
    projection_id: projectionId,
    generated_at: generatedAt,
    source_store: {
      store_id: storeManifest.store_id,
      store_type: storeManifest.store_type,
      schema_version: storeManifest.schema_version
    },
    api_contract: {
      mode: "offline_static_json",
      read_only: true,
      no_server: true,
      no_database: true
    },
    endpoints: {
      health: "/health.json",
      dashboard_summary: "/dashboard-summary.json",
      scan_runs: "/scan-runs.json",
      findings: "/findings.json",
      inventory_components: "/inventory-components.json",
      review_items: "/review-items.json",
      import_ledger: "/import-ledger.json"
    },
    counts: {
      scan_run_count: storeManifest.counts.scan_run_count,
      finding_count: storeManifest.counts.finding_count,
      inventory_component_count: storeManifest.counts.inventory_component_count,
      review_item_count: storeManifest.counts.review_item_count,
      ledger_entry_count: storeManifest.counts.ledger_entry_count
    },
    safety: {
      no_database_writes: true,
      no_live_ingestion: true,
      no_external_fetching: true,
      local_filesystem_only: true,
      static_json_only: true,
      secrets_redacted: true
    },
    warnings: []
  };

  return projection;
}
