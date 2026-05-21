import fs from 'fs/promises';
import path from 'path';

async function build() {
  const bundleDir = 'tmp/sample-scan-export-bundle';
  const outPath = 'tmp/sample-supabase-import-mapping.json';

  // Read bundle if exists
  let bundle = {};
  try {
    const data = await fs.readFile(path.join(bundleDir, 'scan-result.json'), 'utf8');
    bundle = JSON.parse(data);
  } catch (e) {
    bundle = { sample_scan: "no-bundle-found" };
  }

  const mapping = {
    schema_version: "0.18.0",
    generated_at: new Date().toISOString(),
    mapping_sample: {
      source_run: bundle.scan_run_id || "sample-run-123",
      dest_table: "ai_scan_runs",
      dest_mapping: {
        run_timestamp: "2026-05-21T19:26:00Z"
      }
    }
  };

  await fs.writeFile(outPath, JSON.stringify(mapping, null, 2));
  console.log(`✅ Mapping sample written to ${outPath}`);
}

build();
