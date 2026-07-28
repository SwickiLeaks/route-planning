import type { Route } from '@/types/proto';
import { bearingDeg, distanceNm, midpoint } from '@/map/geo';
import { DEFAULT_AIRCRAFT } from '@/calc/types';
import type {
  AircraftPerf,
  FuelState,
  LegCalc,
  RouteCalculation,
} from '@/calc/types';

/**
 * Stand-in for the backend route-calculation service.
 *
 * Produces believable, DETERMINISTIC results from a route's geometry and
 * altitudes — climb legs burn more, so fuel flow tracks altitude change. Swap
 * this one function for the gRPC call when the calc service is wired; the
 * RouteCalculation shape it returns is what the whole HUD depends on.
 */
export const calculateRoute = (
  route: Route,
  perf: AircraftPerf = DEFAULT_AIRCRAFT,
): RouteCalculation => {
  const legs: LegCalc[] = [];
  let cumulativeTimeMin = 0;
  let cumulativeFuelLb = 0;

  for (let i = 0; i < route.waypoints.length - 1; i += 1) {
    const from = route.waypoints[i];
    const to = route.waypoints[i + 1];

    const distNm = distanceNm(from.position, to.position);
    const groundSpeedKt = perf.cruiseKt;
    const legTimeHr = groundSpeedKt > 0 ? distNm / groundSpeedKt : 0;

    // Climbing burns more, descending a touch less — scale flow by altitude
    // delta per nautical mile so the numbers move with the route.
    const climbFt = (to.altitudeFt ?? 0) - (from.altitudeFt ?? 0);
    const climbFactor = 1 + Math.max(-0.15, Math.min(0.35, climbFt / 8000));
    const fuelFlowLbHr = Math.round(perf.cruiseFuelFlowLbHr * climbFactor);
    const legFuelLb = fuelFlowLbHr * legTimeHr;

    cumulativeTimeMin += legTimeHr * 60;
    cumulativeFuelLb += legFuelLb;

    legs.push({
      index: i,
      from,
      to,
      midpoint: midpoint(from.position, to.position),
      bearingDeg: bearingDeg(from.position, to.position),
      distanceNm: distNm,
      groundSpeedKt,
      legTimeMin: legTimeHr * 60,
      fuelFlowLbHr,
      legFuelLb,
      cumulativeTimeMin,
      cumulativeFuelLb,
      remainingFuelLb: perf.startFuelLb - cumulativeFuelLb,
    });
  }

  const distanceNmTotal = legs.reduce((sum, l) => sum + l.distanceNm, 0);
  const routeTimeMin = cumulativeTimeMin;
  const routeFuelLb = cumulativeFuelLb;
  const remainingFuelLb = perf.startFuelLb - routeFuelLb;
  const avgFuelFlowLbHr =
    routeTimeMin > 0 ? Math.round((routeFuelLb / routeTimeMin) * 60) : 0;

  const overReserve = remainingFuelLb - perf.reserveLb;
  const fuelState: FuelState =
    overReserve < 0 ? 'critical' : overReserve < perf.reserveLb ? 'caution' : 'ok';

  return {
    routeId: route.id,
    legs,
    totals: {
      distanceNm: distanceNmTotal,
      routeTimeMin,
      routeFuelLb,
      avgFuelFlowLbHr,
      startFuelLb: perf.startFuelLb,
      remainingFuelLb,
      reserveLb: perf.reserveLb,
      fuelState,
    },
  };
};
