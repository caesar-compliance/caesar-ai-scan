import { readdirSync, statSync } from 'fs';
import { join, relative, resolve } from 'path';

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

/**
 * Recursively walks a target directory and lists all non-ignored files.
 *
 * @param {string} targetDir - The path of the directory to scan.
 * @returns {Array<Object>} List of traversed files, each with fullPath, relativePath, and name.
 */
export function walkFiles(targetDir) {
  const resolvedTarget = resolve(targetDir);
  const filesList = [];

  function traverse(currentDir) {
    let entries = [];
    try {
      entries = readdirSync(currentDir);
    } catch (err) {
      // Return empty if directory is unreadable
      return;
    }

    for (const entry of entries) {
      if (STANDARD_IGNORES.has(entry)) {
        continue;
      }

      const fullPath = join(currentDir, entry);
      let stat;
      try {
        stat = statSync(fullPath);
      } catch (err) {
        continue;
      }

      if (stat.isDirectory()) {
        traverse(fullPath);
      } else if (stat.isFile()) {
        const relativePath = relative(resolvedTarget, fullPath);
        filesList.push({
          fullPath,
          relativePath,
          name: entry
        });
      }
    }
  }

  traverse(resolvedTarget);
  return filesList;
}
