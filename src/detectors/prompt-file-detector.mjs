/**
 * Scans a file path to detect dedicated AI prompting artifacts.
 *
 * @param {Object} file - File object returned by walkFiles.
 * @param {Array<Object>} rules - Prompt file rules from detection-rules.ai-usage.json.
 * @returns {Array<Object>} List of findings.
 */
export function detectPromptFiles(file, rules) {
  const findings = [];
  const { relativePath, name } = file;

  for (const rule of rules) {
    const regex = new RegExp(rule.pattern, 'i');
    
    // We match against both the relative path (to catch directories/paths) and the file name
    if (regex.test(relativePath) || regex.test(name)) {
      findings.push({
        finding_id: `find_prompt_${Math.random().toString(36).substring(2, 10)}`,
        category: rule.category,
        severity: rule.severity,
        detector: 'prompt-file-detector',
        rule_id: rule.id,
        matched_name: name,
        file_path: relativePath,
        evidence_hint: `Prompt artifact matched pattern: '${rule.pattern}' (File name: '${name}')`,
        recommended_review: rule.recommended_review
      });
      // Break early to avoid double-matching the same file with multiple prompt rules
      break;
    }
  }

  return findings;
}
