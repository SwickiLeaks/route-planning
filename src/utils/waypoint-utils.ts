import type { Waypoint } from "@/types/proto";
import { useRouteStore } from "../stores/route-store";

export function getWaywpoint(waypointId: string): Waypoint | null {
  const { availableWaypoints } = useRouteStore.getState();
  const foundWaypoint: Waypoint | undefined = availableWaypoints.find(
    (waypoint: Waypoint) =>
      waypoint.id.toLowerCase() === waypointId.toLocaleLowerCase(),
  );
  if (foundWaypoint) {
    return foundWaypoint;
  } else {
    return null;
  }
}
