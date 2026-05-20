import { resolveScanScope } from './scope-resolver.mjs';
import { loadRules } from '../rules/load-rules.mjs';
import { detectDependencies } from '../detectors/dependency-detector.mjs';
import { detectEnvVars } from '../detectors/env-var-detector.mjs';
import { detectPromptFiles } from '../detectors/prompt-file-detector.mjs';
import { detectVectorDBs } from '../detectors/vector-db-detector.mjs';
import { resolve } from 'path';

/**
 * Orchestrates the full static-analysis scan over the target directory.
 *
 * @param {string} targetDir - Path of the target directory to scan.
 * @param {Object} [options={}] - Custom scan overrides.
 * @returns {Object} Structured scan-result matching schemas/scan-result.schema.json.
 */
export function runScan(targetDir, options = {}) {
  // Load clean-room rules
  const rules = loadRules(options.rulesPath);

  // Resolve scope (which parses .caesarignore and config options)
  const scope = resolveScanScope(targetDir, options);

  // Re-map included file paths to the walker structure expected by detectors
  const files = scope.files.included.map(relativePath => ({
    fullPath: resolve(targetDir, relativePath),
    relativePath,
    name: relativePath.split('/').pop()
  }));

  const findings = [];

  for (const file of files) {
    // 1. Dependency findings
    const depFindings = detectDependencies(file, rules.dependencies);
    findings.push(...depFindings);

    // 2. Env var findings
    const envFindings = detectEnvVars(file, rules.env_vars);
    findings.push(...envFindings);

    // 3. Prompt file findings
    const promptFindings = detectPromptFiles(file, rules.prompt_files);
    findings.push(...promptFindings);

    // 4. Vector DB findings
    const vectorFindings = detectVectorDBs(file, rules.dependencies);
    findings.push(...vectorFindings);
  }

  // Count findings by detector/category
  const depCount = findings.filter(f => f.detector === 'dependency-detector').length;
  const envCount = findings.filter(f => f.detector === 'env-var-detector').length;
  const promptCount = findings.filter(f => f.detector === 'prompt-file-detector').length;
  const vectorCount = findings.filter(f => f.detector === 'vector-db-detector').length;

  const result = {
    schema_version: '0.5.0',
    scanner: {
      name: 'caesar-ai-scan',
      version: '0.5.0'
    },
    scanned_at: new Date().toISOString(),
    target: targetDir,
    summary: {
      total_files: scope.summary.included_count + scope.summary.excluded_count + scope.summary.skipped_count,
      scanned_files: files.length,
      total_findings: findings.length,
      dependency_findings: depCount,
      env_var_findings: envCount,
      prompt_findings: promptCount,
      vector_db_findings: vectorCount
    },
    scope: {
      included_count: scope.summary.included_count,
      excluded_count: scope.summary.excluded_count,
      skipped_count: scope.summary.skipped_count,
      files: scope.files
    },
    findings
  };

  return result;
}
