import { readFileSync } from 'fs';

/**
 * Safely reads and parses a JSON file from disk.
 * Returns null if the file does not exist, is not readable, or contains invalid JSON.
 *
 * @param {string} filePath - Absolute or relative path to the JSON file.
 * @param {*} [fallback=null] - Value to return if reading/parsing fails.
 * @returns {*|null} The parsed JSON object or fallback.
 */
export function readJsonSafe(filePath, fallback = null) {
  try {
    const content = readFileSync(filePath, 'utf8');
    return JSON.parse(content);
  } catch (error) {
    // Fail-safe: return the fallback without crashing the pipeline
    return fallback;
  }
}
