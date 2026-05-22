import fs from 'fs';
import path from 'path';

// Mock validation logic for local JSON store
const storePath = 'tmp/local-json-store.json';

if (!fs.existsSync(storePath)) {
  console.log('Skipping validation: store sample not found.');
  process.exit(0);
}

try {
  const store = JSON.parse(fs.readFileSync(storePath, 'utf-8'));
  if (Array.isArray(store) || typeof store === 'object') {
    console.log('Local JSON store validation passed.');
    process.exit(0);
  }
} catch (e) {
  console.error('Local JSON store validation failed:', e);
  process.exit(1);
}
