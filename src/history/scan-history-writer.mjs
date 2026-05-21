import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export function writeScanHistory(historyDir, runId, options) {
  const {
    scanResultPath,
    evidenceCandidatesPath,
    reviewWorkflowPath,
    exportPackPath,
    targetProject,
    toolVersion = "0.8.0"
  } = options;

  if (!fs.existsSync(historyDir)) {
    fs.mkdirSync(historyDir, { recursive: true });
  }

  const runDir = path.join(historyDir, 'runs', runId);
  fs.mkdirSync(runDir, { recursive: true });

  const generatedAt = new Date().toISOString();

  // Copy files
  const scanResultDest = path.join(runDir, 'scan-result.json');
  fs.copyFileSync(scanResultPath, scanResultDest);

  if (evidenceCandidatesPath && fs.existsSync(evidenceCandidatesPath)) {
    fs.copyFileSync(evidenceCandidatesPath, path.join(runDir, 'evidence-candidates.json'));
  }
  if (reviewWorkflowPath && fs.existsSync(reviewWorkflowPath)) {
    fs.copyFileSync(reviewWorkflowPath, path.join(runDir, 'review-workflow.json'));
  }
  if (exportPackPath && fs.existsSync(exportPackPath)) {
    // Attempt to copy manifest.json from the pack dir
    const manifestSrc = path.join(exportPackPath, 'manifest.json');
    if (fs.existsSync(manifestSrc)) {
      fs.copyFileSync(manifestSrc, path.join(runDir, 'export-pack-manifest.json'));
    }
  }

  // Load scan result for summary
  const scanResult = JSON.parse(fs.readFileSync(scanResultDest, 'utf8'));

  // Build scan-run.json
  const scanRun = {
    schema_version: "0.8.0",
    run_id: runId,
    generated_at: generatedAt,
    source_tool: "caesar-ai-scan",
    source_tool_version: toolVersion,
    target_project: targetProject,
    target_hash: scanResult.target || targetProject,
    scan_result_ref: "scan-result.json",
    review_workflow_ref: fs.existsSync(path.join(runDir, 'review-workflow.json')) ? "review-workflow.json" : null,
    export_pack_ref: fs.existsSync(path.join(runDir, 'export-pack-manifest.json')) ? "export-pack-manifest.json" : null,
    scope_summary: scanResult.scope || {},
    findings_summary: scanResult.summary || {},
    safety_flags: ["Offline MVP history generated safely."]
  };

  fs.writeFileSync(path.join(runDir, 'scan-run.json'), JSON.stringify(scanRun, null, 2));

  // Update history-index.json
  const indexPath = path.join(historyDir, 'history-index.json');
  let historyIndex = {
    schema_version: "0.8.0",
    generated_at: generatedAt,
    history_dir: historyDir,
    target_project: targetProject,
    runs: [],
    latest_run_id: null,
    run_count: 0,
    safety_notes: [
      "This history index is strictly local and offline.",
      "Do not publish this file to public web servers."
    ]
  };

  if (fs.existsSync(indexPath)) {
    try {
      historyIndex = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
    } catch (e) {
      console.warn(`Warning: Could not parse existing history index at ${indexPath}. Creating new.`);
    }
  }

  historyIndex.runs.push({
    run_id: runId,
    generated_at: generatedAt
  });
  
  historyIndex.generated_at = generatedAt;
  historyIndex.latest_run_id = runId;
  historyIndex.run_count = historyIndex.runs.length;
  historyIndex.target_project = targetProject; // Ensure it matches the latest

  fs.writeFileSync(indexPath, JSON.stringify(historyIndex, null, 2));
  
  return { runDir, scanRun, historyIndex };
}
