import { readFileSync } from 'fs';
import { readJsonSafe } from '../utils/read-json-safe.mjs';

/**
 * Scans a file to detect AI-related package dependencies.
 * Supports Node.js (package.json) and Python (requirements.txt).
 *
 * @param {Object} file - File object returned by walkFiles.
 * @param {Array<Object>} rules - Dependency rules from detection-rules.ai-usage.json.
 * @returns {Array<Object>} List of findings.
 */
export function detectDependencies(file, rules) {
  const findings = [];
  const { relativePath, fullPath, name } = file;

  if (name === 'package.json') {
    const pkg = readJsonSafe(fullPath);
    if (pkg) {
      const allDeps = {
        ...pkg.dependencies,
        ...pkg.devDependencies,
        ...pkg.peerDependencies
      };

      for (const [depName, depVersion] of Object.entries(allDeps)) {
        for (const rule of rules) {
          const regex = new RegExp(rule.pattern, 'i');
          if (regex.test(depName)) {
            findings.push({
              finding_id: `find_dep_${Math.random().toString(36).substring(2, 10)}`,
              category: rule.category,
              severity: rule.severity,
              detector: 'dependency-detector',
              rule_id: rule.id,
              matched_name: depName,
              file_path: relativePath,
              evidence_hint: `Detected '${depName}': '${depVersion}' in package.json dependencies list.`,
              recommended_review: rule.recommended_review
            });
          }
        }
      }
    }
  } else if (name === 'requirements.txt') {
    try {
      const content = readFileSync(fullPath, 'utf8');
      const lines = content.split(/\r?\n/);
      
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim();
        // Skip comments and empty lines
        if (!line || line.startsWith('#')) continue;

        // Extract package name before any version specifier (==, >=, <=, ~=, <, >, !=)
        const match = line.split(/[=><!~]/)[0].trim();
        if (match) {
          for (const rule of rules) {
            const regex = new RegExp(rule.pattern, 'i');
            if (regex.test(match)) {
              findings.push({
                finding_id: `find_dep_${Math.random().toString(36).substring(2, 10)}`,
                category: rule.category,
                severity: rule.severity,
                detector: 'dependency-detector',
                rule_id: rule.id,
                matched_name: match,
                file_path: relativePath,
                evidence_hint: `Detected '${match}' on line ${i + 1} of requirements.txt: '${line}'`,
                recommended_review: rule.recommended_review
              });
            }
          }
        }
      }
    } catch (error) {
      // Return empty if file is unreadable
    }
  }

  return findings;
}
