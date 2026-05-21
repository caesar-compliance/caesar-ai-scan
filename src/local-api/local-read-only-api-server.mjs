import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { resolve } from 'node:path';

export async function createLocalApiServer(projectionDir, port = 4316) {
  const server = http.createServer(async (req, res) => {
    if (req.method !== 'GET') {
      res.writeHead(405);
      res.end('Method Not Allowed');
      return;
    }

    const url = new URL(req.url, `http://${req.headers.host}`);
    const endpoint = url.pathname === '/' ? '/health.json' : `${url.pathname}.json`;
    const filePath = path.join(projectionDir, endpoint);

    try {
      const data = await fs.readFile(filePath, 'utf8');
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(data);
    } catch (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404);
        res.end(JSON.stringify({ error: 'Endpoint not found' }));
      } else {
        res.writeHead(500);
        res.end(JSON.stringify({ error: 'Internal server error' }));
      }
    }
  });

  return new Promise((resolve) => {
    server.listen(port, '127.0.0.1', () => {
      console.log(`🚀 Local API Server running at http://127.0.0.1:${port}/`);
      resolve(server);
    });
  });
}
