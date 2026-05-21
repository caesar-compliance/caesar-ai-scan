import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const inventoryPath = resolve('tmp/sample-ai-usage-inventory.json');
const inventory = JSON.parse(readFileSync(inventoryPath, 'utf8'));

console.log('🚀 Validating AI Usage Inventory...');

// 1. Validate Structure
const requiredFields = ['schema_version', 'generated_at', 'tool_name', 'tool_version', 'inventory'];
requiredFields.forEach(field => {
  if (!inventory[field]) throw new Error(`Missing required field: ${field}`);
});

// 2. Validate Categories
const categories = ['provider_sdks', 'orchestration_frameworks', 'rag_vector_stack', 'model_artifacts', 'prompt_assets', 'config_signals'];
categories.forEach(cat => {
  if (!Array.isArray(inventory.inventory[cat])) throw new Error(`Category ${cat} is not an array`);
});

// 3. Verify counts (minimum coverage)
const minCoverage = {
  provider_sdks: 3,
  orchestration_frameworks: 4,
  rag_vector_stack: 5,
  prompt_assets: 2,
  model_artifacts: 3,
  config_signals: 4
};

Object.entries(minCoverage).forEach(([cat, min]) => {
  const count = inventory.inventory[cat].length;
  if (count < min) throw new Error(`Insufficient findings for ${cat}: expected at least ${min}, found ${count}`);
  console.log(`✅ ${cat}: ${count} findings (>= ${min})`);
});

// 4. Verify draft status
if (inventory.export_status !== 'draft') throw new Error('Inventory must be in draft status');
if (inventory.review_required !== true) throw new Error('Inventory must require review');

console.log('✅ All inventory validation assertions PASSED successfully.');
