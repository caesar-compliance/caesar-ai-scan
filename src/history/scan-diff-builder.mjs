import crypto from 'crypto';

function generateFindingKey(finding) {
  // Stable key definition: category + detector + rule_id + matched_name + file_path
  // MUST NOT include finding_id because that changes per run for new discoveries
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

  const normalize = (f) => {
    const n = { ...f };
    delete n.finding_id;
    return n;
  };

  // Track findings by content-based key, supporting multiple identical findings per run
  const baselineMap = new Map();
  baselineFindings.forEach(f => {
    const nf = normalize(f);
    const key = generateFindingKey(nf);
    if (!baselineMap.has(key)) baselineMap.set(key, []);
    baselineMap.get(key).push(f);
  });

  const currentMap = new Map();
  currentFindings.forEach(f => {
    const nf = normalize(f);
    const key = generateFindingKey(nf);
    if (!currentMap.has(key)) currentMap.set(key, []);
    currentMap.get(key).push(f);
  });

  const added = [];
  const removed = [];
  const unchanged = [];
  const changed = [];

  const allKeys = new Set([...baselineMap.keys(), ...currentMap.keys()]);

  for (const key of allKeys) {
    const baseList = baselineMap.get(key) || [];
    const currList = currentMap.get(key) || [];

    const baseCount = baseList.length;
    const currCount = currList.length;

    if (baseCount === currCount) {
      // Same count, assume unchanged for this MVP
      unchanged.push(...currList);
    } else if (currCount > baseCount) {
      // More in current
      unchanged.push(...baseList);
      added.push(...currList.slice(baseCount));
    } else {
      // More in baseline (removed)
      unchanged.push(...currList);
      removed.push(...baseList.slice(currCount));
    }
  }

  const diff = {
    schema_version: "0.8.0",
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
