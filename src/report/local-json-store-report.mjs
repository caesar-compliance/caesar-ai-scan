import { readFileSync } from 'fs';
import { join } from 'path';

/**
 * Local JSON Store Report
 */
export function generateLocalJsonStoreReport(store) {
  return `# Caesar AI Local JSON Store Report

## 📊 Summary
- **Store ID:** ${store.store_id}
- **Generated At:** ${store.created_at}
- **Source Import ID:** ${store.source_import.import_id}

## 📦 Contents
- **Scan Runs:** ${store.counts.scan_run_count}
- **Findings:** ${store.counts.finding_count}
- **Inventory Components:** ${store.counts.inventory_component_count}
- **Review Items:** ${store.counts.review_item_count}
- **Ledger Entries:** ${store.counts.ledger_entry_count}

## 🛡️ Safety & Disclaimer
- **No Database Writes:** ${store.safety.no_database_writes}
- **Local Filesystem Only:** ${store.safety.local_filesystem_only}

> [!WARNING]
> This is a local prototype store. It is not a real backend or database.
`;
}
