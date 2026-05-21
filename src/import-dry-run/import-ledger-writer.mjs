import fs from 'fs';
import path from 'path';

export function writeImportLedger(dryRunResult, ledgerPath) {
    const entry = {
        import_id: dryRunResult.import_id,
        source_bundle_id: dryRunResult.source_bundle.bundle_id,
        status: dryRunResult.import_status.status,
        review_required: dryRunResult.import_status.requires_human_review,
        generated_at: dryRunResult.generated_at,
        record_counts: dryRunResult.counts
    };

    // Append as a new line in JSONL format
    const ledgerEntry = JSON.stringify(entry) + '\n';
    fs.appendFileSync(ledgerPath, ledgerEntry);
    
    return entry;
}
