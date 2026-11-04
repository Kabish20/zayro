import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // Load server-only env vars (without VITE_ prefix) for the proxy
  const env = loadEnv(mode, process.cwd(), '');

  const salon360ApiBase = env.SALON360_API_BASE ||
    'https://api.salon360app.com/api/online-booking/v1/external/booking';
  const salon360ApiKey  = env.SALON360_API_KEY  || '';

  return {
    plugins: [react()],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    build: {
      sourcemap: false, // Prevent exposure of source code & internal structures in production
      chunkSizeWarningLimit: 1000,
      rollupOptions: {
        input: {
          main: path.resolve(__dirname, 'index.html'),
          kknagarinvite: path.resolve(__dirname, 'kknagarinvite/index.html'),
        },
      },
    },
    server: {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), payment=()',
      },
      proxy: {
        /**
         * Salon360 API Proxy (development only)
         * ------------------------------------------------------------------
         * Any request to /salon360-api/... is:
         *   1. Rewritten to strip the /salon360-api prefix
         *   2. Forwarded to the real Salon360 API base URL
         *   3. The x-api-key header is injected HERE (server-side)
         *      so the secret is NEVER sent to the browser
         *
         * Example:
         *   Browser → GET /salon360-api/config?storeId=868&orgId=555
         *   Proxy   → GET https://api.salon360app.com/.../config?storeId=868&orgId=555
         *             with x-api-key: <secret>
         */
        '/salon360-api': {
          target:      salon360ApiBase,
          changeOrigin: true,
          rewrite:      (p) => p.replace(/^\/salon360-api/, ''),
          configure: (proxy) => {
            proxy.on('proxyReq', (proxyReq) => {
              if (salon360ApiKey) {
                proxyReq.setHeader('x-api-key', salon360ApiKey);
              }
            });
          },
        },
      },
    },
    preview: {
      headers: {
        'X-Content-Type-Options': 'nosniff',
        'X-Frame-Options': 'SAMEORIGIN',
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'strict-origin-when-cross-origin',
        'Permissions-Policy': 'camera=(), microphone=(), geolocation=(self), payment=()',
      },
    },
  };
});
