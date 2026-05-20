import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { readJsonSafe } from '../utils/read-json-safe.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const TAXONOMY_PATH = join(__dirname, '../../data/review-taxonomy.ai-governance.json');
const REQUIREMENTS_PATH = join(__dirname, '../../data/evidence-requirements.ai-usage.json');

/**
 * Loads the review taxonomy from data/review-taxonomy.ai-governance.json.
 * @returns {Object} Taxonomy configurations for review lanes and statuses.
 */
export function loadReviewTaxonomy() {
  const taxonomy = readJsonSafe(TAXONOMY_PATH);
  if (!taxonomy) {
    throw new Error(`Critical Error: Could not load review taxonomy from path: ${TAXONOMY_PATH}`);
  }
  return taxonomy;
}

/**
 * Loads the evidence requirements from data/evidence-requirements.ai-usage.json.
 * @returns {Object} Gap type definitions and severity mapping.
 */
export function loadEvidenceRequirements() {
  const requirements = readJsonSafe(REQUIREMENTS_PATH);
  if (!requirements) {
    throw new Error(`Critical Error: Could not load evidence requirements from path: ${REQUIREMENTS_PATH}`);
  }
  return requirements;
}
