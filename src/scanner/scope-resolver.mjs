import { readdirSync, statSync } from 'fs';
import { join, relative, resolve } from 'path';

import { globToRegex, isPathIgnored } from './path-matcher.mjs';
import { parseCaesarIgnore } from '../config/parse-caesarignore.mjs';
import { parseConfig } from '../config/load-scan-config.mjs';

// Re-export for backward compatibility
export { globToRegex, isPathIgnored } from './path-matcher.mjs';
export { parseCaesarIgnore } from '../config/parse-caesarignore.mjs';
export { parseConfig } from '../config/load-scan-config.mjs';

const STANDARD_IGNORES = new Set([
  '.git',
  'node_modules',
  'venv',
  '.venv',
  'dist',
  'build',
  '.DS_Store'
]);

const BINARY_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'ico', 'pdf', 'zip', 'tar', 'gz', 'dmg', 'exe',
  'mp3', 'mp4', 'mov', 'wav', 'webp', 'woff', 'woff2', 'eot', 'ttf'
]);

/**
 * Resolves the static scan scope of the target repository.
 * Recursively walks folders, checking both standard and custom ignores.
 *
 * @param {string} targetDir - Path to target directory.
 * @param {Object} [configOptions={}] - Configuration options.
 * @returns {Object} Structured resolved scope mapping.
 */
export function resolveScanScope(targetDir, configOptions = {}) {
  const resolvedTarget = resolve(targetDir);
  
  // 1. Load patterns from .caesarignore in targetDir
  const ignoreFilePath = join(resolvedTarget, '.caesarignore');
  const ignorePatterns = parseCaesarIgnore(ignoreFilePath);
  
  // 2. Load patterns from config exclude
  const configExcludePatterns = (configOptions.exclude || []).map(pattern => ({
    raw: pattern,
    regex: globToRegex(pattern)
  }));
  
  const allIgnorePatterns = [...ignorePatterns, ...configExcludePatterns];

  const included = [];
  const excluded = [];
  const skipped = [];

  function traverse(currentDir) {
    let entries = [];
    try {
      entries = readdirSync(currentDir);
    } catch (err) {
      return;
    }

    for (const entry of entries) {
      const fullPath = join(currentDir, entry);
      const relativePath = relative(resolvedTarget, fullPath);

      // Check standard ignores at directory/file level
      if (STANDARD_IGNORES.has(entry)) {
        skipped.push({
          relativePath,
          reason: 'standard_ignore',
          type: statSync(fullPath).isDirectory() ? 'directory' : 'file'
        });
        continue; // Do not walk ignored directories
      }

      let stat;
      try {
        stat = statSync(fullPath);
      } catch (err) {
        continue;
      }

      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (stat.isFile()) {
        // Check custom ignores (.caesarignore and config excludes)
        const ignoreCheck = isPathIgnored(relativePath, allIgnorePatterns);
        if (ignoreCheck.matched) {
          excluded.push({
            relativePath,
            reason: `ignored_by_pattern: ${ignoreCheck.pattern}`
          });
        } else {
          // Check binary/unsupported files
          const ext = entry.split('.').pop().toLowerCase();
          if (BINARY_EXTENSIONS.has(ext)) {
            skipped.push({
              relativePath,
              reason: 'binary_file',
              type: 'file'
            });
          } else {
            included.push({
              fullPath,
              relativePath,
              name: entry
            });
          }
        }
      }
    }
  }

  traverse(resolvedTarget);

  return {
    schema_version: '0.5.0',
    target: targetDir,
    resolved_at: new Date().toISOString(),
    summary: {
      total_found: included.length + excluded.length + skipped.length,
      included_count: included.length,
      excluded_count: excluded.length,
      skipped_count: skipped.length
    },
    files: {
      included: included.map(f => f.relativePath),
      excluded,
      skipped
    }
  };
}
