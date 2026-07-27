import { createGrpcWebTransport } from '@connectrpc/connect-web';

/**
 * gRPC-Web transport to the backend.
 *
 * In dev the base URL defaults to `/api`, which Vite proxies to the gRPC-Web
 * server on :5000 (see vite.config.ts) — this sidesteps browser CORS. For other
 * environments set VITE_API_BASE_URL to the real gateway origin.
 */
const baseUrl = import.meta.env.VITE_API_BASE_URL ?? '/api';

export const transport = createGrpcWebTransport({ baseUrl });
