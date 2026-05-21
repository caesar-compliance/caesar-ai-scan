import { createLocalApiServer } from '../src/local-api/local-read-only-api-server.mjs';
import path from 'node:path';
import { resolve } from 'node:path';

const projectionDir = resolve(process.argv[2] || 'tmp/sample-api-projection');
createLocalApiServer(projectionDir).catch(console.error);
