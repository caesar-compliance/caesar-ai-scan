import crypto from 'crypto';

function generateFindingKey(finding) {
  // Stable key definition: category + detector + rule_id + matched_name + file_path
  const keyStr = [
    finding.category || '',
    finding.detector || '',
    finding.rule_id || '',
    finding.matched_name || '',
    finding.file_path || ''
  ].join('::');
  return crypto.createHash('md5').update(keyStr).digest('hex');
}

export function buildScanDiff(baselineRunId, currentRunId, baselineScanResult, currentScanResult) {
  const diffId = `diff_${crypto.randomBytes(4).toString('hex')}`;
  
  const baselineFindings = baselineScanResult ? baselineScanResult.findings || [] : [];
  const currentFindings = currentScanResult ? currentScanResult.findings || [] : [];

  const baselineMap = new Map();
  baselineFindings.forEach(f => {
    baselineMap.set(generateFindingKey(f), f);
  });

  const currentMap = new Map();
  currentFindings.forEach(f => {
    currentMap.set(generateFindingKey(f), f);
  });

  const added = [];
  const removed = [];
  const unchanged = [];
  const changed = [];

  // Check what is in current
  for (const [key, currF] of currentMap.entries()) {
    const baseF = baselineMap.get(key);
    if (!baseF) {
      added.push(currF);
    } else {
      // Check for changes - for MVP we ignore timestamps, just compare severity/recommendation, etc.
      // Easiest is stringify, but let's exclude generated fields like finding_id
      const bObj = { ...baseF }; delete bObj.finding_id;
      const cObj = { ...currF }; delete cObj.finding_id;
      
      if (JSON.stringify(bObj) === JSON.stringify(cObj)) {
        unchanged.push(currF);
      } else {
        changed.push(currF);
      }
    }
  }

  // Check what was removed
  for (const [key, baseF] of baselineMap.entries()) {
    if (!currentMap.has(key)) {
      removed.push(baseF);
    }
  }

  const diff = {
    schema_version: "0.7.0",
    diff_id: diffId,
    generated_at: new Date().toISOString(),
    baseline_run_id: baselineRunId || null,
    current_run_id: currentRunId,
    summary: {
      total_baseline: baselineFindings.length,
      total_current: currentFindings.length,
      added_count: added.length,
      removed_count: removed.length,
      changed_count: changed.length,
      unchanged_count: unchanged.length
    },
    added_findings: added,
    removed_findings: removed,
    changed_findings: changed,
    unchanged_findings: unchanged,
    recommended_review_actions: []
  };

  if (added.length > 0) {
    diff.recommended_review_actions.push(`${added.length} new findings introduced. Review required.`);
  }
  if (removed.length > 0) {
    diff.recommended_review_actions.push(`${removed.length} findings resolved.`);
  }
  if (!baselineRunId) {
    diff.recommended_review_actions.push("First run recorded. All findings treated as added.");
  }

  return diff;
}
