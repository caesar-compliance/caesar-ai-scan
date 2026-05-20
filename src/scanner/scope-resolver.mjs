import { existsSync, readFileSync, readdirSync, statSync } from 'fs';
import { join, relative, resolve, dirname } from 'path';

const STANDARD_IGNORES = new Set([
  '.git',
  'node_modules',
  'venv',
  '.venv',
  'dist',
  'build',
  'tmp',
  '.DS_Store'
]);

const BINARY_EXTENSIONS = new Set([
  'png', 'jpg', 'jpeg', 'gif', 'ico', 'pdf', 'zip', 'tar', 'gz', 'dmg', 'exe',
  'mp3', 'mp4', 'mov', 'wav', 'webp', 'woff', 'woff2', 'eot', 'ttf'
]);

/**
 * Converts a gitignore-style glob pattern into a robust RegExp.
 */
export function globToRegex(glob) {
  let pattern = glob.trim();
  
  if (pattern.startsWith('/')) {
    pattern = pattern.slice(1);
  } else if (!pattern.includes('/')) {
    pattern = '**/' + pattern;
  }

  const isDirectoryPattern = pattern.endsWith('/');
  if (isDirectoryPattern) {
    pattern = pattern.slice(0, -1);
  }

  let regexStr = '';
  let i = 0;
  while (i < pattern.length) {
    const char = pattern[i];
    if (char === '*') {
      if (pattern[i + 1] === '*') {
        if (pattern[i + 2] === '/') {
          regexStr += '(?:[^/]+/)*';
          i += 3;
        } else {
          regexStr += '.*';
          i += 2;
        }
      } else {
        regexStr += '[^/]*';
        i += 1;
      }
    } else if (char === '?') {
      regexStr += '[^/]';
      i += 1;
    } else if ('\\^$.+|()[]{}/'.includes(char)) {
      regexStr += '\\' + char;
      i += 1;
    } else {
      regexStr += char;
      i += 1;
    }
  }

  if (isDirectoryPattern) {
    return new RegExp('^' + regexStr + '(?:/.*)?$');
  } else {
    return new RegExp('^' + regexStr + '$');
  }
}

/**
 * Parses a .caesarignore file, returning compiled regex patterns.
 */
export function parseCaesarIgnore(ignorePath) {
  if (!existsSync(ignorePath)) {
    return [];
  }
  try {
    const content = readFileSync(ignorePath, 'utf8');
    return content
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(line => line && !line.startsWith('#'))
      .map(pattern => ({
        raw: pattern,
        regex: globToRegex(pattern)
      }));
  } catch (err) {
    console.warn(`⚠️ Warning: Failed to parse .caesarignore at ${ignorePath}: ${err.message}`);
    return [];
  }
}

/**
 * Parses the JSON config file.
 */
export function parseConfig(configPath) {
  if (!configPath || !existsSync(configPath)) {
    return {};
  }
  try {
    const content = readFileSync(configPath, 'utf8');
    return JSON.parse(content);
  } catch (err) {
    console.warn(`⚠️ Warning: Failed to parse config JSON at ${configPath}: ${err.message}`);
    return {};
  }
}

/**
 * Checks if a path (or any of its ancestor directories) matches a compiled ignore pattern.
 */
export function isPathIgnored(relativePath, compiledPatterns) {
  const parts = relativePath.split('/');
  
  // Check every prefix path segment
  // E.g. for "src/ignored-folder/file.js":
  // 1. "src"
  // 2. "src/ignored-folder"
  // 3. "src/ignored-folder/file.js"
  for (let i = 1; i <= parts.length; i++) {
    const prefixPath = parts.slice(0, i).join('/');
    for (const pattern of compiledPatterns) {
      if (pattern.regex.test(prefixPath)) {
        return { matched: true, pattern: pattern.raw };
      }
    }
  }
  return { matched: false };
}

/**
 * Resolves the scan scope by traversing the target directory recursively,
 * categorizing all files into included, excluded, and skipped lists.
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
