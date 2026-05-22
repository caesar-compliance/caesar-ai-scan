import fs from 'fs';
import path from 'path';

// Mock generation logic for local JSON store
const storePath = 'tmp/local-json-store.json';
const data = {
  version: "1.0.0",
  entries: []
};

fs.writeFileSync(storePath, JSON.stringify(data, null, 2));
console.log('Local JSON store sample generated.');
