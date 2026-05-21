/**
 * Backend Adapter Contract
 * 
 * Defines the interface for future backend ingestion adapters.
 * All adapters must implement this contract locally to simulate
 * ingestion without requiring a live backend or database.
 */

export const BackendAdapterContract = {
  // Save scan result to collection
  saveScanRun: async (scanRun) => { throw new Error('Not implemented'); },
  // Save findings
  saveFindings: async (findings) => { throw new Error('Not implemented'); },
  // Save inventory
  saveInventory: async (inventory) => { throw new Error('Not implemented'); },
  // Save review items
  saveReviewItems: async (reviewItems) => { throw new Error('Not implemented'); },
  // Log ledger
  saveLedgerEntry: async (entry) => { throw new Error('Not implemented'); }
};

export default BackendAdapterContract;
