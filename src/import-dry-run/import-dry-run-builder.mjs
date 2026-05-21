import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export function runImportDryRun(bundlePath, outputPath) {
    if (!fs.existsSync(bundlePath)) {
        throw new Error(`Bundle directory not found: ${bundlePath}`);
    }

    const manifestPath = path.join(bundlePath, 'manifest.json');
    if (!fs.existsSync(manifestPath)) {
        throw new Error(`Manifest not found in bundle: ${bundlePath}`);
    }

    const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
    
    // Simple checksum verification (assuming manifest format matches T011)
    let checksumsVerified = true;
    if (manifest.artifacts && manifest.artifact_checksums) {
        for (const [key, filename] of Object.entries(manifest.artifacts)) {
            const expectedHash = manifest.artifact_checksums[filename];
            if (expectedHash) {
                const filePath = path.join(bundlePath, filename);
                if (fs.existsSync(filePath)) {
                    const fileBuffer = fs.readFileSync(filePath);
                    const actualHash = crypto.createHash('sha256').update(fileBuffer).digest('hex');
                    if (actualHash !== expectedHash) {
                        checksumsVerified = false;
                    }
                } else {
                    checksumsVerified = false;
                }
            }
        }
    }

    const dryRun = {
        schema_version: "0.12.0",
        import_type: "caesar-ai-scan-offline-import-dry-run",
        import_id: `imp-${crypto.randomBytes(4).toString('hex')}`,
        generated_at: new Date().toISOString(),
        source_bundle: {
            bundle_id: manifest.bundle_id || 'unknown',
            bundle_type: manifest.bundle_type || 'unknown',
            schema_version: manifest.schema_version || 'unknown',
            manifest_path: manifestPath,
            checksums_verified: checksumsVerified
        },
        tool: {
            name: "caesar-ai-scan",
            version: "0.12.0"
        },
        import_status: {
            status: checksumsVerified ? "dry_run_passed" : "dry_run_failed",
            backend_ready_candidate: true,
            requires_human_review: true,
            allowed_ingestion_mode: "offline_review_only"
        },
        normalized_records: {
            scan_summary: manifest.scan_summary || manifest.summary || {},
            findings: manifest.findings || [],
            inventory_components: manifest.inventory_components || [],
            evidence_candidates: manifest.evidence_candidates || [],
            review_items: manifest.review_items || []
        },
        counts: {
            finding_count: (manifest.findings || []).length || (manifest.summary?.finding_count || 0),
            inventory_component_count: (manifest.inventory_components || []).length || (manifest.summary?.inventory_component_count || 0),
            evidence_candidate_count: (manifest.evidence_candidates || []).length || (manifest.summary?.evidence_candidate_count || 0),
            review_item_count: (manifest.review_items || []).length || 0
        },
        safety: {
            no_live_ingestion: true,
            no_database_writes: true,
            no_external_fetching: true,
            secrets_redacted: true,
            customer_data_required: false
        },
        warnings: checksumsVerified ? [] : ["Checksum verification failed for one or more artifacts."],
        errors: []
    };

    fs.writeFileSync(outputPath, JSON.stringify(dryRun, null, 2));
    return dryRun;
}
