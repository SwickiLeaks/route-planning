import react from '@vitejs/plugin-react';
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
  server: {
    port: 3000,
    open: true,
    proxy: {
      // Browser gRPC-Web calls hit same-origin /api and get forwarded to the
      // backend on :5000, stripping the /api prefix. Avoids CORS in dev; in
      // other environments set VITE_API_BASE_URL to the real gateway instead.
      '/api': {
        target: 'https://localhost:7082',
        secure: false,
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
