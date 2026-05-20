import { existsSync, readFileSync } from 'fs';
import { globToRegex } from '../scanner/path-matcher.mjs';

/**
 * Parses a .caesarignore file, returning compiled regex patterns.
 */
export function parseCaesarIgnore(ignorePath) {
  if (!ignorePath || !existsSync(ignorePath)) {
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
