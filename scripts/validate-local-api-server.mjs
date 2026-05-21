import http from 'node:http';
import { createLocalApiServer } from '../src/local-api/local-read-only-api-server.mjs';
import path from 'node:path';
import { resolve } from 'node:path';

async function validate() {
  const projectionDir = resolve('tmp/sample-api-projection');
  const port = 4317;
  const server = await createLocalApiServer(projectionDir, port);

  const endpoints = ['/health', '/dashboard-summary', '/manifest'];
  for (const endpoint of endpoints) {
    const response = await new Promise((resolve) => {
      http.get(`http://127.0.0.1:${port}${endpoint}`, (res) => {
        let data = '';
        res.on('data', (chunk) => { data += chunk; });
        res.on('end', () => { resolve({ status: res.statusCode, data }); });
      });
    });

    if (response.status !== 200) {
      console.error(`❌ Validation failed for ${endpoint}: status ${response.status}`);
      process.exit(1);
    }
  }

  console.log('✅ Local API server validation PASSED.');
  server.close();
  process.exit(0);
}

validate().catch(console.error);
