import type { Route, Waypoint } from '@/types/proto';

export type WaypointActionType = 'hover';

export interface ActionParams {
  durationSec?: number;
  altitudeFt?: number;
  radiusNm?: number;
}

export interface WaypointAction {
  id: string;
  type: WaypointActionType;
  params?: ActionParams;
}

export interface BuilderWaypoint extends Waypoint {
  actions?: WaypointAction[];
  /** Backend-assigned RoutePoint GUID, set once synced to MsnSvr. */
  serverId?: string;
  /** Planned airspeed in knots, read from the service on creation. */
  speedKts?: number;
}

export interface BuilderRoute extends Route {
  waypoints: BuilderWaypoint[];
}
