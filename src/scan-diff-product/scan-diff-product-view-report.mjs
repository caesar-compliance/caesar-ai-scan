/**
 * Caesar AI Scan - Scan Diff Product View Report Generator
 * Transforms raw diff findings into product-centric insights.
 */

export function generateScanDiffProductView(rawDiff) {
  const {
    added_findings = [],
    removed_findings = [],
    changed_findings = [],
    unchanged_findings = [],
    summary = {},
    baseline_run_id = null,
    current_run_id = "unknown"
  } = rawDiff;

  const affectedFiles = new Set();
  const affectedProviders = new Set();
  const affectedFrameworks = new Set();

  [...added_findings, ...removed_findings, ...changed_findings].forEach(f => {
    if (f.file_path) affectedFiles.add(f.file_path);
    
    // Naive extraction of provider/framework from detector/category for this static view
    if (f.detector) {
      if (f.detector.toLowerCase().includes('openai')) affectedProviders.add('OpenAI');
      if (f.detector.toLowerCase().includes('anthropic')) affectedProviders.add('Anthropic');
      if (f.detector.toLowerCase().includes('google')) affectedProviders.add('Google Vertex/AI');
      if (f.detector.toLowerCase().includes('aws')) affectedProviders.add('AWS Bedrock');
      
      if (f.detector.toLowerCase().includes('langchain')) affectedFrameworks.add('LangChain');
      if (f.detector.toLowerCase().includes('llama')) affectedFrameworks.add('LlamaIndex');
    }
    
    if (f.category) {
      if (f.category.toLowerCase().includes('provider')) {
        // Try to find specific provider in matched_name or content
        const name = (f.matched_name || '').toLowerCase();
        if (name.includes('openai')) affectedProviders.add('OpenAI');
        else if (name.includes('anthropic')) affectedProviders.add('Anthropic');
      }
    }
  });

  const reviewImplications = [];
  if (added_findings.length > 0) {
    reviewImplications.push(`${added_findings.length} new signals require immediate audit to ensure alignment with AI policy.`);
  }
  if (removed_findings.length > 0) {
    reviewImplications.push(`${removed_findings.length} signals were removed. Verify if these were intentional deprecations.`);
  }
  if (changed_findings.length > 0) {
    reviewImplications.push(`${changed_findings.length} signals changed. Check for model version upgrades or configuration drift.`);
  }
  if (reviewImplications.length === 0) {
    reviewImplications.push("No significant changes detected. Review queue remains stable.");
  }

  return {
    version: "0.27.0",
    generated_at: new Date().toISOString(),
    diff_status: "available",
    compared_runs: {
      baseline: baseline_run_id,
      current: current_run_id
    },
    summary: {
      total_changes: added_findings.length + removed_findings.length + changed_findings.length,
      added_count: added_findings.length,
      removed_count: removed_findings.length,
      changed_count: changed_findings.length,
      unchanged_count: unchanged_findings.length
    },
    sections: {
      added_signals: added_findings.map(f => ({
        id: f.rule_id,
        name: f.matched_name,
        file: f.file_path,
        severity: f.severity
      })),
      removed_signals: removed_findings.map(f => ({
        id: f.rule_id,
        name: f.matched_name,
        file: f.file_path
      })),
      changed_signals: changed_findings,
      affected_files: Array.from(affectedFiles),
      affected_providers: Array.from(affectedProviders),
      affected_frameworks: Array.from(affectedFrameworks),
      review_implications: reviewImplications,
      safety_notes: [
        "This is a static product view derived from local scan history.",
        "No backend connection was established to generate this report.",
        "Deterministic local-only analysis used."
      ]
    },
    backend_execution_enabled: false,
    live_services_enabled: false
  };
}

export function generateSampleDiffProductView() {
  const sampleDiff = {
    added_findings: [
      { rule_id: "openai-sdk", matched_name: "openai", file_path: "src/new-feature.js", severity: "medium", detector: "openai-detector" },
      { rule_id: "langchain-core", matched_name: "langchain", file_path: "package.json", severity: "low", detector: "langchain-detector" }
    ],
    removed_findings: [
      { rule_id: "legacy-ai-lib", matched_name: "old-ai-sdk", file_path: "src/legacy.js", detector: "generic-detector" }
    ],
    changed_findings: [],
    unchanged_findings: Array(15).fill({}),
    baseline_run_id: "run-2026-05-21-120000",
    current_run_id: "run-2026-05-22-100000"
  };
  return generateScanDiffProductView(sampleDiff);
}
