import type { ReactNode } from 'react';
import { QueryClientProvider } from '@tanstack/react-query';
import { TransportProvider } from '@connectrpc/connect-query';
import { queryClient } from '@/api/queryClient';
import { transport } from '@/api/transport';

/**
 * Wires both providers the connect-query hooks depend on: TanStack Query's
 * cache and connect-query's gRPC-Web transport. Wrap the app once with this.
 */
const ApiProvider = ({ children }: { children: ReactNode }) => (
  <TransportProvider transport={transport}>
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  </TransportProvider>
);

export default ApiProvider;
