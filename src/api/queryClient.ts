import { QueryClient } from '@tanstack/react-query';

/** Shared TanStack Query client. Tune defaults here as the app's needs firm up. */
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      // gRPC data is rarely stale-on-arrival for a planning tool; avoid noisy
      // refetches until we know the real freshness requirements.
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 30_000,
    },
  },
});
