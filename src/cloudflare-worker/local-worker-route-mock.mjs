import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { WORKER_ROUTES, resolveProjectionPath } from './cloudflare-worker-boundary.mjs';

export async function createLocalWorkerRouteMock(projectionDir, port = 4318) {
  const routeMap = new Map(WORKER_ROUTES.map((route) => [route.path, route]));

  const server = http.createServer(async (req, res) => {
    if (req.method === 'OPTIONS') {
      res.writeHead(204, {
        'Access-Control-Allow-Origin': 'REPLACE_ME',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      res.end();
      return;
    }

    if (req.method !== 'GET') {
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
      return;
    }

    const route = routeMap.get(req.url?.split('?')[0] || '/');
    if (!route) {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Route not found' }));
      return;
    }

    const filePath = resolveProjectionPath(projectionDir, route);
    try {
      const data = await fs.readFile(filePath, 'utf8');
      res.writeHead(200, {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': 'REPLACE_ME'
      });
      res.end(data);
    } catch (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Projection file not found' }));
      } else {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    }
  });

  return new Promise((resolvePromise) => {
    server.listen(port, '127.0.0.1', () => {
      console.log(`Worker route mock listening at http://127.0.0.1:${port}/ (local only, not deployed)`);
      resolvePromise(server);
    });
  });
}

export async function buildWorkerRouteManifest(projectionDir) {
  const entries = [];
  for (const route of WORKER_ROUTES) {
    const filePath = resolveProjectionPath(projectionDir, route);
    let exists = false;
    try {
      await fs.access(filePath);
      exists = true;
    } catch {
      exists = false;
    }
    entries.push({
      method: route.method,
      path: route.path,
      projection_file: route.projectionFile,
      projection_exists: exists
    });
  }
  return {
    schema_version: '0.19.0',
    manifest_type: 'caesar-ai-scan-cloudflare-worker-route-mock',
    generated_at: '2026-05-21T12:00:00.000Z',
    projection_dir: 'tmp/sample-api-projection',
    routes: entries,
    safety: {
      local_mock_only: true,
      no_worker_deployment: true,
      no_external_fetching: true
    }
  };
}
