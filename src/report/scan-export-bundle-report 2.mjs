export function generateBundleReport(metadata) {
  return `
# Caesar AI Scan Export Bundle Report
Generated at: ${metadata.generated_at}
Bundle ID: ${metadata.bundle_id}

## Summary
- Findings: ${metadata.summary.finding_count}
- Evidence Candidates: ${metadata.summary.evidence_candidate_count}
- Inventory Components: ${metadata.summary.inventory_component_count}
- Review Required: ${metadata.summary.review_required ? "YES" : "NO"}
- Status: ${metadata.summary.export_status}

## Import Contract
- Backend Ready: ${metadata.import_contract.backend_ready}
- Human Review Required: ${metadata.import_contract.requires_human_review}
- Mode: ${metadata.import_contract.allowed_ingestion_mode}

## Safety Flags
- Secrets Redacted: ${metadata.safety.secrets_redacted}
- No External Fetching: ${metadata.safety.no_external_fetching}
- No Live Ingestion: ${metadata.safety.no_live_ingestion}

*Note: This bundle is for offline review and future backend ingestion. Do not manually ingest if not explicitly authorized.*
`;
}
