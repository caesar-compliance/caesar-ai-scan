import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readJsonSafe } from '../utils/read-json-safe.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Dynamic relative resolution to root rules file
const DEFAULT_RULES_PATH = join(__dirname, '../../data/detection-rules.ai-usage.json');

/**
 * Loads and returns the structured catalog of AI usage rules.
 *
 * @param {string} [customPath] - Optional override path to the rules JSON file.
 * @returns {Object} Structured rules containing dependencies, env_vars, and prompt_files.
 */
export function loadRules(customPath) {
  const rulesPath = customPath || DEFAULT_RULES_PATH;
  const rules = readJsonSafe(rulesPath);
  
  if (!rules) {
    throw new Error(`Critical Error: Could not load detection rules from path: ${rulesPath}`);
  }

  // Ensure default structure exists even if file parsing has missing keys
  return {
    dependencies: rules.dependencies || [],
    env_vars: rules.env_vars || [],
    prompt_files: rules.prompt_files || []
  };
}
