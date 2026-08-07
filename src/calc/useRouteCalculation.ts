import { useEffect, useRef, useState } from "react";
import type { Route } from "@/types/proto";
import { calculateRoute } from "@/calc/fakeCalculator";
import type { RouteCalculation } from "@/calc/types";

const CALC_DELAY_MS = 700;

export type CalcStatus = "idle" | "calculating" | "complete";

export interface RouteCalcState {
  data: RouteCalculation | null;
  isCalculating: boolean;
  status: CalcStatus;
}

// Route calculation with a simulated async lifecycle.
export const useRouteCalculation = (
  route: Route | null | undefined,
): RouteCalcState => {
  const [state, setState] = useState<RouteCalcState>(() => ({
    data: route ? calculateRoute(route) : null,
    isCalculating: false,
    status: route ? "complete" : "idle",
  }));

  const completedRoute = useRef<Route | null | undefined>(route);

  useEffect(() => {
    if (!route) {
      completedRoute.current = null;
      setState({ data: null, isCalculating: false, status: "idle" });
      return;
    }
    if (completedRoute.current === route) return;

    setState((prev) => ({
      ...prev,
      isCalculating: true,
      status: "calculating",
    }));

    const timer = setTimeout(() => {
      completedRoute.current = route;
      setState({
        data: calculateRoute(route),
        isCalculating: false,
        status: "complete",
      });
    }, CALC_DELAY_MS);

    return () => clearTimeout(timer);
  }, [route]);

  return state;
};
