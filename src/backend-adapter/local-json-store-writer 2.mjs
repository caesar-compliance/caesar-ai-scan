import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

/**
 * Local JSON Store Writer
 */
export async function writeLocalJsonStore(store, outputDir) {
  mkdirSync(outputDir, { recursive: true });

  const writeCollection = (name, data) => {
    writeFileSync(join(outputDir, `${name}.json`), JSON.stringify(data.sort(), null, 2), 'utf8');
  };

  writeFileSync(join(outputDir, 'manifest.json'), JSON.stringify(store, null, 2), 'utf8');
  
  writeCollection('scan-runs', store.collections.scan_runs);
  writeCollection('findings', store.collections.findings);
  writeCollection('inventory-components', store.collections.inventory_components);
  writeCollection('review-items', store.collections.review_items);
  writeCollection('import-ledger', store.collections.import_ledger);

  return outputDir;
}
