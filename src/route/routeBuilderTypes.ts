import type { Route, Waypoint } from '@/types/proto';

/**
 * The set of actions that can occur at a route point (the service's Event
 * Collection). Only Hover for now; adding a new one is a matter of extending
 * this union and adding a catalog entry in actionCatalog.ts — every UI that
 * lists actions follows.
 */
export type WaypointActionType = 'hover';

/** An action instance placed on a waypoint. */
export interface WaypointAction {
  id: string;
  type: WaypointActionType;
  /** Per-action parameters, filled in as action editors are built. */
  params?: {
    durationSec?: number;
    radiusNm?: number;
  };
}

/** The proto Waypoint plus editor-only actions. Assignable to Waypoint. */
export interface BuilderWaypoint extends Waypoint {
  actions?: WaypointAction[];
}

/** The editable route being built. Its waypoints carry actions. */
export interface BuilderRoute extends Route {
  waypoints: BuilderWaypoint[];
}
