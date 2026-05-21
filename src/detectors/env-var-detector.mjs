import { readFileSync } from 'fs';

/**
 * Scans a file to detect AI environment variables / credentials.
 *
 * @param {Object} file - File object returned by walkFiles.
 * @param {Array<Object>} rules - Environment variable rules from detection-rules.ai-usage.json.
 * @returns {Array<Object>} List of findings.
 */
export function detectEnvVars(file, rules) {
  const findings = [];
  const { relativePath, fullPath } = file;

  try {
    const content = readFileSync(fullPath, 'utf8');
    const lines = content.split(/\r?\n/);

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (const rule of rules) {
        // Regex to search for environment variable usage or assignment
        const regex = new RegExp(`\\b${rule.pattern}\\b`);
        if (regex.test(line)) {
          // Clean/mask the line to prevent exposing real keys in audit evidence logs
          let maskedLine = line.trim();
          const assignmentIndex = maskedLine.indexOf('=');
          if (assignmentIndex !== -1) {
            const keyPart = maskedLine.substring(0, assignmentIndex).trim();
            const valuePart = maskedLine.substring(assignmentIndex + 1).trim();
            if (valuePart && !valuePart.startsWith('your-') && !valuePart.startsWith('placeholder')) {
              // Mask the secret value
              const visibleLen = Math.min(4, valuePart.length);
              const maskedVal = valuePart.substring(0, visibleLen) + '...[REDACTED]';
              maskedLine = `${keyPart}=${maskedVal}`;
            }
          }

          findings.push({
            finding_id: `find_env_${Math.random().toString(36).substring(2, 10)}`,
            rule_pack_version: 'v1',
            category: rule.category,
            detection_category: rule.detection_category || 'config_signal',
            severity: rule.severity,
            confidence: rule.confidence || 'high',
            detector: 'env-var-detector',
            detector_id: 'env_var_match',
            signal_type: 'config_signal',
            evidence_kind: 'text_pattern',
            rule_id: rule.id,
            matched_name: rule.pattern,
            file_path: relativePath,
            evidence_hint: `Detected environment variable usage on line ${i + 1}: '${maskedLine}'`,
            governance_relevance: rule.governance_relevance || 'Potential AI credential or configuration signal.',
            recommended_review: rule.recommended_review
          });
        }
      }
    }
  } catch (error) {
    // Return empty if file is unreadable
  }

  return findings;
}
