/**
 * ZAYRO Dedicated Backend Server for Salon360 API
 * 
 * Built with pure Node.js (zero extra npm dependencies needed).
 * 
 * Features:
 *   - Securely stores Salon360 Client Key & Secret server-side
 *   - Injects the required 'x-api-key' header on every outgoing call
 *   - Handles CORS headers for frontend requests
 *   - Provides health check diagnostic at /health
 * 
 * Usage:
 *   node server.js
 *   or
 *   npm run server
 */

import http from 'node:http';
import https from 'node:https';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load .env if present
function loadEnv() {
  try {
    const envPath = path.join(__dirname, '.env');
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf8');
      for (const line of content.split('\n')) {
        const trimmed = line.trim();
        if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
          const [k, ...v] = trimmed.split('=');
          process.env[k.trim()] = v.join('=').trim();
        }
      }
    }
  } catch (err) {
    console.warn('[Env] Could not load .env file:', err.message);
  }
}
loadEnv();

const PORT = process.env.PORT || 5000;
const STORE_ID = 868;
const ORG_ID = 555;
const CLIENT_KEY = process.env.SALON360_CLIENT_KEY || '64afb73f-ec89-4d1f-b639-914960f34f47';
const CLIENT_SECRET = process.env.SALON360_CLIENT_SECRET || 'b3c52a47-845c-40af-bb43-37e52df12ce7';
const API_KEY = process.env.SALON360_API_KEY || `${CLIENT_KEY}:${CLIENT_SECRET}`;
const SALON360_HOST = 'api.salon360app.com';
const SALON360_BASE = '/api/online-booking/v1/booking';

const server = http.createServer(async (req, res) => {
  // CORS Headers
  const origin = req.headers.origin || '*';
  res.setHeader('Access-Control-Allow-Origin', origin);
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, x-api-key, Idempotency-Key');
  res.setHeader('Access-Control-Allow-Credentials', 'true');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);

  // Health check endpoint
  if (url.pathname === '/health' || url.pathname === '/api/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'UP',
      service: 'zayro-salon360-backend',
      storeId: STORE_ID,
      orgId: ORG_ID,
      clientKeyConfigured: Boolean(CLIENT_KEY),
      timestamp: new Date().toISOString(),
    }));
    return;
  }

  // Route: /salon360-api/* or /api/salon360/*
  const isSalon360Route = url.pathname.startsWith('/salon360-api') || url.pathname.startsWith('/api/salon360');
  if (isSalon360Route) {
    let subPath = url.pathname.replace(/^\/salon360-api/, '').replace(/^\/api\/salon360/, '') || '';
    if (!subPath.startsWith('/')) subPath = `/${subPath}`;
    const targetPath = `${SALON360_BASE}${subPath}${url.search}`;

    let bodyData = '';
    req.on('data', chunk => { bodyData += chunk; });
    req.on('end', () => {
      const headers = {
        'x-api-key': API_KEY,
        'Accept': 'application/json',
      };

      if (req.headers['idempotency-key']) {
        headers['Idempotency-Key'] = req.headers['idempotency-key'];
      }

      if (req.method === 'POST' || req.method === 'PUT') {
        headers['Content-Type'] = 'application/json';
        headers['Content-Length'] = Buffer.byteLength(bodyData);
      }

      console.log(`[Proxy] ${req.method} ${targetPath}`);

      const proxyReq = https.request({
        hostname: SALON360_HOST,
        path: targetPath,
        method: req.method,
        headers,
        timeout: 15000,
      }, (upstreamRes) => {
        res.writeHead(upstreamRes.statusCode, {
          'Content-Type': 'application/json',
          'Cache-Control': 'no-store',
        });
        upstreamRes.pipe(res);
      });

      proxyReq.on('error', (err) => {
        console.error('[Proxy Error]:', err.message);
        res.writeHead(502, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          responseCode: 502,
          responseMsg: 'GATEWAY_ERROR',
          dynMsg: `Failed to connect to Salon360 server: ${err.message}`,
          response: null,
        }));
      });

      proxyReq.on('timeout', () => {
        proxyReq.destroy();
        console.error('[Proxy Timeout]: Salon360 timed out after 15s');
        res.writeHead(504, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          responseCode: 504,
          responseMsg: 'GATEWAY_TIMEOUT',
          dynMsg: 'Salon360 server timed out after 15s',
          response: null,
        }));
      });

      if (bodyData) {
        proxyReq.write(bodyData);
      }
      proxyReq.end();
    });
    return;
  }

  // Fallback 404 for unknown routes
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found', path: url.pathname }));
});

server.listen(PORT, () => {
  console.log(`\n======================================================`);
  console.log(`  ZAYRO Salon360 Backend Proxy running on port ${PORT}`);
  console.log(`  - Health Check:  http://localhost:${PORT}/health`);
  console.log(`  - Salon360 Base: https://${SALON360_HOST}${SALON360_BASE}`);
  console.log(`  - Store: ${STORE_ID} | Org: ${ORG_ID}`);
  console.log(`  - Client Key: ${CLIENT_KEY.slice(0, 8)}...`);
  console.log(`======================================================\n`);
});

