import { readFileSync } from 'fs';
import { BackendAdapterContract } from './backend-adapter-contract.mjs';
import { writeLocalJsonStore } from './local-json-store-writer.mjs';

/**
 * Local JSON Store Adapter
 * 
 * Reads T012 dry-run results and writes to a deterministic local JSON store.
 */
export async function runLocalJsonStoreAdapter(dryRunPath, outputDir) {
  const dryRunData = JSON.parse(readFileSync(dryRunPath, 'utf8'));

  const store = {
    schema_version: '0.13.0',
    store_type: 'caesar-ai-scan-local-json-store',
    store_id: `store_${Date.now()}`,
    created_at: new Date().toISOString(),
    source_import: {
      import_id: dryRunData.import_id || 'unknown',
      import_type: 'dry_run_import',
      schema_version: dryRunData.schema_version || '0.12.0',
      import_status: 'imported_to_local_store'
    },
    adapter: {
      name: 'local-json-store-adapter',
      version: '0.13.0',
      mode: 'local_json_dry_run'
    },
    collections: {
      scan_runs: dryRunData.scan_runs || [],
      findings: dryRunData.findings || [],
      inventory_components: dryRunData.inventory_components || [],
      review_items: dryRunData.review_items || [],
      import_ledger: dryRunData.import_ledger || []
    },
    counts: {
      scan_run_count: (dryRunData.scan_runs || []).length,
      finding_count: (dryRunData.findings || []).length,
      inventory_component_count: (dryRunData.inventory_components || []).length,
      review_item_count: (dryRunData.review_items || []).length,
      ledger_entry_count: (dryRunData.import_ledger || []).length
    },
    safety: {
      no_database_writes: true,
      no_live_ingestion: true,
      no_external_fetching: true,
      local_filesystem_only: true,
      secrets_redacted: true
    },
    warnings: ['Simulator dry run data. Do not use for production.']
  };

  return await writeLocalJsonStore(store, outputDir);
}
