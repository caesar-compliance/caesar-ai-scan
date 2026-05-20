import { walkFiles } from './file-walker.mjs';
import { loadRules } from '../rules/load-rules.mjs';
import { detectDependencies } from '../detectors/dependency-detector.mjs';
import { detectEnvVars } from '../detectors/env-var-detector.mjs';
import { detectPromptFiles } from '../detectors/prompt-file-detector.mjs';
import { detectVectorDBs } from '../detectors/vector-db-detector.mjs';

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

  // Traverse filesystem
  const files = walkFiles(targetDir);

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
    schema_version: '0.4.0',
    scanner: {
      name: 'caesar-ai-scan',
      version: '0.4.0'
    },
    scanned_at: new Date().toISOString(),
    target: targetDir,
    summary: {
      total_files: files.length,
      scanned_files: files.length, // Offline walks currently process all found files
      total_findings: findings.length,
      dependency_findings: depCount,
      env_var_findings: envCount,
      prompt_findings: promptCount,
      vector_db_findings: vectorCount
    },
    findings
  };

  return result;
}
