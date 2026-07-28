import type { LatLng, Waypoint } from '@/types/proto';

/** Fuel state buckets drive the HUD's color language (ok → caution → critical). */
export type FuelState = 'ok' | 'caution' | 'critical';

/** Per-leg calculation results (waypoint → waypoint). */
export interface LegCalc {
  index: number;
  from: Waypoint;
  to: Waypoint;
  midpoint: LatLng;
  bearingDeg: number;
  distanceNm: number;
  groundSpeedKt: number;
  legTimeMin: number;
  fuelFlowLbHr: number;
  legFuelLb: number;
  /** Cumulative totals at the END of this leg. */
  cumulativeTimeMin: number;
  cumulativeFuelLb: number;
  /** Fuel remaining on board on arrival at `to`. */
  remainingFuelLb: number;
}

/** Whole-route totals. */
export interface RouteTotals {
  distanceNm: number;
  routeTimeMin: number;
  routeFuelLb: number;
  avgFuelFlowLbHr: number;
  startFuelLb: number;
  remainingFuelLb: number;
  reserveLb: number;
  fuelState: FuelState;
}

/**
 * The full calculation result for a route. This is the shape the fake
 * calculator produces now and the shape the gRPC calc service will fill later —
 * the UI depends only on this.
 */
export interface RouteCalculation {
  routeId: string;
  legs: LegCalc[];
  totals: RouteTotals;
}

/** Aircraft performance inputs for the (fake) calculation. */
export interface AircraftPerf {
  cruiseKt: number;
  /** Baseline cruise fuel flow. */
  cruiseFuelFlowLbHr: number;
  fuelCapacityLb: number;
  startFuelLb: number;
  /** Minimum fuel to keep in reserve. */
  reserveLb: number;
}

/** UH-60-ish defaults, believable for a turbine tour helicopter. */
export const DEFAULT_AIRCRAFT: AircraftPerf = {
  cruiseKt: 120,
  cruiseFuelFlowLbHr: 1250,
  fuelCapacityLb: 2360,
  startFuelLb: 2360,
  reserveLb: 300,
};
