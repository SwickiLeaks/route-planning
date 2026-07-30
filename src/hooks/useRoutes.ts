import { useEffect, useState } from 'react';
import type { Route } from '@/types/proto';
import { fetchRoutes } from '@/api/client';

/**
 * Kept dependency-free until the data-fetching library is chosen. When React
 * Query lands this becomes a `useQuery` call against the same `fetchRoutes`,
 * and the returned shape stays compatible.
 */
export const useRoutes = () => {
  const [data, setData] = useState<Route[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    let active = true;

    fetchRoutes()
      .then((routes) => active && setData(routes))
      .catch((err) => active && setError(err as Error))
      .finally(() => active && setLoading(false));

    return () => {
      active = false;
    };
  }, []);

  return { data, loading, error };
};
