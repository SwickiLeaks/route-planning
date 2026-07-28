import type { LatLng, Waypoint } from '@/types/proto';

export type FuelState = 'ok' | 'caution' | 'critical';

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
  cumulativeTimeMin: number;
  cumulativeFuelLb: number;
  remainingFuelLb: number;
}

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

export interface RouteCalculation {
  routeId: string;
  legs: LegCalc[];
  totals: RouteTotals;
}

export interface AircraftPerf {
  cruiseKt: number;
  cruiseFuelFlowLbHr: number;
  fuelCapacityLb: number;
  startFuelLb: number;
  reserveLb: number;
}

export const DEFAULT_AIRCRAFT: AircraftPerf = {
  cruiseKt: 120,
  cruiseFuelFlowLbHr: 1250,
  fuelCapacityLb: 2360,
  startFuelLb: 2360,
  reserveLb: 300,
};
