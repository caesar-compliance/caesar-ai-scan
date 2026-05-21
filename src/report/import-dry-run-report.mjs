export function generateImportReport(dryRunResult) {
    const report = `
# Caesar AI Scan Import Dry-Run Report

**Status:** ${dryRunResult.import_status.status}
**Generated:** ${dryRunResult.generated_at}
**Import ID:** ${dryRunResult.import_id}

## Source Bundle
- Bundle ID: ${dryRunResult.source_bundle.bundle_id}
- Schema: ${dryRunResult.source_bundle.schema_version}
- Checksums Verified: ${dryRunResult.source_bundle.checksums_verified ? "✅ YES" : "❌ NO"}

## Record Counts
- Findings: ${dryRunResult.counts.finding_count}
- Inventory Components: ${dryRunResult.counts.inventory_component_count}
- Evidence Candidates: ${dryRunResult.counts.evidence_candidate_count}
- Review Items: ${dryRunResult.counts.review_item_count}

## Safety & Compliance
- No Live Ingestion: ✅
- No Database Writes: ✅
- No External Fetching: ✅
- Secrets Redacted: ✅
- Human Review Required: ${dryRunResult.import_status.requires_human_review ? "✅ YES" : "❌ NO"}

## Warnings/Errors
${dryRunResult.warnings.length > 0 ? dryRunResult.warnings.map(w => `- ⚠️ ${w}`).join('\n') : "None"}
${dryRunResult.errors.length > 0 ? dryRunResult.errors.map(e => `- ❌ ${e}`).join('\n') : ""}

---
This report is for **DRY-RUN purposes only**. No data has been ingested into a live backend.
`;
    return report;
}
