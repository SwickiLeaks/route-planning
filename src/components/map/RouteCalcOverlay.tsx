import { useEffect } from 'react';
import { useMap } from 'react-map-gl/maplibre';
import type { RouteCalculation } from '@/calc/types';
import type { BuilderRoute } from '@/route/routeBuilderTypes';
import { useRouteBuilder } from '@/route/RouteBuilderContext';
import WaypointMarker from '@/components/map/WaypointMarker';

interface RouteCalcOverlayProps {
  route: BuilderRoute;
  calc: RouteCalculation;
  calculating?: boolean;
}

// Map overlay drawing an interactable marker at every waypoint.
const RouteCalcOverlay = ({ route, calc }: RouteCalcOverlayProps) => {
  const { selectedWaypointId, selectWaypoint, placing } = useRouteBuilder();
  const { current: map } = useMap();
  const lastIndex = route.waypoints.length - 1;

  const selected = route.waypoints.find((w) => w.id === selectedWaypointId);
  const selLng = selected?.position.lng;
  const selLat = selected?.position.lat;

  useEffect(() => {
    if (placing || !map || selLng == null || selLat == null) return;
    // essential: keep the pan animated even when the OS/browser requests
    // reduced motion (common on VMs), where it would otherwise jump instantly.
    map.easeTo({ center: [selLng, selLat], duration: 600, essential: true });
  }, [map, placing, selectedWaypointId, selLng, selLat]);

  return (
    <>
      {route.waypoints.map((waypoint, index) => (
        <WaypointMarker
          key={waypoint.id}
          waypoint={waypoint}
          index={index}
          isEndpoint={index === 0 || index === lastIndex}
          leg={calc.legs[index - 1]}
          selected={waypoint.id === selectedWaypointId}
          onSelect={() => selectWaypoint(waypoint.id)}
        />
      ))}
    </>
  );
};

export default RouteCalcOverlay;
