import fs from 'fs';
import path from 'path';
import { runImportDryRun } from '../src/import-dry-run/import-dry-run-builder.mjs';
import { writeImportLedger } from '../src/import-dry-run/import-ledger-writer.mjs';
import { generateImportReport } from '../src/report/import-dry-run-report.mjs';

const BUNDLE_DIR = 'tmp/sample-scan-export-bundle';
const DRY_RUN_OUT = 'tmp/sample-import-dry-run.json';
const LEDGER_OUT = 'tmp/sample-import-ledger.json';
const REPORT_OUT = 'tmp/sample-import-dry-run-report.md';

console.log('🚀 Running T012 Import Dry-Run Validation...');

// 1. Run Import Dry-Run
if (!fs.existsSync(BUNDLE_DIR)) {
    console.error(`❌ Bundle not found at ${BUNDLE_DIR}. Please run bundle:sample first.`);
    process.exit(1);
}

const dryRunResult = runImportDryRun(BUNDLE_DIR, DRY_RUN_OUT);
console.log(`✅ Import dry-run generated at ${DRY_RUN_OUT}`);

// 2. Ledger
writeImportLedger(dryRunResult, LEDGER_OUT);
console.log(`✅ Import ledger updated at ${LEDGER_OUT}`);

// 3. Report
const reportMd = generateImportReport(dryRunResult);
fs.writeFileSync(REPORT_OUT, reportMd);
console.log(`✅ Import dry-run report generated at ${REPORT_OUT}`);

// 4. Assertions
if (dryRunResult.schema_version !== '0.12.0') throw new Error('Schema version mismatch');
if (dryRunResult.import_status.status !== 'dry_run_passed') throw new Error('Dry run failed status');
if (!dryRunResult.source_bundle.checksums_verified) throw new Error('Checksums not verified');
if (dryRunResult.counts.finding_count <= 0) throw new Error('Findings count is 0');
if (!dryRunResult.import_status.requires_human_review) throw new Error('Human review not required');
if (!dryRunResult.safety.no_database_writes) throw new Error('Database writes not disabled');

console.log('🎉 All import dry-run validations PASSED successfully!');
