/**
 * Vercel Serverless Function Proxy for Salon360 Online Booking API
 * 
 * Securely forwards browser requests from zayroclub.com to
 * https://api.salon360app.com/api/online-booking/v1/external/booking
 * while injecting the x-api-key server-side.
 */

import https from 'node:https';

const SALON360_HOST = 'api.salon360app.com';
const SALON360_BASE = '/api/online-booking/v1/external/booking';

// Store 868 / Org 555 API Key
const CLIENT_KEY = process.env.SALON360_CLIENT_KEY || '64afb73f-ec89-4d1f-b639-914960f34f47';
const CLIENT_SECRET = process.env.SALON360_CLIENT_SECRET || 'b3c52a47-845c-40af-bb43-37e52df12ce7';
const API_KEY = process.env.SALON360_API_KEY || `${CLIENT_KEY}:${CLIENT_SECRET}`;

export default async function handler(req, res) {
  // Extract subpath (e.g. /config?storeId=868&orgId=555 or /availability)
  const url = new URL(req.url, `https://${req.headers.host || 'localhost'}`);
  let subPath = url.pathname.replace(/^\/api\/salon360/, '').replace(/^\/salon360-api/, '') || '';
  if (!subPath.startsWith('/')) subPath = `/${subPath}`;
  const fullPath = `${SALON360_BASE}${subPath}${url.search}`;

  const headers = {
    'x-api-key': API_KEY,
    'Accept': 'application/json',
  };

  if (req.headers['idempotency-key']) {
    headers['Idempotency-Key'] = req.headers['idempotency-key'];
  }

  let requestBody = null;
  if (req.method === 'POST' || req.method === 'PUT') {
    headers['Content-Type'] = 'application/json';
    requestBody = typeof req.body === 'string' ? req.body : JSON.stringify(req.body || {});
    headers['Content-Length'] = Buffer.byteLength(requestBody);
  }

  return new Promise((resolve) => {
    const upstreamReq = https.request({
      hostname: SALON360_HOST,
      path: fullPath,
      method: req.method,
      headers,
      timeout: 15000,
    }, (upstreamRes) => {
      let data = '';
      upstreamRes.on('data', chunk => { data += chunk; });
      upstreamRes.on('end', () => {
        res.status(upstreamRes.statusCode);
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Cache-Control', 'no-store');
        res.send(data);
        resolve();
      });
    });

    upstreamReq.on('error', (err) => {
      res.status(502).json({
        responseCode: 502,
        responseMsg: 'GATEWAY_ERROR',
        dynMsg: `Failed to connect to Salon360: ${err.message}`,
        response: null,
      });
      resolve();
    });

    upstreamReq.on('timeout', () => {
      upstreamReq.destroy();
      res.status(504).json({
        responseCode: 504,
        responseMsg: 'GATEWAY_TIMEOUT',
        dynMsg: 'Salon360 server timed out after 15 seconds',
        response: null,
      });
      resolve();
    });

    if (requestBody) {
      upstreamReq.write(requestBody);
    }
    upstreamReq.end();
  });
}

