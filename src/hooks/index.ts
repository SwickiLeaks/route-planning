/**
 * Data hooks barrel.
 *
 * Placeholder for now. Once your proto interfaces exist in `@/types/proto`,
 * add one hook per service call here (or split into per-service files and
 * re-export from this barrel).
 *
 * A typical hook, kept dependency-free until you pick a data-fetching library:
 *
 *   import { useEffect, useState } from 'react';
 *   import type { Route } from '@/types/proto';
 *   import { fetchRoutes } from '@/api/client';
 *
 *   export const useRoutes = () => {
 *     const [data, setData] = useState<Route[]>([]);
 *     const [loading, setLoading] = useState(true);
 *     const [error, setError] = useState<Error | null>(null);
 *
 *     useEffect(() => {
 *       let active = true;
 *       fetchRoutes()
 *         .then((routes) => active && setData(routes))
 *         .catch((err) => active && setError(err as Error))
 *         .finally(() => active && setLoading(false));
 *       return () => {
 *         active = false;
 *       };
 *     }, []);
 *
 *     return { data, loading, error };
 *   };
 */

export {};
