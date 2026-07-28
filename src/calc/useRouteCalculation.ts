import { useEffect, useRef, useState } from 'react';
import type { Route } from '@/types/proto';
import { calculateRoute } from '@/calc/fakeCalculator';
import type { RouteCalculation } from '@/calc/types';

/** Simulated service round-trip on each edit. Stands in for polling the real
 *  calc service until it reports CalculationComplete. */
const CALC_DELAY_MS = 700;

export type CalcStatus = 'idle' | 'calculating' | 'complete';

export interface RouteCalcState {
  /** Last completed result; kept visible while a new calc is in flight. */
  data: RouteCalculation | null;
  isCalculating: boolean;
  status: CalcStatus;
}

/**
 * Route calculation with a simulated async lifecycle.
 *
 * Any route edit flips it to `calculating` for a beat, then resolves to the new
 * result — mirroring the future flow of firing the calc service and polling
 * until it returns CalculationComplete. The previous result stays available
 * during the wait so the HUD shows stale values under a loading treatment
 * rather than blanking. Swap the timeout for the real poll later; the returned
 * shape stays the same.
 */
export const useRouteCalculation = (
  route: Route | null | undefined,
): RouteCalcState => {
  const [state, setState] = useState<RouteCalcState>(() => ({
    data: route ? calculateRoute(route) : null,
    isCalculating: false,
    status: route ? 'complete' : 'idle',
  }));

  // The route we already have a completed result for — guards against showing a
  // loading flash on mount (and on StrictMode's double-invoked effects).
  const completedRoute = useRef<Route | null | undefined>(route);

  useEffect(() => {
    if (!route) {
      completedRoute.current = null;
      setState({ data: null, isCalculating: false, status: 'idle' });
      return;
    }
    if (completedRoute.current === route) return;

    setState((prev) => ({ ...prev, isCalculating: true, status: 'calculating' }));

    const timer = setTimeout(() => {
      completedRoute.current = route;
      setState({ data: calculateRoute(route), isCalculating: false, status: 'complete' });
    }, CALC_DELAY_MS);

    return () => clearTimeout(timer);
  }, [route]);

  return state;
};
